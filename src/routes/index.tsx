import { createFileRoute } from "@tanstack/react-router";
import { AnnouncementBar, TopBar } from "@/components/store/TopBar";
import { StoreHeader } from "@/components/store/StoreHeader";
import { NavBar } from "@/components/store/NavBar";
import { HeroSection } from "@/components/store/HeroSection";
import { CategoryGrid } from "@/components/store/CategoryGrid";
import { FeaturedProducts } from "@/components/store/FeaturedProducts";
import { TrustedBrands } from "@/components/store/TrustedBrands";
import { StoreFooter } from "@/components/store/StoreFooter";

export const Route = createFileRoute("/")({
  component: Index,
});

function Index() {
  return (
    <div className="min-h-screen bg-background">
      <AnnouncementBar />
      <TopBar />
      <StoreHeader />
      <NavBar />
      <main>
        <h1 className="sr-only">AutoForge Robotics — Robotics, Electronics & Maker Components Store</h1>
        <HeroSection />
        <CategoryGrid />
        <FeaturedProducts />
        <TrustedBrands />
      </main>
      <StoreFooter />
    </div>
  );
}
