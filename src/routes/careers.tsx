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
          <p className="mt-2 text-muted-foreground">
            Join our team!
          </p>
        </div>
        <div className="space-y-4">
          {["Frontend Developer", "Backend Developer", "Sales Manager"].map((role, i) => (
            <div key={i} className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground">{role}</h3>
              <p className="text-sm text-muted-foreground">
                This is a sample job listing for demonstration purposes.
              </p>
            </div>
          ))}
        </div>
      </div>
    </StorePageShell>
  );
}
