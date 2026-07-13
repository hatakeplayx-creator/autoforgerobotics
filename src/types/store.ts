export interface Media {
  id: string;
  key: string;
  url: string;
  filename: string;
  mimeType: string;
  size: number;
  altText?: string;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  slug: string;
  imageId?: string;
  image?: Media;
  createdAt: string;
  updatedAt: string;
}

export interface ProductImage {
  id: string;
  productId: string;
  mediaId: string;
  media: Media;
  sortOrder: number;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  sku: string;
  description: string;
  specifications?: Record<string, unknown>;
  brand?: string;
  price: number;
  compareAtPrice?: number;
  stockQuantity: number;
  lowStockThreshold: number;
  featured: boolean;
  categoryId?: string;
  category?: Category;
  images: ProductImage[];
  hsnCode?: string;
  gstPercentage: number;
  createdAt: string;
  updatedAt: string;
  // Compatibility presentation fields used by the existing local cart/wishlist UI.
  tag?: string;
  image?: string;
  reviews?: number;
  outOfStock?: boolean;
  badge?: string;
}

export interface Address {
  id: string;
  userId: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  createdAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  productId?: string;
  product?: Product;
  productName: string;
  sku: string;
  quantity: number;
  unitPrice: number;
  hsnCode?: string;
  gstPercentage: number;
  createdAt: string;
}

export interface Payment {
  id: string;
  orderId: string;
  provider: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
  razorpaySignature?: string;
  transactionId?: string;
  amount: number;
  status: "PENDING" | "SUCCESS" | "FAILED" | "REFUNDED";
  failureReason?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Shipment {
  id: string;
  orderId: string;
  provider?: string;
  awbNumber?: string;
  trackingNumber?: string;
  courierName?: string;
  estimatedDelivery?: string;
  status: string;
  labelUrl?: string;
  trackingUrl?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Invoice {
  id: string;
  number: string;
  orderId: string;
  invoiceDate: string;
  gstin: string;
  customerGstin?: string;
  totalAmount: number;
  cgst: number;
  sgst: number;
  igst: number;
  pdfUrl?: string;
  createdAt: string;
}

export interface Order {
  id: string;
  number: string;
  userId: string;
  status: "PENDING" | "CONFIRMED" | "PACKED" | "SHIPPED" | "DELIVERED" | "CANCELLED" | "REFUNDED";
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  billingAddressId?: string;
  shippingAddressId?: string;
  billingAddress?: Address;
  shippingAddress?: Address;
  payment?: Payment;
  shipment?: Shipment;
  invoice?: Invoice;
  items: OrderItem[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductReviewImage {
  id: string;
  reviewId: string;
  mediaId: string;
  media: Media;
  sortOrder: number;
}

export interface ProductReview {
  id: string;
  productId: string;
  userId: string;
  user: { id: string; name: string; email: string };
  orderItemId?: string;
  rating: number;
  title?: string;
  description?: string;
  approved: boolean;
  helpfulVotes: number;
  reported: boolean;
  adminReply?: string;
  images: ProductReviewImage[];
  createdAt: string;
  updatedAt: string;
}

export interface HeroBanner {
  image: string;
  alt: string;
}

export interface ServiceItem {
  name: string;
  emoji: string;
}

export interface CartItem {
  product: Product;
  quantity: number;
}

export interface Coupon {
  code: string;
  type: "percent" | "fixed";
  value: number;
}
