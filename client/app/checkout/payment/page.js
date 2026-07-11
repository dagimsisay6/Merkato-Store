"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Smartphone, Banknote, AlertCircle } from "lucide-react";
import { getSession, patchSession } from "@/lib/checkout-session";
import { Alert } from "@/components/ui/alert";

export default function PaymentPage() {
  const [method, setMethod] = useState("card");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [mobile, setMobile] = useState("");
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const router = useRouter();

  useEffect(() => {
    const session = getSession();
    if (!session?.items?.length) { router.replace("/cart"); return; }
    if (session.step !== "shipping") { router.replace("/checkout/shipping"); return; }
    if (session.paymentMethod) setMethod(session.paymentMethod);
  }, []);

  const clearError = (k) => setErrors((p) => ({ ...p, [k]: "" }));

  const validate = () => {
    const e = {};
    if (method === "card") {
      if (!cardNum.trim()) e.cardNum = "Card number is required.";
      else if (cardNum.replace(/\s/g, "").length < 13) e.cardNum = "Enter a valid card number.";
      if (!expiry.trim()) e.expiry = "Expiry date is required.";
      else if (!/^\d{2}\/\d{2}$/.test(expiry)) e.expiry = "Use MM/YY format.";
      if (!cvc.trim()) e.cvc = "CVC is required.";
      else if (!/^\d{3,4}$/.test(cvc)) e.cvc = "Enter a valid CVC.";
    }
    if (method === "momo") {
      if (!mobile.trim()) e.mobile = "Mobile number is required.";
    }
    return e;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitError("");
    const e2 = validate();
    if (Object.keys(e2).length) {
      setErrors(e2);
      setSubmitError("Please complete your payment details before continuing.");
      return;
    }
    patchSession({ paymentMethod: method, step: "payment" });
    router.push("/checkout/review");
  };

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Payment method</h2>

      {submitError && (
        <Alert variant="error" title="Payment details incomplete" message={submitError} onDismiss={() => setSubmitError("")} />
      )}

      <div className="grid gap-3 sm:grid-cols-3">
        <Tile id="card" label="Card" icon={CreditCard} current={method} set={(v) => { setMethod(v); setErrors({}); setSubmitError(""); }} />
        <Tile id="momo" label="Mobile Money" icon={Smartphone} current={method} set={(v) => { setMethod(v); setErrors({}); setSubmitError(""); }} />
        <Tile id="cod" label="Cash on Delivery" icon={Banknote} current={method} set={(v) => { setMethod(v); setErrors({}); setSubmitError(""); }} />
      </div>

      {method === "card" && (
        <div className="space-y-4">
          <Field
            label="Card number"
            value={cardNum}
            onChange={(e) => { setCardNum(e.target.value); clearError("cardNum"); }}
            placeholder="1234 5678 9012 3456"
            error={errors.cardNum}
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field
              label="Expiry (MM/YY)"
              value={expiry}
              onChange={(e) => { setExpiry(e.target.value); clearError("expiry"); }}
              placeholder="MM/YY"
              error={errors.expiry}
            />
            <Field
              label="CVC"
              value={cvc}
              onChange={(e) => { setCvc(e.target.value); clearError("cvc"); }}
              placeholder="123"
              error={errors.cvc}
            />
          </div>
        </div>
      )}

      {method === "momo" && (
        <Field
          label="Mobile number"
          value={mobile}
          onChange={(e) => { setMobile(e.target.value); clearError("mobile"); }}
          placeholder="+251 9XX XXX XXXX"
          error={errors.mobile}
        />
      )}

      {method === "cod" && (
        <Alert
          variant="info"
          title="Cash on Delivery"
          message="You will pay when your order is delivered. Please have the exact amount ready."
        />
      )}

      <div className="flex justify-between pt-2">
        <Link href="/checkout/shipping" className="rounded-full border border-border px-6 py-3 text-sm font-semibold">
          Back
        </Link>
        <button type="submit" className="rounded-full bg-primary px-8 py-3 text-sm font-semibold text-primary-foreground hover:bg-primary-glow">
          Review order →
        </button>
      </div>
    </form>
  );
}

function Tile({ id, label, icon: Icon, current, set }) {
  return (
    <button
      type="button"
      onClick={() => set(id)}
      className={`flex flex-col items-center gap-2 rounded-2xl border p-5 text-sm font-semibold transition ${
        current === id ? "border-primary bg-primary/5 text-primary" : "border-border hover:border-primary/40"
      }`}
    >
      <Icon className="h-5 w-5" />
      {label}
    </button>
  );
}

function Field({ label, value, onChange, placeholder, error }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className={`mt-1 h-11 w-full rounded-full border bg-background px-4 text-sm outline-none focus:border-primary ${
          error ? "border-red-400 focus:border-red-400" : "border-border"
        }`}
      />
      {error && (
        <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
          <AlertCircle className="h-3.5 w-3.5 shrink-0" />
          {error}
        </p>
      )}
    </div>
  );
}
