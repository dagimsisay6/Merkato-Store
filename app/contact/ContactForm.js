"use client";

import { useState } from "react";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactForm() {
  const [sent, setSent] = useState(false);

  return (
    <div className="grid gap-10 lg:grid-cols-[1fr_1.2fr]">
      <div className="space-y-6">
        {[
          { icon: Mail, t: "Email", d: "hello@merkatostore.com" },
          { icon: Phone, t: "WhatsApp", d: "+234 800 MERKATO" },
          { icon: MapPin, t: "HQ", d: "Lagos · Dubai · Nairobi" },
        ].map((b) => (
          <div key={b.t} className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5">
            <div className="grid h-12 w-12 place-items-center rounded-xl bg-primary/10 text-primary">
              <b.icon className="h-5 w-5" />
            </div>
            <div>
              <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{b.t}</p>
              <p className="mt-1 text-sm font-semibold">{b.d}</p>
            </div>
          </div>
        ))}
      </div>

      <form
        onSubmit={(e) => {
          e.preventDefault();
          setSent(true);
        }}
        className="space-y-4 rounded-3xl border border-border bg-card p-7"
      >
        {sent ? (
          <div className="py-10 text-center">
            <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
              <Send className="h-6 w-6" />
            </div>
            <h3 className="mt-4 font-display text-2xl font-bold">Message sent!</h3>
            <p className="mt-2 text-sm text-muted-foreground">We will get back to you within 24 hours.</p>
            <button
              type="button"
              onClick={() => setSent(false)}
              className="mt-5 text-sm font-semibold text-primary hover:underline"
            >
              Send another
            </button>
          </div>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Full name" name="name" />
              <Field label="Email" name="email" type="email" />
            </div>
            <Field label="Subject" name="subject" />
            <div>
              <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Message</label>
              <textarea
                required
                name="message"
                rows="5"
                className="mt-1 w-full rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-primary"
              />
            </div>
            <button className="inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-glow">
              Send message
              <Send className="h-4 w-4" />
            </button>
          </>
        )}
      </form>
    </div>
  );
}

function Field({ label, name, type = "text" }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        required
        name={name}
        type={type}
        className="mt-1 w-full rounded-full border border-border bg-background px-4 py-2.5 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
