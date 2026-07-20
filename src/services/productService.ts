import { apiFetch, resolveMediaUrl } from "@/services/api";
import type { Category, HeroBanner, Product, ServiceItem } from "@/types/store";

type HomepageBlock = { id: string; key: string; content: unknown };
let categoriesRequest: Promise<Category[]> | null = null;
let homepageBlocksRequest: Promise<HomepageBlock[]> | null = null;

function normalizeProduct(product: Product): Product {
  return {
    ...product,
    price: Number(product.price),
    compareAtPrice: product.compareAtPrice == null ? undefined : Number(product.compareAtPrice),
    gstPercentage: Number(product.gstPercentage),
    images: (product.images ?? []).map((image) => ({ ...image, media: { ...image.media, url: resolveMediaUrl(image.media.url) } })),
  };
}

export async function getProducts(filters?: { q?: string; category?: string; brand?: string; sortBy?: string }): Promise<Product[]> {
  const params = new URLSearchParams();
  if (filters?.q) params.set("q", filters.q);
  const products = (await apiFetch<Product[]>(`/api/products${params.size ? `?${params}` : ""}`)).map(normalizeProduct);
  let result = products;
  if (filters?.category) result = result.filter((product) => product.category?.name === filters.category);
  if (filters?.brand) result = result.filter((product) => filters.brand!.split(",").includes(product.brand ?? ""));
  if (filters?.sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
  if (filters?.sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
  return result;
}

export async function getProductBySku(sku: string): Promise<Product | undefined> {
  const products = await getProducts({ q: sku });
  return products.find((product) => product.sku === sku);
}

export async function getCategories(): Promise<Category[]> {
  if (!categoriesRequest) {
    categoriesRequest = apiFetch<Category[]>("/api/categories")
      .then((categories) => categories.map((category) => ({ ...category, image: category.image ? { ...category.image, url: resolveMediaUrl(category.image.url) } : undefined })))
      .catch((error: unknown) => {
        categoriesRequest = null;
        throw error;
      });
  }
  return categoriesRequest;
}

async function getBlocks(): Promise<HomepageBlock[]> {
  if (!homepageBlocksRequest) {
    homepageBlocksRequest = apiFetch<HomepageBlock[]>("/api/homepage").catch((error: unknown) => {
      homepageBlocksRequest = null;
      throw error;
    });
  }
  return homepageBlocksRequest;
}

export async function getHeroBanners(): Promise<HeroBanner[]> {
  const block = (await getBlocks()).find((item) => item.key === "hero");
  if (!Array.isArray(block?.content)) return [];
  return block.content.flatMap((item) => {
    if (!item || typeof item !== "object") return [];
    const value = item as { image?: string; alt?: string; title?: string };
    return value.image ? [{ image: resolveMediaUrl(value.image), alt: value.alt ?? value.title ?? "Hero banner" }] : [];
  });
}

export async function getServices(): Promise<ServiceItem[]> {
  const block = (await getBlocks()).find((item) => item.key === "services");
  return Array.isArray(block?.content) ? block.content.filter((item): item is ServiceItem => Boolean(item && typeof item === "object" && "name" in item && "emoji" in item)) : [];
}

export async function getNavLinks(): Promise<string[]> {
  const block = (await getBlocks()).find((item) => item.key === "navigation");
  return Array.isArray(block?.content) ? block.content.filter((item): item is string => typeof item === "string") : [];
}
