import { useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/useCart";
import { CheckCircle } from "lucide-react";

export const Route = createFileRoute("/checkout")({
  component: CheckoutPage,
});

function CheckoutPage() {
  const { cartItems, clearCart } = useCart();
  const navigate = useNavigate();
  const [placed, setPlaced] = useState(false);

  const safeCart = cartItems || [];
  const subtotal = safeCart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const tax = safeCart.reduce((sum, item) => sum + (item.product.price * item.quantity * (item.product.gstPercentage || 18)) / 100, 0);
  const total = subtotal + tax;

  if (placed) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <CheckCircle className="h-16 w-16 text-green-500" />
        <h1 className="text-3xl font-bold">Order Placed!</h1>
        <p className="text-muted-foreground">Thank you for your purchase. This is a demo checkout.</p>
        <Button onClick={() => navigate({ to: "/shop" })} className="mt-4">
          Continue Shopping
        </Button>
      </div>
    );
  }

  if (safeCart.length === 0) {
    return (
      <div className="container mx-auto flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
        <h1 className="text-3xl font-bold">Your cart is empty</h1>
        <Button onClick={() => navigate({ to: "/shop" })}>Go to Shop</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold mb-8">Checkout</h1>
      <div className="grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Order Items</CardTitle>
            </CardHeader>
            <CardContent>
              {safeCart.map((item) => (
                <div key={item.product.sku} className="flex justify-between py-2 border-b">
                  <div>
                    <p className="font-medium">{item.product.name}</p>
                    <p className="text-sm text-muted-foreground">Qty: {item.quantity}</p>
                  </div>
                  <p className="font-medium">₹{(item.product.price * item.quantity).toFixed(2)}</p>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle>Order Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex justify-between">
                <p>Subtotal</p>
                <p>₹{subtotal.toFixed(2)}</p>
              </div>
              <div className="flex justify-between">
                <p>Tax (GST)</p>
                <p>₹{tax.toFixed(2)}</p>
              </div>
              <div className="flex justify-between border-t pt-4 font-bold text-lg">
                <p>Total</p>
                <p>₹{total.toFixed(2)}</p>
              </div>
              <Button
                className="w-full"
                size="lg"
                onClick={() => { clearCart(); setPlaced(true); }}
              >
                Place Order (Demo)
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
