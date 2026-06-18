"use client"

import { useState } from "react";
import { Bell, Globe, Lock, Trash2 } from "lucide-react";

export default function SettingsPage() {
  const [notif, setNotif] = useState({
    email: true,
    sms: true,
    push: false,
    marketing: false,
  });

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage preferences and account security.
        </p>
      </div>

      <Card icon={Bell} title="Notifications">
        {Object.entries(notif).map(([k, v]) => (
          <label
            key={k}
            className="flex items-center justify-between py-2 text-sm"
          >
            <span className="capitalize">
              {k === "sms" ? "SMS" : k} notifications
            </span>

            <input
              type="checkbox"
              checked={v}
              onChange={() =>
                setNotif((p) => ({
                  ...p,
                  [k]: !v,
                }))
              }
              className="h-5 w-9 accent-primary"
            />
          </label>
        ))}
      </Card>

      <Card icon={Globe} title="Region & language">
        <div className="grid gap-4 sm:grid-cols-2">
          <Select
            label="Country"
            options={[
              "Nigeria",
              "Kenya",
              "Ethiopia",
              "UAE",
              "Saudi Arabia",
              "Egypt",
            ]}
          />

          <Select
            label="Language"
            options={[
              "English",
              "Arabic",
              "Français",
              "Swahili",
            ]}
          />

          <Select
            label="Currency"
            options={[
              "USD",
              "NGN",
              "KES",
              "AED",
              "SAR",
              "EGP",
            ]}
          />
        </div>
      </Card>

      <Card icon={Lock} title="Security">
        <button className="rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow">
          Change password
        </button>

        <button className="ml-2 rounded-full border border-border px-5 py-2 text-sm font-semibold">
          Enable 2FA
        </button>
      </Card>

      <Card icon={Trash2} title="Danger zone">
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all associated data.
        </p>

        <button className="mt-3 rounded-full border border-ember/40 px-5 py-2 text-sm font-semibold text-ember hover:bg-ember/10">
          Delete account
        </button>
      </Card>
    </div>
  );
}

function Card({ icon: Icon, title, children }) {
  return (
    <div className="rounded-3xl border border-border bg-card p-6">
      <div className="inline-flex items-center gap-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">
        <Icon className="h-4 w-4" />
        {title}
      </div>

      <div className="mt-4">{children}</div>
    </div>
  );
}

function Select({ label, options }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>

      <select className="mt-1 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary">
        {options.map((o) => (
          <option key={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}