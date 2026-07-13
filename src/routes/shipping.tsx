import { createFileRoute } from "@tanstack/react-router";
import { StorePageShell } from "@/components/store/StorePageShell";

export const Route = createFileRoute("/shipping")({
  component: ShippingPage,
});

function ShippingPage() {
  return (
    <StorePageShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Shipping Policy</h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: July 2026
          </p>
        </div>
        <div className="prose max-w-none text-sm text-muted-foreground space-y-4">
          <section>
            <h2 className="text-xl font-bold text-foreground">1. Shipping Rates</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Free shipping on orders above ₹999</li>
              <li>Flat rate shipping of ₹99 for orders below ₹999</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground">2. Delivery Time</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Metro cities: 3-5 business days</li>
              <li>Other locations: 5-7 business days</li>
              <li>Remote areas may take longer</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground">3. Tracking</h2>
            <p>
              Once your order is shipped, you will receive a tracking number via email and SMS, which you can use to track your order.
            </p>
          </section>
        </div>
      </div>
    </StorePageShell>
  );
}
