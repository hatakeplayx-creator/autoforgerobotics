import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useAuth } from "./useAuth-BDG16QbY.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { t as Toaster$1 } from "./sonner-DoFKumIW.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as StorePageShell } from "./StorePageShell-DHngzsW8.mjs";
import { i as Trigger, n as List, r as Root2, t as Content } from "../_libs/radix-ui__react-tabs.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-D06C_IRe.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Tabs = Root2;
var TabsList = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, {
	ref,
	className: cn("inline-flex h-9 items-center justify-center rounded-lg bg-muted p-1 text-muted-foreground", className),
	...props
}));
TabsList.displayName = List.displayName;
var TabsTrigger = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trigger, {
	ref,
	className: cn("inline-flex items-center justify-center whitespace-nowrap rounded-md px-3 py-1 text-sm font-medium ring-offset-background cursor-pointer transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 disabled:cursor-not-allowed data-[state=active]:bg-background data-[state=active]:text-foreground data-[state=active]:shadow", className),
	...props
}));
TabsTrigger.displayName = Trigger.displayName;
var TabsContent = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Content, {
	ref,
	className: cn("mt-2 ring-offset-background focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2", className),
	...props
}));
TabsContent.displayName = Content.displayName;
function LoginPage() {
	const navigate = useNavigate();
	const { login, isAuthenticated, sendOtp, verifyOtp } = useAuth();
	const [email, setEmail] = (0, import_react.useState)("admin@autoforge.com");
	const [password, setPassword] = (0, import_react.useState)("admin123");
	const [phone, setPhone] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [otp, setOtp] = (0, import_react.useState)("");
	const [otpSent, setOtpSent] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		if (isAuthenticated) navigate({ to: "/profile" });
	}, [isAuthenticated, navigate]);
	const handleEmailLoginSubmit = async (e) => {
		e.preventDefault();
		if (!email.trim() || !password.trim()) return;
		if (await login(email, password)) navigate({ to: "/profile" });
	};
	const handleSendOtp = async () => {
		if (!phone.trim()) return;
		if (await sendOtp(phone)) setOtpSent(true);
	};
	const handleVerifyOtp = async (e) => {
		e.preventDefault();
		if (!phone.trim() || !otp.trim()) return;
		if (await verifyOtp(phone, otp, name)) navigate({ to: "/profile" });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StorePageShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
		position: "top-right",
		closeButton: true,
		richColors: true
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto w-full max-w-md rounded-xl border border-border bg-card p-6 shadow-sm",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-extrabold text-foreground",
				children: "Login"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Use your account to continue shopping and track orders."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Tabs, {
				defaultValue: "otp",
				className: "mt-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(TabsList, {
						className: "grid w-full grid-cols-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "otp",
							children: "OTP Login"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsTrigger, {
							value: "email",
							children: "Email/Password"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "otp",
						className: "space-y-4 mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
							onSubmit: handleVerifyOtp,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "mb-1 block text-xs font-semibold text-muted-foreground",
									children: "Phone Number"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "tel",
									required: true,
									value: phone,
									onChange: (e) => setPhone(e.target.value),
									className: "h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary",
									placeholder: "Enter your phone number"
								})] }), !otpSent ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									type: "button",
									onClick: handleSendOtp,
									className: "w-full",
									children: "Send OTP"
								}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-semibold text-muted-foreground",
										children: "Name (for new users)"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										value: name,
										onChange: (e) => setName(e.target.value),
										className: "h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary",
										placeholder: "Your name"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-semibold text-muted-foreground",
										children: "OTP"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "text",
										required: true,
										value: otp,
										onChange: (e) => setOtp(e.target.value),
										className: "h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary",
										placeholder: "Enter OTP"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "flex gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "button",
											variant: "secondary",
											onClick: () => setOtpSent(false),
											className: "flex-1",
											children: "Change Phone"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
											type: "submit",
											className: "flex-1",
											children: "Verify OTP"
										})]
									})
								] })]
							})
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TabsContent, {
						value: "email",
						className: "space-y-4 mt-4",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
							onSubmit: handleEmailLoginSubmit,
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-4",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-semibold text-muted-foreground",
										children: "Email"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "email",
										required: true,
										value: email,
										onChange: (e) => setEmail(e.target.value),
										className: "h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
										className: "mb-1 block text-xs font-semibold text-muted-foreground",
										children: "Password"
									}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "password",
										required: true,
										value: password,
										onChange: (e) => setPassword(e.target.value),
										className: "h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
									})] }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										type: "submit",
										className: "w-full",
										children: "Login"
									})
								]
							})
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-4 flex items-center justify-between text-xs",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/forgot-password",
					className: "font-semibold text-primary hover:underline",
					children: "Forgot password?"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/register",
					className: "font-semibold text-primary hover:underline",
					children: "Create account"
				})]
			})
		]
	})] });
}
//#endregion
export { LoginPage as component };
