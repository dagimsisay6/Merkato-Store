import Link from "next/link";
import { Smartphone, Shirt, Sparkles, Apple, Home as HomeIcon, Gem } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const CATEGORY_ICONS = {
  electronics: Smartphone,
  fashion: Shirt,
  beauty: Sparkles,
  groceries: Apple,
  "home-living": HomeIcon,
  accessories: Gem,
};

export function Categories({ categories = [] }) {
  return (
    <section id="categories" className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
      <SectionHeader
        eyebrow="Browse"
        title="Shop by Category"
        subtitle="Curated selections across the things you love."
        viewAll="/categories"
      />
      <div className="no-scrollbar -mx-4 mt-10 flex gap-4 overflow-x-auto px-4 md:grid md:grid-cols-3 md:gap-6 md:overflow-visible lg:grid-cols-4">
        {categories.map((c) => {
          const Icon = CATEGORY_ICONS[c.slug] ?? Gem;
          return (
            <Link
              key={c.slug}
              href={`/categories/${c.slug}`}
              className="group relative flex w-44 shrink-0 flex-col items-center gap-4 overflow-hidden rounded-3xl border border-border bg-card p-6 text-center shadow-(--shadow-soft) transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-(--shadow-elegant) md:w-auto"
            >
              <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-primary text-primary-foreground transition group-hover:scale-110">
                <Icon className="h-7 w-7" />
              </div>
              <div>
                <p className="font-display text-sm font-bold text-foreground">{c.name}</p>
                <p className="mt-1 text-[11px] font-medium text-muted-foreground">{c.count} items</p>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
