import { createFileRoute } from "@tanstack/react-router";
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
          <p className="mt-2 text-muted-foreground">
            Bill of Materials tool coming soon!
          </p>
        </div>
      </div>
    </StorePageShell>
  );
}
