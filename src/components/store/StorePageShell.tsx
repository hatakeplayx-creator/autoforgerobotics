import type { ReactNode } from "react";
import { AnnouncementBar, TopBar } from "@/components/store/TopBar";
import { StoreHeader } from "@/components/store/StoreHeader";
import { NavBar } from "@/components/store/NavBar";
import { StoreFooter } from "@/components/store/StoreFooter";

export function StorePageShell({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <TopBar />
      <StoreHeader />
      <NavBar />
      <main className="mx-auto max-w-7xl px-4 py-6">{children}</main>
      <StoreFooter />
    </div>
  );
}
