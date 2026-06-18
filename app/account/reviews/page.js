"use client"

import { Star } from "lucide-react";
import { MOCK_REVIEWS } from "@/lib/store-data";

export default function ReviewsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Your reviews</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Reviews you've left on past purchases.
        </p>
      </div>

      <div className="space-y-3">
        {MOCK_REVIEWS.map((r) => (
          <div
            key={r.id}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-center justify-between">
              <p className="font-semibold">{r.product}</p>
              <p className="text-xs text-muted-foreground">{r.date}</p>
            </div>

            <div className="mt-2 flex">
              {Array.from({ length: r.rating }).map((_, i) => (
                <Star
                  key={i}
                  className="h-4 w-4 fill-gold text-gold"
                />
              ))}
            </div>

            <p className="mt-3 text-sm text-foreground/85">{r.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}