import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { StorePageShell } from "@/components/store/StorePageShell";
import { useAuth } from "@/hooks/useAuth";
import { formatPrice } from "@/lib/store-data";
import { apiFetch } from "@/services/api";
import type { Order } from "@/types/store";

export const Route = createFileRoute("/orders")({
  component: OrdersPage,
});

function OrdersPage() {
  const navigate = useNavigate();
  const { isAuthenticated, loading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, loading, navigate]);
  useEffect(() => {
    const token = localStorage.getItem("autoforge_access_token");
    if (!token || !isAuthenticated) return;
    apiFetch<Order[]>("/api/me/orders", { headers: { Authorization: `Bearer ${token}` } })
      .then(setOrders)
      .catch(() => setOrders([]));
  }, [isAuthenticated]);

  if (loading) {
    return <StorePageShell><div className="py-20 text-center text-sm text-muted-foreground">Loading orders...</div></StorePageShell>;
  }

  return (
    <StorePageShell>
      <section className="mx-auto w-full max-w-4xl rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Orders</h1>
            <p className="mt-1 text-sm text-muted-foreground">Track your previous and active purchases.</p>
          </div>
          <Link to="/profile" className="rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold hover:bg-accent">
            Back to Profile
          </Link>
        </div>

        {orders.length === 0 ? (
          <div className="rounded-lg border border-dashed border-border p-10 text-center">
            <p className="text-sm font-semibold text-foreground">No orders yet.</p>
            <Link to="/shop" className="mt-3 inline-block text-xs font-semibold text-primary hover:underline">
              Start shopping
            </Link>
          </div>
        ) : (
          <div className="space-y-4">
            {orders.map((order) => (
              <article key={order.id} className="rounded-lg border border-border p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <p className="text-sm font-bold text-foreground">{order.number}</p>
                  <span className="rounded-full border border-border bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground">
                    {order.status}
                  </span>
                </div>
                <p className="mt-1 text-xs text-muted-foreground">Placed: {new Date(order.createdAt).toLocaleString()}</p>
                <div className="mt-3 space-y-1.5">
                  {order.items.map((item) => (
                    <p key={`${order.id}-${item.sku}`} className="text-xs text-muted-foreground">
                      {item.quantity}x {item.productName} ({item.sku})
                    </p>
                  ))}
                </div>
                <p className="mt-3 text-sm font-bold text-foreground">Total: {formatPrice(order.total)}</p>
              </article>
            ))}
          </div>
        )}
      </section>
    </StorePageShell>
  );
}
