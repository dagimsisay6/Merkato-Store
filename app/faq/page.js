import { PageHeader } from "@/components/store/PageHeader";
import FAQAccordion from "./FAQAccordion";

export const metadata = {
  title: "FAQ — Merkato Store",
  description: "Frequently asked questions about shopping, payments, delivery, and seller verification.",
};

export default function FAQPage() {
  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Home", to: "/" }, { label: "FAQ" }]}
        eyebrow="Quick answers"
        title="Frequently Asked Questions"
        subtitle="The most common things shoppers ask. Can't find what you need? Contact our team."
      />
      <div className="mx-auto max-w-3xl px-4 py-12">
        <FAQAccordion />
      </div>
    </div>
  );
}
