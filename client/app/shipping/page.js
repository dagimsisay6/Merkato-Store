import { Truck, Globe2, Clock, ShieldCheck } from "lucide-react";
import { PageHeader } from "@/components/store/PageHeader";

export const metadata = { title: "Shipping Information — Merkato Store" };

const CARDS = [
  { icon: Truck, t: "Free over $50", d: "Standard shipping on qualifying orders." },
  { icon: Clock, t: "48-hour cities", d: "Express in major metros." },
  { icon: Globe2, t: "7 countries", d: "Nigeria, Kenya, Ethiopia, UAE, KSA, Egypt, Ghana." },
  { icon: ShieldCheck, t: "Fully tracked", d: "Real-time updates via SMS & app." },
];

const ROWS = [
  ["Nigeria — Lagos / Abuja", "2-3 days · $4.99", "24h · $9.99", "$50"],
  ["Kenya — Nairobi / Mombasa", "2-3 days · $5.49", "24h · $11.99", "$50"],
  ["UAE — Dubai / Abu Dhabi", "1-2 days · $3.99", "Same-day · $7.99", "$40"],
  ["Saudi Arabia", "2-4 days · $6.99", "48h · $13.99", "$60"],
  ["Egypt — Cairo / Alex", "3-5 days · $5.99", "48h · $12.99", "$50"],
  ["Other regions", "5-10 days · $9.99", "—", "$80"],
];

export default function ShippingPage() {
  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "Shipping" }]}
        eyebrow="Delivery"
        title="Shipping Information"
        subtitle="Fast, tracked delivery across Africa & the Middle East."
      />
      <div className="mx-auto max-w-5xl px-4 py-12 space-y-10">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {CARDS.map(({ icon: Icon, t, d }) => (
            <div key={t} className="rounded-2xl border border-border bg-card p-5">
              <div className="grid h-11 w-11 place-items-center rounded-xl bg-primary/10 text-primary">
                <Icon className="h-5 w-5" />
              </div>
              <p className="mt-3 font-display font-bold">{t}</p>
              <p className="mt-1 text-xs text-muted-foreground">{d}</p>
            </div>
          ))}
        </div>

        <div className="overflow-hidden rounded-3xl border border-border bg-card">
          <table className="w-full text-sm">
            <thead className="bg-secondary/50 text-left text-xs font-bold uppercase tracking-widest text-muted-foreground">
              <tr>
                {["Region", "Standard", "Express", "Free over"].map((h) => (
                  <th key={h} className="p-4">{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={i} className="border-t border-border">
                  {r.map((c, j) => <td key={j} className="p-4">{c}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
