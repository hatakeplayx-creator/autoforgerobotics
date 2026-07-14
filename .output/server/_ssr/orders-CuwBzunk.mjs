import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as apiFetch, r as useAuth } from "./useAuth-BDG16QbY.mjs";
import { s as formatPrice } from "./StoreFooter-Z2RR4EsA.mjs";
import { t as StorePageShell } from "./StorePageShell-DHngzsW8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/orders-CuwBzunk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function OrdersPage() {
	const navigate = useNavigate();
	const { isAuthenticated, loading } = useAuth();
	const [orders, setOrders] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		if (!loading && !isAuthenticated) navigate({ to: "/login" });
	}, [
		isAuthenticated,
		loading,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		const token = localStorage.getItem("autoforge_access_token");
		if (!token || !isAuthenticated) return;
		apiFetch("/api/me/orders", { headers: { Authorization: `Bearer ${token}` } }).then(setOrders).catch(() => setOrders([]));
	}, [isAuthenticated]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StorePageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-20 text-center text-sm text-muted-foreground",
		children: "Loading orders..."
	}) });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StorePageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto w-full max-w-4xl rounded-xl border border-border bg-card p-6 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-extrabold text-foreground",
				children: "Orders"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Track your previous and active purchases."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/profile",
				className: "rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold hover:bg-accent",
				children: "Back to Profile"
			})]
		}), orders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border border-dashed border-border p-10 text-center",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm font-semibold text-foreground",
				children: "No orders yet."
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/shop",
				className: "mt-3 inline-block text-xs font-semibold text-primary hover:underline",
				children: "Start shopping"
			})]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: orders.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
				className: "rounded-lg border border-border p-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-bold text-foreground",
							children: order.number
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "rounded-full border border-border bg-secondary px-2.5 py-1 text-[10px] font-semibold uppercase tracking-wide text-foreground",
							children: order.status
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-1 text-xs text-muted-foreground",
						children: ["Placed: ", new Date(order.createdAt).toLocaleString()]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-3 space-y-1.5",
						children: order.items.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "text-xs text-muted-foreground",
							children: [
								item.quantity,
								"x ",
								item.productName,
								" (",
								item.sku,
								")"
							]
						}, `${order.id}-${item.sku}`))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-3 text-sm font-bold text-foreground",
						children: ["Total: ", formatPrice(order.total)]
					})
				]
			}, order.id))
		})]
	}) });
}
//#endregion
export { OrdersPage as component };
