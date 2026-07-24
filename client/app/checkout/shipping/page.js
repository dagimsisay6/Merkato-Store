"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCountries } from "@/lib/api";
import { getSession, patchSession } from "@/lib/checkout-session";
import { Alert } from "@/components/ui/alert";
import { AlertCircle, MapPin } from "lucide-react";
import { useAuth } from "@/lib/store-context";
import { validatePhone, PHONE_RULES } from "@/lib/phone-rules";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function ShippingPage() {
  const router = useRouter();
  const { token, mounted } = useAuth();
  const [countries, setCountries] = useState([]);
  const [savedAddrs, setSavedAddrs] = useState([]);
  const [form, setForm] = useState({
    firstName: "", lastName: "", email: "", phone: "",
    line1: "", city: "", state: "", postal: "", country: "",
  });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");

  useEffect(() => {
    const session = getSession();
    if (!session?.items?.length) { router.replace("/cart"); return; }
    getCountries().then((d) => setCountries(d?.countries ?? []));
    if (session.shipping) setForm(session.shipping);
  }, []);

  useEffect(() => {
    if (!mounted || !token) return;
    fetch(`${BASE}/users/addresses`, { headers: { Authorization: `Bearer ${token}` } })
      .then((r) => r.json())
      .then((d) => {
        const addrs = d.addresses ?? [];
        setSavedAddrs(addrs);
        // auto-fill default address only if form is still empty
        const session = getSession();
        if (!session?.shipping) {
          const def = addrs.find((a) => a.isDefault) ?? addrs[0];
          if (def) applyAddress(def);
        }
      })
      .catch(() => {});
  }, [mounted, token]);

  function applyAddress(a) {
    setForm((f) => ({
      ...f,
      name: a.name ?? f.name,
      firstName: a.name?.split(" ")[0] ?? f.firstName,
      lastName: a.name?.split(" ").slice(1).join(" ") ?? f.lastName,
      phone: a.phone ?? f.phone,
      line1: a.line1 ?? f.line1,
      city: a.city ?? f.city,
      country: a.country ?? f.country,
    }));
    setErrors({});
  }

  const set = (k) => (e) => {
    setForm((f) => ({ ...f, [k]: e.target.value }));
    if (errors[k]) setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "First name is required.";
    if (!form.lastName.trim()) e.lastName = "Last name is required.";
    if (!form.email.trim()) e.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) e.email = "Enter a valid email address.";
    if (!form.phone.trim()) e.phone = "Phone number is required.";
    else {
      const phoneErr = validatePhone(form.phone, form.country);
      if (phoneErr) e.phone = phoneErr;
    };
    if (!form.line1.trim()) e.line1 = "Street address is required.";
    if (!form.city.trim()) e.city = "City is required.";
    if (!form.state.trim()) e.state = "State / Region is required.";
    if (!form.postal.trim()) e.postal = "Postal code is required.";
    if (!form.country) e.country = "Please select a country.";
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      setSubmitError("Please fix the errors below before continuing.");
      return;
    }
    patchSession({ shipping: form, step: "shipping" });
    router.push("/checkout/payment");
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-5">
      <h2 className="font-display text-2xl font-bold">Shipping address</h2>

      {submitError && (
        <Alert variant="error" title="Form incomplete" message={submitError} onDismiss={() => setSubmitError("")} />
      )}

      {savedAddrs.length > 0 && (
        <div className="space-y-2">
          <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Saved addresses</p>
          <div className="flex flex-wrap gap-2">
            {savedAddrs.map((a) => (
              <button
                key={a.id}
                type="button"
                onClick={() => applyAddress(a)}
                className="inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold hover:border-primary hover:bg-primary/5 transition"
              >
                <MapPin className="h-3 w-3 text-primary" />
                {a.label} — {a.city}
                {a.isDefault && <span className="ml-1 text-primary">(default)</span>}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" value={form.firstName} onChange={set("firstName")} error={errors.firstName} />
        <Field label="Last name" value={form.lastName} onChange={set("lastName")} error={errors.lastName} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
        <Field label="Phone" type="tel" value={form.phone} onChange={set("phone")} error={errors.phone}
          hint={!errors.phone && form.country && PHONE_RULES[form.country] ? PHONE_RULES[form.country].hint : ""} />
      </div>
      <Field label="Street address" value={form.line1} onChange={set("line1")} error={errors.line1} />
      <div className="grid gap-4 sm:grid-cols-3">
        <Field label="City" value={form.city} onChange={set("city")} error={errors.city} />
        <Field label="State / Region" value={form.state} onChange={set("state")} error={errors.state} />
        <Field label="Postal code" value={form.postal} onChange={set("postal")} error={errors.postal} />
      </div>

      <div>
        <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Country</label>
        <select
          value={form.country}
          onChange={set("country")}
          className={`mt-1 h-11 w-full rounded-full border bg-background px-4 text-sm outline-none focus:border-primary ${
            errors.country ? "border-red-400" : "border-border"
          }`}
        >
          <option value="">Select country…</option>
          {countries.map((c) => (
            <option key={c.code} value={c.code}>{c.name}</option>
          ))}
        </select>
        {errors.country && <FieldError message={errors.country} />}
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

function Field({ label, type = "text", value, onChange, error, hint }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        type={type}
        value={value}
        onChange={onChange}
        className={`mt-1 h-11 w-full rounded-full border bg-background px-4 text-sm outline-none focus:border-primary ${
          error ? "border-red-400 focus:border-red-400" : "border-border"
        }`}
      />
      {hint && !error && <p className="mt-1 text-[11px] text-muted-foreground">{hint}</p>}
      {error && <FieldError message={error} />}
    </div>
  );
}

function FieldError({ message }) {
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
      {message}
    </p>
  );
}
