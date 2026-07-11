"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { getCountries } from "@/lib/api";
import { getSession, patchSession } from "@/lib/checkout-session";
import { Alert } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

export default function ShippingPage() {
  const router = useRouter();
  const [countries, setCountries] = useState([]);
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

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="First name" value={form.firstName} onChange={set("firstName")} error={errors.firstName} />
        <Field label="Last name" value={form.lastName} onChange={set("lastName")} error={errors.lastName} />
      </div>
      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Email" type="email" value={form.email} onChange={set("email")} error={errors.email} />
        <Field label="Phone" type="tel" value={form.phone} onChange={set("phone")} error={errors.phone} />
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

function Field({ label, type = "text", value, onChange, error }) {
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
