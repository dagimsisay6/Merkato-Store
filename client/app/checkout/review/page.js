"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { MapPin, CreditCard, Loader2 } from "lucide-react";
import { useCart, useAuth } from "@/lib/store-context";
import { getSession, clearSession } from "@/lib/checkout-session";
import { createOrder } from "@/lib/api";

const fmt = (n) => `$${Number(n).toFixed(2)}`;
const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function ReviewPage() {
  const { token } = useAuth();
  const cart = useCart();
  const router = useRouter();

  const [session, setSession] = useState(null);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    const s = getSession();
    if (!s?.items?.length) { router.replace("/cart"); return; }
    setSession(s);
    const ids = s.items.map((i) => i.id).join(",");
    fetch(`${BASE}/products/by-ids?ids=${ids}`)
      .then((r) => r.ok ? r.json() : null)
      .catch(() => null)
      .then((data) => {
        setProducts(data?.products ?? []);
        setLoading(false);
      });
  }, []);

  const detailed = (session?.items ?? [])
    .map((si) => {
      const product = products.find((p) => p.id === si.id);
      return product ? { product, qty: si.qty } : null;
    })
    .filter(Boolean);

  const subtotal = detailed.reduce((s, d) => s + Number(d.product.price) * d.qty, 0);
  const shipping = subtotal > 50 ? 0 : subtotal > 0 ? 4.99 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  const handlePlaceOrder = async () => {
    setPlacing(true);
    setError("");
    try {
      await createOrder(
        {
          items: session.items,
          shippingAddress: session.shipping,
          paymentMethod: session.paymentMethod ?? "cod",
          subtotal,
          shippingFee: shipping,
          total,
        },
        token
      );
      // Only clear cart items that were in this checkout session if source is cart
      if (session.source === "cart") {
        session.items.forEach((i) => cart.remove(i.id));
      }
      clearSession();
      router.push("/order-success");
    } catch (err) {
      setError(err.message || "Failed to place order. Please try again.");
      setPlacing(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center py-20">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
      </div>
    );
  }

  const addr = session?.shipping;

  return (
    <div className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Review & place order</h2>

      {/* Items */}
      <div className="space-y-3">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Items ({detailed.length})
        </p>
        {detailed.map(({ product, qty }) => (
          <div key={product.id} className="flex items-center gap-4 rounded-2xl border border-border bg-secondary/30 p-4">
            <div className="h-16 w-16 shrink-0 overflow-hidden rounded-xl bg-muted">
              <img src={product.images?.[0] || null} alt={product.name} className="h-full w-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="line-clamp-1 font-semibold">{product.name}</p>
              <p className="text-xs text-muted-foreground">{product.brand} · Qty: {qty}</p>
            </div>
            <p className="font-display font-bold text-accent">{fmt(Number(product.price) * qty)}</p>
          </div>
        ))}
      </div>

      {/* Shipping */}
      {addr && (
        <div className="rounded-2xl border border-border bg-secondary/30 p-4">
          <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
            <MapPin className="h-3.5 w-3.5" /> Shipping to
          </div>
          <p className="mt-2 text-sm font-semibold">{addr.firstName} {addr.lastName}</p>
          <p className="text-sm text-muted-foreground">
            {addr.line1}, {addr.city}, {addr.state} {addr.postal} · {addr.country}
          </p>
          <p className="text-sm text-muted-foreground">{addr.phone}</p>
        </div>
      )}

      {/* Payment */}
      <div className="rounded-2xl border border-border bg-secondary/30 p-4">
        <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
          <CreditCard className="h-3.5 w-3.5" /> Payment
        </div>
        <p className="mt-2 text-sm font-semibold capitalize">
          {session?.paymentMethod === "card" ? "Credit / Debit Card"
            : session?.paymentMethod === "momo" ? "Mobile Money"
            : "Cash on Delivery"}
        </p>
      </div>

      {/* Totals */}
      <div className="space-y-2 rounded-2xl border border-border bg-secondary/30 p-4 text-sm">
        <Row label="Subtotal" value={fmt(subtotal)} />
        <Row label={shipping === 0 ? "Shipping (free)" : "Shipping"} value={fmt(shipping)} />
        <Row label="Tax (5%)" value={fmt(tax)} />
        <div className="flex items-baseline justify-between border-t border-border pt-3">
          <p className="font-display text-base font-bold">Total</p>
          <p className="font-display text-xl font-extrabold text-accent">{fmt(total)}</p>
        </div>
      </div>

      {error && (
        <p className="rounded-xl bg-red-500/10 px-4 py-3 text-sm font-medium text-red-500">{error}</p>
      )}

      <div className="flex justify-between pt-2">
        <Link href="/checkout/payment" className="rounded-full border border-border px-6 py-3 text-sm font-semibold">
          Back
        </Link>
        <button
          onClick={handlePlaceOrder}
          disabled={placing}
          className="inline-flex items-center gap-2 rounded-full bg-accent px-10 py-3 text-sm font-semibold text-accent-foreground disabled:opacity-60"
        >
          {placing && <Loader2 className="h-4 w-4 animate-spin" />}
          {placing ? "Placing order…" : "Place order"}
        </button>
      </div>
    </div>
  );
}

function Row({ label, value }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className="font-semibold">{value}</span>
    </div>
  );
}
