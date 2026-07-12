"use client";

import { Suspense, useEffect, useState, useRef } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Search, Loader2, ArrowDownUp, SlidersHorizontal } from "lucide-react";
import { PageHeader } from "@/components/store/PageHeader";
import { ProductCard } from "@/components/store/ProductCard";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const SORTS = [
  { id: "newest",     label: "Newest" },
  { id: "rating",     label: "Best Rated" },
  { id: "price-asc",  label: "Price: Low → High" },
  { id: "price-desc", label: "Price: High → Low" },
];

export default function SearchPage() {
  return (
    <Suspense fallback={<SearchSkeleton />}>
      <SearchContent />
    </Suspense>
  );
}

function SearchContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const initialQ = searchParams.get("q") || "";

  const [q, setQ]           = useState(initialQ);
  const [input, setInput]   = useState(initialQ);
  const [sort, setSort]     = useState("newest");
  const [page, setPage]     = useState(1);
  const [products, setProducts] = useState([]);
  const [total, setTotal]   = useState(0);
  const [pages, setPages]   = useState(1);
  const [loading, setLoading] = useState(false);
  const debounceRef = useRef(null);

  // Sync URL → state when navigating from header
  useEffect(() => {
    const urlQ = searchParams.get("q") || "";
    setInput(urlQ);
    setQ(urlQ);
    setPage(1);
  }, [searchParams.get("q")]);

  // Debounce input → q
  useEffect(() => {
    clearTimeout(debounceRef.current);
    debounceRef.current = setTimeout(() => {
      setQ(input);
      setPage(1);
    }, 350);
    return () => clearTimeout(debounceRef.current);
  }, [input]);

  // Fetch from API whenever q / sort / page changes
  useEffect(() => {
    if (!q.trim()) { setProducts([]); setTotal(0); setPages(1); return; }
    let cancelled = false;
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ search: q.trim(), sort, page, limit: 20 });
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
  }, [q, sort, page]);

  // Push q to URL so it's shareable / back-navigable
  useEffect(() => {
    if (!q.trim()) return;
    const url = `/search?q=${encodeURIComponent(q.trim())}`;
    router.replace(url, { scroll: false });
  }, [q]);

  const handleSubmit = (e) => {
    e.preventDefault();
    setQ(input.trim());
    setPage(1);
  };

  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Search" }]}
        eyebrow="Search"
        title={q ? `Results for "${q}"` : "Search Products"}
        subtitle={q && !loading ? `${total} result${total !== 1 ? "s" : ""} found` : undefined}
      />

      <div className="mx-auto max-w-7xl px-4 py-8">
        {/* Search bar */}
        <form onSubmit={handleSubmit} className="relative mb-8">
          <Search className="absolute left-5 top-1/2 h-5 w-5 -translate-y-1/2 text-muted-foreground" />
          <input
            autoFocus
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Search for products, brands, categories…"
            className="h-14 w-full rounded-full border border-border bg-card pl-14 pr-36 text-base outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
          <button
            type="submit"
            className="absolute right-2 top-1/2 -translate-y-1/2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow"
          >
            Search
          </button>
        </form>

        {/* Sort bar */}
        {q && (
          <div className="mb-6 flex items-center justify-between gap-3">
            <p className="text-sm text-muted-foreground">
              {loading ? "Searching…" : `${total} result${total !== 1 ? "s" : ""}`}
            </p>
            <div className="flex items-center gap-2">
              <ArrowDownUp className="h-4 w-4 text-muted-foreground" />
              <select
                value={sort}
                onChange={(e) => { setSort(e.target.value); setPage(1); }}
                className="rounded-full border border-border bg-card px-3 py-2 text-sm"
              >
                {SORTS.map((s) => <option key={s.id} value={s.id}>{s.label}</option>)}
              </select>
            </div>
          </div>
        )}

        {/* Results */}
        {!q.trim() ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
              <Search className="h-8 w-8" />
            </div>
            <p className="font-display text-xl font-bold">What are you looking for?</p>
            <p className="text-sm text-muted-foreground">Type above to search across all products.</p>
          </div>
        ) : loading ? (
          <div className="flex min-h-[40vh] items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : products.length === 0 ? (
          <div className="flex min-h-[40vh] flex-col items-center justify-center gap-3 text-center">
            <div className="grid h-16 w-16 place-items-center rounded-full bg-muted text-muted-foreground">
              <Search className="h-8 w-8" />
            </div>
            <p className="font-display text-xl font-bold">No results for "{q}"</p>
            <p className="text-sm text-muted-foreground">
              Try different keywords, check spelling, or browse categories.
            </p>
            <a href="/products" className="mt-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
              Browse all products
            </a>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
              {products.map((p) => <ProductCard key={p.id} p={p} />)}
            </div>

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
          </>
        )}
      </div>
    </div>
  );
}

function SearchSkeleton() {
  return (
    <div className="mx-auto max-w-7xl px-4 py-10">
      <div className="mb-8 h-14 animate-pulse rounded-full bg-muted/50" />
      <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }).map((_, i) => (
          <div key={i} className="h-72 animate-pulse rounded-3xl bg-muted/50" />
        ))}
      </div>
    </div>
  );
}
