"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";

export default function FailedPage() {
  return (
    <div className="mx-auto max-w-2xl px-4 py-16 text-center">
      <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-ember/10 text-ember">
        <XCircle className="h-12 w-12" />
      </div>

      <h1 className="mt-6 font-display text-4xl font-extrabold">
        Something went wrong
      </h1>

      <p className="mt-3 text-muted-foreground">
        Your payment could not be processed. Don't worry — you haven't been
        charged. Please try again or use a different method.
      </p>

      <div className="mt-8 flex flex-wrap justify-center gap-3">
        <Link
          href="/checkout/payment"
          className="rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground"
        >
          Try again
        </Link>

        <Link
          href="/contact"
          className="rounded-full border border-border px-6 py-3 text-sm font-semibold"
        >
          Contact support
        </Link>
      </div>
    </div>
  );
}
