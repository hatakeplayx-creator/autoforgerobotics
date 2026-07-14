import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as useAuth, r as apiFetch } from "./useAuth-COIZ1r_K.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/CartContext-ChvFOWpi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var key = "autoforge_cart_items";
var token = () => localStorage.getItem("autoforge_access_token");
var headers = () => ({ Authorization: `Bearer ${token()}` });
var normalize = (rows) => rows.filter((r) => r.product).map((r) => ({
	product: r.product,
	quantity: r.quantity
}));
var CartContext = (0, import_react.createContext)(void 0);
function CartProvider({ children }) {
	const { isAuthenticated, loading: authLoading } = useAuth();
	const [cartItems, setCartItems] = (0, import_react.useState)([]);
	const [appliedCoupon, setAppliedCoupon] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const busy = (0, import_react.useRef)(/* @__PURE__ */ new Set());
	const guest = () => {
		try {
			return JSON.parse(localStorage.getItem(key) ?? "[]");
		} catch {
			return [];
		}
	};
	const saveGuest = (items) => localStorage.setItem(key, JSON.stringify(items));
	const load = (0, import_react.useCallback)(async () => {
		if (authLoading) return;
		setLoading(true);
		setError(null);
		try {
			if (!isAuthenticated) {
				setCartItems(guest());
				return;
			}
			const guestItems = guest();
			for (const item of guestItems) await apiFetch("/api/cart", {
				method: "POST",
				headers: headers(),
				body: JSON.stringify({
					productId: item.product.id,
					quantity: Math.min(item.quantity, item.product.stockQuantity)
				})
			});
			if (guestItems.length) localStorage.removeItem(key);
			setCartItems(normalize(await apiFetch("/api/cart", { headers: headers() })));
		} catch (e) {
			setError(e instanceof Error ? e.message : "Unable to load cart");
			setCartItems([]);
		} finally {
			setLoading(false);
		}
	}, [authLoading, isAuthenticated]);
	(0, import_react.useEffect)(() => {
		load();
	}, [load]);
	const mutate = (0, import_react.useCallback)(async (action, product, quantity) => {
		if (busy.current.has(product.id)) return false;
		busy.current.add(product.id);
		try {
			if (!isAuthenticated) {
				setCartItems((prev) => {
					const existing = prev.find((x) => x.product.sku === product.sku);
					const next = action === "remove" ? prev.filter((x) => x.product.sku !== product.sku) : existing ? prev.map((x) => x.product.sku === product.sku ? {
						...x,
						quantity: quantity ?? x.quantity
					} : x) : [...prev, {
						product,
						quantity: quantity ?? 1
					}];
					saveGuest(next);
					return next;
				});
				return true;
			}
			if (action === "add") await apiFetch("/api/cart", {
				method: "POST",
				headers: headers(),
				body: JSON.stringify({
					productId: product.id,
					quantity
				})
			});
			if (action === "update") await apiFetch("/api/cart", {
				method: "PATCH",
				headers: headers(),
				body: JSON.stringify({
					productId: product.id,
					quantity
				})
			});
			if (action === "remove") await apiFetch(`/api/cart/${product.id}`, {
				method: "DELETE",
				headers: headers()
			});
			setCartItems(normalize(await apiFetch("/api/cart", { headers: headers() })));
			return true;
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "Cart update failed");
			return false;
		} finally {
			busy.current.delete(product.id);
		}
	}, [isAuthenticated]);
	const addToCart = (p, q) => {
		if (q > 0) mutate("add", p, q).then((updated) => {
			if (updated) toast.success(`Added "${p.name}" to cart.`);
		});
	};
	const removeFromCart = (sku) => {
		const p = cartItems.find((x) => x.product.sku === sku)?.product;
		if (p) mutate("remove", p).then((updated) => {
			if (updated) toast.info(`Removed "${p.name}" from cart.`);
		});
	};
	const updateQuantity = (sku, q) => {
		const p = cartItems.find((x) => x.product.sku === sku)?.product;
		if (!p) return;
		if (q < 1) removeFromCart(sku);
		else mutate("update", p, q);
	};
	const subtotal = cartItems.reduce((n, x) => n + x.product.price * x.quantity, 0);
	const discount = appliedCoupon ? appliedCoupon.type === "percent" ? subtotal * appliedCoupon.value / 100 : Math.min(subtotal, appliedCoupon.value) : 0;
	const shipping = subtotal && subtotal - discount < 999 ? 99 : 0;
	const tax = (subtotal - discount) * 18 / 118;
	const value = (0, import_react.useMemo)(() => ({
		cartItems,
		itemCount: cartItems.reduce((n, x) => n + x.quantity, 0),
		appliedCoupon,
		loading,
		error,
		addToCart,
		removeFromCart,
		updateQuantity,
		clearCart: () => {
			if (!isAuthenticated) {
				saveGuest([]);
				setCartItems([]);
			}
		},
		applyCoupon: (code) => {
			const c = code === "AUTOFIRST" ? {
				code,
				type: "percent",
				value: 10
			} : null;
			if (c) setAppliedCoupon(c);
			return !!c;
		},
		removeCoupon: () => setAppliedCoupon(null),
		subtotal,
		discount,
		shipping,
		tax,
		total: Math.max(0, subtotal - discount + shipping)
	}), [
		cartItems,
		appliedCoupon,
		loading,
		error,
		subtotal,
		discount,
		shipping,
		tax,
		isAuthenticated
	]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartContext.Provider, {
		value,
		children
	});
}
//#endregion
export { CartProvider as n, CartContext as t };
