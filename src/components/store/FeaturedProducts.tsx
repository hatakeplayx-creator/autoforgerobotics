import { ArrowRight, Layers3, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { ProductCard } from "./ProductCard";
import { Skeleton } from "@/components/ui/skeleton";
import { useProducts } from "@/hooks/useStoreData";

const collections = [
  ["Autonomous Mobility", "Motors, batteries, controllers, and sensors for moving machines.", "Drone Parts"],
  ["Developer Benches", "Boards, displays, wireless modules, and debug-friendly components.", "Development Boards"],
  ["Fabrication Lab", "3D printing, laser cutting, PCB services, and maker-ready parts.", "3D Printers and Parts"],
] satisfies [string, string, string][];

const testimonials = [
  ["IIT Robotics Lab", "AutoForge helped us source dependable components quickly during competition season."],
  ["ForgeStack Systems", "The catalog feels selected by engineers, not just uploaded by sellers."],
  ["Mechatronics Student Team", "Fast dispatch and clean product specs saved us several prototype cycles."],
] satisfies [string, string][];

export function FeaturedProducts() {
  const { data: products, loading, error } = useProducts();

  if (loading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex items-end justify-between gap-4">
          <div className="space-y-3">
            <Skeleton className="h-4 w-36" />
            <Skeleton className="h-10 w-80 max-w-full" />
          </div>
          <Skeleton className="h-11 w-28 rounded-full" />
        </div>
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, index) => (
            <Skeleton key={index} className="h-96 min-w-[18rem] rounded-2xl" />
          ))}
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="rounded-2xl border border-dashed border-border bg-card px-5 py-8 text-center">
          <h2 className="text-lg font-bold text-foreground">Featured products are temporarily unavailable</h2>
          <p className="mt-1 text-sm text-muted-foreground">Please refresh the page to try again.</p>
        </div>
      </section>
    );
  }

  const displayProducts = (products ?? []).filter((product) => product.featured).slice(0, 8);
  const bestSellers = (products ?? []).slice(0, 4);

  if (!displayProducts.length && !bestSellers.length) return null;

  return (
    <>
      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="mb-8 flex flex-col justify-between gap-4 md:flex-row md:items-end">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-accent">Popular products</p>
            <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight text-foreground md:text-5xl">
              Premium parts for active builds.
            </h2>
          </div>
          <Link to="/shop" className="inline-flex w-fit items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground transition-transform hover:-translate-y-0.5">
            Browse catalog <ArrowRight className="h-4 w-4" />
          </Link>
        </div>

        <div className="scrollbar-hidden -mx-4 flex snap-x gap-4 overflow-x-auto px-4 pb-3">
          {(displayProducts.length ? displayProducts : bestSellers).map((product) => (
            <div key={product.sku} className="min-w-[17rem] snap-start sm:min-w-[19rem] lg:min-w-[20rem]">
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="grid gap-4 lg:grid-cols-3">
          {collections.map(([title, description, category]) => (
            <Link key={title} to="/shop" search={{ category }} className="group rounded-2xl border border-border bg-card p-6 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-accent/35 hover:shadow-[var(--shadow-raised)]">
              <Layers3 className="h-6 w-6 text-accent" />
              <h3 className="mt-8 text-2xl font-black tracking-tight text-foreground">{title}</h3>
              <p className="mt-3 text-sm leading-6 text-muted-foreground">{description}</p>
              <span className="mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary">
                View collection <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-1" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="rounded-[2rem] bg-primary p-6 text-primary-foreground md:p-10">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-accent">Trusted by builders</p>
              <h2 className="mt-3 max-w-2xl text-3xl font-black tracking-tight md:text-5xl">
                Universities, students, engineers, startups, and industries.
              </h2>
            </div>
            <Sparkles className="hidden h-10 w-10 text-accent md:block" />
          </div>
          <div className="mt-8 grid gap-3 md:grid-cols-3">
            {testimonials.map(([author, quote]) => (
              <figure key={author} className="rounded-2xl border border-primary-foreground/12 bg-primary-foreground/8 p-5">
                <blockquote className="text-sm leading-6 text-primary-foreground/78">"{quote}"</blockquote>
                <figcaption className="mt-5 text-sm font-black text-primary-foreground">{author}</figcaption>
              </figure>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-16">
        <div className="grid gap-6 rounded-[2rem] border border-border bg-card p-6 shadow-[var(--shadow-soft)] md:grid-cols-[1fr_auto] md:items-center md:p-10">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.28em] text-accent">AutoForge signal</p>
            <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground md:text-4xl">Get build notes, launch drops, and engineering offers.</h2>
          </div>
          <form
            onSubmit={(event) => event.preventDefault()}
            className="flex w-full flex-col gap-3 sm:w-[26rem] sm:flex-row"
          >
            <input
              type="email"
              required
              placeholder="engineer@lab.com"
              className="h-12 flex-1 rounded-full border border-border bg-secondary/50 px-4 text-sm outline-none focus:border-accent"
            />
            <button type="submit" className="h-12 rounded-full bg-accent px-6 text-sm font-black text-accent-foreground">
              Subscribe
            </button>
          </form>
        </div>
      </section>
    </>
  );
}
