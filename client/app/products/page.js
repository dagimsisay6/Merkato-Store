"use client";

import { Suspense, useEffect, useState } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { SlidersHorizontal, ArrowDownUp } from "lucide-react";
import { ProductCardSkeleton } from "@/components/ui/Skeleton";

import { PageHeader } from "@/components/store/PageHeader";
import { ProductCard } from "@/components/store/ProductCard";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const SORTS = [
  { id: "newest",     label: "Newest" },
  { id: "price-asc",  label: "Price: Low to High" },
  { id: "price-desc", label: "Price: High to Low" },
  { id: "rating",     label: "Highest Rated" },
];

export default function ProductsPage() {
  return (
    <Suspense fallback={<ProductsPageSkeleton />}>
      <ProductsPageContent />
    </Suspense>
  );
}

function ProductsPageContent() {
  const searchParams = useSearchParams();

  const [products,    setProducts]    = useState([]);
  const [categories,  setCategories]  = useState([]);
  const [total,       setTotal]       = useState(0);
  const [page,        setPage]        = useState(1);
  const [pages,       setPages]       = useState(1);
  const [loading,     setLoading]     = useState(true);

  const [cat,         setCat]         = useState(searchParams.get("category") || "");
  const [maxPrice,    setMaxPrice]    = useState(800);
  const [minRating,   setMinRating]   = useState(0);
  const [sort,        setSort]        = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  // fetch categories once
  useEffect(() => {
    fetch(`${BASE}/categories`)
      .then((r) => r.json())
      .then((d) => setCategories(d.categories ?? []))
      .catch(() => {});
  }, []);

  useEffect(() => {
    setPage(1);
  }, [cat, sort]);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      setLoading(true);
      const params = new URLSearchParams({ sort, page, limit: 20 });
      if (cat) params.set("category", cat);
      try {
        const res  = await fetch(`${BASE}/products?${params}`);
        const data = await res.json();
        if (!cancelled) {
          setProducts(data.products ?? []);
          setTotal(data.total ?? 0);
          setPages(data.pages ?? 1);
        }
      } catch {}
      if (!cancelled) setLoading(false);
    }
    load();
    return () => { cancelled = true; };
  }, [cat, sort, page]);

  const clearFilters = () => { setCat(""); setMaxPrice(800); setMinRating(0); };

  const filtered = products.filter(
    (p) => p.price <= maxPrice && (!minRating || p.rating >= minRating)
  );

  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "All Products" }]}
        eyebrow="Catalog"
        title="All Products"
        subtitle={`${total} items from trusted sellers`}
      />

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
              <FilterGroup title="Category">
                <label className="flex cursor-pointer items-center gap-2 text-sm">
                  <input type="radio" checked={cat === ""} onChange={() => setCat("")} /> All
                </label>
                {categories.map((c) => (
                  <label key={c.slug} className="flex cursor-pointer items-center gap-2 text-sm">
                    <input type="radio" checked={cat === c.slug} onChange={() => setCat(c.slug)} />
                    {c.name}
                  </label>
                ))}
              </FilterGroup>

              <FilterGroup title={`Max price: $${maxPrice}`}>
                <input
                  type="range" min={10} max={800} step={10} value={maxPrice}
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

              <button
                onClick={clearFilters}
                className="w-full rounded-full border border-border py-2 text-xs font-semibold text-muted-foreground hover:bg-secondary"
              >
                Clear filters
              </button>
            </div>
          </aside>

          <div>
            {loading ? (
              <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
                {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
              </div>
            ) : filtered.length === 0 ? (
              <div className="rounded-3xl border border-border bg-card p-12 text-center">
                <p className="font-display text-xl font-bold">No products found.</p>
                <p className="mt-2 text-sm text-muted-foreground">Try clearing your filters.</p>
                <button
                  onClick={clearFilters}
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

            {/* Pagination */}
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

function ProductsPageSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-6 h-10 animate-pulse rounded-full bg-muted/60" />
      <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
        <div className="hidden h-80 animate-pulse rounded-2xl bg-muted/60 lg:block" />
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {Array.from({ length: 8 }).map((_, i) => <ProductCardSkeleton key={i} />)}
        </div>
      </div>
    </div>
  );
}

function FilterGroup({ title, children }) {
  return (
    <div>
      <p className="mb-3 text-xs font-bold uppercase tracking-widest text-muted-foreground">{title}</p>
      <div className="space-y-2">{children}</div>
    </div>
  );
}
