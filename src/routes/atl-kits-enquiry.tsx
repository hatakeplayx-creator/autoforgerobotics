import { createFileRoute } from "@tanstack/react-router";
import { StorePageShell } from "@/components/store/StorePageShell";

export const Route = createFileRoute("/atl-kits-enquiry")({
  component: ATLKitsEnquiryPage,
});

function ATLKitsEnquiryPage() {
  return (
    <StorePageShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">ATL Kits Enquiry</h1>
          <p className="mt-2 text-muted-foreground">
            Enquire about Atal Tinkering Lab kits and solutions!
          </p>
        </div>
        <div className="prose max-w-none text-sm text-muted-foreground space-y-4">
          <p>
            We provide complete ATL lab solutions including all necessary components and training materials.
          </p>
        </div>
      </div>
    </StorePageShell>
  );
}
