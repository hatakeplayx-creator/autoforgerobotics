import { useEffect, useState } from "react";
import { fetchDashboard, type DashboardMetrics } from "@/services/adminApi";
import { toast } from "sonner";

const skeletonBarHeights = [44, 68, 36, 82, 56, 94, 63, 75, 49, 88] as const;

const statusStyle: Record<string, string> = {
  PENDING: "bg-warning/15 text-warning-foreground",
  CONFIRMED: "bg-info/10 text-info",
  SHIPPED: "bg-primary/10 text-primary",
  DELIVERED: "bg-success/10 text-success",
  CANCELLED: "bg-destructive/10 text-destructive",
};

function SkeletonCard() {
  return (
    <div className="rounded-lg border bg-card p-5">
      <div className="h-4 w-24 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-8 w-32 animate-pulse rounded bg-muted" />
      <div className="mt-3 h-3 w-28 animate-pulse rounded bg-muted" />
    </div>
  );
}

export default function DashboardSection({ token }: { token?: string }) {
  const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const data = await fetchDashboard(token);
        if (!cancelled) setMetrics(data);
      } catch {
        toast.error("Failed to load dashboard data");
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => { cancelled = true; };
  }, [token]);

  if (loading) {
    return (
      <>
        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
        <div className="mt-6 grid gap-6 xl:grid-cols-3">
          <div className="rounded-lg border bg-card p-5 xl:col-span-2">
            <div className="h-5 w-40 animate-pulse rounded bg-muted" />
            <div className="mt-8 flex h-48 items-end gap-2">
              {skeletonBarHeights.map((height, i) => (
                <div key={i} className="flex-1 animate-pulse rounded-t bg-muted" style={{ height: `${height}%` }} />
              ))}
            </div>
          </div>
          <div className="rounded-lg border bg-card p-5">
            <div className="h-5 w-36 animate-pulse rounded bg-muted" />
            <div className="mt-4 space-y-4">
              <div className="h-4 w-full animate-pulse rounded bg-muted" />
              <div className="h-4 w-3/4 animate-pulse rounded bg-muted" />
            </div>
          </div>
        </div>
        <div className="mt-6 rounded-lg border bg-card p-5">
          <div className="h-5 w-32 animate-pulse rounded bg-muted" />
          <div className="mt-4 space-y-3">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="h-10 w-full animate-pulse rounded bg-muted" />
            ))}
          </div>
        </div>
      </>
    );
  }

  if (!metrics) return null;

  const chartOrders = metrics.recentOrders.slice(0, 10);
  const maxTotal = Math.max(...chartOrders.map((o) => o.total), 1);

  return (
    <>

      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Orders</p>
          <p className="mt-2 text-2xl font-bold">{metrics.totalOrders.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Revenue</p>
          <p className="mt-2 text-2xl font-bold">
            ₹{metrics.totalRevenue.toLocaleString("en-IN")}
          </p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Products</p>
          <p className="mt-2 text-2xl font-bold">{metrics.totalProducts.toLocaleString()}</p>
        </div>
        <div className="rounded-lg border bg-card p-5">
          <p className="text-sm text-muted-foreground">Total Customers</p>
          <p className="mt-2 text-2xl font-bold">{metrics.totalCustomers.toLocaleString()}</p>
        </div>
      </div>

      <div className="mt-6 grid gap-6 xl:grid-cols-3">
        <section className="rounded-lg border bg-card p-5 xl:col-span-2">
          <div className="flex items-center justify-between">
            <h2 className="font-semibold">Recent Orders</h2>
            <span className="text-sm text-muted-foreground">Last {chartOrders.length} orders</span>
          </div>
          {chartOrders.length === 0 ? (
            <p className="mt-8 text-sm text-muted-foreground">No orders yet.</p>
          ) : (
            <div className="mt-8 flex h-48 items-end gap-2">
              {chartOrders.map((o, i) => (
                <div
                  key={o.id}
                  className="flex flex-1 flex-col items-center gap-1"
                  title={`${o.number}: ₹${o.total.toLocaleString("en-IN")}`}
                >
                  <span className="text-[10px] text-muted-foreground">
                    ₹{(o.total / 1000).toFixed(1)}k
                  </span>
                  <div
                    className="w-full rounded-t bg-primary/80 transition-all"
                    style={{ height: `${(o.total / maxTotal) * 100}%`, minHeight: "4px" }}
                  />
                  <span className="text-[10px] text-muted-foreground">{i + 1}</span>
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="rounded-lg border bg-card p-5">
          <h2 className="font-semibold">Low Stock Alerts</h2>
          {metrics.lowStock.length === 0 ? (
            <p className="mt-4 text-sm text-muted-foreground">All products are well-stocked.</p>
          ) : (
            <div className="mt-4 space-y-4 text-sm">
              {metrics.lowStock.map((p) => (
                <p key={p.id}>
                  <b>{p.name}</b>
                  <br />
                  <span className="text-destructive">{p.stockQuantity} remaining</span>
                </p>
              ))}
            </div>
          )}
        </section>
      </div>

      <section className="mt-6 rounded-lg border bg-card p-5">
        <h2 className="font-semibold">Recent Orders</h2>
        {metrics.recentOrders.length === 0 ? (
          <p className="mt-4 text-sm text-muted-foreground">No orders yet.</p>
        ) : (
          <div className="mt-4 overflow-x-auto">
            <table className="w-full text-left text-sm">
              <thead className="border-b text-muted-foreground">
                <tr>
                  <th className="pb-3">Order</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Status</th>
                </tr>
              </thead>
              <tbody>
                {metrics.recentOrders.map((o) => (
                  <tr key={o.id} className="border-b last:border-0">
                    <td className="py-3 font-medium">{o.number}</td>
                    <td>{o.user.name}</td>
                    <td>₹{Number(o.total).toLocaleString("en-IN")}</td>
                    <td>
                      <span
                        className={`rounded-full px-2 py-1 text-xs font-medium ${statusStyle[o.status] ?? "bg-muted text-muted-foreground"}`}
                      >
                        {o.status.charAt(0) + o.status.slice(1).toLowerCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>
    </>
  );
}
