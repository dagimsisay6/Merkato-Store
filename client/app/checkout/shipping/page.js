"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCountries } from "@/lib/api";
import { getSession, patchSession } from "@/lib/checkout-session";

export default function ShippingPage() {
  const router = useRouter();
  const [countries, setCountries] = useState([]);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    line1: "", city: "", state: "", postal: "", country: "",
  });

  useEffect(() => {
    getCountries().then((d) => setCountries(d?.countries ?? []));
    const saved = getSession()?.shipping;
    if (saved) setForm(saved);
  }, []);

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const handleSubmit = (e) => {
    e.preventDefault();
    patchSession({ shipping: form });
    router.push("/checkout/payment");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <h2 className="font-display text-2xl font-bold">Shipping address</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" value={form.firstName} onChange={set("firstName")} />
        <Field label="Last name" value={form.lastName} onChange={set("lastName")} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" type="email" value={form.email} onChange={set("email")} />
        <Field label="Phone" type="tel" value={form.phone} onChange={set("phone")} />
      </div>
      <Field label="Street address" value={form.line1} onChange={set("line1")} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="City" value={form.city} onChange={set("city")} />
        <Field label="State / Region" value={form.state} onChange={set("state")} />
        <Field label="Postal code" value={form.postal} onChange={set("postal")} />
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Country</label>
        <select
          required
          value={form.country}
          onChange={set("country")}
          className="mt-1 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary"
        >
          <option value="">Select country…</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
      </div>

      <div className="flex justify-between pt-2">
        <Link href="/cart" className="rounded-full border border-border px-6 py-3 text-sm font-semibold">
          Back
        </Link>
        <button type="submit" className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-glow">
          Continue →
        </button>
      </div>
    </form>
  );
}

function Field({ label, type = "text", value, onChange }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        required
        type={type}
        value={value}
        onChange={onChange}
        className="mt-1 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
