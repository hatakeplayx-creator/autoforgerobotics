import { n as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Route } from "./_sku-D4tuhC3C.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { t as useCart } from "./_ssr/useCart-Bd4ZcYPt.mjs";
import { t as cva } from "./_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./_ssr/utils-C_uf36nf.mjs";
import { C as Plus, D as MessageSquare, E as Minus, J as CircleCheck, L as Heart, c as TriangleAlert, g as ShoppingCart, m as Star } from "./_libs/lucide-react.mjs";
import { a as StoreHeader, d as useProducts, i as StoreFooter, n as NavBar, o as TopBar, p as useWishlist, r as Skeleton, s as formatPrice, t as AnnouncementBar, u as useProductDetails } from "./_ssr/StoreFooter-Z2RR4EsA.mjs";
import { t as Toaster$1 } from "./_ssr/sonner-DoFKumIW.mjs";
import { a as BreadcrumbPage, i as BreadcrumbList, n as BreadcrumbItem, o as BreadcrumbSeparator, r as BreadcrumbLink, t as Breadcrumb } from "./_ssr/breadcrumb-BG427xXB.mjs";
import { t as Button } from "./_ssr/button-Bq5vK6RO.mjs";
import { t as ProductCard } from "./_ssr/ProductCard-CaTb6Sc_.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_sku-B-RdLrZw.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-md border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2", {
	variants: { variant: {
		default: "border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80",
		secondary: "border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80",
		destructive: "border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80",
		outline: "text-foreground"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
var DEFAULT_REVIEWS = [{
	id: "r1",
	author: "Rohan Sharma",
	rating: 5,
	date: "July 2, 2026",
	comment: "Excellent build quality. Highly reliable for industrial automation prototype projects. The delivery was fast too!",
	verified: true
}, {
	id: "r2",
	author: "Ananya Iyer",
	rating: 4,
	date: "June 18, 2026",
	comment: "Works perfectly as described. Pinout documentation is neat and easy to follow. Deducted one star because the box was slightly dented.",
	verified: true
}];
var RECENTLY_VIEWED_KEY = "recentlyViewedSkus";
function getProductBrand(product) {
	if (product.brand) return product.brand;
	if (product.name.startsWith("AF")) return "AF";
	if (product.name.toLowerCase().includes("forge")) return "Forge";
	return "AutoForge";
}
function getSpecifications(product) {
	const name = product.name.toLowerCase();
	if (name.includes("printer")) return {
		"Printing Technology": "FDM (Fused Deposition Modeling)",
		"Build Volume": "256 x 256 x 256 mm",
		"Max Hotend Temperature": "300 C",
		"Max Bed Temperature": "100 C",
		"Compatible Filaments": "PLA, PETG, TPU, ABS, Carbon Fiber",
		"Chamber Type": "Fully Enclosed",
		"Levelling System": "Auto Bed Levelling (Dual Sensor)"
	};
	if (name.includes("microcontroller") || name.includes("fpga") || name.includes("sbc") || name.includes("compatible") || name.includes("board")) return {
		"Core Processor": name.includes("rp2350") ? "Dual-core ARM Cortex-M33" : "High Performance RISC-V / ARM",
		"Operating Voltage": "3.3V DC (USB 5V Input)",
		"GPIO Pin Count": name.includes("carrier") ? "40 Pins" : "26-30 Pins",
		"Clock Speed": name.includes("carrier") ? "2.4 GHz" : "133 MHz-150 MHz",
		"On-Board Memory": name.includes("fpga") ? "16MB Flash, 256KB SRAM" : "8MB Flash, 520KB SRAM",
		"Interface Types": "I2C, SPI, UART, PWM, ADC",
		"Form Factor": "Compact Breadboard Friendly"
	};
	if (name.includes("drone") || name.includes("motor")) return {
		"Motor KV Rating": name.includes("280kv") ? "280 KV" : "120 KV",
		"Max Thrust": "12.5 kg per motor",
		"Recommended Propeller": "ForgeProp 22 x 7.0",
		"Stator Size": "8120 Stator core",
		"Recommended ESC": "80A-100A High Frequency ESC",
		"Operating Voltage Range": "6S - 12S LiPo Battery Pack",
		"Waterproof Level": "IPX7 Dust and Splash Protected"
	};
	if (name.includes("sensor")) return {
		"Sensor IC": "High Precision Ambient Light Sensor",
		"Communication Bus": "I2C Interface (Address 0x23)",
		"Spectral Response": "Close to human eye response",
		"Illuminance Range": "1 lx to 65535 lx",
		"Operating Voltage": "2.4V - 3.6V DC",
		"Pin Configuration": "VCC, GND, SCL, SDA, INT",
		"Operating Temperature": "-40 C to +85 C"
	};
	return {
		"Model Number": `AF-${product.sku}`,
		"Voltage Specification": "5V DC Operating",
		Certification: "CE, RoHS Compliant",
		"Material Class": "FR4 Double Sided PCB",
		Dimensions: "58 mm x 24 mm x 8 mm",
		Weight: "12.5 grams",
		"Warranty Period": "1 Year Limited Manufacturer Warranty"
	};
}
function ProductDetailsPage() {
	const { sku } = Route.useParams();
	const navigate = useNavigate();
	const { addToCart } = useCart();
	const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
	const { data: product, loading: productLoading } = useProductDetails(sku);
	const { data: allProducts, loading: productsLoading } = useProducts();
	const [quantity, setQuantity] = (0, import_react.useState)(1);
	const [activeImageIndex, setActiveImageIndex] = (0, import_react.useState)(0);
	const [zoomStyle, setZoomStyle] = (0, import_react.useState)({
		transform: "scale(1)",
		transformOrigin: "center"
	});
	const [reviews, setReviews] = (0, import_react.useState)(DEFAULT_REVIEWS);
	const [newReviewAuthor, setNewReviewAuthor] = (0, import_react.useState)("");
	const [newReviewRating, setNewReviewRating] = (0, import_react.useState)(5);
	const [newReviewComment, setNewReviewComment] = (0, import_react.useState)("");
	const [recentlyViewed, setRecentlyViewed] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!product || !allProducts) return;
		const saved = localStorage.getItem(RECENTLY_VIEWED_KEY);
		const parsed = saved ? JSON.parse(saved) : [];
		const currentSkus = [product.sku, ...parsed.filter((savedSku) => savedSku !== product.sku)].slice(0, 5);
		localStorage.setItem(RECENTLY_VIEWED_KEY, JSON.stringify(currentSkus));
		const resolvedProducts = currentSkus.map((savedSku) => allProducts.find((candidate) => candidate.sku === savedSku)).filter((candidate) => !!candidate && candidate.sku !== product.sku);
		setRecentlyViewed(resolvedProducts);
		setQuantity(1);
		setActiveImageIndex(0);
		setZoomStyle({
			transform: "scale(1)",
			transformOrigin: "center"
		});
	}, [product, allProducts]);
	const relatedProducts = (0, import_react.useMemo)(() => {
		if (!product || !allProducts) return [];
		return allProducts.filter((candidate) => {
			return candidate.sku !== product.sku && getProductBrand(candidate) === getProductBrand(product);
		}).slice(0, 4);
	}, [allProducts, product]);
	if (productLoading || productsLoading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnnouncementBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("main", {
				className: "mx-auto max-w-7xl px-4 py-8 space-y-6",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-12" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-16" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-4" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-32" })
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-8 md:grid-cols-2 bg-card border border-border rounded-xl p-5 md:p-8 shadow-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "aspect-square w-full rounded-lg" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-3",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-20 rounded" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-20 rounded" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-20 w-20 rounded" })
							]
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-4 w-24" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-5/6" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-6 w-1/3" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-24 w-full" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-12 w-full" })
						]
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreFooter, {})
		]
	});
	if (!product || !allProducts) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AnnouncementBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TopBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreHeader, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(NavBar, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto max-w-7xl px-4 py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-card p-8 text-center",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Product not found."
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						onClick: () => navigate({ to: "/shop" }),
						children: "Back to Shop"
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreFooter, {})
		]
	});
	const brandName = getProductBrand(product);
	const specifications = getSpecifications(product);
	const productImage = product.images[0]?.media?.url || "/assets/cat-dev-boards.jpg";
	const galleryImages = [
		{
			url: productImage,
			label: "Front View",
			style: {}
		},
		{
			url: productImage,
			label: "Rear View",
			style: { transform: "scaleX(-1)" }
		},
		{
			url: productImage,
			label: "Detail View",
			style: { transform: "rotate(90deg) scale(1.1)" }
		}
	];
	const handleMouseMove = (e) => {
		const { left, top, width, height } = e.currentTarget.getBoundingClientRect();
		const x = (e.clientX - left) / width * 100;
		const y = (e.clientY - top) / height * 100;
		setZoomStyle({
			transform: "scale(2.2)",
			transformOrigin: `${x}% ${y}%`
		});
	};
	const handleMouseLeave = () => {
		setZoomStyle({
			transform: "scale(1)",
			transformOrigin: "center"
		});
	};
	const cartCompatibleProduct = {
		...product,
		tag: brandName,
		image: productImage,
		reviews: 0,
		outOfStock: product.stockQuantity <= 0
	};
	const handleAddToCart = () => {
		addToCart(cartCompatibleProduct, quantity);
		toast.success(`Added ${quantity}x "${product.name}" to your cart.`);
	};
	const handleBuyNow = () => {
		addToCart(cartCompatibleProduct, quantity);
		toast.success(`Proceeding to checkout with ${quantity}x "${product.name}".`);
		navigate({ to: "/cart" });
	};
	const handleSubmitReview = (e) => {
		e.preventDefault();
		if (!newReviewAuthor.trim() || !newReviewComment.trim()) {
			toast.error("Please fill in your name and comment.");
			return;
		}
		const review = {
			id: Math.random().toString(36).slice(2),
			author: newReviewAuthor.trim(),
			rating: newReviewRating,
			date: "Today",
			comment: newReviewComment.trim(),
			verified: false
		};
		setReviews((prev) => [review, ...prev]);
		setNewReviewAuthor("");
		setNewReviewRating(5);
		setNewReviewComment("");
		toast.success("Thank you! Your review has been posted.");
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
				position: "top-right",
				closeButton: true,
				richColors: true
			}),
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbLink, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/shop",
									children: "Shop"
								})
							}) }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbSeparator, {}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbPage, {
								className: "truncate max-w-[200px]",
								children: product.name
							}) })
						] }) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-8 md:grid-cols-2 bg-card border border-border rounded-xl p-5 md:p-8 shadow-sm",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "relative aspect-square w-full overflow-hidden rounded-lg bg-secondary border border-border cursor-zoom-in",
								onMouseMove: handleMouseMove,
								onMouseLeave: handleMouseLeave,
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
									src: galleryImages[activeImageIndex].url,
									alt: product.name,
									className: "h-full w-full object-cover transition-transform duration-75 pointer-events-none",
									style: {
										...zoomStyle,
										...galleryImages[activeImageIndex].style
									}
								}), product.featured ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									className: "absolute right-4 top-4 z-10 bg-accent text-accent-foreground",
									children: "Featured"
								}) : null]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "flex items-center gap-3",
								children: galleryImages.map((img, index) => {
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										type: "button",
										onClick: () => {
											setActiveImageIndex(index);
											setZoomStyle({
												transform: "scale(1)",
												transformOrigin: "center"
											});
										},
										className: `relative w-20 h-20 aspect-square overflow-hidden rounded-md border-2 bg-secondary transition-all cursor-pointer ${activeImageIndex === index ? "border-primary shadow-md scale-105" : "border-border hover:border-muted-foreground/60"}`,
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
											src: img.url,
											alt: img.label,
											className: "w-full h-full object-cover",
											style: img.style
										})
									}, img.label);
								})
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-col",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
									variant: "secondary",
									className: "w-fit text-xs font-semibold uppercase tracking-wider mb-1",
									children: brandName
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
									className: "text-2xl font-extrabold text-foreground tracking-tight leading-snug md:text-3xl",
									children: product.name
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-3 flex flex-wrap items-center gap-4 text-xs",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground",
											children: ["SKU: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: product.sku
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-border",
											children: "|"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
											className: "text-muted-foreground",
											children: ["Brand: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
												className: "text-foreground",
												children: brandName
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-border",
											children: "|"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center gap-1 text-accent",
											children: [Array.from({ length: 5 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3.5 w-3.5 fill-current" }, index)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
												className: "text-muted-foreground ml-1",
												children: [
													"(",
													reviews.length,
													" Customer Reviews)"
												]
											})]
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-border my-5" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mb-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-3xl font-black text-foreground",
										children: formatPrice(product.price)
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: "text-xs text-muted-foreground ml-2",
										children: "(Inclusive of GST)"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "flex items-center gap-2 mb-6",
									children: product.stockQuantity <= 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5 rounded-full bg-destructive/10 border border-destructive/20 px-3 py-1 text-xs font-semibold text-destructive",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-4 w-4" }), "Out of Stock"]
									}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
										className: "flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/20 px-3 py-1 text-xs font-semibold text-emerald-600",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CircleCheck, { className: "h-4 w-4" }),
											"In Stock - Ready to Ship (",
											product.stockQuantity,
											" available)"
										]
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-sm leading-relaxed text-muted-foreground mb-6",
									children: "High-performance maker component designed specifically for industrial, educational, and developer setups. Engineered for optimal compatibility and rigorous hardware specifications."
								}),
								product.stockQuantity > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "space-y-4",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center gap-3",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "text-xs font-bold uppercase tracking-wider text-muted-foreground",
											children: "Quantity:"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "flex items-center rounded-lg border border-border bg-secondary/30 h-10 overflow-hidden",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setQuantity((prev) => Math.max(1, prev - 1)),
													className: "p-2 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
													"aria-label": "Decrease quantity",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3.5 w-3.5" })
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "px-4 text-sm font-semibold select-none min-w-8 text-center",
													children: quantity
												}),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setQuantity((prev) => prev + 1),
													className: "p-2 h-full flex items-center justify-center text-muted-foreground hover:text-foreground transition-colors",
													"aria-label": "Increase quantity",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3.5 w-3.5" })
												})
											]
										})]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex flex-col gap-3 sm:flex-row pt-2",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
												onClick: handleAddToCart,
												variant: "secondary",
												className: "flex-1 h-12 border border-border",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-4 w-4" }), "Add to Cart"]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												onClick: handleBuyNow,
												className: "flex-1 h-12",
												children: "Buy Now"
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
												variant: "secondary",
												size: "icon",
												onClick: () => {
													if (isInWishlist(product.sku)) removeFromWishlist(product.sku);
													else addToWishlist(cartCompatibleProduct);
												},
												className: "h-12 w-12",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-5 w-5 ${isInWishlist(product.sku) ? "fill-accent text-accent" : ""}` })
											})
										]
									})]
								}) : null
							]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 grid gap-8 lg:grid-cols-[1fr_360px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-8 bg-card border border-border rounded-xl p-5 md:p-8 shadow-sm",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold text-foreground border-b border-border pb-3 mb-4",
								children: "Product Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "text-sm text-muted-foreground space-y-3 leading-relaxed",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "This AutoForge component is designed as a dependable hardware platform for innovators and makers. It focuses on stability, compatibility, and practical deployment in real projects." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Refer to the technical specifications below before integration to verify voltage tolerance, dimensions, and interface compatibility with your setup." })]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold text-foreground border-b border-border pb-3 mb-4",
								children: "Technical Specifications"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "border border-border rounded-lg overflow-hidden",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("table", {
									className: "w-full text-left border-collapse text-xs",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: Object.entries(specifications).map(([key, value], index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
										className: `${index % 2 === 0 ? "bg-secondary/20" : "bg-transparent"} border-b border-border last:border-b-0`,
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 font-semibold text-foreground w-1/3 border-r border-border",
											children: key
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
											className: "p-3 text-muted-foreground",
											children: value
										})]
									}, key)) })
								})
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-8 bg-card border border-border rounded-xl p-5 md:p-8 shadow-sm h-fit",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
									className: "text-lg font-bold text-foreground border-b border-border pb-3 mb-4 flex items-center gap-2",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquare, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [
										"Customer Reviews (",
										reviews.length,
										")"
									] })]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
									onSubmit: handleSubmitReview,
									className: "mb-6 bg-secondary/30 border border-border rounded-lg p-4 space-y-3",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
											className: "text-xs font-bold uppercase tracking-wider text-foreground",
											children: "Write a Review"
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-[10px] text-muted-foreground font-semibold mb-1",
											children: "Your Name"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
											type: "text",
											required: true,
											value: newReviewAuthor,
											onChange: (e) => setNewReviewAuthor(e.target.value),
											placeholder: "e.g. Rahul Patel",
											className: "w-full h-8 text-xs border border-border bg-card rounded px-2.5 outline-none focus:border-primary transition-colors"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-[10px] text-muted-foreground font-semibold mb-1",
											children: "Rating"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "flex items-center gap-1",
											children: Array.from({ length: 5 }).map((_, index) => {
												const ratingValue = index + 1;
												return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "button",
													onClick: () => setNewReviewRating(ratingValue),
													className: `transition-colors ${newReviewRating >= ratingValue ? "text-accent" : "text-border"}`,
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-current" })
												}, ratingValue);
											})
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
											className: "block text-[10px] text-muted-foreground font-semibold mb-1",
											children: "Comment"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
											required: true,
											rows: 3,
											value: newReviewComment,
											onChange: (e) => setNewReviewComment(e.target.value),
											placeholder: "Share your experience with this component...",
											className: "w-full text-xs border border-border bg-card rounded p-2.5 outline-none focus:border-primary resize-none transition-colors"
										})] }),
										/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											size: "sm",
											className: "w-full",
											children: "Submit Review"
										})
									]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "space-y-4",
									children: reviews.map((review) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "border-b border-border pb-4 last:border-0 last:pb-0",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between gap-2",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h4", {
													className: "text-xs font-bold text-foreground flex items-center gap-1.5",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: review.author }), review.verified ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-[9px] bg-emerald-500/10 text-emerald-600 px-1 rounded font-semibold",
														children: "Verified"
													}) : null]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "text-[10px] text-muted-foreground",
													children: review.date
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
												className: "flex items-center gap-0.5 text-accent mt-1",
												children: Array.from({ length: 5 }).map((_, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-3 w-3 ${index < review.rating ? "fill-current" : "text-border"}` }, index))
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
												className: "mt-2 text-xs text-muted-foreground leading-relaxed",
												children: review.comment
											})
										]
									}, review.id))
								})
							] })
						})]
					}),
					relatedProducts.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6 flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-bold text-foreground md:text-2xl",
								children: "Related Products"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4",
							children: relatedProducts.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: item }, item.sku))
						})]
					}) : null,
					recentlyViewed.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
						className: "mt-12",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-6 flex items-center gap-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-xl font-bold text-foreground md:text-2xl",
								children: "Recently Viewed Items"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-px flex-1 bg-border" })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5",
							children: recentlyViewed.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product: item }, item.sku))
						})]
					}) : null
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreFooter, {})
		]
	});
}
//#endregion
export { ProductDetailsPage as component };
