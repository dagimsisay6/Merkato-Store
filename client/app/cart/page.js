"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Minus, Plus, Trash2, Tag, ShoppingBag, ArrowRight } from "lucide-react";
import { PageHeader } from "@/components/store/PageHeader";
import { useCart, useAuth } from "@/lib/store-context";
import { startCartCheckout } from "@/lib/checkout-session";

const fmt = (n) => `$${Number(n).toFixed(2)}`;

export default function CartPage() {
  const cart = useCart();
  const { isLoggedIn } = useAuth();
  const router = useRouter();
  const [selected, setSelected] = useState(() => new Set());
  const [coupon, setCoupon] = useState("");
  const [applied, setApplied] = useState(null);

  // Keep selected in sync when cart items change
  const allIds = cart.detailed.map((d) => d.product.id);
  const validSelected = new Set([...selected].filter((id) => allIds.includes(id)));

  const toggleOne = (id) => {
    setSelected((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });
  };

  const toggleAll = () => {
    setSelected(
      validSelected.size === allIds.length ? new Set() : new Set(allIds)
    );
  };

  const selectedItems = cart.detailed.filter((d) =>
    validSelected.has(d.product.id)
  );

  const subtotal = selectedItems.reduce(
    (s, d) => s + Number(d.product.price) * d.qty,
    0
  );
  const discount = applied === "MERKATO10" ? subtotal * 0.1 : 0;
  const shipping = subtotal > 50 ? 0 : subtotal > 0 ? 4.99 : 0;
  const tax = (subtotal - discount) * 0.05;
  const total = Math.max(0, subtotal - discount + shipping + tax);

  const handleCheckout = () => {
    if (!validSelected.size) return;
    startCartCheckout(
      selectedItems.map((d) => ({ id: d.product.id, qty: d.qty }))
    );
    router.push("/checkout/shipping");
  };

  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Cart" }]}
        eyebrow="Step 1 of 3"
        title="Your Cart"
        subtitle={
          cart.count > 0
            ? `${cart.count} item${cart.count > 1 ? "s" : ""} in your cart.`
            : "Your cart is currently empty."
        }
      />

      <div className="mx-auto max-w-7xl px-4 py-10">
        {!isLoggedIn ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold">Sign in to view your cart</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Your cart is saved to your account so you never lose your items.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link href="/signin" className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
                Sign in
              </Link>
              <Link href="/signup" className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold">
                Create account
              </Link>
            </div>
          </div>
        ) : cart.detailed.length === 0 ? (
          <div className="rounded-3xl border border-border bg-card p-12 text-center">
            <div className="mx-auto grid h-16 w-16 place-items-center rounded-full bg-primary/10 text-primary">
              <ShoppingBag className="h-8 w-8" />
            </div>
            <h2 className="mt-4 font-display text-2xl font-bold">Your cart is empty</h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Discover bestsellers, new arrivals, and flash deals.
            </p>
            <div className="mt-5 flex justify-center gap-3">
              <Link href="/products" className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground">
                Browse products
              </Link>
              <Link href="/deals" className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold">
                See deals
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid gap-8 lg:grid-cols-[1fr_400px]">
            <div className="space-y-4">
              {/* Select all */}
              <label className="flex cursor-pointer items-center gap-3 rounded-2xl border border-border bg-card px-5 py-3">
                <input
                  type="checkbox"
                  checked={validSelected.size === allIds.length && allIds.length > 0}
                  onChange={toggleAll}
                  className="h-4 w-4 accent-primary"
                />
                <span className="text-sm font-semibold">
                  Select all ({allIds.length} items)
                </span>
                {validSelected.size > 0 && validSelected.size < allIds.length && (
                  <span className="ml-auto text-xs text-muted-foreground">
                    {validSelected.size} selected
                  </span>
                )}
              </label>

              {cart.detailed.map(({ product, qty }) => (
                <div
                  key={product.id}
                  className={`flex gap-3 rounded-2xl border bg-card p-4 transition ${
                    validSelected.has(product.id) ? "border-primary/40" : "border-border"
                  }`}
                >
                  {/* Checkbox */}
                  <div className="flex items-start pt-1">
                    <input
                      type="checkbox"
                      checked={validSelected.has(product.id)}
                      onChange={() => toggleOne(product.id)}
                      className="h-4 w-4 accent-primary"
                    />
                  </div>

                  <Link
                    href={`/products/${product.slug ?? product.id}`}
                    className="h-28 w-28 shrink-0 overflow-hidden rounded-xl bg-muted sm:h-32 sm:w-32"
                  >
                    <img
                      src={product.images?.[0] || null}
                      alt={product.name}
                      className="h-full w-full object-cover"
                    />
                  </Link>

                  <div className="flex flex-1 flex-col">
                    <div className="flex items-start justify-between gap-3">
                      <div>
                        <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
                          {product.brand}
                        </p>
                        <Link
                          href={`/products/${product.slug ?? product.id}`}
                          className="line-clamp-2 font-semibold hover:text-primary"
                        >
                          {product.name}
                        </Link>
                      </div>
                      <button
                        onClick={() => {
                          cart.remove(product.id);
                          setSelected((prev) => {
                            const next = new Set(prev);
                            next.delete(product.id);
                            return next;
                          });
                        }}
                        className="grid h-8 w-8 shrink-0 place-items-center rounded-full text-muted-foreground hover:bg-secondary hover:text-red-500"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="mt-auto flex flex-wrap items-end justify-between gap-3 pt-3">
                      <div className="inline-flex items-center rounded-full border border-border">
                        <button
                          onClick={() => cart.setQty(product.id, qty - 1)}
                          className="grid h-9 w-9 place-items-center"
                        >
                          <Minus className="h-3.5 w-3.5" />
                        </button>
                        <span className="min-w-8 text-center text-sm font-semibold">{qty}</span>
                        <button
                          onClick={() => cart.setQty(product.id, qty + 1)}
                          className="grid h-9 w-9 place-items-center"
                        >
                          <Plus className="h-3.5 w-3.5" />
                        </button>
                      </div>
                      <p className="font-display text-lg font-bold text-accent">
                        {fmt(Number(product.price) * qty)}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <aside>
              <div className="sticky top-32 space-y-4 rounded-2xl border border-border bg-card p-6">
                <h3 className="font-display text-lg font-bold">Order summary</h3>

                {validSelected.size === 0 && (
                  <p className="rounded-xl bg-secondary px-4 py-3 text-sm text-muted-foreground">
                    Select items above to see your total.
                  </p>
                )}

                <div>
                  <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                    Coupon code
                  </label>
                  <div className="mt-1 flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                      <input
                        value={coupon}
                        onChange={(e) => setCoupon(e.target.value)}
                        placeholder="Try MERKATO10"
                        className="h-10 w-full rounded-full border border-border bg-background pl-9 pr-3 text-sm outline-none"
                      />
                    </div>
                    <button
                      onClick={() => setApplied(coupon.trim().toUpperCase())}
                      className="rounded-full bg-secondary px-4 text-sm font-semibold"
                    >
                      Apply
                    </button>
                  </div>
                  {applied === "MERKATO10" && (
                    <p className="mt-1 text-xs font-semibold text-primary">✓ 10% off applied</p>
                  )}
                  {applied && applied !== "MERKATO10" && (
                    <p className="mt-1 text-xs text-red-500">Invalid code</p>
                  )}
                </div>

                <div className="space-y-2 border-t border-border pt-4 text-sm">
                  <Row label={`Subtotal (${validSelected.size} item${validSelected.size !== 1 ? "s" : ""})`} value={fmt(subtotal)} />
                  {discount > 0 && <Row label="Discount (MERKATO10)" value={`-${fmt(discount)}`} accent />}
                  <Row label={shipping === 0 ? "Shipping (free)" : "Shipping"} value={fmt(shipping)} />
                  <Row label="Tax (5%)" value={fmt(tax)} />
                </div>

                <div className="flex items-baseline justify-between border-t border-border pt-4">
                  <p className="font-display text-lg font-bold">Total</p>
                  <p className="font-display text-2xl font-extrabold text-accent">{fmt(total)}</p>
                </div>

                <button
                  onClick={handleCheckout}
                  disabled={validSelected.size === 0}
                  className="inline-flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-40"
                >
                  Checkout {validSelected.size > 0 ? `(${validSelected.size})` : ""} <ArrowRight className="h-4 w-4" />
                </button>

                <Link href="/products" className="block text-center text-sm font-semibold text-muted-foreground">
                  Continue shopping
                </Link>
              </div>
            </aside>
          </div>
        )}
      </div>
    </div>
  );
}

function Row({ label, value, accent }) {
  return (
    <div className="flex justify-between">
      <span className="text-muted-foreground">{label}</span>
      <span className={`font-semibold ${accent ? "text-primary" : ""}`}>{value}</span>
    </div>
  );
}
