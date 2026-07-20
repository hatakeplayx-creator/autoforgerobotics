import { useEffect, useState } from "react";
import { apiFetch, resolveMediaUrl } from "@/services/api";

type Brand = {
  id: string;
  name: string;
  logoUrl: string;
  active: boolean;
};


function BrandLogo({ brand }: { brand: Brand }) {
  const [failed, setFailed] = useState(false);
  const isPlaceholder = brand.logoUrl.endsWith("placeholder-brand.svg");

  if (!brand.logoUrl || isPlaceholder || failed) {
    return <span className="text-center text-sm font-black tracking-tight text-muted-foreground">{brand.name}</span>;
  }

  const src = resolveMediaUrl(brand.logoUrl);
  return <img src={src} alt={brand.name} onError={() => setFailed(true)} className="max-h-full max-w-full object-contain grayscale transition duration-300 group-hover:grayscale-0" />;
}

export function TrustedBrands() {
  const [brands, setBrands] = useState<Brand[]>([]);

  useEffect(() => {
    apiFetch<Brand[]>("/api/brands")
      .then((rows) => setBrands(rows.filter((brand) => brand.active)))
      .catch(() => setBrands([]));
  }, []);

  if (!brands.length) return null;

  return (
    <section className="mx-auto max-w-7xl px-4 pb-14">
      <div className="mb-8 text-center">
        <p className="text-xs font-black uppercase tracking-[0.28em] text-accent">Technology partners</p>
        <h2 className="mt-3 text-3xl font-black tracking-tight text-foreground md:text-5xl">Trusted supply for modern robotics.</h2>
      </div>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-7">
        {brands.map((brand) => (
          <div key={brand.id} className="group flex aspect-[2/1] items-center justify-center rounded-2xl border border-border bg-card p-4 shadow-sm transition-all hover:-translate-y-0.5 hover:border-accent/35">
            <BrandLogo brand={brand} />
          </div>
        ))}
      </div>
    </section>
  );
}
