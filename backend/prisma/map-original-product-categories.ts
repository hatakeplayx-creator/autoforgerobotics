import "dotenv/config";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

/** Derived solely from src/lib/store-data.ts tags. AF259599's "Refurbished"
 * label is resolved by its explicit product name: a 3D-printer material system. */
const originalCategoryMapping: Readonly<Record<string, string>> = {
  AF259948: "3d-printers-and-parts", AF259599: "3d-printers-and-parts",
  AF258889: "development-boards", AF266320: "development-boards", AF264842: "development-boards",
  AF264843: "electronic-modules-and-displays", AF263825: "sensors", AF263796: "development-boards",
  AF263808: "development-boards", AF263836: "electronic-modules-and-displays",
  AF263085: "drone-parts", AF263081: "drone-parts",
};

async function main() {
  const categories = await prisma.category.findMany({ select: { id: true, slug: true } });
  const categoryBySlug = new Map(categories.map((category) => [category.slug, category.id]));
  const mapped: string[] = [];
  const skipped: Array<{ sku: string; reason: string }> = [];
  for (const [sku, categorySlug] of Object.entries(originalCategoryMapping)) {
    const product = await prisma.product.findUnique({ where: { sku }, select: { id: true, categoryId: true } });
    const categoryId = categoryBySlug.get(categorySlug);
    if (!product) { skipped.push({ sku, reason: "Product not found" }); continue; }
    if (!categoryId) { skipped.push({ sku, reason: `Category not found: ${categorySlug}` }); continue; }
    if (product.categoryId !== categoryId) await prisma.product.update({ where: { id: product.id }, data: { categoryId } });
    mapped.push(sku);
  }
  console.log(JSON.stringify({ mapped: mapped.length, skipped, skus: mapped }));
}

main().finally(() => prisma.$disconnect());
