import { createFileRoute } from "@tanstack/react-router";
import { StorePageShell } from "@/components/store/StorePageShell";

export const Route = createFileRoute("/careers")({
  component: CareersPage,
});

function CareersPage() {
  return (
    <StorePageShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Careers</h1>
          <p className="mt-2 text-muted-foreground">Build the next generation of robotics commerce with AutoForge.</p>
        </div>
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <h2 className="font-semibold text-foreground">No open positions</h2>
          <p className="mt-2 text-sm text-muted-foreground">Current openings will be listed here when available.</p>
        </div>
      </div>
    </StorePageShell>
  );
}
