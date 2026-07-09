import Link from "next/link";
import { BRANDS } from "@/lib/store-data";

export function Brands() {
  return (
    <section className="border-y border-border bg-card/40">
      <div className="mx-auto max-w-7xl px-4 py-12">
        <p className="text-center text-xs font-semibold uppercase tracking-[0.25em] text-muted-foreground">
          Loved by world-class brands
        </p>
        <div className="no-scrollbar mt-8 flex items-center justify-start gap-12 overflow-x-auto md:justify-center">
          {BRANDS.map((b) => (
            <Link
              key={b.slug}
              href="/brands"
              className="whitespace-nowrap font-display text-xl font-bold tracking-tight text-muted-foreground/60 grayscale transition hover:text-foreground hover:grayscale-0 sm:text-2xl"
            >
              {b.name.toUpperCase()}
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}

