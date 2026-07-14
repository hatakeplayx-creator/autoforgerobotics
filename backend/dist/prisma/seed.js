import "dotenv/config";
import bcrypt from "bcryptjs";
import { PrismaClient, Role } from "@prisma/client";
const prisma = new PrismaClient();
async function main() {
    const hash = await bcrypt.hash("admin123", 12);
    await prisma.user.upsert({ where: { email: "admin@autoforge.com" }, update: {}, create: { email: "admin@autoforge.com", name: "Store Administrator", passwordHash: hash, role: Role.ADMIN } });
    const customer = await prisma.user.upsert({ where: { email: "demo@autoforge.com" }, update: {}, create: { email: "demo@autoforge.com", name: "Demo User", passwordHash: await bcrypt.hash("demo123", 12) } });
    const category = await prisma.category.upsert({ where: { slug: "sensors" }, update: {}, create: { name: "Sensors", slug: "sensors" } });
    const product = await prisma.product.upsert({ where: { sku: "AF263825" }, update: {}, create: { name: "AF7700 Ambient Light Sensor Module", slug: "af7700-ambient-light-sensor", sku: "AF263825", description: "Ambient light sensor module.", price: 289, stockQuantity: 12, lowStockThreshold: 5, featured: true, categoryId: category.id } });
    if (!(await prisma.inventoryMovement.count({ where: { productId: product.id } })))
        await prisma.inventoryMovement.create({ data: { productId: product.id, delta: 12, quantityAfter: 12, action: "RECEIVED", note: "Initial seed inventory" } });
    for (const [sortOrder, name] of ["Panasonic", "SafeConnect", "OpenMV", "Teensy", "Benewake", "Samsung", "Indian Army"].entries())
        await prisma.brandCollaboration.upsert({ where: { name }, update: { sortOrder }, create: { name, logoUrl: "/uploads/placeholder-brand.svg", sortOrder } });
    await prisma.homepageBlock.upsert({ where: { key: "hero" }, update: {}, create: { key: "hero", content: [{ title: "Build what is next", image: "/uploads/hero.jpg", buttonLabel: "Shop now", buttonUrl: "/shop" }] } });
    await prisma.homepageBlock.upsert({ where: { key: "offers" }, update: {}, create: { key: "offers", content: [] } });
    await prisma.setting.upsert({ where: { key: "website" }, update: {}, create: { key: "website", value: { name: "AutoForge Robotics", phone: "1800 266 6123", email: "support@autoforgerobotics.in", address: "Pune, Maharashtra, India", footerText: "Your Ideas, Our Parts." } } });
    await prisma.order.upsert({ where: { number: "AF-1001" }, update: {}, create: { number: "AF-1001", userId: customer.id, status: "PENDING", subtotal: 289, total: 289, items: { create: { productId: product.id, productName: product.name, sku: product.sku, quantity: 1, unitPrice: 289 } } } });
    if (!(await prisma.enquiry.count({ where: { type: "sell" } })))
        await prisma.enquiry.create({ data: { type: "sell", name: "Priya Sharma", companyName: "Maker Labs", email: "priya@example.com", phone: "9876543210", message: "Interested in listing electronics components.", details: { businessType: "Distributor", city: "Pune", country: "India" } } });
}
main().then(() => prisma.$disconnect()).catch(async (e) => { console.error(e); await prisma.$disconnect(); process.exit(1); });
