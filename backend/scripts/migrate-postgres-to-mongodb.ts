import "dotenv/config";
import { Prisma, PrismaClient } from "@prisma/client";
import { z } from "zod";
import type { FilterQuery, Model } from "mongoose";
import { connectMongoDB, disconnectMongoDB } from "../src/mongodb/connection.js";
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
  type MongoSourceDocument,
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
} from "../src/mongodb/models.js";

const migrationEnvironmentSchema = z.object({
  DATABASE_URL: z.string().min(1),
  MONGODB_URI: z.string().min(1),
  MONGODB_DB_NAME: z.string().min(1).default("autoforge"),
  MIGRATION_BATCH_SIZE: z.coerce.number().int().min(1).max(1_000).default(200),
});

const environment = migrationEnvironmentSchema.parse(process.env);
const prisma = new PrismaClient();
const verifyOnly = process.argv.includes("--verify-only");
const dryRun = process.argv.includes("--dry-run");

interface MigrationResult {
  module: string;
  source: number;
  target: number;
  matched: number;
  upserted: number;
  verified: boolean;
}

function normalizeValue(value: unknown): unknown {
  if (value instanceof Date) return value;
  if (Prisma.Decimal.isDecimal(value)) return value.toString();
  if (Array.isArray(value)) return value.map(normalizeValue);
  if (value && typeof value === "object") {
    return Object.fromEntries(
      Object.entries(value).map(([key, child]) => [key, normalizeValue(child)]),
    );
  }
  return value;
}

function asRecord(value: unknown): Record<string, unknown> {
  const normalized = normalizeValue(value);
  if (!normalized || typeof normalized !== "object" || Array.isArray(normalized)) {
    throw new TypeError("Expected a database row object.");
  }
  return normalized as Record<string, unknown>;
}

function sourceId(row: Record<string, unknown>): string {
  const id = row.id ?? row.key;
  if (typeof id !== "string" || id.length === 0) {
    throw new TypeError("Every migrated record must have a string id or key.");
  }
  return id;
}

async function migrateModule<T extends MongoSourceDocument>(
  module: string,
  rows: readonly unknown[],
  target: Model<T>,
): Promise<MigrationResult> {
  const records = rows.map(asRecord);
  const ids = records.map(sourceId);
  if (new Set(ids).size !== ids.length) {
    throw new Error(`${module}: duplicate source identifiers detected.`);
  }

  let matched = 0;
  let upserted = 0;

  if (!verifyOnly && !dryRun) {
    for (let offset = 0; offset < records.length; offset += environment.MIGRATION_BATCH_SIZE) {
      const batch = records.slice(offset, offset + environment.MIGRATION_BATCH_SIZE);
      const writes = batch.map(async (record) => {
        const _id = sourceId(record);
        const { id: _sourceId, ...document } = record;
        const result = await target.replaceOne(
          { _id } as FilterQuery<T>,
          { ...document, _id } as T,
          { upsert: true },
        );
        matched += result.matchedCount;
        upserted += result.upsertedCount;
      });
      await Promise.all(writes);
    }
  }

  const migratedCount = dryRun ? records.length : ids.length === 0
    ? 0
    : await target.countDocuments({ _id: { $in: ids } } as FilterQuery<T>);
  const targetCount = dryRun ? records.length : await target.countDocuments();
  const verified = migratedCount === records.length && targetCount === records.length;
  if (!verified) {
    throw new Error(
      `${module}: verification failed (${records.length} PostgreSQL, ${migratedCount} matched MongoDB, ${targetCount} total MongoDB).`,
    );
  }

  const result = {
    module,
    source: records.length,
    target: targetCount,
    matched,
    upserted,
    verified,
  };
  console.log(JSON.stringify(result));
  return result;
}

interface RelationshipCheck {
  relationship: string;
  checked: number;
  orphans: number;
}

async function verifyRelationship(
  relationship: string,
  source: Model<any>,
  foreignKey: string,
  target: Model<any>,
): Promise<RelationshipCheck> {
  const documents = await source.find({ [foreignKey]: { $ne: null } }).select({ [foreignKey]: 1 }).lean();
  let orphans = 0;
  for (const document of documents) {
    const targetId = (document as unknown as Record<string, unknown>)[foreignKey];
    if (typeof targetId !== "string" || !(await target.exists({ _id: targetId }))) orphans += 1;
  }
  const result = { relationship, checked: documents.length, orphans };
  console.log(JSON.stringify(result));
  if (orphans > 0) throw new Error(`${relationship}: ${orphans} orphaned reference(s) detected.`);
  return result;
}

async function verifyRelationships(): Promise<RelationshipCheck[]> {
  if (dryRun) return [];
  return Promise.all([
    verifyRelationship("otps.userId -> users", OtpModel, "userId", UserModel),
    verifyRelationship("refreshTokens.userId -> users", RefreshTokenModel, "userId", UserModel),
    verifyRelationship("passwordResets.userId -> users", PasswordResetModel, "userId", UserModel),
    verifyRelationship("addresses.userId -> users", AddressModel, "userId", UserModel),
    verifyRelationship("categories.imageId -> media", CategoryModel, "imageId", MediaModel),
    verifyRelationship("products.categoryId -> categories", ProductModel, "categoryId", CategoryModel),
    verifyRelationship("productImages.productId -> products", ProductImageModel, "productId", ProductModel),
    verifyRelationship("productImages.mediaId -> media", ProductImageModel, "mediaId", MediaModel),
    verifyRelationship("inventory.productId -> products", InventoryMovementModel, "productId", ProductModel),
    verifyRelationship("cart.userId -> users", CartItemModel, "userId", UserModel),
    verifyRelationship("cart.productId -> products", CartItemModel, "productId", ProductModel),
    verifyRelationship("wishlist.userId -> users", WishlistItemModel, "userId", UserModel),
    verifyRelationship("wishlist.productId -> products", WishlistItemModel, "productId", ProductModel),
    verifyRelationship("orders.userId -> users", OrderModel, "userId", UserModel),
    verifyRelationship("orders.billingAddressId -> addresses", OrderModel, "billingAddressId", AddressModel),
    verifyRelationship("orders.shippingAddressId -> addresses", OrderModel, "shippingAddressId", AddressModel),
    verifyRelationship("orderItems.orderId -> orders", OrderItemModel, "orderId", OrderModel),
    verifyRelationship("orderItems.productId -> products", OrderItemModel, "productId", ProductModel),
    verifyRelationship("reviews.userId -> users", ProductReviewModel, "userId", UserModel),
    verifyRelationship("reviews.productId -> products", ProductReviewModel, "productId", ProductModel),
    verifyRelationship("reviews.orderItemId -> orderItems", ProductReviewModel, "orderItemId", OrderItemModel),
    verifyRelationship("reviewImages.reviewId -> reviews", ProductReviewImageModel, "reviewId", ProductReviewModel),
    verifyRelationship("reviewImages.mediaId -> media", ProductReviewImageModel, "mediaId", MediaModel),
    verifyRelationship("payments.orderId -> orders", PaymentModel, "orderId", OrderModel),
    verifyRelationship("shipments.orderId -> orders", ShipmentModel, "orderId", OrderModel),
    verifyRelationship("invoices.orderId -> orders", InvoiceModel, "orderId", OrderModel),
    verifyRelationship("enquiryNotes.enquiryId -> enquiries", EnquiryNoteModel, "enquiryId", EnquiryModel),
  ]);
}

async function main(): Promise<void> {
  await connectMongoDB();

  const results: MigrationResult[] = [];

  results.push(await migrateModule("users/admin", await prisma.user.findMany(), UserModel));
  results.push(await migrateModule("otp/tokens", await prisma.oTP.findMany(), OtpModel));
  results.push(await migrateModule("refresh tokens", await prisma.refreshToken.findMany(), RefreshTokenModel));
  results.push(await migrateModule("password resets", await prisma.passwordReset.findMany(), PasswordResetModel));
  results.push(await migrateModule("addresses", await prisma.address.findMany(), AddressModel));

  results.push(await migrateModule("media", await prisma.media.findMany(), MediaModel));
  results.push(await migrateModule("categories", await prisma.category.findMany(), CategoryModel));
  results.push(await migrateModule("products", await prisma.product.findMany(), ProductModel));
  results.push(await migrateModule("product images", await prisma.productImage.findMany(), ProductImageModel));
  results.push(await migrateModule("inventory", await prisma.inventoryMovement.findMany(), InventoryMovementModel));
  results.push(await migrateModule("reviews", await prisma.productReview.findMany(), ProductReviewModel));
  results.push(await migrateModule("review images", await prisma.productReviewImage.findMany(), ProductReviewImageModel));

  results.push(await migrateModule("cart", await prisma.cartItem.findMany(), CartItemModel));
  results.push(await migrateModule("wishlist", await prisma.wishlistItem.findMany(), WishlistItemModel));

  results.push(await migrateModule("orders", await prisma.order.findMany(), OrderModel));
  results.push(await migrateModule("order items", await prisma.orderItem.findMany(), OrderItemModel));
  results.push(await migrateModule("payments", await prisma.payment.findMany(), PaymentModel));
  results.push(await migrateModule("invoices", await prisma.invoice.findMany(), InvoiceModel));
  results.push(await migrateModule("shipments", await prisma.shipment.findMany(), ShipmentModel));
  results.push(await migrateModule("webhook events", await prisma.razorpayWebhookEvent.findMany(), WebhookEventModel));

  results.push(await migrateModule("CMS", await prisma.homepageBlock.findMany(), HomepageBlockModel));
  results.push(await migrateModule("brands", await prisma.brandCollaboration.findMany(), BrandCollaborationModel));
  results.push(await migrateModule("settings", await prisma.setting.findMany(), SettingModel));
  results.push(await migrateModule("seller enquiries", await prisma.enquiry.findMany(), EnquiryModel));
  results.push(await migrateModule("enquiry notes", await prisma.enquiryNote.findMany(), EnquiryNoteModel));

  const relationships = await verifyRelationships();
  const sourceRecords = results.reduce((total, result) => total + result.source, 0);
  console.log(JSON.stringify({
    mode: dryRun ? "dry-run" : verifyOnly ? "verify-only" : "migrate-and-verify",
    modules: results.length,
    sourceRecords,
    relationships: relationships.length,
    orphanedReferences: relationships.reduce((total, result) => total + result.orphans, 0),
    verified: results.every((result) => result.verified),
  }));
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await Promise.allSettled([prisma.$disconnect(), disconnectMongoDB()]);
  });
