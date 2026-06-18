"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { CreditCard, Smartphone, Banknote } from "lucide-react";

export default function PaymentPage() {
  const [method, setMethod] = useState("card");

  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/checkout/review");
      }}
      className="space-y-6"
    >
      <h2 className="font-display text-2xl font-bold">Payment method</h2>

      <div className="grid sm:grid-cols-3 gap-3">
        <Tile
          id="card"
          label="Card"
          icon={CreditCard}
          current={method}
          set={setMethod}
        />

        <Tile
          id="momo"
          label="Mobile Money"
          icon={Smartphone}
          current={method}
          set={setMethod}
        />

        <Tile
          id="cod"
          label="Cash"
          icon={Banknote}
          current={method}
          set={setMethod}
        />
      </div>

      {method === "card" && (
        <div className="space-y-4">
          <Input label="Card number" />

          <Input label="Expiry" />

          <Input label="CVC" />
        </div>
      )}

      {method === "momo" && <Input label="Mobile number" />}

      {method === "cod" && (
        <div className="rounded-xl bg-secondary p-5">
          Pay when your order arrives.
        </div>
      )}

      <div className="flex justify-between pt-5">
        <Link
          href="/checkout/shipping"
          className="border rounded-full px-6 py-3"
        >
          Back
        </Link>

        <button className="rounded-full bg-primary px-8 py-3 text-white">
          Review →
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
      className={`rounded-2xl border p-5 
${current === id ? "border-primary" : "border-border"}
`}
    >
      <Icon />

      {label}
    </button>
  );
}

function Input({ label }) {
  return (
    <input
      placeholder={label}
      className="h-11 w-full rounded-full border px-4"
    />
  );
}
