import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as CartContext } from "./CartContext-ChvFOWpi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/store-data-DRJwi3Ya.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useCart() {
	const context = (0, import_react.useContext)(CartContext);
	if (context === void 0) throw new Error("useCart must be used within a CartProvider");
	return context;
}
function formatPrice(price) {
	return `₹ ${(typeof price === "string" ? parseFloat(price) : price ?? 0).toFixed(2)}`;
}
//#endregion
export { useCart as n, formatPrice as t };
