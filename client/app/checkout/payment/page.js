"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Smartphone, Banknote } from "lucide-react";
import { getSession, patchSession } from "@/lib/checkout-session";

export default function PaymentPage() {
  const [method, setMethod] = useState("card");
  const [cardNum, setCardNum] = useState("");
  const [expiry, setExpiry] = useState("");
  const [cvc, setCvc] = useState("");
  const [mobile, setMobile] = useState("");
  const router = useRouter();

  useEffect(() => {
    const saved = getSession()?.paymentMethod;
    if (saved) setMethod(saved);
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    patchSession({ paymentMethod: method });
    router.push("/checkout/review");
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <h2 className="font-display text-2xl font-bold">Payment method</h2>

      <div className="grid gap-3 sm:grid-cols-3">
        <Tile id="card" label="Card" icon={CreditCard} current={method} set={setMethod} />
        <Tile id="momo" label="Mobile Money" icon={Smartphone} current={method} set={setMethod} />
        <Tile id="cod" label="Cash on Delivery" icon={Banknote} current={method} set={setMethod} />
      </div>

      {method === "card" && (
        <div className="space-y-4">
          <Field label="Card number" value={cardNum} onChange={(e) => setCardNum(e.target.value)} placeholder="1234 5678 9012 3456" />
          <div className="grid gap-4 sm:grid-cols-2">
            <Field label="Expiry (MM/YY)" value={expiry} onChange={(e) => setExpiry(e.target.value)} placeholder="MM/YY" />
            <Field label="CVC" value={cvc} onChange={(e) => setCvc(e.target.value)} placeholder="123" />
          </div>
        </div>
      )}

      {method === "momo" && (
        <Field label="Mobile number" value={mobile} onChange={(e) => setMobile(e.target.value)} placeholder="+251 9XX XXX XXXX" />
      )}

      {method === "cod" && (
        <div className="rounded-2xl border border-border bg-secondary/50 p-5 text-sm text-muted-foreground">
          You will pay when your order is delivered. Please have the exact amount ready.
        </div>
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

function Field({ label, value, onChange, placeholder }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      <input
        required
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="mt-1 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
