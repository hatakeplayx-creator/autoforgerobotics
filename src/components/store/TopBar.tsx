import { Headphones, PackageCheck, ShieldCheck, Truck } from "lucide-react";
import { Link } from "@tanstack/react-router";

export function AnnouncementBar() {
  return (
    <div className="bg-primary px-4 py-2 text-center text-[11px] font-semibold tracking-[0.18em] text-primary-foreground">
      <span>ENGINEERED ROBOTICS COMPONENTS | SECURE CHECKOUT | PAN-INDIA DELIVERY</span>
    </div>
  );
}

export function TopBar() {
  return (
    <div className="border-b border-border/70 bg-card/80 py-2 text-xs text-muted-foreground backdrop-blur-xl">
      <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4">
        <div className="hidden items-center gap-5 md:flex">
          {[
            [PackageCheck, "Original products"],
            [Truck, "Fast dispatch"],
            [ShieldCheck, "Secure checkout"],
          ].map(([Icon, label]) => {
            const ItemIcon = Icon as typeof PackageCheck;
            return (
              <span key={label as string} className="flex items-center gap-1.5">
                <ItemIcon className="h-3.5 w-3.5 text-accent" />
                <span>{label as string}</span>
              </span>
            );
          })}
        </div>
        <div className="flex w-full items-center justify-between gap-4 md:w-auto md:justify-end">
          <Link to="/contact" className="flex items-center gap-1.5 transition-colors hover:text-primary">
            <Headphones className="h-3.5 w-3.5 text-accent" />
            <span>Expert support</span>
          </Link>
          <Link to="/orders" className="transition-colors hover:text-primary">
            Track order
          </Link>
          <Link to="/contact" className="transition-colors hover:text-primary">
            Contact
          </Link>
        </div>
      </div>
    </div>
  );
}
