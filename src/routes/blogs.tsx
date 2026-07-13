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
          <p className="mt-2 text-muted-foreground">
            Read our latest articles and tutorials!
          </p>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="border border-border rounded-lg p-4">
              <h3 className="font-semibold text-foreground">Blog Post {i}</h3>
              <p className="text-sm text-muted-foreground">
                This is a sample blog post for demonstration purposes.
              </p>
            </div>
          ))}
        </div>
      </div>
    </StorePageShell>
  );
}
