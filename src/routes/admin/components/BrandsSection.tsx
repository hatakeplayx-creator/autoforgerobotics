import { useEffect, useState } from "react";
import { fetchBrands, createBrand, updateBrand, deleteBrand, type AdminBrand } from "@/services/adminApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Search } from "lucide-react";

const emptyForm = { name: "", logoUrl: "", sortOrder: 0, active: true };

export default function BrandsSection({ token }: { token?: string }) {
  const [brands, setBrands] = useState<AdminBrand[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<AdminBrand | null>(null);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);

  const load = () => {
    setLoading(true);
    fetchBrands(token)
      .then((res) => setBrands(res.value))
      .catch(() => toast.error("Failed to load brands"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [token]);

  const filtered = brands.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()));

  const openCreate = () => { setEditing(null); setForm(emptyForm); setModalOpen(true); };
  const openEdit = (b: AdminBrand) => { setEditing(b); setForm({ name: b.name, logoUrl: b.logoUrl, sortOrder: b.sortOrder, active: b.active }); setModalOpen(true); };

  const handleSave = async () => {
    if (!form.name.trim()) { toast.error("Name is required"); return; }
    setSaving(true);
    try {
      if (editing) {
        const updated = await updateBrand(editing.id, form, token);
        setBrands((prev) => prev.map((b) => (b.id === editing.id ? updated : b)));
        toast.success("Brand updated");
      } else {
        const created = await createBrand(form, token);
        setBrands((prev) => [...prev, created]);
        toast.success("Brand created");
      }
      setModalOpen(false);
    } catch {
      toast.error(editing ? "Failed to update brand" : "Failed to create brand");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this brand?")) return;
    try {
      await deleteBrand(id, token);
      setBrands((prev) => prev.filter((b) => b.id !== id));
      toast.success("Brand deleted");
    } catch {
      toast.error("Failed to delete brand");
    }
  };

  return (
    <section className="rounded-lg border bg-card">
      <Toaster />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
        <div>
          <h2 className="font-semibold">Brand collaborations</h2>
          <p className="text-sm text-muted-foreground">Manage partner brands and display order.</p>
        </div>
        <button
          onClick={openCreate}
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Add brand
        </button>
      </div>
      <div className="p-5">
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search brands"
            className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm"
          />
        </div>

        {loading ? (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="animate-pulse rounded-md border p-4">
                <div className="h-4 w-48 rounded bg-muted" />
                <div className="mt-2 h-3 w-32 rounded bg-muted" />
              </div>
            ))}
          </div>
        ) : filtered.length === 0 ? (
          <p className="text-sm text-muted-foreground">No brands found.</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((b) => (
              <div key={b.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-4">
                <div className="flex items-center gap-3">
                  {b.logoUrl && (
                    <img src={b.logoUrl} alt={b.name} className="h-8 w-8 rounded object-contain" />
                  )}
                  <div>
                    <p className="font-medium">{b.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      Sort order {b.sortOrder} · {b.active ? "Active" : "Inactive"}
                    </p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => openEdit(b)} className="rounded border px-3 py-1.5 text-sm">
                    Edit
                  </button>
                  <button onClick={() => handleDelete(b.id)} className="rounded border border-destructive px-3 py-1.5 text-sm text-destructive">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={modalOpen} onOpenChange={(open) => { setModalOpen(open); if (!open) setEditing(null); }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{editing ? "Edit brand" : "Add brand"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <label className="text-sm font-medium">
              Name
              <input
                value={form.name}
                onChange={(e) => setForm((f) => ({ ...f, name: e.target.value }))}
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="Brand name"
              />
            </label>
            <label className="text-sm font-medium">
              Logo URL
              <input
                value={form.logoUrl}
                onChange={(e) => setForm((f) => ({ ...f, logoUrl: e.target.value }))}
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm"
                placeholder="https://..."
              />
            </label>
            <label className="text-sm font-medium">
              Sort order
              <input
                type="number"
                value={form.sortOrder}
                onChange={(e) => setForm((f) => ({ ...f, sortOrder: Number(e.target.value) }))}
                className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm"
              />
            </label>
            <label className="flex items-center gap-2 text-sm font-medium">
              <input
                type="checkbox"
                checked={form.active}
                onChange={(e) => setForm((f) => ({ ...f, active: e.target.checked }))}
                className="rounded"
              />
              Active
            </label>
          </div>
          <DialogFooter>
            <button
              onClick={handleSave}
              disabled={saving}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {saving ? "Saving…" : editing ? "Update" : "Create"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
