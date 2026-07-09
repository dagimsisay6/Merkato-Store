import { Star } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const TESTIMONIALS = [
  {
    name: "Amara O.",
    country: "🇳🇬 Lagos",
    quote: "Fastest delivery I've had — and the packaging felt premium. This is my new go-to.",
    rating: 5,
  },
  {
    name: "Layla H.",
    country: "🇦🇪 Dubai",
    quote: "Finally a marketplace that understands the region. Prices and selection are unmatched.",
    rating: 5,
  },
  {
    name: "Kofi M.",
    country: "🇰🇪 Nairobi",
    quote: "Bought a phone during flash sale, saved 30%, arrived in 48 hours. Trust earned.",
    rating: 5,
  },
];

export function Testimonials() {
  return (
    <section className="relative overflow-hidden">
      <div className="absolute inset-0 -z-10 bg-linear-to-br from-primary/8 via-background to-gold/10" />
      <div className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
        <SectionHeader eyebrow="Real stories" title="Loved across the region" />
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {TESTIMONIALS.map((t) => (
            <div key={t.name} className="glass rounded-3xl p-7 shadow-(--shadow-soft)">
              <div className="flex items-center gap-1">
                {Array.from({ length: t.rating }).map((_, i) => (
                  <Star key={i} className="h-4 w-4 fill-gold text-gold" />
                ))}
              </div>
              <p className="mt-4 text-base leading-relaxed text-foreground">&ldquo;{t.quote}&rdquo;</p>
              <div className="mt-6 flex items-center gap-3">
                <div className="grid h-11 w-11 place-items-center rounded-full gradient-primary font-display text-sm font-bold text-primary-foreground">
                  {t.name[0]}
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">{t.name}</p>
                  <p className="text-xs text-muted-foreground">{t.country}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
