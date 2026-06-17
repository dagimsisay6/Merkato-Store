"use client";

import { useState } from "react";
import { ChevronDown } from "lucide-react";

const FAQS = [
  { q: "How long does delivery take?", a: "48-hour delivery in major cities across our 7 countries. Remote areas take 3-7 business days." },
  { q: "What payment methods do you accept?", a: "Visa, Mastercard, Verve, M-Pesa, MTN MoMo, Airtel Money, Apple Pay, and cash on delivery in select regions." },
  { q: "Can I return an item?", a: "Yes — within 14 days of delivery, in original condition. Some categories like beauty have restrictions for hygiene reasons." },
  { q: "Are sellers verified?", a: "Every seller passes ID, business, and quality verification. Look for the green check on product pages." },
  { q: "How do I track my order?", a: "Sign in and visit My Orders, or use the tracking link in your confirmation email/SMS." },
  { q: "Do you ship internationally?", a: "We currently ship within Nigeria, Kenya, Ethiopia, UAE, Saudi Arabia, Egypt, and Ghana." },
  { q: "Is my payment secure?", a: "All transactions are PCI-DSS compliant and end-to-end encrypted. Card details never touch our servers." },
  { q: "How do I become a seller?", a: "Visit our 'Sell on Merkato' page (Contact Us) and our seller team will onboard you within 48 hours." },
];

export default function FAQAccordion() {
  const [open, setOpen] = useState(0);

  return (
    <div className="space-y-3">
      {FAQS.map((f, i) => (
        <div key={i} className="overflow-hidden rounded-2xl border border-border bg-card">
          <button
            onClick={() => setOpen(open === i ? null : i)}
            className="flex w-full items-center justify-between gap-4 p-5 text-left"
          >
            <span className="font-display font-semibold">{f.q}</span>
            <ChevronDown
              className={`h-5 w-5 shrink-0 text-muted-foreground transition ${
                open === i ? "rotate-180 text-primary" : ""
              }`}
            />
          </button>
          {open === i && (
            <p className="border-t border-border bg-secondary/30 p-5 text-sm leading-relaxed text-foreground/80">
              {f.a}
            </p>
          )}
        </div>
      ))}
    </div>
  );
}
