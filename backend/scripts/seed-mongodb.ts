import "dotenv/config";
import bcrypt from "bcryptjs";
import { mkdir, copyFile, stat } from "node:fs/promises";
import path from "node:path";
import { connectMongoDB, disconnectMongoDB } from "../src/mongodb/connection.js";
import { mongo, Role, InventoryAction, type ProductRow } from "../src/mongodb/database.js";

const rootDir = process.cwd();
const assetDir = path.join(rootDir, "src", "assets");
const uploadDir = path.resolve(process.env.UPLOAD_DIR || "backend/uploads");

const slugify = (value: string) =>
  value.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");

const mime = (filename: string) => {
  if (filename.endsWith(".png")) return "image/png";
  if (filename.endsWith(".webp")) return "image/webp";
  if (filename.endsWith(".gif")) return "image/gif";
  if (filename.endsWith(".svg")) return "image/svg+xml";
  return "image/jpeg";
};

async function ensureMedia(filename: string, altText: string) {
  await mkdir(uploadDir, { recursive: true });
  const source = path.join(assetDir, filename);
  const key = `seed-${filename}`;
  const target = path.join(uploadDir, key);
  await copyFile(source, target);
  const size = (await stat(target)).size;
  return mongo.media.upsert({
    where: { key },
    update: { url: `/uploads/${key}`, filename, mimeType: mime(filename), size, altText },
    create: { key, url: `/uploads/${key}`, filename, mimeType: mime(filename), size, altText },
  });
}

const categorySeeds = [
  ["Development Boards", "cat-dev-boards.jpg"],
  ["Drone Parts", "cat-drone-parts.jpg"],
  ["Batteries, Power Supply and Accessories", "cat-batteries.jpg"],
  ["3D Printers and Parts", "cat-3d-printers.jpg"],
  ["Sensors", "cat-sensors.jpg"],
  ["Electronic Components", "cat-components.jpg"],
  ["Motors | Drivers | Pumps | Actuators", "cat-motors.jpg"],
  ["Electronic Modules and Displays", "cat-modules-displays.jpg"],
  ["IoT and Wireless Modules", "cat-iot-wireless.jpg"],
  ["Mechanical Parts, Measurement & Workbench Tools", "cat-mechanical-tools.jpg"],
  ["DIY and Maker Kits", "cat-diy-kits.jpg"],
  ["Electric Vehicle Parts", "cat-ev-parts.jpg"],
] as const;

const productSeeds = [
  ["ForgePrint S1 Enclosed 3D Printer", "AF259948", 42999, "3D Printers and Parts", "prod-printer.jpg", false],
  ["Refurbished - ForgeFil Lite Automatic Material System", "AF259599", 24499, "3D Printers and Parts", "prod-ams.jpg", false],
  ["AF Vision D115 AI Carrier Board - Edge AI Platform with 3x USB 3.2, Dual CSI-2, 2x GbE", "AF258889", 18999, "Development Boards", "prod-carrier.jpg", false],
  ["ForgeLab 125-14 FPGA Education Pack", "AF266320", 109990, "Development Boards", "prod-fpga.jpg", false],
  ['AF RP2350 1.54" IPS LCD Dev Board - 240x240, 65K Color, Touch | Dual-Core', "AF264842", 1709, "Development Boards", "prod-lcd-board.jpg", true],
  ["AF 12MP Autofocus Camera Module - 120° FOV, Rolling Shutter | CSI Interface", "AF264843", 3199, "Electronic Modules and Displays", "prod-camera.jpg", true],
  ["AF7700 Ambient Light Sensor Module - Green Horizontal", "AF263825", 289, "Sensors", "prod-light-sensor.jpg", false],
  ["AF2591 Digital Light Sensor Breakout Module with Interface - Purple", "AF263796", 509, "Sensors", "prod-breakout.jpg", true],
  ["AF328P Mini EVB Development Board - Pro Mini Compatible, 5V", "AF263808", 129, "Development Boards", "prod-mini-board.jpg", true],
  ["AF-HV20 MP3 Music Player Module with Screw Terminals", "AF263836", 609, "Electronic Modules and Displays", "prod-mp3.jpg", false],
  ["ForgeWing X8 Heavy-Lift Drone Motor with 2270 Propeller CW", "AF263085", 17909, "Drone Parts", "prod-drone-motor.jpg", true],
  ["ForgeWing X6-SE 280KV Motor and 2270 Propeller Combo Kit-CW", "AF263081", 10159, "Drone Parts", "prod-drone-motor.jpg", true],
] as const;

async function main() {
  await connectMongoDB();

  const categoryByName = new Map<string, string>();
  for (const [name, imageFilename] of categorySeeds) {
    const image = await ensureMedia(imageFilename, name);
    const category = await mongo.category.upsert({
      where: { slug: slugify(name) },
      update: { name, imageId: image.id },
      create: { name, slug: slugify(name), imageId: image.id },
    });
    categoryByName.set(name, category.id);
  }

  for (const [name, sku, price, categoryName, imageFilename, outOfStock] of productSeeds) {
    const image = await ensureMedia(imageFilename, name);
    const categoryId = categoryByName.get(categoryName) ?? null;
    const productData: Partial<ProductRow> = {
      name,
      slug: slugify(name),
      sku,
      description: `${name} from AutoForge Robotics.`,
      price,
      stockQuantity: outOfStock ? 0 : 12,
      lowStockThreshold: 5,
      featured: true,
      categoryId,
    };
    const product = await mongo.product.upsert({
      where: { sku },
      update: productData,
      create: productData,
    });
    await mongo.productImage.deleteMany({ where: { productId: product.id } });
    await mongo.productImage.create({ data: { productId: product.id, mediaId: image.id, sortOrder: 0 } });
    if (!outOfStock && !(await mongo.inventoryMovement.count({ where: { productId: product.id } }))) {
      await mongo.inventoryMovement.create({
        data: {
          productId: product.id,
          delta: 12,
          quantityAfter: 12,
          action: InventoryAction.RECEIVED,
          note: "Initial MongoDB seed inventory",
        },
      });
    }
  }

  for (const filename of ["hero-1.jpg", "hero-2.jpg", "hero-3.jpg"]) {
    await ensureMedia(filename, "AutoForge Robotics hero image");
  }

  await mongo.homepageBlock.upsert({
    where: { key: "hero" },
    update: { content: [
      { image: "/uploads/seed-hero-1.jpg", alt: "AutoForge Robotics Innovation Challenge 2026" },
      { image: "/uploads/seed-hero-2.jpg", alt: "Mid Year 3D Printer Sale" },
      { image: "/uploads/seed-hero-3.jpg", alt: "Industrial DC Motor Driver now in stock" },
    ] },
    create: { key: "hero", content: [
      { image: "/uploads/seed-hero-1.jpg", alt: "AutoForge Robotics Innovation Challenge 2026" },
      { image: "/uploads/seed-hero-2.jpg", alt: "Mid Year 3D Printer Sale" },
      { image: "/uploads/seed-hero-3.jpg", alt: "Industrial DC Motor Driver now in stock" },
    ] },
  });
  await mongo.homepageBlock.upsert({ where: { key: "offers" }, update: { content: [] }, create: { key: "offers", content: [] } });
  await mongo.homepageBlock.upsert({
    where: { key: "services" },
    update: { content: [
      { name: "PCB Manufacturing", emoji: "PCB" },
      { name: "3D Printing", emoji: "3D" },
      { name: "Laser Cutting", emoji: "LASER" },
      { name: "Custom Battery Pack", emoji: "BATTERY" },
    ] },
    create: { key: "services", content: [
      { name: "PCB Manufacturing", emoji: "PCB" },
      { name: "3D Printing", emoji: "3D" },
      { name: "Laser Cutting", emoji: "LASER" },
      { name: "Custom Battery Pack", emoji: "BATTERY" },
    ] },
  });
  await mongo.homepageBlock.upsert({
    where: { key: "navigation" },
    update: { content: ["Home", "Shop", "Forum", "Bulk Enquiry", "New Arrivals", "ATL Kits Enquiry", "Blogs", "BOM Tool", "Careers"] },
    create: { key: "navigation", content: ["Home", "Shop", "Forum", "Bulk Enquiry", "New Arrivals", "ATL Kits Enquiry", "Blogs", "BOM Tool", "Careers"] },
  });

  for (const [sortOrder, name] of ["Panasonic", "SafeConnect", "OpenMV", "Teensy", "Benewake", "Samsung", "Indian Army"].entries()) {
    await mongo.brandCollaboration.upsert({
      where: { name },
      update: { logoUrl: "/uploads/seed-hero-1.jpg", sortOrder, active: true },
      create: { name, logoUrl: "/uploads/seed-hero-1.jpg", sortOrder, active: true },
    });
  }

  await mongo.setting.upsert({
    where: { key: "website" },
    update: { value: { name: "AutoForge Robotics", phone: "1800 266 6123", email: "support@autoforgerobotics.in", address: "Pune, Maharashtra, India", footerText: "Your Ideas, Our Parts." } },
    create: { key: "website", value: { name: "AutoForge Robotics", phone: "1800 266 6123", email: "support@autoforgerobotics.in", address: "Pune, Maharashtra, India", footerText: "Your Ideas, Our Parts." } },
  });

  if (process.env.ADMIN_PASSWORD) {
    const email = (process.env.ADMIN_EMAIL || "admin@autoforge.com").toLowerCase();
    await mongo.user.upsert({
      where: { email },
      update: { passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12), role: Role.ADMIN },
      create: { email, name: process.env.ADMIN_NAME || "Store Administrator", passwordHash: await bcrypt.hash(process.env.ADMIN_PASSWORD, 12), role: Role.ADMIN },
    });
  }

  console.log("MongoDB seed completed.");
}

main()
  .catch((error) => {
    console.error("MongoDB seed failed.");
    console.error(error instanceof Error ? error.message : error);
    process.exitCode = 1;
  })
  .finally(async () => {
    await disconnectMongoDB();
  });
