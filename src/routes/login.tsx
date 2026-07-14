import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Button } from "@/components/ui/button";
import { StorePageShell } from "@/components/store/StorePageShell";
import { useAuth } from "@/hooks/useAuth";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

export const Route = createFileRoute("/login")({
  component: LoginPage,
});

function LoginPage() {
  const navigate = useNavigate();
  const { login, isAuthenticated, sendOtp, verifyOtp } = useAuth();
  const [email, setEmail] = useState("admin@autoforge.com");
  const [password, setPassword] = useState("admin123");
  const [phone, setPhone] = useState("");
  const [name, setName] = useState("");
  const [otp, setOtp] = useState("");
  const [otpSent, setOtpSent] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      navigate({ to: "/profile" });
    }
  }, [isAuthenticated, navigate]);

  const handleEmailLoginSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim() || !password.trim()) return;
    const ok = await login(email, password);
    if (ok) navigate({ to: "/profile" });
  };

  const handleSendOtp = async () => {
    if (!phone.trim()) return;
    const ok = await sendOtp(phone);
    if (ok) setOtpSent(true);
  };

  const handleVerifyOtp = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!phone.trim() || !otp.trim()) return;
    const ok = await verifyOtp(phone, otp, name);
    if (ok) navigate({ to: "/profile" });
  };

  return (
    <StorePageShell>
      <section className="mx-auto w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm">
        <h1 className="text-2xl font-extrabold text-foreground">Login</h1>
        <p className="mt-1 text-sm text-muted-foreground">Use your account to continue shopping and track orders.</p>

        <Tabs defaultValue="otp" className="mt-6">
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="otp">OTP Login</TabsTrigger>
            <TabsTrigger value="email">Email/Password</TabsTrigger>
          </TabsList>

          <TabsContent value="otp" className="space-y-4 mt-4">
            <form onSubmit={handleVerifyOtp}>
              <div className="space-y-4">
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Phone Number</label>
                  <input
                    type="tel"
                    required
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                    placeholder="Enter your phone number"
                  />
                </div>
                {!otpSent ? (
                  <Button type="button" onClick={handleSendOtp} className="w-full">
                    Send OTP
                  </Button>
                ) : (
                  <>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">Name (for new users)</label>
                      <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                        placeholder="Your name"
                      />
                    </div>
                    <div>
                      <label className="mb-1 block text-xs font-semibold text-muted-foreground">OTP</label>
                      <input
                        type="text"
                        required
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}
                        className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                        placeholder="Enter OTP"
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button type="button" variant="secondary" onClick={() => setOtpSent(false)} className="flex-1">
                        Change Phone
                      </Button>
                      <Button type="submit" className="flex-1">
                        Verify OTP
                      </Button>
                    </div>
                  </>
                )}
              </div>
            </form>
          </TabsContent>

          <TabsContent value="email" className="space-y-4 mt-4">
            <form onSubmit={handleEmailLoginSubmit}>
              <div className="space-y-4">
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
                <div>
                  <label className="mb-1 block text-xs font-semibold text-muted-foreground">Password</label>
                  <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
                  />
                </div>
                <Button type="submit" className="w-full">
                  Login
                </Button>
              </div>
            </form>
          </TabsContent>
        </Tabs>

        <div className="mt-4 flex items-center justify-between text-xs">
          <Link to="/forgot-password" className="font-semibold text-primary hover:underline">
            Forgot password?
          </Link>
          <Link to="/register" className="font-semibold text-primary hover:underline">
            Create account
          </Link>
        </div>
      </section>
    </StorePageShell>
  );
}
