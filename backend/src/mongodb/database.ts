import { randomBytes } from "node:crypto";
import type { ClientSession, Model } from "mongoose";
import mongoose from "mongoose";
import {
  AddressModel,
  BrandCollaborationModel,
  CartItemModel,
  CategoryModel,
  EnquiryModel,
  EnquiryNoteModel,
  HomepageBlockModel,
  InventoryMovementModel,
  InvoiceModel,
  MediaModel,
  OrderItemModel,
  OrderModel,
  OtpModel,
  PasswordResetModel,
  PaymentModel,
  ProductImageModel,
  ProductModel,
  ProductReviewImageModel,
  ProductReviewModel,
  RefreshTokenModel,
  SettingModel,
  ShipmentModel,
  UserModel,
  WebhookEventModel,
  WishlistItemModel,
  type JsonValue,
} from "./models.js";

export const Role = { CUSTOMER: "CUSTOMER", ADMIN: "ADMIN" } as const;
export type Role = (typeof Role)[keyof typeof Role];
export const OrderStatus = { PENDING: "PENDING", CONFIRMED: "CONFIRMED", PACKED: "PACKED", SHIPPED: "SHIPPED", DELIVERED: "DELIVERED", CANCELLED: "CANCELLED", REFUNDED: "REFUNDED" } as const;
export const InventoryAction = { RECEIVED: "RECEIVED", ADJUSTMENT: "ADJUSTMENT", ORDER_CANCELLED: "ORDER_CANCELLED", ORDER_PLACED: "ORDER_PLACED", MARKED_OUT_OF_STOCK: "MARKED_OUT_OF_STOCK" } as const;
export const EnquiryStatus = { NEW: "NEW", CONTACTED: "CONTACTED", APPROVED: "APPROVED", REJECTED: "REJECTED", ON_HOLD: "ON_HOLD" } as const;
export const PaymentStatus = { PENDING: "PENDING", SUCCESS: "SUCCESS", FAILED: "FAILED", REFUNDED: "REFUNDED" } as const;
export const PaymentProvider = { RAZORPAY: "RAZORPAY" } as const;
export const ShipmentStatus = { PENDING: "PENDING", PICKED: "PICKED", IN_TRANSIT: "IN_TRANSIT", OUT_FOR_DELIVERY: "OUT_FOR_DELIVERY", DELIVERED: "DELIVERED", CANCELLED: "CANCELLED" } as const;

type JsonRecord = Record<string, unknown>;
type Include = Record<string, boolean | { include?: Include; orderBy?: JsonRecord; select?: JsonRecord }>;
type QueryArgs = { where?: JsonRecord; include?: Include; orderBy?: JsonRecord; select?: JsonRecord; take?: number };
type CreateArgs = { data: JsonRecord; include?: Include };
type UpdateArgs = { where: JsonRecord; data: JsonRecord; include?: Include };
type UpsertArgs = { where: JsonRecord; update: JsonRecord; create: JsonRecord; include?: Include };

export interface BaseRow { id: string; createdAt: Date; updatedAt: Date }
export interface UserRow extends BaseRow { email: string; passwordHash: string | null; name: string; phone: string | null; role: Role; addresses: AddressRow[]; orders: OrderRow[] }
export interface OtpRow extends BaseRow { phone: string; otp: string; userId: string | null; expiresAt: Date; attempts: number; usedAt: Date | null }
export interface RefreshTokenRow extends BaseRow { tokenHash: string; userId: string; rememberMe: boolean; expiresAt: Date; revokedAt: Date | null; user: UserRow }
export interface PasswordResetRow extends BaseRow { tokenHash: string; userId: string; expiresAt: Date; usedAt: Date | null }
export interface AddressRow extends BaseRow { userId: string; line1: string; line2: string | null; city: string; state: string; postalCode: string; country: string }
export interface MediaRow extends BaseRow { key: string; url: string; filename: string; mimeType: string; size: number; altText: string | null }
export interface CategoryRow extends BaseRow { name: string; slug: string; imageId: string | null; image: MediaRow | null; _count: { products: number } }
export interface ProductImageRow extends BaseRow { productId: string; mediaId: string; sortOrder: number; media: MediaRow }
export interface ProductRow extends BaseRow { name: string; slug: string; sku: string; description: string | null; specifications?: JsonRecord; brand: string | null; price: string | number; compareAtPrice: string | number | null; stockQuantity: number; lowStockThreshold: number; featured: boolean; categoryId: string | null; hsnCode: string | null; gstPercentage: string | number; category: CategoryRow | null; images: ProductImageRow[]; inventoryMovements: InventoryMovementRow[] }
export interface InventoryMovementRow extends BaseRow { productId: string; delta: number; quantityAfter: number; action: string; note: string | null; product: ProductRow }
export interface CartItemRow extends BaseRow { userId: string; productId: string; quantity: number; product: ProductRow }
export interface WishlistItemRow extends BaseRow { userId: string; productId: string; product: ProductRow }
export interface OrderItemRow extends BaseRow { orderId: string; productId: string | null; productName: string; sku: string; quantity: number; unitPrice: string; hsnCode: string | null; gstPercentage: string }
export interface PaymentRow extends BaseRow { orderId: string; provider: string; razorpayOrderId: string | null; razorpayPaymentId: string | null; razorpaySignature: string | null; transactionId: string | null; amount: string; status: string; failureReason: string | null; paymentMethod: string | null; transactionTime: Date | null }
export interface ShipmentRow extends BaseRow { orderId: string; provider: string | null; awbNumber: string | null; trackingNumber: string | null; courierName: string | null; estimatedDelivery: Date | null; status: string; labelUrl: string | null; trackingUrl: string | null }
export interface InvoiceRow extends BaseRow { number: string; orderId: string; invoiceDate: Date; gstin: string; customerGstin: string | null; totalAmount: string; cgst: string; sgst: string; igst: string; pdfUrl: string | null }
export interface OrderRow extends BaseRow { number: string; userId: string; status: string; subtotal: string; tax: string; shipping: string; total: string; billingAddressId: string | null; shippingAddressId: string | null; paidAt: Date | null; confirmedAt: Date | null; user: UserRow; items: OrderItemRow[]; payment: PaymentRow | null; shipment: ShipmentRow | null; invoice: InvoiceRow | null; billingAddress: AddressRow | null; shippingAddress: AddressRow | null }
export interface ProductReviewImageRow extends BaseRow { reviewId: string; mediaId: string; sortOrder: number; media: MediaRow }
export interface ProductReviewRow extends BaseRow { productId: string; userId: string; orderItemId: string | null; rating: number; title: string | null; description: string | null; approved: boolean; helpfulVotes: number; reported: boolean; adminReply: string | null; user: UserRow; images: ProductReviewImageRow[] }
export interface HomepageBlockRow extends BaseRow { key: string; content: unknown }
export interface BrandRow extends BaseRow { name: string; logoUrl: string; sortOrder: number; active: boolean }
export interface SettingRow extends BaseRow { key: string; value: JsonValue }
export interface EnquiryNoteRow extends BaseRow { enquiryId: string; body: string }
export interface EnquiryRow extends BaseRow { type: string; name: string; email: string; phone: string | null; companyName: string | null; status: string; details?: JsonRecord; message: string; notes: EnquiryNoteRow[] }
export interface WebhookEventRow extends BaseRow { eventId: string; eventType: string; payload: unknown; processedAt: Date }

type EntityName = "user" | "oTP" | "refreshToken" | "passwordReset" | "address" | "media" | "category" | "product" | "productImage" | "inventoryMovement" | "cartItem" | "wishlistItem" | "order" | "orderItem" | "payment" | "shipment" | "invoice" | "productReview" | "productReviewImage" | "homepageBlock" | "brandCollaboration" | "setting" | "enquiry" | "enquiryNote" | "webhookEvent";

const defaults: Partial<Record<EntityName, JsonRecord>> = {
  user: { passwordHash: null, phone: null, role: Role.CUSTOMER },
  oTP: { userId: null, attempts: 0, usedAt: null },
  product: { description: null, brand: null, compareAtPrice: null, stockQuantity: 0, lowStockThreshold: 5, featured: false, categoryId: null, hsnCode: null, gstPercentage: "18" },
  category: { imageId: null }, cartItem: { quantity: 1 }, productImage: { sortOrder: 0 },
  productReview: { orderItemId: null, title: null, description: null, approved: false, helpfulVotes: 0, reported: false, adminReply: null },
  inventoryMovement: { note: null }, order: { status: OrderStatus.PENDING, tax: "0", shipping: "0", billingAddressId: null, shippingAddressId: null, paidAt: null, confirmedAt: null },
  payment: { provider: PaymentProvider.RAZORPAY, status: PaymentStatus.PENDING, razorpayOrderId: null, razorpayPaymentId: null, razorpaySignature: null, transactionId: null, failureReason: null, paymentMethod: null, transactionTime: null },
  shipment: { provider: null, awbNumber: null, trackingNumber: null, courierName: null, estimatedDelivery: null, status: ShipmentStatus.PENDING, labelUrl: null, trackingUrl: null },
  brandCollaboration: { sortOrder: 0, active: true }, enquiry: { phone: null, companyName: null, status: EnquiryStatus.NEW }, media: { altText: null }, address: { line2: null },
};

function createId(): string { return `c${randomBytes(12).toString("hex")}`; }
function escapeRegex(value: string): string { return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); }

function normalizeWhere(where: JsonRecord = {}): JsonRecord {
  const result: JsonRecord = {};
  for (const [key, value] of Object.entries(where)) {
    if (value === undefined) continue;
    if (key === "OR" && Array.isArray(value)) { result.$or = value.map((entry) => normalizeWhere(entry as JsonRecord)); continue; }
    if (key === "userId_productId" && value && typeof value === "object") { Object.assign(result, normalizeWhere(value as JsonRecord)); continue; }
    const mongoKey = key === "id" ? "_id" : key;
    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      const operator = value as JsonRecord;
      if (typeof operator.contains === "string") result[mongoKey] = { $regex: escapeRegex(operator.contains), $options: "i" };
      else if (typeof operator.equals === "string" && operator.mode === "insensitive") result[mongoKey] = { $regex: `^${escapeRegex(operator.equals)}$`, $options: "i" };
      else result[mongoKey] = normalizeWhere(operator);
    } else result[mongoKey] = value;
  }
  return result;
}

function normalizeUpdate(data: JsonRecord): { $set: JsonRecord; $inc?: JsonRecord } {
  const set: JsonRecord = {}; const increment: JsonRecord = {};
  for (const [key, value] of Object.entries(data)) {
    if (value === undefined) continue;
    if (value && typeof value === "object" && !Array.isArray(value) && !(value instanceof Date)) {
      const operation = value as JsonRecord;
      if (typeof operation.increment === "number") { increment[key] = operation.increment; continue; }
      if (typeof operation.decrement === "number") { increment[key] = -operation.decrement; continue; }
    }
    set[key] = value;
  }
  set.updatedAt = new Date();
  return Object.keys(increment).length ? { $set: set, $inc: increment } : { $set: set };
}

function serialize(value: unknown): unknown {
  if (Array.isArray(value)) return value.map(serialize);
  if (value instanceof Date || value === null || typeof value !== "object") return value;
  const source = typeof (value as { toObject?: unknown }).toObject === "function"
    ? (value as { toObject(): JsonRecord }).toObject()
    : value as JsonRecord;
  const result: JsonRecord = {};
  for (const [key, child] of Object.entries(source)) {
    if (key === "__v") continue;
    result[key === "_id" ? "id" : key] = serialize(child);
  }
  return result;
}

class MongoDelegate<Row extends BaseRow> {
  // Mongoose models have intentionally different document interfaces. The adapter
  // normalizes all of them to typed API rows at this single boundary.
  constructor(private readonly database: MongoDatabase, readonly name: EntityName, readonly model: Model<any>, private readonly session?: ClientSession) {}
  private querySession<T extends { session(session: ClientSession | null): T }>(query: T): T { return this.session ? query.session(this.session) : query; }
  async findMany(args: QueryArgs = {}): Promise<Row[]> {
    let query = this.model.find(normalizeWhere(args.where));
    if (args.orderBy) query = query.sort(Object.fromEntries(Object.entries(args.orderBy).map(([key, direction]) => [key === "id" ? "_id" : key, direction === "desc" ? -1 : 1])));
    if (args.take) query = query.limit(args.take);
    if (args.select) query = query.select(Object.fromEntries(Object.keys(args.select).filter((key) => args.select?.[key]).map((key) => [key === "id" ? "_id" : key, 1])));
    const rows = await this.querySession(query).lean();
    return Promise.all(rows.map((row) => this.database.hydrate(this.name, serialize(row) as Row, args.include, this.session)));
  }
  async findUnique(args: QueryArgs & { where: JsonRecord }): Promise<Row | null> { return this.findFirst(args); }
  async findFirst(args: QueryArgs = {}): Promise<Row | null> {
    const rows = await this.findMany({ ...args, take: 1 }); return rows[0] ?? null;
  }
  async findUniqueOrThrow(args: QueryArgs & { where: JsonRecord }): Promise<Row> { const row = await this.findFirst(args); if (!row) throw new Error(`${this.name} not found`); return row; }
  async findFirstOrThrow(args: QueryArgs & { where: JsonRecord }): Promise<Row> {
    if (this.name === "orderItem" && args.where.order && typeof args.where.order === "object") {
      const orderWhere = args.where.order as JsonRecord; const orders = await this.database.order.findMany({ where: orderWhere });
      const { order: _order, ...where } = args.where; return this.findUniqueOrThrow({ ...args, where: { ...where, orderId: { $in: orders.map((order) => order.id) } } });
    }
    return this.findUniqueOrThrow(args);
  }
  async create(args: CreateArgs): Promise<Row> {
    const now = new Date(); const data = { ...defaults[this.name], ...args.data };
    const nestedItems = data.items as { create?: JsonRecord[] } | undefined; const nestedImages = data.images as { create?: JsonRecord[] } | undefined;
    delete data.items; delete data.images;
    const document = new this.model({ _id: this.name === "setting" ? String(data.key) : createId(), ...data, createdAt: data.createdAt ?? now, updatedAt: data.updatedAt ?? now });
    await document.save({ session: this.session }); const row = serialize(document) as Row;
    if (this.name === "order" && nestedItems?.create) await this.database.withSession(this.session).orderItem.createMany({ data: nestedItems.create.map((item) => ({ ...item, orderId: row.id })) });
    if (this.name === "productReview" && nestedImages?.create) await this.database.withSession(this.session).productReviewImage.createMany({ data: nestedImages.create.map((image) => ({ ...image, reviewId: row.id })) });
    return this.database.hydrate(this.name, row, args.include, this.session);
  }
  async createMany(args: { data: JsonRecord[] }): Promise<{ count: number }> { for (const data of args.data) await this.create({ data }); return { count: args.data.length }; }
  async update(args: UpdateArgs): Promise<Row> {
    const document = await this.querySession(this.model.findOneAndUpdate(normalizeWhere(args.where), normalizeUpdate(args.data), { new: true, runValidators: true }));
    if (!document) throw new Error(`${this.name} not found`); return this.database.hydrate(this.name, serialize(document) as Row, args.include, this.session);
  }
  async updateMany(args: UpdateArgs): Promise<{ count: number }> { const result = await this.querySession(this.model.updateMany(normalizeWhere(args.where), normalizeUpdate(args.data))); return { count: result.modifiedCount }; }
  async upsert(args: UpsertArgs): Promise<Row> { const existing = await this.findFirst({ where: args.where }); return existing ? this.update({ where: { id: existing.id }, data: args.update, include: args.include }) : this.create({ data: args.create, include: args.include }); }
  async delete(args: { where: JsonRecord }): Promise<Row> { const document = await this.querySession(this.model.findOneAndDelete(normalizeWhere(args.where))); if (!document) throw new Error(`${this.name} not found`); const row = serialize(document) as Row; await this.database.cascade(this.name, row.id, this.session); return row; }
  async deleteMany(args: { where?: JsonRecord }): Promise<{ count: number }> { const rows = await this.findMany({ where: args.where }); const result = await this.querySession(this.model.deleteMany(normalizeWhere(args.where))); for (const row of rows) await this.database.cascade(this.name, row.id, this.session); return { count: result.deletedCount }; }
  async count(args: { where?: JsonRecord } = {}): Promise<number> { return this.querySession(this.model.countDocuments(normalizeWhere(args.where))); }
}

function asModel(model: Model<any>): Model<any> { return model; }

export class MongoDatabase {
  readonly user; readonly oTP; readonly refreshToken; readonly passwordReset; readonly address; readonly media; readonly category; readonly product; readonly productImage; readonly inventoryMovement; readonly cartItem; readonly wishlistItem; readonly order; readonly orderItem; readonly payment; readonly shipment; readonly invoice; readonly productReview; readonly productReviewImage; readonly homepageBlock; readonly brandCollaboration; readonly setting; readonly enquiry; readonly enquiryNote; readonly webhookEvent;
  constructor(private readonly session?: ClientSession) {
    this.user = new MongoDelegate<UserRow>(this,"user",asModel(UserModel),session); this.oTP = new MongoDelegate<OtpRow>(this,"oTP",asModel(OtpModel),session); this.refreshToken = new MongoDelegate<RefreshTokenRow>(this,"refreshToken",asModel(RefreshTokenModel),session); this.passwordReset = new MongoDelegate<PasswordResetRow>(this,"passwordReset",asModel(PasswordResetModel),session); this.address = new MongoDelegate<AddressRow>(this,"address",asModel(AddressModel),session); this.media = new MongoDelegate<MediaRow>(this,"media",asModel(MediaModel),session); this.category = new MongoDelegate<CategoryRow>(this,"category",asModel(CategoryModel),session); this.product = new MongoDelegate<ProductRow>(this,"product",asModel(ProductModel),session); this.productImage = new MongoDelegate<ProductImageRow>(this,"productImage",asModel(ProductImageModel),session); this.inventoryMovement = new MongoDelegate<InventoryMovementRow>(this,"inventoryMovement",asModel(InventoryMovementModel),session); this.cartItem = new MongoDelegate<CartItemRow>(this,"cartItem",asModel(CartItemModel),session); this.wishlistItem = new MongoDelegate<WishlistItemRow>(this,"wishlistItem",asModel(WishlistItemModel),session); this.order = new MongoDelegate<OrderRow>(this,"order",asModel(OrderModel),session); this.orderItem = new MongoDelegate<OrderItemRow>(this,"orderItem",asModel(OrderItemModel),session); this.payment = new MongoDelegate<PaymentRow>(this,"payment",asModel(PaymentModel),session); this.shipment = new MongoDelegate<ShipmentRow>(this,"shipment",asModel(ShipmentModel),session); this.invoice = new MongoDelegate<InvoiceRow>(this,"invoice",asModel(InvoiceModel),session); this.productReview = new MongoDelegate<ProductReviewRow>(this,"productReview",asModel(ProductReviewModel),session); this.productReviewImage = new MongoDelegate<ProductReviewImageRow>(this,"productReviewImage",asModel(ProductReviewImageModel),session); this.homepageBlock = new MongoDelegate<HomepageBlockRow>(this,"homepageBlock",asModel(HomepageBlockModel),session); this.brandCollaboration = new MongoDelegate<BrandRow>(this,"brandCollaboration",asModel(BrandCollaborationModel),session); this.setting = new MongoDelegate<SettingRow>(this,"setting",asModel(SettingModel),session); this.enquiry = new MongoDelegate<EnquiryRow>(this,"enquiry",asModel(EnquiryModel),session); this.enquiryNote = new MongoDelegate<EnquiryNoteRow>(this,"enquiryNote",asModel(EnquiryNoteModel),session); this.webhookEvent = new MongoDelegate<WebhookEventRow>(this,"webhookEvent",asModel(WebhookEventModel),session);
  }
  withSession(session?: ClientSession): MongoDatabase { return session === this.session ? this : new MongoDatabase(session); }
  async hydrate<Row extends BaseRow>(name: EntityName, row: Row, include?: Include, session?: ClientSession): Promise<Row> {
    if (!include) return row; const db = this.withSession(session); const output = row as unknown as JsonRecord;
    const nested = (key: string): Include | undefined => { const option = include[key]; return option && typeof option === "object" ? option.include : undefined; };
    if (name === "user") { if (include.addresses) output["addresses"] = await db.address.findMany({where:{userId:row.id}}); if (include.orders) output["orders"] = await db.order.findMany({where:{userId:row.id},include:nested("orders")}); }
    if (name === "refreshToken" && include.user) output["user"] = await db.user.findUniqueOrThrow({where:{id:output["userId"] as string}});
    if (name === "category") { if (include.image) output["image"] = output["imageId"] ? await db.media.findUnique({where:{id:output["imageId"] as string}}) : null; if (include._count) output["_count"] = {products:await db.product.count({where:{categoryId:row.id}})}; }
    if (name === "product") { if (include.category) output["category"] = output["categoryId"] ? await db.category.findUnique({where:{id:output["categoryId"] as string}}) : null; if (include.images) output["images"] = await db.productImage.findMany({where:{productId:row.id},include:nested("images"),orderBy:typeof include.images === "object"?include.images.orderBy:undefined}); if (include.inventoryMovements) output["inventoryMovements"] = await db.inventoryMovement.findMany({where:{productId:row.id},include:nested("inventoryMovements"),orderBy:typeof include.inventoryMovements === "object"?include.inventoryMovements.orderBy:undefined}); }
    if (name === "productImage" && include.media) output["media"] = await db.media.findUniqueOrThrow({where:{id:output["mediaId"] as string}});
    if (name === "inventoryMovement" && include.product) output["product"] = await db.product.findUniqueOrThrow({where:{id:output["productId"] as string}});
    if ((name === "cartItem" || name === "wishlistItem") && include.product) output["product"] = await db.product.findUniqueOrThrow({where:{id:output["productId"] as string},include:nested("product")});
    if (name === "order") { if(include.user) output["user"]=await db.user.findUniqueOrThrow({where:{id:output["userId"] as string}}); if(include.items) output["items"]=await db.orderItem.findMany({where:{orderId:row.id}}); if(include.payment) output["payment"]=await db.payment.findUnique({where:{orderId:row.id}}); if(include.shipment) output["shipment"]=await db.shipment.findUnique({where:{orderId:row.id}}); if(include.invoice) output["invoice"]=await db.invoice.findUnique({where:{orderId:row.id}}); if(include.billingAddress) output["billingAddress"]=output["billingAddressId"]?await db.address.findUnique({where:{id:output["billingAddressId"] as string}}):null; if(include.shippingAddress) output["shippingAddress"]=output["shippingAddressId"]?await db.address.findUnique({where:{id:output["shippingAddressId"] as string}}):null; }
    if (name === "productReview") { if(include.user) output["user"]=await db.user.findUniqueOrThrow({where:{id:output["userId"] as string}}); if(include.images) output["images"]=await db.productReviewImage.findMany({where:{reviewId:row.id},include:nested("images")}); }
    if (name === "productReviewImage" && include.media) output["media"]=await db.media.findUniqueOrThrow({where:{id:output["mediaId"] as string}});
    if (name === "enquiry" && include.notes) output["notes"]=await db.enquiryNote.findMany({where:{enquiryId:row.id}});
    return output as unknown as Row;
  }
  async cascade(name: EntityName, id: string, session?: ClientSession): Promise<void> { const db=this.withSession(session); if(name==="product"){await Promise.all([db.productImage.deleteMany({where:{productId:id}}),db.inventoryMovement.deleteMany({where:{productId:id}}),db.cartItem.deleteMany({where:{productId:id}}),db.wishlistItem.deleteMany({where:{productId:id}}),db.productReview.deleteMany({where:{productId:id}})]);} if(name==="enquiry")await db.enquiryNote.deleteMany({where:{enquiryId:id}}); if(name==="productReview")await db.productReviewImage.deleteMany({where:{reviewId:id}}); }
  async $transaction<T>(operation: ((database: MongoDatabase) => Promise<T>) | Promise<unknown>[]): Promise<T> {
    if(Array.isArray(operation)) return Promise.all(operation) as Promise<T>;
    if(process.env.MONGODB_TRANSACTIONS !== "true") return operation(this);
    return mongoose.connection.transaction((session)=>operation(this.withSession(session))) as Promise<T>;
  }
  async ping(): Promise<void> { await mongoose.connection.db?.admin().ping(); }
}

export const mongo = new MongoDatabase();
