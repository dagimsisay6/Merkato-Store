import Link from "next/link";
import { PageHeader } from "@/components/store/PageHeader";
import { BRANDS } from "@/lib/store-data";
import { ArrowRight } from "lucide-react";

export const metadata = {
  title: "Brands — Merkato Store",
  description: "Discover trusted brands across Africa and the Middle East.",
};

export default function BrandsPage() {
  const sortedBrands = [...BRANDS].sort((a, b) => a.name.localeCompare(b.name));

  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Brands" }]}
        eyebrow="Curated"
        title="Brands We Love"
        subtitle="From household names to homegrown heroes — discover trusted makers from across Africa and the Middle East."
      />

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sortedBrands.map((b) => (
            <Link
              key={b.slug}
              href="/products"
              className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[var(--shadow-elegant)]"
            >
              <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-primary font-display text-2xl font-extrabold text-primary-foreground">
                {b.name[0]}
              </div>
              <h2 className="mt-4 font-display text-xl font-bold">{b.name}</h2>
              <p className="mt-1 text-sm text-muted-foreground">{b.desc}</p>
              <p className="mt-3 text-xs font-bold uppercase tracking-widest text-primary">
                {b.count} products
              </p>
              <div className="mt-4 inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
                Shop brand{" "}
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

