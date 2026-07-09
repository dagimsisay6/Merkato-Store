"use client";

import { Send } from "lucide-react";

export function Newsletter() {
  return (
    <section className="mx-auto max-w-3xl px-4 py-16 text-center lg:py-24">
      <span className="text-xs font-semibold uppercase tracking-[0.25em] text-primary">Stay in the loop</span>
      <h2 className="mt-3 font-display text-4xl font-extrabold leading-tight text-foreground sm:text-5xl">
        Get deals before anyone else.
      </h2>
      <p className="mt-3 text-muted-foreground">Join 200,000+ shoppers receiving curated drops and exclusive offers.</p>
      <form
        className="mx-auto mt-7 flex max-w-lg flex-col gap-3 sm:flex-row"
        onSubmit={(e) => e.preventDefault()}
      >
        <input
          type="email"
          required
          placeholder="you@email.com"
          className="h-12 flex-1 rounded-full border border-border bg-card px-5 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
        />
        <button className="inline-flex h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow">
          Subscribe <Send className="h-4 w-4" />
        </button>
      </form>
      <p className="mt-3 text-xs text-muted-foreground">We respect your inbox. Unsubscribe anytime.</p>
    </section>
  );
}

