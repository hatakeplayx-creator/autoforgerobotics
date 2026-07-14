import { useEffect, useState } from "react";
import { fetchCategories, createCategory, updateCategory, deleteCategory, type AdminCategory } from "@/services/adminApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search } from "lucide-react";
import { ApiError } from "@/services/api";

export default function CategoriesSection({ token }: { token?: string }) {
  const [categories, setCategories] = useState<AdminCategory[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [query, setQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminCategory | null>(null);
  const [formName, setFormName] = useState("");
  const [formSlug, setFormSlug] = useState("");
  const [saving, setSaving] = useState(false);

  const [confirmDelete, setConfirmDelete] = useState<AdminCategory | null>(null);
  const [deleting, setDeleting] = useState(false);
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});

  async function load() {
    try {
      setLoading(true);
      setError(null);
      const res = await fetchCategories(token);
      setCategories(res.value);
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : "Failed to load categories");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, [token]);

  const filtered = categories.filter(
    (c) =>
      c.name.toLowerCase().includes(query.toLowerCase()) ||
      c.slug.toLowerCase().includes(query.toLowerCase()),
  );

  function slugify(name: string) {
    return name
      .toLowerCase()
      .trim()
      .replace(/[^a-z0-9\s-]/g, "")
      .replace(/\s+/g, "-")
      .replace(/-+/g, "-");
  }

  function openCreate() {
    setEditing(null);
    setFormName("");
    setFormSlug("");
    setFieldErrors({});
    setModalOpen(true);
  }

  function openEdit(cat: AdminCategory) {
    setEditing(cat);
    setFormName(cat.name);
    setFormSlug(cat.slug);
    setFieldErrors({});
    setModalOpen(true);
  }

  function handleNameChange(val: string) {
    setFormName(val);
    if (!editing) setFormSlug(slugify(val));
  }

  async function handleSave() {
    if (!formName.trim() || !formSlug.trim()) {
      toast.error("Name and slug are required");
      return;
    }
    setSaving(true);
    setFieldErrors({});
    try {
      if (editing) {
        await updateCategory(editing.id, { name: formName.trim(), slug: formSlug.trim() }, token);
        toast.success("Category updated");
      } else {
        await createCategory({ name: formName.trim(), slug: formSlug.trim() }, token);
        toast.success("Category created");
      }
      setModalOpen(false);
      await load();
    } catch (err: unknown) {
      if (err instanceof ApiError) setFieldErrors(err.fields);
      toast.error(err instanceof Error ? err.message : "Save failed");
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!confirmDelete) return;
    setDeleting(true);
    try {
      await deleteCategory(confirmDelete.id, token);
      toast.success("Category deleted");
      setConfirmDelete(null);
      await load();
    } catch (err: unknown) {
      toast.error(err instanceof Error ? err.message : "Delete failed");
    } finally {
      setDeleting(false);
    }
  }

  return (
    <section className="rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
        <div>
          <h2 className="font-semibold">Categories</h2>
          <p className="text-sm text-muted-foreground">Organize your products into categories.</p>
        </div>
        <button onClick={openCreate} className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Add category
        </button>
      </div>

      <div className="p-5">
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search categories"
            className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm"
          />
        </div>

        {loading && <p className="text-sm text-muted-foreground">Loading categories...</p>}
        {error && <p className="text-sm text-destructive">{error}</p>}

        {!loading && !error && filtered.length === 0 && (
          <p className="text-sm text-muted-foreground">No categories found.</p>
        )}

        {!loading && !error && filtered.map((cat) => (
          <div key={cat.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-4">
            <div>
              <p className="font-medium">{cat.name}</p>
              <div className="mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                <span>/{cat.slug}</span>
                <span>{cat.image ? "✓ Image" : "No image"}</span>
                <span>{cat._count?.products ?? 0} products</span>
              </div>
            </div>
            <div className="flex gap-2">
              <button onClick={() => openEdit(cat)} className="rounded border px-3 py-1.5 text-sm">
                Edit
              </button>
              <button onClick={() => setConfirmDelete(cat)} className="rounded border border-destructive px-3 py-1.5 text-sm text-destructive">
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>

      <Dialog open={modalOpen} onOpenChange={setModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editing ? "Edit category" : "Add category"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 py-2">
            {Object.keys(fieldErrors).length > 0 && <div className="rounded-md border border-destructive/50 bg-destructive/10 p-3 text-sm text-destructive">{Object.entries(fieldErrors).map(([field, messages]) => <p key={field}>{field}: {messages.join(", ")}</p>)}</div>}
            <label className="text-sm font-medium">
              Name
              <input
                value={formName}
                onChange={(e) => handleNameChange(e.target.value)}
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm"
                required
              />
            </label>
            <label className="text-sm font-medium">
              Slug
              <input
                value={formSlug}
                onChange={(e) => setFormSlug(e.target.value)}
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm"
                required
              />
            </label>
          </div>
          <DialogFooter>
            <button onClick={() => setModalOpen(false)} className="rounded border px-3 py-1.5 text-sm">
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving..." : editing ? "Update" : "Create"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!confirmDelete} onOpenChange={(open) => { if (!open) setConfirmDelete(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete category</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete &quot;{confirmDelete?.name}&quot;? This action cannot be undone.
          </p>
          <DialogFooter>
            <button onClick={() => setConfirmDelete(null)} className="rounded border px-3 py-1.5 text-sm">
              Cancel
            </button>
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="rounded border border-destructive px-3 py-1.5 text-sm text-destructive disabled:opacity-50"
            >
              {deleting ? "Deleting..." : "Delete"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
