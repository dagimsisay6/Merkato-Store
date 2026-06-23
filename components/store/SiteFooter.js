"use client";

import Link from "next/link";
import { ChevronDown, Globe, Send } from "lucide-react";
import { FaFacebook, FaInstagram, FaTwitter, FaYoutube } from "react-icons/fa";
import { CATEGORY_LIST } from "@/lib/store-data";

const SOCIAL_ICONS = [FaFacebook, FaInstagram, FaTwitter, FaYoutube];

export function SiteFooter() {
  const year = new Date().getFullYear();

  return (
    <footer className="bg-ink text-primary-foreground">
      <div className="mx-auto max-w-7xl px-4 py-16">
        <div className="grid gap-10 lg:grid-cols-5">

          {/* Brand + newsletter + socials */}
          <div className="lg:col-span-2">
            <Link href="/" className="flex items-center gap-2.5">
              <div className="grid h-10 w-10 place-items-center rounded-xl gradient-primary">
                <span className="font-display text-base font-extrabold text-primary-foreground">M</span>
              </div>
              <div>
                <p className="font-display text-lg font-bold leading-none">Merkato Store</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-primary-foreground/60">
                  Africa · Middle East
                </p>
              </div>
            </Link>

            <p className="mt-5 max-w-sm text-sm text-primary-foreground/70">
              The premium marketplace for shoppers across Africa and the Middle East. Built with love,
              designed for trust.
            </p>

            <form onSubmit={(e) => e.preventDefault()} className="mt-5 flex max-w-sm gap-2">
              <input
                type="email"
                required
                placeholder="you@email.com"
                className="h-10 flex-1 rounded-full border border-white/10 bg-white/5 px-4 text-sm text-primary-foreground placeholder:text-primary-foreground/40 outline-none focus:border-gold"
              />
              <button className="inline-flex h-10 items-center gap-2 rounded-full bg-gold px-4 text-xs font-bold text-gold-foreground transition hover:bg-gold/90">
                <Send className="h-3.5 w-3.5" /> Join
              </button>
            </form>

            <div className="mt-5 flex gap-3">
              {SOCIAL_ICONS.map((Icon, i) => (
                <a
                  key={i}
                  href="#"
                  aria-label="social"
                  className="grid h-10 w-10 place-items-center rounded-full border border-white/10 transition hover:border-gold hover:text-gold"
                >
                  <Icon className="h-4 w-4" />
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <Col title="About Merkato" links={[
            { label: "Our Story",  href: "/about" },
            { label: "Careers",   href: "/careers" },
            { label: "Brands",    href: "/brands" },
            { label: "Regions",   href: "/regions" },
          ]} />

          <Col title="Customer Service" links={[
            { label: "Help Center", href: "/help-center" },
            { label: "FAQ",         href: "/faq" },
            { label: "Shipping",    href: "/shipping" },
            { label: "Returns",     href: "/returns" },
            { label: "Contact Us",  href: "/contact" },
          ]} />

          <Col title="Shop" links={[
            { label: "All Products", href: "/products" },
            { label: "Flash Deals",  href: "/deals" },
            { label: "New Arrivals", href: "/new-arrivals" },
            { label: "Best Sellers", href: "/best-sellers" },
            ...CATEGORY_LIST.slice(0, 3).map((c) => ({
              label: c.name,
              href: `/categories/${c.slug}`,
            })),
          ]} />
        </div>

        {/* Bottom bar */}
        <div className="mt-14 flex flex-col gap-4 border-t border-white/10 pt-6 text-xs text-primary-foreground/60 md:flex-row md:items-center md:justify-between">
          <div className="flex flex-wrap items-center gap-4">
            <p>© {year} Merkato Store. All rights reserved.</p>
            <Link href="/privacy-policy" className="hover:text-gold">Privacy</Link>
            <Link href="/terms" className="hover:text-gold">Terms</Link>
          </div>
          <div className="flex flex-wrap items-center gap-4">
            <button className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 transition hover:bg-white/10">
              🇳🇬 Nigeria <ChevronDown className="h-3 w-3" />
            </button>
            <button className="inline-flex items-center gap-1.5 rounded-full bg-white/5 px-3 py-1.5 transition hover:bg-white/10">
              <Globe className="h-3 w-3" /> English
            </button>
            <div className="flex items-center gap-2">
              {["VISA", "MC", "PayPal", "M-Pesa"].map((p) => (
                <span
                  key={p}
                  className="rounded-md bg-white/10 px-2 py-1 text-[10px] font-bold tracking-wider"
                >
                  {p}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}

function Col({ title, links }) {
  return (
    <div>
      <p className="font-display text-sm font-bold uppercase tracking-wider text-primary-foreground">
        {title}
      </p>
      <ul className="mt-4 space-y-3 text-sm text-primary-foreground/70">
        {links.map((l) => (
          <li key={l.label}>
            <Link href={l.href} className="transition hover:text-gold">
              {l.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
