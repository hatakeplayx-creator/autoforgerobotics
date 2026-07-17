import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { Box, Boxes, FileImage, Home, LayoutDashboard, LogOut, Menu, Package, Settings, ShoppingBag, Users, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "@/hooks/useAuth";

import DashboardSection from "./components/DashboardSection";
import ProductsSection from "./components/ProductsSection";
import CategoriesSection from "./components/CategoriesSection";
import OrdersSection from "./components/OrdersSection";
import CustomersSection from "./components/CustomersSection";
import EnquiriesSection from "./components/EnquiriesSection";
import BrandsSection from "./components/BrandsSection";
import CmsSection from "./components/CmsSection";
import MediaSection from "./components/MediaSection";
import SettingsSection from "./components/SettingsSection";
import ProductImportSection from "./components/ProductImportSection";

export const Route = createFileRoute("/admin/")({ component: AdminDashboard });

type Section = "Dashboard" | "Products" | "Product Import" | "Categories" | "Homepage CMS" | "Collaborations" | "Orders" | "Customers" | "Seller Enquiries" | "Media Library" | "Settings";
const nav: { label: Section; icon: typeof LayoutDashboard }[] = [
  { label: "Dashboard", icon: LayoutDashboard },
  { label: "Products", icon: Package },
  { label: "Product Import", icon: Package },
  { label: "Categories", icon: Boxes },
  { label: "Homepage CMS", icon: Home },
  { label: "Collaborations", icon: Box },
  { label: "Orders", icon: ShoppingBag },
  { label: "Customers", icon: Users },
  { label: "Seller Enquiries", icon: Users },
  { label: "Media Library", icon: FileImage },
  { label: "Settings", icon: Settings },
];

function AdminDashboard() {
  const { user, loading, logout } = useAuth();
  const navigate = useNavigate();
  const [section, setSection] = useState<Section>("Dashboard");
  const [open, setOpen] = useState(false);

  useEffect(() => {
    if (!loading && user?.role !== "ADMIN") {
      void navigate({ to: "/admin/login" });
    }
  }, [loading, navigate, user?.role]);

  if (!loading && user?.role !== "ADMIN") return null;

  const token = typeof window !== "undefined" ? localStorage.getItem("autoforge_access_token") || undefined : undefined;

  const Sidebar = () => (
    <aside className="flex h-full w-64 flex-col border-r bg-card">
      <div className="flex items-center justify-between border-b px-5 py-5">
        <Link to="/" className="font-bold text-primary">AUTOFORGE</Link>
        <button className="lg:hidden" onClick={() => setOpen(false)}><X /></button>
      </div>
      <nav className="flex-1 space-y-1 p-3">
        {nav.map(({ label, icon: Icon }) => (
          <button
            key={label}
            onClick={() => { setSection(label); setOpen(false); }}
            className={`flex w-full items-center gap-3 rounded-md px-3 py-2.5 text-left text-sm ${section === label ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-muted hover:text-foreground"}`}
          >
            <Icon className="size-4" />{label}
          </button>
        ))}
      </nav>
      <button
        onClick={() => { logout(); navigate({ to: "/admin/login" }); }}
        className="m-3 flex items-center gap-3 rounded-md px-3 py-2 text-sm text-muted-foreground hover:bg-muted"
      >
        <LogOut className="size-4" />Sign out
      </button>
    </aside>
  );

  const renderSection = () => {
    switch (section) {
      case "Dashboard": return <DashboardSection token={token} />;
      case "Products": return <ProductsSection token={token} />;
      case "Product Import": return <ProductImportSection token={token} />;
      case "Categories": return <CategoriesSection token={token} />;
      case "Orders": return <OrdersSection token={token} />;
      case "Customers": return <CustomersSection token={token} />;
      case "Seller Enquiries": return <EnquiriesSection token={token} />;
      case "Collaborations": return <BrandsSection token={token} />;
      case "Homepage CMS": return <CmsSection token={token} />;
      case "Media Library": return <MediaSection token={token} />;
      case "Settings": return <SettingsSection token={token} />;
      default: return <DashboardSection token={token} />;
    }
  };

  return (
    <div className="min-h-screen bg-muted/40 text-foreground">
      <div className="fixed inset-y-0 left-0 z-30 hidden lg:block">
        <Sidebar />
      </div>
      {open && (
        <div className="fixed inset-0 z-40 bg-black/30 lg:hidden">
          <div className="h-full w-64" onClick={(e) => e.stopPropagation()}>
            <Sidebar />
          </div>
        </div>
      )}
      <div className="lg:pl-64">
        <header className="flex h-16 items-center justify-between border-b bg-card px-4 sm:px-6">
          <div className="flex items-center gap-3">
            <button className="lg:hidden" onClick={() => setOpen(true)}><Menu /></button>
            <h1 className="font-semibold">{section}</h1>
          </div>
          <div className="text-sm text-muted-foreground">{user?.name}</div>
        </header>
        <main className="mx-auto max-w-7xl p-4 sm:p-6">
          {renderSection()}
        </main>
      </div>
    </div>
  );
}
