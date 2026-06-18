"use client";

import Link from "next/link";
import { Check } from "lucide-react";
import { usePathname } from "next/navigation";
import { fmt } from "@/lib/store-data";
import { useCart } from "@/lib/store-context";

const STEPS = [
  { path: "/checkout/shipping", label: "Shipping" },
  { path: "/checkout/payment", label: "Payment" },
  { path: "/checkout/review", label: "Review" },
];

export default function CheckoutLayout({ children }) {
  const pathname = usePathname();

  const currentIdx = STEPS.findIndex((s) => pathname.startsWith(s.path));

  const cart = useCart();

  const shipping = cart.subtotal > 50 ? 0 : 4.99;
  const tax = cart.subtotal * 0.05;
  const total = cart.subtotal + shipping + tax;

  return (
    <div>
      <section className="border-b border-border bg-gradient-to-br from-primary/5 via-background to-gold/10">
        <div className="mx-auto max-w-7xl px-4 py-8">
          <Link
            href="/cart"
            className="text-xs font-semibold text-muted-foreground hover:text-primary"
          >
            ← Back to cart
          </Link>

          <h1 className="mt-3 font-display text-3xl font-extrabold sm:text-4xl">
            Checkout
          </h1>

          <div className="mt-6 flex items-center gap-2 overflow-x-auto sm:gap-4">
            {STEPS.map((step, i) => {
              const active = i === currentIdx;
              const done = i < currentIdx;

              return (
                <div
                  key={step.path}
                  className="flex items-center gap-2 whitespace-nowrap"
                >
                  <div
                    className={`grid h-8 w-8 place-items-center rounded-full text-xs font-bold
${
  done
    ? "bg-primary text-primary-foreground"
    : active
      ? "bg-accent text-accent-foreground"
      : "bg-secondary text-muted-foreground"
}`}
                  >
                    {done ? <Check className="h-4 w-4" /> : i + 1}
                  </div>

                  <span
                    className={`text-sm font-semibold 
${active ? "text-foreground" : done ? "text-primary" : "text-muted-foreground"}
`}
                  >
                    {step.label}
                  </span>

                  {i < STEPS.length - 1 && (
                    <div
                      className={`h-px w-8 sm:w-16 
${done ? "bg-primary" : "bg-border"}
`}
                    />
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

              <div className="mt-4 space-y-3 max-h-64 overflow-y-auto">
                {cart.detailed.map(({ product, qty }) => (
                  <div
                    key={product.id}
                    className="flex items-center gap-3 text-sm"
                  >
                    <div className="relative h-12 w-12 shrink-0 overflow-hidden rounded-lg bg-muted">
                      <img
                        src={product.img}
                        className="h-full w-full object-cover"
                      />

                      <span className="absolute -right-1 -top-1 grid h-5 w-5 place-items-center rounded-full bg-primary text-[10px] font-bold text-primary-foreground">
                        {qty}
                      </span>
                    </div>

                    <p className="line-clamp-1 flex-1 font-medium">
                      {product.name}
                    </p>

                    <p className="font-bold">{fmt(product.price * qty)}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 space-y-2 border-t border-border pt-4 text-sm">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span>{fmt(cart.subtotal)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Shipping</span>
                  <span>{fmt(shipping)}</span>
                </div>

                <div className="flex justify-between">
                  <span>Tax</span>
                  <span>{fmt(tax)}</span>
                </div>
              </div>

              <div className="mt-4 flex justify-between border-t pt-4">
                <p className="font-bold">Total</p>

                <p className="text-2xl font-extrabold text-accent">
                  {fmt(total)}
                </p>
              </div>
            </div>
          </aside>
        </div>
      </div>
    </div>
  );
}
