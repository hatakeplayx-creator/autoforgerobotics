import { useProducts } from "@/hooks/useStoreData";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { Link } from "@tanstack/react-router";

export function FeaturedProducts() {
  const { data: products, loading } = useProducts();

  if (loading || !products) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-4">
            <Skeleton className="h-8 w-52" />
            <Skeleton className="h-px flex-1" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>

        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="border border-border rounded-lg p-3 space-y-3">
              <Skeleton className="h-3 w-12" />
              <Skeleton className="aspect-square w-full rounded" />
              <Skeleton className="h-4 w-3/4" />
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-7 w-full" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  // Slice first 6 products for the homepage
  const displayProducts = products.slice(0, 6);

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Featured Products</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <Link
          to="/shop"
          className="rounded-lg border border-primary px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6">
        {displayProducts.map((product) => (
          <ProductCard key={product.sku} product={product} />
        ))}
      </div>
    </section>
  );
}
