import "dotenv/config";
import { createHash, randomBytes, createHmac } from "node:crypto";
import { mkdir, unlink, writeFile } from "node:fs/promises";
import path from "node:path";
import bcrypt from "bcryptjs";
import cors from "cors";
import express from "express";
import rateLimit from "express-rate-limit";
import helmet from "helmet";
import jwt from "jsonwebtoken";
import multer from "multer";
import nodemailer from "nodemailer";
import Razorpay from "razorpay";
import { PrismaClient, Role, OrderStatus, InventoryAction, EnquiryStatus, PaymentStatus, PaymentProvider, ShipmentStatus } from "@prisma/client";
import { z } from "zod";
import { createOTPProvider, generateOTP } from "./providers/otp.js";
const env = z.object({ DATABASE_URL: z.string().url(), JWT_SECRET: z.string().min(32), CORS_ORIGIN: z.string().default("http://localhost:3000"), PORT: z.coerce.number().default(4000), UPLOAD_DIR: z.string().default("backend/uploads"), SMTP_HOST: z.string().optional(), SMTP_PORT: z.coerce.number().default(587), SMTP_USER: z.string().optional(), SMTP_PASS: z.string().optional(), MAIL_FROM: z.string().email().optional(), RAZORPAY_KEY_ID: z.string().optional(), RAZORPAY_KEY_SECRET: z.string().optional(), GSTIN: z.string().optional() }).parse(process.env);
// Initialize Razorpay
const razorpay = env.RAZORPAY_KEY_ID && env.RAZORPAY_KEY_SECRET
    ? new Razorpay({ key_id: env.RAZORPAY_KEY_ID, key_secret: env.RAZORPAY_KEY_SECRET })
    : undefined;
const prisma = new PrismaClient();
const app = express();
const uploadDir = path.resolve(env.UPLOAD_DIR);
const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 10 * 1024 * 1024, files: 10 }, fileFilter: (_r, f, cb) => cb(null, /^image\/(jpeg|png|webp|gif|svg\+xml)$/.test(f.mimetype)) });
const transporter = env.SMTP_HOST && env.SMTP_USER && env.SMTP_PASS ? nodemailer.createTransport({ host: env.SMTP_HOST, port: env.SMTP_PORT, secure: env.SMTP_PORT === 465, auth: { user: env.SMTP_USER, pass: env.SMTP_PASS } }) : undefined;
const tokenHash = (token) => createHash("sha256").update(token).digest("hex");
const publicUser = (u) => ({ id: u.id, email: u.email, name: u.name, phone: u.phone ?? undefined, role: u.role });
const asyncRoute = (fn) => (req, res, next) => void fn(req, res).catch(next);
async function email(to, subject, text) { if (transporter && env.MAIL_FROM)
    await transporter.sendMail({ from: env.MAIL_FROM, to, subject, text }); }
function issueAccess(user) { return jwt.sign({ sub: user.id, role: user.role }, env.JWT_SECRET, { expiresIn: "15m" }); }
async function issueRefresh(userId) { const value = randomBytes(48).toString("base64url"); await prisma.refreshToken.create({ data: { userId, tokenHash: tokenHash(value), expiresAt: new Date(Date.now() + 30 * 864e5) } }); return value; }
function auth(req, res, next) { try {
    const claims = jwt.verify(req.headers.authorization?.replace("Bearer ", "") ?? "", env.JWT_SECRET);
    req.user = claims;
    next();
}
catch {
    res.status(401).json({ message: "Authentication required" });
} }
function admin(req, res, next) { if (req.user?.role !== Role.ADMIN)
    return res.status(403).json({ message: "Admin access required" }); next(); }
const idSchema = z.object({ id: z.string().cuid() });
const orderStatus = z.nativeEnum(OrderStatus);
const slug = z.string().min(2).max(120).regex(/^[a-z0-9-]+$/);
const productSchema = z.object({ name: z.string().min(2), slug, sku: z.string().min(2), description: z.string().min(1), specifications: z.record(z.unknown()).optional(), brand: z.string().max(120).optional().nullable(), price: z.coerce.number().nonnegative(), compareAtPrice: z.coerce.number().nonnegative().optional().nullable(), stockQuantity: z.coerce.number().int().nonnegative().default(0), lowStockThreshold: z.coerce.number().int().nonnegative().default(5), featured: z.boolean().default(false), categoryId: z.string().cuid().optional().nullable(), imageIds: z.array(z.string().cuid()).max(10).optional() });
app.use(helmet({ crossOriginResourcePolicy: { policy: "cross-origin" } }));
app.use(cors({ origin: env.CORS_ORIGIN.split(","), credentials: false }));
app.use(express.json({ limit: "1mb" }));
app.use(rateLimit({ windowMs: 15 * 60e3, max: 300, standardHeaders: true, legacyHeaders: false }));
app.use("/uploads", express.static(uploadDir, { maxAge: "1y", immutable: true }));
// OTP Auth Routes
app.post("/api/auth/otp/send", rateLimit({ windowMs: 15 * 60e3, max: 10 }), asyncRoute(async (req, res) => {
    const { phone } = z.object({ phone: z.string().min(10).max(15) }).parse(req.body);
    const normalizedPhone = phone.replace(/\D/g, "");
    const settings = await prisma.setting.findMany();
    const otpProvider = createOTPProvider(settings);
    // Get OTP config from settings
    const getSetting = (key, defaultValue) => {
        const s = settings.find(setting => setting.key === key);
        return s ? s.value : defaultValue;
    };
    const otpLength = Number(getSetting("OTP_LENGTH", 6));
    const otpExpiry = Number(getSetting("OTP_EXPIRY", 300000)); // 5 minutes in ms
    const maxAttempts = Number(getSetting("OTP_MAX_ATTEMPTS", 5));
    // Invalidate any existing OTPs for this phone
    await prisma.oTP.deleteMany({ where: { phone: normalizedPhone, usedAt: null } });
    // Generate and save new OTP
    const otp = generateOTP(otpLength);
    const hashedOtp = tokenHash(otp);
    await prisma.oTP.create({
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
app.post("/api/auth/otp/verify", rateLimit({ windowMs: 15 * 60e3, max: 20 }), asyncRoute(async (req, res) => {
    const { phone, otp, name: newUserName } = z.object({ phone: z.string().min(10).max(15), otp: z.string().min(4).max(8), name: z.string().min(2).optional() }).parse(req.body);
    const normalizedPhone = phone.replace(/\D/g, "");
    const settings = await prisma.setting.findMany();
    const maxAttempts = Number(settings.find(s => s.key === "OTP_MAX_ATTEMPTS")?.value ?? 5);
    // Find OTP record
    const otpRecord = await prisma.oTP.findFirst({
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
        await prisma.oTP.update({ where: { id: otpRecord.id }, data: { attempts: { increment: 1 } } });
        res.status(400).json({ message: "OTP expired. Please request a new OTP" });
        return;
    }
    // Verify OTP
    const hashedOtp = tokenHash(otp);
    if (otpRecord.otp !== hashedOtp) {
        await prisma.oTP.update({ where: { id: otpRecord.id }, data: { attempts: { increment: 1 } } });
        res.status(400).json({ message: "Invalid OTP" });
        return;
    }
    // Mark OTP as used
    await prisma.oTP.update({ where: { id: otpRecord.id }, data: { usedAt: new Date() } });
    // Find or create user
    let user = await prisma.user.findUnique({ where: { phone: normalizedPhone } });
    if (!user) {
        // Create new user
        user = await prisma.user.create({
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
    const refreshToken = await issueRefresh(user.id);
    res.json({
        accessToken,
        refreshToken,
        user: publicUser(user),
    });
}));
app.post("/api/auth/login", rateLimit({ windowMs: 15 * 60e3, max: 10 }), asyncRoute(async (req, res) => { const input = z.object({ email: z.string().email(), password: z.string().min(8) }).parse(req.body); const user = await prisma.user.findUnique({ where: { email: input.email.toLowerCase() } }); if (!user || !user.passwordHash || !(await bcrypt.compare(input.password, user.passwordHash))) {
    res.status(401).json({ message: "Invalid credentials" });
    return;
} res.json({ accessToken: issueAccess(user), refreshToken: await issueRefresh(user.id), user: publicUser(user) }); }));
app.post("/api/auth/refresh", asyncRoute(async (req, res) => { const input = z.object({ refreshToken: z.string().min(20) }).parse(req.body); const row = await prisma.refreshToken.findUnique({ where: { tokenHash: tokenHash(input.refreshToken) }, include: { user: true } }); if (!row || row.revokedAt || row.expiresAt < new Date()) {
    res.status(401).json({ message: "Invalid refresh token" });
    return;
} await prisma.refreshToken.update({ where: { id: row.id }, data: { revokedAt: new Date() } }); res.json({ accessToken: issueAccess(row.user), refreshToken: await issueRefresh(row.userId), user: publicUser(row.user) }); }));
app.post("/api/auth/logout", asyncRoute(async (req, res) => { const input = z.object({ refreshToken: z.string().min(20) }).parse(req.body); await prisma.refreshToken.updateMany({ where: { tokenHash: tokenHash(input.refreshToken) }, data: { revokedAt: new Date() } }); res.status(204).end(); }));
app.post("/api/auth/password-reset", asyncRoute(async (req, res) => { const { email: address } = z.object({ email: z.string().email() }).parse(req.body); const user = await prisma.user.findUnique({ where: { email: address.toLowerCase() } }); if (user) {
    const token = randomBytes(32).toString("base64url");
    await prisma.passwordReset.create({ data: { userId: user.id, tokenHash: tokenHash(token), expiresAt: new Date(Date.now() + 3600e3) } });
    await email(user.email, "Reset your AutoForge password", `Use this reset token within one hour: ${token}`);
} res.status(202).json({ message: "If the account exists, reset instructions were sent." }); }));
app.post("/api/auth/password-reset/confirm", asyncRoute(async (req, res) => { const input = z.object({ token: z.string().min(20), password: z.string().min(8) }).parse(req.body); const reset = await prisma.passwordReset.findUnique({ where: { tokenHash: tokenHash(input.token) } }); if (!reset || reset.usedAt || reset.expiresAt < new Date()) {
    res.status(400).json({ message: "Invalid or expired reset token" });
    return;
} await prisma.$transaction([prisma.user.update({ where: { id: reset.userId }, data: { passwordHash: await bcrypt.hash(input.password, 12) } }), prisma.passwordReset.update({ where: { id: reset.id }, data: { usedAt: new Date() } }), prisma.refreshToken.updateMany({ where: { userId: reset.userId }, data: { revokedAt: new Date() } })]); res.status(204).end(); }));
app.get("/api/products", asyncRoute(async (req, res) => { const q = z.string().optional().parse(req.query.q); res.json(await prisma.product.findMany({ where: q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { sku: { contains: q, mode: "insensitive" } }] } : undefined, include: { category: true, images: { include: { media: true }, orderBy: { sortOrder: "asc" } } }, orderBy: { createdAt: "desc" } })); }));
app.get("/api/products/:id", asyncRoute(async (req, res) => { const p = await prisma.product.findUnique({ where: idSchema.parse(req.params), include: { category: true, images: { include: { media: true } }, inventoryMovements: { orderBy: { createdAt: "desc" } } } }); if (!p) {
    res.status(404).json({ message: "Product not found" });
    return;
} res.json(p); }));
app.post("/api/products", auth, admin, asyncRoute(async (req, res) => { const d = productSchema.parse(req.body); const { imageIds, ...productData } = d; const p = await prisma.product.create({ data: { ...productData, images: imageIds ? { create: imageIds.map((mediaId, sortOrder) => ({ mediaId, sortOrder })) } : undefined } }); if (d.stockQuantity)
    await prisma.inventoryMovement.create({ data: { productId: p.id, delta: d.stockQuantity, quantityAfter: d.stockQuantity, action: InventoryAction.RECEIVED, note: "Initial stock" } }); res.status(201).json(p); }));
app.patch("/api/products/:id", auth, admin, asyncRoute(async (req, res) => { const d = productSchema.partial().parse(req.body); const { imageIds, ...productData } = d; const p = await prisma.product.update({ where: idSchema.parse(req.params), data: { ...productData, images: imageIds ? { deleteMany: {}, create: imageIds.map((mediaId, sortOrder) => ({ mediaId, sortOrder })) } : undefined } }); res.json(p); }));
app.delete("/api/products/:id", auth, admin, asyncRoute(async (req, res) => { await prisma.product.delete({ where: idSchema.parse(req.params) }); res.status(204).end(); }));
app.post("/api/products/:id/inventory", auth, admin, asyncRoute(async (req, res) => { const input = z.object({ delta: z.number().int(), action: z.nativeEnum(InventoryAction).default(InventoryAction.ADJUSTMENT), note: z.string().max(500).optional() }).parse(req.body); const result = await prisma.$transaction(async (tx) => { const p = await tx.product.findUniqueOrThrow({ where: idSchema.parse(req.params) }); const next = p.stockQuantity + input.delta; if (next < 0)
    throw new Error("Inventory cannot be negative"); await tx.product.update({ where: { id: p.id }, data: { stockQuantity: next } }); return tx.inventoryMovement.create({ data: { productId: p.id, delta: input.delta, quantityAfter: next, action: input.action, note: input.note } }); }); res.json(result); }));
app.get("/api/inventory/analytics", auth, admin, asyncRoute(async (_req, res) => { const [products, out, movements] = await Promise.all([prisma.product.findMany({ select: { stockQuantity: true, lowStockThreshold: true } }), prisma.product.count({ where: { stockQuantity: 0 } }), prisma.inventoryMovement.findMany({ take: 20, orderBy: { createdAt: "desc" }, include: { product: true } })]); res.json({ lowStock: products.filter(p => p.stockQuantity > 0 && p.stockQuantity <= p.lowStockThreshold).length, outOfStock: out, recentMovements: movements }); }));
function crud(path, model) { const db = () => prisma[model]; app.get(path, asyncRoute(async (_q, res) => { res.json(await db().findMany({ orderBy: model === "brandCollaboration" ? { sortOrder: "asc" } : undefined, include: model === "category" ? { image: true } : undefined })); })); app.post(path, auth, admin, asyncRoute(async (req, res) => { res.status(201).json(await db().create({ data: req.body })); })); app.patch(`${path}/:id`, auth, admin, asyncRoute(async (req, res) => { res.json(await db().update({ where: idSchema.parse(req.params), data: req.body })); })); app.delete(`${path}/:id`, auth, admin, asyncRoute(async (req, res) => { await db().delete({ where: idSchema.parse(req.params) }); res.status(204).end(); })); }
crud("/api/categories", "category");
crud("/api/brands", "brandCollaboration");
crud("/api/homepage", "homepageBlock");
app.get("/api/orders", auth, admin, asyncRoute(async (_req, res) => res.json(await prisma.order.findMany({ include: { user: true, items: true, payment: true, shipment: true, invoice: true, billingAddress: true, shippingAddress: true }, orderBy: { createdAt: "desc" } }))));
app.patch("/api/orders/:id/status", auth, admin, asyncRoute(async (req, res) => { const status = orderStatus.parse(req.body.status); const order = await prisma.order.update({ where: idSchema.parse(req.params), data: { status }, include: { user: true, items: true, payment: true, shipment: true } }); if (status === OrderStatus.SHIPPED)
    await email(order.user.email, "Your AutoForge order has shipped", `Order ${order.number} is on its way.`); res.json(order); }));
app.post("/api/orders", auth, asyncRoute(async (req, res) => {
    const input = z.object({
        items: z.array(z.object({ productId: z.string().cuid(), quantity: z.number().int().positive() })).min(1),
        shippingAddressId: z.string().cuid(),
        billingAddressId: z.string().cuid().optional(),
    }).parse(req.body);
    const order = await prisma.$transaction(async (tx) => {
        let subtotal = 0;
        let tax = 0;
        const lines = [];
        for (const line of input.items) {
            const product = await tx.product.findUniqueOrThrow({ where: { id: line.productId } });
            if (product.stockQuantity < line.quantity)
                throw new Error(`${product.name} is out of stock`);
            const itemTotal = Number(product.price) * line.quantity;
            const itemTax = (itemTotal * Number(product.gstPercentage || 18)) / 100;
            subtotal += itemTotal;
            tax += itemTax;
            lines.push({
                productId: product.id, productName: product.name, sku: product.sku,
                quantity: line.quantity, unitPrice: Number(product.price),
                hsnCode: product.hsnCode, gstPercentage: Number(product.gstPercentage || 18)
            });
        }
        const shipping = 0; // Add shipping calculation later
        const total = subtotal + tax + shipping;
        return tx.order.create({
            data: {
                number: `AF-${Date.now().toString().slice(-8)}`, userId: req.user.sub,
                subtotal, tax, shipping, total,
                shippingAddressId: input.shippingAddressId,
                billingAddressId: input.billingAddressId || input.shippingAddressId,
                items: { create: lines }
            },
            include: { user: true, items: true, billingAddress: true, shippingAddress: true }
        });
    });
    res.status(201).json(order);
}));
// Payment Routes
app.post("/api/payments/razorpay/create-order", auth, asyncRoute(async (req, res) => {
    const { orderId } = z.object({ orderId: z.string().cuid() }).parse(req.body);
    const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId, userId: req.user.sub } });
    if (!razorpay) {
        res.status(500).json({ message: "Razorpay not configured" });
        return;
    }
    const amount = Math.round(Number(order.total) * 100);
    const rzOrder = await razorpay.orders.create({
        amount, currency: "INR", receipt: order.id, notes: { orderNumber: order.number }
    });
    await prisma.payment.upsert({
        where: { orderId },
        update: { razorpayOrderId: rzOrder.id, amount: order.total },
        create: { orderId, razorpayOrderId: rzOrder.id, amount: order.total, provider: PaymentProvider.RAZORPAY, status: PaymentStatus.PENDING }
    });
    res.json({ orderId: rzOrder.id, amount, keyId: env.RAZORPAY_KEY_ID });
}));
app.post("/api/payments/razorpay/verify", auth, asyncRoute(async (req, res) => {
    const { orderId, paymentId, signature } = z.object({
        orderId: z.string().cuid(), paymentId: z.string(), signature: z.string()
    }).parse(req.body);
    const order = await prisma.order.findUniqueOrThrow({ where: { id: orderId, userId: req.user.sub }, include: { payment: true, user: true, items: true } });
    const payment = order.payment;
    if (!razorpay || !payment) {
        res.status(400).json({ message: "Invalid order" });
        return;
    }
    // Verify signature
    const body = payment.razorpayOrderId + "|" + paymentId;
    const expectedSignature = createHmac("sha256", env.RAZORPAY_KEY_SECRET).update(body).digest("hex");
    if (expectedSignature !== signature) {
        await prisma.payment.update({ where: { orderId }, data: { status: PaymentStatus.FAILED, failureReason: "Invalid signature" } });
        res.status(400).json({ message: "Payment verification failed" });
        return;
    }
    // Update payment and order status
    await prisma.$transaction(async (tx) => {
        await tx.payment.update({
            where: { orderId },
            data: { razorpayPaymentId: paymentId, razorpaySignature: signature, status: PaymentStatus.SUCCESS, transactionId: paymentId, transactionTime: new Date() }
        });
        if (payment.status === PaymentStatus.SUCCESS)
            return;
        for (const item of order.items) {
            const product = await tx.product.findUniqueOrThrow({ where: { id: item.productId } });
            if (product.stockQuantity < item.quantity)
                throw new Error(`Stock unavailable for ${item.productName}`);
            await tx.product.update({ where: { id: product.id }, data: { stockQuantity: { decrement: item.quantity } } });
            await tx.inventoryMovement.create({ data: { productId: product.id, delta: -item.quantity, quantityAfter: product.stockQuantity - item.quantity, action: InventoryAction.ORDER_PLACED, note: `Verified payment ${paymentId}` } });
        }
        await tx.order.update({ where: { id: orderId }, data: { status: OrderStatus.CONFIRMED, paidAt: new Date(), confirmedAt: new Date() } });
        // Generate invoice
        await tx.invoice.create({
            data: {
                number: `INV-${Date.now().toString().slice(-8)}`, orderId,
                gstin: env.GSTIN || "",
                totalAmount: order.total,
                cgst: Number(order.tax) / 2,
                sgst: Number(order.tax) / 2,
                igst: 0,
            }
        });
    });
    await prisma.cartItem.deleteMany({ where: { userId: req.user.sub } });
    // Send confirmation email
    await email(order.user.email, "AutoForge payment successful", `Your payment for order ${order.number} was successful.`);
    res.json({ message: "Payment successful" });
}));
app.get("/api/orders/:id", auth, asyncRoute(async (req, res) => {
    const order = await prisma.order.findUniqueOrThrow({
        where: { id: idSchema.parse(req.params).id, userId: req.user.sub },
        include: { items: true, payment: true, shipment: true, invoice: true, billingAddress: true, shippingAddress: true }
    });
    res.json(order);
}));
app.get("/api/orders/track/:number", asyncRoute(async (req, res) => {
    const order = await prisma.order.findUniqueOrThrow({
        where: { number: String(req.params.number) },
        include: { items: true, payment: true, shipment: true, invoice: true }
    });
    res.json(order);
}));
// Product Reviews
app.get("/api/products/:id/reviews", asyncRoute(async (req, res) => {
    const reviews = await prisma.productReview.findMany({
        where: { productId: idSchema.parse(req.params).id, approved: true },
        include: { user: true, images: { include: { media: true } } },
        orderBy: { createdAt: "desc" }
    });
    res.json(reviews);
}));
app.post("/api/products/:id/reviews", auth, asyncRoute(async (req, res) => {
    const { orderItemId, rating, title, description, imageIds } = z.object({
        orderItemId: z.string().cuid(), rating: z.number().int().min(1).max(5), title: z.string().optional(),
        description: z.string().optional(), imageIds: z.array(z.string().cuid()).max(5).optional()
    }).parse(req.body);
    // Verify user bought this product
    const orderItem = await prisma.orderItem.findFirstOrThrow({
        where: { id: orderItemId, order: { userId: req.user.sub }, productId: idSchema.parse(req.params).id }
    });
    const review = await prisma.productReview.create({
        data: {
            productId: idSchema.parse(req.params).id, userId: req.user.sub, orderItemId, rating, title, description,
            images: imageIds ? { create: imageIds.map((mediaId, sortOrder) => ({ mediaId, sortOrder })) } : undefined
        },
        include: { images: { include: { media: true } } }
    });
    res.status(201).json(review);
}));
app.patch("/api/reviews/:id/approve", auth, admin, asyncRoute(async (req, res) => {
    const review = await prisma.productReview.update({
        where: { id: idSchema.parse(req.params).id },
        data: { approved: true }
    });
    res.json(review);
}));
app.patch("/api/reviews/:id/reply", auth, admin, asyncRoute(async (req, res) => {
    const { reply } = z.object({ reply: z.string() }).parse(req.body);
    const review = await prisma.productReview.update({
        where: { id: idSchema.parse(req.params).id },
        data: { adminReply: reply }
    });
    res.json(review);
}));
app.patch("/api/reviews/:id/helpful", asyncRoute(async (req, res) => {
    const review = await prisma.productReview.update({
        where: { id: idSchema.parse(req.params).id },
        data: { helpfulVotes: { increment: 1 } }
    });
    res.json(review);
}));
class MockShippingProvider {
    async createShipment(order) { return { awbNumber: `AWB-${Date.now()}`, trackingNumber: `TRK-${Date.now()}` }; }
    async getTracking(awbNumber) { return { status: "IN_TRANSIT" }; }
}
function getShippingProvider() { return new MockShippingProvider(); }
app.post("/api/orders/:id/ship", auth, admin, asyncRoute(async (req, res) => {
    const order = await prisma.order.findUniqueOrThrow({ where: idSchema.parse(req.params), include: { shippingAddress: true, items: true } });
    const provider = getShippingProvider();
    const shipmentData = await provider.createShipment(order);
    const shipment = await prisma.shipment.upsert({
        where: { orderId: order.id },
        update: { ...shipmentData, status: ShipmentStatus.PICKED },
        create: { orderId: order.id, ...shipmentData, status: ShipmentStatus.PICKED, courierName: "Mock Courier" }
    });
    res.json(shipment);
}));
app.get("/api/customers", auth, admin, asyncRoute(async (_req, res) => res.json(await prisma.user.findMany({ where: { role: Role.CUSTOMER }, include: { addresses: true, orders: true } }))));
app.get("/api/me", auth, asyncRoute(async (req, res) => {
    const user = await prisma.user.findUnique({
        where: { id: req.user.sub },
        include: { addresses: true, orders: { include: { items: true } } }
    });
    if (!user) {
        res.status(404).json({ message: "User not found" });
        return;
    }
    res.json(publicUser(user));
}));
app.patch("/api/me", auth, asyncRoute(async (req, res) => {
    const data = z.object({ name: z.string().optional(), email: z.string().optional() }).parse(req.body);
    const user = await prisma.user.update({
        where: { id: req.user.sub },
        data,
    });
    res.json(publicUser(user));
}));
app.get("/api/me/orders", auth, asyncRoute(async (req, res) => {
    const orders = await prisma.order.findMany({
        where: { userId: req.user.sub },
        include: { items: true },
        orderBy: { createdAt: "desc" }
    });
    res.json(orders);
}));
app.get("/api/me/addresses", auth, asyncRoute(async (req, res) => {
    const addresses = await prisma.address.findMany({
        where: { userId: req.user.sub },
    });
    res.json(addresses);
}));
app.get("/api/cart", auth, asyncRoute(async (req, res) => res.json(await prisma.cartItem.findMany({ where: { userId: req.user.sub }, include: { product: { include: { images: { include: { media: true } } } } } }))));
app.post("/api/cart", auth, asyncRoute(async (req, res) => { const { productId, quantity } = z.object({ productId: z.string().cuid(), quantity: z.number().int().min(1).default(1) }).parse(req.body); res.status(201).json(await prisma.cartItem.upsert({ where: { userId_productId: { userId: req.user.sub, productId } }, update: { quantity: { increment: quantity } }, create: { userId: req.user.sub, productId, quantity } })); }));
app.patch("/api/cart", auth, asyncRoute(async (req, res) => { const { productId, quantity } = z.object({ productId: z.string().cuid(), quantity: z.number().int().min(1) }).parse(req.body); res.json(await prisma.cartItem.update({ where: { userId_productId: { userId: req.user.sub, productId } }, data: { quantity } })); }));
app.delete("/api/cart/:id", auth, asyncRoute(async (req, res) => { await prisma.cartItem.delete({ where: { userId_productId: { userId: req.user.sub, productId: idSchema.parse(req.params).id } } }); res.status(204).end(); }));
app.get("/api/wishlist", auth, asyncRoute(async (req, res) => res.json(await prisma.wishlistItem.findMany({ where: { userId: req.user.sub }, include: { product: { include: { images: { include: { media: true } } } } } }))));
app.post("/api/wishlist", auth, asyncRoute(async (req, res) => { const { productId } = z.object({ productId: z.string().cuid() }).parse(req.body); res.status(201).json(await prisma.wishlistItem.upsert({ where: { userId_productId: { userId: req.user.sub, productId } }, update: {}, create: { userId: req.user.sub, productId } })); }));
app.delete("/api/wishlist/:id", auth, asyncRoute(async (req, res) => { await prisma.wishlistItem.delete({ where: { userId_productId: { userId: req.user.sub, productId: idSchema.parse(req.params).id } } }); res.status(204).end(); }));
app.post("/api/me/addresses", auth, asyncRoute(async (req, res) => {
    const data = z.object({
        line1: z.string(),
        line2: z.string().optional(),
        city: z.string(),
        state: z.string(),
        postalCode: z.string(),
        country: z.string(),
    }).parse(req.body);
    const address = await prisma.address.create({
        data: { ...data, userId: req.user.sub },
    });
    res.status(201).json(address);
}));
app.delete("/api/me/addresses/:id", auth, asyncRoute(async (req, res) => {
    const { id } = idSchema.parse(req.params);
    await prisma.address.delete({ where: { id, userId: req.user.sub } });
    res.status(204).end();
}));
app.get("/api/settings", asyncRoute(async (_req, res) => res.json(await prisma.setting.findMany())));
app.put("/api/settings/:key", auth, admin, asyncRoute(async (req, res) => { const value = z.unknown().parse(req.body.value); const key = String(req.params.key); res.json(await prisma.setting.upsert({ where: { key }, update: { value: value }, create: { key, value: value } })); }));
app.post("/api/media", auth, admin, upload.array("files", 10), asyncRoute(async (req, res) => { await mkdir(uploadDir, { recursive: true }); const files = req.files; if (!files?.length) {
    res.status(400).json({ message: "At least one image is required" });
    return;
} const media = await Promise.all(files.map(async (f) => { const ext = path.extname(f.originalname).toLowerCase() || ".bin"; const key = `${randomBytes(16).toString("hex")}${ext}`; await writeFile(path.join(uploadDir, key), f.buffer); return prisma.media.create({ data: { key, url: `/uploads/${key}`, filename: f.originalname, mimeType: f.mimetype, size: f.size } }); })); res.status(201).json(media); }));
app.get("/api/media", auth, admin, asyncRoute(async (_req, res) => res.json(await prisma.media.findMany({ orderBy: { createdAt: "desc" } }))));
app.patch("/api/media/:id", auth, admin, asyncRoute(async (req, res) => res.json(await prisma.media.update({ where: idSchema.parse(req.params), data: z.object({ filename: z.string().min(1).optional(), altText: z.string().optional().nullable() }).parse(req.body) }))));
app.delete("/api/media/:id", auth, admin, asyncRoute(async (req, res) => { const m = await prisma.media.delete({ where: idSchema.parse(req.params) }); await unlink(path.join(uploadDir, m.key)).catch(() => undefined); res.status(204).end(); }));
const enquirySchema = z.object({ type: z.enum(["contact", "sell", "bulk"]), name: z.string().min(2), email: z.string().email(), phone: z.string().max(30).optional(), companyName: z.string().max(160).optional(), message: z.string().min(5).max(5000), details: z.record(z.unknown()).optional() });
app.post("/api/enquiries", asyncRoute(async (req, res) => { const input = enquirySchema.parse(req.body); const enquiry = await prisma.enquiry.create({ data: input }); await Promise.all([email(input.email, "We received your AutoForge enquiry", `Thanks ${input.name}; our team will respond shortly.`), email(env.MAIL_FROM ?? "", `New ${input.type} enquiry`, `${input.name}: ${input.message}`)]); res.status(201).json(enquiry); }));
app.get("/api/enquiries", auth, admin, asyncRoute(async (req, res) => { const q = z.string().optional().parse(req.query.q); const status = z.nativeEnum(EnquiryStatus).optional().parse(req.query.status); res.json(await prisma.enquiry.findMany({ where: { type: "sell", status, OR: q ? [{ name: { contains: q, mode: "insensitive" } }, { email: { contains: q, mode: "insensitive" } }, { companyName: { contains: q, mode: "insensitive" } }] : undefined }, include: { notes: true }, orderBy: { createdAt: "desc" } })); }));
app.patch("/api/enquiries/:id", auth, admin, asyncRoute(async (req, res) => { const data = z.object({ status: z.nativeEnum(EnquiryStatus).optional() }).parse(req.body); res.json(await prisma.enquiry.update({ where: idSchema.parse(req.params), data, include: { notes: true } })); }));
app.post("/api/enquiries/:id/notes", auth, admin, asyncRoute(async (req, res) => { const { body } = z.object({ body: z.string().min(1).max(5000) }).parse(req.body); res.status(201).json(await prisma.enquiryNote.create({ data: { enquiryId: idSchema.parse(req.params).id, body } })); }));
app.delete("/api/enquiries/:id", auth, admin, asyncRoute(async (req, res) => { await prisma.enquiry.delete({ where: idSchema.parse(req.params) }); res.status(204).end(); }));
app.get("/api/enquiries/export.csv", auth, admin, asyncRoute(async (_req, res) => { const rows = await prisma.enquiry.findMany({ where: { type: "sell" }, orderBy: { createdAt: "desc" } }); const csv = ["Name,Company,Email,Phone,Status,Created", ...rows.map(r => [r.name, r.companyName ?? "", r.email, r.phone ?? "", r.status, r.createdAt.toISOString()].map(v => `\"${v.replaceAll("\"", "\"\"")}\"`).join(","))].join("\n"); res.setHeader("Content-Type", "text/csv"); res.attachment("seller-enquiries.csv").send(csv); }));
app.use((err, _req, res, _next) => { console.error(err); if (err instanceof z.ZodError) {
    res.status(422).json({ message: "Validation failed", errors: err.flatten() });
    return;
} const message = err instanceof Error ? err.message : "Unexpected server error"; res.status(message.includes("not found") ? 404 : 500).json({ message }); });
app.listen(env.PORT, () => console.log(`AutoForge API listening on ${env.PORT}`));
