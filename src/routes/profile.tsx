import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { StorePageShell } from "@/components/store/StorePageShell";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/profile")({
  component: ProfilePage,
});

function ProfilePage() {
  const navigate = useNavigate();
  const { user, isAuthenticated, loading, updateProfile, logout } = useAuth();
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      navigate({ to: "/login" });
    }
  }, [isAuthenticated, loading, navigate]);

  useEffect(() => {
    setName(user?.name || "");
    setPhone(user?.phone || "");
  }, [user]);

  if (loading || !user) {
    return <StorePageShell><div className="py-20 text-center text-sm text-muted-foreground">Loading profile...</div></StorePageShell>;
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    void updateProfile({ name });
  };

  return (
    <StorePageShell>
      <section className="mx-auto w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm">
        <div className="mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4">
          <div>
            <h1 className="text-2xl font-extrabold text-foreground">Profile</h1>
            <p className="mt-1 text-sm text-muted-foreground">Manage your account details.</p>
          </div>
          <div className="flex gap-2">
            <Link to="/orders" className="rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold hover:bg-accent">
              View Orders
            </Link>
            <Button variant="secondary" size="sm" onClick={() => { logout(); navigate({ to: "/login" }); }}>
              Logout
            </Button>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Name</label>
            <input
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Email</label>
            <input
              type="email"
              value={user.email}
              disabled
              className="h-10 w-full rounded-md border border-border bg-secondary px-3 text-sm text-muted-foreground"
            />
          </div>
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Phone</label>
            <input
              type="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <Button type="submit">Save Profile</Button>
        </form>
      </section>
    </StorePageShell>
  );
}
