import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { t as CartContext } from "./CartContext-RH8-1ZZK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/useCart-Bd4ZcYPt.js
var import_react = /* @__PURE__ */ __toESM(require_react());
function useCart() {
	const context = (0, import_react.useContext)(CartContext);
	if (context === void 0) throw new Error("useCart must be used within a CartProvider");
	return context;
}
//#endregion
export { useCart as t };
