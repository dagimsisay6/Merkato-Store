"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, MapPin, Heart, Star, ArrowRight } from "lucide-react";
import { fmt } from "@/lib/store-data";
import { useAuth, useWishlist, useCart } from "@/lib/store-context";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const STATUS_STYLE = {
  delivered:  "bg-primary/10 text-primary",
  in_transit: "bg-gold/20 text-gold-foreground",
  processing: "bg-secondary text-foreground",
  pending:    "bg-secondary text-foreground",
  cancelled:  "bg-ember/10 text-ember",
};

export default function Dashboard() {
  const { user, token } = useAuth();
  const cart = useCart();
  const wish = useWishlist();
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);

  useEffect(() => {
    if (!token) return;
    async function load() {
      try {
        const [oRes, aRes] = await Promise.all([
          fetch(`${BASE}/orders`, { headers: { Authorization: `Bearer ${token}` } }),
          fetch(`${BASE}/users/addresses`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const oData = await oRes.json();
        const aData = await aRes.json();
        setOrders(oData.orders ?? []);
        setAddresses(aData.addresses ?? []);
      } catch {}
    }
    load();
  }, [token]);

  const stats = [
    { icon: Package, label: "Orders",    value: orders.length,      to: "/account/orders" },
    { icon: Heart,   label: "Wishlist",  value: wish.ids.length,    to: "/account/wishlist" },
    { icon: MapPin,  label: "Addresses", value: addresses.length,   to: "/account/addresses" },
    { icon: Star,    label: "Reviews",   value: "—",                to: "/account/reviews" },
  ];

  return (
    <div className="space-y-8">
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((s) => (
          <Link key={s.label} href={s.to}
            className="group rounded-2xl border border-border bg-card p-5 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-(--shadow-soft)"
          >
            <div className="flex items-start justify-between">
              <div className="grid h-10 w-10 place-items-center rounded-xl bg-primary/10 text-primary">
                <s.icon className="h-5 w-5" />
              </div>
              <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
            </div>
            <p className="mt-4 font-display text-3xl font-extrabold">{s.value}</p>
            <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">{s.label}</p>
          </Link>
        ))}
      </div>

      <div className="rounded-3xl border border-border bg-card p-6">
        <div className="flex items-center justify-between">
          <h2 className="font-display text-xl font-bold">Recent orders</h2>
          <Link href="/account/orders" className="text-sm font-semibold text-primary hover:underline">View all →</Link>
        </div>
        <div className="mt-4 divide-y divide-border">
          {orders.length === 0 ? (
            <p className="py-6 text-center text-sm text-muted-foreground">No orders yet</p>
          ) : orders.slice(0, 3).map((o) => (
            <Link key={o.id} href={`/account/orders/${o.id}`}
              className="flex items-center justify-between gap-3 py-3 transition hover:bg-secondary/50"
            >
              <div>
                <p className="font-semibold">#{o.id}</p>
                <p className="text-xs text-muted-foreground">
                  {new Date(o.created_at).toLocaleDateString()} · {o.items?.length ?? 0} items
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[o.status] ?? ""}`}>
                {o.status}
              </span>
              <p className="font-bold">{fmt(Number(o.total))}</p>
            </Link>
          ))}
        </div>
      </div>

      {cart.count > 0 && (
        <div className="rounded-3xl gradient-primary p-6 text-primary-foreground">
          <p className="text-xs font-bold uppercase tracking-widest">You left items in your cart</p>
          <p className="mt-1 font-display text-lg font-bold">{cart.count} items · {fmt(cart.subtotal)}</p>
          <Link href="/cart" className="mt-3 inline-block rounded-full bg-card px-5 py-2 text-sm font-semibold text-primary">
            Resume checkout →
          </Link>
        </div>
      )}
    </div>
  );
}
