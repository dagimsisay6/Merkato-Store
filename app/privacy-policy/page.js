import { PageHeader } from "@/components/store/PageHeader";

export const metadata = {
  title: "Privacy Policy — Merkato Store",
};

export default function PrivacyPage() {
  const sections = [
    [
      "1. Information we collect",
      "Account details (name, email, phone), order history, delivery addresses, device info, and analytics on how you use our site.",
    ],
    [
      "2. How we use your data",
      "To process orders, deliver products, prevent fraud, personalize recommendations, send service emails, and improve the platform.",
    ],
    [
      "3. Sharing",
      "We share data only with sellers (fulfilment), payment processors, and delivery partners — never sold to advertisers.",
    ],
    [
      "4. Your rights",
      "Access, correct, export, or delete your data at any time from Account → Settings, or by emailing privacy@merkatostore.com.",
    ],
    [
      "5. Cookies",
      "We use essential cookies for cart, login, and security. Optional analytics cookies can be disabled in Settings.",
    ],
    [
      "6. Security",
      "PCI-DSS payment processing, encrypted at rest and in transit, with continuous monitoring.",
    ],
    [
      "7. Contact",
      "Data Protection Officer: privacy@merkatostore.com — we respond within 30 days.",
    ],
  ];

  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Privacy Policy" }]}
        eyebrow="Legal"
        title="Privacy Policy"
        subtitle="Last updated: June 2026"
      />

      <article className="prose prose-sm mx-auto max-w-3xl px-4 py-12 text-foreground/85">
        {sections.map(([title, description]) => (
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
