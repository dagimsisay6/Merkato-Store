"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Heart, ShoppingBag, Zap, Trash2 } from "lucide-react";
import { useWishlist, useAuth, useCart } from "@/lib/store-context";

const fmt = (n) => `$${Number(n).toFixed(2)}`;
const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function WishlistPage() {
  const { ids, remove, moveToCart } = useWishlist();
  const { token } = useAuth();
  const cart = useCart();
  const router = useRouter();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!ids.length) { setProducts([]); setLoading(false); return; }
    setLoading(true);
    fetch(`${BASE}/products/by-ids?ids=${ids.join(",")}`, { cache: "no-store" })
      .then(r => r.ok ? r.json() : null)
      .catch(() => null)
      .then(data => {
        setProducts(data?.products ?? []);
        setLoading(false);
      });
  }, [ids.join(",")]);

  const handleBuyNow = (p) => {
    cart.buyNow(p.id, 1);
    router.push("/checkout/shipping");
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Wishlist</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {ids.length} saved item{ids.length !== 1 ? "s" : ""}.
        </p>
      </div>

      {loading ? (
        <div className="space-y-3">
          {[...Array(ids.length || 2)].map((_, i) => (
            <div key={i} className="h-28 animate-pulse rounded-2xl bg-muted" />
          ))}
        </div>
      ) : ids.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Heart className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-display text-xl font-bold">No saved items yet</h3>
          <p className="mt-2 text-sm text-muted-foreground">
            Tap the heart on any product to save it for later.
          </p>
          <Link
            href="/products"
            className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
          >
            Discover products
          </Link>
        </div>
      ) : (
        <div className="grid gap-3">
          {products.map((p) => (
            <div
              key={p.id}
              className="flex flex-wrap items-center gap-4 rounded-2xl border border-border bg-card p-4 sm:flex-nowrap"
            >
              <Link
                href={`/products/${p.slug ?? p.id}`}
                className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted"
              >
                <img
                  src={p.images?.[0] || null}
                  alt={p.name}
                  className="h-full w-full object-cover"
                />
              </Link>
              <div className="flex-1 min-w-0">
                <Link
                  href={`/products/${p.slug ?? p.id}`}
                  className="line-clamp-1 font-semibold hover:text-primary"
                >
                  {p.name}
                </Link>
                <p className="text-xs text-muted-foreground">{p.brand}</p>
                <p className="mt-1 font-display font-bold text-accent">{fmt(p.price)}</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => handleBuyNow(p)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-accent px-4 py-2 text-xs font-semibold text-accent-foreground hover:bg-accent/90"
                >
                  <Zap className="h-3.5 w-3.5" /> Buy Now
                </button>
                <button
                  onClick={() => moveToCart(p.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-glow"
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> Move to cart
                </button>
                <button
                  onClick={() => remove(p.id)}
                  aria-label="Remove"
                  className="grid h-9 w-9 place-items-center rounded-full border border-border text-muted-foreground hover:text-ember"
                >
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
