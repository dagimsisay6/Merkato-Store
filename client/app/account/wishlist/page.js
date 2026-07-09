"use client";

import Link from "next/link";
import { Heart, ShoppingBag, Trash2 } from "lucide-react";
import { fmt, imgSrc, PRODUCTS } from "@/lib/store-data";
import { useWishlist } from "@/lib/store-context";

export default function WishlistPage() {
  const wish = useWishlist();
  const items = PRODUCTS.filter((p) => wish.has(p.id));
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Wishlist</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          {items.length} saved items.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Heart className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-display text-xl font-bold">
            No saved items yet
          </h3>
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
          {items.map((p) => (
            <div
              key={p.id}
              className="flex items-center gap-4 rounded-2xl border border-border bg-card p-4"
            >
              <Link
                href={`/products/${p.slug ?? p.id}`}
                className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted"
              >
                <img
                  src={imgSrc(p.img)}
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
                <p className="mt-1 font-display font-bold text-accent">
                  {fmt(p.price)}
                </p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={() => wish.moveToCart(p.id)}
                  className="inline-flex items-center gap-1.5 rounded-full bg-primary px-4 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-glow"
                >
                  <ShoppingBag className="h-3.5 w-3.5" /> Move to cart
                </button>
                <button
                  onClick={() => wish.remove(p.id)}
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

