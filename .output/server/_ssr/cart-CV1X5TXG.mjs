import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as useCart, t as formatPrice } from "./store-data-DRJwi3Ya.mjs";
import { C as Plus, E as Minus, _ as ShoppingBag, f as Tag, it as ArrowRight, s as Truck, u as Trash, v as ShieldCheck } from "../_libs/lucide-react.mjs";
import { a as StoreHeader, i as StoreFooter, n as NavBar, o as TopBar, t as AnnouncementBar } from "./StoreFooter-DMLW-oTe.mjs";
import { a as BreadcrumbPage, i as BreadcrumbList, n as BreadcrumbItem, o as BreadcrumbSeparator, r as BreadcrumbLink, t as Breadcrumb } from "./breadcrumb-BG427xXB.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/cart-CV1X5TXG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var STATES = [
	"Maharashtra",
	"Delhi",
	"Karnataka",
	"Tamil Nadu",
	"Telangana",
	"Gujarat",
	"Uttar Pradesh",
	"West Bengal",
	"Other State"
];
function CartPage() {
	const { cartItems, removeFromCart, updateQuantity, clearCart, applyCoupon, removeCoupon, appliedCoupon, subtotal, discount, shipping, tax, total } = useCart();
	const [couponCode, setCouponCode] = (0, import_react.useState)("");
	const [estState, setEstState] = (0, import_react.useState)("");
	const [estPin, setEstPin] = (0, import_react.useState)("");
	const [shippingEstimate, setShippingEstimate] = (0, import_react.useState)(null);
	const handleApplyCoupon = (e) => {
		e.preventDefault();
		if (!couponCode.trim()) return;
		if (applyCoupon(couponCode)) setCouponCode("");
	};
	const handleEstimateShipping = (e) => {
		e.preventDefault();
		if (!estState || estPin.length < 6) {
			toast.error("Please select a state and enter a valid 6-digit PIN Code.");
			return;
		}
		setShippingEstimate({
			calculated: true,
			cost: shipping,
			days: estState === "Maharashtra" ? 2 : 4
		});
		toast.success("Shipping cost estimated successfully.");
	};
	const handleCheckout = () => {
		toast.success("Order Placed Successfully! (Demo checkout complete)");
		setTimeout(() => {
			clearCart();
		}, 1500);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-background",
		children: [
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
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbItem, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BreadcrumbPage, { children: "Shopping Cart" }) })
						] }) })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "text-2xl font-extrabold tracking-tight text-foreground md:text-3xl mb-6",
						children: "Shopping Cart"
					}),
					cartItems.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-col items-center justify-center text-center p-12 bg-card rounded-xl border border-dashed border-border min-h-[350px]",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShoppingBag, { className: "h-14 w-14 text-muted-foreground/60 stroke-1 mb-4 animate-bounce" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "text-lg font-bold text-foreground",
								children: "Your Cart is Empty"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-xs text-muted-foreground max-w-xs",
								children: "Looks like you haven't added any robotics or maker components to your cart yet."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/shop",
								className: "mt-6 rounded-lg bg-primary px-6 py-2.5 text-xs font-semibold text-primary-foreground hover:bg-primary/95 transition-colors cursor-pointer",
								children: "Start Shopping"
							})
						]
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-8 lg:grid-cols-[1fr_360px]",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-6",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-card border border-border rounded-xl p-5 md:p-6 shadow-sm space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "flex items-center justify-between border-b border-border pb-3",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h2", {
										className: "text-base font-bold text-foreground",
										children: [
											"Items in Cart (",
											cartItems.length,
											")"
										]
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: clearCart,
										className: "text-xs font-semibold text-destructive hover:underline cursor-pointer",
										children: "Clear All"
									})]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "divide-y divide-border",
									children: cartItems.map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row gap-4 items-start sm:items-center",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
												to: "/shop/$sku",
												params: { sku: item.product.sku },
												className: "shrink-0 block",
												children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
													src: item.product.image,
													alt: item.product.name,
													className: "h-16 w-16 rounded object-cover border border-border bg-secondary"
												})
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex-1 min-w-0",
												children: [
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
														to: "/shop/$sku",
														params: { sku: item.product.sku },
														className: "block text-sm font-bold text-foreground hover:text-primary truncate",
														children: item.product.name
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
														className: "text-xs text-muted-foreground mt-0.5",
														children: ["SKU: ", item.product.sku]
													}),
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
														className: "text-xs font-bold text-foreground mt-1 sm:hidden",
														children: formatPrice(item.product.price)
													})
												]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center gap-3",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
													className: "flex items-center rounded-lg border border-border bg-secondary/30 h-8 overflow-hidden",
													children: [
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => updateQuantity(item.product.sku, item.quantity - 1),
															className: "p-2 h-full flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-3 w-3" })
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
															className: "px-3 text-xs font-bold min-w-6 text-center select-none",
															children: item.quantity
														}),
														/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
															onClick: () => updateQuantity(item.product.sku, item.quantity + 1),
															className: "p-2 h-full flex items-center justify-center text-muted-foreground hover:text-foreground cursor-pointer transition-colors",
															children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-3 w-3" })
														})
													]
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													onClick: () => removeFromCart(item.product.sku),
													className: "text-muted-foreground hover:text-destructive p-2 rounded hover:bg-secondary cursor-pointer",
													"aria-label": "Remove item",
													children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash, { className: "h-4 w-4" })
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "hidden sm:block text-right min-w-[100px]",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
													className: "text-sm font-extrabold text-foreground",
													children: formatPrice(item.product.price * item.quantity)
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
													className: "text-[10px] text-muted-foreground",
													children: [
														"(",
														formatPrice(item.product.price),
														" each)"
													]
												})]
											})
										]
									}, item.product.sku))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid gap-6 sm:grid-cols-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-card border border-border rounded-xl p-5 shadow-sm",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "text-sm font-bold text-foreground flex items-center gap-2 mb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Truck, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Estimate Shipping" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
											onSubmit: handleEstimateShipping,
											className: "space-y-3",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-[10px] text-muted-foreground font-semibold mb-1",
													children: "State"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("select", {
													required: true,
													value: estState,
													onChange: (e) => {
														setEstState(e.target.value);
														setShippingEstimate(null);
													},
													className: "w-full h-9 rounded border border-border bg-background px-2.5 text-xs outline-none focus:border-primary cursor-pointer",
													children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: "",
														children: "Select State"
													}), STATES.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
														value: s,
														children: s
													}, s))]
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
													className: "block text-[10px] text-muted-foreground font-semibold mb-1",
													children: "PIN Code"
												}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
													type: "text",
													required: true,
													maxLength: 6,
													pattern: "\\d{6}",
													value: estPin,
													onChange: (e) => {
														setEstPin(e.target.value.replace(/\D/g, ""));
														setShippingEstimate(null);
													},
													placeholder: "e.g. 411001",
													className: "w-full h-9 rounded border border-border bg-background px-2.5 text-xs outline-none focus:border-primary"
												})] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
													type: "submit",
													className: "w-full py-2 bg-secondary border border-border text-foreground hover:bg-secondary/60 text-xs font-semibold rounded cursor-pointer transition-colors",
													children: "Calculate Cost"
												})
											]
										}),
										shippingEstimate && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 p-3 bg-primary/5 rounded border border-primary/10 text-xs space-y-1",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-foreground",
												children: ["Shipping Fee: ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: shippingEstimate.cost === 0 ? "FREE" : formatPrice(shippingEstimate.cost) })]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-muted-foreground",
												children: [
													"Estimated Delivery: ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("strong", { children: [shippingEstimate.days, " Days"] }),
													" (PIN: ",
													estPin,
													")"
												]
											})]
										})
									]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "bg-card border border-border rounded-xl p-5 shadow-sm h-fit",
									children: [
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h3", {
											className: "text-sm font-bold text-foreground flex items-center gap-2 mb-3",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, { className: "h-4 w-4 text-primary" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Apply Discount Coupon" })]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
											onSubmit: handleApplyCoupon,
											className: "flex gap-2",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
												type: "text",
												placeholder: "e.g. AUTOFIRST",
												value: couponCode,
												onChange: (e) => setCouponCode(e.target.value),
												className: "flex-1 h-9 rounded border border-border bg-background px-2.5 text-xs outline-none focus:border-primary uppercase"
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												type: "submit",
												className: "px-4 py-2 bg-primary text-primary-foreground hover:bg-primary/95 text-xs font-semibold rounded cursor-pointer transition-colors",
												children: "Apply"
											})]
										}),
										appliedCoupon && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 p-3 bg-emerald-500/5 rounded border border-emerald-500/10 text-xs flex items-center justify-between",
											children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-emerald-700 font-semibold",
												children: ["Active: ", appliedCoupon.code]
											}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
												className: "text-muted-foreground text-[10px]",
												children: [
													"Discount: ",
													appliedCoupon.type === "percent" ? `${appliedCoupon.value}%` : formatPrice(appliedCoupon.value),
													" Off"
												]
											})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
												onClick: removeCoupon,
												className: "text-[10px] text-destructive hover:underline font-bold cursor-pointer",
												children: "Remove"
											})]
										}),
										/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
											className: "mt-4 p-3 bg-secondary/30 rounded border border-border text-[11px] text-muted-foreground space-y-1",
											children: [
												/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "💡 Demo Coupons to try:" }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
													"• ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "AUTOFIRST" }),
													": 10% discount on cart subtotal"
												] }),
												/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
													"• ",
													/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: "FREE500" }),
													": ₹500 flat discount"
												] })
											]
										})
									]
								})]
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "space-y-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "bg-card border border-border rounded-xl p-6 shadow-sm space-y-5 sticky top-20",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "text-base font-bold text-foreground border-b border-border pb-3",
										children: "Order Summary"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "space-y-3 text-xs",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Subtotal" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground",
													children: formatPrice(subtotal)
												})]
											}),
											discount > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-emerald-600 font-medium",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Coupon Discount" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["-", formatPrice(discount)] })]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Shipping Charges" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground",
													children: shipping === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
														className: "text-emerald-600",
														children: "FREE"
													}) : formatPrice(shipping)
												})]
											}),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
												className: "flex items-center justify-between text-muted-foreground",
												children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Estimated Taxes (18% GST Incl.)" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
													className: "font-semibold text-foreground",
													children: formatPrice(tax)
												})]
											})
										]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("hr", { className: "border-border" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex items-center justify-between text-base font-black text-foreground",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Grand Total" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: formatPrice(total) })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
										onClick: handleCheckout,
										className: "w-full flex items-center justify-center gap-2 h-12 bg-primary hover:bg-primary/95 text-primary-foreground font-semibold rounded-lg cursor-pointer transition-colors shadow-md text-sm",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "Proceed to Checkout" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-4 flex gap-2.5 text-[10px] text-muted-foreground items-start",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ShieldCheck, { className: "h-4 w-4 shrink-0 text-emerald-600" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AutoForge Secure Checkout. All packages are insured and packed strictly under sanitised workbench criteria." })]
									})
								]
							})
						})]
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(StoreFooter, {})
		]
	});
}
//#endregion
export { CartPage as component };
