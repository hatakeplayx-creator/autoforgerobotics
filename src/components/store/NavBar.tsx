import { ChevronRight, Cpu, Grid3X3, Menu, Sparkles } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useCategories, useStoreMetadata } from "@/hooks/useStoreData";
import { Skeleton } from "@/components/ui/skeleton";
import { clsx } from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const navLinkToRoute: Record<string, string> = {
  Home: "/",
  Shop: "/shop",
  Forum: "/forum",
  "Bulk Enquiry": "/bulk-enquiry",
  "New Arrivals": "/new-arrivals",
  "ATL Kits Enquiry": "/atl-kits-enquiry",
  Blogs: "/blogs",
  "BOM Tool": "/bom-tool",
  Careers: "/careers",
};

export function NavBar() {
  const { data, loading: metadataLoading } = useStoreMetadata();
  const { data: categories, loading: categoriesLoading } = useCategories();

  if (metadataLoading || !data) {
    return (
      <nav className="border-b border-border/70 bg-background/90 backdrop-blur-xl">
        <div className="mx-auto flex h-14 max-w-7xl items-center gap-4 overflow-hidden px-4">
          <Skeleton className="h-9 w-36 shrink-0 rounded-full" />
          {Array.from({ length: 5 }).map((_, index) => (
            <Skeleton key={index} className="h-4 w-20 shrink-0" />
          ))}
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-border/70 bg-background/92 backdrop-blur-xl">
      <div className="scrollbar-hidden mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="my-2 flex shrink-0 items-center gap-2 rounded-full border border-border bg-card px-4 py-2.5 text-sm font-bold text-foreground shadow-sm transition-all hover:border-accent/40 hover:text-accent">
              <Menu className="h-4 w-4" />
              Systems
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="start" className="w-[min(38rem,calc(100vw-2rem))] rounded-2xl p-2 shadow-[var(--shadow-glass)]">
            <div className="grid gap-2 p-2 sm:grid-cols-[0.85fr_1.15fr]">
              <div className="rounded-xl bg-primary p-4 text-primary-foreground">
                <Cpu className="h-6 w-6 text-accent" />
                <p className="mt-6 text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/60">AutoForge catalog</p>
                <h3 className="mt-2 text-xl font-black leading-tight">Robotics hardware for prototypes and production labs.</h3>
                <Link to="/shop" className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-accent">
                  View all products <ChevronRight className="h-4 w-4" />
                </Link>
              </div>
              <div className="grid max-h-[23rem] gap-1 overflow-y-auto pr-1">
                {categoriesLoading ? (
                  Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-10 w-full rounded-xl" />)
                ) : (
                  categories?.map((category) => (
                    <DropdownMenuItem asChild key={category.name}>
                      <Link to="/shop" search={{ category: category.name }} className="group flex w-full cursor-pointer items-center justify-between rounded-xl px-3 py-2.5 text-sm font-semibold">
                        <span>{category.name}</span>
                        <ChevronRight className="h-4 w-4 text-muted-foreground transition-transform group-hover:translate-x-0.5 group-hover:text-accent" />
                      </Link>
                    </DropdownMenuItem>
                  ))
                )}
              </div>
            </div>
          </DropdownMenuContent>
        </DropdownMenu>

        <div className="flex items-center gap-1">
          {data.navLinks.map((link) => {
            const to = navLinkToRoute[link];
            const visible = ["Home", "Shop", "New Arrivals", "Bulk Enquiry"].includes(link);

            if (!visible) return null;

            if (!to) return null;

            return (
              <Link
                key={link}
                to={to}
                className={clsx(
                  "whitespace-nowrap rounded-full px-3 py-2.5 text-sm font-semibold transition-colors",
                  link === "Home" ? "text-primary" : "text-muted-foreground hover:text-primary"
                )}
              >
                {link}
              </Link>
            );
          })}
        </div>

        <Link
          to="/sell-on-autoforge"
          className="ml-auto my-2 hidden shrink-0 items-center gap-2 rounded-full bg-accent px-4 py-2.5 text-xs font-black uppercase tracking-[0.18em] text-accent-foreground shadow-sm transition-transform hover:-translate-y-0.5 lg:inline-flex"
        >
          <Sparkles className="h-3.5 w-3.5" />
          Partner
        </Link>
      </div>
    </nav>
  );
}
