import { createFileRoute } from "@tanstack/react-router";
import { StorePageShell } from "@/components/store/StorePageShell";

export const Route = createFileRoute("/returns")({
  component: ReturnsPage,
});

function ReturnsPage() {
  return (
    <StorePageShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Returns Policy</h1>
          <p className="mt-2 text-muted-foreground">
            Last updated: July 2026
          </p>
        </div>
        <div className="prose max-w-none text-sm text-muted-foreground space-y-4">
          <section>
            <h2 className="text-xl font-bold text-foreground">1. Eligibility for Returns</h2>
            <ul className="list-disc list-inside space-y-2">
              <li>Returns accepted within 7 days of delivery</li>
              <li>Product must be unused and in original packaging</li>
              <li>All tags and labels must be intact</li>
            </ul>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground">2. How to Initiate a Return</h2>
            <p>
              To initiate a return, please contact our customer support team with your order number and reason for return.
            </p>
          </section>
          <section>
            <h2 className="text-xl font-bold text-foreground">3. Refunds</h2>
            <p>
              Once we receive and inspect the returned item, we will process your refund within 5-7 business days.
            </p>
          </section>
        </div>
      </div>
    </StorePageShell>
  );
}
