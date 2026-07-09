import Link from "next/link";
import { RotateCcw, Check, X } from "lucide-react";
import { PageHeader } from "@/components/store/PageHeader";

export default function ReturnsPage() {
  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Returns" }]}
        eyebrow="Easy returns"
        title="14-day returns, no fuss"
        subtitle="Changed your mind? Most items can be returned within 14 days of delivery."
      />

      <div className="mx-auto max-w-3xl space-y-8 px-4 py-12">
        <div className="rounded-3xl border border-border bg-card p-7">
          <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary">
            <RotateCcw className="h-6 w-6" />
          </div>

          <h2 className="mt-4 font-display text-xl font-bold">
            How to return an item
          </h2>

          <ol className="mt-4 space-y-3 text-sm">
            {[
              "Go to My Orders and pick the item.",
              "Choose 'Request return' and select a reason.",
              "Print the prepaid label or schedule a pickup.",
              "Refund issued within 5 business days of receipt.",
            ].map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary text-xs font-bold text-primary-foreground">
                  {index + 1}
                </span>
                {step}
              </li>
            ))}
          </ol>

          <Link
            href="/account/orders"
            className="mt-5 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground"
          >
            Start a return
          </Link>
        </div>

        <div className="grid gap-5 sm:grid-cols-2">
          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 font-display font-bold text-primary">
              <Check className="h-5 w-5" />
              Returnable
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-foreground/80">
              <li>• Unused items in original packaging</li>
              <li>• Fashion & accessories</li>
              <li>• Electronics (with seal intact)</li>
              <li>• Home & living items</li>
            </ul>
          </div>

          <div className="rounded-2xl border border-border bg-card p-6">
            <h3 className="flex items-center gap-2 font-display font-bold text-ember">
              <X className="h-5 w-5" />
              Not returnable
            </h3>

            <ul className="mt-3 space-y-2 text-sm text-foreground/80">
              <li>• Opened beauty & skincare</li>
              <li>• Perishable groceries</li>
              <li>• Custom or personalised items</li>
              <li>• Final-sale clearance</li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
}

