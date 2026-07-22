import { ArrowDown, ArrowRight, BatteryCharging, CircuitBoard, Cpu, Factory, Printer, ShieldCheck, Truck, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { useHeroBanners, useStoreMetadata } from "@/hooks/useStoreData";
import { Skeleton } from "@/components/ui/skeleton";
import { mediaVariantUrl } from "@/lib/media";

const serviceIcons: Record<string, LucideIcon> = {
  "PCB Manufacturing": CircuitBoard,
  "3D Printing": Printer,
  "Laser Cutting": Zap,
  "Custom Battery Pack": BatteryCharging,
  "Custom Battery Packs": BatteryCharging,
};

const serviceToCategory: Record<string, string> = {
  "PCB Manufacturing": "Development Boards",
  "3D Printing": "3D Printers and Parts",
  "Laser Cutting": "DIY and Maker Kits",
  "Custom Battery Pack": "Batteries, Power Supply and Accessories",
  "Custom Battery Packs": "Batteries, Power Supply and Accessories",
};

const proofPoints = [
  { value: "14+", label: "robotics systems categories" },
  { value: "24h", label: "priority dispatch window" },
  { value: "100%", label: "original catalog sourcing" },
];

const trustItems = [
  [ShieldCheck, "Engineering quality", "Parts selected for dependable lab, classroom, and prototype use."],
  [Truck, "Fast shipping", "Cleanly packed orders with quick dispatch for active build schedules."],
  [Cpu, "Expert support", "Technical guidance from people who understand boards, power, motion, and sensors."],
  [Factory, "Original products", "A focused catalog for teams that need traceable components."],
] satisfies [LucideIcon, string, string][];

export function HeroSection() {
  const { data: banners, loading: bannersLoading, error: bannersError } = useHeroBanners();
  const { data: meta, loading: metaLoading, error: metadataError } = useStoreMetadata();

  if (bannersLoading || metaLoading) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-6">
        <Skeleton className="h-[560px] w-full rounded-[2rem]" />
      </section>
    );
  }

  if (bannersError || metadataError || !meta) {
    return (
      <section className="mx-auto max-w-7xl px-4 py-10">
        <div className="rounded-2xl border border-dashed border-border bg-card px-6 py-12 text-center">
          <h2 className="text-xl font-bold text-foreground">Homepage content is temporarily unavailable</h2>
          <p className="mt-2 text-sm text-muted-foreground">Please refresh the page to try again.</p>
        </div>
      </section>
    );
  }

  const heroImage = mediaVariantUrl(banners?.[0]?.image, "homepageHero") || "/assets/hero-1.jpg";
  const services = meta.services.length ? meta.services : [
    { name: "PCB Manufacturing", emoji: "" },
    { name: "3D Printing", emoji: "" },
    { name: "Laser Cutting", emoji: "" },
    { name: "Custom Battery Packs", emoji: "" },
  ];

  return (
    <>
      <section className="relative overflow-hidden bg-primary text-primary-foreground">
        <div className="absolute inset-0">
          <img
            src={heroImage}
            alt={banners?.[0]?.alt || "AutoForge Robotics engineering workspace"}
            width={1920}
            height={900}
            loading="eager"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = "/assets/hero-1.jpg";
            }}
            className="h-full w-full object-cover opacity-[0.58]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(90deg,oklch(0.12_0.012_248)_0%,oklch(0.14_0.012_248_/_92%)_34%,oklch(0.18_0.012_248_/_28%)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-primary to-transparent" />
        </div>

        <div className="relative mx-auto grid min-h-[calc(100vh-9rem)] max-w-7xl items-end gap-10 px-4 py-10 lg:grid-cols-[1.08fr_0.92fr] lg:py-16">
          <div className="max-w-3xl pb-10">
            <p className="text-xs font-bold uppercase tracking-[0.35em] text-accent">AutoForge Robotics</p>
            <h1 className="mt-5 text-5xl font-black leading-[0.92] tracking-tight sm:text-6xl lg:text-7xl">
              Precision hardware for serious robotics teams.
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-primary-foreground/76 sm:text-lg">
              Build autonomous machines, lab platforms, drones, PCB prototypes, and production-ready experiments with a focused engineering catalog.
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link to="/shop" className="inline-flex items-center justify-center gap-2 rounded-full bg-accent px-6 py-3 text-sm font-black text-accent-foreground shadow-[0_18px_45px_-24px_oklch(0.62_0.185_252)] transition-transform hover:-translate-y-0.5">
                Explore systems <ArrowRight className="h-4 w-4" />
              </Link>
              <Link to="/bulk-enquiry" className="inline-flex items-center justify-center rounded-full border border-primary-foreground/25 bg-primary-foreground/8 px-6 py-3 text-sm font-bold text-primary-foreground backdrop-blur transition-colors hover:bg-primary-foreground/14">
                Talk to an engineer
              </Link>
            </div>
          </div>

          <div className="mb-8 grid gap-3 rounded-2xl border border-primary-foreground/12 bg-primary-foreground/8 p-3 backdrop-blur-xl lg:mb-12">
            {proofPoints.map((item) => (
              <div key={item.label} className="flex items-center justify-between rounded-xl border border-primary-foreground/10 bg-primary/30 px-4 py-4">
                <span className="text-sm text-primary-foreground/70">{item.label}</span>
                <strong className="text-2xl font-black tracking-tight text-primary-foreground">{item.value}</strong>
              </div>
            ))}
          </div>
        </div>

        <div className="absolute bottom-5 left-1/2 hidden -translate-x-1/2 items-center gap-2 text-xs font-semibold uppercase tracking-[0.24em] text-primary-foreground/55 md:flex">
          <ArrowDown className="h-4 w-4 animate-bounce" />
          Scroll
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-14">
        <div className="grid gap-4 md:grid-cols-4">
          {services.slice(0, 4).map((service) => {
            const Icon = serviceIcons[service.name] || CircuitBoard;
            return (
              <Link
                key={service.name}
                to="/shop"
                search={{ category: serviceToCategory[service.name] }}
                className="group rounded-2xl border border-border bg-card p-5 shadow-[var(--shadow-soft)] transition-all hover:-translate-y-1 hover:border-accent/35 hover:shadow-[var(--shadow-raised)]"
              >
                <span className="flex h-11 w-11 items-center justify-center rounded-xl bg-primary text-primary-foreground transition-colors group-hover:bg-accent">
                  <Icon className="h-5 w-5" />
                </span>
                <h3 className="mt-5 text-lg font-black text-foreground">{service.name}</h3>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">Built for teams that need dependable turnaround, clean tolerances, and real technical support.</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 pb-14">
        <div className="rounded-[2rem] bg-card p-6 shadow-[var(--shadow-soft)] md:p-10">
          <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr] lg:items-end">
            <div>
              <p className="text-xs font-black uppercase tracking-[0.28em] text-accent">Why AutoForge</p>
              <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground md:text-5xl">
                Engineering quality, packed into every order.
              </h2>
            </div>
            <div className="grid gap-3 sm:grid-cols-2">
              {trustItems.map(([Icon, title, text]) => (
                <div key={title} className="rounded-2xl border border-border bg-secondary/45 p-5">
                  <Icon className="h-5 w-5 text-accent" />
                  <h3 className="mt-4 font-black text-foreground">{title}</h3>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground">{text}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
