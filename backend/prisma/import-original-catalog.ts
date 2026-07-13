import "dotenv/config";
import { copyFile, mkdir, readFile, readdir } from "node:fs/promises";
import path from "node:path";
import ts from "typescript";
import { PrismaClient } from "@prisma/client";

type Value = string | number | boolean | undefined;
type CatalogProduct = { name: string; sku: string; price: number; image: string; outOfStock?: boolean };
type CatalogCategory = { name: string; image: string };
type Hero = { image: string; alt: string };

const root = path.resolve(import.meta.dirname, "../..");
const sourcePath = path.join(root, "src", "lib", "store-data.ts");
const assetsPath = path.join(root, "src", "assets");
const uploadsPath = path.join(root, "backend", "uploads");
const prisma = new PrismaClient();

function literal(node: ts.Expression): Value {
  if (ts.isStringLiteral(node) || ts.isNoSubstitutionTemplateLiteral(node)) return node.text;
  if (ts.isNumericLiteral(node)) return Number(node.text);
  if (node.kind === ts.SyntaxKind.TrueKeyword) return true;
  if (node.kind === ts.SyntaxKind.FalseKeyword) return false;
  return undefined;
}

function objects(source: ts.SourceFile, name: string, assets: Map<string, string>): Array<Record<string, Value>> {
  let initializer: ts.Expression | undefined;
  source.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    node.declarationList.declarations.forEach((declaration) => {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name) initializer = declaration.initializer;
    });
  });
  if (!initializer || !ts.isArrayLiteralExpression(initializer)) throw new Error(`Could not read ${name} from store-data.ts`);
  return initializer.elements.flatMap((element) => {
    if (!ts.isObjectLiteralExpression(element)) return [];
    const record: Record<string, Value> = {};
    element.properties.forEach((property) => {
      if (!ts.isPropertyAssignment(property) || !ts.isIdentifier(property.name)) return;
      record[property.name.text] = ts.isIdentifier(property.initializer) ? assets.get(property.initializer.text) : literal(property.initializer);
    });
    return [record];
  });
}

function strings(source: ts.SourceFile, name: string): string[] {
  let initializer: ts.Expression | undefined;
  source.forEachChild((node) => {
    if (!ts.isVariableStatement(node)) return;
    node.declarationList.declarations.forEach((declaration) => {
      if (ts.isIdentifier(declaration.name) && declaration.name.text === name) initializer = declaration.initializer;
    });
  });
  if (!initializer || !ts.isArrayLiteralExpression(initializer)) throw new Error(`Could not read ${name} from store-data.ts`);
  return initializer.elements.flatMap((element) => {
    const value = literal(element as ts.Expression);
    return typeof value === "string" ? [value] : [];
  });
}

async function main() {
  const text = await readFile(sourcePath, "utf8");
  const source = ts.createSourceFile(sourcePath, text, ts.ScriptTarget.Latest, true);
  const assets = new Map<string, string>();
  source.forEachChild((node) => {
    if (!ts.isImportDeclaration(node) || !node.importClause?.name || !ts.isStringLiteral(node.moduleSpecifier)) return;
    const match = node.moduleSpecifier.text.match(/^@\/assets\/(.+)$/);
    if (match) assets.set(node.importClause.name.text, match[1]);
  });
  const categories = objects(source, "categories", assets).map((item) => ({ name: String(item.name), image: String(item.image) })) as CatalogCategory[];
  const products = objects(source, "featuredProducts", assets).map((item) => ({ name: String(item.name), sku: String(item.sku), price: Number(item.price), image: String(item.image), outOfStock: item.outOfStock === true })) as CatalogProduct[];
  const heroes = objects(source, "heroBanners", assets).map((item) => ({ image: String(item.image), alt: String(item.alt) })) as Hero[];
  const navigation = strings(source, "navLinks");
  const services = objects(source, "services", assets);
  const assetFiles = (await readdir(assetsPath)).filter((file) => /\.(jpg|jpeg|png|webp|gif|svg)$/i.test(file));
  await mkdir(uploadsPath, { recursive: true });
  const mediaByFilename = new Map<string, string>();
  for (const filename of assetFiles) {
    await copyFile(path.join(assetsPath, filename), path.join(uploadsPath, filename));
    const media = await prisma.media.upsert({ where: { key: `original-catalog/${filename}` }, update: { filename, url: `/uploads/${filename}` }, create: { key: `original-catalog/${filename}`, filename, url: `/uploads/${filename}`, mimeType: filename.endsWith(".svg") ? "image/svg+xml" : "image/jpeg", size: (await readFile(path.join(assetsPath, filename))).byteLength } });
    mediaByFilename.set(filename, media.id);
  }
  for (const category of categories) {
    const slug = category.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const existing = await prisma.category.findFirst({ where: { OR: [{ slug }, { name: category.name }] } });
    const imageId = mediaByFilename.get(category.image);
    if (!imageId) throw new Error(`Missing category image: ${category.image}`);
    if (existing) await prisma.category.update({ where: { id: existing.id }, data: { name: category.name, slug, imageId } });
    else await prisma.category.create({ data: { name: category.name, slug, imageId } });
  }
  for (const product of products) {
    const imageId = mediaByFilename.get(product.image);
    if (!imageId) throw new Error(`Missing product image: ${product.image}`);
    const slug = product.name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
    const data = { name: product.name, slug, description: null, price: product.price, stockQuantity: product.outOfStock ? 0 : 1, featured: true };
    const existing = await prisma.product.findUnique({ where: { sku: product.sku } });
    const saved = existing ? await prisma.product.update({ where: { id: existing.id }, data }) : await prisma.product.create({ data: { ...data, sku: product.sku } });
    await prisma.productImage.deleteMany({ where: { productId: saved.id } });
    await prisma.productImage.create({ data: { productId: saved.id, mediaId: imageId, sortOrder: 0 } });
  }
  await prisma.homepageBlock.upsert({ where: { key: "hero" }, update: { content: heroes.map((hero) => ({ image: `/uploads/${hero.image}`, alt: hero.alt })) }, create: { key: "hero", content: heroes.map((hero) => ({ image: `/uploads/${hero.image}`, alt: hero.alt })) } });
  await prisma.homepageBlock.upsert({ where: { key: "navigation" }, update: { content: navigation }, create: { key: "navigation", content: navigation } });
  await prisma.homepageBlock.upsert({ where: { key: "services" }, update: { content: services }, create: { key: "services", content: services } });
  console.log(JSON.stringify({ products: products.length, categories: categories.length, media: assetFiles.length, heroes: heroes.length, homepageBlocks: 3 }));
}

main().finally(() => prisma.$disconnect());
