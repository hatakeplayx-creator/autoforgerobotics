import { createFileRoute } from "@tanstack/react-router";
import { StorePageShell } from "@/components/store/StorePageShell";

export const Route = createFileRoute("/terms")({
  component: TermsPage,
});

function TermsPage() {
  return (
    <StorePageShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Terms & Conditions</h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: July 2026
          </p>
        </div>
        <div className="prose max-w-none text-sm text-muted-foreground space-y-4">
          <section>
            <h2 className="text-xl font-bold text-foreground">1. Acceptance of Terms</h2>
            <p>
              By accessing and using this website, you accept and agree to be bound by these Terms and Conditions.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground">2. Products and Prices</h2>
            <p>
              All products listed on the website are subject to availability. We reserve the right to modify prices without prior notice.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground">3. Orders</h2>
            <p>
              When you place an order, you are offering to purchase a product. We reserve the right to accept or decline your order for any reason.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground">4. Shipping and Delivery</h2>
            <p>Please refer to our Shipping Policy for details on shipping and delivery.</p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground">5. Returns and Refunds</h2>
            <p>Please refer to our Returns Policy for details on returns and refunds.</p>
          </section>
        </div>
      </div>
    </StorePageShell>
  );
}
