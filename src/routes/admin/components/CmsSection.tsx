import { useEffect, useState } from "react";
import { fetchHomepageBlocks, updateHomepageBlock, type AdminHomepageBlock } from "@/services/adminApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

const BLOCK_LABELS: Record<string, string> = {
  hero_banners: "Hero banner, text and buttons",
  featured_products: "Featured products",
  promotional_banners: "Offers and promotional banner",
  categories: "Category section",
  trusted_brands: "Brand logos and collaboration section",
  footer: "Footer text and contact details",
};

export default function CmsSection({ token }: { token?: string }) {
  const [blocks, setBlocks] = useState<AdminHomepageBlock[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedBlock, setSelectedBlock] = useState<AdminHomepageBlock | null>(null);
  const [editContent, setEditContent] = useState("");
  const [editError, setEditError] = useState<string | null>(null);
  const [savingId, setSavingId] = useState<string | null>(null);

  const loadBlocks = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchHomepageBlocks(token);
      setBlocks(data.value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load homepage blocks");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadBlocks(); }, [token]);

  const handleConfigure = (block: AdminHomepageBlock) => {
    setSelectedBlock(block);
    setEditContent(JSON.stringify(block.content, null, 2));
    setEditError(null);
  };

  const handleSave = async () => {
    if (!selectedBlock) return;
    setEditError(null);
    let parsed: unknown;
    try {
      parsed = JSON.parse(editContent);
    } catch {
      setEditError("Invalid JSON. Please correct it before saving.");
      return;
    }
    setSavingId(selectedBlock.id);
    try {
      await updateHomepageBlock(selectedBlock.id, parsed, token);
      toast.success(`Block "${selectedBlock.key}" saved`);
      setSelectedBlock(null);
      loadBlocks();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to save block");
    } finally {
      setSavingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Homepage CMS</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Manage homepage content blocks
          </p>
        </div>
        <button
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          onClick={() => toast.info("Changes are saved per-block via the Configure button.")}
        >
          Save changes
        </button>
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
          <button onClick={loadBlocks} className="ml-3 underline underline-offset-2 hover:text-destructive/80">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && blocks.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No homepage blocks found.
        </p>
      )}

      {!loading && !error && blocks.length > 0 && (
        <div className="rounded-lg border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground">
                <th className="px-4 py-3">Block Key</th>
                <th className="px-4 py-3">Description</th>
                <th className="px-4 py-3">Updated</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {blocks.map((block) => (
                <tr key={block.id} className="hover:bg-muted/30 transition-colors">
                  <td className="px-4 py-3 font-medium">{block.key}</td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {BLOCK_LABELS[block.key] || block.key}
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">
                    {new Date(block.updatedAt).toLocaleDateString("en-IN", {
                      year: "numeric", month: "short", day: "numeric",
                    })}
                  </td>
                  <td className="px-4 py-3 text-right">
                    <button onClick={() => handleConfigure(block)} className="rounded border px-3 py-1.5 text-sm">
                      Configure
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <Dialog open={!!selectedBlock} onOpenChange={(open) => { if (!open) setSelectedBlock(null); }}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>
              {selectedBlock?.key
                ? `Configure: ${BLOCK_LABELS[selectedBlock.key] || selectedBlock.key}`
                : "Configure block"}
            </DialogTitle>
          </DialogHeader>
          <div>
            <label className="text-sm font-medium">Content (JSON)</label>
            <textarea
              className="mt-1.5 h-96 w-full rounded-md border px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring"
              value={editContent}
              onChange={(e) => setEditContent(e.target.value)}
            />
            {editError && (
              <p className="mt-1 text-sm text-destructive">{editError}</p>
            )}
          </div>
          <DialogFooter>
            <button
              className="rounded border px-3 py-1.5 text-sm"
              onClick={() => setSelectedBlock(null)}
            >
              Cancel
            </button>
            <button
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
              disabled={savingId !== null}
              onClick={handleSave}
            >
              {savingId !== null ? "Saving..." : "Save"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
