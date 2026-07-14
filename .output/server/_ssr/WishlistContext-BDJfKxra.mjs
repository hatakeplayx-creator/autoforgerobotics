import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as apiFetch, r as useAuth } from "./useAuth-BDG16QbY.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/WishlistContext-BDJfKxra.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var key = "autoforge_wishlist_items";
var headers = () => ({ Authorization: `Bearer ${localStorage.getItem("autoforge_access_token")}` });
var WishlistContext = (0, import_react.createContext)(void 0);
function WishlistProvider({ children }) {
	const { isAuthenticated, loading: authLoading } = useAuth();
	const [wishlistItems, setItems] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const busy = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const guest = () => {
		try {
			return JSON.parse(localStorage.getItem(key) ?? "[]");
		} catch {
			return [];
		}
	};
	const load = (0, import_react.useCallback)(async () => {
		if (authLoading) return;
		setLoading(true);
		try {
			if (!isAuthenticated) {
				setItems(guest());
				return;
			}
			const g = guest();
			for (const p of g) await apiFetch("/api/wishlist", {
				method: "POST",
				headers: headers(),
				body: JSON.stringify({ productId: p.id })
			});
			if (g.length) localStorage.removeItem(key);
			const rows = await apiFetch("/api/wishlist", { headers: headers() });
			setItems(rows.filter((x) => x.product).map((x) => x.product));
		} catch {
			setItems([]);
		} finally {
			setLoading(false);
		}
	}, [authLoading, isAuthenticated]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const addToWishlist = (p) => {
		if (busy.current.has(p.id) || wishlistItems.some((x) => x.sku === p.sku)) return;
		busy.current.add(p.id);
		(async () => {
			try {
				if (!isAuthenticated) {
					const next = [...wishlistItems, p];
					localStorage.setItem(key, JSON.stringify(next));
					setItems(next);
				} else {
					await apiFetch("/api/wishlist", {
						method: "POST",
						headers: headers(),
						body: JSON.stringify({ productId: p.id })
					});
					await load();
				}
				toast.success(`Added "${p.name}" to wishlist.`);
			} catch (e) {
				toast.error(e instanceof Error ? e.message : "Wishlist update failed");
			} finally {
				busy.current.delete(p.id);
			}
		})();
	};
	const removeFromWishlist = (sku) => {
		const p = wishlistItems.find((x) => x.sku === sku);
		if (!p) return;
		(async () => {
			try {
				if (!isAuthenticated) {
					const next = wishlistItems.filter((x) => x.sku !== sku);
					localStorage.setItem(key, JSON.stringify(next));
					setItems(next);
				} else {
					await apiFetch(`/api/wishlist/${p.id}`, {
						method: "DELETE",
						headers: headers()
					});
					setItems((prev) => prev.filter((x) => x.sku !== sku));
				}
				toast.info(`Removed "${p.name}" from wishlist.`);
			} catch (e) {
				toast.error(e instanceof Error ? e.message : "Wishlist update failed");
			}
		})();
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishlistContext.Provider, {
		value: {
			wishlistItems,
			loading,
			addToWishlist,
			removeFromWishlist,
			isInWishlist: (sku) => wishlistItems.some((x) => x.sku === sku)
		},
		children
	});
}
//#endregion
export { WishlistProvider as n, WishlistContext as t };
