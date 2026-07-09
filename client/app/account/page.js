"use client";

import Link from "next/link";
import { Package, MapPin, Heart, Star, ArrowRight } from "lucide-react";

import { fmt, MOCK_ORDERS } from "@/lib/store-data";
import { useCart, useWishlist } from "@/lib/store-context";

export default function Dashboard() {
  const cart = useCart();
  const wish = useWishlist();

  const stats = [
    {
      icon: Package,
      label: "Orders",
      value: MOCK_ORDERS.length,
      to: "/account/orders",
    },
    {
      icon: Heart,
      label: "Wishlist",
      value: wish.ids.length,
      to: "/account/wishlist",
    },
    {
      icon: MapPin,
      label: "Addresses",
      value: 2,
      to: "/account/addresses",
    },
    {
      icon: Star,
      label: "Loyalty points",
      value: 1280,
      to: "/account/settings",
    },
  ];

  return (
    <div className="space-y-8">
      {/* Stats Cards */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => {
          const Icon = s.icon;

          return (
            <Link
              key={s.label}
              href={s.to}
              className="
              group rounded-2xl border border-border 
              bg-card p-5 transition 
              hover:-translate-y-1 
              hover:border-primary/30
              hover:shadow-[var(--shadow-soft)]
              "
            >
              <div className="flex items-start justify-between">
                <div
                  className="
                grid h-10 w-10 place-items-center 
                rounded-xl bg-primary/10 text-primary
                "
                >
                  <Icon className="h-5 w-5" />
                </div>

                <ArrowRight
                  className="
                  h-4 w-4 text-muted-foreground 
                  transition 
                  group-hover:translate-x-1 
                  group-hover:text-primary
                  "
                />
              </div>

              <p className="mt-4 font-display text-3xl font-extrabold">
                {s.value}
              </p>

              <p
                className="
              text-xs font-semibold uppercase 
              tracking-widest text-muted-foreground
              "
              >
                {s.label}
              </p>
            </Link>
          );
        })}
      </div>

      {/* Recent Orders */}

      <div
        className="
      rounded-3xl border border-border 
      bg-card p-6
      "
      >
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Recent orders</h2>

          <Link
            href="/account/orders"
            className="
            text-sm font-semibold 
            text-primary hover:underline
            "
          >
            View all →
          </Link>
        </div>

        <div className="mt-4 divide-y divide-border">
          {MOCK_ORDERS.slice(0, 3).map((o) => (
            <Link
              key={o.id}
              href={`/account/orders/${o.id}`}
              className="
              flex items-center justify-between 
              gap-3 py-3 transition 
              hover:bg-secondary/50
              "
            >
              <div>
                <p className="font-semibold">{o.id}</p>

                <p className="text-xs text-muted-foreground">
                  {o.date} · {o.items} items
                </p>
              </div>

              <p
                className={`
                rounded-full px-3 py-1 
                text-xs font-semibold

                ${
                  o.status === "Delivered"
                    ? "bg-primary/10 text-primary"
                    : o.status === "In transit"
                      ? "bg-gold/20 text-gold-foreground"
                      : "bg-secondary text-foreground"
                }
                `}
              >
                {o.status}
              </p>

              <p className="font-bold">{fmt(o.total)}</p>
            </Link>
          ))}
        </div>
      </div>

      {/* Cart Reminder */}

      {cart.count > 0 && (
        <div
          className="
        rounded-3xl gradient-primary 
        p-6 text-primary-foreground
        "
        >
          <p
            className="
          text-xs font-bold 
          uppercase tracking-widest
          "
          >
            You left items in your cart
          </p>

          <p
            className="
          mt-1 font-display text-lg font-bold
          "
          >
            {cart.count} items · {fmt(cart.subtotal)}
          </p>

          <Link
            href="/cart"
            className="
            mt-3 inline-block 
            rounded-full bg-card 
            px-5 py-2 text-sm 
            font-semibold text-primary
            "
          >
            Resume checkout →
          </Link>
        </div>
      )}
    </div>
  );
}

