import { useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { StorePageShell } from "@/components/store/StorePageShell";
import { useAuth } from "@/hooks/useAuth";

export const Route = createFileRoute("/forgot-password")({
  component: ForgotPasswordPage,
});

function ForgotPasswordPage() {
  const { requestPasswordReset } = useAuth();
  const [email, setEmail] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    const ok = await requestPasswordReset(email);
    if (ok) setEmail("");
  };

  return (
    <StorePageShell>
      <section className="mx-auto w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-foreground">Forgot Password</h1>
        <p className="mt-1 text-sm text-muted-foreground">Enter your account email to receive password-reset instructions.</p>

        <form onSubmit={handleSubmit} className="mt-6 space-y-4">
          <div>
            <label className="mb-1 block text-xs font-semibold text-muted-foreground">Email</label>
            <input
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
            />
          </div>
          <Button type="submit" className="w-full">
            Send Reset Link
          </Button>
        </form>

        <div className="mt-4 text-center text-xs">
          <Link to="/login" className="font-semibold text-primary hover:underline">
            Back to Login
          </Link>
        </div>
      </section>
    </StorePageShell>
  );
}
