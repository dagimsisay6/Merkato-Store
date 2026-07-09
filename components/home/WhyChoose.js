import { ShieldCheck, Truck, Star, Headphones, RotateCcw, Sparkles } from "lucide-react";
import { SectionHeader } from "./SectionHeader";

const ITEMS = [
  { icon: ShieldCheck, t: "Secure Payments", d: "Cards, mobile money, and cash on delivery — all protected." },
  { icon: Truck, t: "Fast Delivery", d: "48-hour delivery in major cities across 7 countries." },
  { icon: Star, t: "Trusted Sellers", d: "Every seller is verified, rated, and reviewed by you." },
  { icon: Headphones, t: "24/7 Support", d: "Real humans, ready in English and Arabic, around the clock." },
  { icon: RotateCcw, t: "Easy Returns", d: "Changed your mind? Return within 14 days, no questions asked." },
  { icon: Sparkles, t: "Member Rewards", d: "Earn points on every order. Redeem for discounts and gifts." },
];

export function WhyChoose() {
  return (
    <section className="mx-auto max-w-7xl px-4 py-16 lg:py-24">
      <SectionHeader eyebrow="The Merkato promise" title="Why shoppers choose us" />
      <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {ITEMS.map(({ icon: Icon, t, d }) => (
          <div
            key={t}
            className="group relative overflow-hidden rounded-3xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:shadow-(--shadow-elegant)"
          >
            <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
              <Icon className="h-6 w-6" />
            </div>
            <h3 className="mt-5 font-display text-lg font-bold text-foreground">{t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{d}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
