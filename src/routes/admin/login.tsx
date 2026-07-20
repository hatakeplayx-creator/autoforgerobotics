import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { LockKeyhole, ShieldCheck } from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/admin/login")({ component: AdminLogin });

function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (submitting) return;
    setSubmitting(true);
    try {
      const ok = await login(email, password);
      if (ok) navigate({ to: "/admin" });
    } finally {
      setSubmitting(false);
    }
  }

  return <main className="flex min-h-screen items-center justify-center bg-muted px-4">
    <form onSubmit={submit} className="w-full max-w-md rounded-xl border bg-card p-8 shadow-sm">
      <div className="mb-7 flex size-12 items-center justify-center rounded-lg bg-primary text-primary-foreground"><ShieldCheck /></div>
      <h1 className="text-2xl font-bold">Admin portal</h1>
      <p className="mt-2 text-sm text-muted-foreground">Sign in to manage AutoForge Robotics.</p>
      <label htmlFor="admin-email" className="mt-6 block text-sm font-medium">Email</label>
      <input id="admin-email" value={email} onChange={(e) => setEmail(e.target.value)} type="email" className="mt-1.5 w-full rounded-md border bg-background px-3 py-2" />
      <label htmlFor="admin-password" className="mt-4 block text-sm font-medium">Password</label>
      <input id="admin-password" value={password} onChange={(e) => setPassword(e.target.value)} type="password" className="mt-1.5 w-full rounded-md border bg-background px-3 py-2" />
      <button type="submit" disabled={submitting} className="mt-6 flex w-full items-center justify-center gap-2 rounded-md bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground disabled:opacity-50"><LockKeyhole className="size-4" /> {submitting ? "Signing in…" : "Sign in"}</button>
      <p className="mt-4 text-center text-xs text-muted-foreground">Use an administrator account created through the secure seed process.</p>
    </form>
  </main>;
}
