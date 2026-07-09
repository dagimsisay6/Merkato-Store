import Link from "next/link";
import { MapPin } from "lucide-react";
import { COUNTRIES } from "@/lib/store-data";
import { SectionHeader } from "./SectionHeader";

export function ShopByCountry() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/5 via-background to-gold/10" />
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <SectionHeader
          eyebrow="Local pride"
          title="Shop by Country"
          subtitle="Discover sellers and storefronts in your region."
          viewAll="/regions"
        />
        <div className="no-scrollbar mt-10 flex gap-4 overflow-x-auto md:grid md:grid-cols-3 md:overflow-visible lg:grid-cols-6">
          {COUNTRIES.map((c) => (
            <Link
              key={c.code}
              href="/regions"
              className="group relative flex w-40 shrink-0 flex-col items-center gap-3 overflow-hidden rounded-3xl border border-border bg-card/80 p-6 backdrop-blur transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-(--shadow-elegant) md:w-auto"
            >
              <span className="text-5xl transition group-hover:scale-110">{c.flag}</span>
              <p className="font-display text-sm font-bold text-foreground">{c.name}</p>
              <p className="inline-flex items-center gap-1 text-[11px] font-medium text-muted-foreground">
                <MapPin className="h-3 w-3" /> Storefront
              </p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
