import { useEffect, useState, type FormEvent } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { CheckCircle, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { StorePageShell } from "@/components/store/StorePageShell";
import { useAuth } from "@/hooks/useAuth";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/store-data";
import { apiFetch, authHeaders } from "@/services/api";
import { toast } from "sonner";

export const Route = createFileRoute("/checkout")({ component: CheckoutPage });

interface AddressInput {
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
}
interface Address extends AddressInput {
  id: string;
}
interface Order {
  id: string;
  number: string;
  total: number | string;
}
interface RazorpayOrder {
  orderId: string;
  amount: number;
  keyId: string;
}
interface RazorpaySuccess {
  razorpay_payment_id: string;
  razorpay_signature: string;
}
interface RazorpayInstance {
  open(): void;
  on(
    event: "payment.failed",
    callback: (response: { error: { description?: string } }) => void,
  ): void;
}
type RazorpayConstructor = new (
  options: Record<string, unknown>,
) => RazorpayInstance;

function loadRazorpay(): Promise<RazorpayConstructor> {
  const existing = (
    window as typeof window & { Razorpay?: RazorpayConstructor }
  ).Razorpay;
  if (existing) return Promise.resolve(existing);
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.async = true;
    script.onload = () => {
      const constructor = (
        window as typeof window & { Razorpay?: RazorpayConstructor }
      ).Razorpay;
      if (constructor) resolve(constructor);
      else reject(new Error("Payment checkout failed to load"));
    };
    script.onerror = () => reject(new Error("Payment checkout failed to load"));
    document.head.appendChild(script);
  });
}

function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const { user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState("");
  const [saving, setSaving] = useState(false);
  const [placedOrder, setPlacedOrder] = useState<string | null>(null);
  const [address, setAddress] = useState<AddressInput>({
    line1: "",
    line2: "",
    city: "",
    state: "",
    postalCode: "",
    country: "India",
  });

  useEffect(() => {
    if (!authLoading && !isAuthenticated) void navigate({ to: "/login" });
  }, [authLoading, isAuthenticated, navigate]);
  useEffect(() => {
    if (!isAuthenticated) return;
    apiFetch<Address[]>("/api/me/addresses", { headers: authHeaders() })
      .then((rows) => {
        setAddresses(rows);
        setSelectedAddress(rows[0]?.id ?? "");
      })
      .catch((error) =>
        toast.error(
          error instanceof Error ? error.message : "Unable to load addresses",
        ),
      );
  }, [isAuthenticated]);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.product.price * item.quantity,
    0,
  );
  const tax = cartItems.reduce((sum, item) => {
    const rate = item.product.gstPercentage || 18;
    return sum + (item.product.price * item.quantity * rate) / (100 + rate);
  }, 0);

  async function submit(event: FormEvent) {
    event.preventDefault();
    if (saving || !cartItems.length) return;
    setSaving(true);
    try {
      let addressId = selectedAddress;
      if (!addressId) {
        const created = await apiFetch<Address>("/api/me/addresses", {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify(address),
        });
        addressId = created.id;
      }
      const order = await apiFetch<Order>("/api/orders", {
        method: "POST",
        headers: authHeaders(),
        body: JSON.stringify({
          items: cartItems.map((item) => ({
            productId: item.product.id,
            quantity: item.quantity,
          })),
          shippingAddressId: addressId,
        }),
      });
      const payment = await apiFetch<RazorpayOrder>(
        "/api/payments/razorpay/create-order",
        {
          method: "POST",
          headers: authHeaders(),
          body: JSON.stringify({ orderId: order.id }),
        },
      );
      const Razorpay = await loadRazorpay();
      await new Promise<void>((resolve, reject) => {
        const checkout = new Razorpay({
          key: payment.keyId,
          amount: payment.amount,
          currency: "INR",
          name: "AutoForge Robotics",
          description: `Order ${order.number}`,
          order_id: payment.orderId,
          prefill: {
            name: user?.name,
            email: user?.email,
            contact: user?.phone,
          },
          theme: { color: "#123B5D" },
          handler: async (response: unknown) => {
            try {
              const result = response as RazorpaySuccess;
              await apiFetch("/api/payments/razorpay/verify", {
                method: "POST",
                headers: authHeaders(),
                body: JSON.stringify({
                  orderId: order.id,
                  paymentId: result.razorpay_payment_id,
                  signature: result.razorpay_signature,
                }),
              });
              resolve();
            } catch (error) {
              reject(error);
            }
          },
        });
        checkout.on("payment.failed", (response) =>
          reject(new Error(response.error.description || "Payment failed")),
        );
        checkout.open();
      });
      clearCart();
      setPlacedOrder(order.number);
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Checkout failed");
    } finally {
      setSaving(false);
    }
  }

  if (placedOrder)
    return (
      <StorePageShell>
        <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center">
          <CheckCircle className="h-16 w-16 text-success" />
          <h1 className="text-3xl font-bold">Payment confirmed</h1>
          <p className="text-muted-foreground">
            Order {placedOrder} is confirmed and available in your order
            history.
          </p>
          <Button onClick={() => navigate({ to: "/orders" })}>
            View orders
          </Button>
        </div>
      </StorePageShell>
    );
  if (authLoading)
    return (
      <StorePageShell>
        <div className="flex min-h-[50vh] items-center justify-center">
          <Loader2 className="h-7 w-7 animate-spin" />
        </div>
      </StorePageShell>
    );
  if (!cartItems.length)
    return (
      <StorePageShell>
        <div className="flex min-h-[55vh] flex-col items-center justify-center gap-4 text-center">
          <h1 className="text-3xl font-bold">Your cart is empty</h1>
          <Button onClick={() => navigate({ to: "/shop" })}>Go to shop</Button>
        </div>
      </StorePageShell>
    );

  return (
    <StorePageShell>
      <form
        onSubmit={submit}
        className="grid gap-8 py-8 lg:grid-cols-[1fr_360px]"
      >
        <div className="space-y-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.24em] text-accent">
              Secure checkout
            </p>
            <h1 className="mt-2 text-3xl font-black">Delivery and payment</h1>
          </div>
          <Card>
            <CardHeader>
              <CardTitle>Delivery address</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {addresses.length ? (
                <div className="grid gap-3">
                  {addresses.map((item) => (
                    <label
                      key={item.id}
                      className="flex cursor-pointer gap-3 rounded-xl border p-4"
                    >
                      <input
                        type="radio"
                        name="address"
                        checked={selectedAddress === item.id}
                        onChange={() => setSelectedAddress(item.id)}
                      />
                      <span className="text-sm">
                        <strong>{item.line1}</strong>
                        {item.line2 ? `, ${item.line2}` : ""}
                        <br />
                        {item.city}, {item.state} {item.postalCode},{" "}
                        {item.country}
                      </span>
                    </label>
                  ))}
                  <button
                    type="button"
                    className="w-fit text-sm font-semibold text-primary hover:underline"
                    onClick={() => setSelectedAddress("")}
                  >
                    Use a new address
                  </button>
                </div>
              ) : null}
              {!selectedAddress ? (
                <div className="grid gap-4 sm:grid-cols-2">
                  {(
                    [
                      "line1",
                      "line2",
                      "city",
                      "state",
                      "postalCode",
                      "country",
                    ] as const
                  ).map((key) => (
                    <label
                      key={key}
                      className={
                        key === "line1" || key === "line2"
                          ? "sm:col-span-2 text-sm font-semibold"
                          : "text-sm font-semibold"
                      }
                    >
                      {key === "line1"
                        ? "Address line 1"
                        : key === "line2"
                          ? "Address line 2 (optional)"
                          : key === "postalCode"
                            ? "Postal code"
                            : key[0].toUpperCase() + key.slice(1)}
                      <input
                        required={key !== "line2"}
                        value={address[key] ?? ""}
                        onChange={(event) =>
                          setAddress((current) => ({
                            ...current,
                            [key]: event.target.value,
                          }))
                        }
                        className="mt-1.5 w-full rounded-md border bg-background px-3 py-2 font-normal"
                      />
                    </label>
                  ))}
                </div>
              ) : null}
            </CardContent>
          </Card>
          <Card>
            <CardHeader>
              <CardTitle>Order items</CardTitle>
            </CardHeader>
            <CardContent>
              {cartItems.map((item) => (
                <div
                  key={item.product.sku}
                  className="flex justify-between border-b py-3 last:border-0"
                >
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">
                      Qty: {item.quantity}
                    </p>
                  </div>
                  <p className="font-medium">
                    {formatPrice(item.product.price * item.quantity)}
                  </p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>
        <Card className="h-fit lg:sticky lg:top-24">
          <CardHeader>
            <CardTitle>Order summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between">
              <span>Included GST</span>
              <span>{formatPrice(tax)}</span>
            </div>
            <div className="flex justify-between border-t pt-4 text-lg font-bold">
              <span>Total</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <Button disabled={saving} className="w-full" size="lg">
              {saving ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing
                </>
              ) : (
                "Pay securely"
              )}
            </Button>
            <p className="text-xs text-muted-foreground">
              Inventory and totals are revalidated by AutoForge before payment.
            </p>
          </CardContent>
        </Card>
      </form>
    </StorePageShell>
  );
}
