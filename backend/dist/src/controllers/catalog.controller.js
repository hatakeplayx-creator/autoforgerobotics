import { prisma } from "../config/prisma.js";
import { pagination, idParams } from "../validators/common.js";
import { productInput, categoryInput, brandInput } from "../validators/catalog.js";
import { ApiError } from "../utils/api-error.js";
const paged = (page, limit, total, data) => ({ data, meta: { page, limit, total, totalPages: Math.ceil(total / limit) } });
export const listProducts = async (req, res) => { const { page, limit, q } = pagination.parse(req.query); const where = q ? { OR: [{ name: { contains: q, mode: "insensitive" } }, { sku: { contains: q, mode: "insensitive" } }] } : {}; const [data, total] = await prisma.$transaction([prisma.product.findMany({ where, skip: (page - 1) * limit, take: limit, include: { category: true, images: { include: { media: true } } }, orderBy: { createdAt: "desc" } }), prisma.product.count({ where })]); res.json(paged(page, limit, total, data)); };
export const getProduct = async (req, res) => { const product = await prisma.product.findUnique({ where: idParams.parse(req.params), include: { category: true, images: { include: { media: true } }, reviews: { where: { approved: true } } } }); if (!product)
    throw new ApiError(404, "Product not found"); res.json({ data: product }); };
export const createProduct = async (req, res) => { const input = productInput.parse(req.body); const product = await prisma.$transaction(async (tx) => { const item = await tx.product.create({ data: input }); if (input.stockQuantity)
    await tx.inventoryMovement.create({ data: { productId: item.id, delta: input.stockQuantity, quantityAfter: input.stockQuantity, action: "RECEIVED", note: "Initial stock" } }); return item; }); res.status(201).json({ data: product }); };
export const updateProduct = async (req, res) => res.json({ data: await prisma.product.update({ where: idParams.parse(req.params), data: productInput.partial().parse(req.body) }) });
export const removeProduct = async (req, res) => { await prisma.product.delete({ where: idParams.parse(req.params) }); res.status(204).end(); };
function factory(model, schema) { return { list: async (_req, res) => res.json({ data: await prisma[model].findMany({ orderBy: model === "brandCollaboration" ? { sortOrder: "asc" } : undefined }) }), create: async (req, res) => res.status(201).json({ data: await prisma[model].create({ data: schema.parse(req.body) }) }), update: async (req, res) => res.json({ data: await prisma[model].update({ where: idParams.parse(req.params), data: schema.partial().parse(req.body) }) }), remove: async (req, res) => { await prisma[model].delete({ where: idParams.parse(req.params) }); res.status(204).end(); } }; }
export const categories = factory("category", categoryInput);
export const brands = factory("brandCollaboration", brandInput);
