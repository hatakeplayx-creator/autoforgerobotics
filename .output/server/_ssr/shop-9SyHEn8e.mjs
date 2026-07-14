import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { $ as ChevronDown, Q as ChevronLeft, Z as ChevronRight, h as SlidersHorizontal, r as X, x as RotateCcw, z as Funnel } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay, c as DialogTrigger, i as DialogDescription, n as DialogClose, o as DialogPortal, r as DialogContent, s as DialogTitle, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { a as StoreHeader, i as StoreFooter, n as NavBar, o as TopBar, r as Skeleton, s as useCategories, t as AnnouncementBar, u as useProducts } from "./StoreFooter-DMLW-oTe.mjs";
import { a as BreadcrumbPage, i as BreadcrumbList, n as BreadcrumbItem, o as BreadcrumbSeparator, r as BreadcrumbLink, t as Breadcrumb } from "./breadcrumb-BG427xXB.mjs";
import { t as ProductCard } from "./ProductCard-aFJKB8mL.mjs";
import { t as Route } from "./shop-DLzv7_65.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shop-9SyHEn8e.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Sheet = Dialog;
var SheetTrigger = DialogTrigger;
var SheetPortal = DialogPortal;
var SheetOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props,
	ref
}));
SheetOverlay.displayName = DialogOverlay.displayName;
var sheetVariants = cva("fixed z-50 gap-4 bg-background p-6 shadow-lg transition ease-in-out data-[state=closed]:duration-300 data-[state=open]:duration-500 data-[state=open]:animate-in data-[state=closed]:animate-out", {
	variants: { side: {
		top: "inset-x-0 top-0 border-b data-[state=closed]:slide-out-to-top data-[state=open]:slide-in-from-top",
		bottom: "inset-x-0 bottom-0 border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom",
		left: "inset-y-0 left-0 h-full w-3/4 border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left sm:max-w-sm",
		right: "inset-y-0 right-0 h-full w-3/4 border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right sm:max-w-sm"
	} },
	defaultVariants: { side: "right" }
});
var SheetContent = import_react.forwardRef(({ side = "right", className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
	ref,
	className: cn(sheetVariants({ side }), className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	}), children]
})] }));
SheetContent.displayName = DialogContent.displayName;
var SheetHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-2 text-center sm:text-left", className),
	...props
});
SheetHeader.displayName = "SheetHeader";
var SheetFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
SheetFooter.displayName = "SheetFooter";
var SheetTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
	ref,
	className: cn("text-lg font-semibold text-foreground", className),
	...props
}));
SheetTitle.displayName = DialogTitle.displayName;
var SheetDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
SheetDescription.displayName = DialogDescription.displayName;
var ITEMS_PER_PAGE = 6;
var PRICE_RANGES = [
	{
		label: "Under ₹500",
		min: 0,
		max: 500
	},
	{
		label: "₹500 - ₹2,000",
		min: 500,
		max: 2e3
	},
	{
		label: "₹2,000 - ₹10,000",
		min: 2e3,
		max: 1e4
	},
	{
		label: "₹10,000 & Above",
		min: 1e4,
		max: 999999
	}
];
function getProductBrand(product) {
	if (product.brand) return product.brand;
	if (product.name.startsWith("AF")) return "AF";
	if (product.name.toLowerCase().includes("forge")) return "Forge";
	return "AutoForge";
}
function ShopPage() {
	const searchParams = Route.useSearch();
	const navigate = useNavigate();
	const [searchVal, setSearchVal] = (0, import_react.useState)(searchParams.q || "");
	const [selectedCategory, setSelectedCategory] = (0, import_react.useState)(searchParams.category || "");
	const [selectedBrands, setSelectedBrands] = (0, import_react.useState)(searchParams.brand ? searchParams.brand.split(",") : []);
	const [selectedPrices, setSelectedPrices] = (0, import_react.useState)([]);
	const [inStockOnly, setInStockOnly] = (0, import_react.useState)(false);
	const [sortBy, setSortBy] = (0, import_react.useState)(searchParams.sortBy || "featured");
	const [currentPage, setCurrentPage] = (0, import_react.useState)(searchParams.page || 1);
	(0, import_react.useEffect)(() => {
		setSearchVal(searchParams.q || "");
		setSelectedCategory(searchParams.category || "");
		setSelectedBrands(searchParams.brand ? searchParams.brand.split(",") : []);
		setCurrentPage(searchParams.page || 1);
		setSortBy(searchParams.sortBy || "featured");
	}, [searchParams]);
	const { data: rawProducts, loading: productsLoading } = useProducts({
		q: searchVal,
		category: selectedCategory,
		brand: selectedBrands.length > 0 ? selectedBrands.join(",") : void 0,
		sortBy
	});
	const { data: categoriesList, loading: categoriesLoading } = useCategories();
	const updateQueryParams = (updates) => {
		navigate({
			to: "/shop",
			search: (prev) => {
				const next = { ...prev };
				if (updates.q !== void 0) next.q = updates.q || void 0;
				if (updates.category !== void 0) next.category = updates.category || void 0;
				if (updates.brand !== void 0) next.brand = updates.brand && updates.brand.length > 0 ? updates.brand.join(",") : void 0;
				if (updates.sortBy !== void 0) next.sortBy = updates.sortBy;
				if (updates.page !== void 0) next.page = updates.page;
				return next;
			}
		});
	};
	const allBrands = [
		"AF",
		"Forge",
		"AutoForge"
	];
	const filteredProducts = (0, import_react.useMemo)(() => {
		if (!rawProducts) return [];
		let result = [...rawProducts];
		if (selectedPrices.length > 0) result = result.filter((p) => {
			return selectedPrices.some((index) => {
				const range = PRICE_RANGES[index];
				return p.price >= range.min && p.price <= range.max;
			});
		});
		if (inStockOnly) result = result.filter((p) => p.stockQuantity > 0);
		return result;
	}, [
		rawProducts,
		selectedPrices,
		inStockOnly
	]);
	const brandCounts = (0, import_react.useMemo)(() => {
		const counts = {
			AF: 0,
			Forge: 0,
			AutoForge: 0
		};
		if (!rawProducts) return counts;
		rawProducts.forEach((p) => {
			const b = getProductBrand(p);
			counts[b] = (counts[b] || 0) + 1;
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
		updateQueryParams({
			q: "",
			category: "",
			brand: null,
			sortBy: "featured",
			page: 1
		});
	};
	const totalPages = Math.ceil(filteredProducts.length / ITEMS_PER_PAGE) || 1;
	const paginatedProducts = (0, import_react.useMemo)(() => {
		const start = ((currentPage > totalPages ? 1 : currentPage) - 1) * ITEMS_PER_PAGE;
		return filteredProducts.slice(start, start + ITEMS_PER_PAGE);
	}, [
		filteredProducts,
		currentPage,
		totalPages
	]);
	const handlePageChange = (page) => {
		if (page < 1 || page > totalPages) return;
		setCurrentPage(page);
		updateQueryParams({ page });
		window.scrollTo({
			top: 0,
			behavior: "smooth"
		});
	};
	const handleBrandChange = (brand) => {
		const nextBrands = selectedBrands.includes(brand) ? selectedBrands.filter((b) => b !== brand) : [...selectedBrands, brand];
		setSelectedBrands(nextBrands);
		setCurrentPage(1);
		updateQueryParams({
			brand: nextBrands,
			page: 1
		});
	};
	const handlePriceChange = (index) => {
		const nextPrices = selectedPrices.includes(index) ? selectedPrices.filter((i) => i !== index) : [...selectedPrices, index];
		setSelectedPrices(nextPrices);
		setCurrentPage(1);
	};
	const handleCategorySelect = (categoryName) => {
		const nextCategory = selectedCategory === categoryName ? "" : categoryName;
		setSelectedCategory(nextCategory);
		setCurrentPage(1);
		updateQueryParams({
			category: nextCategory,
			page: 1
		});
	};
	const renderSidebarFilters = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
				className: "text-sm font-bold uppercase tracking-wider text-foreground mb-3 flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Categories" }), selectedCategory && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: () => handleCategorySelect(""),
					className: "text-[10px] font-semibold text-primary lowercase hover:underline cursor-pointer",
					children: "Clear"
				})]
			}), categoriesLoading || !categoriesList ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2 pr-1",
				children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-full rounded" }, i))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-1 max-h-60 overflow-y-auto pr-1",
				children: categoriesList.map((cat) => {
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => handleCategorySelect(cat.name),
						className: `w-full text-left px-2.5 py-1.5 rounded text-xs font-medium transition-colors cursor-pointer block truncate ${selectedCategory === cat.name ? "bg-primary text-primary-foreground font-semibold" : "text-muted-foreground hover:bg-secondary/50 hover:text-foreground"}`,
						children: cat.name
					}, cat.name);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-bold uppercase tracking-wider text-foreground mb-3",
				children: "Brands"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: allBrands.map((brand) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "checkbox",
							checked: selectedBrands.includes(brand),
							onChange: () => handleBrandChange(brand),
							className: "h-4 w-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex-1 font-medium",
							children: brand
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[10px] bg-secondary px-1.5 py-0.5 rounded text-muted-foreground font-semibold",
							children: productsLoading ? "..." : brandCounts[brand] || 0
						})
					]
				}, brand))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-bold uppercase tracking-wider text-foreground mb-3",
				children: "Price Range"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: PRICE_RANGES.map((range, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
					className: "flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						type: "checkbox",
						checked: selectedPrices.includes(index),
						onChange: () => handlePriceChange(index),
						className: "h-4 w-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-medium",
						children: range.label
					})]
				}, range.label))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-border" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-bold uppercase tracking-wider text-foreground mb-3",
				children: "Availability"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
				className: "flex items-center gap-2.5 text-xs text-muted-foreground hover:text-foreground cursor-pointer select-none",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "checkbox",
					checked: inStockOnly,
					onChange: (e) => {
						setInStockOnly(e.target.checked);
						setCurrentPage(1);
					},
					className: "h-4 w-4 rounded border-border text-primary focus:ring-primary/30 cursor-pointer"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "font-medium",
					children: "In Stock Only"
				})]
			})] }),
			(selectedCategory || selectedBrands.length > 0 || selectedPrices.length > 0 || inStockOnly || searchVal) && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: handleResetFilters,
				className: "w-full flex items-center justify-center gap-2 py-2 px-4 rounded border border-input text-xs font-semibold hover:bg-secondary/60 cursor-pointer transition-colors",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(RotateCcw, { className: "h-3.5 w-3.5" }), "Reset All Filters"]
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnnouncementBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-7xl px-4 py-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Breadcrumb, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BreadcrumbList, { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbLink, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/",
									children: "Home"
								})
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbPage, { children: "Shop" }) })
						] }) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-6 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between border-b border-border pb-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "text-2xl font-extrabold tracking-tight text-foreground md:text-3xl",
							children: selectedCategory || "Shop All Components"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: productsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Filtering catalogs..." }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
								"Showing ",
								filteredProducts.length === 0 ? 0 : (currentPage - 1) * ITEMS_PER_PAGE + 1,
								"–",
								Math.min(currentPage * ITEMS_PER_PAGE, filteredProducts.length),
								" of ",
								filteredProducts.length,
								" results",
								searchVal && ` for "${searchVal}"`
							] })
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "lg:hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Sheet, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetTrigger, {
									asChild: true,
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										className: "flex items-center gap-1.5 rounded-lg border border-input bg-card px-4 py-2 text-xs font-semibold text-foreground hover:bg-secondary cursor-pointer",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-3.5 w-3.5" }), "Filters"]
									})
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
									side: "left",
									className: "w-80 overflow-y-auto pt-10",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, {
										className: "mb-4 text-left",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetTitle, {
											className: "flex items-center gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Funnel, { className: "h-4 w-4" }), "Filter & Sort"]
										})
									}), renderSidebarFilters()]
								})] })
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "text-xs font-semibold text-muted-foreground whitespace-nowrap hidden sm:inline",
									children: "Sort By:"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "relative",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
										value: sortBy,
										onChange: (e) => {
											setSortBy(e.target.value);
											setCurrentPage(1);
											updateQueryParams({
												sortBy: e.target.value,
												page: 1
											});
										},
										className: "appearance-none rounded-lg border border-input bg-card pl-3 pr-8 py-2 text-xs font-semibold text-foreground outline-none focus:border-primary transition-colors cursor-pointer",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "featured",
												children: "Featured / Relevance"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "price-asc",
												children: "Price: Low to High"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "price-desc",
												children: "Price: High to Low"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
												value: "reviews",
												children: "Popularity (Reviews)"
											})
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "absolute right-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground pointer-events-none" })]
								})]
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-8 lg:grid-cols-[260px_1fr]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
							className: "hidden lg:block border border-border rounded-xl bg-card p-5 h-fit sticky top-20 shadow-sm",
							children: renderSidebarFilters()
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-col gap-8",
							children: productsLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4",
								children: Array.from({ length: 6 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "border border-border rounded-lg p-3 space-y-3 bg-card shadow-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-12" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-square w-full rounded" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-3/4" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-3 w-16" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-7 w-full animate-pulse" })
									]
								}, i))
							}) : filteredProducts.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-col items-center justify-center text-center p-12 bg-card rounded-xl border border-dashed border-border min-h-[300px]",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SlidersHorizontal, { className: "h-10 w-10 text-muted-foreground stroke-1 mb-4" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-bold text-foreground",
										children: "No Products Found"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-1 text-xs text-muted-foreground max-w-xs",
										children: "We couldn't find any components matching your search or filters. Try resetting the filters."
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: handleResetFilters,
										className: "mt-4 rounded-lg bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer",
										children: "Reset All Filters"
									})
								]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-2 gap-4 sm:grid-cols-3 xl:grid-cols-4",
								children: paginatedProducts.map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product }, product.sku))
							}), totalPages > 1 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center justify-center gap-1.5 border-t border-border pt-6",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handlePageChange(currentPage - 1),
										disabled: currentPage === 1,
										className: "p-2 rounded-lg border border-input bg-card text-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors",
										"aria-label": "Previous Page",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-4 w-4" })
									}),
									Array.from({ length: totalPages }).map((_, idx) => {
										const pageNum = idx + 1;
										return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
											onClick: () => handlePageChange(pageNum),
											className: `min-w-9 h-9 rounded-lg text-xs font-bold transition-all cursor-pointer ${currentPage === pageNum ? "bg-primary text-primary-foreground border border-primary scale-105" : "border border-input bg-card text-foreground hover:bg-secondary hover:text-foreground"}`,
											children: pageNum
										}, pageNum);
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handlePageChange(currentPage + 1),
										disabled: currentPage === totalPages,
										className: "p-2 rounded-lg border border-input bg-card text-foreground hover:bg-secondary hover:text-foreground disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer transition-colors",
										"aria-label": "Next Page",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "h-4 w-4" })
									})
								]
							})] })
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreFooter, {})
		]
	});
}
//#endregion
export { ShopPage as component };
