import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

async function main(): Promise<void> {
  const counts = {
    users: await prisma.user.count(),
    otps: await prisma.oTP.count(),
    refreshTokens: await prisma.refreshToken.count(),
    passwordResets: await prisma.passwordReset.count(),
    addresses: await prisma.address.count(),
    media: await prisma.media.count(),
    categories: await prisma.category.count(),
    products: await prisma.product.count(),
    cartItems: await prisma.cartItem.count(),
    wishlistItems: await prisma.wishlistItem.count(),
    productImages: await prisma.productImage.count(),
    reviews: await prisma.productReview.count(),
    reviewImages: await prisma.productReviewImage.count(),
    inventoryMovements: await prisma.inventoryMovement.count(),
    orders: await prisma.order.count(),
    orderItems: await prisma.orderItem.count(),
    payments: await prisma.payment.count(),
    webhookEvents: await prisma.razorpayWebhookEvent.count(),
    shipments: await prisma.shipment.count(),
    invoices: await prisma.invoice.count(),
    homepageBlocks: await prisma.homepageBlock.count(),
    brands: await prisma.brandCollaboration.count(),
    settings: await prisma.setting.count(),
    enquiries: await prisma.enquiry.count(),
    enquiryNotes: await prisma.enquiryNote.count(),
  };

  console.log(JSON.stringify(counts, null, 2));
}

main()
  .catch((error: unknown) => {
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
