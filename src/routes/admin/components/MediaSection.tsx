import { useEffect, useState, useRef } from "react";
import { fetchMedia, uploadMedia, deleteMedia, updateMedia, type AdminMedia } from "@/services/adminApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function MediaSection({ token }: { token?: string }) {
  const [mediaList, setMediaList] = useState<AdminMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [editItem, setEditItem] = useState<AdminMedia | null>(null);
  const [editFilename, setEditFilename] = useState("");
  const [editAltText, setEditAltText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<AdminMedia | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchMedia(token);
      setMediaList(data.value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load media");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { loadMedia(); }, [token]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    setUploading(true);
    const toastId = toast.loading(`Uploading ${files.length} file(s)...`);
    try {
      await uploadMedia(files, token);
      toast.success("Upload complete", { id: toastId });
      loadMedia();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed", { id: toastId });
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleRename = (item: AdminMedia) => {
    setEditItem(item);
    setEditFilename(item.filename);
    setEditAltText(item.altText || "");
  };

  const handleSaveRename = async () => {
    if (!editItem) return;
    try {
      await updateMedia(editItem.id, { filename: editFilename, altText: editAltText }, token);
      toast.success("Media updated");
      setEditItem(null);
      loadMedia();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update media");
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirm) return;
    setDeleting(true);
    try {
      await deleteMedia(deleteConfirm.id, token);
      toast.success("Media deleted");
      setDeleteConfirm(null);
      loadMedia();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to delete media");
    } finally {
      setDeleting(false);
    }
  };

  return (
    <div className="space-y-6">
      <Toaster />
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Media Library</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Upload and manage images
          </p>
        </div>
        <button
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
          disabled={uploading}
          onClick={() => fileInputRef.current?.click()}
        >
          {uploading ? "Uploading..." : "Upload files"}
        </button>
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
      </div>

      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
        </div>
      )}

      {error && (
        <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">
          {error}
          <button onClick={loadMedia} className="ml-3 underline underline-offset-2 hover:text-destructive/80">
            Retry
          </button>
        </div>
      )}

      {!loading && !error && mediaList.length === 0 && (
        <p className="py-12 text-center text-sm text-muted-foreground">
          No media files yet.
        </p>
      )}

      {!loading && !error && mediaList.length > 0 && (
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {mediaList.map((media) => (
            <div key={media.id} className="rounded-md border p-4">
              <img
                src={media.url}
                alt={media.altText || media.filename}
                className="aspect-video w-full rounded-md object-cover"
              />
              <p className="mt-2 truncate text-sm font-medium" title={media.filename}>
                {media.filename}
              </p>
              <p className="text-xs text-muted-foreground">{formatSize(media.size)}</p>
              {media.altText && (
                <p className="text-xs text-muted-foreground truncate" title={media.altText}>
                  {media.altText}
                </p>
              )}
              <div className="mt-2 flex gap-2 text-xs">
                <button onClick={() => handleRename(media)} className="rounded border px-3 py-1.5 text-sm">
                  Rename
                </button>
                <button
                  onClick={() => setDeleteConfirm(media)}
                  className="rounded border border-destructive px-3 py-1.5 text-sm text-destructive"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      <Dialog open={!!editItem} onOpenChange={(open) => { if (!open) setEditItem(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Media</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div>
              <label className="text-sm font-medium">Filename</label>
              <input
                className="mt-1.5 w-full rounded-md border px-3 py-2"
                value={editFilename}
                onChange={(e) => setEditFilename(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium">Alt Text</label>
              <input
                className="mt-1.5 w-full rounded-md border px-3 py-2"
                value={editAltText}
                onChange={(e) => setEditAltText(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <button onClick={() => setEditItem(null)} className="rounded border px-3 py-1.5 text-sm">
              Cancel
            </button>
            <button
              onClick={handleSaveRename}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Save
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      <Dialog open={!!deleteConfirm} onOpenChange={(open) => { if (!open) setDeleteConfirm(null); }}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Media</DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground">
            Are you sure you want to delete <strong>{deleteConfirm?.filename}</strong>? This action cannot be undone.
          </p>
          <DialogFooter>
            <button onClick={() => setDeleteConfirm(null)} className="rounded border px-3 py-1.5 text-sm">
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
    </div>
  );
}
