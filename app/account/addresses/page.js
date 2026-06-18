"use client"

import { useState } from "react";
import { Plus, Pencil, Trash2, MapPin, Check } from "lucide-react";
import { MOCK_ADDRESSES } from "@/lib/store-data";

export default function AddressesPage() {
  const [addrs, setAddrs] = useState(MOCK_ADDRESSES);
  const [adding, setAdding] = useState(false);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="font-display text-2xl font-bold">Addresses</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your delivery addresses.
          </p>
        </div>

        <button
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-2 rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow"
        >
          <Plus className="h-4 w-4" />
          Add address
        </button>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        {addrs.map((a) => (
          <div
            key={a.id}
            className="rounded-2xl border border-border bg-card p-5"
          >
            <div className="flex items-start justify-between">
              <div className="inline-flex items-center gap-2 rounded-full bg-primary/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                <MapPin className="h-3 w-3" />
                {a.label}
              </div>

              {a.default && (
                <span className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-widest text-primary">
                  <Check className="h-3 w-3" />
                  Default
                </span>
              )}
            </div>

            <p className="mt-3 font-semibold">{a.name}</p>

            <p className="text-sm text-muted-foreground">
              {a.line1}
              <br />
              {a.city}, {a.country}
              <br />
              {a.phone}
            </p>

            <div className="mt-4 flex gap-2">
              <button className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold hover:bg-secondary">
                <Pencil className="h-3 w-3" />
                Edit
              </button>

              <button
                onClick={() =>
                  setAddrs((p) => p.filter((x) => x.id !== a.id))
                }
                className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-ember hover:bg-ember/10"
              >
                <Trash2 className="h-3 w-3" />
                Remove
              </button>
            </div>
          </div>
        ))}
      </div>

      {adding && (
        <form
          onSubmit={(e) => {
            e.preventDefault();
            setAdding(false);
          }}
          className="space-y-4 rounded-3xl border border-border bg-card p-6"
        >
          <h3 className="font-display text-lg font-bold">New address</h3>

          <div className="grid gap-4 sm:grid-cols-2">
            <Input label="Label (Home, Office...)" />
            <Input label="Full name" />
            <Input label="Phone" />
            <Input label="City" />
          </div>

          <Input label="Street address" />

          <div className="flex gap-3">
            <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
              Save address
            </button>

            <button
              type="button"
              onClick={() => setAdding(false)}
              className="rounded-full border border-border px-5 py-2 text-sm font-semibold"
            >
              Cancel
            </button>
          </div>
        </form>
      )}
    </div>
  );
}

function Input({ label }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>

      <input
        required
        className="mt-1 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}