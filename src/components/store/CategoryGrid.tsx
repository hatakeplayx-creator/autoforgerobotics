import { useCategories } from "@/hooks/useStoreData";
import { Skeleton } from "@/components/ui/skeleton";
import fallbackCategoryImage from "@/assets/cat-components.jpg";

export function CategoryGrid() {
  const { data: categoriesList, loading, error } = useCategories();

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-8">
        <div className="mb-6 flex items-center justify-between gap-4">
          <div className="flex flex-1 items-center gap-4">
            <Skeleton className="h-8 w-44" />
            <Skeleton className="h-px flex-1" />
          </div>
          <Skeleton className="h-9 w-24" />
        </div>

        <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="space-y-3">
              <Skeleton className="aspect-square w-full rounded-lg" />
              <Skeleton className="h-4 w-3/4" />
            </div>
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return <section className="mx-auto max-w-7xl px-4 py-8"><div className="rounded-lg border border-dashed border-border bg-card px-5 py-8 text-center"><h2 className="text-lg font-bold text-foreground">Categories are temporarily unavailable</h2><p className="mt-1 text-sm text-muted-foreground">Please refresh the page to try again.</p></div></section>;
  }

  if (!categoriesList?.length) {
    return <section className="mx-auto max-w-7xl px-4 py-8"><div className="rounded-lg border border-dashed border-border bg-card px-5 py-8 text-center"><h2 className="text-lg font-bold text-foreground">Categories are being updated</h2><p className="mt-1 text-sm text-muted-foreground">Browse the full catalog while new categories are added.</p><Link to="/shop" className="mt-4 inline-flex rounded-lg border border-primary px-4 py-2 text-sm font-semibold text-primary hover:bg-primary hover:text-primary-foreground">Browse products</Link></div></section>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-8">
      <div className="mb-6 flex items-center justify-between gap-4">
        <div className="flex flex-1 items-center gap-4">
          <h2 className="text-2xl font-bold text-foreground md:text-3xl">Categories</h2>
          <div className="h-px flex-1 bg-border" />
        </div>
        <Link
          to="/shop"
          className="rounded-lg border border-primary px-5 py-2 text-sm font-semibold text-primary transition-colors hover:bg-primary hover:text-primary-foreground"
        >
          View All
        </Link>
      </div>

      <div className="grid grid-cols-2 gap-x-5 gap-y-8 sm:grid-cols-3 lg:grid-cols-6">
        {categoriesList.map((cat) => (
          <Link key={cat.name} to="/shop" search={{ category: cat.name }} className="group">
            <div className="overflow-hidden rounded-lg">
              <img
                src={(typeof cat.image === "string" ? cat.image : cat.image?.url) || fallbackCategoryImage}
                alt={cat.name}
                width={640}
                height={640}
                loading="lazy"
                onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = fallbackCategoryImage; }}
                className="aspect-square w-full object-cover transition-transform duration-300 group-hover:scale-105"
              />
            </div>
            <h3 className="mt-3 text-sm font-semibold leading-snug text-foreground group-hover:text-primary">
              {cat.name}
            </h3>
          </Link>
        ))}
      </div>
    </section>
  );
}
// Import Link from router for type-safety
import { Link } from "@tanstack/react-router";
