import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Trash, ShoppingBag, Plus, Minus, ArrowRight, ShieldCheck } from "lucide-react";
import { AnnouncementBar, TopBar } from "@/components/store/TopBar";
import { StoreHeader } from "@/components/store/StoreHeader";
import { NavBar } from "@/components/store/NavBar";
import { StoreFooter } from "@/components/store/StoreFooter";
import { useCart } from "@/hooks/useCart";
import { formatPrice } from "@/lib/store-data";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export const Route = createFileRoute("/cart")({
  component: CartPage,
});

function CartPage() {
  const {
    cartItems,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shipping,
    tax,
    total,
  } = useCart();
  const navigate = useNavigate();

  const handleCheckout = () => {
    void navigate({ to: "/checkout" });
  };

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <TopBar />
      <StoreHeader />
      <NavBar />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Shopping Cart</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl mb-6">
          Shopping Cart
        </h1>

        {cartItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center text-center p-12 bg-card rounded-xl border border-dashed border-border min-h-[350px]">
            <ShoppingBag className="h-14 w-14 text-muted-foreground/60 stroke-1 mb-4 animate-bounce" />
            <h2 className="text-lg font-bold text-foreground">Your Cart is Empty</h2>
            <p className="mt-1 text-xs text-muted-foreground max-w-xs">
              Looks like you haven't added any robotics or maker components to your cart yet.
            </p>
            <Link
              to="/shop"
              className="mt-6 rounded-lg bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer"
            >
              Start Shopping
            </Link>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_360px]">
            {/* Left Items Column */}
            <div className="space-y-6">
              {/* Items List Card */}
              <div className="bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm space-y-4">
                <div className="flex items-center justify-between border-b border-border pb-3">
                  <h2 className="text-base font-bold text-foreground">Items in Cart ({cartItems.length})</h2>
                  <button
                    onClick={clearCart}
                    className="text-xs font-semibold text-destructive hover:underline cursor-pointer"
                  >
                    Clear All
                  </button>
                </div>

                <div className="divide-y divide-border">
                  {cartItems.map((item) => (
                    <div key={item.product.sku} className="py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center">
                      {/* Image */}
                      <Link to="/shop/$sku" params={{ sku: item.product.sku }} className="shrink-0 block">
                        <img
                          src={item.product.image}
                          alt={item.product.name}
                          className="h-16 w-16 rounded object-cover border border-border bg-secondary"
                        />
                      </Link>

                      {/* Info */}
                      <div className="flex-1 min-w-0">
                        <Link
                          to="/shop/$sku"
                          params={{ sku: item.product.sku }}
                          className="block text-sm font-bold text-foreground hover:text-primary truncate"
                        >
                          {item.product.name}
                        </Link>
                        <p className="text-xs text-muted-foreground mt-0.5">SKU: {item.product.sku}</p>
                        <p className="text-xs font-bold text-foreground mt-1 sm:hidden">
                          {formatPrice(item.product.price)}
                        </p>
                      </div>

                      {/* Quantity Controller */}
                      <div className="flex items-center gap-3">
                        <div className="flex items-center rounded-lg border border-border bg-secondary/30 h-8 overflow-hidden">
                          <button
                            type="button"
                            aria-label={`Decrease quantity of ${item.product.name}`}
                            onClick={() => updateQuantity(item.product.sku, item.quantity - 1)}
                            className="p-2 h-full flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          >
                            <Minus className="h-3 w-3" />
                          </button>
                          <span className="px-3 text-xs font-bold min-w-6 text-center select-none">{item.quantity}</span>
                          <button
                            type="button"
                            aria-label={`Increase quantity of ${item.product.name}`}
                            onClick={() => updateQuantity(item.product.sku, item.quantity + 1)}
                            className="p-2 h-full flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors"
                          >
                            <Plus className="h-3 w-3" />
                          </button>
                        </div>

                        <button
                          onClick={() => removeFromCart(item.product.sku)}
                          className="text-muted-foreground hover:text-destructive p-2 rounded hover:bg-secondary cursor-pointer"
                          aria-label="Remove item"
                        >
                          <Trash className="h-4 w-4" />
                        </button>
                      </div>

                      {/* Subtotal Desktop */}
                      <div className="hidden sm:block text-right min-w-[100px]">
                        <p className="text-sm font-extrabold text-foreground">
                          {formatPrice(item.product.price * item.quantity)}
                        </p>
                        <p className="text-[10px] text-muted-foreground">({formatPrice(item.product.price)} each)</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

            </div>

            {/* Right Summary Column */}
            <div className="space-y-4">
              <div className="bg-card border border-border rounded-xl p-6 shadow-sm space-y-5 sticky top-20">
                <h3 className="text-base font-bold text-foreground border-b border-border pb-3">Order Summary</h3>
                
                <div className="space-y-3 text-xs">
                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Subtotal</span>
                    <span className="font-semibold text-foreground">{formatPrice(subtotal)}</span>
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Shipping Charges</span>
                    <span className="font-semibold text-foreground">
                      {shipping === 0 ? (
                        <span className="text-emerald-600">FREE</span>
                      ) : (
                        formatPrice(shipping)
                      )}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-muted-foreground">
                    <span>Estimated Taxes (18% GST Incl.)</span>
                    <span className="font-semibold text-foreground">{formatPrice(tax)}</span>
                  </div>
                </div>

                <hr className="border-border" />

                <div className="flex items-center justify-between text-base font-black text-foreground">
                  <span>Grand Total</span>
                  <span>{formatPrice(total)}</span>
                </div>

                <button
                  onClick={handleCheckout}
                  className="w-full flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg cursor-pointer transition-colors shadow-md text-sm"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="h-4 w-4" />
                </button>

                <div className="mt-4 flex gap-2.5 text-[10px] text-muted-foreground items-start">
                  <ShieldCheck className="h-4 w-4 shrink-0 text-emerald-600" />
                  <span>
                    AutoForge Secure Checkout. All packages are insured and packed strictly under sanitised workbench criteria.
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>

      <StoreFooter />
    </div>
  );
}
