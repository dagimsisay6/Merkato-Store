"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Check } from "lucide-react";

export default function ForgotPasswordForm() {
  const [sent, setSent] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent(true);
  };

  return (
    <>
      <Link
        href="/signin"
        className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Link>

      <h1 className="mt-6 font-display text-3xl font-extrabold sm:text-4xl">
        Forgot Your Password?
      </h1>

      <p className="mt-2 text-muted-foreground">
        Enter your email address and we&apos;ll send you a password reset link.
      </p>

      {sent ? (
        <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="h-6 w-6" />
          </div>

          <h2 className="mt-4 text-xl font-bold">
            Check Your Inbox
          </h2>

          <p className="mt-2 text-sm text-muted-foreground">
            We have sent a password reset link to your email address.
          </p>

          <Link
            href="/reset-password"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow"
          >
            Continue
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="mt-8 space-y-5">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Email Address
            </label>

            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <input
                type="email"
                required
                placeholder="you@example.com"
                className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none transition focus:border-primary"
              />
            </div>
          </div>

          <button
            type="submit"
            className="h-12 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow"
          >
            Send Reset Link
          </button>
        </form>
      )}
    </>
  );
}

