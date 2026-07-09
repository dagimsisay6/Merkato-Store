"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, ArrowDownUp } from "lucide-react";

import { PageHeader } from "@/components/store/PageHeader";
import { ProductCard } from "@/components/store/ProductCard";
import { BRANDS, CATEGORY_LIST, PRODUCTS } from "@/lib/store-data";

const SORTS = [
  { id: "featured", label: "Featured" },
  { id: "newest", label: "Newest" },
  { id: "price-asc", label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "best-selling", label: "Best Selling" },
  { id: "rating", label: "Highest Rated" },
];

export default function ProductsPage() {
  const searchParams = useSearchParams();

  const [cat, setCat] = useState(searchParams.get("category") || null);
  const [brand, setBrand] = useState(null);
  const [maxPrice, setMaxPrice] = useState(800);
  const [minRating, setMinRating] = useState(0);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sort, setSort] = useState("featured");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let list = [...PRODUCTS];

    if (cat) list = list.filter((p) => p.categorySlug === cat);
    if (brand)
      list = list.filter(
        (p) => p.brand.toLowerCase().replace(/\s+/g, "-") === brand,
      );
    list = list.filter((p) => p.price <= maxPrice);
    if (minRating > 0) list = list.filter((p) => p.rating >= minRating);
    if (inStockOnly) list = list.filter((p) => !p.stock || p.stock > 0);

    if (sort === "featured")
      list = list
        .filter((p) => p.featured)
        .concat(list.filter((p) => !p.featured));
    else if (sort === "newest")
      list = list.filter((p) => p.isNew).concat(list.filter((p) => !p.isNew));
    else if (sort === "price-asc") list.sort((a, b) => a.price - b.price);
    else if (sort === "price-desc") list.sort((a, b) => b.price - a.price);
    else if (sort === "best-selling")
      list.sort((a, b) => b.reviews - a.reviews);
    else if (sort === "rating") list.sort((a, b) => b.rating - a.rating);

    return list;
  }, [cat, brand, maxPrice, minRating, inStockOnly, sort]);

  const clearFilters = () => {
    setCat(null);
    setBrand(null);
    setMaxPrice(800);
    setMinRating(0);
    setInStockOnly(false);
  };

  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "All Products" }]}
        eyebrow="Catalog"
        title="All Products"
        subtitle={`${filtered.length} of ${PRODUCTS.length} items from trusted sellers`}
      />

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
              {SORTS.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="sticky top-32 space-y-6 rounded-2xl border border-border bg-card p-5">
              <FilterGroup title="Category">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={cat === null}
                    onChange={() => setCat(null)}
                  />{" "}
                  All
                </label>
                {CATEGORY_LIST.map((c) => (
                  <label
                    key={c.slug}
                    className="flex cursor-pointer items-center gap-2 text-sm"
                  >
                    <input
                      type="radio"
                      checked={cat === c.slug}
                      onChange={() => setCat(c.slug)}
                    />{" "}
                    {c.name}
                  </label>
                ))}
              </FilterGroup>

              <FilterGroup title="Brand">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="radio"
                    checked={brand === null}
                    onChange={() => setBrand(null)}
                  />{" "}
                  All
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
              </FilterGroup>

              <FilterGroup title={`Max price: $${maxPrice}`}>
                <input
                  type="range"
                  min={10}
                  max={800}
                  step={10}
                  value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </FilterGroup>

              <FilterGroup title="Min rating">
                <div className="flex gap-2">
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
              </FilterGroup>

              <FilterGroup title="Availability">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input
                    type="checkbox"
                    checked={inStockOnly}
                    onChange={(e) => setInStockOnly(e.target.checked)}
                    className="accent-primary"
                  />{" "}
                  In stock only
                </label>
              </FilterGroup>

              <button
                onClick={clearFilters}
                className="w-full rounded-full border border-border py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
              >
                Clear filters
              </button>
            </div>
          </aside>

          <div>
            {filtered.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-12 text-center">
                <p className="font-display text-xl font-bold">
                  No products match your filters.
                </p>
                <p className="mt-2 text-sm text-muted-foreground">
                  Try widening your price range or clearing filters.
                </p>
                <button
                  onClick={clearFilters}
                  className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => (
                  <ProductCard key={p.id} p={p} />
                ))}
              </div>
            )}

            <div className="mt-10 flex justify-center">
              <Link
                href="/categories"
                className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold transition hover:bg-secondary"
              >
                Explore all categories →
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {title}
      </p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}

