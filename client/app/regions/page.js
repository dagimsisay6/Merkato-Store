import Link from "next/link";
import { MapPin } from "lucide-react";
import { PageHeader } from "@/components/store/PageHeader";
import { COUNTRIES } from "@/lib/store-data";

export const metadata = {
  title: "Shop by Region — Merkato Store",
  description:
    "Shop from sellers in your country across Africa and the Middle East.",
};

export default function RegionsPage() {
  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Regions" }]}
        eyebrow="Local pride"
        title="Shop by Region"
        subtitle="Discover local sellers, regional favourites, and free fast delivery in your country."
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {COUNTRIES.map((c) => (
            <Link
              key={c.code}
              href="/products"
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-(--shadow-elegant)"
            >
              <div className="flex items-start justify-between">
                <span className="text-6xl transition group-hover:scale-110">
                  {c.flag}
                </span>
                <span className="rounded-full bg-primary/10 px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                  {c.currency}
                </span>
              </div>
              <h2 className="mt-4 font-display text-2xl font-bold">{c.name}</h2>
              <p className="mt-1 inline-flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-3.5 w-3.5" /> {c.capital}
              </p>
              <p className="mt-4 text-sm text-foreground/75">
                Fast delivery, local payment methods, regional bestsellers and
                exclusive offers.
              </p>
              <div className="mt-5 inline-flex rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground">
                Shop {c.name} →
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

