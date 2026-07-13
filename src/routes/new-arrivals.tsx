import { createFileRoute } from "@tanstack/react-router";
import { StorePageShell } from "@/components/store/StorePageShell";
import { ProductCard } from "@/components/store/ProductCard";
import { useProducts } from "@/hooks/useStoreData";

export const Route = createFileRoute("/new-arrivals")({
  component: NewArrivalsPage,
});

function NewArrivalsPage() {
  const { data: products, loading } = useProducts();
  return (
    <StorePageShell>
      <div className="space-y-8">
        <div>
          <h1 className="text-3xl font-extrabold text-foreground">New Arrivals</h1>
          <p className="mt-2 text-muted-foreground">
            Check out our latest products!
          </p>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {loading ? <p className="text-sm text-muted-foreground">Loading products...</p> : products?.slice(0, 8).map((product) => (
            <ProductCard key={product.sku} product={product} />
          ))}
        </div>
      </div>
    </StorePageShell>
  );
}
