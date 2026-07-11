"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import { Check, ShoppingBag } from "lucide-react";
import { fmt } from "@/lib/store-data";
import { getSession } from "@/lib/checkout-session";
import { useAuth } from "@/lib/store-context";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const STEPS = [
  { path: "/checkout/shipping", label: "Shipping" },
  { path: "/checkout/payment", label: "Payment" },
  { path: "/checkout/review", label: "Review" },
];

export default function CheckoutLayout({ children }) {
  const pathname = usePathname();
  const router = useRouter();
  const { isLoggedIn, mounted } = useAuth();
  const currentIdx = STEPS.findIndex((s) => pathname.startsWith(s.path));

  const [products, setProducts] = useState([]);
  const [sessionItems, setSessionItems] = useState([]);

  useEffect(() => {
    if (!mounted) return;
    if (!isLoggedIn) {
      router.replace(`/signin?redirect=${encodeURIComponent(pathname)}`);
      return;
    }
    const session = getSession();
    if (!session?.items?.length) {
      router.replace("/cart");
      return;
    }
    setSessionItems(session.items);
    const ids = session.items.map((i) => i.id).join(",");
    fetch(`${BASE}/products/by-ids?ids=${ids}`)
      .then((r) => r.ok ? r.json() : null)
      .catch(() => null)
      .then((data) => setProducts(data?.products ?? []));
  }, [mounted, isLoggedIn]);

  const detailed = sessionItems
    .map((si) => {
      const product = products.find((p) => p.id === si.id);
      return product ? { product, qty: si.qty } : null;
    })
    .filter(Boolean);

  const subtotal = detailed.reduce((s, d) => s + Number(d.product.price) * d.qty, 0);
  const shipping = subtotal > 50 ? 0 : subtotal > 0 ? 4.99 : 0;
  const tax = subtotal * 0.05;
  const total = subtotal + shipping + tax;

  if (!mounted || !isLoggedIn) return null;

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-gold/10">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link href="/cart" className="text-xs font-semibold text-muted-foreground hover:text-primary">
            ← Back to cart
          </Link>
          <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">Checkout</h1>
          <div className="mt-6 flex items-center gap-2 overflow-x-auto sm:gap-4">
            {STEPS.map((step, i) => {
              const active = i === currentIdx;
              const done = i < currentIdx;
              return (
                <div key={step.path} className="flex items-center gap-2 whitespace-nowrap">
                  <div className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold ${
                    done ? "bg-primary text-primary-foreground"
                    : active ? "bg-accent text-accent-foreground"
                    : "bg-secondary text-muted-foreground"
                  }`}>
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </div>
                  <span className={`text-sm font-semibold ${
                    active ? "text-foreground" : done ? "text-primary" : "text-muted-foreground"
                  }`}>
                    {step.label}
                  </span>
                  {i < STEPS.length - 1 && (
                    <div className={`h-px w-8 sm:w-16 ${done ? "bg-primary" : "bg-border"}`} />
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[1fr_380px]">
          <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
            {children}
          </div>

          <aside>
            <div className="sticky top-32 rounded-2xl border border-border bg-card p-6">
              <h3 className="font-display text-lg font-bold">Order summary</h3>

              {detailed.length === 0 ? (
                <div className="mt-4 space-y-2">
                  {[...Array(sessionItems.length || 2)].map((_, i) => (
                    <div key={i} className="h-14 animate-pulse rounded-xl bg-muted" />
                  ))}
                </div>
              ) : (
                <div className="mt-4 max-h-64 space-y-3 overflow-y-auto">
                  {detailed.map(({ product, qty }) => (
                    <div key={product.id} className="flex items-center gap-3 text-sm">
                      <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                        <img
                          src={product.images?.[0] || null}
                          alt={product.name}
                          className="h-full w-full object-cover"
                        />
                        <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                          {qty}
                        </span>
                      </div>
                      <p className="line-clamp-1 flex-1 font-medium">{product.name}</p>
                      <p className="font-bold">{fmt(Number(product.price) * qty)}</p>
                    </div>
                  ))}
                </div>
              )}

              <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Subtotal</span>
                  <span className="font-semibold">{fmt(subtotal)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">{shipping === 0 ? "Shipping (free)" : "Shipping"}</span>
                  <span className="font-semibold">{fmt(shipping)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Tax (5%)</span>
                  <span className="font-semibold">{fmt(tax)}</span>
                </div>
              </div>

              <div className="mt-4 flex items-baseline justify-between border-t border-border pt-4">
                <p className="font-display text-lg font-bold">Total</p>
                <p className="font-display text-2xl font-extrabold text-accent">{fmt(total)}</p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
