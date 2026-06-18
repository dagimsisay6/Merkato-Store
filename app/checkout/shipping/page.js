"use client";

import Link from "next/link";
import { COUNTRIES } from "@/lib/store-data";
import { useRouter } from "next/navigation";

export default function ShippingPage() {
  const router = useRouter();

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        router.push("/checkout/payment");
      }}
      className="space-y-5"
    >
      <h2 className="font-display text-2xl font-bold">Shipping address</h2>

      <div className="grid gap-4 sm:grid-cols-2">
        <Input label="First name" />
        <Input label="Last name" />
      </div>

      <Input label="Email" type="email" />
      <Input label="Phone" />

      <Input label="Street address" />

      <div className="grid gap-4 sm:grid-cols-3">
        <Input label="City" />
        <Input label="State / Region" />
        <Input label="Postal code" />
      </div>

      <select className="h-11 w-full rounded-full border px-4">
        {COUNTRIES.map((c) => (
          <option key={c.code}>{c.name}</option>
        ))}
      </select>

      <div className="flex justify-between pt-5">
        <Link href="/cart" className="rounded-full border px-6 py-3">
          Back
        </Link>

        <button className="rounded-full bg-primary px-8 py-3 text-white">
          Continue →
        </button>
      </div>
    </form>
  );
}

function Input({ label, type = "text" }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase">{label}</label>

      <input
        required
        type={type}
        className="mt-1 h-11 w-full rounded-full border px-4"
      />
    </div>
  );
}
