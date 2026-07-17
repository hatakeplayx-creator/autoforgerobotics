import { useEffect, useState } from "react";
import {
  fetchEnquiries,
  updateEnquiryStatus,
  addEnquiryNote,
  deleteEnquiry,
  exportEnquiriesCsv,
  type AdminEnquiry,
} from "@/services/adminApi";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Search } from "lucide-react";

const STATUS_OPTIONS = ["ALL", "NEW", "CONTACTED", "APPROVED", "REJECTED", "ON_HOLD"] as const;

const statusBadge: Record<string, string> = {
  NEW: "bg-info/10 text-info",
  CONTACTED: "bg-warning/15 text-warning-foreground",
  APPROVED: "bg-success/10 text-success",
  REJECTED: "bg-destructive/10 text-destructive",
  ON_HOLD: "bg-muted text-muted-foreground",
};

export default function EnquiriesSection({ token }: { token?: string }) {
  const [enquiries, setEnquiries] = useState<AdminEnquiry[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");

  const [notesOpen, setNotesOpen] = useState(false);
  const [activeEnquiry, setActiveEnquiry] = useState<AdminEnquiry | null>(null);
  const [noteText, setNoteText] = useState("");
  const [submittingNote, setSubmittingNote] = useState(false);

  const load = () => {
    setLoading(true);
    fetchEnquiries(token, statusFilter === "ALL" ? undefined : statusFilter)
      .then((res) => setEnquiries(res.value))
      .catch(() => toast.error("Failed to load enquiries"))
      .finally(() => setLoading(false));
  };

  useEffect(() => { load(); }, [token, statusFilter]);

  const filtered = enquiries.filter((e) => {
    const q = query.toLowerCase();
    return (
      e.name.toLowerCase().includes(q) ||
      e.email.toLowerCase().includes(q) ||
      (e.companyName ?? "").toLowerCase().includes(q)
    );
  });

  const handleStatus = async (id: string, status: string) => {
    try {
      const updated = await updateEnquiryStatus(id, status, token);
      setEnquiries((prev) => prev.map((e) => (e.id === id ? { ...e, status: updated.status } : e)));
      toast.success(`Enquiry ${status.toLowerCase()}`);
    } catch {
      toast.error("Failed to update status");
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm("Delete this enquiry?")) return;
    try {
      await deleteEnquiry(id, token);
      setEnquiries((prev) => prev.filter((e) => e.id !== id));
      toast.success("Enquiry deleted");
    } catch {
      toast.error("Failed to delete enquiry");
    }
  };

  const handleAddNote = async () => {
    if (!activeEnquiry || !noteText.trim()) return;
    setSubmittingNote(true);
    try {
      await addEnquiryNote(activeEnquiry.id, noteText.trim(), token);
      const res = await fetchEnquiries(token, statusFilter === "ALL" ? undefined : statusFilter);
      setEnquiries(res.value);
      const refreshed = res.value.find((e) => e.id === activeEnquiry.id) ?? activeEnquiry;
      setActiveEnquiry(refreshed);
      setNoteText("");
      toast.success("Note added");
    } catch {
      toast.error("Failed to add note");
    } finally {
      setSubmittingNote(false);
    }
  };

  const handleExport = async () => {
    try {
      const resp = await exportEnquiriesCsv(token);
      if (!resp.ok) throw new Error("Export failed");
      const blob = await resp.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "enquiries.csv";
      a.click();
      URL.revokeObjectURL(url);
      toast.success("CSV downloaded");
    } catch {
      toast.error("Failed to export CSV");
    }
  };

  return (
    <section className="rounded-lg border bg-card">
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
        <div>
          <h2 className="font-semibold">Seller enquiries</h2>
          <p className="text-sm text-muted-foreground">Review and manage seller applications.</p>
        </div>
        <button
          onClick={handleExport}
          className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90"
        >
          Export CSV
        </button>
      </div>
      <div className="p-5">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <div className="relative max-w-md flex-1">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search enquiries"
              className="w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm"
            />
          </div>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            {STATUS_OPTIONS.map((s) => (
              <option key={s} value={s}>
                {s === "ALL" ? "All statuses" : s.replace("_", " ")}
              </option>
            ))}
          </select>
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
          <p className="text-sm text-muted-foreground">No enquiries found.</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((enq) => (
              <div key={enq.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-4">
                <div>
                  <p className="font-medium">{enq.companyName || enq.name}</p>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {enq.email} · {new Date(enq.createdAt).toLocaleDateString("en-IN")}
                  </p>
                </div>
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`rounded-full px-2 py-1 text-xs font-medium ${statusBadge[enq.status] ?? "bg-muted text-muted-foreground"}`}>
                    {enq.status.replace("_", " ")}
                  </span>
                  {(enq.status === "NEW" || enq.status === "CONTACTED" || enq.status === "ON_HOLD") && (
                    <button onClick={() => handleStatus(enq.id, "APPROVED")} className="text-sm text-emerald-600 hover:underline">
                      Approve
                    </button>
                  )}
                  {enq.status !== "REJECTED" && (
                    <button onClick={() => handleStatus(enq.id, "REJECTED")} className="text-sm text-destructive hover:underline">
                      Reject
                    </button>
                  )}
                  <button
                    onClick={() => { setActiveEnquiry(enq); setNotesOpen(true); }}
                    className="rounded border px-3 py-1.5 text-sm"
                  >
                    Notes
                  </button>
                  <button onClick={() => handleDelete(enq.id)} className="rounded border border-destructive px-3 py-1.5 text-sm text-destructive">
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <Dialog open={notesOpen} onOpenChange={(open) => { setNotesOpen(open); if (!open) { setActiveEnquiry(null); setNoteText(""); } }}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Notes — {activeEnquiry?.companyName || activeEnquiry?.name}</DialogTitle>
          </DialogHeader>
          <div className="max-h-64 overflow-y-auto space-y-2">
            {activeEnquiry?.notes && activeEnquiry.notes.length > 0 ? (
              activeEnquiry.notes.map((n) => (
                <div key={n.id} className="rounded border p-3 text-sm">
                  <p>{n.body}</p>
                  <p className="mt-1 text-xs text-muted-foreground">{new Date(n.createdAt).toLocaleString("en-IN")}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-muted-foreground">No notes yet.</p>
            )}
          </div>
          <textarea
            value={noteText}
            onChange={(e) => setNoteText(e.target.value)}
            placeholder="Add a note…"
            rows={3}
            className="w-full rounded-md border bg-background px-3 py-2 text-sm"
          />
          <DialogFooter>
            <button
              onClick={handleAddNote}
              disabled={submittingNote || !noteText.trim()}
              className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50"
            >
              {submittingNote ? "Saving…" : "Add note"}
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}
