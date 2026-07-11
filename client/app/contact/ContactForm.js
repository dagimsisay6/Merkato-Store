"use client";

import { useState } from "react";
import {
  Mail,
  Phone,
  MapPin,
  Send,
  User,
  LogIn,
  CheckCircle,
} from "lucide-react";
import Link from "next/link";
import { useAuth } from "@/lib/store-context";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function ContactForm() {
  const { user, isLoggedIn, mounted } = useAuth();
  const [form, setForm] = useState({ name: "", email: "", phone: "", subject: "", message: "" });
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState("");

  // Pre-fill from account once mounted
  const [prefilled, setPrefilled] = useState(false);
  if (mounted && isLoggedIn && user && !prefilled) {
    setPrefilled(true);
    setForm((p) => ({ ...p, name: user.name ?? "", email: user.email ?? "", phone: user.phone ?? "" }));
  }

  function set(k, v) {
    setForm((p) => ({ ...p, [k]: v }));
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      const res = await fetch(`${BASE}/contact`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          phone: form.phone || undefined,
          subject: form.subject,
          message: form.message,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to send");
      setSent(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }

  if (sent) {
    return (
      <div className="mx-auto max-w-lg py-16 text-center">
        <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary">
          <CheckCircle className="h-10 w-10" />
        </div>
        <h3 className="mt-6 font-display text-2xl font-bold text-foreground">
          Message Sent!
        </h3>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground">
          Thank you for contacting Merkato Store. We have received your message
          and our support team will respond as soon as possible.
        </p>
        <p className="mt-2 text-xs text-muted-foreground">
          A confirmation email has been sent to <strong>{form.email}</strong>
        </p>
        <button
          onClick={() => {
            setSent(false);
            setForm({ name: user?.name ?? "", email: user?.email ?? "", phone: user?.phone ?? "", subject: "", message: "" });
          }}
          className="mt-6 text-sm font-semibold text-primary hover:underline"
        >
          Send another message
        </button>
      </div>
    );
  }

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.4fr]">
      {/* Left — contact info + user info */}
      <div className="space-y-5">
        {[
          { icon: Mail, t: "Email", d: "dagimsisay6776@gmail.com" },
          { icon: Phone, t: "WhatsApp", d: "+251-932-43-00-72" },
          { icon: MapPin, t: "HQ", d: "Lagos · Dubai · Nairobi" },
        ].map((b) => (
          <div
            key={b.t}
            className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
          >
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <b.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {b.t}
              </p>
              <p className="mt-1 text-sm font-semibold">{b.d}</p>
            </div>
          </div>
        ))}

        {/* Auth status panel */}
        {mounted && isLoggedIn ? (
          <div className="rounded-2xl border border-primary/20 bg-primary/5 p-5">
            <div className="flex items-center gap-3 mb-3">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-primary/10 text-primary">
                <User className="h-4 w-4" />
              </div>
              <div>
                <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                  Sending as
                </p>
                <p className="text-sm font-semibold text-foreground">
                  {user.name}
                </p>
              </div>
            </div>
            <div className="space-y-1.5 text-xs text-muted-foreground">
              <p className="flex items-center gap-2">
                <Mail className="h-3.5 w-3.5" /> {user.email}
              </p>
              {user.phone && (
                <p className="flex items-center gap-2">
                  <Phone className="h-3.5 w-3.5" /> {user.phone}
                </p>
              )}
            </div>
            <p className="mt-3 text-xs text-primary/70">
              Your contact details are pre-filled from your account.
            </p>
          </div>
        ) : mounted ? (
          <div className="rounded-2xl border border-border bg-card p-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="grid h-9 w-9 place-items-center rounded-full bg-secondary text-muted-foreground">
                <LogIn className="h-4 w-4" />
              </div>
              <p className="text-sm font-semibold text-foreground">
                Sign in to auto-fill
              </p>
            </div>
            <p className="text-xs text-muted-foreground leading-relaxed">
              Already have an account?{" "}
              <Link
                href="/signin?redirect=/contact"
                className="font-semibold text-primary hover:underline"
              >
                Sign in
              </Link>{" "}
              to automatically fill your name, email, and phone.
            </p>
          </div>
        ) : null}
      </div>

      {/* Right — form */}
      <form
        onSubmit={handleSubmit}
        className="space-y-4 rounded-3xl border border-border bg-card p-7"
      >
        <h2 className="font-display text-xl font-bold text-foreground">
          Send us a message
        </h2>

        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Full Name" value={form.name} onChange={(v) => set("name", v)} required />
          <Field label="Email Address" type="email" value={form.email} onChange={(v) => set("email", v)} required />
        </div>

        <Field label="Phone Number (optional)" type="tel" value={form.phone} onChange={(v) => set("phone", v)} />

        <Field
          label="Subject"
          value={form.subject}
          onChange={(v) => set("subject", v)}
          required
        />

        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Message <span className="text-ember">*</span>
          </label>
          <textarea
            required
            value={form.message}
            onChange={(e) => set("message", e.target.value)}
            rows={5}
            placeholder="Describe your issue or question in detail…"
            className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-primary resize-none"
          />
        </div>

        {error && (
          <p className="rounded-xl bg-ember/10 px-4 py-2.5 text-sm font-medium text-ember">
            {error}
          </p>
        )}

        <button
          type="submit"
          disabled={loading}
          className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-glow disabled:opacity-60 transition"
        >
          {loading ? "Sending…" : "Send Message"}
          <Send className="h-4 w-4" />
        </button>
      </form>
    </div>
  );
}

function Field({ label, value, onChange, type = "text", required = false }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label} {required && <span className="text-ember">*</span>}
      </label>
      <input
        required={required}
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary transition"
      />
    </div>
  );
}
