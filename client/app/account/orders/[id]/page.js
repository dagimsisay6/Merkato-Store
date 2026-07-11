"use client";

import { useEffect, useState } from "react";
import { use } from "react";
import Link from "next/link";
import { Truck, Package, MapPin, Download, RotateCcw, Loader2 } from "lucide-react";
import { useAuth } from "@/lib/store-context";

const BASE = process.env.NEXT_PUBLIC_API_URL;
const fmt = (n) => `$${Number(n).toFixed(2)}`;

const STATUS_STYLE = {
  delivered:  "bg-primary/10 text-primary",
  in_transit: "bg-gold/20 text-gold-foreground",
  processing: "bg-secondary text-foreground",
  pending:    "bg-secondary text-foreground",
  cancelled:  "bg-ember/10 text-ember",
};

export default function OrderDetailPage({ params }) {
  const { id } = use(params);
  const { token } = useAuth();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/orders/${id}`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setOrder(d.order ?? null))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id, token]);

  if (loading) {
    return (
      <div className="flex min-h-[40vh] items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="rounded-3xl border border-border bg-card p-12 text-center">
        <p className="font-display text-xl font-bold">Order not found</p>
        <Link href="/account/orders" className="mt-4 inline-block text-sm font-semibold text-primary hover:underline">
          ← Back to orders
        </Link>
      </div>
    );
  }

  const shipping = order.shipping_address ?? {};

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <Link href="/account/orders" className="text-sm font-medium text-primary hover:underline">
            ← Back to orders
          </Link>
          <h1 className="mt-2 font-display text-2xl font-extrabold">Order #{order.id}</h1>
          <p className="text-sm text-muted-foreground">
            Placed on {new Date(order.created_at).toLocaleDateString()}
          </p>
        </div>
        <span className={`rounded-full px-4 py-1.5 text-sm font-semibold ${STATUS_STYLE[order.status] ?? "bg-secondary text-foreground"}`}>
          {order.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Items */}
        <div className="lg:col-span-2 rounded-3xl border border-border bg-card p-6">
          <h2 className="font-display text-lg font-bold mb-4">Items</h2>
          <div className="divide-y divide-border">
            {(order.items ?? []).map((item, i) => (
              <div key={i} className="flex gap-4 py-4">
                <div className="h-20 w-20 shrink-0 overflow-hidden rounded-xl bg-muted">
                  {item.image && <img src={item.image} alt={item.name} className="h-full w-full object-cover" />}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold line-clamp-2">{item.name}</p>
                  <p className="text-sm text-muted-foreground">Qty: {item.qty}</p>
                  <p className="text-sm font-medium">{fmt(item.price)}</p>
                </div>
                <p className="font-bold shrink-0">{fmt(item.price * item.qty)}</p>
              </div>
            ))}
          </div>
          <div className="mt-4 border-t border-border pt-4 flex justify-between">
            <span className="font-semibold">Total</span>
            <span className="font-display text-lg font-extrabold text-accent">{fmt(Number(order.total))}</span>
          </div>
        </div>

        {/* Delivery info */}
        <div className="rounded-3xl border border-border bg-card p-6 space-y-5">
          <h2 className="font-display text-lg font-bold">Delivery</h2>
          <div className="flex gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Truck className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">Standard Delivery</p>
              <p className="text-xs text-muted-foreground">2–3 business days</p>
              {order.tracking_number && (
                <p className="text-xs text-muted-foreground mt-0.5">Tracking: {order.tracking_number}</p>
              )}
            </div>
          </div>
          {shipping.line1 && (
            <div className="flex gap-3">
              <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                <MapPin className="h-4 w-4" />
              </div>
              <div>
                <p className="font-semibold text-sm">Shipping address</p>
                <p className="text-xs text-muted-foreground mt-0.5">
                  {shipping.firstName} {shipping.lastName}<br />
                  {shipping.line1}<br />
                  {shipping.city}, {shipping.state} {shipping.postal}<br />
                  {shipping.country}
                </p>
              </div>
            </div>
          )}
          <div className="flex gap-3">
            <div className="grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
              <Package className="h-4 w-4" />
            </div>
            <div>
              <p className="font-semibold text-sm">Payment</p>
              <p className="text-xs text-muted-foreground capitalize mt-0.5">{order.payment_method ?? "—"}</p>
            </div>
          </div>
        </div>
      </div>

      <div className="flex gap-3">
        <button className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary">
          <Download className="h-4 w-4" /> Invoice
        </button>
        <button className="inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-semibold hover:bg-secondary">
          <RotateCcw className="h-4 w-4" /> Return
        </button>
      </div>
    </div>
  );
}
