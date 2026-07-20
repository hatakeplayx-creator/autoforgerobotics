import { createFileRoute } from "@tanstack/react-router";
import { StorePageShell } from "@/components/store/StorePageShell";

export const Route = createFileRoute("/blogs")({
  component: BlogsPage,
});

function BlogsPage() {
  return (
    <StorePageShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">Blogs</h1>
          <p className="mt-2 text-muted-foreground">Engineering notes and product guides from AutoForge.</p>
        </div>
        <div className="rounded-xl border border-dashed border-border bg-card p-8 text-center">
          <h2 className="font-semibold text-foreground">No published articles</h2>
          <p className="mt-2 text-sm text-muted-foreground">Published engineering resources will appear here.</p>
        </div>
      </div>
    </StorePageShell>
  );
}
