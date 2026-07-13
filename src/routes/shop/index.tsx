import { useState, useMemo, useEffect } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { z } from "zod";
import { Filter, RotateCcw, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight } from "lucide-react";
import { AnnouncementBar, TopBar } from "@/components/store/TopBar";
import { StoreHeader } from "@/components/store/StoreHeader";
import { NavBar } from "@/components/store/NavBar";
import { StoreFooter } from "@/components/store/StoreFooter";
import { ProductCard } from "@/components/store/ProductCard";
import { formatPrice } from "@/lib/store-data";
import { useProducts, useCategories } from "@/hooks/useStoreData";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Toaster } from "@/components/ui/sonner";

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

const ITEMS_PER_PAGE = 6;

const PRICE_RANGES = [
  { label: "Under ₹500", min: 0, max: 500 },
  { label: "₹500 - ₹2,000", min: 500, max: 2000 },
  { label: "₹2,000 - ₹10,000", min: 2000, max: 10000 },
  { label: "₹10,000 & Above", min: 10000, max: 999999 },
];

import type { Product } from "@/types/store";

function getProductBrand(product: Product) {
  if (product.brand) return product.brand;
  if (product.name.startsWith("AF")) return "AF";
  if (product.name.toLowerCase().includes("forge")) return "Forge";
  return "AutoForge";
}

function ShopPage() {
  const searchParams = Route.useSearch();
  const navigate = useNavigate();

  // Search, sorting and filtering state
  const [searchVal, setSearchVal] = useState(searchParams.q || "");
  const [selectedCategory, setSelectedCategory] = useState<string>(searchParams.category || "");
  const [selectedBrands, setSelectedBrands] = useState<string[]>(
    searchParams.brand ? searchParams.brand.split(",") : []
  );
  const [selectedPrices, setSelectedPrices] = useState<number[]>([]); 
  const [inStockOnly, setInStockOnly] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<string>(searchParams.sortBy || "featured");
  const [currentPage, setCurrentPage] = useState<number>(searchParams.page || 1);

  // Sync state with URL search params when they change
  useEffect(() => {
    setSearchVal(searchParams.q || "");
    setSelectedCategory(searchParams.category || "");
    setSelectedBrands(searchParams.brand ? searchParams.brand.split(",") : []);
    setCurrentPage(searchParams.page || 1);
    setSortBy(searchParams.sortBy || "featured");
  }, [searchParams]);

  // Async query hooks
  const { data: rawProducts, loading: productsLoading } = useProducts({
    q: searchVal,
    category: selectedCategory,
    brand: selectedBrands.length > 0 ? selectedBrands.join(",") : undefined,
    sortBy: sortBy,
  });

  const { data: categoriesList, loading: categoriesLoading } = useCategories();

  // Helper to update navigation params
  const updateQueryParams = (updates: {
    q?: string;
    category?: string;
    brand?: string[] | null;
    sortBy?: string;
    page?: number;
  }) => {
    navigate({
      to: "/shop",
      search: (prev: any) => {
        const next = { ...prev };
        if (updates.q !== undefined) next.q = updates.q || undefined;
        if (updates.category !== undefined) next.category = updates.category || undefined;
        if (updates.brand !== undefined) {
          next.brand = updates.brand && updates.brand.length > 0 ? updates.brand.join(",") : undefined;
        }
        if (updates.sortBy !== undefined) next.sortBy = updates.sortBy;
        if (updates.page !== undefined) next.page = updates.page;
        return next;
      },
    });
  };

  // Hardcode brand options for the filter panel
  const allBrands = ["AF", "Forge", "AutoForge"];

  // Filter and Sort implementation
  const filteredProducts = useMemo(() => {
    if (!rawProducts) return [];
    let result = [...rawProducts];

    // Price range filter (applied locally)
    if (selectedPrices.length > 0) {
      result = result.filter((p) => {
        return selectedPrices.some((index) => {
          const range = PRICE_RANGES[index];
          return p.price >= range.min && p.price <= range.max;
        });
      });
    }

    // Availability filter (applied locally)
    if (inStockOnly) {
      result = result.filter((p) => p.stockQuantity > 0);
    }

    return result;
  }, [rawProducts, selectedPrices, inStockOnly]);

  // Compute count for brands based on raw items
  const brandCounts = useMemo(() => {
    const counts: Record<string, number> = { AF: 0, Forge: 0, AutoForge: 0 };
    if (!rawProducts) return counts;
    rawProducts.forEach((p) => {
      const b = getProductBrand(p);
      counts[b] = (counts[b] || 0) + 1;
    });
    return counts;
  }, [rawProducts]);

  // Reset all filters helper
  const handleResetFilters = () => {
    setSearchVal("");
    setSelectedCategory("");
    setSelectedBrands([]);
    setSelectedPrices([]);
    setInStockOnly(false);
    setSortBy("featured");
    updateQueryParams({ q: "", category: "", brand: null, sortBy: "featured", page: 1 });
  };

  // Pagination details
  const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
  const paginatedProducts = useMemo(() => {
    const page = currentPage > totalPages ? 1 : currentPage;
    const start = (page - 1) * ITEMS_PER_PAGE;
    return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
  }, [filteredProducts, currentPage, totalPages]);

  const handlePageChange = (page: number) => {
    if (page < 1 || page > totalPages) return;
    setCurrentPage(page);
    updateQueryParams({ page });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleBrandChange = (brand: string) => {
    const nextBrands = selectedBrands.includes(brand)
      ? selectedBrands.filter((b) => b !== brand)
      : [...selectedBrands, brand];
    setSelectedBrands(nextBrands);
    setCurrentPage(1);
    updateQueryParams({ brand: nextBrands, page: 1 });
  };

  const handlePriceChange = (index: number) => {
    const nextPrices = selectedPrices.includes(index)
      ? selectedPrices.filter((i) => i !== index)
      : [...selectedPrices, index];
    setSelectedPrices(nextPrices);
    setCurrentPage(1);
  };

  const handleCategorySelect = (categoryName: string) => {
    const nextCategory = selectedCategory === categoryName ? "" : categoryName;
    setSelectedCategory(nextCategory);
    setCurrentPage(1);
    updateQueryParams({ category: nextCategory, page: 1 });
  };

  // Render the Sidebar Filters content
  const renderSidebarFilters = () => (
    <div className="space-y-6">
      {/* Category List */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3 flex items-center justify-between">
          <span>Categories</span>
          {selectedCategory && (
            <button
              onClick={() => handleCategorySelect("")}
              className="text-[10px] font-semibold text-primary lowercase hover:underline cursor-pointer"
            >
              Clear
            </button>
          )}
        </h3>
        {categoriesLoading || !categoriesList ? (
          <div className="space-y-2 pr-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Skeleton key={i} className="h-6 w-full rounded" />
            ))}
          </div>
        ) : (
          <div className="space-y-1 max-h-60 overflow-y-auto pr-1">
            {categoriesList.map((cat) => {
              const isSelected = selectedCategory === cat.name;
              return (
                <button
                  key={cat.name}
                  onClick={() => handleCategorySelect(cat.name)}
                  className={`w-full text-left px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer block truncate ${
                    isSelected
                      ? "bg-primary text-primary-foreground font-semibold"
                      : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"
                  }`}
                >
                  {cat.name}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <hr className="border-border" />

      {/* Brand Filters */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">Brands</h3>
        <div className="space-y-2">
          {allBrands.map((brand) => (
            <label key={brand} className="flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedBrands.includes(brand)}
                onChange={() => handleBrandChange(brand)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
              />
              <span className="flex-1 font-medium">{brand}</span>
              <span className="text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-semibold">
                {productsLoading ? "..." : brandCounts[brand] || 0}
              </span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-border" />

      {/* Price Filters */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">Price Range</h3>
        <div className="space-y-2">
          {PRICE_RANGES.map((range, index) => (
            <label key={range.label} className="flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none">
              <input
                type="checkbox"
                checked={selectedPrices.includes(index)}
                onChange={() => handlePriceChange(index)}
                className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
              />
              <span className="font-medium">{range.label}</span>
            </label>
          ))}
        </div>
      </div>

      <hr className="border-border" />

      {/* Availability Filter */}
      <div>
        <h3 className="text-sm font-bold uppercase tracking-wider text-foreground mb-3">Availability</h3>
        <label className="flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none">
          <input
            type="checkbox"
            checked={inStockOnly}
            onChange={(e) => {
              setInStockOnly(e.target.checked);
              setCurrentPage(1);
            }}
            className="h-4 w-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
          />
          <span className="font-medium">In Stock Only</span>
        </label>
      </div>

      {/* Reset Button */}
      {(selectedCategory || selectedBrands.length > 0 || selectedPrices.length > 0 || inStockOnly || searchVal) && (
        <button
          onClick={handleResetFilters}
          className="w-full flex items-center justify-center gap-2 py-2 px-4 rounded border border-input text-xs font-semibold hover:bg-secondary/60 cursor-pointer transition-colors"
        >
          <RotateCcw className="h-3.5 w-3.5" />
          Reset All Filters
        </button>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-background">
      <Toaster position="top-right" closeButton richColors />
      <AnnouncementBar />
      <TopBar />
      <StoreHeader />
      <NavBar />

      <main className="mx-auto max-w-7xl px-4 py-6">
        {/* Breadcrumb */}
        <div className="mb-4">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link to="/">Home</Link>
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>Shop</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>

        {/* Page title and top bar */}
        <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4">
          <div>
            <h1 className="text-2xl font-extrabold tracking-tight text-foreground md:text-3xl">
              {selectedCategory || "Shop All Components"}
            </h1>
            <p className="mt-1 text-xs text-muted-foreground">
              {productsLoading ? (
                <span>Filtering catalogs...</span>
              ) : (
                <span>
                  Showing {filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1}–
                  {Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length)} of {filteredProducts.length} results
                  {searchVal && ` for "${searchVal}"`}
                </span>
              )}
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Mobile Filter Sheet */}
            <div className="lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center gap-1.5 rounded-lg border border-input bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer">
                    <SlidersHorizontal className="h-3.5 w-3.5" />
                    Filters
                  </button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80 overflow-y-auto pt-10">
                  <SheetHeader className="mb-4 text-left">
                    <SheetTitle className="flex items-center gap-2">
                      <Filter className="h-4 w-4" />
                      Filter & Sort
                    </SheetTitle>
                  </SheetHeader>
                  {renderSidebarFilters()}
                </SheetContent>
              </Sheet>
            </div>

            {/* Sort Dropdown */}
            <div className="flex items-center gap-2">
              <span className="text-xs font-semibold text-muted-foreground whitespace-nowrap hidden sm:inline">Sort By:</span>
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => {
                    setSortBy(e.target.value);
                    setCurrentPage(1);
                    updateQueryParams({ sortBy: e.target.value, page: 1 });
                  }}
                  className="appearance-none rounded-lg border border-input bg-card pl-3 pr-8 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary transition-colors cursor-pointer"
                >
                  <option value="featured">Featured / Relevance</option>
                  <option value="price-asc">Price: Low to High</option>
                  <option value="price-desc">Price: High to Low</option>
                  <option value="reviews">Popularity (Reviews)</option>
                </select>
                <ChevronDown className="absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" />
              </div>
            </div>
          </div>
        </div>

        {/* Core Layout Grid */}
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block border border-border rounded-xl bg-card p-5 h-fit sticky top-20 shadow-sm">
            {renderSidebarFilters()}
          </aside>

          {/* Product Grid & Pagination Section */}
          <div className="flex flex-col gap-8">
            {productsLoading ? (
              /* Loading Skeletons Grid */
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div key={i} className="border border-border rounded-lg p-3 space-y-3 bg-card shadow-sm">
                    <Skeleton className="h-3 w-12" />
                    <Skeleton className="aspect-square w-full rounded" />
                    <Skeleton className="h-4 w-3/4" />
                    <Skeleton className="h-3 w-16" />
                    <Skeleton className="h-7 w-full animate-pulse" />
                  </div>
                ))}
              </div>
            ) : filteredProducts.length === 0 ? (
              <div className="flex flex-col items-center justify-center text-center p-12 bg-card rounded-xl border border-dashed border-border min-h-[300px]">
                <SlidersHorizontal className="h-10 w-10 text-muted-foreground stroke-1 mb-4" />
                <h3 className="text-base font-bold text-foreground">No Products Found</h3>
                <p className="mt-1 text-xs text-muted-foreground max-w-xs">
                  We couldn't find any components matching your search or filters. Try resetting the filters.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer"
                >
                  Reset All Filters
                </button>
              </div>
            ) : (
              <>
                {/* Product Cards Grid */}
                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4">
                  {paginatedProducts.map((product) => (
                    <ProductCard key={product.sku} product={product} />
                  ))}
                </div>

                {/* Pagination Controls */}
                {totalPages > 1 && (
                  <div className="flex items-center justify-center gap-1.5 border-t border-border pt-6">
                    <button
                      onClick={() => handlePageChange(currentPage - 1)}
                      disabled={currentPage === 1}
                      className="p-2 rounded-lg border border-input bg-card text-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      aria-label="Previous Page"
                    >
                      <ChevronLeft className="h-4 w-4" />
                    </button>

                    {Array.from({ length: totalPages }).map((_, idx) => {
                      const pageNum = idx + 1;
                      const isCurrent = currentPage === pageNum;
                      return (
                        <button
                          key={pageNum}
                          onClick={() => handlePageChange(pageNum)}
                          className={`min-w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                            isCurrent
                              ? "bg-primary text-primary-foreground border border-primary scale-105"
                              : "border border-input bg-card text-foreground hover:bg-secondary hover:text-foreground"
                          }`}
                        >
                          {pageNum}
                        </button>
                      );
                    })}

                    <button
                      onClick={() => handlePageChange(currentPage + 1)}
                      disabled={currentPage === totalPages}
                      className="p-2 rounded-lg border border-input bg-card text-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors"
                      aria-label="Next Page"
                    >
                      <ChevronRight className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </main>

      <StoreFooter />
    </div>
  );
}
