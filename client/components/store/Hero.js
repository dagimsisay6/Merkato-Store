"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Search, Sparkles, Star } from "lucide-react";
import hero from "@/assets/hero.jpg";
import pHeadphones from "@/assets/p-headphones.jpg";
import pSneakers from "@/assets/p-sneakers.jpg";

export function Hero() {
  const router = useRouter();

  function handleSearch(e) {
    e.preventDefault();
    const q = String(new FormData(e.currentTarget).get("q") || "").trim();
    if (q) router.push(`/search?q=${encodeURIComponent(q)}`);
  }

  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 gradient-primary" />
      <div className="absolute inset-0 -z-10 kente-pattern opacity-60" />
      <div className="absolute -right-32 -top-32 -z-10 h-[480px] w-[480px] rounded-full bg-gold/30 blur-3xl" />
      <div className="absolute -bottom-40 -left-20 -z-10 h-[420px] w-[420px] rounded-full bg-accent/20 blur-3xl" />

      <div className="mx-auto grid max-w-7xl items-center gap-10 px-4 py-16 lg:min-h-[80vh] lg:grid-cols-2 lg:py-20">
        <div className="text-primary-foreground animate-fade-up">
          <span className="inline-flex items-center gap-2 rounded-full glass-dark px-3 py-1.5 text-xs font-semibold uppercase tracking-widest">
            <Sparkles className="h-3.5 w-3.5 text-gold" /> New season · 50% off
          </span>

          <h1 className="mt-5 font-display text-5xl font-extrabold leading-[1.05] sm:text-6xl lg:text-7xl">
            Africa &amp; Middle East&apos;s{" "}
            <span className="bg-linear-to-r from-gold to-accent bg-clip-text text-transparent">
              Marketplace
            </span>
            .
          </h1>

          <p className="mt-5 max-w-xl text-base leading-relaxed text-primary-foreground/85 sm:text-lg">
            Millions of products. Trusted sellers. Fast delivery across seven
            countries — all in one beautifully simple place.
          </p>

          <form onSubmit={handleSearch} className="mt-7 max-w-xl">
            <div className="relative">
              <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
              <input
                name="q"
                placeholder="What are you shopping for today?"
                className="h-14 w-full rounded-full border-0 bg-card pl-14 pr-36 text-base text-foreground shadow-(--shadow-soft) outline-none focus:ring-4 focus:ring-gold/30"
              />
              <button
                type="submit"
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow"
              >
                Search
              </button>
            </div>
          </form>

          <div className="mt-6 flex flex-wrap gap-3">
            <Link
              href="/products"
              className="rounded-full bg-card px-7 py-3.5 text-sm font-semibold text-primary shadow-(--shadow-soft) transition hover:-translate-y-0.5 hover:bg-gold hover:text-gold-foreground"
            >
              Shop Now
            </Link>
            <Link
              href="/categories"
              className="rounded-full border border-primary-foreground/40 px-7 py-3.5 text-sm font-semibold text-primary-foreground transition hover:border-primary-foreground hover:bg-primary-foreground/10"
            >
              Explore Categories
            </Link>
          </div>

          <div className="mt-8 flex items-center gap-5">
            <div className="flex -space-x-2">
              {["🇳🇬", "🇰🇪", "🇦🇪", "🇪🇹"].map((f, i) => (
                <span key={i} className="grid h-8 w-8 place-items-center rounded-full bg-white/20 text-base shadow-md ring-2 ring-white/10">
                  {f}
                </span>
              ))}
            </div>
            <p className="text-sm text-white/90">
              <span className="font-bold text-white">2M+ shoppers</span>{" "}
              across 7 countries
            </p>
          </div>
        </div>

        <div className="relative mx-auto w-full max-w-xl">
          <div className="relative overflow-hidden rounded-[2rem] bg-card/10 shadow-(--shadow-elegant)">
            <Image src={hero} alt="Featured shopping" className="aspect-4/5 w-full object-cover" width={600} height={750} priority />
          </div>

          <Link
            href="/products/aurora-wireless-noise-cancelling-headphones"
            className="absolute -left-4 top-10 hidden w-56 rounded-2xl bg-card p-3 shadow-(--shadow-elegant) animate-float sm:block"
          >
            <div className="flex items-center gap-3">
              <Image src={pHeadphones} alt="" width={56} height={56} className="h-14 w-14 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Sonix</p>
                <p className="truncate text-sm font-semibold text-foreground">Aurora Headphones</p>
                <p className="text-sm font-bold text-accent">$129.99</p>
              </div>
            </div>
          </Link>

          <Link
            href="/products/emerald-runner-performance-sneakers"
            className="absolute -right-2 bottom-16 hidden w-52 rounded-2xl bg-card p-3 shadow-(--shadow-elegant) animate-float-slow sm:block"
          >
            <div className="flex items-center gap-3">
              <Image src={pSneakers} alt="" width={56} height={56} className="h-14 w-14 rounded-xl object-cover" />
              <div className="min-w-0">
                <p className="text-[10px] font-semibold uppercase text-muted-foreground">Pace</p>
                <p className="truncate text-sm font-semibold text-foreground">Emerald Runner</p>
                <div className="flex items-center gap-1 text-xs">
                  <Star className="h-3 w-3 fill-gold text-gold" /> 4.6
                </div>
              </div>
            </div>
          </Link>

          <div className="absolute -bottom-4 left-1/2 hidden -translate-x-1/2 items-center gap-2 rounded-full bg-card px-4 py-2 shadow-(--shadow-elegant) sm:flex">
            <div className="flex">
              {[0, 1, 2, 3, 4].map((i) => (
                <Star key={i} className="h-3.5 w-3.5 fill-gold text-gold" />
              ))}
            </div>
            <p className="text-xs font-semibold text-foreground">Trusted by 2M+ shoppers</p>
          </div>
        </div>
      </div>
    </section>
  );
}

