import { Menu, ChevronDown } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useStoreMetadata, useCategories } from "@/hooks/useStoreData";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { clsx } from "clsx";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Map nav link to route
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
      <nav className="sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-md">
        <div className="mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 py-3 h-[53px]">
          <Skeleton className="h-8 w-32 shrink-0" />
          <div className="flex items-center gap-4">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-4 w-16 shrink-0" />
            ))}
          </div>
        </div>
      </nav>
    );
  }

  return (
    <nav className="border-b border-border bg-background">
      <div className="mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="flex shrink-0 items-center gap-3 bg-secondary px-4 py-3.5 text-sm font-semibold text-secondary-foreground">
              <Menu className="h-4 w-4" />
              All Categories
              <ChevronDown className="h-4 w-4" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent className="w-56">
            {categoriesLoading ? (
              <div className="p-2">
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full mb-2" />
                <Skeleton className="h-4 w-full" />
              </div>
            ) : (
              categories?.map((category) => (
                <DropdownMenuItem asChild key={category.name}>
                  <Link
                    to="/shop"
                    search={{ category: category.name }}
                    className="w-full cursor-pointer"
                  >
                    {category.name}
                  </Link>
                </DropdownMenuItem>
              ))
            )}
          </DropdownMenuContent>
        </DropdownMenu>
        <div className="flex items-center gap-1">
          {data.navLinks.map((link) => {
            const to = navLinkToRoute[link];
            const isHome = link === "Home";

            if (!to) {
              return (
                <button
                  key={link}
                  type="button"
                  onClick={() => {
                    toast.info(`${link} page is coming soon.`);
                  }}
                  className="whitespace-nowrap px-3 py-3.5 text-sm font-medium transition-colors text-foreground hover:text-primary flex items-center"
                >
                  {link}
                  {(link === "Shop" || link === "Blogs") && (
                    <ChevronDown className="ml-1 inline h-3.5 w-3.5" />
                  )}
                </button>
              );
            }

            return (
              <Link
                key={link}
                to={to}
                className={clsx(
                  "whitespace-nowrap px-3 py-3.5 text-sm font-medium transition-colors flex items-center",
                  isHome ? "text-accent" : "text-foreground hover:text-primary"
                )}
              >
                {link}
                {(link === "Shop" || link === "Blogs") && (
                  <ChevronDown className="ml-1 inline h-3.5 w-3.5" />
                )}
              </Link>
            );
          })}
          <Link to="/sell-on-autoforge" className="ml-1 whitespace-nowrap rounded-md bg-accent px-3 py-2 text-xs font-bold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90">
            SELL ON AUTOFORGE
          </Link>
        </div>
      </div>
    </nav>
  );
}
