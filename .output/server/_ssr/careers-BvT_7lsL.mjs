import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as StorePageShell } from "./StorePageShell-D5aMIpay.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/careers-BvT_7lsL.js
var import_jsx_runtime = require_jsx_runtime();
function CareersPage() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StorePageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-extrabold text-foreground",
			children: "Careers"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-muted-foreground",
			children: "Join our team!"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: [
				"Frontend Developer",
				"Backend Developer",
				"Sales Manager"
			].map((role, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border border-border rounded-lg p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "font-semibold text-foreground",
					children: role
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "This is a sample job listing for demonstration purposes."
				})]
			}, i))
		})]
	}) });
}
//#endregion
export { CareersPage as component };
