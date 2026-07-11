"use client";

import { use, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowDownUp, SlidersHorizontal, Loader2 } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const SORTS = [
  { id: "newest",     label: "Newest" },
  { id: "price-asc",  label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating",     label: "Highest Rated" },
];

export default function CategoryPage({ params }) {
  const { slug } = use(params);

  const [category,    setCategory]    = useState(null);
  const [products,    setProducts]    = useState([]);
  const [total,       setTotal]       = useState(0);
  const [pages,       setPages]       = useState(1);
  const [page,        setPage]        = useState(1);
  const [loading,     setLoading]     = useState(true);
  const [notFound,    setNotFound]    = useState(false);

  const [maxPrice,    setMaxPrice]    = useState(800);
  const [minRating,   setMinRating]   = useState(0);
  const [sort,        setSort]        = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // fetch category info
  useEffect(() => {
    fetch(`${BASE}/categories/${slug}`)
      .then((r) => { if (!r.ok) { setNotFound(true); return null; } return r.json(); })
      .then((d) => d && setCategory(d.category))
      .catch(() => setNotFound(true));
  }, [slug]);

  // reset page when sort changes
  useEffect(() => { setPage(1); }, [sort]);

  // fetch products
  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    const params = new URLSearchParams({ category: slug, sort, page, limit: 20 });
    fetch(`${BASE}/products?${params}`)
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled) {
          setProducts(d.products ?? []);
          setTotal(d.total ?? 0);
          setPages(d.pages ?? 1);
        }
      })
      .catch(() => {})
      .finally(() => { if (!cancelled) setLoading(false); });
    return () => { cancelled = true; };
  }, [slug, sort, page]);

  const filtered = products.filter(
    (p) => p.price <= maxPrice && (!minRating || p.rating >= minRating)
  );

  if (notFound) {
    return (
      <div className="flex min-h-[50vh] flex-col items-center justify-center gap-4">
        <p className="font-display text-2xl font-bold">Category not found</p>
        <Link href="/categories" className="text-sm font-semibold text-primary hover:underline">← All categories</Link>
      </div>
    );
  }

  return (
    <div>
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 -z-10 gradient-primary" />
        <div className="absolute inset-0 -z-10 kente-pattern opacity-50" />
        <div className="mx-auto max-w-7xl px-4 py-16 text-primary-foreground">
          <nav className="mb-3 flex items-center gap-1.5 text-xs opacity-80">
            <Link href="/">Home</Link> /{" "}
            <Link href="/categories">Categories</Link> /{" "}
            <span className="font-semibold">{category?.name ?? slug}</span>
          </nav>
          <span className="text-xs font-semibold uppercase tracking-[0.25em] text-gold">Category</span>
          <h1 className="mt-2 font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            {category?.name ?? slug}
          </h1>
          {category?.banner && (
            <p className="mt-3 max-w-xl text-base text-primary-foreground/85">{category.banner}</p>
          )}
          <p className="mt-4 text-sm text-primary-foreground/70">{total} products available</p>
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
          <p className="text-sm text-muted-foreground">{filtered.length} results</p>
          <div className="ml-auto flex items-center gap-2">
            <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="rounded-full border border-border bg-card px-3 py-2 text-sm"
            >
              {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
            </select>
          </div>
        </div>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className={`${showFilters ? "block" : "hidden"} lg:block`}>
            <div className="sticky top-32 space-y-6 rounded-2xl border border-border bg-card p-5">
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Max price: ${maxPrice}</p>
                <input
                  type="range" min={10} max={800} step={10} value={maxPrice}
                  onChange={(e) => setMaxPrice(Number(e.target.value))}
                  className="w-full accent-primary"
                />
              </div>
              <div>
                <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">Min rating</p>
                <div className="flex flex-wrap gap-2">
                  {[0, 3, 3.5, 4, 4.5].map((r) => (
                    <button
                      key={r}
                      onClick={() => setMinRating(r)}
                      className={`rounded-full border px-3 py-1 text-xs font-semibold transition ${
                        minRating === r ? "border-primary bg-primary text-primary-foreground" : "border-border hover:border-primary"
                      }`}
                    >
                      {r === 0 ? "All" : `${r}+`}
                    </button>
                  ))}
                </div>
              </div>
              <button
                onClick={() => { setMaxPrice(800); setMinRating(0); }}
                className="w-full rounded-full border border-border py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
              >
                Clear filters
              </button>
            </div>
          </aside>

          <div>
            {loading ? (
              <div className="flex min-h-[40vh] items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-12 text-center">
                <p className="font-display text-xl font-bold">No products found.</p>
                <p className="mt-2 text-sm text-muted-foreground">Try clearing your filters.</p>
                <button
                  onClick={() => { setMaxPrice(800); setMinRating(0); }}
                  className="mt-4 rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
                >
                  Clear filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {filtered.map((p) => <ProductCard key={p.id} p={p} />)}
              </div>
            )}

            {pages > 1 && (
              <div className="mt-10 flex items-center justify-center gap-2">
                <button
                  disabled={page <= 1}
                  onClick={() => setPage((p) => p - 1)}
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:opacity-40 hover:bg-secondary"
                >
                  ← Prev
                </button>
                <span className="text-sm text-muted-foreground">Page {page} of {pages}</span>
                <button
                  disabled={page >= pages}
                  onClick={() => setPage((p) => p + 1)}
                  className="rounded-full border border-border px-4 py-2 text-sm font-semibold disabled:opacity-40 hover:bg-secondary"
                >
                  Next →
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
