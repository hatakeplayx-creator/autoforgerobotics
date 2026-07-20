import { Box, Mail, MapPin, Phone } from "lucide-react";
import { Link } from "@tanstack/react-router";

const footerLinkToRoute: Record<string, string> = {
  "About Us": "/about",
  Careers: "/careers",
  Blogs: "/blogs",
  Forum: "/forum",
  "Contact Us": "/contact",
  "My Account": "/profile",
  "Track Order": "/orders",
  "Returns & Refunds": "/returns",
  "Shipping Policy": "/shipping",
  "Bulk Enquiry": "/bulk-enquiry",
  FAQ: "/faq",
  "Privacy Policy": "/privacy",
  "Terms of Service": "/terms",
  "Sell on AutoForge": "/sell-on-autoforge",
};

const columns = [
  {
    title: "Company",
    links: ["About Us", "Sell on AutoForge", "Contact Us"],
  },
  {
    title: "Support",
    links: ["My Account", "Track Order", "Returns & Refunds", "Shipping Policy", "Bulk Enquiry", "FAQ"],
  },
  {
    title: "Systems",
    links: ["Development Boards", "Sensors", "Drone Parts", "3D Printers and Parts", "IoT and Wireless Modules", "DIY and Maker Kits"],
  },
];

export function StoreFooter() {
  return (
    <footer className="mt-8 bg-primary text-primary-foreground">
      <div className="mx-auto grid max-w-7xl gap-10 px-4 py-14 sm:grid-cols-2 lg:grid-cols-[1.25fr_0.75fr_0.75fr_0.75fr]">
        <div>
          <Link to="/" className="flex items-center gap-3">
            <span className="flex h-11 w-11 items-center justify-center rounded-md bg-primary-foreground text-primary">
              <Box className="h-5 w-5" />
            </span>
            <span className="leading-none">
              <span className="block text-xl font-black tracking-[0.14em]">AUTOFORGE</span>
              <span className="block text-[10px] font-semibold uppercase tracking-[0.38em] text-primary-foreground/55">Robotics</span>
            </span>
          </Link>
          <p className="mt-5 max-w-sm text-sm leading-7 text-primary-foreground/68">
            Premium robotics hardware, fabrication services, and engineering support for students, labs, startups, and industrial teams.
          </p>
          <div className="mt-5 space-y-2 text-sm text-primary-foreground/68">
            <p className="flex items-center gap-2"><MapPin className="h-4 w-4 shrink-0 text-accent" /> Pune, Maharashtra, India</p>
            <p className="flex items-center gap-2"><Phone className="h-4 w-4 shrink-0 text-accent" /> 1800 266 6123</p>
            <p className="flex items-center gap-2"><Mail className="h-4 w-4 shrink-0 text-accent" /> support@autoforgerobotics.in</p>
          </div>
        </div>

        {columns.map((col) => (
          <div key={col.title}>
            <h3 className="text-xs font-black uppercase tracking-[0.24em] text-primary-foreground/45">{col.title}</h3>
            <ul className="mt-5 space-y-3">
              {col.links.map((link) => {
                if (col.title === "Systems") {
                  return (
                    <li key={link}>
                      <Link to="/shop" search={{ category: link }} className="text-sm text-primary-foreground/68 transition-colors hover:text-accent">
                        {link}
                      </Link>
                    </li>
                  );
                }

                const to = footerLinkToRoute[link];
                if (!to) return null;

                return (
                  <li key={link}>
                    <Link to={to} className="text-sm text-primary-foreground/68 transition-colors hover:text-accent">
                      {link}
                    </Link>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-primary-foreground/10">
        <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-3 px-4 py-5 text-xs text-primary-foreground/50 sm:flex-row">
          <p>Copyright 2026 AutoForge Robotics. All rights reserved.</p>
          <div className="flex gap-4">
            <Link to="/privacy" className="transition-colors hover:text-accent">Privacy Policy</Link>
            <Link to="/terms" className="transition-colors hover:text-accent">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
