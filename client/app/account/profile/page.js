"use client";

import { useState } from "react";
import { Check } from "lucide-react";

export default function ProfilePage() {
  const [saved, setSaved] = useState(false);

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setSaved(true);

        setTimeout(() => {
          setSaved(false);
        }, 2000);
      }}
      className="rounded-3xl border border-border bg-card p-6 sm:p-8"
    >
      <h2 className="font-display text-2xl font-bold">
        Profile
      </h2>

      <p className="mt-1 text-sm text-muted-foreground">
        Update your personal information.
      </p>

      <div className="mt-6 flex items-center gap-4">
        <div className="grid h-20 w-20 place-items-center rounded-full gradient-primary text-3xl font-extrabold text-primary-foreground">
          A
        </div>

        <button
          type="button"
          className="rounded-full border border-border px-4 py-2 text-xs font-semibold hover:bg-secondary"
        >
          Upload photo
        </button>
      </div>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        <Input label="First name" defaultValue="Amara" />
        <Input label="Last name" defaultValue="Okafor" />
        <Input
          label="Email"
          type="email"
          defaultValue="amara@example.com"
        />
        <Input
          label="Phone"
          type="tel"
          defaultValue="+234 801 234 5678"
        />
        <Input
          label="Date of birth"
          type="date"
          defaultValue="1995-03-12"
        />

        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
            Gender
          </label>

          <select className="mt-1 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
            <option>Prefer not to say</option>
            <option>Female</option>
            <option>Male</option>
            <option>Non-binary</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-between">
        <button className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-glow">
          Save changes
        </button>

        {saved && (
          <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
            <Check className="h-4 w-4" />
            Saved
          </span>
        )}
      </div>
    </form>
  );
}

function Input({
  label,
  type = "text",
  defaultValue,
}) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>

      <input
        type={type}
        defaultValue={defaultValue}
        className="mt-1 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary"
      />
    </div>
  );
}
