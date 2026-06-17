import { PageHeader } from "@/components/store/PageHeader";
import ContactForm from "./ContactForm";

export const metadata = {
  title: "Contact Us — Merkato Store",
  description: "Get in touch with our team for support, partnerships, or feedback.",
};

export default function ContactPage() {
  return (
    <div>
      <PageHeader
        crumbs={[
          { label: "Home", to: "/" },
          { label: "Contact" },
        ]}
        eyebrow="Get in touch"
        title="We'd love to hear from you"
        subtitle="Questions, partnerships, press — our team replies within 24 hours."
      />

      <div className="mx-auto max-w-6xl px-4 py-12">
        <ContactForm />
      </div>
    </div>
  );
}
