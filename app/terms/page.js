import { PageHeader } from "@/components/store/PageHeader";

export const metadata = {
  title: "Terms of Service — Merkato Store",
};

export default function TermsPage() {
  const terms = [
    [
      "1. Acceptance of terms",
      "By using Merkato Store, you agree to these terms and our Privacy Policy.",
    ],
    [
      "2. Account responsibilities",
      "Keep your password confidential. You are responsible for activity under your account.",
    ],
    [
      "3. Orders & pricing",
      "We reserve the right to refuse or cancel orders containing pricing or stock errors. You'll be notified and fully refunded.",
    ],
    [
      "4. Returns & refunds",
      "Standard 14-day return policy applies; see /returns for details and exclusions.",
    ],
    [
      "5. User content",
      "Reviews and uploads must be truthful, lawful, and not infringe rights. We may remove content that violates our community standards.",
    ],
    [
      "6. Limitation of liability",
      "Merkato Store is not liable for indirect or consequential losses beyond the purchase price of the product.",
    ],
    [
      "7. Governing law",
      "These terms are governed by the laws of the seller's jurisdiction. Disputes resolved through binding arbitration.",
    ],
    [
      "8. Changes",
      "We may update these terms. Material changes will be notified by email at least 14 days in advance.",
    ],
  ];

  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Terms" }]}
        eyebrow="Legal"
        title="Terms of Service"
        subtitle="Last updated: June 2026"
      />

      <article className="mx-auto max-w-3xl px-4 py-12 text-foreground/85">
        {terms.map(([title, description]) => (
          <section key={title} className="mb-8">
            <h2 className="font-display text-xl font-bold text-foreground">
              {title}
            </h2>

            <p className="mt-2 leading-relaxed">{description}</p>
          </section>
        ))}
      </article>
    </div>
  );
}
