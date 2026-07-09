"use client";

import { use, useMemo, useState } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowDownUp, SlidersHorizontal } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import {@/lib/store-data
  BRANDS,
  findCategory,
  productsByCategory,
  PRODUCTS,
} from "@/lib/store-data";

export default function CategoryPage({ params }) {
  const { slug } = use(params);
  const category = findCategory(slug);
  if (!category) notFound();

  return <CategoryContent category={category} />;
}

function CategoryContent({ category }) {
  const items = productsByCategory(category.slug);
  const all = items.length > 0 ? items : PRODUCTS;

  const [brand, setBrand] = useState(null);
  const [maxPrice, setMaxPrice] = useState(800);
  const [minRating, setMinRating] = useState(0);
  const [sort, setSort] = useState("popular");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...all];
    if (brand)
      list = list.filter(
        (p) => p.brand.toLowerCase().replace(/\s+/g, "-") === brand,
      );
    list = list.filter((p) => p.price <= maxPrice);
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
    if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);
    else if (sort === "best-selling")
      list.sort((a, b) => b.reviews - a.reviews);
    return list;
  }, [all, brand, maxPrice, minRating, sort]);

  return (
    <div>
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-primary" />
        <div className="absolute inset-0 -z-10 kente-pattern opacity-50" />
        <div className="mx-auto max-w-7xl px-4 py-16 text-primary-foreground">
          <nav className="mb-3 flex items-center gap-1.5 text-xs opacity-80">
            <Link href="/">Home</Link> /{" "}
            <Link href="/categories">Categories</Link> /{" "}
            <span className="font-semibold">{category.name}</span>
          </nav>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">
            Category
          </span>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            {category.name}
          </h1>
          <p className="mt-3 max-w-xl text-base text-primary-foreground/85">
            {category.banner}
          </p>
          <p className="mt-4 text-sm text-primary-foreground/70">
            {category.count} products available · {items.length} in stock
          </p>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="mb-6 flex items-center justify-between gap-3">
          <button
            onClick={() => setShowFilters((v) => !v)}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium lg:hidden"
          >
            <SlidersHorizontal className="h-4 w-4" /> Filters
          </button>
          <p className="text-sm text-muted-foreground">
            {filtered.length} results
          </p>
          <div className="ml-auto flex items-center gap-2">
            <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-border bg-card px-3 py-2 text-sm"
            >
              <option value="popular">Most Popular</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="best-selling">Best Selling</option>
              <option value="rating">Highest Rated</option>
            </select>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="sticky top-32 space-y-6 rounded-2xl border border-border bg-card p-5">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Brand
                </p>
                <div className="space-y-2">
                  <label className="flex cursor-pointer items-center gap-2 text-sm">
                    <input
                      type="radio"
                      checked={brand === null}
                      onChange={() => setBrand(null)}
                    />{" "}
                    All brands
                  </label>
                  {BRANDS.slice(0, 6).map((b) => (
                    <label
                      key={b.slug}
                      className="flex cursor-pointer items-center gap-2 text-sm"
                    >
                      <input
                        type="radio"
                        checked={brand === b.slug}
                        onChange={() => setBrand(b.slug)}
                      />{" "}
                      {b.name}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Max price: ${maxPrice}
                </p>
                <input
                  type="range"
                  min={10}
                  max={800}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>

              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Min rating
                </p>
                <div className="flex flex-wrap gap-2">
                  {[0, 3, 3.5, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        minRating === r
                          ? "border-primary bg-primary text-primary-foreground"
                          : "border-border hover:border-primary"
                      }`}
                    >
                      {r === 0 ? "All" : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>

              <button
                onClick={() => {
                  setBrand(null);
                  setMaxPrice(800);
                  setMinRating(0);
                }}
                className="w-full rounded-full border border-border py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
              >
                Clear
              </button>
            </div>
          </aside>

          <div>
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-12 text-center">
                <p className="font-display text-xl font-bold">
                  Nothing here yet.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try clearing filters or browse all products.
                </p>
                <Link
                  href="/products"
                  className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Browse products
                </Link>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
