import { useCallback, useEffect, useState } from "react";
import useEmblaCarousel from "embla-carousel-react";
import { CircuitBoard, Printer, Zap, BatteryCharging } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useHeroBanners, useStoreMetadata } from "@/hooks/useStoreData";
import { Skeleton } from "@/components/ui/skeleton";

const serviceIcons: Record<string, any> = {
  "PCB Manufacturing": CircuitBoard,
  "3D Printing": Printer,
  "Laser Cutting": Zap,
  "Custom Battery Pack": BatteryCharging,
};

const serviceToCategory: Record<string, string> = {
  "PCB Manufacturing": "Development Boards",
  "3D Printing": "3D Printers and Parts",
  "Laser Cutting": "DIY and Maker Kits",
  "Custom Battery Pack": "Batteries, Power Supply and Accessories",
};

export function HeroSection() {
  const { data: banners, loading: bannersLoading, error: bannersError } = useHeroBanners();
  const { data: meta, loading: metaLoading, error: metadataError } = useStoreMetadata();

  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true });
  const [selected, setSelected] = useState(0);

  const onSelect = useCallback(() => {
    if (emblaApi) setSelected(emblaApi.selectedScrollSnap());
  }, [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on("select", onSelect);
    const timer = setInterval(() => emblaApi.scrollNext(), 5000);
    return () => {
      clearInterval(timer);
      emblaApi.off("select", onSelect);
    };
  }, [emblaApi, onSelect]);

  if (bannersLoading || metaLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-6">
        <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
          <div className="hidden flex-col gap-3 lg:flex">
            {Array.from({ length: 4 }).map((_, i) => (
              <Skeleton key={i} className="h-[73px] w-full rounded-lg" />
            ))}
          </div>
          <Skeleton className="h-[200px] sm:h-[300px] lg:h-[320px] w-full rounded-xl" />
        </div>
      </section>
    );
  }

  if (bannersError || metadataError || !banners?.length || !meta) {
    return <section className="mx-auto max-w-7xl px-4 py-6"><div className="rounded-xl border border-dashed border-border bg-card px-6 py-12 text-center"><h2 className="text-xl font-bold text-foreground">Homepage content is temporarily unavailable</h2><p className="mt-2 text-sm text-muted-foreground">Please refresh the page to try again.</p></div></section>;
  }

  return (
    <section className="mx-auto max-w-7xl px-4 py-6">
      <div className="grid gap-4 lg:grid-cols-[240px_1fr]">
        <aside className="hidden flex-col gap-2 lg:flex">
          {meta.services.map((s, idx) => {
            const Icon = serviceIcons[s.name] || CircuitBoard;
            const tint = idx % 2 === 0 ? "bg-accent/10" : "bg-primary/10";
            const category = serviceToCategory[s.name];
            return (
              <Link
                key={s.name}
                to="/shop"
                search={{ category }}
                className={`flex flex-1 items-center justify-between rounded-lg ${tint} px-4 py-3 transition-transform hover:-translate-y-0.5`}
              >
                <span className="text-sm font-semibold text-foreground">{s.name}</span>
                <Icon className="h-8 w-8 text-primary" />
              </Link>
            );
          })}
        </aside>

        <div className="relative overflow-hidden rounded-xl bg-secondary/20">
          <div ref={emblaRef} className="overflow-hidden">
            <div className="flex">
              {banners.map((banner, i) => (
                <div key={i} className="min-w-0 flex-[0_0_100%] aspect-[3/1]">
                  <img
                    src={banner.image}
                    alt={banner.alt}
                    width={1920}
                    height={512}
                    loading={i === 0 ? "eager" : "lazy"}
                    onError={(event) => { event.currentTarget.onerror = null; event.currentTarget.src = "/assets/hero-1.jpg"; }}
                    className="h-full w-full object-cover"
                  />
                </div>
              ))}
            </div>
          </div>
          <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
            {banners.map((_, i) => (
              <button
                key={i}
                aria-label={`Go to slide ${i + 1}`}
                onClick={() => emblaApi?.scrollTo(i)}
                className={`h-1.5 rounded-full transition-all cursor-pointer ${
                  selected === i ? "w-5 bg-primary" : "w-1.5 bg-primary/40"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
