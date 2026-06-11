"use client";

import { useEffect, useState } from "react";
import { Flame } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { PRODUCTS } from "@/lib/store-data";

export default function DealsPage() {
  const deals = PRODUCTS.filter((p) => p.original && p.original > p.price);

  return (
    <div>
      <section className="relative overflow-hidden bg-linear-to-br from-gold via-gold to-accent">
        <div className="absolute inset-0 kente-pattern opacity-30" />
        <div className="relative mx-auto max-w-7xl px-4 py-14 text-gold-foreground">
          <span className="inline-flex items-center gap-2 rounded-full bg-ink/80 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
            <Flame className="h-3.5 w-3.5 text-accent" /> Limited time
          </span>
          <h1 className="mt-4 font-display text-4xl font-extrabold sm:text-5xl lg:text-6xl">
            Flash Deals
          </h1>
          <p className="mt-3 max-w-xl text-base">
            Up to 50% off across every category. When they&apos;re gone, they&apos;re gone.
          </p>
          <Countdown />
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid grid-cols-2 gap-4 md:grid-cols-3 xl:grid-cols-4">
          {deals.map((p) => (
            <ProductCard key={p.id} p={p} ribbon="Hot Deal" />
          ))}
        </div>
      </div>
    </div>
  );
}

function Countdown() {
  const [target] = useState(() => Date.now() + 1000 * 60 * 60 * 8 + 1000 * 60 * 23);
  const [now, setNow] = useState(null);

  useEffect(() => {
    setNow(Date.now());
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, []);

  function Cell({ n, label }) {
    return (
      <div className="flex flex-col items-center">
        <div className="grid h-14 w-14 place-items-center rounded-xl bg-ink font-display text-2xl font-bold tabular-nums text-primary-foreground">
          {n}
        </div>
        <span className="mt-1 text-[10px] font-semibold uppercase tracking-wider">{label}</span>
      </div>
    );
  }

  if (now === null) {
    return (
      <div className="mt-6 flex items-center gap-2">
        <Cell n="--" label="Hrs" />
        <span className="text-2xl font-bold">:</span>
        <Cell n="--" label="Min" />
        <span className="text-2xl font-bold">:</span>
        <Cell n="--" label="Sec" />
      </div>
    );
  }

  const d = Math.max(0, target - now);
  const h = Math.floor(d / 3600000);
  const m = Math.floor((d % 3600000) / 60000);
  const s = Math.floor((d % 60000) / 1000);

  return (
    <div className="mt-6 flex items-center gap-2">
      <Cell n={String(h).padStart(2, "0")} label="Hrs" />
      <span className="text-2xl font-bold">:</span>
      <Cell n={String(m).padStart(2, "0")} label="Min" />
      <span className="text-2xl font-bold">:</span>
      <Cell n={String(s).padStart(2, "0")} label="Sec" />
    </div>
  );
}
