import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { ArrowRight, ChevronDown, ChevronLeft, ChevronRight, Filter, RotateCcw, Search, SlidersHorizontal } from "lucide-react";
import { AnnouncementBar, TopBar } from "@/components/store/TopBar";
import { StoreHeader } from "@/components/store/StoreHeader";
import { NavBar } from "@/components/store/NavBar";
import { StoreFooter } from "@/components/store/StoreFooter";
import { ProductCard } from "@/components/store/ProductCard";
import { useCategories, useProducts } from "@/hooks/useStoreData";
import { Skeleton } from "@/components/ui/skeleton";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import type { Product, ShopSearch } from "@/types/store";

const shopSearchSchema = z.object({
  q: z.string().catch("").optional(),
  category: z.string().catch("").optional(),
  brand: z.string().catch("").optional(),
  sortBy: z.string().catch("featured").optional(),
  page: z.number().catch(1).optional(),
});

export const Route = createFileRoute("/shop/")({
  validateSearch: (search) => shopSearchSchema.parse(search),
  component: ShopPage,
});

const ITEMS_PER_PAGE = 8;

const PRICE_RANGES = [
  { label: "Under Rs. 500", min: 0, max: 500 },
  { label: "Rs. 500 - Rs. 2,000", min: 500, max: 2000 },
  { label: "Rs. 2,000 - Rs. 10,000", min: 2000, max: 10000 },
  { label: "Rs. 10,000 and above", min: 10000, max: 999999 },
];

function getProductBrand(product: Product) {
  if (product.brand) return product.brand;
  if (product.name.startsWith("AF")) return "AF";
  if (product.name.toLowerCase().includes("forge")) return "Forge";
  return "AutoForge";
}

function ShopPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  const [searchVal, setSearchVal] = useState(searchParams.q || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.category || "");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(searchParams.brand ? searchParams.brand.split(",") : []);
  const [selectedPrices, setSelectedPrices] = useState<number[]>([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState<string>(searchParams.sortBy || "featured");
  const [currentPage, setCurrentPage] = useState<number>(searchParams.page || 1);

  useEffect(() => {
    setSearchVal(searchParams.q || "");
    setSelectedCategory(searchParams.category || "");
    setSelectedBrands(searchParams.brand ? searchParams.brand.split(",") : []);
    setCurrentPage(searchParams.page || 1);
    setSortBy(searchParams.sortBy || "featured");
  }, [searchParams]);

  const { data: rawProducts, loading: productsLoading } = useProducts({
    q: searchVal,
    category: selectedCategory,
    brand: selectedBrands.length > 0 ? selectedBrands.join(",") : undefined,
    sortBy,
  });
  const { data: categoriesList, loading: categoriesLoading } = useCategories();

  const updateQueryParams = (updates: { q?: string; category?: string; brand?: string[] | null; sortBy?: string; page?: number }) => {
    navigate({
      to: "/shop",
      search: (prev: ShopSearch) => {
        const next = { ...prev };
        if (updates.q !== undefined) next.q = updates.q || undefined;
        if (updates.category !== undefined) next.category = updates.category || undefined;
        if (updates.brand !== undefined) next.brand = updates.brand && updates.brand.length > 0 ? updates.brand.join(",") : undefined;
        if (updates.sortBy !== undefined) next.sortBy = updates.sortBy;
        if (updates.page !== undefined) next.page = updates.page;
        return next;
      },
    });
  };

  const allBrands = ["AF", "Forge", "AutoForge"];

  const filteredProducts = useMemo(() => {
    if (!rawProducts) return [];
    let result = [...rawProducts];
    if (selectedPrices.length > 0) {
      result = result.filter((product) => selectedPrices.some((index) => product.price >= PRICE_RANGES[index].min && product.price <= PRICE_RANGES[index].max));
    }
    if (inStockOnly) result = result.filter((product) => product.stockQuantity > 0);
    return result;
  }, [rawProducts, selectedPrices, inStockOnly]);

  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = { AF: 0, Forge: 0, AutoForge: 0 };
    rawProducts?.forEach((product) => {
      const brand = getProductBrand(product);
      counts[brand] = (counts[brand] || 0) + 1;
    });
    return counts;
  }, [rawProducts]);

  const handleResetFilters = () => {
    setSearchVal("");
    setSelectedCategory("");
    setSelectedBrands([]);
    setSelectedPrices([]);
    setInStockOnly(false);
    setSortBy("featured");
    setCurrentPage(1);
    updateQueryParams({ q: "", category: "", brand: null, sortBy: "featured", page: 1 });
  };

  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const page = currentPage > totalPages ? 1 : currentPage;
    return filteredProducts.slice((page - 1) * ITEMS_PER_PAGE, page * ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    updateQueryParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBrandChange = (brand: string) => {
    const nextBrands = selectedBrands.includes(brand) ? selectedBrands.filter((item) => item !== brand) : [...selectedBrands, brand];
    setSelectedBrands(nextBrands);
    setCurrentPage(1);
    updateQueryParams({ brand: nextBrands, page: 1 });
  };

  const handlePriceChange = (index: number) => {
    setSelectedPrices((current) => current.includes(index) ? current.filter((item) => item !== index) : [...current, index]);
    setCurrentPage(1);
  };

  const handleCategorySelect = (categoryName: string) => {
    const nextCategory = selectedCategory === categoryName ? "" : categoryName;
    setSelectedCategory(nextCategory);
    setCurrentPage(1);
    updateQueryParams({ category: nextCategory, page: 1 });
  };

  const applySearch = (event: React.FormEvent) => {
    event.preventDefault();
    setCurrentPage(1);
    updateQueryParams({ q: searchVal, page: 1 });
  };

  const filterPanel = (
    <div className="space-y-7">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs font-black uppercase tracking-[0.24em] text-accent">Refine</p>
          <h2 className="mt-1 text-xl font-black text-foreground">Build filters</h2>
        </div>
        {(selectedCategory || selectedBrands.length || selectedPrices.length || inStockOnly || searchVal) ? (
          <button type="button" onClick={handleResetFilters} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-bold text-muted-foreground hover:text-primary">
            <RotateCcw className="h-3.5 w-3.5" />
            Reset
          </button>
        ) : null}
      </div>

      <div>
        <h3 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Categories</h3>
        {categoriesLoading || !categoriesList ? (
          <div className="space-y-2">{Array.from({ length: 6 }).map((_, index) => <Skeleton key={index} className="h-9 rounded-full" />)}</div>
        ) : (
          <div className="space-y-1.5">
            {categoriesList.map((cat) => (
              <button
                key={cat.name}
                type="button"
                onClick={() => handleCategorySelect(cat.name)}
                className={`flex w-full items-center justify-between rounded-full px-3 py-2 text-left text-xs font-bold transition-colors ${
                  selectedCategory === cat.name ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"
                }`}
              >
                <span className="truncate">{cat.name}</span>
                <ArrowRight className="h-3.5 w-3.5 shrink-0" />
              </button>
            ))}
          </div>
        )}
      </div>

      <div>
        <h3 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Brands</h3>
        <div className="space-y-2">
          {allBrands.map((brand) => (
            <label key={brand} className="flex cursor-pointer items-center gap-3 rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground">
              <input type="checkbox" checked={selectedBrands.includes(brand)} onChange={() => handleBrandChange(brand)} className="h-4 w-4 rounded border-border text-accent" />
              <span className="flex-1">{brand}</span>
              <span>{productsLoading ? "..." : brandCounts[brand] || 0}</span>
            </label>
          ))}
        </div>
      </div>

      <div>
        <h3 className="mb-3 text-xs font-black uppercase tracking-[0.2em] text-muted-foreground">Price</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, index) => (
            <label key={range.label} className="flex cursor-pointer items-center gap-3 rounded-full border border-border bg-card px-3 py-2 text-xs font-bold text-muted-foreground transition-colors hover:text-foreground">
              <input type="checkbox" checked={selectedPrices.includes(index)} onChange={() => handlePriceChange(index)} className="h-4 w-4 rounded border-border text-accent" />
              <span>{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-secondary/40 p-4 text-sm font-bold text-foreground">
        <input type="checkbox" checked={inStockOnly} onChange={(event) => { setInStockOnly(event.target.checked); setCurrentPage(1); }} className="h-4 w-4 rounded border-border text-accent" />
        In-stock parts only
      </label>
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <TopBar />
      <StoreHeader />
      <NavBar />

      <main>
        <section className="border-b border-border bg-primary text-primary-foreground">
          <div className="mx-auto max-w-7xl px-4 py-12 md:py-16">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-accent">AutoForge shop</p>
            <div className="mt-4 grid gap-6 lg:grid-cols-[1fr_28rem] lg:items-end">
              <div>
                <h1 className="max-w-3xl text-4xl font-black tracking-tight md:text-6xl">{selectedCategory || "Robotics hardware catalog"}</h1>
                <p className="mt-4 max-w-2xl text-sm leading-7 text-primary-foreground/70">
                  Search, filter, and compare components for robotics benches, autonomous systems, fabrication labs, and production prototypes.
                </p>
              </div>
              <form onSubmit={applySearch} className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  type="search"
                  value={searchVal}
                  onChange={(event) => setSearchVal(event.target.value)}
                  onKeyDown={(event) => {
                    if (event.key === "Enter") {
                      event.preventDefault();
                      setCurrentPage(1);
                      updateQueryParams({ q: searchVal, page: 1 });
                    }
                  }}
                  placeholder="Search the engineering catalog"
                  className="h-13 w-full rounded-full border border-primary-foreground/12 bg-primary-foreground pl-11 pr-28 text-sm text-primary outline-none focus:border-accent"
                />
                <button type="submit" className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-accent px-4 py-2 text-xs font-black text-accent-foreground">
                  Search
                </button>
              </form>
            </div>
          </div>
        </section>

        <section className="mx-auto max-w-7xl px-4 py-8">
          <div className="mb-6 flex flex-col gap-4 rounded-2xl border border-border bg-card p-4 shadow-[var(--shadow-soft)] md:flex-row md:items-center md:justify-between">
            <div className="text-sm text-muted-foreground">
              {productsLoading ? "Calibrating catalog..." : `Showing ${filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}-${Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of ${filteredProducts.length} products${searchVal ? ` for "${searchVal}"` : ""}`}
            </div>
            <div className="flex items-center gap-3">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-bold text-foreground lg:hidden">
                    <SlidersHorizontal className="h-4 w-4" />
                    Filters
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-86 overflow-y-auto pt-10">
                  <SheetHeader className="mb-5 text-left">
                    <SheetTitle className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter catalog
                    </SheetTitle>
                  </SheetHeader>
                  {filterPanel}
                </SheetContent>
              </Sheet>

              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(event) => {
                    setSortBy(event.target.value);
                    setCurrentPage(1);
                    updateQueryParams({ sortBy: event.target.value, page: 1 });
                  }}
                  className="h-10 appearance-none rounded-full border border-border bg-card pl-4 pr-10 text-sm font-bold outline-none focus:border-accent"
                >
                  <option value="featured">Featured / Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="reviews">Popularity</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              </div>
            </div>
          </div>

          <div className="grid gap-8 lg:grid-cols-[18rem_1fr]">
            <aside className="sticky top-28 hidden h-fit rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] lg:block">
              {filterPanel}
            </aside>

            <div className="space-y-8">
              {productsLoading ? (
                <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                  {Array.from({ length: 8 }).map((_, index) => <Skeleton key={index} className="h-96 rounded-2xl" />)}
                </div>
              ) : filteredProducts.length === 0 ? (
                <div className="flex min-h-[22rem] flex-col items-center justify-center rounded-2xl border border-dashed border-border bg-card p-10 text-center">
                  <SlidersHorizontal className="h-10 w-10 text-muted-foreground" />
                  <h3 className="mt-4 text-xl font-black text-foreground">No products found</h3>
                  <p className="mt-2 max-w-sm text-sm leading-6 text-muted-foreground">Try clearing a filter or searching for another robotics component.</p>
                  <button onClick={handleResetFilters} className="mt-5 rounded-full bg-primary px-5 py-3 text-sm font-bold text-primary-foreground">Reset filters</button>
                </div>
              ) : (
                <>
                  <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                    {paginatedProducts.map((product) => <ProductCard key={product.sku} product={product} />)}
                  </div>

                  {totalPages > 1 ? (
                    <div className="flex items-center justify-center gap-2 border-t border-border pt-6">
                      <button onClick={() => handlePageChange(currentPage - 1)} disabled={currentPage === 1} className="rounded-full border border-border bg-card p-2 disabled:opacity-40" aria-label="Previous page">
                        <ChevronLeft className="h-4 w-4" />
                      </button>
                      {Array.from({ length: totalPages }).map((_, index) => {
                        const page = index + 1;
                        return (
                          <button key={page} onClick={() => handlePageChange(page)} className={`h-10 min-w-10 rounded-full text-sm font-black ${currentPage === page ? "bg-primary text-primary-foreground" : "border border-border bg-card text-foreground"}`}>
                            {page}
                          </button>
                        );
                      })}
                      <button onClick={() => handlePageChange(currentPage + 1)} disabled={currentPage === totalPages} className="rounded-full border border-border bg-card p-2 disabled:opacity-40" aria-label="Next page">
                        <ChevronRight className="h-4 w-4" />
                      </button>
                    </div>
                  ) : null}
                </>
              )}
            </div>
          </div>
        </section>
      </main>

      <StoreFooter />
    </div>
  );
}
