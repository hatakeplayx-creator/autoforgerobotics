import { Cog, Facebook, Twitter, Linkedin, Instagram, Youtube, MapPin, Phone, Mail } from "lucide-react";
import { Link } from "@tanstack/react-router";
import { toast } from "sonner";

// Map footer link to route
const footerLinkToRoute: Record<string, string> = {
  "About Us": "/about",
  "Forum": "/forum",
  "Contact Us": "/contact",
  "My Account": "/profile",
  "Returns & Refunds": "/returns",
  "Shipping Policy": "/shipping",
  "FAQ": "/faq",
  "Privacy Policy": "/privacy",
  "Terms of Service": "/terms",
  "Sell on AutoForge": "/sell-on-autoforge",
};

const columns = [
  {
    title: "Company",
            links: ["About Us", "Careers", "Blogs", "Forum", "Sell on AutoForge", "Contact Us"],
  },
  {
    title: "Customer Service",
    links: ["My Account", "Track Order", "Returns & Refunds", "Shipping Policy", "Bulk Enquiry", "FAQ"],
  },
  {
    title: "Top Categories",
    links: [
      "Development Boards",
      "Sensors",
      "Drone Parts",
      "3D Printers and Parts",
      "IoT and Wireless Modules",
      "DIY and Maker Kits",
    ],
  },
];

export function StoreFooter() {
  return (
    <footer className="mt-8 border-t border-border bg-secondary">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-12 sm:grid-cols-2 lg:grid-cols-4">
        <div>
          <Link to="/" className="flex items-center gap-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-accent">
              <Cog className="h-6 w-6 text-accent-foreground" />
            </span>
            <span className="leading-tight">
              <span className="block text-xl font-extrabold tracking-tight text-primary">AUTOFORGE</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.3em] text-accent">Robotics</span>
            </span>
          </Link>
          <p className="mt-4 text-sm text-muted-foreground">
            Your Ideas, Our Parts. India's one-stop shop for robotics, electronics, drones,
            3D printing and maker supplies.
          </p>
          <div className="mt-4 space-y-2 text-sm text-muted-foreground">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0" /> Pune, Maharashtra, India</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0" /> 1800 266 6123</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0" /> support@autoforgerobotics.in</p>
          </div>
          <div className="mt-4 flex items-center gap-3 text-muted-foreground">
            <button type="button" aria-label="Facebook" onClick={() => toast.info("Social links coming soon.")} className="hover:text-primary"><Facebook className="h-4 w-4" /></button>
            <button type="button" aria-label="X" onClick={() => toast.info("Social links coming soon.")} className="hover:text-primary"><Twitter className="h-4 w-4" /></button>
            <button type="button" aria-label="LinkedIn" onClick={() => toast.info("Social links coming soon.")} className="hover:text-primary"><Linkedin className="h-4 w-4" /></button>
            <button type="button" aria-label="Instagram" onClick={() => toast.info("Social links coming soon.")} className="hover:text-primary"><Instagram className="h-4 w-4" /></button>
            <button type="button" aria-label="YouTube" onClick={() => toast.info("Social links coming soon.")} className="hover:text-primary"><Youtube className="h-4 w-4" /></button>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-sm font-bold uppercase tracking-wide text-foreground">{col.title}</h3>
            <ul className="mt-4 space-y-2.5">
              {col.links.map((link) => {
                if (col.title === "Top Categories") {
                  // It's a category, link to shop with category filter
                  return (
                    <li key={link}>
                      <Link to="/shop" search={{ category: link }} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                        {link}
                      </Link>
                    </li>
                  );
                }
                const to = footerLinkToRoute[link];
                if (!to) {
                  return (
                    <li key={link}>
                      <button type="button" onClick={() => toast.info(`${link} page is coming soon.`)} className="text-sm text-muted-foreground hover:text-primary">
                        {link}
                      </button>
                    </li>
                  );
                }
                return (
                  <li key={link}>
                    <Link to={to} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                      {link}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-border">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-2 px-4 py-4 text-xs text-muted-foreground sm:flex-row">
          <p>© 2026 AutoForge Robotics. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="hover:text-primary transition-colors">Privacy Policy</Link>
            <Link to="/terms" className="hover:text-primary transition-colors">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
