import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { u as useProducts } from "./StoreFooter-DMLW-oTe.mjs";
import { t as ProductCard } from "./ProductCard-aFJKB8mL.mjs";
import { t as StorePageShell } from "./StorePageShell-D5aMIpay.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/new-arrivals-BFdcEY9l.js
var import_jsx_runtime = require_jsx_runtime();
function NewArrivalsPage() {
	const { data: products, loading } = useProducts();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StorePageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-extrabold text-foreground",
			children: "New Arrivals"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-muted-foreground",
			children: "Check out our latest products!"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6",
			children: loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-sm text-muted-foreground",
				children: "Loading products..."
			}) : products?.slice(0, 8).map((product) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductCard, { product }, product.sku))
		})]
	}) });
}
//#endregion
export { NewArrivalsPage as component };
