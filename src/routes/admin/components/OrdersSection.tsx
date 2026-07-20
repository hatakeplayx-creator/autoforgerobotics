import { useCallback, useEffect, useState } from "react";
import { fetchOrders, updateOrderStatus, type AdminOrder } from "@/services/adminApi";
import { toast } from "sonner";
import { Search } from "lucide-react";

const STATUS_STYLES: Record<string, string> = {
  PENDING: "bg-warning/15 text-warning-foreground",
  CONFIRMED: "bg-info/10 text-info",
  PACKED: "bg-primary/10 text-primary",
  SHIPPED: "bg-primary/10 text-primary",
  DELIVERED: "bg-success/10 text-success",
  CANCELLED: "bg-destructive/10 text-destructive",
  REFUNDED: "bg-muted text-muted-foreground",
};

const STATUS_OPTIONS = ["PENDING", "CONFIRMED", "PACKED", "SHIPPED", "DELIVERED", "CANCELLED", "REFUNDED"];

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-IN", { year: "numeric", month: "short", day: "numeric" });
}

export default function OrdersSection({ token }: { token?: string }) {
  const [orders, setOrders] = useState<AdminOrder[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [updatingId, setUpdatingId] = useState<string | null>(null);

  const loadOrders = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await fetchOrders(token);
      setOrders(data.value);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to load orders");
    } finally {
      setLoading(false);
    }
  },[token]);

  useEffect(() => { void loadOrders(); }, [loadOrders]);

  const filtered = orders.filter((o) => {
    const q = search.toLowerCase();
    return o.number.toLowerCase().includes(q) || o.user.name.toLowerCase().includes(q);
  });

  const handleStatusChange = async (orderId: string, newStatus: string) => {
    setUpdatingId(orderId);
    try {
      await updateOrderStatus(orderId, newStatus, token);
      setOrders((prev) => prev.map((o) => o.id === orderId ? { ...o, status: newStatus } : o));
      toast.success(`Order status updated to ${newStatus}`);
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Failed to update status");
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <div className="rounded-lg border bg-card">
        <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
          <div>
            <h2 className="font-semibold">Orders</h2>
            <p className="text-sm text-muted-foreground">Customer details · Items · Invoice · Update status</p>
          </div>
        </div>
        <div className="p-5">
          <div className="relative mb-4 max-w-md">
            <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
            <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Search orders…" className="w-full rounded-md border py-2 pl-9 pr-3 text-sm" />
          </div>

          {loading && <div className="flex items-center justify-center py-12"><div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" /></div>}

          {error && <div className="rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive">{error} <button onClick={loadOrders} className="ml-3 underline">Retry</button></div>}

          {!loading && !error && filtered.length === 0 && <p className="py-12 text-center text-sm text-muted-foreground">No orders found.</p>}

          {!loading && !error && filtered.length > 0 && (
            <div className="space-y-2">
              {filtered.map((order) => (
                <div key={order.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-4">
                  <div>
                    <p className="font-medium">{order.number}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {order.user.name} · {order.items.length} item{order.items.length !== 1 ? "s" : ""} · ₹{Number(order.total).toLocaleString("en-IN")} · {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[order.status] ?? "bg-muted text-muted-foreground"}`}>{order.status}</span>
                    <select value={order.status} disabled={updatingId === order.id} onChange={(e) => handleStatusChange(order.id, e.target.value)} className="rounded-md border bg-background px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-ring disabled:opacity-50">
                      {STATUS_OPTIONS.map((s) => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
