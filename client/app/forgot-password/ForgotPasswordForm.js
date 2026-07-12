"use client";

import { useState } from "react";
import Link from "next/link";
import { Mail, ArrowLeft, Check, AlertCircle, Loader2 } from "lucide-react";
import { forgotPassword } from "@/lib/api";

export default function ForgotPasswordForm() {
  const [email, setEmail] = useState("");
  const [emailError, setEmailError] = useState("");
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [serverError, setServerError] = useState("");

  const validate = () => {
    if (!email.trim()) { setEmailError("Email address is required."); return false; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) { setEmailError("Please enter a valid email address."); return false; }
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    if (!validate()) return;
    setLoading(true);
    try {
      await forgotPassword(email.trim().toLowerCase());
      setSent(true);
    } catch {
      setServerError("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <Link href="/signin" className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors">
        <ArrowLeft className="h-4 w-4" />
        Back to Sign In
      </Link>

      <h1 className="mt-6 font-display text-3xl font-extrabold sm:text-4xl">Forgot Your Password?</h1>
      <p className="mt-2 text-muted-foreground">Enter your email and we&apos;ll send you a reset link.</p>

      {sent ? (
        <div className="mt-8 rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
          <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
            <Check className="h-6 w-6" />
          </div>
          <h2 className="mt-4 text-xl font-bold">Check Your Inbox</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            If an account with that email exists, we&apos;ve sent a password reset link.
          </p>
          <p className="mt-1 text-xs text-muted-foreground">The link expires in 15 minutes.</p>
          <Link
            href="/signin"
            className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow"
          >
            Back to Sign In
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
          {serverError && (
            <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-950/30">
              {serverError}
            </p>
          )}
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Email Address
            </label>
            <div className="relative mt-2">
              <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setEmailError(""); setServerError(""); }}
                placeholder="you@example.com"
                autoComplete="email"
                className={`h-12 w-full rounded-full border bg-card pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${emailError ? "border-red-400" : "border-border"}`}
              />
            </div>
            {emailError && (
              <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
                <AlertCircle className="h-3.5 w-3.5 shrink-0" />{emailError}
              </p>
            )}
          </div>
          <button
            type="submit"
            disabled={loading}
            className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow disabled:opacity-60"
          >
            {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending…</> : "Send Reset Link"}
          </button>
        </form>
      )}
    </>
  );
}
