import mongoose, { Schema, type Model } from "mongoose";

const { model, models } = mongoose;

export type JsonValue =
  | string
  | number
  | boolean
  | null
  | JsonValue[]
  | { [key: string]: JsonValue };

export interface MongoSourceDocument {
  _id: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface UserDocument extends MongoSourceDocument {
  email: string;
  passwordHash?: string | null;
  name: string;
  phone?: string | null;
  role: "CUSTOMER" | "ADMIN";
}

export interface ProductDocument extends MongoSourceDocument {
  name: string;
  slug: string;
  sku: string;
  description?: string | null;
  specifications?: Record<string, unknown>;
  brand?: string | null;
  price: string;
  compareAtPrice?: string | null;
  stockQuantity: number;
  lowStockThreshold: number;
  featured: boolean;
  categoryId?: string | null;
  hsnCode?: string | null;
  gstPercentage: string;
}

export interface CategoryDocument extends MongoSourceDocument {
  name: string;
  slug: string;
  imageId?: string | null;
}

export interface MediaDocument extends MongoSourceDocument {
  key: string;
  url: string;
  provider?: "local" | "cloudinary" | "external";
  publicId?: string | null;
  secureUrl?: string | null;
  resourceType?: "image";
  format?: string | null;
  width?: number | null;
  height?: number | null;
  bytes?: number | null;
  version?: number | null;
  originalFilename?: string | null;
  filename: string;
  mimeType: string;
  size: number;
  altText?: string | null;
}

export interface OrderDocument extends MongoSourceDocument {
  number: string;
  userId: string;
  status: string;
  subtotal: string;
  tax: string;
  shipping: string;
  total: string;
  billingAddressId?: string | null;
  shippingAddressId?: string | null;
  paidAt?: Date | null;
  confirmedAt?: Date | null;
}

interface FlexibleDocument extends MongoSourceDocument {
  [key: string]: unknown;
}

const baseFields = {
  _id: { type: String, required: true },
  createdAt: { type: Date },
  updatedAt: { type: Date },
} as const;

function sourceSchema<T extends MongoSourceDocument>(
  fields: Record<string, unknown>,
  collection: string,
): Schema<T> {
  return new Schema<T>(
    { ...baseFields, ...fields },
    {
      collection,
      versionKey: false,
      strict: true,
      timestamps: false,
    },
  );
}

function sourceModel<T extends MongoSourceDocument>(
  name: string,
  schema: Schema<T>,
): Model<T> {
  return (models[name] as Model<T> | undefined) ?? model<T>(name, schema);
}

const userSchema = sourceSchema<UserDocument>(
  {
    email: { type: String, required: true, unique: true, index: true },
    passwordHash: { type: String, default: null },
    name: { type: String, required: true },
    phone: { type: String, default: null },
    role: { type: String, enum: ["CUSTOMER", "ADMIN"], required: true, index: true },
  },
  "users",
);
userSchema.index(
  { phone: 1 },
  { unique: true, partialFilterExpression: { phone: { $type: "string" } } },
);

const productSchema = sourceSchema<ProductDocument>(
  {
    name: { type: String, required: true },
    slug: { type: String, required: true, unique: true, index: true },
    sku: { type: String, required: true, unique: true, index: true },
    description: { type: String, default: null },
    specifications: { type: Schema.Types.Mixed },
    brand: { type: String, default: null, index: true },
    price: { type: String, required: true },
    compareAtPrice: { type: String, default: null },
    stockQuantity: { type: Number, required: true },
    lowStockThreshold: { type: Number, required: true },
    featured: { type: Boolean, required: true, index: true },
    categoryId: { type: String, default: null, index: true },
    hsnCode: { type: String, default: null },
    gstPercentage: { type: String, required: true },
  },
  "products",
);

const categorySchema = sourceSchema<CategoryDocument>(
  {
    name: { type: String, required: true, unique: true },
    slug: { type: String, required: true, unique: true, index: true },
    imageId: { type: String, default: null },
  },
  "categories",
);

const mediaSchema = sourceSchema<MediaDocument>(
  {
    key: { type: String, required: true, unique: true, index: true },
    url: { type: String, required: true },
    provider: { type: String, enum: ["local", "cloudinary", "external"], default: "local", index: true },
    publicId: { type: String, default: null },
    secureUrl: { type: String, default: null },
    resourceType: { type: String, enum: ["image"], default: "image" },
    format: { type: String, default: null },
    width: { type: Number, default: null },
    height: { type: Number, default: null },
    bytes: { type: Number, default: null },
    version: { type: Number, default: null },
    originalFilename: { type: String, default: null },
    filename: { type: String, required: true },
    mimeType: { type: String, required: true },
    size: { type: Number, required: true },
    altText: { type: String, default: null },
  },
  "media",
);
mediaSchema.index({ provider: 1, publicId: 1 }, { unique: true, partialFilterExpression: { publicId: { $type: "string" } } });

const orderSchema = sourceSchema<OrderDocument>(
  {
    number: { type: String, required: true, unique: true, index: true },
    userId: { type: String, required: true, index: true },
    status: { type: String, required: true, index: true },
    subtotal: { type: String, required: true },
    tax: { type: String, required: true },
    shipping: { type: String, required: true },
    total: { type: String, required: true },
    billingAddressId: { type: String, default: null },
    shippingAddressId: { type: String, default: null },
    paidAt: { type: Date, default: null },
    confirmedAt: { type: Date, default: null },
  },
  "orders",
);

const flexible = (collection: string, fields: Record<string, unknown>) =>
  sourceSchema<FlexibleDocument>(fields, collection);

export const UserModel = sourceModel("User", userSchema);
export const ProductModel = sourceModel("Product", productSchema);
export const CategoryModel = sourceModel("Category", categorySchema);
export const MediaModel = sourceModel("Media", mediaSchema);
export const OrderModel = sourceModel("Order", orderSchema);

export const OtpModel = sourceModel("Otp", flexible("otps", {
  phone: { type: String, required: true, index: true },
  otp: { type: String, required: true },
  userId: { type: String, default: null, index: true },
  expiresAt: { type: Date, required: true, index: true },
  attempts: { type: Number, required: true },
  usedAt: { type: Date, default: null },
}));

export const RefreshTokenModel = sourceModel("RefreshToken", flexible("refresh_tokens", {
  tokenHash: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  rememberMe: { type: Boolean, required: true, default: false },
  expiresAt: { type: Date, required: true },
  revokedAt: { type: Date, default: null },
}));

export const PasswordResetModel = sourceModel("PasswordReset", flexible("password_resets", {
  tokenHash: { type: String, required: true, unique: true },
  userId: { type: String, required: true, index: true },
  expiresAt: { type: Date, required: true },
  usedAt: { type: Date, default: null },
}));

export const AddressModel = sourceModel("Address", flexible("addresses", {
  userId: { type: String, required: true, index: true },
  line1: { type: String, required: true },
  line2: { type: String, default: null },
  city: { type: String, required: true },
  state: { type: String, required: true },
  postalCode: { type: String, required: true },
  country: { type: String, required: true },
}));

export const CartItemModel = sourceModel("CartItem", flexible("cart_items", {
  userId: { type: String, required: true, index: true },
  productId: { type: String, required: true, index: true },
  quantity: { type: Number, required: true },
}));
CartItemModel.schema.index({ userId: 1, productId: 1 }, { unique: true });

export const WishlistItemModel = sourceModel("WishlistItem", flexible("wishlist_items", {
  userId: { type: String, required: true, index: true },
  productId: { type: String, required: true, index: true },
}));
WishlistItemModel.schema.index({ userId: 1, productId: 1 }, { unique: true });

export const ProductImageModel = sourceModel("ProductImage", flexible("product_images", {
  productId: { type: String, required: true, index: true },
  mediaId: { type: String, required: true, index: true },
  sortOrder: { type: Number, required: true },
}));
ProductImageModel.schema.index({ productId: 1, mediaId: 1 }, { unique: true });

export const ProductReviewModel = sourceModel("ProductReview", flexible("product_reviews", {
  productId: { type: String, required: true, index: true },
  userId: { type: String, required: true, index: true },
  orderItemId: { type: String, default: null },
  rating: { type: Number, required: true },
  title: { type: String, default: null },
  description: { type: String, default: null },
  approved: { type: Boolean, required: true, index: true },
  helpfulVotes: { type: Number, required: true },
  reported: { type: Boolean, required: true },
  adminReply: { type: String, default: null },
}));

export const ProductReviewImageModel = sourceModel("ProductReviewImage", flexible("product_review_images", {
  reviewId: { type: String, required: true, index: true },
  mediaId: { type: String, required: true, index: true },
  sortOrder: { type: Number, required: true },
}));
ProductReviewImageModel.schema.index({ reviewId: 1, mediaId: 1 }, { unique: true });
ProductReviewModel.schema.index(
  { orderItemId: 1 },
  { unique: true, partialFilterExpression: { orderItemId: { $type: "string" } } },
);

export const InventoryMovementModel = sourceModel("InventoryMovement", flexible("inventory_movements", {
  productId: { type: String, required: true, index: true },
  delta: { type: Number, required: true },
  quantityAfter: { type: Number, required: true },
  action: { type: String, required: true, index: true },
  note: { type: String, default: null },
}));

export const OrderItemModel = sourceModel("OrderItem", flexible("order_items", {
  orderId: { type: String, required: true, index: true },
  productId: { type: String, default: null, index: true },
  productName: { type: String, required: true },
  sku: { type: String, required: true },
  quantity: { type: Number, required: true },
  unitPrice: { type: String, required: true },
  hsnCode: { type: String, default: null },
  gstPercentage: { type: String, required: true },
}));

export const PaymentModel = sourceModel("Payment", flexible("payments", {
  orderId: { type: String, required: true, unique: true },
  provider: { type: String, required: true },
  razorpayOrderId: { type: String, default: null },
  razorpayPaymentId: { type: String, default: null },
  razorpaySignature: { type: String, default: null },
  transactionId: { type: String, default: null },
  amount: { type: String, required: true },
  status: { type: String, required: true, index: true },
  failureReason: { type: String, default: null },
  paymentMethod: { type: String, default: null },
  transactionTime: { type: Date, default: null },
}));

export const WebhookEventModel = sourceModel("WebhookEvent", flexible("webhook_events", {
  eventId: { type: String, required: true, unique: true },
  eventType: { type: String, required: true },
  payload: { type: Schema.Types.Mixed, required: true },
  processedAt: { type: Date, required: true },
}));

export const ShipmentModel = sourceModel("Shipment", flexible("shipments", {
  orderId: { type: String, required: true, unique: true },
  provider: { type: String, default: null },
  awbNumber: { type: String, default: null },
  trackingNumber: { type: String, default: null },
  courierName: { type: String, default: null },
  estimatedDelivery: { type: Date, default: null },
  status: { type: String, required: true },
  labelUrl: { type: String, default: null },
  trackingUrl: { type: String, default: null },
}));

export const InvoiceModel = sourceModel("Invoice", flexible("invoices", {
  number: { type: String, required: true, unique: true },
  orderId: { type: String, required: true, unique: true },
  invoiceDate: { type: Date, required: true },
  gstin: { type: String, required: true },
  customerGstin: { type: String, default: null },
  totalAmount: { type: String, required: true },
  cgst: { type: String, required: true },
  sgst: { type: String, required: true },
  igst: { type: String, required: true },
  pdfUrl: { type: String, default: null },
}));

export const HomepageBlockModel = sourceModel("HomepageBlock", flexible("homepage_blocks", {
  key: { type: String, required: true, unique: true },
  content: { type: Schema.Types.Mixed, required: true },
}));

export const BrandCollaborationModel = sourceModel("BrandCollaboration", flexible("brand_collaborations", {
  name: { type: String, required: true, unique: true },
  logoUrl: { type: String, required: true },
  sortOrder: { type: Number, required: true },
  active: { type: Boolean, required: true, index: true },
}));

export const SettingModel = sourceModel("Setting", flexible("settings", {
  key: { type: String, required: true, unique: true },
  value: { type: Schema.Types.Mixed, required: true },
}));

export const EnquiryModel = sourceModel("Enquiry", flexible("enquiries", {
  type: { type: String, required: true, index: true },
  name: { type: String, required: true },
  email: { type: String, required: true, index: true },
  phone: { type: String, default: null },
  companyName: { type: String, default: null },
  status: { type: String, required: true, index: true },
  details: { type: Schema.Types.Mixed },
  message: { type: String, required: true },
}));

export const EnquiryNoteModel = sourceModel("EnquiryNote", flexible("enquiry_notes", {
  enquiryId: { type: String, required: true, index: true },
  body: { type: String, required: true },
}));

export const mongoModels = {
  users: UserModel,
  otps: OtpModel,
  refreshTokens: RefreshTokenModel,
  passwordResets: PasswordResetModel,
  addresses: AddressModel,
  media: MediaModel,
  categories: CategoryModel,
  products: ProductModel,
  cartItems: CartItemModel,
  wishlistItems: WishlistItemModel,
  productImages: ProductImageModel,
  productReviews: ProductReviewModel,
  productReviewImages: ProductReviewImageModel,
  inventoryMovements: InventoryMovementModel,
  orders: OrderModel,
  orderItems: OrderItemModel,
  payments: PaymentModel,
  webhookEvents: WebhookEventModel,
  shipments: ShipmentModel,
  invoices: InvoiceModel,
  homepageBlocks: HomepageBlockModel,
  brandCollaborations: BrandCollaborationModel,
  settings: SettingModel,
  enquiries: EnquiryModel,
  enquiryNotes: EnquiryNoteModel,
} as const;
