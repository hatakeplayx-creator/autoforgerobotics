import { MapPin, Phone, HelpCircle } from "lucide-react";
import { toast } from "sonner";

export function AnnouncementBar() {
  return (
    <div className="bg-primary text-primary-foreground py-2 px-4 text-center text-xs font-semibold tracking-wide">
      <span>⚡ Get 10% off on your first order! Use code <strong className="underline">AUTOFIRST</strong>. Free delivery on orders above ₹999.</span>
    </div>
  );
}

export function TopBar() {
  return (
    <div className="bg-secondary/40 border-b border-border text-muted-foreground text-xs py-2">
      <div className="mx-auto max-w-7xl px-4 flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="flex items-center gap-1.5">
            <Phone className="h-3.5 w-3.5 text-primary" />
            <span>Toll Free: <strong>1800 266 6123</strong></span>
          </span>
          <span className="hidden sm:inline text-border">|</span>
          <span className="flex items-center gap-1.5">
            <MapPin className="h-3.5 w-3.5 text-primary" />
            <span>Pune, Maharashtra, India</span>
          </span>
        </div>
        <div className="flex items-center gap-4">
          <button
            type="button"
            onClick={() => toast.info("Help center support is coming soon.")}
            className="hover:text-primary transition-colors flex items-center gap-1"
          >
            <HelpCircle className="h-3.5 w-3.5" />
            <span>Need Help?</span>
          </button>
          <span className="text-border">|</span>
          <button type="button" onClick={() => toast.info("Use Orders page after login.")} className="hover:text-primary transition-colors">Track Order</button>
          <span className="text-border">|</span>
          <button type="button" onClick={() => toast.info("Careers portal coming soon.")} className="hover:text-primary transition-colors">Careers</button>
          <span className="text-border">|</span>
          <button type="button" onClick={() => toast.info("Contact: support@autoforgerobotics.in")} className="hover:text-primary transition-colors">Contact Us</button>
        </div>
      </div>
    </div>
  );
}
