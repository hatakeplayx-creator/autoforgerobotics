import { createFileRoute } from "@tanstack/react-router";
import { StorePageShell } from "@/components/store/StorePageShell";

export const Route = createFileRoute("/bulk-enquiry")({
  component: BulkEnquiryPage,
});

function BulkEnquiryPage() {
  return (
    <StorePageShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Bulk Enquiry</h1>
          <p className="mt-2 text-muted-foreground">
            Get in touch for bulk orders and custom quotes!
          </p>
        </div>
        <div className="prose max-w-none text-sm text-muted-foreground space-y-4">
          <p>
            For bulk orders or custom requirements, please contact our sales team.
          </p>
          <ul className="list-disc list-inside space-y-2">
            <li>Minimum order quantity may apply</li>
            <li>Customization options available</li>
            <li>Volume discounts</li>
          </ul>
        </div>
      </div>
    </StorePageShell>
  );
}
