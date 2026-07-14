import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { r as useAuth } from "./useAuth-BDG16QbY.mjs";
import { t as Toaster$1 } from "./sonner-DoFKumIW.mjs";
import { t as Button } from "./button-Bq5vK6RO.mjs";
import { t as StorePageShell } from "./StorePageShell-DHngzsW8.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-B0PTgamJ.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const navigate = useNavigate();
	const { user, isAuthenticated, loading, updateProfile, logout } = useAuth();
	const [name, setName] = (0, import_react.useState)("");
	const [phone, setPhone] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		if (!loading && !isAuthenticated) navigate({ to: "/login" });
	}, [
		isAuthenticated,
		loading,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		setName(user?.name || "");
		setPhone(user?.phone || "");
	}, [user]);
	if (loading || !user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(StorePageShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "py-20 text-center text-sm text-muted-foreground",
		children: "Loading profile..."
	}) });
	const handleSubmit = (e) => {
		e.preventDefault();
		updateProfile({ name });
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(StorePageShell, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {
		position: "top-right",
		closeButton: true,
		richColors: true
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "mx-auto w-full max-w-2xl rounded-xl border border-border bg-card p-6 shadow-sm",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mb-6 flex flex-wrap items-center justify-between gap-2 border-b border-border pb-4",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-2xl font-extrabold text-foreground",
				children: "Profile"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-sm text-muted-foreground",
				children: "Manage your account details."
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/orders",
					className: "rounded-md border border-input bg-background px-3 py-2 text-xs font-semibold hover:bg-accent",
					children: "View Orders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "sm",
					onClick: () => {
						logout();
						navigate({ to: "/login" });
					},
					children: "Logout"
				})]
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
			onSubmit: handleSubmit,
			className: "space-y-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs font-semibold text-muted-foreground",
					children: "Name"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "text",
					required: true,
					value: name,
					onChange: (e) => setName(e.target.value),
					className: "h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs font-semibold text-muted-foreground",
					children: "Email"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "email",
					value: user.email,
					disabled: true,
					className: "h-10 w-full rounded-md border border-border bg-secondary px-3 text-sm text-muted-foreground"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "mb-1 block text-xs font-semibold text-muted-foreground",
					children: "Phone"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					type: "tel",
					value: phone,
					onChange: (e) => setPhone(e.target.value),
					className: "h-10 w-full rounded-md border border-border bg-background px-3 text-sm outline-none focus:border-primary"
				})] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					children: "Save Profile"
				})
			]
		})]
	})] });
}
//#endregion
export { ProfilePage as component };
