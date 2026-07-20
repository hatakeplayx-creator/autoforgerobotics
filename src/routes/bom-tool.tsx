import { createFileRoute, Link } from "@tanstack/react-router";
import { StorePageShell } from "@/components/store/StorePageShell";

export const Route = createFileRoute("/bom-tool")({
  component: BOMToolPage,
});

function BOMToolPage() {
  return (
    <StorePageShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">BOM Tool</h1>
          <p className="mt-2 text-muted-foreground">Send your component list to the AutoForge sourcing team for availability and volume pricing.</p>
        </div>
        <Link to="/bulk-enquiry" className="inline-flex rounded-md bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground">Submit a bulk enquiry</Link>
      </div>
    </StorePageShell>
  );
}
