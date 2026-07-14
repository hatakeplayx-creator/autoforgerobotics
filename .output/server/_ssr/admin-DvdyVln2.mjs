import { n as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { g as useNavigate, h as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-arrow+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { n as apiFetch, r as useAuth } from "./useAuth-BDG16QbY.mjs";
import { t as cn } from "./utils-C_uf36nf.mjs";
import { B as FileImage, I as House, O as Menu, P as LayoutDashboard, T as Package, _ as ShoppingBag, b as Search, i as Users, j as LogOut, nt as Box, r as X, tt as Boxes, y as Settings } from "../_libs/lucide-react.mjs";
import { a as DialogOverlay$1, i as DialogDescription$1, n as DialogClose, o as DialogPortal$1, r as DialogContent$1, s as DialogTitle$1, t as Dialog$1 } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Toaster$1 } from "./sonner-DoFKumIW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/admin-DvdyVln2.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var authHeaders = (token) => token ? { Authorization: `Bearer ${token}` } : {};
var collection = async (path, token) => ({ value: await apiFetch(path, { headers: authHeaders(token) }) });
async function fetchDashboard(token) {
	authHeaders(token);
	const [orders, products, customers] = await Promise.all([
		collection("/api/orders", token),
		collection("/api/products", token),
		collection("/api/customers", token)
	]);
	const totalRevenue = orders.value.reduce((sum, o) => sum + Number(o.total), 0);
	const lowStock = products.value.filter((p) => p.stockQuantity <= p.lowStockThreshold).sort((a, b) => a.stockQuantity - b.stockQuantity).slice(0, 5);
	return {
		totalOrders: orders.value.length,
		totalRevenue,
		totalProducts: products.value.length,
		totalCustomers: customers.value.length,
		recentOrders: orders.value.slice(0, 5),
		lowStock
	};
}
function fetchProducts(token) {
	return collection("/api/products", token);
}
function createProduct(data, token) {
	return apiFetch("/api/products", {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			...authHeaders(token)
		}
	});
}
function updateProduct(id, data, token) {
	return apiFetch(`/api/products/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			...authHeaders(token)
		}
	});
}
function deleteProduct(id, token) {
	return apiFetch(`/api/products/${id}`, {
		method: "DELETE",
		headers: authHeaders(token)
	});
}
function fetchCategories(token) {
	return collection("/api/categories", token);
}
function createCategory(data, token) {
	return apiFetch("/api/categories", {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			...authHeaders(token)
		}
	});
}
function updateCategory(id, data, token) {
	return apiFetch(`/api/categories/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			...authHeaders(token)
		}
	});
}
function deleteCategory(id, token) {
	return apiFetch(`/api/categories/${id}`, {
		method: "DELETE",
		headers: authHeaders(token)
	});
}
function fetchOrders(token) {
	return collection("/api/orders", token);
}
function updateOrderStatus(id, status, token) {
	return apiFetch(`/api/orders/${id}/status`, {
		method: "PATCH",
		body: JSON.stringify({ status }),
		headers: {
			"Content-Type": "application/json",
			...authHeaders(token)
		}
	});
}
function fetchCustomers(token) {
	return collection("/api/customers", token);
}
function fetchEnquiries(token, status) {
	return collection(`/api/enquiries${status ? `?status=${status}` : ""}`, token);
}
function updateEnquiryStatus(id, status, token) {
	return apiFetch(`/api/enquiries/${id}`, {
		method: "PATCH",
		body: JSON.stringify({ status }),
		headers: {
			"Content-Type": "application/json",
			...authHeaders(token)
		}
	});
}
function addEnquiryNote(id, body, token) {
	return apiFetch(`/api/enquiries/${id}/notes`, {
		method: "POST",
		body: JSON.stringify({ body }),
		headers: {
			"Content-Type": "application/json",
			...authHeaders(token)
		}
	});
}
function deleteEnquiry(id, token) {
	return apiFetch(`/api/enquiries/${id}`, {
		method: "DELETE",
		headers: authHeaders(token)
	});
}
function exportEnquiriesCsv(token) {
	return fetch(`${new URL("/api/enquiries/export.csv", "http://localhost:4000")}`, { headers: authHeaders(token) });
}
function fetchBrands(token) {
	return collection("/api/brands", token);
}
function createBrand(data, token) {
	return apiFetch("/api/brands", {
		method: "POST",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			...authHeaders(token)
		}
	});
}
function updateBrand(id, data, token) {
	return apiFetch(`/api/brands/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			...authHeaders(token)
		}
	});
}
function deleteBrand(id, token) {
	return apiFetch(`/api/brands/${id}`, {
		method: "DELETE",
		headers: authHeaders(token)
	});
}
function fetchHomepageBlocks(token) {
	return collection("/api/homepage", token);
}
function updateHomepageBlock(id, content, token) {
	return apiFetch(`/api/homepage/${id}`, {
		method: "PATCH",
		body: JSON.stringify({ content }),
		headers: {
			"Content-Type": "application/json",
			...authHeaders(token)
		}
	});
}
function fetchMedia(token) {
	return collection("/api/media", token);
}
async function uploadMedia(files, token) {
	const form = new FormData();
	for (let i = 0; i < files.length; i++) form.append("files", files[i]);
	const resp = await fetch(`http://localhost:4000/api/media`, {
		method: "POST",
		body: form,
		headers: authHeaders(token)
	});
	if (!resp.ok) throw new Error("Upload failed");
	return resp.json();
}
function updateMedia(id, data, token) {
	return apiFetch(`/api/media/${id}`, {
		method: "PATCH",
		body: JSON.stringify(data),
		headers: {
			"Content-Type": "application/json",
			...authHeaders(token)
		}
	});
}
function deleteMedia(id, token) {
	return apiFetch(`/api/media/${id}`, {
		method: "DELETE",
		headers: authHeaders(token)
	});
}
function fetchSettings(token) {
	return collection("/api/settings", token);
}
function saveSetting(key, value, token) {
	return apiFetch(`/api/settings/${key}`, {
		method: "PUT",
		body: JSON.stringify({ value }),
		headers: {
			"Content-Type": "application/json",
			...authHeaders(token)
		}
	});
}
var statusStyle = {
	PENDING: "bg-amber-100 text-amber-800",
	CONFIRMED: "bg-blue-100 text-blue-800",
	SHIPPED: "bg-purple-100 text-purple-800",
	DELIVERED: "bg-emerald-100 text-emerald-800",
	CANCELLED: "bg-red-100 text-red-800"
};
function SkeletonCard() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "rounded-lg border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-24 animate-pulse rounded bg-muted" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-8 w-32 animate-pulse rounded bg-muted" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-3 h-3 w-28 animate-pulse rounded bg-muted" })
		]
	});
}
function DashboardSection({ token }) {
	const [metrics, setMetrics] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			try {
				const data = await fetchDashboard(token);
				if (!cancelled) setMetrics(data);
			} catch {
				toast.error("Failed to load dashboard data");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [token]);
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonCard, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonCard, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonCard, {}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SkeletonCard, {})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 xl:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border bg-card p-5 xl:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-40 animate-pulse rounded bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex h-48 items-end gap-2",
					children: Array.from({ length: 10 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex-1 animate-pulse rounded-t bg-muted",
						style: { height: `${30 + Math.random() * 70}%` }
					}, i))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-lg border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-36 animate-pulse rounded bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-4 space-y-4",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-full animate-pulse rounded bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-3/4 animate-pulse rounded bg-muted" })]
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 rounded-lg border bg-card p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-5 w-32 animate-pulse rounded bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 space-y-3",
				children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-full animate-pulse rounded bg-muted" }, i))
			})]
		})
	] });
	if (!metrics) return null;
	const chartOrders = metrics.recentOrders.slice(0, 10);
	const maxTotal = Math.max(...chartOrders.map((o) => o.total), 1);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-2 xl:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Total Orders"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-2xl font-bold",
						children: metrics.totalOrders.toLocaleString()
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Revenue"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-2xl font-bold",
						children: ["₹", metrics.totalRevenue.toLocaleString("en-IN")]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Total Products"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-2xl font-bold",
						children: metrics.totalProducts.toLocaleString()
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-lg border bg-card p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Total Customers"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-2xl font-bold",
						children: metrics.totalCustomers.toLocaleString()
					})]
				})
			]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-6 grid gap-6 xl:grid-cols-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border bg-card p-5 xl:col-span-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-semibold",
						children: "Recent Orders"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-sm text-muted-foreground",
						children: [
							"Last ",
							chartOrders.length,
							" orders"
						]
					})]
				}), chartOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-8 text-sm text-muted-foreground",
					children: "No orders yet."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-8 flex h-48 items-end gap-2",
					children: chartOrders.map((o, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-1 flex-col items-center gap-1",
						title: `${o.number}: ₹${o.total.toLocaleString("en-IN")}`,
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "text-[10px] text-muted-foreground",
								children: [
									"₹",
									(o.total / 1e3).toFixed(1),
									"k"
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "w-full rounded-t bg-primary/80 transition-all",
								style: {
									height: `${o.total / maxTotal * 100}%`,
									minHeight: "4px"
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "text-[10px] text-muted-foreground",
								children: i + 1
							})
						]
					}, o.id))
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-lg border bg-card p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Low Stock Alerts"
				}), metrics.lowStock.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-4 text-sm text-muted-foreground",
					children: "All products are well-stocked."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-4 space-y-4 text-sm",
					children: metrics.lowStock.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("b", { children: p.name }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "text-destructive",
							children: [p.stockQuantity, " remaining"]
						})
					] }, p.id))
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "mt-6 rounded-lg border bg-card p-5",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-semibold",
				children: "Recent Orders"
			}), metrics.recentOrders.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-4 text-sm text-muted-foreground",
				children: "No orders yet."
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-4 overflow-x-auto",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-left text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", {
						className: "border-b text-muted-foreground",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-3",
								children: "Order"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-3",
								children: "Customer"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-3",
								children: "Total"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "pb-3",
								children: "Status"
							})
						] })
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", { children: metrics.recentOrders.map((o) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b last:border-0",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
								className: "py-3 font-medium",
								children: o.number
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: o.user.name }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("td", { children: ["₹", Number(o.total).toLocaleString("en-IN")] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: `rounded-full px-2 py-1 text-xs font-medium ${statusStyle[o.status] ?? "bg-gray-100 text-gray-800"}`,
								children: o.status.charAt(0) + o.status.slice(1).toLowerCase()
							}) })
						]
					}, o.id)) })]
				})
			})]
		})
	] });
}
var Dialog = Dialog$1;
var DialogPortal = DialogPortal$1;
var DialogOverlay = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay$1, {
	ref,
	className: cn("fixed inset-0 z-50 bg-black/80  data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0", className),
	...props
}));
DialogOverlay.displayName = DialogOverlay$1.displayName;
var DialogContent = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent$1, {
	ref,
	className: cn("fixed left-[50%] top-[50%] z-50 grid w-full max-w-lg translate-x-[-50%] translate-y-[-50%] gap-4 border bg-background p-6 shadow-lg duration-200 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0 data-[state=closed]:zoom-out-95 data-[state=open]:zoom-in-95 sm:rounded-lg", className),
	...props,
	children: [children, /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
		className: "absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background cursor-pointer transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:pointer-events-none data-[state=open]:bg-accent data-[state=open]:text-muted-foreground",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "sr-only",
			children: "Close"
		})]
	})]
})] }));
DialogContent.displayName = DialogContent$1.displayName;
var DialogHeader = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col space-y-1.5 text-center sm:text-left", className),
	...props
});
DialogHeader.displayName = "DialogHeader";
var DialogFooter = ({ className, ...props }) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
	className: cn("flex flex-col-reverse sm:flex-row sm:justify-end sm:space-x-2", className),
	...props
});
DialogFooter.displayName = "DialogFooter";
var DialogTitle = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle$1, {
	ref,
	className: cn("text-lg font-semibold leading-none tracking-tight", className),
	...props
}));
DialogTitle.displayName = DialogTitle$1.displayName;
var DialogDescription = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription$1, {
	ref,
	className: cn("text-sm text-muted-foreground", className),
	...props
}));
DialogDescription.displayName = DialogDescription$1.displayName;
var emptyForm$1 = {
	name: "",
	slug: "",
	sku: "",
	description: "",
	price: "",
	compareAtPrice: "",
	stockQuantity: "",
	lowStockThreshold: "5",
	featured: false,
	categoryId: ""
};
function generateSlug(name) {
	return name.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");
}
function statusBadge$1(product) {
	if (product.stockQuantity <= 0) return {
		text: "Out of Stock",
		className: "rounded-full bg-red-100 px-2 py-0.5 text-xs text-red-800"
	};
	if (product.stockQuantity <= product.lowStockThreshold) return {
		text: "Low Stock",
		className: "rounded-full bg-amber-100 px-2 py-0.5 text-xs text-amber-800"
	};
	return {
		text: "In Stock",
		className: "rounded-full bg-green-100 px-2 py-0.5 text-xs text-green-800"
	};
}
function Input({ label, value, onChange, type = "text", placeholder, required }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
		className: "text-sm font-medium",
		children: [label, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
			type,
			value,
			onChange: (e) => onChange(e.target.value),
			placeholder,
			required,
			className: "mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm"
		})]
	});
}
function ProductsSection({ token }) {
	const [products, setProducts] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)("");
	const [query, setQuery] = (0, import_react.useState)("");
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [formData, setFormData] = (0, import_react.useState)(emptyForm$1);
	const [editId, setEditId] = (0, import_react.useState)(null);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [deleteConfirm, setDeleteConfirm] = (0, import_react.useState)(null);
	const loadProducts = (0, import_react.useCallback)(async () => {
		setLoading(true);
		setError("");
		try {
			const res = await fetchProducts(token);
			setProducts(res.value || []);
		} catch {
			setError("Failed to load products");
		} finally {
			setLoading(false);
		}
	}, [token]);
	(0, import_react.useEffect)(() => {
		loadProducts();
	}, [loadProducts]);
	const openAddModal = () => {
		setEditId(null);
		setFormData(emptyForm$1);
		setModalOpen(true);
	};
	const openEditModal = (product) => {
		setEditId(product.id);
		setFormData({
			name: product.name,
			slug: product.slug,
			sku: product.sku,
			description: product.description,
			price: product.price.toString(),
			compareAtPrice: product.compareAtPrice?.toString() || "",
			stockQuantity: product.stockQuantity.toString(),
			lowStockThreshold: product.lowStockThreshold.toString(),
			featured: product.featured,
			categoryId: product.categoryId || ""
		});
		setModalOpen(true);
	};
	const handleNameChange = (name) => {
		if (!editId) setFormData((prev) => ({
			...prev,
			name,
			slug: generateSlug(name)
		}));
		else setFormData((prev) => ({
			...prev,
			name
		}));
	};
	const handleSave = async () => {
		if (!formData.name || !formData.slug || !formData.sku || !formData.description || !formData.price) {
			toast.error("Please fill all required fields");
			return;
		}
		setSaving(true);
		try {
			const payload = {
				name: formData.name,
				slug: formData.slug,
				sku: formData.sku,
				description: formData.description,
				price: Number(formData.price),
				compareAtPrice: formData.compareAtPrice ? Number(formData.compareAtPrice) : void 0,
				stockQuantity: Number(formData.stockQuantity),
				lowStockThreshold: Number(formData.lowStockThreshold),
				featured: formData.featured,
				categoryId: formData.categoryId || void 0
			};
			if (editId) {
				await updateProduct(editId, payload, token);
				toast.success("Product updated");
			} else {
				await createProduct(payload, token);
				toast.success("Product created");
			}
			setModalOpen(false);
			await loadProducts();
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to save product";
			toast.error(msg);
		} finally {
			setSaving(false);
		}
	};
	const handleDeleteConfirmed = async () => {
		if (!deleteConfirm) return;
		try {
			await deleteProduct(deleteConfirm, token);
			toast.success("Product deleted");
			setDeleteConfirm(null);
			await loadProducts();
		} catch (err) {
			const msg = err instanceof Error ? err.message : "Failed to delete product";
			toast.error(msg);
		}
	};
	const filtered = products.filter((p) => {
		const search = query.toLowerCase();
		return p.name.toLowerCase().includes(search) || p.sku.toLowerCase().includes(search);
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border bg-card p-5",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-between",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Products"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Manage your product catalog."
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-6 text-sm text-destructive",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				onClick: loadProducts,
				className: "mt-4 rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
				children: "Retry"
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "rounded-lg border bg-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Products"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Manage your product catalog."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: openAddModal,
					className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
					children: "Add product"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mb-4 max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search products",
						className: "w-full rounded-md border py-2 pl-9 pr-3 text-sm"
					})]
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Loading..."
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No products found."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: filtered.map((product) => {
						const status = statusBadge$1(product);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 rounded-md border p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: product.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									product.sku,
									" · $",
									product.price,
									" · ",
									product.stockQuantity,
									" pc · ",
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
										className: status.className,
										children: status.text
									})
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "rounded border px-3 py-1.5 text-sm",
									onClick: () => openEditModal(product),
									children: "Edit"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									className: "rounded border border-destructive px-3 py-1.5 text-sm text-destructive",
									onClick: () => setDeleteConfirm(product.id),
									children: "Delete"
								})]
							})]
						}, product.id);
					})
				})]
			})]
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: modalOpen,
			onOpenChange: setModalOpen,
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-lg",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editId ? "Edit product" : "Add product" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "grid gap-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Name",
									value: formData.name,
									onChange: handleNameChange,
									required: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Slug",
									value: formData.slug,
									onChange: (v) => setFormData((p) => ({
										...p,
										slug: v
									})),
									required: true
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "SKU",
									value: formData.sku,
									onChange: (v) => setFormData((p) => ({
										...p,
										sku: v
									})),
									required: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Category ID",
									value: formData.categoryId,
									onChange: (v) => setFormData((p) => ({
										...p,
										categoryId: v
									}))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "text-sm font-medium",
								children: ["Description", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
									value: formData.description,
									onChange: (e) => setFormData((p) => ({
										...p,
										description: e.target.value
									})),
									required: true,
									rows: 3,
									className: "mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Price",
									type: "number",
									value: formData.price,
									onChange: (v) => setFormData((p) => ({
										...p,
										price: v
									})),
									required: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Compare-at Price",
									type: "number",
									value: formData.compareAtPrice,
									onChange: (v) => setFormData((p) => ({
										...p,
										compareAtPrice: v
									}))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "grid grid-cols-2 gap-4",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Stock Quantity",
									type: "number",
									value: formData.stockQuantity,
									onChange: (v) => setFormData((p) => ({
										...p,
										stockQuantity: v
									})),
									required: true
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									label: "Low Stock Threshold",
									type: "number",
									value: formData.lowStockThreshold,
									onChange: (v) => setFormData((p) => ({
										...p,
										lowStockThreshold: v
									}))
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
								className: "flex items-center gap-2 text-sm font-medium",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
									type: "checkbox",
									checked: formData.featured,
									onChange: (e) => setFormData((p) => ({
										...p,
										featured: e.target.checked
									})),
									className: "size-4"
								}), "Featured"]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setModalOpen(false),
						className: "rounded border px-3 py-1.5 text-sm",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSave,
						disabled: saving,
						className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: saving ? "Saving..." : editId ? "Update" : "Create"
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
			open: !!deleteConfirm,
			onOpenChange: (open) => {
				if (!open) setDeleteConfirm(null);
			},
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
				className: "max-w-sm",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Delete product" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Are you sure you want to delete this product? This action cannot be undone."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setDeleteConfirm(null),
						className: "rounded border px-3 py-1.5 text-sm",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleDeleteConfirmed,
						className: "rounded border border-destructive px-3 py-1.5 text-sm text-destructive",
						children: "Delete"
					})] })
				]
			})
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {})
	] });
}
function CategoriesSection({ token }) {
	const [categories, setCategories] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [query, setQuery] = (0, import_react.useState)("");
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [formName, setFormName] = (0, import_react.useState)("");
	const [formSlug, setFormSlug] = (0, import_react.useState)("");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [confirmDelete, setConfirmDelete] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	async function load() {
		try {
			setLoading(true);
			setError(null);
			const res = await fetchCategories(token);
			setCategories(res.value);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load categories");
		} finally {
			setLoading(false);
		}
	}
	(0, import_react.useEffect)(() => {
		load();
	}, [token]);
	const filtered = categories.filter((c) => c.name.toLowerCase().includes(query.toLowerCase()) || c.slug.toLowerCase().includes(query.toLowerCase()));
	function slugify(name) {
		return name.toLowerCase().trim().replace(/[^a-z0-9\s-]/g, "").replace(/\s+/g, "-").replace(/-+/g, "-");
	}
	function openCreate() {
		setEditing(null);
		setFormName("");
		setFormSlug("");
		setModalOpen(true);
	}
	function openEdit(cat) {
		setEditing(cat);
		setFormName(cat.name);
		setFormSlug(cat.slug);
		setModalOpen(true);
	}
	function handleNameChange(val) {
		setFormName(val);
		if (!editing) setFormSlug(slugify(val));
	}
	async function handleSave() {
		if (!formName.trim() || !formSlug.trim()) {
			toast.error("Name and slug are required");
			return;
		}
		setSaving(true);
		try {
			if (editing) {
				await updateCategory(editing.id, {
					name: formName.trim(),
					slug: formSlug.trim()
				}, token);
				toast.success("Category updated");
			} else {
				await createCategory({
					name: formName.trim(),
					slug: formSlug.trim()
				}, token);
				toast.success("Category created");
			}
			setModalOpen(false);
			await load();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Save failed");
		} finally {
			setSaving(false);
		}
	}
	async function handleDelete() {
		if (!confirmDelete) return;
		setDeleting(true);
		try {
			await deleteCategory(confirmDelete.id, token);
			toast.success("Category deleted");
			setConfirmDelete(null);
			await load();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Delete failed");
		} finally {
			setDeleting(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Categories"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Organize your products into categories."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: openCreate,
					className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
					children: "Add category"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mb-4 max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search categories",
							className: "w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm"
						})]
					}),
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "Loading categories..."
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-destructive",
						children: error
					}),
					!loading && !error && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground",
						children: "No categories found."
					}),
					!loading && !error && filtered.map((cat) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 rounded-md border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: cat.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-1 flex flex-wrap items-center gap-3 text-xs text-muted-foreground",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["/", cat.slug] }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: cat.image ? "✓ Image" : "No image" }),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [cat._count?.products ?? 0, " products"] })
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => openEdit(cat),
								className: "rounded border px-3 py-1.5 text-sm",
								children: "Edit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setConfirmDelete(cat),
								className: "rounded border border-destructive px-3 py-1.5 text-sm text-destructive",
								children: "Delete"
							})]
						})]
					}, cat.id))
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: modalOpen,
				onOpenChange: setModalOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit category" : "Add category" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4 py-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm font-medium",
							children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: formName,
								onChange: (e) => handleNameChange(e.target.value),
								className: "mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm",
								required: true
							})]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "text-sm font-medium",
							children: ["Slug", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								value: formSlug,
								onChange: (e) => setFormSlug(e.target.value),
								className: "mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm",
								required: true
							})]
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setModalOpen(false),
						className: "rounded border px-3 py-1.5 text-sm",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSave,
						disabled: saving,
						className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
						children: saving ? "Saving..." : editing ? "Update" : "Create"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!confirmDelete,
				onOpenChange: (open) => {
					if (!open) setConfirmDelete(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Delete category" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"Are you sure you want to delete \"",
							confirmDelete?.name,
							"\"? This action cannot be undone."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setConfirmDelete(null),
						className: "rounded border px-3 py-1.5 text-sm",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleDelete,
						disabled: deleting,
						className: "rounded border border-destructive px-3 py-1.5 text-sm text-destructive disabled:opacity-50",
						children: deleting ? "Deleting..." : "Delete"
					})] })
				] })
			})
		]
	});
}
var STATUS_STYLES = {
	PENDING: "bg-amber-100 text-amber-800",
	CONFIRMED: "bg-blue-100 text-blue-800",
	PACKED: "bg-indigo-100 text-indigo-800",
	SHIPPED: "bg-purple-100 text-purple-800",
	DELIVERED: "bg-emerald-100 text-emerald-800",
	CANCELLED: "bg-red-100 text-red-800",
	REFUNDED: "bg-gray-100 text-gray-800"
};
var STATUS_OPTIONS$1 = [
	"PENDING",
	"CONFIRMED",
	"PACKED",
	"SHIPPED",
	"DELIVERED",
	"CANCELLED",
	"REFUNDED"
];
function formatDate(dateStr) {
	return new Date(dateStr).toLocaleDateString("en-IN", {
		year: "numeric",
		month: "short",
		day: "numeric"
	});
}
function OrdersSection({ token }) {
	const [orders, setOrders] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [search, setSearch] = (0, import_react.useState)("");
	const [updatingId, setUpdatingId] = (0, import_react.useState)(null);
	const loadOrders = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchOrders(token);
			setOrders(data.value);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load orders");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadOrders();
	}, [token]);
	const filtered = orders.filter((o) => {
		const q = search.toLowerCase();
		return o.number.toLowerCase().includes(q) || o.user.name.toLowerCase().includes(q);
	});
	const handleStatusChange = async (orderId, newStatus) => {
		setUpdatingId(orderId);
		try {
			await updateOrderStatus(orderId, newStatus, token);
			setOrders((prev) => prev.map((o) => o.id === orderId ? {
				...o,
				status: newStatus
			} : o));
			toast.success(`Order status updated to ${newStatus}`);
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to update status");
		} finally {
			setUpdatingId(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "rounded-lg border bg-card",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Orders"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Customer details · Items · Invoice · Update status"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
					onClick: () => toast.info("Export coming soon"),
					children: "Export orders"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative mb-4 max-w-md",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: search,
							onChange: (e) => setSearch(e.target.value),
							placeholder: "Search orders…",
							className: "w-full rounded-md border py-2 pl-9 pr-3 text-sm"
						})]
					}),
					loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center justify-center py-12",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" })
					}),
					error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive",
						children: [
							error,
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: loadOrders,
								className: "ml-3 underline",
								children: "Retry"
							})
						]
					}),
					!loading && !error && filtered.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "py-12 text-center text-sm text-muted-foreground",
						children: "No orders found."
					}),
					!loading && !error && filtered.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "space-y-2",
						children: filtered.map((order) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 rounded-md border p-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: order.number
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									order.user.name,
									" · ",
									order.items.length,
									" item",
									order.items.length !== 1 ? "s" : "",
									" · ₹",
									Number(order.total).toLocaleString("en-IN"),
									" · ",
									formatDate(order.createdAt)
								]
							})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-2",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${STATUS_STYLES[order.status] ?? "bg-gray-100 text-gray-800"}`,
									children: order.status
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
									value: order.status,
									disabled: updatingId === order.id,
									onChange: (e) => handleStatusChange(order.id, e.target.value),
									className: "rounded-md border bg-background px-2 py-1 text-xs outline-none focus:ring-2 focus:ring-ring disabled:opacity-50",
									children: STATUS_OPTIONS$1.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
										value: s,
										children: s
									}, s))
								})]
							})]
						}, order.id))
					})
				]
			})]
		})]
	});
}
function CustomersSection({ token }) {
	const [customers, setCustomers] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [query, setQuery] = (0, import_react.useState)("");
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		setLoading(true);
		fetchCustomers(token).then((res) => {
			if (!cancelled) setCustomers(res.value);
		}).catch(() => {
			if (!cancelled) toast.error("Failed to load customers");
		}).finally(() => {
			if (!cancelled) setLoading(false);
		});
		return () => {
			cancelled = true;
		};
	}, [token]);
	const filtered = customers.filter((c) => {
		const q = query.toLowerCase();
		return c.name.toLowerCase().includes(q) || c.email.toLowerCase().includes(q);
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Customers"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Manage your customer directory."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
					children: "Export customers"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mb-4 max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search customers",
						className: "w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm"
					})]
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-pulse rounded-md border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-48 rounded bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 h-3 w-32 rounded bg-muted" })]
					}, i))
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No customers found."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: filtered.map((c) => {
						const orderCount = c.orders?.length ?? 0;
						const totalSpend = c.orders?.reduce((sum, o) => sum + Number(o.total), 0) ?? 0;
						return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex flex-wrap items-center justify-between gap-3 rounded-md border p-4",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: c.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									c.email,
									" · ",
									orderCount,
									" order",
									orderCount !== 1 ? "s" : "",
									" · ₹",
									totalSpend.toLocaleString("en-IN")
								]
							})] })
						}, c.id);
					})
				})]
			})
		]
	});
}
var STATUS_OPTIONS = [
	"ALL",
	"NEW",
	"CONTACTED",
	"APPROVED",
	"REJECTED",
	"ON_HOLD"
];
var statusBadge = {
	NEW: "bg-blue-100 text-blue-800",
	CONTACTED: "bg-amber-100 text-amber-800",
	APPROVED: "bg-green-100 text-green-800",
	REJECTED: "bg-red-100 text-red-800",
	ON_HOLD: "bg-gray-100 text-gray-600"
};
function EnquiriesSection({ token }) {
	const [enquiries, setEnquiries] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [query, setQuery] = (0, import_react.useState)("");
	const [statusFilter, setStatusFilter] = (0, import_react.useState)("ALL");
	const [notesOpen, setNotesOpen] = (0, import_react.useState)(false);
	const [activeEnquiry, setActiveEnquiry] = (0, import_react.useState)(null);
	const [noteText, setNoteText] = (0, import_react.useState)("");
	const [submittingNote, setSubmittingNote] = (0, import_react.useState)(false);
	const load = () => {
		setLoading(true);
		fetchEnquiries(token, statusFilter === "ALL" ? void 0 : statusFilter).then((res) => setEnquiries(res.value)).catch(() => toast.error("Failed to load enquiries")).finally(() => setLoading(false));
	};
	(0, import_react.useEffect)(() => {
		load();
	}, [token, statusFilter]);
	const filtered = enquiries.filter((e) => {
		const q = query.toLowerCase();
		return e.name.toLowerCase().includes(q) || e.email.toLowerCase().includes(q) || (e.companyName ?? "").toLowerCase().includes(q);
	});
	const handleStatus = async (id, status) => {
		try {
			const updated = await updateEnquiryStatus(id, status, token);
			setEnquiries((prev) => prev.map((e) => e.id === id ? {
				...e,
				status: updated.status
			} : e));
			toast.success(`Enquiry ${status.toLowerCase()}`);
		} catch {
			toast.error("Failed to update status");
		}
	};
	const handleDelete = async (id) => {
		if (!confirm("Delete this enquiry?")) return;
		try {
			await deleteEnquiry(id, token);
			setEnquiries((prev) => prev.filter((e) => e.id !== id));
			toast.success("Enquiry deleted");
		} catch {
			toast.error("Failed to delete enquiry");
		}
	};
	const handleAddNote = async () => {
		if (!activeEnquiry || !noteText.trim()) return;
		setSubmittingNote(true);
		try {
			await addEnquiryNote(activeEnquiry.id, noteText.trim(), token);
			const res = await fetchEnquiries(token, statusFilter === "ALL" ? void 0 : statusFilter);
			setEnquiries(res.value);
			const refreshed = res.value.find((e) => e.id === activeEnquiry.id) ?? activeEnquiry;
			setActiveEnquiry(refreshed);
			setNoteText("");
			toast.success("Note added");
		} catch {
			toast.error("Failed to add note");
		} finally {
			setSubmittingNote(false);
		}
	};
	const handleExport = async () => {
		try {
			const resp = await exportEnquiriesCsv(token);
			if (!resp.ok) throw new Error("Export failed");
			const blob = await resp.blob();
			const url = URL.createObjectURL(blob);
			const a = document.createElement("a");
			a.href = url;
			a.download = "enquiries.csv";
			a.click();
			URL.revokeObjectURL(url);
			toast.success("CSV downloaded");
		} catch {
			toast.error("Failed to export CSV");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Seller enquiries"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Review and manage seller applications."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: handleExport,
					className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
					children: "Export CSV"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-4 flex flex-wrap items-center gap-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative max-w-md flex-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							value: query,
							onChange: (e) => setQuery(e.target.value),
							placeholder: "Search enquiries",
							className: "w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("select", {
						value: statusFilter,
						onChange: (e) => setStatusFilter(e.target.value),
						className: "rounded-md border bg-background px-3 py-2 text-sm",
						children: STATUS_OPTIONS.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("option", {
							value: s,
							children: s === "ALL" ? "All statuses" : s.replace("_", " ")
						}, s))
					})]
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-pulse rounded-md border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-48 rounded bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 h-3 w-32 rounded bg-muted" })]
					}, i))
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No enquiries found."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: filtered.map((enq) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 rounded-md border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "font-medium",
							children: enq.companyName || enq.name
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-1 text-xs text-muted-foreground",
							children: [
								enq.email,
								" · ",
								new Date(enq.createdAt).toLocaleDateString("en-IN")
							]
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
									className: `rounded-full px-2 py-1 text-xs font-medium ${statusBadge[enq.status] ?? "bg-gray-100 text-gray-600"}`,
									children: enq.status.replace("_", " ")
								}),
								(enq.status === "NEW" || enq.status === "CONTACTED" || enq.status === "ON_HOLD") && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleStatus(enq.id, "APPROVED"),
									className: "text-sm text-emerald-600 hover:underline",
									children: "Approve"
								}),
								enq.status !== "REJECTED" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleStatus(enq.id, "REJECTED"),
									className: "text-sm text-red-600 hover:underline",
									children: "Reject"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => {
										setActiveEnquiry(enq);
										setNotesOpen(true);
									},
									className: "rounded border px-3 py-1.5 text-sm",
									children: "Notes"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									onClick: () => handleDelete(enq.id),
									className: "rounded border border-destructive px-3 py-1.5 text-sm text-destructive",
									children: "Delete"
								})
							]
						})]
					}, enq.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: notesOpen,
				onOpenChange: (open) => {
					setNotesOpen(open);
					if (!open) {
						setActiveEnquiry(null);
						setNoteText("");
					}
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogTitle, { children: ["Notes — ", activeEnquiry?.companyName || activeEnquiry?.name] }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "max-h-64 overflow-y-auto space-y-2",
							children: activeEnquiry?.notes && activeEnquiry.notes.length > 0 ? activeEnquiry.notes.map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "rounded border p-3 text-sm",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: n.body }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "mt-1 text-xs text-muted-foreground",
									children: new Date(n.createdAt).toLocaleString("en-IN")
								})]
							}, n.id)) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted-foreground",
								children: "No notes yet."
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: noteText,
							onChange: (e) => setNoteText(e.target.value),
							placeholder: "Add a note…",
							rows: 3,
							className: "w-full rounded-md border bg-background px-3 py-2 text-sm"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleAddNote,
							disabled: submittingNote || !noteText.trim(),
							className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
							children: submittingNote ? "Saving…" : "Add note"
						}) })
					]
				})
			})
		]
	});
}
var emptyForm = {
	name: "",
	logoUrl: "",
	sortOrder: 0,
	active: true
};
function BrandsSection({ token }) {
	const [brands, setBrands] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [query, setQuery] = (0, import_react.useState)("");
	const [modalOpen, setModalOpen] = (0, import_react.useState)(false);
	const [editing, setEditing] = (0, import_react.useState)(null);
	const [form, setForm] = (0, import_react.useState)(emptyForm);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const load = () => {
		setLoading(true);
		fetchBrands(token).then((res) => setBrands(res.value)).catch(() => toast.error("Failed to load brands")).finally(() => setLoading(false));
	};
	(0, import_react.useEffect)(() => {
		load();
	}, [token]);
	const filtered = brands.filter((b) => b.name.toLowerCase().includes(query.toLowerCase()));
	const openCreate = () => {
		setEditing(null);
		setForm(emptyForm);
		setModalOpen(true);
	};
	const openEdit = (b) => {
		setEditing(b);
		setForm({
			name: b.name,
			logoUrl: b.logoUrl,
			sortOrder: b.sortOrder,
			active: b.active
		});
		setModalOpen(true);
	};
	const handleSave = async () => {
		if (!form.name.trim()) {
			toast.error("Name is required");
			return;
		}
		setSaving(true);
		try {
			if (editing) {
				const updated = await updateBrand(editing.id, form, token);
				setBrands((prev) => prev.map((b) => b.id === editing.id ? updated : b));
				toast.success("Brand updated");
			} else {
				const created = await createBrand(form, token);
				setBrands((prev) => [...prev, created]);
				toast.success("Brand created");
			}
			setModalOpen(false);
		} catch {
			toast.error(editing ? "Failed to update brand" : "Failed to create brand");
		} finally {
			setSaving(false);
		}
	};
	const handleDelete = async (id) => {
		if (!confirm("Delete this brand?")) return;
		try {
			await deleteBrand(id, token);
			setBrands((prev) => prev.filter((b) => b.id !== id));
			toast.success("Brand deleted");
		} catch {
			toast.error("Failed to delete brand");
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
		className: "rounded-lg border bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-center justify-between gap-3 border-b p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-semibold",
					children: "Brand collaborations"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "Manage partner brands and display order."
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: openCreate,
					className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
					children: "Add brand"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative mb-4 max-w-md",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "absolute left-3 top-2.5 size-4 text-muted-foreground" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						value: query,
						onChange: (e) => setQuery(e.target.value),
						placeholder: "Search brands",
						className: "w-full rounded-md border bg-background py-2 pl-9 pr-3 text-sm"
					})]
				}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: Array.from({ length: 5 }).map((_, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "animate-pulse rounded-md border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-4 w-48 rounded bg-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "mt-2 h-3 w-32 rounded bg-muted" })]
					}, i))
				}) : filtered.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground",
					children: "No brands found."
				}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-2",
					children: filtered.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap items-center justify-between gap-3 rounded-md border p-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex items-center gap-3",
							children: [b.logoUrl && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
								src: b.logoUrl,
								alt: b.name,
								className: "h-8 w-8 rounded object-contain"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-medium",
								children: b.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-1 text-xs text-muted-foreground",
								children: [
									"Sort order ",
									b.sortOrder,
									" · ",
									b.active ? "Active" : "Inactive"
								]
							})] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => openEdit(b),
								className: "rounded border px-3 py-1.5 text-sm",
								children: "Edit"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleDelete(b.id),
								className: "rounded border border-destructive px-3 py-1.5 text-sm text-destructive",
								children: "Delete"
							})]
						})]
					}, b.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: modalOpen,
				onOpenChange: (open) => {
					setModalOpen(open);
					if (!open) setEditing(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-lg",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: editing ? "Edit brand" : "Add brand" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-4",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-sm font-medium",
									children: ["Name", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: form.name,
										onChange: (e) => setForm((f) => ({
											...f,
											name: e.target.value
										})),
										className: "mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm",
										placeholder: "Brand name"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-sm font-medium",
									children: ["Logo URL", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										value: form.logoUrl,
										onChange: (e) => setForm((f) => ({
											...f,
											logoUrl: e.target.value
										})),
										className: "mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm",
										placeholder: "https://..."
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-sm font-medium",
									children: ["Sort order", /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "number",
										value: form.sortOrder,
										onChange: (e) => setForm((f) => ({
											...f,
											sortOrder: Number(e.target.value)
										})),
										className: "mt-1.5 w-full rounded-md border bg-background px-3 py-2 text-sm"
									})]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "flex items-center gap-2 text-sm font-medium",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
										type: "checkbox",
										checked: form.active,
										onChange: (e) => setForm((f) => ({
											...f,
											active: e.target.checked
										})),
										className: "rounded"
									}), "Active"]
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							onClick: handleSave,
							disabled: saving,
							className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
							children: saving ? "Saving…" : editing ? "Update" : "Create"
						}) })
					]
				})
			})
		]
	});
}
var BLOCK_LABELS = {
	hero_banners: "Hero banner, text and buttons",
	featured_products: "Featured products",
	promotional_banners: "Offers and promotional banner",
	categories: "Category section",
	trusted_brands: "Brand logos and collaboration section",
	footer: "Footer text and contact details"
};
function CmsSection({ token }) {
	const [blocks, setBlocks] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [selectedBlock, setSelectedBlock] = (0, import_react.useState)(null);
	const [editContent, setEditContent] = (0, import_react.useState)("");
	const [editError, setEditError] = (0, import_react.useState)(null);
	const [savingId, setSavingId] = (0, import_react.useState)(null);
	const loadBlocks = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchHomepageBlocks(token);
			setBlocks(data.value);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load homepage blocks");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadBlocks();
	}, [token]);
	const handleConfigure = (block) => {
		setSelectedBlock(block);
		setEditContent(JSON.stringify(block.content, null, 2));
		setEditError(null);
	};
	const handleSave = async () => {
		if (!selectedBlock) return;
		setEditError(null);
		let parsed;
		try {
			parsed = JSON.parse(editContent);
		} catch {
			setEditError("Invalid JSON. Please correct it before saving.");
			return;
		}
		setSavingId(selectedBlock.id);
		try {
			await updateHomepageBlock(selectedBlock.id, parsed, token);
			toast.success(`Block "${selectedBlock.key}" saved`);
			setSelectedBlock(null);
			loadBlocks();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to save block");
		} finally {
			setSavingId(null);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold tracking-tight",
					children: "Homepage CMS"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Manage homepage content blocks"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
					onClick: () => toast.info("Changes are saved per-block via the Configure button."),
					children: "Save changes"
				})]
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" })
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive",
				children: [error, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: loadBlocks,
					className: "ml-3 underline underline-offset-2 hover:text-destructive/80",
					children: "Retry"
				})]
			}),
			!loading && !error && blocks.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-12 text-center text-sm text-muted-foreground",
				children: "No homepage blocks found."
			}),
			!loading && !error && blocks.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-lg border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("table", {
					className: "w-full text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("thead", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
						className: "border-b bg-muted/50 text-left text-xs font-medium uppercase tracking-wider text-muted-foreground",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Block Key"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Description"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3",
								children: "Updated"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("th", {
								className: "px-4 py-3 text-right",
								children: "Action"
							})
						]
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("tbody", {
						className: "divide-y",
						children: blocks.map((block) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("tr", {
							className: "hover:bg-muted/30 transition-colors",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 font-medium",
									children: block.key
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: BLOCK_LABELS[block.key] || block.key
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-muted-foreground",
									children: new Date(block.updatedAt).toLocaleDateString("en-IN", {
										year: "numeric",
										month: "short",
										day: "numeric"
									})
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("td", {
									className: "px-4 py-3 text-right",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
										onClick: () => handleConfigure(block),
										className: "rounded border px-3 py-1.5 text-sm",
										children: "Configure"
									})
								})
							]
						}, block.id))
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!selectedBlock,
				onOpenChange: (open) => {
					if (!open) setSelectedBlock(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: selectedBlock?.key ? `Configure: ${BLOCK_LABELS[selectedBlock.key] || selectedBlock.key}` : "Configure block" }) }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
								className: "text-sm font-medium",
								children: "Content (JSON)"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
								className: "mt-1.5 h-96 w-full rounded-md border px-3 py-2 font-mono text-sm outline-none focus:ring-2 focus:ring-ring",
								value: editContent,
								onChange: (e) => setEditContent(e.target.value)
							}),
							editError && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 text-sm text-destructive",
								children: editError
							})
						] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded border px-3 py-1.5 text-sm",
							onClick: () => setSelectedBlock(null),
							children: "Cancel"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
							disabled: savingId !== null,
							onClick: handleSave,
							children: savingId !== null ? "Saving..." : "Save"
						})] })
					]
				})
			})
		]
	});
}
function formatSize(bytes) {
	if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(1) + " KB";
	return (bytes / (1024 * 1024)).toFixed(1) + " MB";
}
function MediaSection({ token }) {
	const [mediaList, setMediaList] = (0, import_react.useState)([]);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [error, setError] = (0, import_react.useState)(null);
	const [uploading, setUploading] = (0, import_react.useState)(false);
	const [editItem, setEditItem] = (0, import_react.useState)(null);
	const [editFilename, setEditFilename] = (0, import_react.useState)("");
	const [editAltText, setEditAltText] = (0, import_react.useState)("");
	const [deleteConfirm, setDeleteConfirm] = (0, import_react.useState)(null);
	const [deleting, setDeleting] = (0, import_react.useState)(false);
	const fileInputRef = (0, import_react.useRef)(null);
	const loadMedia = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchMedia(token);
			setMediaList(data.value);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load media");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadMedia();
	}, [token]);
	const handleUpload = async (e) => {
		const files = e.target.files;
		if (!files || files.length === 0) return;
		setUploading(true);
		const toastId = toast.loading(`Uploading ${files.length} file(s)...`);
		try {
			await uploadMedia(files, token);
			toast.success("Upload complete", { id: toastId });
			loadMedia();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Upload failed", { id: toastId });
		} finally {
			setUploading(false);
			if (fileInputRef.current) fileInputRef.current.value = "";
		}
	};
	const handleRename = (item) => {
		setEditItem(item);
		setEditFilename(item.filename);
		setEditAltText(item.altText || "");
	};
	const handleSaveRename = async () => {
		if (!editItem) return;
		try {
			await updateMedia(editItem.id, {
				filename: editFilename,
				altText: editAltText
			}, token);
			toast.success("Media updated");
			setEditItem(null);
			loadMedia();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to update media");
		}
	};
	const handleDelete = async () => {
		if (!deleteConfirm) return;
		setDeleting(true);
		try {
			await deleteMedia(deleteConfirm.id, token);
			toast.success("Media deleted");
			setDeleteConfirm(null);
			loadMedia();
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Failed to delete media");
		} finally {
			setDeleting(false);
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-2xl font-bold tracking-tight",
						children: "Media Library"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted-foreground mt-1",
						children: "Upload and manage images"
					})] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
						disabled: uploading,
						onClick: () => fileInputRef.current?.click(),
						children: uploading ? "Uploading..." : "Upload files"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
						ref: fileInputRef,
						type: "file",
						accept: "image/*",
						multiple: true,
						className: "hidden",
						onChange: handleUpload
					})
				]
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" })
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive",
				children: [error, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: loadMedia,
					className: "ml-3 underline underline-offset-2 hover:text-destructive/80",
					children: "Retry"
				})]
			}),
			!loading && !error && mediaList.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "py-12 text-center text-sm text-muted-foreground",
				children: "No media files yet."
			}),
			!loading && !error && mediaList.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-4 sm:grid-cols-4",
				children: mediaList.map((media) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-md border p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("img", {
							src: media.url,
							alt: media.altText || media.filename,
							className: "aspect-video w-full rounded-md object-cover"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 truncate text-sm font-medium",
							title: media.filename,
							children: media.filename
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground",
							children: formatSize(media.size)
						}),
						media.altText && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs text-muted-foreground truncate",
							title: media.altText,
							children: media.altText
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-2 flex gap-2 text-xs",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => handleRename(media),
								className: "rounded border px-3 py-1.5 text-sm",
								children: "Rename"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								onClick: () => setDeleteConfirm(media),
								className: "rounded border border-destructive px-3 py-1.5 text-sm text-destructive",
								children: "Delete"
							})]
						})
					]
				}, media.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!editItem,
				onOpenChange: (open) => {
					if (!open) setEditItem(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Edit Media" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-4",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm font-medium",
							children: "Filename"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-1.5 w-full rounded-md border px-3 py-2",
							value: editFilename,
							onChange: (e) => setEditFilename(e.target.value)
						})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-sm font-medium",
							children: "Alt Text"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
							className: "mt-1.5 w-full rounded-md border px-3 py-2",
							value: editAltText,
							onChange: (e) => setEditAltText(e.target.value)
						})] })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setEditItem(null),
						className: "rounded border px-3 py-1.5 text-sm",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleSaveRename,
						className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90",
						children: "Save"
					})] })
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: !!deleteConfirm,
				onOpenChange: (open) => {
					if (!open) setDeleteConfirm(null);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Delete Media" }) }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-sm text-muted-foreground",
						children: [
							"Are you sure you want to delete ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: deleteConfirm?.filename }),
							"? This action cannot be undone."
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogFooter, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: () => setDeleteConfirm(null),
						className: "rounded border px-3 py-1.5 text-sm",
						children: "Cancel"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						onClick: handleDelete,
						disabled: deleting,
						className: "rounded border border-destructive px-3 py-1.5 text-sm text-destructive disabled:opacity-50",
						children: deleting ? "Deleting..." : "Delete"
					})] })
				] })
			})
		]
	});
}
var SETTINGS_FIELDS = [
	{
		key: "website_name",
		label: "Website name"
	},
	{
		key: "support_phone",
		label: "Support phone"
	},
	{
		key: "support_email",
		label: "Support email"
	},
	{
		key: "business_address",
		label: "Business address"
	},
	{
		key: "facebook_url",
		label: "Facebook URL"
	},
	{
		key: "instagram_url",
		label: "Instagram URL"
	},
	{
		key: "footer_text",
		label: "Footer text"
	},
	{
		key: "support_hours",
		label: "Business hours"
	},
	{
		key: "linkedin_url",
		label: "LinkedIn URL"
	},
	{
		key: "twitter_url",
		label: "Twitter / X URL"
	},
	{
		key: "whatsapp_url",
		label: "WhatsApp URL"
	},
	{
		key: "youtube_url",
		label: "YouTube URL"
	},
	{
		key: "github_url",
		label: "GitHub URL"
	},
	{
		key: "store_logo",
		label: "Store logo URL"
	},
	{
		key: "favicon",
		label: "Favicon URL"
	},
	{
		key: "default_currency",
		label: "Default currency"
	},
	{
		key: "default_tax",
		label: "Default tax"
	},
	{
		key: "free_shipping_limit",
		label: "Free shipping limit"
	},
	{
		key: "smtp_host",
		label: "SMTP Host"
	},
	{
		key: "smtp_port",
		label: "SMTP Port"
	},
	{
		key: "smtp_user",
		label: "SMTP User"
	},
	{
		key: "smtp_pass",
		label: "SMTP Password",
		type: "password"
	},
	{
		key: "razorpay_key_id",
		label: "Razorpay Key ID"
	},
	{
		key: "razorpay_key_secret",
		label: "Razorpay Key Secret",
		type: "password"
	},
	{
		key: "gstin",
		label: "GSTIN"
	}
];
function SettingsSection({ token }) {
	const [values, setValues] = (0, import_react.useState)({});
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [error, setError] = (0, import_react.useState)(null);
	const loadSettings = async () => {
		setLoading(true);
		setError(null);
		try {
			const data = await fetchSettings(token);
			const map = {};
			for (const s of data.value) map[s.key] = s.value != null ? String(s.value) : "";
			setValues(map);
		} catch (err) {
			setError(err instanceof Error ? err.message : "Failed to load settings");
		} finally {
			setLoading(false);
		}
	};
	(0, import_react.useEffect)(() => {
		loadSettings();
	}, [token]);
	const handleChange = (key, val) => {
		setValues((prev) => ({
			...prev,
			[key]: val
		}));
	};
	const handleSave = async () => {
		setSaving(true);
		let successCount = 0;
		let failCount = 0;
		for (const field of SETTINGS_FIELDS) {
			const val = values[field.key];
			if (val !== void 0 && val !== "") try {
				await saveSetting(field.key, val, token);
				successCount++;
			} catch (err) {
				failCount++;
			}
		}
		setSaving(false);
		if (failCount === 0) {
			toast.success(`${successCount} setting(s) saved successfully`);
			loadSettings();
		} else toast.error(`${failCount} setting(s) failed to save. ${successCount} succeeded.`);
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-6",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster$1, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-2xl font-bold tracking-tight",
					children: "Settings"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted-foreground mt-1",
					children: "Configure your store"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "rounded-md bg-primary px-3 py-2 text-sm font-medium text-primary-foreground hover:bg-primary/90 disabled:opacity-50",
					disabled: saving,
					onClick: handleSave,
					children: saving ? "Saving..." : "Save settings"
				})]
			}),
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex items-center justify-center py-12",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" })
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "rounded-md border border-destructive/50 bg-destructive/10 p-4 text-sm text-destructive",
				children: [error, /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					onClick: loadSettings,
					className: "ml-3 underline underline-offset-2 hover:text-destructive/80",
					children: "Retry"
				})]
			}),
			!loading && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-5 grid gap-4 sm:grid-cols-2",
				children: SETTINGS_FIELDS.map((field) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
					className: "text-sm font-medium",
					children: field.label
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
					className: "mt-1.5 w-full rounded-md border px-3 py-2",
					type: field.type || "text",
					value: values[field.key] || "",
					onChange: (e) => handleChange(field.key, e.target.value)
				})] }, field.key))
			})
		]
	});
}
var nav = [
	{
		label: "Dashboard",
		icon: LayoutDashboard
	},
	{
		label: "Products",
		icon: Package
	},
	{
		label: "Categories",
		icon: Boxes
	},
	{
		label: "Homepage CMS",
		icon: House
	},
	{
		label: "Collaborations",
		icon: Box
	},
	{
		label: "Orders",
		icon: ShoppingBag
	},
	{
		label: "Customers",
		icon: Users
	},
	{
		label: "Seller Enquiries",
		icon: Users
	},
	{
		label: "Media Library",
		icon: FileImage
	},
	{
		label: "Settings",
		icon: Settings
	}
];
function AdminDashboard() {
	const { user, loading, logout } = useAuth();
	const navigate = useNavigate();
	const [section, setSection] = (0, import_react.useState)("Dashboard");
	const [open, setOpen] = (0, import_react.useState)(false);
	if (!loading && user?.role !== "ADMIN") {
		navigate({ to: "/admin/login" });
		return null;
	}
	const token = typeof window !== "undefined" ? localStorage.getItem("autoforge_access_token") || void 0 : void 0;
	const Sidebar = () => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
		className: "flex h-full w-64 flex-col border-r bg-card",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between border-b px-5 py-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/",
					className: "font-bold text-primary",
					children: "AUTOFORGE"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					className: "lg:hidden",
					onClick: () => setOpen(false),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, {})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "flex-1 space-y-1 p-3",
				children: nav.map(({ label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
					onClick: () => {
						setSection(label);
						setOpen(false);
					},
					className: `flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm ${section === label ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`,
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "size-4" }), label]
				}, label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
				onClick: () => {
					logout();
					navigate({ to: "/admin/login" });
				},
				className: "m-3 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LogOut, { className: "size-4" }), "Sign out"]
			})
		]
	});
	const renderSection = () => {
		switch (section) {
			case "Dashboard": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardSection, { token });
			case "Products": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProductsSection, { token });
			case "Categories": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CategoriesSection, { token });
			case "Orders": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(OrdersSection, { token });
			case "Customers": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CustomersSection, { token });
			case "Seller Enquiries": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EnquiriesSection, { token });
			case "Collaborations": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandsSection, { token });
			case "Homepage CMS": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CmsSection, { token });
			case "Media Library": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MediaSection, { token });
			case "Settings": return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SettingsSection, { token });
			default: return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DashboardSection, { token });
		}
	};
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-screen bg-muted/40 text-foreground",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-y-0 left-0 z-30 hidden lg:block",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {})
			}),
			open && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "fixed inset-0 z-40 bg-black/30 lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "h-full w-64",
					onClick: (e) => e.stopPropagation(),
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sidebar, {})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "lg:pl-64",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							className: "lg:hidden",
							onClick: () => setOpen(true),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Menu, {})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "font-semibold",
							children: section
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "text-sm text-muted-foreground",
						children: user?.name
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
					className: "mx-auto max-w-7xl p-4 sm:p-6",
					children: renderSection()
				})]
			})
		]
	});
}
//#endregion
export { AdminDashboard as component };
