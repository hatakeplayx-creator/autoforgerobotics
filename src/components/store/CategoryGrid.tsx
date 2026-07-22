import { ArrowRight } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCategories } from "@/hooks/useStoreData";
import { Skeleton } from "@/components/ui/skeleton";
import fallbackCategoryImage from "@/assets/cat-components.jpg";
import { mediaVariantUrl } from "@/lib/media";

export function CategoryGrid() {
  const { data: categoriesList, loading, error } = useCategories();

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 max-w-2xl space-y-3">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-10 w-96 max-w-full" />
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {Array.from({ length: 8 }).map((_, index) => (
            <Skeleton key={index} className="h-72 rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-8 text-center">
          <h2 className="text-lg font-bold text-foreground">Categories are temporarily unavailable</h2>
          <p className="mt-1 text-sm text-muted-foreground">Please refresh the page to try again.</p>
        </div>
      </section>
    );
  }

  if (!categoriesList?.length) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-8 text-center">
          <h2 className="text-lg font-bold text-foreground">Categories are being updated</h2>
          <p className="mt-1 text-sm text-muted-foreground">Browse the full catalog while new categories are added.</p>
          <Link to="/shop" className="mt-4 inline-flex rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground">
            Browse products
          </Link>
        </div>
      </section>
    );
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-14">
      <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.28em] text-accent">Featured categories</p>
          <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-foreground md:text-5xl">
            Systems for every robotics build.
          </h2>
        </div>
        <Link to="/shop" className="inline-flex w-fit items-center gap-2 rounded-full border border-border bg-card px-5 py-3 text-sm font-bold text-foreground transition-colors hover:border-accent hover:text-accent">
          View all <ArrowRight className="h-4 w-4" />
        </Link>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {categoriesList.slice(0, 8).map((cat, index) => {
          const image = mediaVariantUrl(typeof cat.image === "string" ? cat.image : cat.image?.url, "categoryCard") || fallbackCategoryImage;
          return (
            <Link
              key={cat.name}
              to="/shop"
              search={{ category: cat.name }}
              className={`group relative min-h-72 overflow-hidden rounded-2xl bg-primary text-primary-foreground shadow-[var(--shadow-soft)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[var(--shadow-raised)] ${
                index === 0 ? "lg:col-span-2" : ""
              }`}
            >
              <img
                src={image}
                alt={cat.name}
                width={900}
                height={700}
                loading="lazy"
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = fallbackCategoryImage;
                }}
                className="absolute inset-0 h-full w-full object-cover opacity-[0.72] transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-primary via-primary/40 to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-5">
                <span className="text-[10px] font-bold uppercase tracking-[0.24em] text-accent">System {String(index + 1).padStart(2, "0")}</span>
                <h3 className="mt-2 text-xl font-black leading-tight">{cat.name}</h3>
                <span className="mt-4 inline-flex items-center gap-2 text-sm font-bold text-primary-foreground/80">
                  Shop category <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
                </span>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
