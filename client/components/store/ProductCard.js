"use client";

import Link from "next/link";
import { Heart, Plus, Star } from "lucide-react";
const fmt = (n) => `$${Number(n).toFixed(2)}`;
import { useWishlist, useCart } from "@/lib/store-context";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";

export function ProductCard({ p, ribbon }) {
  const id = p._id ?? p.id;
  const image = p.images?.[0] ?? p.img ?? "";
  const originalPrice = p.originalPrice ?? p.original;
  const reviewCount = p.reviewCount ?? p.reviews;
  const rating = Number(p.rating);
  const discount = originalPrice
    ? Math.round(((originalPrice - p.price) / originalPrice) * 100)
    : 0;

  const wishlist = useWishlist();
  const cart = useCart();
  const wished = wishlist.has(id);

  return (
    <HoverCard openDelay={300} closeDelay={100}>
      <HoverCardTrigger asChild>
        {/* group lives here — HoverCardTrigger renders this div directly via asChild */}
        <div className="group relative flex flex-col overflow-hidden rounded-2xl bg-card shadow-(--shadow-soft) transition-all duration-300 hover:-translate-y-1 hover:shadow-(--shadow-elegant) cursor-pointer">
          {/* Image area */}
          <Link
            href={`/products/${p.slug ?? id}`}
            className="relative aspect-square overflow-hidden bg-muted"
          >
            <img
              src={image}
              alt={p.name}
              loading="lazy"
              className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-110"
            />

            {discount > 0 && (
              <span className="absolute left-3 top-3 rounded-full bg-gold px-2.5 py-1 text-[11px] font-bold text-gold-foreground">
                -{discount}%
              </span>
            )}

            {ribbon && (
              <span className="absolute left-0 top-6 rounded-r-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-wider text-primary-foreground">
                {ribbon}
              </span>
            )}

            {/* Quick Add — lives inside the image Link so overflow-hidden contains the slide */}
            <div
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                cart.add(id);
              }}
              className="absolute inset-x-3 bottom-3 translate-y-10 rounded-xl bg-primary py-2.5 text-center text-sm font-semibold text-primary-foreground opacity-0 shadow-lg transition-all duration-300 group-hover:translate-y-0 group-hover:opacity-100"
            >
              <span className="inline-flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" />
                Quick Add
              </span>
            </div>
          </Link>

          {/* Wishlist button */}
          <button
            type="button"
            onClick={(e) => {
              e.preventDefault();
              wishlist.toggle(id);
            }}
            className={`absolute right-3 top-3 z-10 grid h-9 w-9 place-items-center rounded-full bg-white/90 backdrop-blur transition-opacity duration-300 ${
              wished ? "opacity-100" : "opacity-0 group-hover:opacity-100"
            }`}
          >
            <Heart
              className={`h-4 w-4 ${wished ? "fill-red-500 text-red-500" : "text-gray-700"}`}
            />
          </button>

          {/* Info */}
          <Link
            href={`/products/${p.slug ?? id}`}
            className="flex flex-1 flex-col gap-1.5 p-4"
          >
            <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground">
              {p.brand}
            </p>
            <h3 className="line-clamp-2 text-sm font-semibold">{p.name}</h3>
            <div className="flex items-center gap-1 text-xs text-muted-foreground">
              <Star className="h-3.5 w-3.5 fill-yellow-400 text-yellow-400" />
              <span className="font-medium text-foreground">
                {rating.toFixed(1)}
              </span>
              <span>({reviewCount})</span>
            </div>
            <div className="mt-auto flex items-baseline gap-2 pt-1">
              <span className="text-base font-bold text-accent">
                {fmt(p.price)}
              </span>
              {originalPrice && (
                <span className="text-xs line-through text-muted-foreground">
                  {fmt(originalPrice)}
                </span>
              )}
            </div>
            {p.stock <= 5 && p.stock > 0 && (
              <p className="text-[11px] font-semibold text-red-500">
                Only {p.stock} left!
              </p>
            )}
          </Link>
        </div>
      </HoverCardTrigger>

      <HoverCardContent side="right" className="w-64 p-4">
        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
          {p.brand}
        </p>
        <p className="mt-1 text-sm font-semibold">{p.name}</p>
        <p className="mt-1 text-xs text-muted-foreground line-clamp-3">
          {p.description}
        </p>
        <div className="mt-2 flex items-center gap-1 text-xs">
          <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
          <span className="font-semibold">{rating.toFixed(1)}</span>
          <span className="text-muted-foreground">({reviewCount})</span>
        </div>
        <p className="mt-2 font-bold text-accent">{fmt(p.price)}</p>
      </HoverCardContent>
    </HoverCard>
  );
}

