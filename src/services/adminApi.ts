import { apiFetch, apiUrl, authHeaders as buildAuthHeaders, resolveMediaUrl } from "@/services/api";

const authHeaders = (token?: string): Record<string, string> => buildAuthHeaders(token);
const collection = async <T>(path: string, token?: string): Promise<{ value: T[] }> => ({ value: await apiFetch<T[]>(path, { headers: authHeaders(token) }) });

// ─── Dashboard ───────────────────────────────────────────────────────────────
export interface DashboardMetrics {
  totalOrders: number;
  totalRevenue: number;
  totalProducts: number;
  totalCustomers: number;
  recentOrders: Array<{ id: string; number: string; total: number; status: string; createdAt: string; user: { name: string; email: string } }>;
  lowStock: Array<{ id: string; name: string; stockQuantity: number }>;
}

export async function fetchDashboard(token?: string): Promise<DashboardMetrics> {
  const h = authHeaders(token);
  const [orders, products, customers] = await Promise.all([
    collection<{ id: string; number: string; total: number; status: string; createdAt: string; user: { name: string; email: string } }>("/api/orders", token),
    collection<{ id: string; name: string; stockQuantity: number; lowStockThreshold: number; price: number }>("/api/products", token),
    collection<{ id: string; name: string; email: string }>("/api/customers", token),
  ]);
  const totalRevenue = orders.value.reduce((sum: number, o: { total: number }) => sum + Number(o.total), 0);
  const lowStock = products.value.filter((p: { stockQuantity: number; lowStockThreshold: number }) => p.stockQuantity <= p.lowStockThreshold).sort((a: { stockQuantity: number }, b: { stockQuantity: number }) => a.stockQuantity - b.stockQuantity).slice(0, 5);
  return {
    totalOrders: orders.value.length,
    totalRevenue,
    totalProducts: products.value.length,
    totalCustomers: customers.value.length,
    recentOrders: orders.value.slice(0, 5),
    lowStock,
  };
}

// ─── Products ────────────────────────────────────────────────────────────────
export interface AdminProduct {
  id: string; name: string; slug: string; sku: string; description: string | null;
  price: number; compareAtPrice?: number | null; stockQuantity: number;
  lowStockThreshold: number; featured: boolean; categoryId?: string | null;
  brand?: string | null; hsnCode?: string | null; gstPercentage: number;
  specifications?: unknown; createdAt: string; updatedAt: string;
  category?: { id: string; name: string; slug: string } | null;
  images?: Array<{ id: string; media: { id: string; url: string; altText?: string | null } }>;
}

export function fetchProducts(token?: string) {
  return collection<AdminProduct>("/api/products", token);
}

export function fetchProduct(id: string, token?: string) {
  return apiFetch<AdminProduct>(`/api/products/${id}`, { headers: authHeaders(token) });
}

export interface CreateProductInput {
  name: string; slug: string; sku: string; description: string;
  price: number; compareAtPrice?: number; stockQuantity: number;
  lowStockThreshold?: number; featured?: boolean; categoryId?: string | null;
  brand?: string | null; hsnCode?: string; gstPercentage?: number;
  specifications?: Record<string, unknown>; imageIds?: string[];
}

export function createProduct(data: CreateProductInput, token?: string) {
  return apiFetch<AdminProduct>("/api/products", { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json", ...authHeaders(token) } });
}

export function updateProduct(id: string, data: Partial<CreateProductInput>, token?: string) {
  return apiFetch<AdminProduct>(`/api/products/${id}`, { method: "PATCH", body: JSON.stringify(data), headers: { "Content-Type": "application/json", ...authHeaders(token) } });
}

export function deleteProduct(id: string, token?: string) {
  return apiFetch<void>(`/api/products/${id}`, { method: "DELETE", headers: authHeaders(token) });
}

export interface ProductImportRow {
  name: string; sku: string; slug?: string; description: string; price: number;
  compareAtPrice?: number | null; stockQuantity?: number; lowStockThreshold?: number;
  category?: string; brand?: string; specifications?: Record<string, unknown>;
  imageUrls?: string[]; featured?: boolean;
}

export interface ProductImportPreview { valid: ProductImportRow[]; invalid: Array<{ row: number; errors: string[] }>; }
export interface ProductImportResult { batchId: string; created: number; updated: number; categories: number; invalid: Array<{ row: number; errors: string[] }>; }

export function previewProductImport(rows: unknown[], token?: string) {
  return apiFetch<ProductImportPreview>("/api/products/import/preview", { method: "POST", body: JSON.stringify({ rows }), headers: { "Content-Type": "application/json", ...authHeaders(token) } });
}

export function importProducts(rows: unknown[], dryRun: boolean, token?: string) {
  return apiFetch<ProductImportResult>("/api/products/import", { method: "POST", body: JSON.stringify({ rows, dryRun }), headers: { "Content-Type": "application/json", ...authHeaders(token) } });
}

// ─── Categories ──────────────────────────────────────────────────────────────
export interface AdminCategory {
  id: string; name: string; slug: string; imageId?: string | null;
  createdAt: string; updatedAt: string;
  image?: { id: string; url: string; altText?: string | null } | null;
  _count?: { products: number };
}

export function fetchCategories(token?: string) {
  return collection<AdminCategory>("/api/categories", token);
}

export function createCategory(data: { name: string; slug: string; imageId?: string }, token?: string) {
  return apiFetch<AdminCategory>("/api/categories", { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json", ...authHeaders(token) } });
}

export function updateCategory(id: string, data: { name?: string; slug?: string; imageId?: string | null }, token?: string) {
  return apiFetch<AdminCategory>(`/api/categories/${id}`, { method: "PATCH", body: JSON.stringify(data), headers: { "Content-Type": "application/json", ...authHeaders(token) } });
}

export function deleteCategory(id: string, token?: string) {
  return apiFetch<void>(`/api/categories/${id}`, { method: "DELETE", headers: authHeaders(token) });
}

// ─── Orders ──────────────────────────────────────────────────────────────────
export interface AdminOrder {
  id: string; number: string; status: string; subtotal: number; tax: number;
  shipping: number; total: number; createdAt: string; updatedAt: string;
  user: { id: string; name: string; email: string };
  items: Array<{ id: string; productName: string; quantity: number; unitPrice: number }>;
  payment?: { status: string; provider: string } | null;
  shipment?: { status: string; awbNumber?: string | null } | null;
}

export function fetchOrders(token?: string) {
  return collection<AdminOrder>("/api/orders", token);
}

export function updateOrderStatus(id: string, status: string, token?: string) {
  return apiFetch<AdminOrder>(`/api/orders/${id}/status`, { method: "PATCH", body: JSON.stringify({ status }), headers: { "Content-Type": "application/json", ...authHeaders(token) } });
}

// ─── Customers ───────────────────────────────────────────────────────────────
export interface AdminCustomer {
  id: string; name: string; email: string; phone?: string | null;
  createdAt: string;
  addresses?: Array<{ id: string; line1: string; city: string; state: string }>;
  orders?: Array<{ id: string; total: number; status: string }>;
}

export function fetchCustomers(token?: string) {
  return collection<AdminCustomer>("/api/customers", token);
}

// ─── Enquiries ───────────────────────────────────────────────────────────────
export interface AdminEnquiry {
  id: string; type: string; name: string; email: string; phone?: string | null;
  companyName?: string | null; status: string; message: string;
  details?: unknown; createdAt: string; updatedAt: string;
  notes?: Array<{ id: string; body: string; createdAt: string }>;
}

export function fetchEnquiries(token?: string, status?: string) {
  const q = status ? `?status=${status}` : "";
  return collection<AdminEnquiry>(`/api/enquiries${q}`, token);
}

export function updateEnquiryStatus(id: string, status: string, token?: string) {
  return apiFetch<AdminEnquiry>(`/api/enquiries/${id}`, { method: "PATCH", body: JSON.stringify({ status }), headers: { "Content-Type": "application/json", ...authHeaders(token) } });
}

export function addEnquiryNote(id: string, body: string, token?: string) {
  return apiFetch<{ id: string; body: string }>(`/api/enquiries/${id}/notes`, { method: "POST", body: JSON.stringify({ body }), headers: { "Content-Type": "application/json", ...authHeaders(token) } });
}

export function deleteEnquiry(id: string, token?: string) {
  return apiFetch<void>(`/api/enquiries/${id}`, { method: "DELETE", headers: authHeaders(token) });
}

export function exportEnquiriesCsv(token?: string) {
  return fetch(apiUrl("/api/enquiries/export.csv"), { credentials: "include", headers: authHeaders(token) });
}

// ─── Brands ──────────────────────────────────────────────────────────────────
export interface AdminBrand {
  id: string; name: string; logoUrl: string; sortOrder: number; active: boolean;
  createdAt: string; updatedAt: string;
}

export function fetchBrands(token?: string) {
  return collection<AdminBrand>("/api/brands", token);
}

export function createBrand(data: { name: string; logoUrl: string; sortOrder?: number; active?: boolean }, token?: string) {
  return apiFetch<AdminBrand>("/api/brands", { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json", ...authHeaders(token) } });
}

export function updateBrand(id: string, data: Partial<{ name: string; logoUrl: string; sortOrder: number; active: boolean }>, token?: string) {
  return apiFetch<AdminBrand>(`/api/brands/${id}`, { method: "PATCH", body: JSON.stringify(data), headers: { "Content-Type": "application/json", ...authHeaders(token) } });
}

export function deleteBrand(id: string, token?: string) {
  return apiFetch<void>(`/api/brands/${id}`, { method: "DELETE", headers: authHeaders(token) });
}

// ─── CMS (Homepage Blocks) ───────────────────────────────────────────────────
export interface AdminHomepageBlock {
  id: string; key: string; content: unknown; updatedAt: string;
}

export function fetchHomepageBlocks(token?: string) {
  return collection<AdminHomepageBlock>("/api/homepage", token);
}

export function updateHomepageBlock(id: string, content: unknown, token?: string) {
  return apiFetch<AdminHomepageBlock>(`/api/homepage/${id}`, { method: "PATCH", body: JSON.stringify({ content }), headers: { "Content-Type": "application/json", ...authHeaders(token) } });
}

export function createHomepageBlock(data: { key: string; content: unknown }, token?: string) {
  return apiFetch<AdminHomepageBlock>("/api/homepage", { method: "POST", body: JSON.stringify(data), headers: { "Content-Type": "application/json", ...authHeaders(token) } });
}

export function deleteHomepageBlock(id: string, token?: string) {
  return apiFetch<void>(`/api/homepage/${id}`, { method: "DELETE", headers: authHeaders(token) });
}

// ─── Media ───────────────────────────────────────────────────────────────────
export interface AdminMedia {
  id: string; key: string; url: string; filename: string; mimeType: string;
  size: number; altText?: string | null; createdAt: string;
  provider?: "local" | "cloudinary" | "external"; publicId?: string | null;
  secureUrl?: string | null; format?: string | null; width?: number | null; height?: number | null;
}

export function fetchMedia(token?: string) {
  return collection<AdminMedia>("/api/media", token).then(({ value }) => ({ value: value.map(media => ({ ...media, url: resolveMediaUrl(media.url) })) }));
}

function sendMediaForm<T>(path: string, form: FormData, token?: string, onProgress?: (percent: number) => void): Promise<T> {
  return new Promise((resolve, reject) => {
    const request = new XMLHttpRequest();
    request.open("POST", apiUrl(path));
    if (token) request.setRequestHeader("Authorization", `Bearer ${token}`);
    request.upload.onprogress = (event) => { if (event.lengthComputable) onProgress?.(Math.round((event.loaded / event.total) * 100)); };
    request.onerror = () => reject(new Error("Upload failed because the network connection was interrupted"));
    request.onload = () => {
      let body: unknown;
      try { body = request.responseText ? JSON.parse(request.responseText) : undefined; } catch { body = undefined; }
      if (request.status >= 200 && request.status < 300) resolve(body as T);
      else reject(new Error((body as { message?: string } | undefined)?.message ?? `Upload failed (${request.status})`));
    };
    request.send(form);
  });
}

export async function uploadMedia(files: FileList, token?: string, onProgress?: (percent: number) => void, folder = "media"): Promise<AdminMedia[]> {
  const form = new FormData();
  for (let i = 0; i < files.length; i++) form.append("files", files[i]);
  form.append("folder", folder);
  const media = await sendMediaForm<AdminMedia[]>("/api/media", form, token, onProgress);
  return media.map(item => ({ ...item, url: resolveMediaUrl(item.url) }));
}

export async function replaceMedia(id: string, file: File, token?: string, onProgress?: (percent: number) => void, folder = "media"): Promise<AdminMedia> {
  const form = new FormData(); form.append("file", file); form.append("folder", folder);
  const media = await sendMediaForm<AdminMedia>(`/api/media/${id}/replace`, form, token, onProgress);
  return { ...media, url: resolveMediaUrl(media.url) };
}

export function updateMedia(id: string, data: { filename?: string; altText?: string }, token?: string) {
  return apiFetch<AdminMedia>(`/api/media/${id}`, { method: "PATCH", body: JSON.stringify(data), headers: { "Content-Type": "application/json", ...authHeaders(token) } });
}

export function deleteMedia(id: string, token?: string) {
  return apiFetch<void>(`/api/media/${id}`, { method: "DELETE", headers: authHeaders(token) });
}

// ─── Settings ────────────────────────────────────────────────────────────────
export interface AdminSetting { key: string; value: unknown; updatedAt: string }

export function fetchSettings(token?: string) {
  return collection<AdminSetting>("/api/settings", token);
}

export function saveSetting(key: string, value: unknown, token?: string) {
  return apiFetch<AdminSetting>(`/api/settings/${key}`, { method: "PUT", body: JSON.stringify({ value }), headers: { "Content-Type": "application/json", ...authHeaders(token) } });
}
