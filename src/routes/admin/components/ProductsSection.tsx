import { useEffect, useState, useCallback } from "react";
import { fetchCategories, fetchProducts, createProduct, updateProduct, deleteProduct, type AdminCategory, type AdminProduct } from "@/services/adminApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { ApiError } from "@/services/api";

type FormData = {
  name: string;
  slug: string;
  sku: string;
  description: string;
  price: string;
  compareAtPrice: string;
  stockQuantity: string;
  lowStockThreshold: string;
  featured: boolean;
  categoryId: string;
  brand: string;
  specifications: string;
  imageIds: string;
};

const emptyForm: FormData = {
  name: "",
  slug: "",
  sku: "",
  description: "",
  price: "",
  compareAtPrice: "",
  stockQuantity: "",
  lowStockThreshold: "5",
  featured: false,
  categoryId: "",
  brand: "",
  specifications: "",
  imageIds: "",
};

function generateSlug(name: string): string {
  return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}

function statusBadge(product: AdminProduct): { text: string; className: string } {
  if (product.stockQuantity <= 0) return { text: "Out of Stock", className: "rounded-full bg-destructive/10 px-2 py-0.5 text-xs text-destructive" };
  if (product.stockQuantity <= product.lowStockThreshold) return { text: "Low Stock", className: "rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800" };
  return { text: "In Stock", className: "rounded-full bg-success/10 px-2 py-0.5 text-xs text-success" };
}

function Input({ label, value, onChange, type = "text", placeholder, required }: { label: string; value: string; onChange: (v: string) => void; type?: string; placeholder?: string; required?: boolean }) {
  return (
    <label className="text-sm font-medium">
      {label}
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        required={required}
        className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm"
      />
    </label>
  );
}

export default function ProductsSection({ token }: { token?: string }) {
  const [products, setProducts] = useState<AdminProduct[]>([]);
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [query, setQuery] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const [formData, setFormData] = useState<FormData>(emptyForm);
  const [editId, setEditId] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  const loadProducts = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetchProducts(token);
      setProducts(res.value || []);
    } catch {
      setError("Failed to load products");
    } finally {
      setLoading(false);
    }
  }, [token]);

  useEffect(() => { loadProducts(); }, [loadProducts]);
  useEffect(() => {
    void fetchCategories(token).then((response) => setCategories(response.value)).catch(() => setCategories([]));
  }, [token]);

  const openAddModal = () => {
    setEditId(null);
    setFormData(emptyForm);
    setModalOpen(true);
  };

  const openEditModal = (product: AdminProduct) => {
    setEditId(product.id);
    setFormData({
      name: product.name,
      slug: product.slug,
      sku: product.sku,
      description: product.description ?? "",
      price: product.price.toString(),
      compareAtPrice: product.compareAtPrice?.toString() || "",
      stockQuantity: product.stockQuantity.toString(),
      lowStockThreshold: product.lowStockThreshold.toString(),
      featured: product.featured,
      categoryId: product.categoryId || "",
      brand: product.brand || "",
      specifications: product.specifications ? JSON.stringify(product.specifications) : "",
      imageIds: product.images?.map((image) => image.media.id).join(", ") || "",
    });
    setModalOpen(true);
  };

  const handleNameChange = (name: string) => {
    if (!editId) {
      setFormData((prev) => ({ ...prev, name, slug: generateSlug(name) }));
    } else {
      setFormData((prev) => ({ ...prev, name }));
    }
  };

  const handleSave = async () => {
    setFieldErrors({});
    if (!formData.name || !formData.slug || !formData.sku || !formData.description || !formData.price) {
      toast.error("Please fill all required fields");
      return;
    }
    setSaving(true);
    try {
      let specifications: Record<string, unknown> | undefined;
      if (formData.specifications.trim()) {
        try {
          const parsed: unknown = JSON.parse(formData.specifications);
          if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) throw new Error("Specifications must be a JSON object");
          specifications = parsed as Record<string, unknown>;
        } catch (error) {
          setFieldErrors({ specifications: [error instanceof Error ? error.message : "Invalid specifications"] });
          return;
        }
      }
      const imageIds = formData.imageIds.split(",").map((value) => value.trim()).filter(Boolean);
      const payload = {
        name: formData.name,
        slug: formData.slug,
        sku: formData.sku,
        description: formData.description,
        price: Number(formData.price),
        compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : undefined,
        stockQuantity: Number(formData.stockQuantity),
        lowStockThreshold: Number(formData.lowStockThreshold),
        featured: formData.featured,
        categoryId: formData.categoryId.trim() || null,
        brand: formData.brand.trim() || null,
        specifications,
        imageIds: imageIds.length ? imageIds : undefined,
      };
      if (editId) {
        await updateProduct(editId, payload, token);
        toast.success("Product updated");
      } else {
        await createProduct(payload, token);
        toast.success("Product created");
      }
      setModalOpen(false);
      await loadProducts();
    } catch (err: unknown) {
      if (err instanceof ApiError) setFieldErrors(err.fields);
      const msg = err instanceof Error ? err.message : "Failed to save product";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  const handleDeleteConfirmed = async () => {
    if (!deleteConfirm) return;
    try {
      await deleteProduct(deleteConfirm, token);
      toast.success("Product deleted");
      setDeleteConfirm(null);
      await loadProducts();
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to delete product";
      toast.error(msg);
    }
  };

  const filtered = products.filter((p) => {
    const search = query.toLowerCase();
    return p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search);
  });

  if (error) {
    return (
      <section className="rounded-lg border bg-card p-5">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="font-semibold">Products</h2>
            <p className="text-sm text-muted-foreground">Manage your product catalog.</p>
          </div>
        </div>
        <p className="mt-6 text-sm text-destructive">{error}</p>
        <button
          onClick={loadProducts}
          className="mt-4 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Retry
        </button>
      </section>
    );
  }

  return (
    <>
      <section className="rounded-lg border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
          <div>
            <h2 className="font-semibold">Products</h2>
            <p className="text-sm text-muted-foreground">Manage your product catalog.</p>
          </div>
          <button onClick={openAddModal} className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
            Add product
          </button>
        </div>
        <div className="p-5">
          <div className="relative mb-4 max-w-md">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search products"
              className="w-full rounded-md border py-2 pl-9 pr-3 text-sm"
            />
          </div>
          {loading ? (
            <p className="text-sm text-muted-foreground">Loading...</p>
          ) : filtered.length === 0 ? (
            <p className="text-sm text-muted-foreground">No products found.</p>
          ) : (
            <div className="space-y-2">
              {filtered.map((product) => {
                const status = statusBadge(product);
                return (
                  <div key={product.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-4">
                    <div>
                      <p className="font-medium">{product.name}</p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        {product.sku} · ${product.price} · {product.stockQuantity} pc · {product.category?.name ?? "Uncategorised"} · <span className={status.className}>{status.text}</span>
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button className="rounded border px-3 py-1.5 text-sm" onClick={() => openEditModal(product)}>Edit</button>
                      <button className="rounded border border-destructive px-3 py-1.5 text-sm text-destructive" onClick={() => setDeleteConfirm(product.id)}>Delete</button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </section>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editId ? "Edit product" : "Add product"}</DialogTitle>
          </DialogHeader>
          <div className="grid gap-4">
            {Object.keys(fieldErrors).length > 0 && <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{Object.entries(fieldErrors).map(([field, messages]) => <p key={field}>{field}: {messages.join(", ")}</p>)}</div>}
            <div className="grid grid-cols-2 gap-4">
              <Input label="Name" value={formData.name} onChange={handleNameChange} required />
              <Input label="Slug" value={formData.slug} onChange={(v) => setFormData((p) => ({ ...p, slug: v }))} required />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <Input label="SKU" value={formData.sku} onChange={(v) => setFormData((p) => ({ ...p, sku: v }))} required />
              <label className="text-sm font-medium">Category<select value={formData.categoryId} onChange={(event) => setFormData((current) => ({ ...current, categoryId: event.target.value }))} className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm"><option value="">Uncategorised</option>{categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}</select></label>
            </div>
            <label className="text-sm font-medium">
              Description
              <textarea
                value={formData.description}
                onChange={(e) => setFormData((p) => ({ ...p, description: e.target.value }))}
                required
                rows={3}
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </label>
            <div className="grid grid-cols-2 gap-4">
              <Input label="Price" type="number" value={formData.price} onChange={(v) => setFormData((p) => ({ ...p, price: v }))} required />
              <Input label="Compare-at Price" type="number" value={formData.compareAtPrice} onChange={(v) => setFormData((p) => ({ ...p, compareAtPrice: v }))} />
            </div>
            <Input label="Brand (optional)" value={formData.brand} onChange={(v) => setFormData((p) => ({ ...p, brand: v }))} />
            <label className="text-sm font-medium">Specifications (JSON object, optional)<textarea value={formData.specifications} onChange={(e) => setFormData((p) => ({ ...p, specifications: e.target.value }))} rows={3} className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm" placeholder='{"voltage":"5V"}' /></label>
            <Input label="Media IDs (comma-separated, optional)" value={formData.imageIds} onChange={(v) => setFormData((p) => ({ ...p, imageIds: v }))} />
            <div className="grid grid-cols-2 gap-4">
              <Input label="Stock Quantity" type="number" value={formData.stockQuantity} onChange={(v) => setFormData((p) => ({ ...p, stockQuantity: v }))} required />
              <Input label="Low Stock Threshold" type="number" value={formData.lowStockThreshold} onChange={(v) => setFormData((p) => ({ ...p, lowStockThreshold: v }))} />
            </div>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={formData.featured}
                onChange={(e) => setFormData((p) => ({ ...p, featured: e.target.checked }))}
                className="size-4"
              />
              Featured
            </label>
          </div>
          <DialogFooter>
            <button onClick={() => setModalOpen(false)} className="rounded border px-3 py-1.5 text-sm">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              {saving ? "Saving..." : editId ? "Update" : "Create"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>Delete product</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">Are you sure you want to delete this product? This action cannot be undone.</p>
          <DialogFooter>
            <button onClick={() => setDeleteConfirm(null)} className="rounded border px-3 py-1.5 text-sm">
              Cancel
            </button>
            <button
              onClick={handleDeleteConfirmed}
              className="rounded border border-destructive px-3 py-1.5 text-sm text-destructive"
            >
              Delete
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

    </>
  );
}
