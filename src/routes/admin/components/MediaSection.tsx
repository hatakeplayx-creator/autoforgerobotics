import { useCallback, useEffect, useState, useRef } from "react";
import { fetchMedia, uploadMedia, deleteMedia, replaceMedia, updateMedia, type AdminMedia } from "@/services/adminApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

function formatSize(bytes: number): string {
  if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
  return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}

export default function MediaSection({ token }: { token?: string }) {
  const [mediaList, setMediaList] = useState<AdminMedia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadFolder, setUploadFolder] = useState("media");
  const [replaceTarget, setReplaceTarget] = useState<AdminMedia | null>(null);
  const [editItem, setEditItem] = useState<AdminMedia | null>(null);
  const [editFilename, setEditFilename] = useState("");
  const [editAltText, setEditAltText] = useState("");
  const [deleteConfirm, setDeleteConfirm] = useState<AdminMedia | null>(null);
  const [deleting, setDeleting] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const replaceInputRef = useRef<HTMLInputElement>(null);

  const loadMedia = useCallback(async () => {
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
  },[token]);

  useEffect(() => { void loadMedia(); }, [loadMedia]);

  const handleUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;
    if (files.length > 8 || Array.from(files).some((file) => file.size > 4 * 1024 * 1024) || Array.from(files).reduce((sum,file)=>sum+file.size,0) > 4.3 * 1024 * 1024) { toast.error("Select up to 8 supported images, each under 4 MB and under 4.3 MB total"); e.target.value=""; return; }
    setUploading(true);
    setUploadProgress(0);
    const toastId = toast.loading(`Uploading ${files.length} file(s)...`);
    try {
      await uploadMedia(files, token, setUploadProgress, uploadFolder);
      toast.success("Upload complete", { id: toastId });
      loadMedia();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Upload failed", { id: toastId });
    } finally {
      setUploading(false);
      setUploadProgress(0);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleReplacement = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file=event.target.files?.[0]; if(!file||!replaceTarget)return;
    setUploading(true);setUploadProgress(0);const toastId=toast.loading(`Replacing ${replaceTarget.filename}...`);
    try{await replaceMedia(replaceTarget.id,file,token,setUploadProgress,uploadFolder);toast.success("Image replaced",{id:toastId});setReplaceTarget(null);await loadMedia();}
    catch(err){toast.error(err instanceof Error?err.message:"Replacement failed",{id:toastId});}
    finally{setUploading(false);setUploadProgress(0);if(replaceInputRef.current)replaceInputRef.current.value="";}
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
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold tracking-tight">Media Library</h2>
          <p className="text-sm text-muted-foreground mt-1">
            Upload and manage images
          </p>
        </div>
        <label className="text-sm font-medium">Destination <select value={uploadFolder} onChange={(event)=>setUploadFolder(event.target.value)} disabled={uploading} className="ml-2 rounded-md border bg-background px-3 py-2"><option value="products">Products</option><option value="categories">Categories</option><option value="brands">Brands</option><option value="homepage">Homepage</option><option value="cms">CMS</option><option value="media">General media</option><option value="temp">Temporary</option></select></label>
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
          accept="image/jpeg,image/png,image/webp,image/avif"
          multiple
          className="hidden"
          onChange={handleUpload}
        />
        <input ref={replaceInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/avif" className="hidden" onChange={handleReplacement} />
      </div>
      {uploading && <div className="space-y-1" role="status" aria-live="polite"><div className="h-2 overflow-hidden rounded-full bg-muted"><div className="h-full bg-primary transition-[width]" style={{width:`${uploadProgress}%`}} /></div><p className="text-xs text-muted-foreground">Uploading {uploadProgress}%</p></div>}

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
              {(media.width&&media.height) ? <p className="text-xs text-muted-foreground">{media.width} × {media.height} · {media.format?.toUpperCase()}</p> : null}
              {media.altText && (
                <p className="text-xs text-muted-foreground truncate" title={media.altText}>
                  {media.altText}
                </p>
              )}
              <div className="mt-2 flex gap-2 text-xs">
                <button onClick={() => handleRename(media)} className="rounded border px-3 py-1.5 text-sm">
                  Rename
                </button>
                <button disabled={uploading} onClick={() => { setReplaceTarget(media); replaceInputRef.current?.click(); }} className="rounded border px-3 py-1.5 text-sm disabled:opacity-50">Replace</button>
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
