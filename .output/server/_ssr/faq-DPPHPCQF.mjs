import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { $ as ChevronDown, X as ChevronUp } from "../_libs/lucide-react.mjs";
import { t as StorePageShell } from "./StorePageShell-D5aMIpay.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/faq-DPPHPCQF.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function FAQPage() {
	const [openIndex, setOpenIndex] = (0, import_react.useState)(null);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StorePageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "text-3xl font-extrabold text-foreground",
			children: "Frequently Asked Questions"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-2 text-muted-foreground",
			children: "Find answers to common questions about our products and services."
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-4",
			children: [
				{
					question: "How do I place an order?",
					answer: "You can place an order by adding items to your cart, proceeding to checkout, and completing the payment process."
				},
				{
					question: "What payment methods do you accept?",
					answer: "We accept all major credit/debit cards, UPI, net banking, and wallets."
				},
				{
					question: "How long does shipping take?",
					answer: "Shipping usually takes 3-7 business days depending on your location and product availability."
				},
				{
					question: "Can I track my order?",
					answer: "Yes! Once your order is shipped, you will receive a tracking number via email and SMS."
				},
				{
					question: "What is your return policy?",
					answer: "We accept returns within 7 days of delivery for most products. Please refer to our Returns Policy for details."
				},
				{
					question: "Do you offer COD (Cash on Delivery)?",
					answer: "Yes, we offer COD on selected products and locations."
				}
			].map((faq, index) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-xl border border-border bg-card overflow-hidden",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					type: "button",
					onClick: () => setOpenIndex(openIndex === index ? null : index),
					className: "w-full px-6 py-4 text-left flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-semibold text-foreground",
						children: faq.question
					}), openIndex === index ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronUp, { className: "h-5 w-5 text-muted-foreground" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronDown, { className: "h-5 w-5 text-muted-foreground" })]
				}), openIndex === index && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "px-6 pb-4 text-sm text-muted-foreground",
					children: faq.answer
				})]
			}, index))
		})]
	}) });
}
//#endregion
export { FAQPage as component };
