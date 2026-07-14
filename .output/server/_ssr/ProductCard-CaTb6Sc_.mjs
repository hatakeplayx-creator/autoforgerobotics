import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as useCart } from "./useCart-Bd4ZcYPt.mjs";
import { L as Heart, g as ShoppingCart, m as Star } from "../_libs/lucide-react.mjs";
import { p as useWishlist, s as formatPrice } from "./StoreFooter-Z2RR4EsA.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ProductCard-CaTb6Sc_.js
var import_jsx_runtime = require_jsx_runtime();
function ProductCard({ product }) {
	const { addToCart } = useCart();
	const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist();
	const productImage = product.images[0]?.media?.url || "/assets/cat-dev-boards.jpg";
	const isOutOfStock = product.stockQuantity <= 0;
	const brand = product.brand || "AutoForge";
	const reviews = 0;
	const cartCompatibleProduct = {
		...product,
		tag: brand,
		image: productImage,
		reviews,
		outOfStock: isOutOfStock
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "group flex h-full flex-col rounded-lg border border-border bg-card p-3 transition-shadow hover:shadow-md",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-1 flex items-start justify-between gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "line-clamp-1 text-xs font-medium text-muted-foreground",
					children: brand
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					"aria-label": isInWishlist(product.sku) ? "Remove from wishlist" : "Add to wishlist",
					onClick: () => {
						if (isInWishlist(product.sku)) removeFromWishlist(product.sku);
						else addToWishlist(cartCompatibleProduct);
					},
					className: "shrink-0 text-muted-foreground hover:text-accent cursor-pointer transition-colors",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Heart, { className: `h-4 w-4 ${isInWishlist(product.sku) ? "fill-accent text-accent" : ""}` })
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/shop/$sku",
				params: { sku: product.sku },
				className: "relative block",
				children: [
					isOutOfStock && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute left-2 top-2 z-10 rounded bg-muted/95 border border-border px-2 py-0.5 text-[11px] font-semibold text-muted-foreground",
						children: "Out of Stock"
					}),
					product.featured && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "absolute right-2 top-2 z-10 rounded bg-accent px-2 py-0.5 text-[11px] font-semibold text-accent-foreground shadow-sm",
						children: "Featured"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
						src: productImage,
						alt: product.name,
						width: 512,
						height: 512,
						loading: "lazy",
						className: "aspect-square w-full rounded object-cover transition-transform duration-300 group-hover:scale-[1.02]"
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop/$sku",
				params: { sku: product.sku },
				className: "mt-2 line-clamp-2 min-h-10 text-sm font-semibold leading-snug text-foreground hover:text-primary transition-colors",
				children: product.name
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-1 text-xs text-muted-foreground",
				children: ["SKU: ", product.sku]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex items-center gap-1",
				children: [Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: `h-3.5 w-3.5 text-border` }, i)), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-xs text-muted-foreground",
					children: [
						"(",
						reviews,
						")"
					]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex items-end justify-between gap-2 pt-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-base font-bold text-foreground",
						children: formatPrice(product.price)
					}),
					product.compareAtPrice && product.compareAtPrice > product.price && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] line-through text-muted-foreground",
						children: formatPrice(product.compareAtPrice)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-[11px] text-muted-foreground",
						children: "(Incl. GST)"
					})
				] }), !isOutOfStock && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => addToCart(cartCompatibleProduct, 1),
					className: "flex items-center gap-1.5 rounded-md bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground transition-colors hover:bg-primary/90 cursor-pointer",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingCart, { className: "h-3.5 w-3.5" }), "Add to Cart"]
				})]
			})
		]
	});
}
//#endregion
export { ProductCard as t };
