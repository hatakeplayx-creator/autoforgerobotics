import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as apiFetch, r as useAuth } from "./useAuth-BDG16QbY.mjs";
import { t as WishlistContext } from "./WishlistContext-BDJfKxra.mjs";
import { t as useCart } from "./useCart-Bd4ZcYPt.mjs";
import { n as clsx } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { $ as ChevronDown, A as Mail, C as Plus, E as Minus, F as Instagram, K as Circle, L as Heart, N as Linkedin, O as Menu, U as Cog, V as Facebook, Z as ChevronRight, a as User, b as Search, et as Check, g as ShoppingCart, it as ArrowRight, k as MapPin, n as Youtube, o as Twitter, q as CircleQuestionMark, r as X, u as Trash, w as Phone } from "../_libs/lucide-react.mjs";
import { a as Label2, c as Root2, d as SubTrigger2, f as Trigger, i as ItemIndicator2, l as Separator2, n as Content2, o as Portal2, r as Item2, s as RadioItem2, t as CheckboxItem2, u as SubContent2 } from "../_libs/@radix-ui/react-dropdown-menu+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/StoreFooter-Z2RR4EsA.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function AnnouncementBar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-primary text-primary-foreground py-2 px-4 text-center text-xs font-semibold tracking-wide",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
			"⚡ Get 10% off on your first order! Use code ",
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
				className: "underline",
				children: "AUTOFIRST"
			}),
			". Free delivery on orders above ₹999."
		] })
	});
}
function TopBar() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "bg-secondary/40 border-b border-border text-muted-foreground text-xs py-2",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto max-w-7xl px-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center gap-x-4 gap-y-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["Toll Free: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "1800 266 6123" })] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "hidden sm:inline text-border",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "flex items-center gap-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-3.5 w-3.5 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Pune, Maharashtra, India" })]
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => toast.info("Help center support is coming soon."),
						className: "hover:text-primary transition-colors flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleQuestionMark, { className: "h-3.5 w-3.5" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Need Help?" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-border",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => toast.info("Use Orders page after login."),
						className: "hover:text-primary transition-colors",
						children: "Track Order"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-border",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => toast.info("Careers portal coming soon."),
						className: "hover:text-primary transition-colors",
						children: "Careers"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-border",
						children: "|"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => toast.info("Contact: support@autoforgerobotics.in"),
						className: "hover:text-primary transition-colors",
						children: "Contact Us"
					})
				]
			})]
		})
	});
}
function useWishlist() {
	const context = (0, import_react.useContext)(WishlistContext);
	if (context === void 0) throw new Error("useWishlist must be used within a WishlistProvider");
	return context;
}
function formatPrice(price) {
	return `₹ ${(typeof price === "string" ? parseFloat(price) : price ?? 0).toFixed(2)}`;
}
function StoreHeader() {
	const [searchQuery, setSearchQuery] = (0, import_react.useState)("");
	const [isCartOpen, setIsCartOpen] = (0, import_react.useState)(false);
	const [isAccountOpen, setIsAccountOpen] = (0, import_react.useState)(false);
	const dropdownRef = (0, import_react.useRef)(null);
	const accountRef = (0, import_react.useRef)(null);
	const navigate = useNavigate();
	const { cartItems, itemCount, removeFromCart, updateQuantity, subtotal } = useCart();
	const { isAuthenticated, user, logout } = useAuth();
	const { wishlistItems, isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
	(0, import_react.useEffect)(() => {
		function handleClickOutside(event) {
			if (dropdownRef.current && !dropdownRef.current.contains(event.target)) setIsCartOpen(false);
			if (accountRef.current && !accountRef.current.contains(event.target)) setIsAccountOpen(false);
		}
		document.addEventListener("mousedown", handleClickOutside);
		return () => document.removeEventListener("mousedown", handleClickOutside);
	}, []);
	const handleSearchSubmit = (e) => {
		e.preventDefault();
		if (!searchQuery.trim()) return;
		navigate({
			to: "/shop",
			search: (prev) => ({
				...prev,
				q: searchQuery
			})
		});
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
		className: "sticky top-0 z-40 w-full border-b border-border bg-background/95 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl h-16 items-center justify-between gap-4 px-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-9 w-9 items-center justify-center rounded-full bg-accent shrink-0",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cog, { className: "h-5 w-5 text-accent-foreground animate-spin-slow" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "leading-none select-none",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-lg font-black tracking-tight text-primary",
							children: "AUTOFORGE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[8px] font-bold uppercase tracking-[0.3em] text-accent",
							children: "Robotics"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					onSubmit: handleSearchSubmit,
					className: "relative hidden max-w-md flex-1 md:block",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							type: "search",
							placeholder: "Search microcontrollers, sensors, drone parts...",
							value: searchQuery,
							onChange: (e) => setSearchQuery(e.target.value),
							className: "w-full h-10 rounded-full border border-border bg-secondary/50 pl-10 pr-4 text-sm outline-none focus:border-primary focus:bg-background transition-colors"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "submit",
							className: "sr-only",
							children: "Search"
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "block md:hidden p-2 text-muted-foreground hover:text-primary transition-colors",
							onClick: () => {
								const q = prompt("Enter search query:");
								if (q) navigate({
									to: "/shop",
									search: (prev) => ({
										...prev,
										q
									})
								});
							},
							"aria-label": "Search",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/wishlist",
							className: "relative p-2 text-muted-foreground hover:text-primary transition-colors",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: "h-5 w-5" }), wishlistItems.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-accent text-[9px] font-bold text-accent-foreground",
								children: wishlistItems.length
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							ref: dropdownRef,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setIsCartOpen(!isCartOpen),
								className: "relative p-2 text-muted-foreground hover:text-primary transition-colors cursor-pointer",
								"aria-label": "Open cart dropdown",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-5 w-5" }), itemCount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "absolute right-0.5 top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-primary text-[9px] font-bold text-primary-foreground animate-in zoom-in duration-300",
									children: itemCount
								})]
							}), isCartOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "absolute right-0 mt-3 w-80 rounded-xl border border-border bg-card p-4 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-3 duration-200",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
										className: "text-sm font-bold text-foreground",
										children: [
											"Shopping Cart (",
											itemCount,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => setIsCartOpen(false),
										className: "p-1 rounded hover:bg-secondary text-muted-foreground hover:text-foreground cursor-pointer",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" })
									})]
								}), cartItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex flex-col items-center justify-center py-8 text-center",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-8 w-8 text-muted-foreground/60 stroke-1 mb-2" }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
											className: "text-xs font-semibold text-muted-foreground",
											children: "Your cart is empty"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/shop",
											onClick: () => setIsCartOpen(false),
											className: "mt-3 text-[11px] font-bold text-primary hover:underline",
											children: "Shop Components"
										})
									]
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 max-h-56 overflow-y-auto space-y-3 pr-1",
									children: cartItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-3 items-start group",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
												src: item.product.image,
												alt: item.product.name,
												className: "h-12 w-12 rounded object-cover border border-border"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1 min-w-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														to: "/shop/$sku",
														params: { sku: item.product.sku },
														onClick: () => setIsCartOpen(false),
														className: "block text-xs font-bold text-foreground hover:text-primary truncate",
														children: item.product.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-[10px] text-muted-foreground mt-0.5",
														children: [
															item.quantity,
															" x ",
															formatPrice(item.product.price)
														]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
														className: "mt-1.5 inline-flex items-center rounded-md border border-border bg-secondary/30 overflow-hidden",
														children: [
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => updateQuantity(item.product.sku, item.quantity - 1),
																className: "px-1.5 py-0.5 text-muted-foreground hover:text-foreground transition-colors",
																"aria-label": "Decrease item quantity",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
																className: "min-w-6 text-center text-[10px] font-bold text-foreground",
																children: item.quantity
															}),
															/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
																type: "button",
																onClick: () => updateQuantity(item.product.sku, item.quantity + 1),
																className: "px-1.5 py-0.5 text-muted-foreground hover:text-foreground transition-colors",
																"aria-label": "Increase item quantity",
																children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
															})
														]
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: () => removeFromCart(item.product.sku),
												className: "text-muted-foreground hover:text-destructive p-1 rounded hover:bg-secondary cursor-pointer",
												"aria-label": "Remove item",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash, { className: "h-3.5 w-3.5" })
											})
										]
									}, item.product.sku))
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-4 pt-3 border-t border-border space-y-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-xs font-bold text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal:" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPrice(subtotal) })]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "grid grid-cols-2 gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
											to: "/cart",
											onClick: () => setIsCartOpen(false),
											className: "flex items-center justify-center rounded-lg border border-input py-2 text-xs font-bold hover:bg-secondary cursor-pointer transition-colors",
											children: "View Cart"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
											onClick: () => {
												setIsCartOpen(false);
												toast.success("Proceeding to Checkout!");
												navigate({ to: "/cart" });
											},
											className: "flex items-center justify-center gap-1 rounded-lg bg-primary py-2 text-xs font-bold text-primary-foreground hover:bg-primary/95 cursor-pointer transition-colors shadow-sm",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Checkout" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-3 w-3" })]
										})]
									})]
								})] })]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "relative",
							ref: accountRef,
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								onClick: () => setIsAccountOpen((prev) => !prev),
								className: "flex items-center gap-1.5 rounded-full border border-border p-1 pr-2.5 hover:bg-secondary/40 transition-colors",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "flex h-7 w-7 items-center justify-center rounded-full bg-secondary",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(User, { className: "h-4 w-4 text-foreground" })
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: "hidden text-xs font-semibold text-foreground lg:block",
									children: isAuthenticated ? user?.name?.split(" ")[0] || "Account" : "Login"
								})]
							}), isAccountOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "absolute right-0 mt-3 w-44 rounded-xl border border-border bg-card p-2 shadow-xl ring-1 ring-black/5 animate-in fade-in slide-in-from-top-3 duration-200",
								children: isAuthenticated ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/profile",
										onClick: () => setIsAccountOpen(false),
										className: "block rounded-md px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary",
										children: "Profile"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/orders",
										onClick: () => setIsAccountOpen(false),
										className: "block rounded-md px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary",
										children: "Orders"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setIsAccountOpen(false);
											logout();
											navigate({ to: "/login" });
										},
										className: "block w-full rounded-md px-3 py-2 text-left text-xs font-semibold text-destructive hover:bg-secondary",
										children: "Logout"
									})
								] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/login",
										onClick: () => setIsAccountOpen(false),
										className: "block rounded-md px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary",
										children: "Login"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/register",
										onClick: () => setIsAccountOpen(false),
										className: "block rounded-md px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary",
										children: "Register"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/forgot-password",
										onClick: () => setIsAccountOpen(false),
										className: "block rounded-md px-3 py-2 text-xs font-semibold text-foreground hover:bg-secondary",
										children: "Forgot Password"
									})
								] })
							})]
						})
					]
				})
			]
		})
	});
}
function apiAsset(url) {
	if (!url || /^https?:\/\//.test(url)) return url;
	return `${"http://localhost:4000".replace(/\/$/, "") ?? ""}${url}`;
}
function normalizeProduct(product) {
	return {
		...product,
		price: Number(product.price),
		compareAtPrice: product.compareAtPrice == null ? void 0 : Number(product.compareAtPrice),
		gstPercentage: Number(product.gstPercentage),
		images: (product.images ?? []).map((image) => ({
			...image,
			media: {
				...image.media,
				url: apiAsset(image.media.url) ?? ""
			}
		}))
	};
}
async function getProducts(filters) {
	const params = new URLSearchParams();
	if (filters?.q) params.set("q", filters.q);
	let result = (await apiFetch(`/api/products${params.size ? `?${params}` : ""}`)).map(normalizeProduct);
	if (filters?.category) result = result.filter((product) => product.category?.name === filters.category);
	if (filters?.brand) result = result.filter((product) => filters.brand.split(",").includes(product.brand ?? ""));
	if (filters?.sortBy === "price-asc") result = [...result].sort((a, b) => a.price - b.price);
	if (filters?.sortBy === "price-desc") result = [...result].sort((a, b) => b.price - a.price);
	return result;
}
async function getProductBySku(sku) {
	return (await getProducts({ q: sku })).find((product) => product.sku === sku);
}
async function getCategories() {
	return (await apiFetch("/api/categories")).map((category) => ({
		...category,
		image: category.image ? {
			...category.image,
			url: apiAsset(category.image.url) ?? ""
		} : void 0
	}));
}
async function getBlocks() {
	return apiFetch("/api/homepage");
}
async function getHeroBanners() {
	const block = (await getBlocks()).find((item) => item.key === "hero");
	if (!Array.isArray(block?.content)) return [];
	return block.content.flatMap((item) => {
		if (!item || typeof item !== "object") return [];
		const value = item;
		return value.image ? [{
			image: apiAsset(value.image) ?? "",
			alt: value.alt ?? value.title ?? "Hero banner"
		}] : [];
	});
}
async function getServices() {
	const block = (await getBlocks()).find((item) => item.key === "services");
	return Array.isArray(block?.content) ? block.content.filter((item) => Boolean(item && typeof item === "object" && "name" in item && "emoji" in item)) : [];
}
async function getNavLinks() {
	const block = (await getBlocks()).find((item) => item.key === "navigation");
	return Array.isArray(block?.content) ? block.content.filter((item) => typeof item === "string") : [];
}
function useProducts(filters) {
	const [state, setState] = (0, import_react.useState)({
		data: null,
		loading: true,
		error: null
	});
	(0, import_react.useEffect)(() => {
		let active = true;
		setState((prev) => ({
			...prev,
			loading: true
		}));
		getProducts(filters).then((products) => {
			if (!active) return;
			setState({
				data: products,
				loading: false,
				error: null
			});
		}).catch((err) => {
			if (!active) return;
			setState({
				data: null,
				loading: false,
				error: err
			});
		});
		return () => {
			active = false;
		};
	}, [JSON.stringify(filters)]);
	return state;
}
function useProductDetails(sku) {
	const [state, setState] = (0, import_react.useState)({
		data: null,
		loading: true,
		error: null
	});
	(0, import_react.useEffect)(() => {
		let active = true;
		setState((prev) => ({
			...prev,
			loading: true
		}));
		getProductBySku(sku).then((product) => {
			if (!active) return;
			setState({
				data: product,
				loading: false,
				error: null
			});
		}).catch((err) => {
			if (!active) return;
			setState({
				data: null,
				loading: false,
				error: err
			});
		});
		return () => {
			active = false;
		};
	}, [sku]);
	return state;
}
function useCategories() {
	const [state, setState] = (0, import_react.useState)({
		data: null,
		loading: true,
		error: null
	});
	(0, import_react.useEffect)(() => {
		let active = true;
		getCategories().then((cats) => {
			if (!active) return;
			setState({
				data: cats,
				loading: false,
				error: null
			});
		}).catch((err) => {
			if (!active) return;
			setState({
				data: null,
				loading: false,
				error: err
			});
		});
		return () => {
			active = false;
		};
	}, []);
	return state;
}
function useHeroBanners() {
	const [state, setState] = (0, import_react.useState)({
		data: null,
		loading: true,
		error: null
	});
	(0, import_react.useEffect)(() => {
		let active = true;
		getHeroBanners().then((banners) => {
			if (!active) return;
			setState({
				data: banners,
				loading: false,
				error: null
			});
		}).catch((err) => {
			if (!active) return;
			setState({
				data: null,
				loading: false,
				error: err
			});
		});
		return () => {
			active = false;
		};
	}, []);
	return state;
}
function useStoreMetadata() {
	const [state, setState] = (0, import_react.useState)({
		data: null,
		loading: true,
		error: null
	});
	(0, import_react.useEffect)(() => {
		let active = true;
		Promise.all([getServices(), getNavLinks()]).then(([services, navLinks]) => {
			if (!active) return;
			setState({
				data: {
					services,
					navLinks
				},
				loading: false,
				error: null
			});
		}).catch((err) => {
			if (!active) return;
			setState({
				data: null,
				loading: false,
				error: err
			});
		});
		return () => {
			active = false;
		};
	}, []);
	return state;
}
function Skeleton({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("animate-pulse rounded-md bg-primary/10", className),
		...props
	});
}
var DropdownMenu = Root2;
var DropdownMenuTrigger = Trigger;
var DropdownMenuSubTrigger = import_react.forwardRef(({ className, inset, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SubTrigger2, {
	ref,
	className: cn("flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none focus:bg-accent data-[state=open]:bg-accent [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0", inset && "pl-8", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronRight, { className: "ml-auto" })]
}));
DropdownMenuSubTrigger.displayName = SubTrigger2.displayName;
var DropdownMenuSubContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SubContent2, {
	ref,
	className: cn("z-50 min-w-[8rem] overflow-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-lg data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}));
DropdownMenuSubContent.displayName = SubContent2.displayName;
var DropdownMenuContent = import_react.forwardRef(({ className, sideOffset = 4, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Portal2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content2, {
	ref,
	sideOffset,
	className: cn("z-50 max-h-[var(--radix-dropdown-menu-content-available-height)] min-w-[8rem] overflow-y-auto overflow-x-hidden rounded-md border bg-popover p-1 text-popover-foreground shadow-md", "data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=left]:slide-in-from-right-2 data-[side=right]:slide-in-from-left-2 data-[side=top]:slide-in-from-bottom-2 origin-(--radix-dropdown-menu-content-transform-origin)", className),
	...props
}) }));
DropdownMenuContent.displayName = Content2.displayName;
var DropdownMenuItem = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Item2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50 [&>svg]:size-4 [&>svg]:shrink-0", inset && "pl-8", className),
	...props
}));
DropdownMenuItem.displayName = Item2.displayName;
var DropdownMenuCheckboxItem = import_react.forwardRef(({ className, children, checked, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CheckboxItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	checked,
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }) })
	}), children]
}));
DropdownMenuCheckboxItem.displayName = CheckboxItem2.displayName;
var DropdownMenuRadioItem = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(RadioItem2, {
	ref,
	className: cn("relative flex cursor-default select-none items-center rounded-sm py-1.5 pl-8 pr-2 text-sm outline-none transition-colors focus:bg-accent focus:text-accent-foreground data-[disabled]:pointer-events-none data-[disabled]:opacity-50", className),
	...props,
	children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: "absolute left-2 flex h-3.5 w-3.5 items-center justify-center",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ItemIndicator2, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Circle, { className: "h-2 w-2 fill-current" }) })
	}), children]
}));
DropdownMenuRadioItem.displayName = RadioItem2.displayName;
var DropdownMenuLabel = import_react.forwardRef(({ className, inset, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label2, {
	ref,
	className: cn("px-2 py-1.5 text-sm font-semibold", inset && "pl-8", className),
	...props
}));
DropdownMenuLabel.displayName = Label2.displayName;
var DropdownMenuSeparator = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Separator2, {
	ref,
	className: cn("-mx-1 my-1 h-px bg-muted", className),
	...props
}));
DropdownMenuSeparator.displayName = Separator2.displayName;
var DropdownMenuShortcut = ({ className, ...props }) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
		className: cn("ml-auto text-xs tracking-widest opacity-60", className),
		...props
	});
};
DropdownMenuShortcut.displayName = "DropdownMenuShortcut";
var navLinkToRoute = {
	Home: "/",
	Shop: "/shop",
	Forum: "/forum",
	"Bulk Enquiry": "/bulk-enquiry",
	"New Arrivals": "/new-arrivals",
	"ATL Kits Enquiry": "/atl-kits-enquiry",
	Blogs: "/blogs",
	"BOM Tool": "/bom-tool",
	Careers: "/careers"
};
function NavBar() {
	const { data, loading: metadataLoading } = useStoreMetadata();
	const { data: categories, loading: categoriesLoading } = useCategories();
	if (metadataLoading || !data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "sticky top-16 z-30 border-b border-border bg-background/95 backdrop-blur-md",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl items-center gap-4 overflow-x-auto px-4 py-3 h-[53px]",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-8 w-32 shrink-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center gap-4",
				children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-16 shrink-0" }, i))
			})]
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
		className: "border-b border-border bg-background",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto flex max-w-7xl items-center gap-2 overflow-x-auto px-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DropdownMenu, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuTrigger, {
				asChild: true,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					className: "flex shrink-0 items-center gap-3 bg-secondary px-4 py-3.5 text-sm font-semibold text-secondary-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, { className: "h-4 w-4" }),
						"All Categories",
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-4 w-4" })
					]
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuContent, {
				className: "w-56",
				children: categoriesLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "p-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-full mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-full mb-2" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-full" })
					]
				}) : categories?.map((category) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DropdownMenuItem, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						search: { category: category.name },
						className: "w-full cursor-pointer",
						children: category.name
					})
				}, category.name))
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-1",
				children: [data.navLinks.map((link) => {
					const to = navLinkToRoute[link];
					const isHome = link === "Home";
					if (!to) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						onClick: () => {
							toast.info(`${link} page is coming soon.`);
						},
						className: "whitespace-nowrap px-3 py-3.5 text-sm font-medium transition-colors text-foreground hover:text-primary flex items-center",
						children: [link, (link === "Shop" || link === "Blogs") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "ml-1 inline h-3.5 w-3.5" })]
					}, link);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to,
						className: clsx("whitespace-nowrap px-3 py-3.5 text-sm font-medium transition-colors flex items-center", isHome ? "text-accent" : "text-foreground hover:text-primary"),
						children: [link, (link === "Shop" || link === "Blogs") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "ml-1 inline h-3.5 w-3.5" })]
					}, link);
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/sell-on-autoforge",
					className: "ml-1 whitespace-nowrap rounded-md bg-accent px-3 py-2 text-xs font-bold text-accent-foreground shadow-sm transition-colors hover:bg-accent/90",
					children: "SELL ON AUTOFORGE"
				})]
			})]
		})
	});
}
var footerLinkToRoute = {
	"About Us": "/about",
	"Forum": "/forum",
	"Contact Us": "/contact",
	"My Account": "/profile",
	"Returns & Refunds": "/returns",
	"Shipping Policy": "/shipping",
	"FAQ": "/faq",
	"Privacy Policy": "/privacy",
	"Terms of Service": "/terms",
	"Sell on AutoForge": "/sell-on-autoforge"
};
var columns = [
	{
		title: "Company",
		links: [
			"About Us",
			"Careers",
			"Blogs",
			"Forum",
			"Sell on AutoForge",
			"Contact Us"
		]
	},
	{
		title: "Customer Service",
		links: [
			"My Account",
			"Track Order",
			"Returns & Refunds",
			"Shipping Policy",
			"Bulk Enquiry",
			"FAQ"
		]
	},
	{
		title: "Top Categories",
		links: [
			"Development Boards",
			"Sensors",
			"Drone Parts",
			"3D Printers and Parts",
			"IoT and Wireless Modules",
			"DIY and Maker Kits"
		]
	}
];
function StoreFooter() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("footer", {
		className: "mt-8 border-t border-border bg-secondary",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
					to: "/",
					className: "flex items-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "flex h-10 w-10 items-center justify-center rounded-full bg-accent",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cog, { className: "h-6 w-6 text-accent-foreground" })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "leading-tight",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-xl font-extrabold tracking-tight text-primary",
							children: "AUTOFORGE"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "block text-[10px] font-semibold uppercase tracking-[0.3em] text-accent",
							children: "Robotics"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "Your Ideas, Our Parts. India's one-stop shop for robotics, electronics, drones, 3D printing and maker supplies."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-2 text-sm text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MapPin, { className: "h-4 w-4 shrink-0" }), " Pune, Maharashtra, India"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Phone, { className: "h-4 w-4 shrink-0" }), " 1800 266 6123"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "flex items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Mail, { className: "h-4 w-4 shrink-0" }), " support@autoforgerobotics.in"]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 flex items-center gap-3 text-muted-foreground",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Facebook",
							onClick: () => toast.info("Social links coming soon."),
							className: "hover:text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Facebook, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "X",
							onClick: () => toast.info("Social links coming soon."),
							className: "hover:text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Twitter, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "LinkedIn",
							onClick: () => toast.info("Social links coming soon."),
							className: "hover:text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Linkedin, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "Instagram",
							onClick: () => toast.info("Social links coming soon."),
							className: "hover:text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Instagram, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							"aria-label": "YouTube",
							onClick: () => toast.info("Social links coming soon."),
							className: "hover:text-primary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Youtube, { className: "h-4 w-4" })
						})
					]
				})
			] }), columns.map((col) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
				className: "text-sm font-bold uppercase tracking-wide text-foreground",
				children: col.title
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "mt-4 space-y-2.5",
				children: col.links.map((link) => {
					if (col.title === "Top Categories") return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/shop",
						search: { category: link },
						className: "text-sm text-muted-foreground hover:text-primary transition-colors",
						children: link
					}) }, link);
					const to = footerLinkToRoute[link];
					if (!to) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => toast.info(`${link} page is coming soon.`),
						className: "text-sm text-muted-foreground hover:text-primary",
						children: link
					}) }, link);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to,
						className: "text-sm text-muted-foreground hover:text-primary transition-colors",
						children: link
					}) }, link);
				})
			})] }, col.title))]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "border-t border-border",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "© 2026 AutoForge Robotics. All rights reserved." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/privacy",
						className: "hover:text-primary transition-colors",
						children: "Privacy Policy"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/terms",
						className: "hover:text-primary transition-colors",
						children: "Terms of Service"
					})]
				})]
			})
		})]
	});
}
//#endregion
export { StoreHeader as a, useCategories as c, useProducts as d, useStoreMetadata as f, StoreFooter as i, useHeroBanners as l, NavBar as n, TopBar as o, useWishlist as p, Skeleton as r, formatPrice as s, AnnouncementBar as t, useProductDetails as u };
