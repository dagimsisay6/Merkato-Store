"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { CheckCircle2, Truck } from "lucide-react";

export default function SuccessPage() {
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    setOrderId("MK-" + Math.floor(10000 + Math.random() * 90000));
  }, []);

  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary">
        <CheckCircle2 className="h-12 w-12" />
      </div>

      <h1 className="mt-6 font-display text-4xl font-extrabold">
        Thank you for your order!
      </h1>

      <p className="mt-3 text-muted-foreground">
        A confirmation has been sent to your email & phone.
      </p>

      <div className="mt-8 rounded-3xl border border-border bg-card p-6 text-left">
        <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
          Order number
        </p>

        <p className="mt-1 font-display text-2xl font-bold">
          {orderId || "Generating..."}
        </p>

        <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-primary/10 px-3 py-1.5 text-xs font-semibold text-primary">
          <Truck className="h-3.5 w-3.5" />
          Expected delivery: 24-48 hours
        </div>
      </div>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href={`/account/orders/${orderId}`}
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Track order
        </Link>

        <Link
          href="/products"
          className="rounded-full border border-border px-6 py-3 text-sm font-semibold"
        >
          Continue shopping
        </Link>
      </div>
    </div>
  );
}
