import "dotenv/config";
import { createHash, randomBytes, createHmac, timingSafeEqual } from "node:crypto";
import path from "node:path";
import bcrypt from "bcryptjs";
import cors from "cors";
import type { CorsOptions } from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import type { SignOptions } from "jsonwebtoken";
import multer from "multer";
import nodemailer from "nodemailer";
import Razorpay from "razorpay";
import { z } from "zod";
import { createOTPProvider, generateOTP } from "./providers/otp.js";
import { loadMediaConfiguration } from "./media/config.js";
import { createMediaStorage, MediaStorageError, type StoredMedia } from "./media/storage.js";
import { countReferences, persistMediaUpload, replaceMediaAsset } from "./media/lifecycle.js";
import { MAX_MEDIA_FILE_BYTES, MAX_MEDIA_FILES, MAX_MEDIA_REQUEST_BYTES, MediaValidationError, validateImageBatch, validateImageFile } from "./media/validation.js";
import { mongo, Role, OrderStatus, InventoryAction, EnquiryStatus, PaymentStatus, PaymentProvider, ShipmentStatus, type MediaRow, type ProductRow } from "./mongodb/database.js";

const optionalString = z.preprocess(value=>value===""?undefined:value,z.string().optional());
const optionalEmail = z.preprocess(value=>value===""?undefined:value,z.string().email().optional());
const environmentSchema = z.object({
  NODE_ENV:z.enum(["development","test","production"]).default("development"),
  MONGODB_URI:z.string().min(1).default("mongodb://127.0.0.1:27017"),
  MONGODB_DB_NAME:z.string().min(1).default("autoforge"),
  JWT_SECRET:z.string({required_error:"JWT_SECRET is required"}).min(32,"JWT_SECRET must contain at least 32 characters"),
  CORS_ORIGIN:z.string().default(""),
  PORT:z.coerce.number().int().min(1).max(65535).default(4000),
  UPLOAD_DIR:z.string().min(1).default("backend/uploads"),
  MEDIA_STORAGE_DRIVER:z.enum(["local","cloudinary"]).optional(),
  AUTH_COOKIE_NAME:z.string().min(1).default("autoforge_refresh"),
  AUTH_COOKIE_SAMESITE:z.enum(["lax","strict","none"]).optional(),
  AUTH_COOKIE_SECURE:z.enum(["true","false"]).optional(),
  AUTH_COOKIE_DOMAIN:optionalString,
  ACCESS_TOKEN_TTL:z.string().min(1).default("15m"),
  REFRESH_TOKEN_DAYS:z.coerce.number().positive().default(7),
  REMEMBER_ME_REFRESH_TOKEN_DAYS:z.coerce.number().positive().default(30),
  SMTP_HOST:optionalString, SMTP_PORT:z.coerce.number().default(587), SMTP_USER:optionalString, SMTP_PASS:optionalString,
  MAIL_FROM:optionalEmail, RAZORPAY_KEY_ID:optionalString, RAZORPAY_KEY_SECRET:optionalString, GSTIN:optionalString,
}).superRefine((value,ctx)=>{
  if(value.NODE_ENV==="production" && /(?:localhost|127\.0\.0\.1|replicaSet=rs0)/i.test(value.MONGODB_URI)) ctx.addIssue({code:z.ZodIssueCode.custom,path:["MONGODB_URI"],message:"must point to a hosted production MongoDB deployment"});
  if(value.NODE_ENV==="production" && process.env.MONGODB_TRANSACTIONS!=="true") ctx.addIssue({code:z.ZodIssueCode.custom,path:["MONGODB_TRANSACTIONS"],message:"must be true in production to protect checkout and token rotation"});
  if(value.NODE_ENV==="production" && /localhost|127\.0\.0\.1/.test(value.CORS_ORIGIN)) ctx.addIssue({code:z.ZodIssueCode.custom,path:["CORS_ORIGIN"],message:"cannot contain local origins in production"});
  if(value.NODE_ENV==="production" && value.AUTH_COOKIE_SECURE==="false") ctx.addIssue({code:z.ZodIssueCode.custom,path:["AUTH_COOKIE_SECURE"],message:"cannot be false in production"});
  if((value.RAZORPAY_KEY_ID && !value.RAZORPAY_KEY_SECRET)||(!value.RAZORPAY_KEY_ID && value.RAZORPAY_KEY_SECRET)) ctx.addIssue({code:z.ZodIssueCode.custom,path:["RAZORPAY_KEY_ID"],message:"and RAZORPAY_KEY_SECRET must be configured together"});
  if(value.SMTP_HOST && (!value.SMTP_USER||!value.SMTP_PASS||!value.MAIL_FROM)) ctx.addIssue({code:z.ZodIssueCode.custom,path:["SMTP_HOST"],message:"requires SMTP_USER, SMTP_PASS, and MAIL_FROM"});
});
const environmentResult=environmentSchema.safeParse(process.env);
if(!environmentResult.success){
  const details=environmentResult.error.issues.map(issue=>`${issue.path.join(".")||"environment"}: ${issue.message}`).join("; ");
  throw new Error(`Invalid backend configuration: ${details}. Copy .env.example to .env and update the required values.`);
}
const env=environmentResult.data;

// Initialize Razorpay
const razorpay = env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET 
  ? new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET }) 
  : undefined;
export const app = express();
const mediaConfiguration = loadMediaConfiguration(process.env);
const mediaStorage = createMediaStorage({
  driver: mediaConfiguration.driver,
  uploadDir: env.UPLOAD_DIR,
  cloudinary: mediaConfiguration.cloudinary,
});
const localMediaStorage = mediaStorage.driver === "local" ? mediaStorage : createMediaStorage({ driver: "local", uploadDir: env.UPLOAD_DIR });
const upload = multer({ storage:multer.memoryStorage(), limits:{ fileSize:MAX_MEDIA_FILE_BYTES, files:MAX_MEDIA_FILES, fields:5, parts:MAX_MEDIA_FILES+5 } });
const uploadRateLimit=rateLimit({windowMs:15*60e3,max:30,standardHeaders:true,legacyHeaders:false,message:{message:"Too many media uploads; try again later",code:"UPLOAD_RATE_LIMIT"}});
function enforceUploadRequestSize(req:express.Request,_res:express.Response,next:express.NextFunction){const length=Number(req.get("content-length")??0);if(Number.isFinite(length)&&length>MAX_MEDIA_REQUEST_BYTES)return next(new ApiError(413,"Upload request exceeds the Vercel-compatible size limit"));next();}
const transporter = env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS ? nodemailer.createTransport({host:env.SMTP_HOST,port:env.SMTP_PORT,secure:env.SMTP_PORT===465,auth:{user:env.SMTP_USER,pass:env.SMTP_PASS}}) : undefined;
const tokenHash=(token:string)=>createHash("sha256").update(token).digest("hex");
const publicUser=(u:{id:string;email:string;name:string;phone?:string|null;role:Role})=>({id:u.id,email:u.email,name:u.name,phone:u.phone??undefined,role:u.role});
const asyncRoute=(fn:(req:express.Request,res:express.Response)=>Promise<unknown>)=>(req:express.Request,res:express.Response,next:express.NextFunction)=>void fn(req,res).catch(next);
const asyncMiddleware=(fn:(req:express.Request,res:express.Response,next:express.NextFunction)=>Promise<unknown>)=>(req:express.Request,res:express.Response,next:express.NextFunction)=>void fn(req,res,next).catch(next);
async function email(to:string,subject:string,text:string){ if(transporter && env.MAIL_FROM) await transporter.sendMail({from:env.MAIL_FROM,to,subject,text}); }
class ApiError extends Error { constructor(readonly status:number, message:string, readonly expose=true){ super(message); this.name="ApiError"; } }
const cookieName = env.AUTH_COOKIE_NAME;
const cookieSameSite = env.AUTH_COOKIE_SAMESITE ?? "lax";
const cookieSecure = env.AUTH_COOKIE_SECURE ? env.AUTH_COOKIE_SECURE === "true" : env.NODE_ENV === "production";
const refreshDays = { standard: env.REFRESH_TOKEN_DAYS, remember: env.REMEMBER_ME_REFRESH_TOKEN_DAYS };
const jwtOptions={algorithms:["HS256"] as jwt.Algorithm[],issuer:"autoforge-api",audience:"autoforge-web"};
function issueAccess(user:{id:string;role:Role}) { return jwt.sign({sub:user.id,role:user.role},env.JWT_SECRET,{algorithm:"HS256",issuer:jwtOptions.issuer,audience:jwtOptions.audience,expiresIn:env.ACCESS_TOKEN_TTL as SignOptions["expiresIn"]}); }
async function issueRefresh(userId:string, rememberMe=false){ const value=randomBytes(48).toString("base64url"); const expiresAt=new Date(Date.now()+(rememberMe?refreshDays.remember:refreshDays.standard)*864e5); await mongo.refreshToken.create({data:{userId,tokenHash:tokenHash(value),rememberMe,expiresAt}}); return {value,expiresAt}; }
function cookieOptions(expires:Date){ const parts=[`${cookieName}=`, "HttpOnly", "Path=/api/auth", `Expires=${expires.toUTCString()}`, "SameSite="+(cookieSameSite==="none"?"None":cookieSameSite==="strict"?"Strict":"Lax")]; if(cookieSecure)parts.push("Secure"); if(env.AUTH_COOKIE_DOMAIN)parts.push(`Domain=${env.AUTH_COOKIE_DOMAIN}`); return parts.join("; "); }
function setRefreshCookie(res:express.Response, token:string, expiresAt:Date){ res.setHeader("Set-Cookie", cookieOptions(expiresAt).replace(`${cookieName}=`, `${cookieName}=${encodeURIComponent(token)}`)); }
function clearRefreshCookie(res:express.Response){ res.setHeader("Set-Cookie", cookieOptions(new Date(0))); }
function readCookie(req:express.Request,name:string){ const raw=req.headers.cookie; if(!raw)return undefined; return raw.split(";").map(v=>v.trim()).find(v=>v.startsWith(`${name}=`))?.slice(name.length+1); }
function requestRefreshToken(req:express.Request){ const value=readCookie(req,cookieName); return value ? decodeURIComponent(value) : undefined; }
const auth=asyncMiddleware(async(req,res,next)=>{ const header=req.headers.authorization; const match=header?.match(/^Bearer\s+(.+)$/i); if(!match) throw new ApiError(401,"Authentication required"); let claims:jwt.JwtPayload; try{claims=jwt.verify(match[1],env.JWT_SECRET,jwtOptions) as jwt.JwtPayload;}catch{throw new ApiError(401,"Invalid or expired access token");} if(typeof claims.sub!=="string") throw new ApiError(401,"Invalid access token"); const user=await mongo.user.findUnique({where:{id:claims.sub}}); if(!user) throw new ApiError(401,"Authentication required"); req.user={sub:user.id,role:user.role}; next(); });
function admin(req:express.Request,res:express.Response,next:express.NextFunction){ if(req.user?.role!==Role.ADMIN) return res.status(403).json({message:"Admin access required"}); console.info(JSON.stringify({event:"admin_api_access",userId:req.user.sub,method:req.method,path:req.path,timestamp:new Date().toISOString()})); next(); }
const idSchema=z.object({id:z.string().cuid()}); const orderStatus=z.nativeEnum(OrderStatus); const slug=z.string().min(2).max(120).regex(/^[a-z0-9-]+$/);
const productSchema=z.object({name:z.string().trim().min(2),slug,sku:z.string().trim().min(2),description:z.string().trim().min(1),specifications:z.record(z.unknown()).optional(),brand:z.string().trim().max(120).optional().nullable(),price:z.coerce.number().finite().nonnegative(),compareAtPrice:z.coerce.number().finite().nonnegative().optional().nullable(),stockQuantity:z.coerce.number().int().nonnegative().default(0),lowStockThreshold:z.coerce.number().int().nonnegative().default(5),featured:z.boolean().default(false),categoryId:z.string().cuid().optional().nullable(),imageIds:z.array(z.string().cuid()).max(10).optional()});
const categorySchema=z.object({name:z.string().trim().min(2).max(120),slug,imageId:z.string().cuid().optional().nullable()});
const booleanInput=z.preprocess(value=>typeof value==="string"?value.toLowerCase()==="true":value,z.boolean());
const mediaUrl=z.string().refine(value=>value.startsWith("/uploads/")||/^https?:\/\//.test(value),"Must be an absolute URL or an uploaded media path");
const brandSchema=z.object({name:z.string().trim().min(2).max(120),logoUrl:mediaUrl,sortOrder:z.coerce.number().int().min(0).max(10000).default(0),active:booleanInput.default(true)}).strict();
const homepageBlockSchema=z.object({key:z.string().trim().min(1).max(120).regex(/^[a-z0-9-]+$/),content:z.union([z.array(z.unknown()),z.record(z.unknown())])}).strict();
const settingWriteSchema=z.object({value:z.union([z.string(),z.number(),z.boolean(),z.null(),z.array(z.unknown()),z.record(z.unknown())])}).strict();
const importRowSchema=z.object({name:z.string().trim().min(2),sku:z.string().trim().min(2),slug:slug.optional(),description:z.string().trim().min(1),price:z.coerce.number().finite().nonnegative(),compareAtPrice:z.coerce.number().finite().nonnegative().nullable().optional(),stockQuantity:z.coerce.number().int().nonnegative().default(0),lowStockThreshold:z.coerce.number().int().nonnegative().default(5),category:z.string().trim().min(2).max(120).optional(),brand:z.string().trim().max(120).optional(),specifications:z.record(z.unknown()).optional(),imageUrls:z.array(z.string().url()).max(10).optional(),featured:z.coerce.boolean().default(false)});
type ImportRow=z.infer<typeof importRowSchema>;
const slugify=(value:string)=>value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g,"").replace(/\s+/g,"-").replace(/-+/g,"-");
const configuredOrigins=env.CORS_ORIGIN.split(",").map(origin=>origin.trim()).filter(Boolean);
const developmentOrigins=env.NODE_ENV==="production"?[]:["http://localhost:8080","http://127.0.0.1:8080"];
const allowedOrigins=new Set([...configuredOrigins,...developmentOrigins]);
function isSameRequestOrigin(req:express.Request, origin:string):boolean { try { const value=new URL(origin); const forwardedHost=req.get("x-forwarded-host")?.split(",")[0]?.trim(); const host=forwardedHost??req.get("host"); const forwardedProto=req.get("x-forwarded-proto")?.split(",")[0]?.trim(); const protocol=forwardedProto??req.protocol; return value.host===host && value.protocol===`${protocol}:`; } catch { return false; } }
function requireTrustedOrigin(req:express.Request,_res:express.Response,next:express.NextFunction){const origin=req.get("origin");if(origin && !allowedOrigins.has(origin) && !isSameRequestOrigin(req,origin)) return next(new ApiError(403,"Untrusted request origin"));next();}
const corsOptions:CorsOptions={
  credentials:true,
  methods:["GET","HEAD","PUT","PATCH","POST","DELETE","OPTIONS"],
  allowedHeaders:["Content-Type","Authorization"],
  optionsSuccessStatus:204,
  origin(origin,callback){
    if(!origin){callback(null,true);return;}
    callback(null,allowedOrigins.has(origin)?origin:false);
  },
};
app.disable("x-powered-by"); app.set("trust proxy", 1);
app.use((req,res,next)=>{const requestId=req.get("x-request-id")?.slice(0,128)??randomBytes(12).toString("hex");res.locals.requestId=requestId;res.setHeader("X-Request-Id",requestId);next();});
app.use((req,res,next)=>{res.setHeader("X-API-Version","1");if(req.url==="/api/v1"||req.url.startsWith("/api/v1/"))req.url=`/api${req.url.slice(7)}`;next();});
app.use(helmet({crossOriginResourcePolicy:{policy:"cross-origin"}})); app.use(cors(corsOptions)); app.options(/.*/,cors(corsOptions)); app.use(express.json({limit:"1mb",strict:true})); app.use(rateLimit({windowMs:15*60e3,max:300,standardHeaders:true,legacyHeaders:false})); if(mediaStorage.driver==="local")app.use("/uploads",express.static(mediaStorage.uploadDir,{maxAge:"1y",immutable:true,index:false,dotfiles:"deny"}));

// OTP Auth Routes
app.post("/api/auth/otp/send", requireTrustedOrigin, rateLimit({windowMs: 15*60e3, max: 10}), asyncRoute(async (req, res) => {
  const { phone } = z.object({ phone: z.string().min(10).max(15) }).parse(req.body);
  const normalizedPhone = phone.replace(/\D/g, "");
  const settings = await mongo.setting.findMany();
  const otpProvider = createOTPProvider(settings);
  
  // Get OTP config from settings
  const getSetting = (key: string, defaultValue:unknown):unknown => {
    const s = settings.find(setting => setting.key === key);
    return s ? s.value : defaultValue;
  };
  const otpLength = Number(getSetting("OTP_LENGTH", 6));
  const otpExpiry = Number(getSetting("OTP_EXPIRY", 300000)); // 5 minutes in ms
  const maxAttempts = Number(getSetting("OTP_MAX_ATTEMPTS", 5));

  // Invalidate any existing OTPs for this phone
  await mongo.oTP.deleteMany({ where: { phone: normalizedPhone, usedAt: null } });

  // Generate and save new OTP
  const otp = generateOTP(otpLength);
  const hashedOtp = tokenHash(otp);
  await mongo.oTP.create({
    data: {
      phone: normalizedPhone,
      otp: hashedOtp,
      expiresAt: new Date(Date.now() + otpExpiry),
    },
  });

  // Send OTP
  await otpProvider.send(normalizedPhone, otp);
  
  res.status(202).json({ message: "OTP sent successfully" });
}));

app.post("/api/auth/otp/verify", requireTrustedOrigin, rateLimit({windowMs: 15*60e3, max: 20}), asyncRoute(async (req, res) => {
  const { phone, otp, name: newUserName } = z.object({ phone: z.string().min(10).max(15), otp: z.string().min(4).max(8), name: z.string().min(2).optional() }).parse(req.body);
  const normalizedPhone = phone.replace(/\D/g, "");
  const settings = await mongo.setting.findMany();
  const maxAttempts = Number(settings.find(s => s.key === "OTP_MAX_ATTEMPTS")?.value ?? 5);

  // Find OTP record
  const otpRecord = await mongo.oTP.findFirst({
    where: {
      phone: normalizedPhone,
      usedAt: null,
    },
    orderBy: { createdAt: "desc" },
  });

  if (!otpRecord) {
    res.status(400).json({ message: "No OTP sent or OTP expired" });
    return;
  }

  // Check attempts
  if (otpRecord.attempts >= maxAttempts) {
    res.status(400).json({ message: "Too many attempts. Please request a new OTP" });
    return;
  }

  // Check expiry
  if (otpRecord.expiresAt < new Date()) {
    await mongo.oTP.update({ where: { id: otpRecord.id }, data: { attempts: { increment: 1 } } });
    res.status(400).json({ message: "OTP expired. Please request a new OTP" });
    return;
  }

  // Verify OTP
  const hashedOtp = tokenHash(otp);
  if (otpRecord.otp !== hashedOtp) {
    await mongo.oTP.update({ where: { id: otpRecord.id }, data: { attempts: { increment: 1 } } });
    res.status(400).json({ message: "Invalid OTP" });
    return;
  }

  // Mark OTP as used
  await mongo.oTP.update({ where: { id: otpRecord.id }, data: { usedAt: new Date() } });

  // Find or create user
  let user = await mongo.user.findUnique({ where: { phone: normalizedPhone } });
  
  if (!user) {
    // Create new user
    user = await mongo.user.create({
      data: {
        phone: normalizedPhone,
        name: newUserName || "Customer",
        email: `user_${normalizedPhone}@temp.autoforge`, // temporary email
        passwordHash: null,
        role: Role.CUSTOMER,
      },
    });
  }

  // Issue tokens
  const accessToken = issueAccess(user);
  const refreshToken = await issueRefresh(user.id, true);
  setRefreshCookie(res, refreshToken.value, refreshToken.expiresAt);

  res.json({
    accessToken,
    user: publicUser(user),
  });
}));

app.post("/api/auth/register",requireTrustedOrigin,rateLimit({windowMs:15*60e3,max:10}),asyncRoute(async(req,res)=>{ const input=z.object({name:z.string().trim().min(2).max(120),email:z.string().email(),password:z.string().min(10).max(200).regex(/[a-z]/,"Password must contain a lowercase letter").regex(/[A-Z]/,"Password must contain an uppercase letter").regex(/\d/,"Password must contain a number"),phone:z.string().min(10).max(30).optional(),rememberMe:z.boolean().optional()}).strict().parse(req.body); const emailAddress=input.email.toLowerCase(); const phone=input.phone?.replace(/\D/g,"")||undefined; const existing=await mongo.user.findFirst({where:{OR:[{email:emailAddress},...(phone?[{phone}]:[])]}}); if(existing) throw new ApiError(409,"An account already exists with those details"); const passwordHash=await bcrypt.hash(input.password,12); const user=await mongo.user.create({data:{name:input.name,email:emailAddress,phone:phone??null,passwordHash,role:Role.CUSTOMER}}); const refreshToken=await issueRefresh(user.id,input.rememberMe!==false); setRefreshCookie(res,refreshToken.value,refreshToken.expiresAt); res.status(201).json({accessToken:issueAccess(user),user:publicUser(user)}); }));
app.post("/api/auth/login",requireTrustedOrigin,rateLimit({windowMs:15*60e3,max:10}),asyncRoute(async(req,res)=>{ const input=z.object({email:z.string().email(),password:z.string().min(8).max(200),rememberMe:z.boolean().optional()}).strict().parse(req.body); const user=await mongo.user.findUnique({where:{email:input.email.toLowerCase()}}); if(!user || !user.passwordHash || !(await bcrypt.compare(input.password,user.passwordHash))) {res.status(401).json({message:"Invalid credentials"});return;} const refreshToken=await issueRefresh(user.id,input.rememberMe!==false); setRefreshCookie(res,refreshToken.value,refreshToken.expiresAt); res.json({accessToken:issueAccess(user),user:publicUser(user)}); }));
app.post("/api/auth/refresh",requireTrustedOrigin,rateLimit({windowMs:15*60e3,max:60}),asyncRoute(async(req,res)=>{ const refreshToken=requestRefreshToken(req); if(!refreshToken || refreshToken.length<20) throw new ApiError(401,"Invalid refresh token"); const row=await mongo.refreshToken.findUnique({where:{tokenHash:tokenHash(refreshToken)},include:{user:true}}); if(!row||row.revokedAt||row.expiresAt<new Date()){clearRefreshCookie(res);res.status(401).json({message:"Invalid refresh token"});return;} const nextRefresh=await mongo.$transaction(async tx=>{await tx.refreshToken.update({where:{id:row.id,revokedAt:null},data:{revokedAt:new Date()}});const value=randomBytes(48).toString("base64url");const expiresAt=new Date(Date.now()+(row.rememberMe?refreshDays.remember:refreshDays.standard)*864e5);await tx.refreshToken.create({data:{userId:row.userId,tokenHash:tokenHash(value),rememberMe:row.rememberMe,expiresAt}});return {value,expiresAt};}); setRefreshCookie(res,nextRefresh.value,nextRefresh.expiresAt); res.json({accessToken:issueAccess(row.user),user:publicUser(row.user)}); }));
app.post("/api/auth/logout",requireTrustedOrigin,asyncRoute(async(req,res)=>{const refreshToken=requestRefreshToken(req);if(refreshToken)await mongo.refreshToken.updateMany({where:{tokenHash:tokenHash(refreshToken)},data:{revokedAt:new Date()}});clearRefreshCookie(res);res.status(204).end();}));
app.post("/api/auth/password-reset",requireTrustedOrigin,rateLimit({windowMs:60*60e3,max:5}),asyncRoute(async(req,res)=>{const {email:address}=z.object({email:z.string().email()}).strict().parse(req.body);const user=await mongo.user.findUnique({where:{email:address.toLowerCase()}});if(user){const token=randomBytes(32).toString("base64url");await mongo.passwordReset.create({data:{userId:user.id,tokenHash:tokenHash(token),expiresAt:new Date(Date.now()+3600e3)}});await email(user.email,"Reset your AutoForge password",`Use this reset token within one hour: ${token}`);}res.status(202).json({message:"If the account exists, reset instructions were sent."});}));
app.post("/api/auth/password-reset/confirm",requireTrustedOrigin,rateLimit({windowMs:15*60e3,max:10}),asyncRoute(async(req,res)=>{const input=z.object({token:z.string().min(20).max(200),password:z.string().min(10).max(200).regex(/[a-z]/).regex(/[A-Z]/).regex(/\d/)}).strict().parse(req.body);const reset=await mongo.passwordReset.findUnique({where:{tokenHash:tokenHash(input.token)}});if(!reset||reset.usedAt||reset.expiresAt<new Date()){res.status(400).json({message:"Invalid or expired reset token"});return;}const passwordHash=await bcrypt.hash(input.password,12);await mongo.$transaction(async tx=>{await tx.user.update({where:{id:reset.userId},data:{passwordHash}});await tx.passwordReset.update({where:{id:reset.id,usedAt:null},data:{usedAt:new Date()}});await tx.refreshToken.updateMany({where:{userId:reset.userId},data:{revokedAt:new Date()}});});res.status(204).end();}));

app.get("/api/products",asyncRoute(async(req,res)=>{const q=z.string().optional().parse(req.query.q);res.json(await mongo.product.findMany({where:q?{OR:[{name:{contains:q,mode:"insensitive"}},{sku:{contains:q,mode:"insensitive"}}]}:undefined,include:{category:true,images:{include:{media:true},orderBy:{sortOrder:"asc"}}},orderBy:{createdAt:"desc"}}));}));
app.get("/api/products/:id",asyncRoute(async(req,res)=>{const p=await mongo.product.findUnique({where:idSchema.parse(req.params),include:{category:true,images:{include:{media:true}}}});if(!p){res.status(404).json({message:"Product not found"});return;}res.json(p);}));
app.post("/api/products",auth,admin,asyncRoute(async(req,res)=>{const d=productSchema.parse(req.body);const {imageIds,...values}=d;const productData:Partial<ProductRow>={...values,specifications:values.specifications};const p=await mongo.$transaction(async tx=>{const product=await tx.product.create({data:productData});if(imageIds?.length)await tx.productImage.createMany({data:imageIds.map((mediaId,sortOrder)=>({productId:product.id,mediaId,sortOrder}))});if(d.stockQuantity)await tx.inventoryMovement.create({data:{productId:product.id,delta:d.stockQuantity,quantityAfter:d.stockQuantity,action:InventoryAction.RECEIVED,note:"Initial stock"}});return product;});res.status(201).json(p);}));
app.patch("/api/products/:id",auth,admin,asyncRoute(async(req,res)=>{const d=productSchema.partial().parse(req.body);const {imageIds,...values}=d;const productData:Partial<ProductRow>={...values,specifications:values.specifications};const id=idSchema.parse(req.params).id;const p=await mongo.$transaction(async tx=>{const product=await tx.product.update({where:{id},data:productData});if(imageIds){await tx.productImage.deleteMany({where:{productId:id}});if(imageIds.length)await tx.productImage.createMany({data:imageIds.map((mediaId,sortOrder)=>({productId:id,mediaId,sortOrder}))});}return product;});res.json(p);})); app.delete("/api/products/:id",auth,admin,asyncRoute(async(req,res)=>{await mongo.product.delete({where:idSchema.parse(req.params)});res.status(204).end();}));
const parseImportRows=(value:unknown)=>z.object({rows:z.array(z.unknown()).min(1).max(500)}).parse(value).rows.map((row,index)=>{const parsed=importRowSchema.safeParse(row);return parsed.success?{row:index+1,data:parsed.data}:{row:index+1,errors:parsed.error.issues.map(issue=>`${issue.path.join(".")||"row"}: ${issue.message}`)}});
app.post("/api/products/import/preview",auth,admin,asyncRoute(async(req,res)=>{const parsed=parseImportRows(req.body);res.json({valid:parsed.filter((entry):entry is {row:number;data:ImportRow}=>"data" in entry).map(entry=>entry.data),invalid:parsed.filter((entry):entry is {row:number;errors:string[]}=>"errors" in entry)});}));
app.post("/api/products/import",auth,admin,asyncRoute(async(req,res)=>{const input=z.object({rows:z.array(z.unknown()).min(1).max(500),dryRun:z.boolean().default(false)}).parse(req.body);const parsed=parseImportRows({rows:input.rows});const invalid=parsed.filter((entry):entry is {row:number;errors:string[]}=>"errors" in entry);const valid=parsed.filter((entry):entry is {row:number;data:ImportRow}=>"data" in entry);const batchId=randomBytes(12).toString("hex");if(invalid.length){res.status(422).json({message:"Import validation failed",batchId,created:0,updated:0,categories:0,invalid});return;}if(input.dryRun){res.json({batchId,created:0,updated:0,categories:[...new Set(valid.map(entry=>entry.data.category).filter(Boolean))].length,invalid:[]});return;}const result=await mongo.$transaction(async tx=>{let created=0,updated=0,categories=0;for(const {data} of valid){let categoryId:string|undefined;if(data.category){let category=await tx.category.findFirst({where:{name:{equals:data.category,mode:"insensitive"}}});if(!category){category=await tx.category.create({data:{name:data.category,slug:slugify(data.category)}});categories++;}categoryId=category.id;}const existing=await tx.product.findUnique({where:{sku:data.sku}});const imageIds:string[]=[];for(const url of data.imageUrls??[]){const key=`import-${createHash("sha256").update(url).digest("hex")}`;const filename=path.basename(new URL(url).pathname)||"imported-image";const media=await tx.media.upsert({where:{key},update:{url,filename},create:{key,url,filename,mimeType:"image/*",size:0}});imageIds.push(media.id);}const productData:Partial<ProductRow>={name:data.name,slug:data.slug??slugify(data.name),description:data.description,price:data.price,compareAtPrice:data.compareAtPrice,stockQuantity:data.stockQuantity,lowStockThreshold:data.lowStockThreshold,featured:data.featured,brand:data.brand,categoryId,specifications:data.specifications};const product=existing?await tx.product.update({where:{id:existing.id},data:productData}):await tx.product.create({data:{...productData,sku:data.sku} as Partial<ProductRow>});if(existing)updated++;else {created++;if(data.stockQuantity)await tx.inventoryMovement.create({data:{productId:product.id,delta:data.stockQuantity,quantityAfter:data.stockQuantity,action:InventoryAction.RECEIVED,note:`Import ${batchId}`}});}await tx.productImage.deleteMany({where:{productId:product.id}});if(imageIds.length)await tx.productImage.createMany({data:imageIds.map((mediaId,sortOrder)=>({productId:product.id,mediaId,sortOrder}))});}return {created,updated,categories};});res.json({batchId,...result,invalid:[]});}));
app.post("/api/products/:id/inventory",auth,admin,asyncRoute(async(req,res)=>{const input=z.object({delta:z.number().int(),action:z.nativeEnum(InventoryAction).default(InventoryAction.ADJUSTMENT),note:z.string().max(500).optional()}).parse(req.body);const result=await mongo.$transaction(async tx=>{const p=await tx.product.findUniqueOrThrow({where:idSchema.parse(req.params)});const next=p.stockQuantity+input.delta;if(next<0)throw new Error("Inventory cannot be negative");await tx.product.update({where:{id:p.id},data:{stockQuantity:next}});return tx.inventoryMovement.create({data:{productId:p.id,delta:input.delta,quantityAfter:next,action:input.action,note:input.note}})});res.json(result);}));
app.get("/api/inventory/analytics",auth,admin,asyncRoute(async(_req,res)=>{const [products,out,movements]=await Promise.all([mongo.product.findMany({select:{stockQuantity:true,lowStockThreshold:true}}),mongo.product.count({where:{stockQuantity:0}}),mongo.inventoryMovement.findMany({take:20,orderBy:{createdAt:"desc"},include:{product:true}})]);res.json({lowStock:products.filter(p=>p.stockQuantity>0&&p.stockQuantity<=p.lowStockThreshold).length,outOfStock:out,recentMovements:movements});}));

app.get("/api/categories",asyncRoute(async(_req,res)=>res.json(await mongo.category.findMany({include:{image:true,_count:{select:{products:true}}},orderBy:{name:"asc"}}))));
app.post("/api/categories",auth,admin,asyncRoute(async(req,res)=>res.status(201).json(await mongo.category.create({data:categorySchema.parse(req.body)}))));
app.patch("/api/categories/:id",auth,admin,asyncRoute(async(req,res)=>res.json(await mongo.category.update({where:idSchema.parse(req.params),data:categorySchema.partial().parse(req.body)}))));
app.delete("/api/categories/:id",auth,admin,asyncRoute(async(req,res)=>{await mongo.category.delete({where:idSchema.parse(req.params)});res.status(204).end();}));
function crud(path:string, model:"brandCollaboration"|"homepageBlock"){const db=()=>mongo[model];const schema=model==="brandCollaboration"?brandSchema:homepageBlockSchema;app.get(path,asyncRoute(async(_q,res)=>{res.json(await db().findMany({orderBy:model==="brandCollaboration"?{sortOrder:"asc"}:undefined}));}));app.post(path,auth,admin,asyncRoute(async(req,res)=>{res.status(201).json(await db().create({data:schema.parse(req.body)}));}));app.patch(`${path}/:id`,auth,admin,asyncRoute(async(req,res)=>{res.json(await db().update({where:idSchema.parse(req.params),data:schema.partial().parse(req.body)}));}));app.delete(`${path}/:id`,auth,admin,asyncRoute(async(req,res)=>{await db().delete({where:idSchema.parse(req.params)});res.status(204).end();}));}
crud("/api/brands","brandCollaboration");crud("/api/homepage","homepageBlock");
app.get("/api/orders",auth,admin,asyncRoute(async(_req,res)=>res.json(await mongo.order.findMany({include:{user:true,items:true,payment:true,shipment:true,invoice:true,billingAddress:true,shippingAddress:true},orderBy:{createdAt:"desc"}}))));
app.patch("/api/orders/:id/status",auth,admin,asyncRoute(async(req,res)=>{const status=orderStatus.parse(req.body.status);const order=await mongo.order.update({where:idSchema.parse(req.params),data:{status},include:{user:true,items:true,payment:true,shipment:true}});if(status===OrderStatus.SHIPPED)await email(order.user.email,"Your AutoForge order has shipped",`Order ${order.number} is on its way.`);res.json(order);}));
app.post("/api/orders",auth,asyncRoute(async(req,res)=>{
  const input=z.object({
    items:z.array(z.object({productId:z.string().cuid(),quantity:z.number().int().positive()})).min(1),
    shippingAddressId:z.string().cuid(),
    billingAddressId:z.string().cuid().optional(),
  }).parse(req.body);
  const [shippingAddress,billingAddress]=await Promise.all([
    mongo.address.findUnique({where:{id:input.shippingAddressId,userId:req.user!.sub}}),
    input.billingAddressId?mongo.address.findUnique({where:{id:input.billingAddressId,userId:req.user!.sub}}):Promise.resolve(null),
  ]);
  if(!shippingAddress || (input.billingAddressId && !billingAddress)) throw new ApiError(422,"Select a valid address belonging to your account");
  const order=await mongo.$transaction(async tx=>{
    let subtotal=0;let tax=0;
    const lines:Array<{productId:string;productName:string;sku:string;quantity:number;unitPrice:number;hsnCode:string|null;gstPercentage:number}>=[];
    for(const line of input.items){
      const product=await tx.product.findUniqueOrThrow({where:{id:line.productId}});
      if(product.stockQuantity<line.quantity)throw new Error(`${product.name} is out of stock`);
      const itemTotal=Number(product.price)*line.quantity;
      const gstRate=Number(product.gstPercentage||18);
      const itemTax=(itemTotal*gstRate)/(100+gstRate);
      subtotal+=itemTotal-itemTax;tax+=itemTax;
      lines.push({
        productId:product.id,productName:product.name,sku:product.sku,
        quantity:line.quantity,unitPrice:Number(product.price),
        hsnCode:product.hsnCode,gstPercentage:Number(product.gstPercentage||18)
      });
    }
    const shipping=0;
    const total=subtotal+tax+shipping;
    return tx.order.create({
      data:{
        number:`AF-${Date.now().toString().slice(-8)}-${randomBytes(3).toString("hex").toUpperCase()}`,userId:req.user!.sub,
        subtotal,tax,shipping,total,
        shippingAddressId:input.shippingAddressId,
        billingAddressId:input.billingAddressId||input.shippingAddressId,
        items:{create:lines}
      },
      include:{user:true,items:true,billingAddress:true,shippingAddress:true}
    });
  });
  res.status(201).json(order);
}));

// Payment Routes
app.post("/api/payments/razorpay/create-order",auth,asyncRoute(async(req,res)=>{
  const { orderId } = z.object({ orderId: z.string().cuid() }).parse(req.body);
  const order = await mongo.order.findUniqueOrThrow({ where: { id: orderId, userId: req.user!.sub } });
  if(!razorpay) throw new ApiError(503,"Payment provider is not configured");
  const amount = Math.round(Number(order.total)*100);
  const rzOrder = await razorpay.orders.create({
    amount,currency:"INR",receipt:order.id,notes:{orderNumber:order.number}
  });
  await mongo.payment.upsert({
    where:{orderId},
    update:{razorpayOrderId:rzOrder.id,amount:order.total},
    create:{orderId,razorpayOrderId:rzOrder.id,amount:order.total,provider:PaymentProvider.RAZORPAY,status:PaymentStatus.PENDING}
  });
  res.json({orderId:rzOrder.id,amount,keyId:env.RAZORPAY_KEY_ID});
}));
app.post("/api/payments/razorpay/verify",auth,asyncRoute(async(req,res)=>{
  const { orderId, paymentId, signature } = z.object({
    orderId:z.string().cuid(),paymentId:z.string(),signature:z.string()
  }).parse(req.body);
  const order = await mongo.order.findUniqueOrThrow({ where: { id: orderId, userId: req.user!.sub }, include: { payment: true, user: true, items: true } });
  const payment = order.payment;
  if(!razorpay || !payment){ res.status(400).json({message:"Invalid order"}); return; }
  // Verify signature
  const body = payment.razorpayOrderId + "|" + paymentId;
  const expectedSignature = createHmac("sha256", env.RAZORPAY_KEY_SECRET!).update(body).digest("hex");
  const suppliedSignature=Buffer.from(signature,"hex");
  const expectedSignatureBytes=Buffer.from(expectedSignature,"hex");
  if(suppliedSignature.length!==expectedSignatureBytes.length || !timingSafeEqual(suppliedSignature,expectedSignatureBytes)){
    await mongo.payment.update({ where: { orderId }, data: { status: PaymentStatus.FAILED, failureReason: "Invalid signature" } });
    res.status(400).json({message:"Payment verification failed"}); return;
  }
  // Update payment and order status
  await mongo.$transaction(async tx=>{
    await tx.payment.update({
      where:{orderId},
      data:{razorpayPaymentId:paymentId,razorpaySignature:signature,status:PaymentStatus.SUCCESS,transactionId:paymentId,transactionTime:new Date()}
    });
    if(payment.status===PaymentStatus.SUCCESS) return;
    for(const item of order.items){
      const product=await tx.product.findUniqueOrThrow({where:{id:item.productId!}});
      if(product.stockQuantity<item.quantity) throw new Error(`Stock unavailable for ${item.productName}`);
      await tx.product.update({where:{id:product.id},data:{stockQuantity:{decrement:item.quantity}}});
      await tx.inventoryMovement.create({data:{productId:product.id,delta:-item.quantity,quantityAfter:product.stockQuantity-item.quantity,action:InventoryAction.ORDER_PLACED,note:`Verified payment ${paymentId}`}});
    }
    await tx.order.update({ where:{id:orderId}, data:{status:OrderStatus.CONFIRMED,paidAt:new Date(),confirmedAt:new Date()} });
    // Generate invoice
    await tx.invoice.create({
      data:{
        number:`INV-${Date.now().toString().slice(-8)}-${randomBytes(3).toString("hex").toUpperCase()}`,orderId,invoiceDate:new Date(),
        gstin:env.GSTIN||"",
        totalAmount:order.total,
        cgst:Number(order.tax)/2,
        sgst:Number(order.tax)/2,
        igst:0,
      }
    });
  });
  await mongo.cartItem.deleteMany({where:{userId:req.user!.sub}});
  // Send confirmation email
  await email(order.user.email,"AutoForge payment successful",`Your payment for order ${order.number} was successful.`);
  res.json({message:"Payment successful"});
}));
app.get("/api/orders/:id", auth, asyncRoute(async(req, res) => {
  const order = await mongo.order.findUniqueOrThrow({
    where: { id: idSchema.parse(req.params).id, userId: req.user!.sub },
    include: { items: true, payment: true, shipment: true, invoice: true, billingAddress: true, shippingAddress: true }
  });
  res.json(order);
}));
app.get("/api/orders/track/:number", auth, asyncRoute(async(req, res) => {
  const order = await mongo.order.findUniqueOrThrow({
    where: { number: z.string().min(8).max(64).parse(req.params.number), userId:req.user!.sub },
    include: { items: true, payment: true, shipment: true, invoice: true }
  });
  res.json(order);
}));

// Product Reviews
app.get("/api/products/:id/reviews", asyncRoute(async(req, res) => {
  const reviews = await mongo.productReview.findMany({
    where: { productId: idSchema.parse(req.params).id, approved: true },
    include: { user: true, images: { include: { media: true } } },
    orderBy: { createdAt: "desc" }
  });
  res.json(reviews.map(({user,...review})=>({...review,user:{id:user.id,name:user.name}})));
}));
app.post("/api/products/:id/reviews", auth, asyncRoute(async(req, res) => {
  const { orderItemId, rating, title, description, imageIds } = z.object({
    orderItemId: z.string().cuid(), rating: z.number().int().min(1).max(5), title: z.string().optional(),
    description: z.string().optional(), imageIds: z.array(z.string().cuid()).max(5).optional()
  }).parse(req.body);
  // Verify user bought this product
  const orderItem = await mongo.orderItem.findFirstOrThrow({
    where: { id: orderItemId, order: { userId: req.user!.sub }, productId: idSchema.parse(req.params).id }
  });
  const review = await mongo.productReview.create({
    data: {
      productId: idSchema.parse(req.params).id, userId: req.user!.sub, orderItemId, rating, title, description,
      images: imageIds ? { create: imageIds.map((mediaId, sortOrder) => ({ mediaId, sortOrder })) } : undefined
    },
    include: { images: { include: { media: true } } }
  });
  res.status(201).json(review);
}));
app.patch("/api/reviews/:id/approve", auth, admin, asyncRoute(async(req, res) => {
  const review = await mongo.productReview.update({
    where: { id: idSchema.parse(req.params).id },
    data: { approved: true }
  });
  res.json(review);
}));
app.patch("/api/reviews/:id/reply", auth, admin, asyncRoute(async(req, res) => {
  const { reply } = z.object({ reply: z.string() }).parse(req.body);
  const review = await mongo.productReview.update({
    where: { id: idSchema.parse(req.params).id },
    data: { adminReply: reply }
  });
  res.json(review);
}));
app.patch("/api/reviews/:id/helpful", asyncRoute(async(req, res) => {
  const review = await mongo.productReview.update({
    where: { id: idSchema.parse(req.params).id },
    data: { helpfulVotes: { increment: 1 } }
  });
  res.json(review);
}));

app.post("/api/orders/:id/ship", auth, admin, asyncRoute(async(req, res) => {
  const order = await mongo.order.findUniqueOrThrow({ where: idSchema.parse(req.params), include: { shippingAddress: true, items: true } });
  const shipmentData=z.object({awbNumber:z.string().trim().min(3).max(120),trackingNumber:z.string().trim().min(3).max(120),courierName:z.string().trim().min(2).max(120),trackingUrl:z.string().url().optional()}).strict().parse(req.body);
  const shipment = await mongo.shipment.upsert({
    where: { orderId: order.id },
    update: { ...shipmentData, status: ShipmentStatus.PICKED },
    create: { orderId: order.id, ...shipmentData, status: ShipmentStatus.PICKED }
  });
  res.json(shipment);
}));
app.get("/api/customers",auth,admin,asyncRoute(async(_req,res)=>{const users=await mongo.user.findMany({where:{role:Role.CUSTOMER},include:{addresses:true,orders:true}});res.json(users.map(({passwordHash,...user})=>user));}));
app.get("/api/me", auth, asyncRoute(async(req, res) => {
  const user = await mongo.user.findUnique({
    where: { id: req.user!.sub },
    include: { addresses: true, orders: { include: { items: true } } }
  });
  if (!user) { res.status(404).json({ message: "User not found" }); return; }
  res.json(publicUser(user));
}));
app.patch("/api/me", auth, asyncRoute(async(req, res) => {
  const data = z.object({ name: z.string().trim().min(2).max(120).optional(), email: z.string().email().transform(value=>value.toLowerCase()).optional() }).strict().parse(req.body);
  const user = await mongo.user.update({
    where: { id: req.user!.sub },
    data,
  });
  res.json(publicUser(user));
}));
app.get("/api/me/orders", auth, asyncRoute(async(req, res) => {
  const orders = await mongo.order.findMany({
    where: { userId: req.user!.sub },
    include: { items: true },
    orderBy: { createdAt: "desc" }
  });
  res.json(orders);
}));
app.get("/api/me/addresses", auth, asyncRoute(async(req, res) => {
  const addresses = await mongo.address.findMany({
    where: { userId: req.user!.sub },
  });
  res.json(addresses);
}));
app.get("/api/cart",auth,asyncRoute(async(req,res)=>res.json(await mongo.cartItem.findMany({where:{userId:req.user!.sub},include:{product:{include:{images:{include:{media:true}}}}}}))));
app.post("/api/cart",auth,asyncRoute(async(req,res)=>{const {productId,quantity}=z.object({productId:z.string().cuid(),quantity:z.number().int().min(1).max(100).default(1)}).strict().parse(req.body);const product=await mongo.product.findUnique({where:{id:productId}});if(!product||product.stockQuantity<quantity)throw new ApiError(422,"Requested quantity is not available");const existing=await mongo.cartItem.findUnique({where:{userId_productId:{userId:req.user!.sub,productId}}});if((existing?.quantity??0)+quantity>product.stockQuantity)throw new ApiError(422,"Requested quantity is not available");res.status(201).json(await mongo.cartItem.upsert({where:{userId_productId:{userId:req.user!.sub,productId}},update:{quantity:{increment:quantity}},create:{userId:req.user!.sub,productId,quantity}}));}));
app.patch("/api/cart",auth,asyncRoute(async(req,res)=>{const {productId,quantity}=z.object({productId:z.string().cuid(),quantity:z.number().int().min(1).max(100)}).strict().parse(req.body);const product=await mongo.product.findUnique({where:{id:productId}});if(!product||product.stockQuantity<quantity)throw new ApiError(422,"Requested quantity is not available");res.json(await mongo.cartItem.update({where:{userId_productId:{userId:req.user!.sub,productId}},data:{quantity}}));}));
app.delete("/api/cart/:id",auth,asyncRoute(async(req,res)=>{await mongo.cartItem.delete({where:{userId_productId:{userId:req.user!.sub,productId:idSchema.parse(req.params).id}}});res.status(204).end();}));
app.get("/api/wishlist",auth,asyncRoute(async(req,res)=>res.json(await mongo.wishlistItem.findMany({where:{userId:req.user!.sub},include:{product:{include:{images:{include:{media:true}}}}}}))));
app.post("/api/wishlist",auth,asyncRoute(async(req,res)=>{const {productId}=z.object({productId:z.string().cuid()}).parse(req.body);res.status(201).json(await mongo.wishlistItem.upsert({where:{userId_productId:{userId:req.user!.sub,productId}},update:{},create:{userId:req.user!.sub,productId}}));}));
app.delete("/api/wishlist/:id",auth,asyncRoute(async(req,res)=>{await mongo.wishlistItem.delete({where:{userId_productId:{userId:req.user!.sub,productId:idSchema.parse(req.params).id}}});res.status(204).end();}));
app.post("/api/me/addresses", auth, asyncRoute(async(req, res) => {
  const data = z.object({
    line1: z.string().trim().min(2).max(200),
    line2: z.string().trim().max(200).optional(),
    city: z.string().trim().min(2).max(120),
    state: z.string().trim().min(2).max(120),
    postalCode: z.string().trim().min(3).max(20),
    country: z.string().trim().min(2).max(120),
  }).strict().parse(req.body);
  const address = await mongo.address.create({
    data: { ...data, userId: req.user!.sub },
  });
  res.status(201).json(address);
}));
app.delete("/api/me/addresses/:id", auth, asyncRoute(async(req, res) => {
  const { id } = idSchema.parse(req.params);
  await mongo.address.delete({ where: { id, userId: req.user!.sub } });
  res.status(204).end();
}));
app.get("/api/health",(_req,res)=>res.json({status:"ok",timestamp:new Date().toISOString(),service:"autoforge-api",version:"1.0.0",uptime:Math.floor(process.uptime())}));
app.get("/api/ready",asyncRoute(async(_req,res)=>{try{await mongo.ping();res.json({status:"ready",timestamp:new Date().toISOString()});}catch{res.status(503).json({status:"not_ready",timestamp:new Date().toISOString()});}}));
const sensitiveSettingKey=/(?:secret|password|pass|token|api[_-]?key|auth[_-]?token)/i;
app.get("/api/settings",auth,admin,asyncRoute(async(_req,res)=>res.json((await mongo.setting.findMany()).filter(setting=>!sensitiveSettingKey.test(setting.key)))));app.put("/api/settings/:key",auth,admin,asyncRoute(async(req,res)=>{const {value}=settingWriteSchema.parse(req.body);const key=z.string().min(1).max(120).parse(req.params.key);if(sensitiveSettingKey.test(key))throw new ApiError(403,"Secrets must be configured through environment variables");res.json(await mongo.setting.upsert({where:{key},update:{value},create:{key,value}}));}));
const mediaFolder=z.enum(["products","categories","brands","homepage","cms","media","temp"]);
function mediaData(stored:StoredMedia,file:Express.Multer.File,probe:ReturnType<typeof validateImageFile>){return {key:stored.key,url:stored.secureUrl,provider:stored.provider,publicId:stored.publicId??null,secureUrl:stored.secureUrl,resourceType:stored.resourceType,format:stored.format??probe.format,width:stored.width??probe.width,height:stored.height??probe.height,bytes:stored.bytes,version:stored.version??null,originalFilename:path.basename(file.originalname).slice(0,255),filename:path.basename(file.originalname).slice(0,255),mimeType:probe.mimeType,size:stored.bytes};}
function prepareUploadedFile(file:Express.Multer.File,folder:string){const probe=validateImageFile(file);const id=randomBytes(18).toString("hex");const publicId=mediaStorage.driver==="cloudinary"?`${mediaStorage.rootFolder}/${folder}/${id}`:`${id}.${probe.format}`;return {probe,input:{publicId,data:file.buffer,contentType:probe.mimeType,originalFilename:path.basename(file.originalname)}};}
function containsMediaValue(value:unknown,tokens:Set<string>):boolean{if(typeof value==="string")return tokens.has(value);if(Array.isArray(value))return value.some(item=>containsMediaValue(item,tokens));if(value&&typeof value==="object")return Object.values(value).some(item=>containsMediaValue(item,tokens));return false;}
async function mediaReferences(media:MediaRow){const [productImages,reviewImages,categories,brands,blocks,settings]=await Promise.all([mongo.productImage.count({where:{mediaId:media.id}}),mongo.productReviewImage.count({where:{mediaId:media.id}}),mongo.category.count({where:{imageId:media.id}}),mongo.brandCollaboration.findMany(),mongo.homepageBlock.findMany(),mongo.setting.findMany()]);const tokens=new Set([media.id,media.key,media.url,media.secureUrl,media.publicId].filter((value):value is string=>Boolean(value)));return {productImages,reviewImages,categories,brands:brands.filter(row=>tokens.has(row.logoUrl)).length,homepageBlocks:blocks.filter(row=>containsMediaValue(row.content,tokens)).length,settings:settings.filter(row=>containsMediaValue(row.value,tokens)).length};}
function referenceTotal(refs:Awaited<ReturnType<typeof mediaReferences>>){return countReferences(refs);}
async function deleteStoredMedia(media:MediaRow){if(media.provider==="cloudinary"||media.publicId){if(mediaStorage.driver!=="cloudinary")throw new MediaStorageError("Cloudinary is not configured for deletion");await mediaStorage.delete(media.publicId??media.key);return;}if(media.url.startsWith("/uploads/")||media.provider==="local")await localMediaStorage.delete(media.key);}
app.post("/api/media",auth,admin,uploadRateLimit,enforceUploadRequestSize,upload.array("files",MAX_MEDIA_FILES),asyncRoute(async(req,res)=>{const files=req.files as Express.Multer.File[];if(!files?.length)throw new ApiError(400,"At least one image is required");validateImageBatch(files);const folder=mediaFolder.default("media").parse(req.body.folder);const created:Array<{row:MediaRow;stored:StoredMedia}>=[];try{for(const file of files){const prepared=prepareUploadedFile(file,folder);const uploaded=await persistMediaUpload(mediaStorage,prepared.input,stored=>mongo.media.create({data:mediaData(stored,file,prepared.probe)}));created.push({row:uploaded.value,stored:uploaded.stored});}res.status(201).json(created.map(item=>item.row));}catch(error){for(const item of created.reverse()){await mongo.media.delete({where:{id:item.row.id}}).catch(()=>undefined);await mediaStorage.delete(item.stored.publicId??item.stored.key).catch(()=>undefined);}throw error;}}));
app.get("/api/media",auth,admin,asyncRoute(async(_req,res)=>res.json(await mongo.media.findMany({orderBy:{createdAt:"desc"}}))));
app.patch("/api/media/:id",auth,admin,asyncRoute(async(req,res)=>res.json(await mongo.media.update({where:idSchema.parse(req.params),data:z.object({filename:z.string().trim().min(1).max(255).optional(),altText:z.string().trim().max(500).optional().nullable()}).strict().parse(req.body)}))));
app.post("/api/media/:id/replace",auth,admin,uploadRateLimit,enforceUploadRequestSize,upload.single("file"),asyncRoute(async(req,res)=>{const id=idSchema.parse(req.params).id;const old=await mongo.media.findUnique({where:{id}});if(!old)throw new ApiError(404,"Media not found");if(!req.file)throw new ApiError(400,"An image is required");const folder=mediaFolder.default("media").parse(req.body.folder);const prepared=prepareUploadedFile(req.file,folder);const replacement=await replaceMediaAsset(mediaStorage,prepared.input,stored=>mongo.media.update({where:{id},data:mediaData(stored,req.file!,prepared.probe)}),()=>deleteStoredMedia(old),()=>console.warn(JSON.stringify({event:"media_replacement_old_asset_cleanup_failed",mediaId:id,oldPublicId:old.publicId??undefined,timestamp:new Date().toISOString()})));res.json(replacement.value);}));
app.delete("/api/media/:id",auth,admin,asyncRoute(async(req,res)=>{const id=idSchema.parse(req.params).id;const media=await mongo.media.findUnique({where:{id}});if(!media){res.status(204).end();return;}const references=await mediaReferences(media);if(referenceTotal(references)>0){res.status(409).json({message:"Media is still referenced and cannot be permanently deleted",code:"MEDIA_IN_USE",references});return;}await deleteStoredMedia(media);await mongo.media.delete({where:{id}});console.info(JSON.stringify({event:"media_deleted",mediaId:id,publicId:media.publicId??undefined,userId:req.user!.sub,timestamp:new Date().toISOString()}));res.status(204).end();}));
const enquirySchema=z.object({type:z.enum(["contact","sell","bulk"]),name:z.string().min(2),email:z.string().email(),phone:z.string().max(30).optional(),companyName:z.string().max(160).optional(),message:z.string().min(5).max(5000),details:z.record(z.unknown()).optional()});
app.post("/api/enquiries",rateLimit({windowMs:60*60e3,max:10}),asyncRoute(async(req,res)=>{const input=enquirySchema.strict().parse(req.body);const enquiry=await mongo.enquiry.create({data:input});await Promise.all([email(input.email,"We received your AutoForge enquiry",`Thanks ${input.name}; our team will respond shortly.`),email(env.MAIL_FROM??"",`New ${input.type} enquiry`,`${input.name}: ${input.message}`)]);res.status(201).json(enquiry);}));
app.get("/api/enquiries",auth,admin,asyncRoute(async(req,res)=>{const q=z.string().optional().parse(req.query.q);const status=z.nativeEnum(EnquiryStatus).optional().parse(req.query.status);res.json(await mongo.enquiry.findMany({where:{type:"sell",status,OR:q?[{name:{contains:q,mode:"insensitive"}},{email:{contains:q,mode:"insensitive"}},{companyName:{contains:q,mode:"insensitive"}}]:undefined},include:{notes:true},orderBy:{createdAt:"desc"}}));}));
app.patch("/api/enquiries/:id",auth,admin,asyncRoute(async(req,res)=>{const data=z.object({status:z.nativeEnum(EnquiryStatus).optional()}).parse(req.body);res.json(await mongo.enquiry.update({where:idSchema.parse(req.params),data,include:{notes:true}}));}));
app.post("/api/enquiries/:id/notes",auth,admin,asyncRoute(async(req,res)=>{const {body}=z.object({body:z.string().min(1).max(5000)}).parse(req.body);res.status(201).json(await mongo.enquiryNote.create({data:{enquiryId:idSchema.parse(req.params).id,body}}));}));
app.delete("/api/enquiries/:id",auth,admin,asyncRoute(async(req,res)=>{await mongo.enquiry.delete({where:idSchema.parse(req.params)});res.status(204).end();}));
app.get("/api/enquiries/export.csv",auth,admin,asyncRoute(async(_req,res)=>{const rows=await mongo.enquiry.findMany({where:{type:"sell"},orderBy:{createdAt:"desc"}});const csv=["Name,Company,Email,Phone,Status,Created",...rows.map(r=>[r.name,r.companyName??"",r.email,r.phone??"",r.status,r.createdAt.toISOString()].map(v=>`\"${v.replaceAll("\"","\"\"")}\"`).join(","))].join("\n");res.setHeader("Content-Type","text/csv");res.attachment("seller-enquiries.csv").send(csv);}));
app.use((_req,res)=>res.status(404).json({message:"API route not found"}));
app.use((err:unknown,_req:express.Request,res:express.Response,_next:express.NextFunction)=>{
  const requestId=String(res.locals.requestId??"");
  if(err instanceof z.ZodError){res.status(422).json({message:"Validation failed",code:"VALIDATION_ERROR",errors:err.flatten(),requestId});return;}
  if(err instanceof multer.MulterError){res.status(err.code==="LIMIT_FILE_SIZE"?413:422).json({message:"Upload rejected",code:err.code,requestId});return;}
  if(err instanceof MediaValidationError){res.status(err.status).json({message:err.message,code:"INVALID_MEDIA",requestId});return;}
  if(err instanceof MediaStorageError){res.status(err.status).json({message:err.message,code:"MEDIA_STORAGE_UNAVAILABLE",requestId});return;}
  if(err instanceof ApiError){res.status(err.status).json({message:err.message,code:"API_ERROR",requestId});return;}
  const errorWithCode=err as {code?:number;message?:string;name?:string};
  if(errorWithCode.code===11000){res.status(409).json({message:"Duplicate record",code:"CONFLICT",requestId});return;}
  if(errorWithCode.message?.toLowerCase().includes("not found")){res.status(404).json({message:"Resource not found",code:"NOT_FOUND",requestId});return;}
  console.error(JSON.stringify({event:"request_error",requestId,error:err instanceof Error?{name:err.name,message:err.message,stack:env.NODE_ENV==="production"?undefined:err.stack}:String(err)}));
  res.status(500).json({message:env.NODE_ENV==="production"?"Internal server error":errorWithCode.message||"Unexpected server error",code:"INTERNAL_ERROR",requestId});
});
export async function initializeAppServices():Promise<void>{
  await mediaStorage.initialize();
}

export default app;
