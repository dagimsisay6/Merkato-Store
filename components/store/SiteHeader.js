"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import {
  Search, ShoppingBag, Heart, User, ChevronDown, Globe, Menu, X, Clock, TrendingUp,
} from "lucide-react";
import { CATEGORY_LIST, PRODUCTS, TRENDING_SEARCHES, fmt } from "@/lib/store-data";
import { useCart, useWishlist } from "@/lib/store-context";

export function SiteHeader() {
  const [scrolled, setScrolled] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [mobileNavOpen, setMobileNavOpen] = useState(false);
  const [q, setQ] = useState("");
  const cart = useCart();
  const wishlist = useWishlist();
  const router = useRouter();
  const path = usePathname();
  const inputRef = useRef(null);
  const wrapRef = useRef(null);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // close on route change
  useEffect(() => {
    setSearchOpen(false);
    setMobileNavOpen(false);
  }, [path]);

  // outside click for search
  useEffect(() => {
    if (!searchOpen) return;
    const onClick = (e) => {
      if (wrapRef.current && !wrapRef.current.contains(e.target)) setSearchOpen(false);
    };
    document.addEventListener("mousedown", onClick);
    return () => document.removeEventListener("mousedown", onClick);
  }, [searchOpen]);

  const recent = (() => {
    try { return JSON.parse(localStorage.getItem("merkato.recent") || "[]"); } catch { return []; }
  })();

  const submit = (term) => {
    const t = (term ?? q).trim();
    if (!t) return;
    try {
      const next = [t, ...recent.filter((r) => r !== t)].slice(0, 5);
      localStorage.setItem("merkato.recent", JSON.stringify(next));
    } catch {}
    setSearchOpen(false);
    setQ("");
    router.push(`/search?q=${encodeURIComponent(t)}`);
  };

  const suggestions = q.trim()
    ? PRODUCTS.filter((p) =>
        (p.name + p.brand + p.tags.join(" ")).toLowerCase().includes(q.toLowerCase())
      ).slice(0, 5)
    : [];

  return (
    <>
      {/* Announcement bar */}
      <div className="bg-ink text-primary-foreground">
        <div className="mx-auto flex max-w-7xl items-center justify-between gap-4 px-4 py-2 text-[12px]">
          <p className="hidden sm:block opacity-80">🚚 Free delivery on orders over $50 · Returns within 14 days</p>
          <p className="sm:hidden opacity-80">🚚 Free delivery over $50</p>
          <div className="flex items-center gap-3">
            <Link href="/contact" className="hidden md:inline opacity-80 hover:opacity-100">Sell on Merkato</Link>
            <span className="opacity-60 hidden md:inline">|</span>
            <Link href="/help-center" className="opacity-80 hover:opacity-100">Help</Link>
          </div>
        </div>
      </div>

      <header
        className={`sticky top-0 z-50 transition-all duration-300 ${
          scrolled ? "glass shadow-(--shadow-soft)" : "bg-background"
        }`}
      >
        <div className={`mx-auto max-w-7xl px-4 transition-all ${scrolled ? "py-2.5" : "py-4"}`}>
          <div className="flex items-center gap-4">
            {/* Logo */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="grid h-9 w-9 place-items-center rounded-xl gradient-primary shadow-(--shadow-glow)">
                <span className="font-display text-base font-extrabold text-primary-foreground">M</span>
              </div>
              <div className="hidden sm:block">
                <p className="font-display text-lg font-bold leading-none text-foreground">Merkato</p>
                <p className="text-[10px] font-semibold uppercase tracking-[0.2em] text-muted-foreground">Store</p>
              </div>
            </Link>

            {/* Desktop search */}
            <div className="ml-2 hidden flex-1 md:block" ref={wrapRef}>
              <div className="relative">
                <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <input
                  ref={inputRef}
                  value={q}
                  onChange={(e) => { setQ(e.target.value); setSearchOpen(true); }}
                  onFocus={() => setSearchOpen(true)}
                  onKeyDown={(e) => e.key === "Enter" && submit()}
                  placeholder="Search for products, brands, categories…"
                  className="h-11 w-full rounded-full border border-border bg-secondary pl-11 pr-28 text-sm outline-none transition focus:border-primary focus:bg-card focus:ring-2 focus:ring-primary/20"
                />
                <button
                  onClick={() => submit()}
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground transition hover:bg-primary-glow"
                >
                  Search
                </button>

                {searchOpen && (
                  <div className="absolute left-0 right-0 top-full z-50 mt-2 overflow-hidden rounded-2xl border border-border bg-card shadow-(--shadow-elegant)">
                    {suggestions.length > 0 ? (
                      <div>
                        <p className="px-4 pt-3 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Products</p>
                        {suggestions.map((p) => (
                          <Link
                            key={p.id}
                            href={`/products/${p.id}`}
                            className="flex items-center gap-3 px-4 py-2.5 transition hover:bg-secondary"
                          >
                            <img src={p.img.src ?? p.img} alt="" className="h-10 w-10 rounded-lg object-cover" />
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-medium text-foreground">{p.name}</p>
                              <p className="text-xs text-muted-foreground">{p.brand}</p>
                            </div>
                            <p className="text-sm font-bold text-accent">{fmt(p.price)}</p>
                          </Link>
                        ))}
                        <button
                          onClick={() => submit()}
                          className="block w-full border-t border-border px-4 py-3 text-left text-xs font-semibold text-primary hover:bg-secondary"
                        >
                          View all results for "{q}" →
                        </button>
                      </div>
                    ) : (
                      <div className="p-4">
                        {recent.length > 0 && (
                          <>
                            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Recent</p>
                            <div className="mt-2 flex flex-wrap gap-2">
                              {recent.map((r) => (
                                <button
                                  key={r}
                                  onClick={() => submit(r)}
                                  className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1.5 text-xs font-medium text-foreground hover:bg-muted"
                                >
                                  <Clock className="h-3 w-3" /> {r}
                                </button>
                              ))}
                            </div>
                          </>
                        )}
                        <p className="mt-4 text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Trending</p>
                        <div className="mt-2 flex flex-wrap gap-2">
                          {TRENDING_SEARCHES.map((t) => (
                            <button
                              key={t}
                              onClick={() => submit(t)}
                              className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-medium text-primary hover:bg-primary/15"
                            >
                              <TrendingUp className="h-3 w-3" /> {t}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="ml-auto flex items-center gap-1.5">
              <button className="hidden items-center gap-1.5 rounded-full px-3 py-2 text-sm font-medium text-foreground transition hover:bg-secondary lg:inline-flex">
                <Globe className="h-4 w-4" /> EN <ChevronDown className="h-3.5 w-3.5" />
              </button>
              <Link
                href="/account/wishlist"
                aria-label="Wishlist"
                className="relative hidden h-10 w-10 place-items-center rounded-full transition hover:bg-secondary md:grid"
              >
                <Heart className="h-5 w-5" />
                {wishlist.ids.length > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {wishlist.ids.length}
                  </span>
                )}
              </Link>
              <Link
                href="/cart"
                aria-label="Cart"
                className="relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-secondary"
              >
                <ShoppingBag className="h-5 w-5" />
                {cart.count > 0 && (
                  <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-accent text-[10px] font-bold text-accent-foreground">
                    {cart.count}
                  </span>
                )}
              </Link>
              <Link
                href="/account"
                aria-label="Account"
                className="hidden h-10 w-10 place-items-center rounded-full bg-secondary transition hover:bg-muted md:grid"
              >
                <User className="h-5 w-5" />
              </Link>
              <button
                onClick={() => setMobileNavOpen((v) => !v)}
                aria-label="Menu"
                className="grid h-10 w-10 place-items-center rounded-full transition hover:bg-secondary md:hidden"
              >
                {mobileNavOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
              </button>
            </div>
          </div>

          {/* Mobile search */}
          <div className="mt-3 md:hidden">
            <div className="relative">
              <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                value={q}
                onChange={(e) => setQ(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && submit()}
                placeholder="Search Merkato…"
                className="h-11 w-full rounded-full border border-border bg-secondary pl-11 pr-4 text-sm outline-none focus:border-primary"
              />
            </div>
          </div>

          {/* Categories row (desktop) */}
          <nav className="no-scrollbar mt-3 hidden items-center gap-6 overflow-x-auto text-sm font-medium text-foreground/80 md:flex">
            <Link href="/categories" className="whitespace-nowrap py-1.5 font-semibold transition hover:text-primary">
              All Categories
            </Link>
            {CATEGORY_LIST.map((c) => (
              <Link key={c.slug} href={`/categories/${c.slug}`} className="whitespace-nowrap py-1.5 transition hover:text-primary">
                {c.name}
              </Link>
            ))}
            <Link href="/about" className="whitespace-nowrap py-1.5 transition hover:text-primary">About</Link>
            <Link href="/deals" className="whitespace-nowrap py-1.5 font-semibold text-accent">Flash Deals 🔥</Link>
            <Link href="/new-arrivals" className="whitespace-nowrap py-1.5 transition hover:text-primary">New Arrivals</Link>
            <Link href="/best-sellers" className="whitespace-nowrap py-1.5 transition hover:text-primary">Best Sellers</Link>
            <Link href="/brands" className="whitespace-nowrap py-1.5 transition hover:text-primary">Brands</Link>
          </nav>
        </div>

        {/* Mobile nav drawer */}
        {mobileNavOpen && (
          <div className="border-t border-border bg-card md:hidden">
            <nav className="mx-auto max-w-7xl px-4 py-4">
              <div className="space-y-1 text-sm font-medium">
                <Link href="/categories" className="block rounded-lg px-3 py-2 hover:bg-secondary">All Categories</Link>
                {CATEGORY_LIST.map((c) => (
                  <Link key={c.slug} href={`/categories/${c.slug}`} className="block rounded-lg px-3 py-2 hover:bg-secondary">
                    {c.name}
                  </Link>
                ))}
                <div className="my-2 border-t border-border" />
                <Link href="/deals" className="block rounded-lg px-3 py-2 text-accent hover:bg-secondary">Flash Deals 🔥</Link>
                <Link href="/new-arrivals" className="block rounded-lg px-3 py-2 hover:bg-secondary">New Arrivals</Link>
                <Link href="/best-sellers" className="block rounded-lg px-3 py-2 hover:bg-secondary">Best Sellers</Link>
                <Link href="/brands" className="block rounded-lg px-3 py-2 hover:bg-secondary">Brands</Link>
                <div className="my-2 border-t border-border" />
                <Link href="/about" className="block rounded-lg px-3 py-2 hover:bg-secondary">About</Link>
                <Link href="/account" className="block rounded-lg px-3 py-2 hover:bg-secondary">My Account</Link>
                <Link href="/forgot-password" className="block rounded-lg px-3 py-2 hover:bg-secondary">Forgot Password</Link>
                <Link href="/help-center" className="block rounded-lg px-3 py-2 hover:bg-secondary">Help Center</Link>
              </div>
            </nav>
          </div>
        )}
      </header>
    </>
  );
}
