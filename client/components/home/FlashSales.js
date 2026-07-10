import Link from "next/link";
import { Flame, ArrowRight } from "lucide-react";
import { ProductCard } from "@/components/store/ProductCard";
import { Countdown } from "@/components/store/Countdown";

export function FlashSales({ products = [] }) {
  return (
    <section className="relative overflow-hidden bg-linear-to-br from-gold/95 via-gold to-accent/90">
      <div className="absolute inset-0 kente-pattern opacity-40" />
      <div className="relative mx-auto max-w-7xl px-4 py-14">
        <div className="flex flex-wrap items-end justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 rounded-full bg-ink/90 px-3 py-1.5 text-[11px] font-bold uppercase tracking-widest text-primary-foreground">
              <Flame className="h-3.5 w-3.5 text-accent" /> Flash Sale · Live
            </div>
            <h2 className="mt-4 font-display text-4xl font-extrabold text-gold-foreground sm:text-5xl">
              Deals end in
            </h2>
          </div>
          <Countdown />
        </div>
        <div className="no-scrollbar mt-10 flex gap-4 overflow-x-auto pb-2 lg:grid lg:grid-cols-4 lg:overflow-visible">
          {products.map((p) => (
            <div key={p.id} className="w-64 shrink-0 lg:w-auto">
              <ProductCard p={p} />
            </div>
          ))}
        </div>
        <div className="mt-8 flex justify-end">
          <Link
            href="/deals"
            className="group inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary"
          >
            View all deals{" "}
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" />
          </Link>
        </div>
      </div>
    </section>
  );
}
