import Link from "next/link";
import {
  Smartphone,
  Shirt,
  Sparkles,
  Apple,
  Home as HomeIcon,
  Gem,
  ArrowRight,
} from "lucide-react";
import { PageHeader } from "@/components/store/PageHeader";
import { CATEGORY_LIST, productsByCategory } from "@/lib/store-data";

export const metadata = {
  title: "All Categories — Merkato Store",
  description: "Explore every category at Merkato Store.",
};

const ICONS = {
  electronics: Smartphone,
  fashion: Shirt,
  beauty: Sparkles,
  groceries: Apple,
  "home-living": HomeIcon,
  accessories: Gem,
};

export default function CategoriesPage() {
  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Categories" }]}
        eyebrow="Browse"
        title="Shop by Category"
        subtitle="Discover handpicked products organized by what you love."
      />
      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {CATEGORY_LIST.map((c) => {
            const Icon = ICONS[c.slug] ?? Gem;
            const products = productsByCategory(c.slug);
            return (
              <Link
                key={c.slug}
                href={`/categories/${c.slug}`}
                className="group relative overflow-hidden rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-(--shadow-elegant)"
              >
                <div className="absolute -right-10 -top-10 h-40 w-40 rounded-full bg-primary/5 transition group-hover:bg-primary/15" />
                <div className="relative flex items-start gap-5">
                  <div className="grid h-16 w-16 shrink-0 place-items-center rounded-2xl gradient-primary text-primary-foreground transition group-hover:scale-110">
                    <Icon className="h-7 w-7" />
                  </div>
                  <div className="flex-1">
                    <h2 className="font-display text-xl font-bold">{c.name}</h2>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {c.banner}
                    </p>
                    <p className="mt-3 text-xs font-bold uppercase tracking-widest text-primary">
                      {c.count} items · {products.length} featured
                    </p>
                  </div>
                </div>
                <div className="relative mt-5 flex items-center justify-between text-sm font-semibold text-primary">
                  Explore{" "}
                  <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}

