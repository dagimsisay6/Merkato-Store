import Link from "next/link";
import { Heart, Globe, Users, Sparkles } from "lucide-react";
import { PageHeader } from "@/components/store/PageHeader";

export const metadata = {
  title: "About — Merkato Store",
  description: "Merkato Store: the premium marketplace built for Africa and the Middle East.",
};

const stats = [
  { n: "2M+", l: "Active shoppers" },
  { n: "10K+", l: "Verified sellers" },
  { n: "7", l: "Countries served" },
];

const values = [
  { icon: Heart, t: "Our mission", d: "Make great products accessible to everyone in the region." },
  { icon: Globe, t: "Our reach", d: "7 countries, 6 currencies, 2 languages, one beautiful storefront." },
  { icon: Users, t: "Our community", d: "Shoppers, makers, riders and sellers — all part of the family." },
  { icon: Sparkles, t: "Our standard", d: "Every seller verified. Every order protected. Every promise kept." },
];

export default function AboutPage() {
  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "About" }]}
        eyebrow="Our story"
        title="A marketplace built for the region we love"
        subtitle="Founded in Lagos and Dubai, Merkato Store connects 2 million shoppers with 10,000 trusted sellers across seven countries."
      />

      <div className="mx-auto max-w-4xl px-4 py-12 space-y-12">
        <p className="text-lg leading-relaxed text-foreground/85">
          Online shopping in Africa and the Middle East deserves world-class experience. We built Merkato Store to bridge the gap between ambitious sellers and modern shoppers — with fast delivery, secure payments including mobile money, and a design language that celebrates the colour and craftsmanship of our region.
        </p>

        <div className="grid gap-5 sm:grid-cols-2">
          {values.map((item) => (
            <div key={item.t} className="rounded-3xl border border-border bg-card p-6">
              <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
                <item.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-4 font-display text-lg font-bold">{item.t}</h3>
              <p className="mt-1 text-sm text-muted-foreground">{item.d}</p>
            </div>
          ))}
        </div>

        <div className="grid gap-6 rounded-3xl gradient-primary p-10 text-primary-foreground sm:grid-cols-3">
          {stats.map((s) => (
            <div key={s.l}>
              <p className="font-display text-4xl font-extrabold">{s.n}</p>
              <p className="mt-1 text-sm text-primary-foreground/80">{s.l}</p>
            </div>
          ))}
        </div>

        <div className="text-center">
          <h2 className="font-display text-3xl font-bold">Want to sell on Merkato?</h2>
          <p className="mt-2 text-muted-foreground">Reach millions of shoppers across Africa & the Middle East.</p>
          <Link href="/contact" className="mt-5 inline-block rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground">
            Talk to our team
          </Link>
        </div>
      </div>
    </div>
  );
}
