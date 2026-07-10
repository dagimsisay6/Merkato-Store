"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useAuth } from "@/lib/store-context";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function ReviewsPage() {
  const { token } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token) return;
    fetch(`${BASE}/users/reviews`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => setReviews(d.reviews ?? []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [token]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Your reviews</h2>
        <p className="mt-1 text-sm text-muted-foreground">Reviews you've left on past purchases.</p>
      </div>

      {loading ? (
        <p className="py-12 text-center text-muted-foreground">Loading…</p>
      ) : reviews.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center">
          <p className="font-display text-xl font-bold">No reviews yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Purchase a product and leave your first review.</p>
          <Link href="/products" className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
            Browse products
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {reviews.map((r) => (
            <div key={r.id} className="rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center justify-between">
                <Link href={`/products/${r.product_slug}`} className="font-semibold hover:text-primary">
                  {r.product_name}
                </Link>
                <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleDateString()}</p>
              </div>
              <div className="mt-2 flex">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star key={i} className={`h-4 w-4 ${i < r.rating ? "fill-gold text-gold" : "text-muted-foreground/30"}`} />
                ))}
              </div>
              <p className="mt-3 text-sm text-foreground/85">{r.text}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
