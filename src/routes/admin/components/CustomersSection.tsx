import { useEffect, useState } from "react";
import { fetchCustomers, type AdminCustomer } from "@/services/adminApi";
import { toast } from "sonner";
import { Toaster } from "@/components/ui/sonner";
import { Search } from "lucide-react";

export default function CustomersSection({ token }: { token?: string }) {
  const [customers, setCustomers] = useState<AdminCustomer[]>([]);
  const [loading, setLoading] = useState(true);
  const [query, setQuery] = useState("");

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    fetchCustomers(token)
      .then((res) => { if (!cancelled) setCustomers(res.value); })
      .catch(() => { if (!cancelled) toast.error("Failed to load customers"); })
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [token]);

  const filtered = customers.filter((c) => {
    const q = query.toLowerCase();
    return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
  });

  return (
    <section className="rounded-lg border bg-card">
      <Toaster />
      <div className="flex flex-wrap items-center justify-between gap-3 border-b p-5">
        <div>
          <h2 className="font-semibold">Customers</h2>
          <p className="text-sm text-muted-foreground">Manage your customer directory.</p>
        </div>
        <button className="rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90">
          Export customers
        </button>
      </div>
      <div className="p-5">
        <div className="relative mb-4 max-w-md">
          <Search className="absolute left-3 top-2.5 size-4 text-muted-foreground" />
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search customers"
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
          <p className="text-sm text-muted-foreground">No customers found.</p>
        ) : (
          <div className="space-y-2">
            {filtered.map((c) => {
              const orderCount = c.orders?.length ?? 0;
              const totalSpend = c.orders?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;
              return (
                <div key={c.id} className="flex flex-wrap items-center justify-between gap-3 rounded-md border p-4">
                  <div>
                    <p className="font-medium">{c.name}</p>
                    <p className="mt-1 text-xs text-muted-foreground">
                      {c.email} · {orderCount} order{orderCount !== 1 ? "s" : ""} · ₹{totalSpend.toLocaleString("en-IN")}
                    </p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </section>
  );
}
