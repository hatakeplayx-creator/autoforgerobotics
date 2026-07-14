import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { _ as useRouter, c as HeadContent, d as Outlet, f as lazyRouteComponent, h as Link, m as createRootRouteWithContext, p as createFileRoute, s as Scripts, u as createRouter } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { t as Route$28 } from "../_sku-D4tuhC3C.mjs";
import { t as AuthProvider } from "./useAuth-BDG16QbY.mjs";
import { n as WishlistProvider } from "./WishlistContext-BDJfKxra.mjs";
import { n as CartProvider } from "./CartContext-RH8-1ZZK.mjs";
import { t as Route$29 } from "./shop-BPbioZdU.mjs";
import { t as QueryClient } from "../_libs/tanstack__query-core.mjs";
import { t as QueryClientProvider } from "../_libs/tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-jrGs3E88.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var styles_default = "/assets/styles-BxVoYKxY.css";
function reportLovableError(error, context = {}) {
	if (typeof window === "undefined") return;
	window.__lovableEvents?.captureException?.(error, {
		source: "react_error_boundary",
		route: window.location.pathname,
		...context
	}, {
		mechanism: "react_error_boundary",
		handled: false,
		severity: "error"
	});
}
function NotFoundComponent() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-7xl font-bold text-foreground",
					children: "404"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mt-4 text-xl font-semibold text-foreground",
					children: "Page not found"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "The page you're looking for doesn't exist or has been moved."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-6",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Go home"
					})
				})
			]
		})
	});
}
function ErrorComponent({ error, reset }) {
	console.error(error);
	const router = useRouter();
	(0, import_react.useEffect)(() => {
		reportLovableError(error, { boundary: "tanstack_root_error_component" });
	}, [error]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-screen items-center justify-center bg-background px-4",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "max-w-md text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "text-xl font-semibold tracking-tight text-foreground",
					children: "This page didn't load"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted-foreground",
					children: "Something went wrong on our end. You can try refreshing or head back home."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex flex-wrap justify-center gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => {
							router.invalidate();
							reset();
						},
						className: "inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-colors hover:bg-primary/90",
						children: "Try again"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/",
						className: "inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium text-foreground transition-colors hover:bg-accent",
						children: "Go home"
					})]
				})
			]
		})
	});
}
var Route$27 = createRootRouteWithContext()({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1"
			},
			{ title: "AutoForge Robotics — Robotics & Electronics Store" },
			{
				name: "description",
				content: "AutoForge Robotics: shop development boards, sensors, drone parts, 3D printers, motors, IoT modules and DIY maker kits. Your Ideas, Our Parts."
			},
			{
				name: "author",
				content: "AutoForge Robotics"
			},
			{
				property: "og:title",
				content: "AutoForge Robotics — Robotics & Electronics Store"
			},
			{
				property: "og:description",
				content: "Shop development boards, sensors, drone parts, 3D printers, motors, IoT modules and DIY maker kits."
			},
			{
				property: "og:type",
				content: "website"
			},
			{
				name: "twitter:card",
				content: "summary_large_image"
			}
		],
		links: [
			{
				rel: "preconnect",
				href: "https://fonts.googleapis.com"
			},
			{
				rel: "preconnect",
				href: "https://fonts.gstatic.com",
				crossOrigin: "anonymous"
			},
			{
				rel: "stylesheet",
				href: "https://fonts.googleapis.com/css2?family=Archivo:wght@400;500;600;700;800;900&display=swap"
			},
			{
				rel: "stylesheet",
				href: styles_default
			},
			{
				rel: "icon",
				href: "/favicon.ico",
				type: "image/x-icon"
			}
		]
	}),
	shellComponent: RootShell,
	component: RootComponent,
	notFoundComponent: NotFoundComponent,
	errorComponent: ErrorComponent
});
function RootShell({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "en",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
function RootComponent() {
	const { queryClient } = Route$27.useRouteContext();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(QueryClientProvider, {
		client: queryClient,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CartProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(WishlistProvider, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }) }) })
	});
}
var $$splitComponentImporter$25 = () => import("./wishlist-Byedxqq9.mjs");
var Route$26 = createFileRoute("/wishlist")({ component: lazyRouteComponent($$splitComponentImporter$25, "component") });
var $$splitComponentImporter$24 = () => import("./terms-CMLC7OxI.mjs");
var Route$25 = createFileRoute("/terms")({ component: lazyRouteComponent($$splitComponentImporter$24, "component") });
var BASE_URL = "";
var Route$24 = createFileRoute("/sitemap.xml")({ server: { handlers: { GET: async () => {
	const xml = [
		`<?xml version="1.0" encoding="UTF-8"?>`,
		`<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">`,
		...[{
			path: "/",
			changefreq: "weekly",
			priority: "1.0"
		}].map((e) => [
			`  <url>`,
			`    <loc>${BASE_URL}${e.path}</loc>`,
			e.changefreq ? `    <changefreq>${e.changefreq}</changefreq>` : null,
			e.priority ? `    <priority>${e.priority}</priority>` : null,
			`  </url>`
		].filter(Boolean).join("\n")),
		`</urlset>`
	].join("\n");
	return new Response(xml, { headers: {
		"Content-Type": "application/xml",
		"Cache-Control": "public, max-age=3600"
	} });
} } } });
var $$splitComponentImporter$23 = () => import("./shipping-Jpk-FifH.mjs");
var Route$23 = createFileRoute("/shipping")({ component: lazyRouteComponent($$splitComponentImporter$23, "component") });
var $$splitComponentImporter$22 = () => import("./sell-on-autoforge-DIO30ycH.mjs");
var Route$22 = createFileRoute("/sell-on-autoforge")({ component: lazyRouteComponent($$splitComponentImporter$22, "component") });
var $$splitComponentImporter$21 = () => import("./returns-C4gj_PP5.mjs");
var Route$21 = createFileRoute("/returns")({ component: lazyRouteComponent($$splitComponentImporter$21, "component") });
var $$splitComponentImporter$20 = () => import("./register-DDe3FY64.mjs");
var Route$20 = createFileRoute("/register")({ component: lazyRouteComponent($$splitComponentImporter$20, "component") });
var $$splitComponentImporter$19 = () => import("./profile-B0PTgamJ.mjs");
var Route$19 = createFileRoute("/profile")({ component: lazyRouteComponent($$splitComponentImporter$19, "component") });
var $$splitComponentImporter$18 = () => import("./privacy-e-V1QgfU.mjs");
var Route$18 = createFileRoute("/privacy")({ component: lazyRouteComponent($$splitComponentImporter$18, "component") });
var $$splitComponentImporter$17 = () => import("./orders-CuwBzunk.mjs");
var Route$17 = createFileRoute("/orders")({ component: lazyRouteComponent($$splitComponentImporter$17, "component") });
var $$splitComponentImporter$16 = () => import("./new-arrivals-B-MLfxlO.mjs");
var Route$16 = createFileRoute("/new-arrivals")({ component: lazyRouteComponent($$splitComponentImporter$16, "component") });
var $$splitComponentImporter$15 = () => import("./login-D06C_IRe.mjs");
var Route$15 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$15, "component") });
var $$splitComponentImporter$14 = () => import("./forum-DZ9yUujz.mjs");
var Route$14 = createFileRoute("/forum")({ component: lazyRouteComponent($$splitComponentImporter$14, "component") });
var $$splitComponentImporter$13 = () => import("./forgot-password-CMq3pv20.mjs");
var Route$13 = createFileRoute("/forgot-password")({ component: lazyRouteComponent($$splitComponentImporter$13, "component") });
var $$splitComponentImporter$12 = () => import("./faq-DyH9x84c.mjs");
var Route$12 = createFileRoute("/faq")({ component: lazyRouteComponent($$splitComponentImporter$12, "component") });
var $$splitComponentImporter$11 = () => import("./contact-D193g-96.mjs");
var Route$11 = createFileRoute("/contact")({ component: lazyRouteComponent($$splitComponentImporter$11, "component") });
var $$splitComponentImporter$10 = () => import("./checkout-C_Smt2NO.mjs");
var Route$10 = createFileRoute("/checkout")({ component: lazyRouteComponent($$splitComponentImporter$10, "component") });
var $$splitComponentImporter$9 = () => import("./cart-BRylMZNw.mjs");
var Route$9 = createFileRoute("/cart")({ component: lazyRouteComponent($$splitComponentImporter$9, "component") });
var $$splitComponentImporter$8 = () => import("./careers-Dr4fYIN9.mjs");
var Route$8 = createFileRoute("/careers")({ component: lazyRouteComponent($$splitComponentImporter$8, "component") });
var $$splitComponentImporter$7 = () => import("./bulk-enquiry-BC85PH43.mjs");
var Route$7 = createFileRoute("/bulk-enquiry")({ component: lazyRouteComponent($$splitComponentImporter$7, "component") });
var $$splitComponentImporter$6 = () => import("./bom-tool-CZPR7mVe.mjs");
var Route$6 = createFileRoute("/bom-tool")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./blogs-o-qI12zS.mjs");
var Route$5 = createFileRoute("/blogs")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./atl-kits-enquiry-8ynQCknn.mjs");
var Route$4 = createFileRoute("/atl-kits-enquiry")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./about-C1E2hiHb.mjs");
var Route$3 = createFileRoute("/about")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./routes-X-vXfrJJ.mjs");
var Route$2 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./admin-DvdyVln2.mjs");
var Route$1 = createFileRoute("/admin/")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./login-DweQ38sd.mjs");
var Route = createFileRoute("/admin/login")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var WishlistRoute = Route$26.update({
	id: "/wishlist",
	path: "/wishlist",
	getParentRoute: () => Route$27
});
var TermsRoute = Route$25.update({
	id: "/terms",
	path: "/terms",
	getParentRoute: () => Route$27
});
var SitemapDotxmlRoute = Route$24.update({
	id: "/sitemap.xml",
	path: "/sitemap.xml",
	getParentRoute: () => Route$27
});
var ShippingRoute = Route$23.update({
	id: "/shipping",
	path: "/shipping",
	getParentRoute: () => Route$27
});
var SellOnAutoforgeRoute = Route$22.update({
	id: "/sell-on-autoforge",
	path: "/sell-on-autoforge",
	getParentRoute: () => Route$27
});
var ReturnsRoute = Route$21.update({
	id: "/returns",
	path: "/returns",
	getParentRoute: () => Route$27
});
var RegisterRoute = Route$20.update({
	id: "/register",
	path: "/register",
	getParentRoute: () => Route$27
});
var ProfileRoute = Route$19.update({
	id: "/profile",
	path: "/profile",
	getParentRoute: () => Route$27
});
var PrivacyRoute = Route$18.update({
	id: "/privacy",
	path: "/privacy",
	getParentRoute: () => Route$27
});
var OrdersRoute = Route$17.update({
	id: "/orders",
	path: "/orders",
	getParentRoute: () => Route$27
});
var NewArrivalsRoute = Route$16.update({
	id: "/new-arrivals",
	path: "/new-arrivals",
	getParentRoute: () => Route$27
});
var LoginRoute = Route$15.update({
	id: "/login",
	path: "/login",
	getParentRoute: () => Route$27
});
var ForumRoute = Route$14.update({
	id: "/forum",
	path: "/forum",
	getParentRoute: () => Route$27
});
var ForgotPasswordRoute = Route$13.update({
	id: "/forgot-password",
	path: "/forgot-password",
	getParentRoute: () => Route$27
});
var FaqRoute = Route$12.update({
	id: "/faq",
	path: "/faq",
	getParentRoute: () => Route$27
});
var ContactRoute = Route$11.update({
	id: "/contact",
	path: "/contact",
	getParentRoute: () => Route$27
});
var CheckoutRoute = Route$10.update({
	id: "/checkout",
	path: "/checkout",
	getParentRoute: () => Route$27
});
var CartRoute = Route$9.update({
	id: "/cart",
	path: "/cart",
	getParentRoute: () => Route$27
});
var CareersRoute = Route$8.update({
	id: "/careers",
	path: "/careers",
	getParentRoute: () => Route$27
});
var BulkEnquiryRoute = Route$7.update({
	id: "/bulk-enquiry",
	path: "/bulk-enquiry",
	getParentRoute: () => Route$27
});
var BomToolRoute = Route$6.update({
	id: "/bom-tool",
	path: "/bom-tool",
	getParentRoute: () => Route$27
});
var BlogsRoute = Route$5.update({
	id: "/blogs",
	path: "/blogs",
	getParentRoute: () => Route$27
});
var AtlKitsEnquiryRoute = Route$4.update({
	id: "/atl-kits-enquiry",
	path: "/atl-kits-enquiry",
	getParentRoute: () => Route$27
});
var AboutRoute = Route$3.update({
	id: "/about",
	path: "/about",
	getParentRoute: () => Route$27
});
var IndexRoute = Route$2.update({
	id: "/",
	path: "/",
	getParentRoute: () => Route$27
});
var ShopIndexRoute = Route$29.update({
	id: "/shop/",
	path: "/shop/",
	getParentRoute: () => Route$27
});
var AdminIndexRoute = Route$1.update({
	id: "/admin/",
	path: "/admin/",
	getParentRoute: () => Route$27
});
var ShopSkuRoute = Route$28.update({
	id: "/shop/$sku",
	path: "/shop/$sku",
	getParentRoute: () => Route$27
});
var rootRouteChildren = {
	IndexRoute,
	AboutRoute,
	AtlKitsEnquiryRoute,
	BlogsRoute,
	BomToolRoute,
	BulkEnquiryRoute,
	CareersRoute,
	CartRoute,
	CheckoutRoute,
	ContactRoute,
	FaqRoute,
	ForgotPasswordRoute,
	ForumRoute,
	LoginRoute,
	NewArrivalsRoute,
	OrdersRoute,
	PrivacyRoute,
	ProfileRoute,
	RegisterRoute,
	ReturnsRoute,
	SellOnAutoforgeRoute,
	ShippingRoute,
	SitemapDotxmlRoute,
	TermsRoute,
	WishlistRoute,
	AdminLoginRoute: Route.update({
		id: "/admin/login",
		path: "/admin/login",
		getParentRoute: () => Route$27
	}),
	ShopSkuRoute,
	AdminIndexRoute,
	ShopIndexRoute
};
var routeTree = Route$27._addFileChildren(rootRouteChildren)._addFileTypes();
var getRouter = () => {
	return createRouter({
		routeTree,
		context: { queryClient: new QueryClient() },
		scrollRestoration: true,
		defaultPreloadStaleTime: 0
	});
};
//#endregion
export { getRouter };
