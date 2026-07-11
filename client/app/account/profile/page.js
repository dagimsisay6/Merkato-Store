"use client";

import { useState } from "react";
import { Check, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/store-context";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const { user, token } = useAuth();
  const [name, setName] = useState(user?.name ?? "");
  const [phone, setPhone] = useState(user?.phone ?? "");
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);
  const [nameError, setNameError] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [pwSaved, setPwSaved] = useState(false);
  const [pwError, setPwError] = useState("");
  const [pwSaving, setPwSaving] = useState(false);
  const [pwFieldErrors, setPwFieldErrors] = useState({});

  async function handleProfile(e) {
    e.preventDefault();
    setError("");
    if (!name.trim()) { setNameError("Full name is required."); return; }
    setNameError("");
    setSaving(true);
    try {
      const res = await fetch(`${BASE}/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name, phone, avatar: user?.avatar }),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError(err.message);
    }
    setSaving(false);
  }

  async function handlePassword(e) {
    e.preventDefault();
    setPwError("");
    const errs = {};
    if (!currentPassword) errs.currentPassword = "Current password is required.";
    if (!newPassword || newPassword.length < 8) errs.newPassword = "New password must be at least 8 characters.";
    if (Object.keys(errs).length) { setPwFieldErrors(errs); return; }
    setPwFieldErrors({});
    setPwSaving(true);
    try {
      const res = await fetch(`${BASE}/users/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword, newPassword }),
      });
      if (!res.ok) throw new Error((await res.json()).message);
      setPwSaved(true);
      setCurrentPassword("");
      setNewPassword("");
      setTimeout(() => setPwSaved(false), 2000);
    } catch (err) {
      setPwError(err.message);
    }
    setPwSaving(false);
  }

  return (
    <div className="space-y-6">
      {/* Profile form */}
      <form onSubmit={handleProfile} noValidate className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Update your personal information.</p>

        <div className="mt-6 flex items-center gap-4">
          <div className="grid h-20 w-20 place-items-center rounded-full gradient-primary text-3xl font-extrabold text-primary-foreground">
            {user?.name?.[0]?.toUpperCase() ?? "U"}
          </div>
        </div>

        {error && <p className="mt-4 rounded-xl bg-ember/10 px-4 py-3 text-sm text-ember">{error}</p>}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full name</label>
            <input
              value={name}
              onChange={(e) => { setName(e.target.value); setNameError(""); }}
              className={`mt-1 h-11 w-full rounded-full border bg-background px-4 text-sm outline-none focus:border-primary ${nameError ? "border-red-400" : "border-border"}`}
            />
            {nameError && <FieldError message={nameError} />}
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email</label>
            <input value={user?.email ?? ""} disabled type="email"
              className="mt-1 h-11 w-full rounded-full border border-border bg-secondary px-4 text-sm text-muted-foreground outline-none" />
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone</label>
            <input value={phone} onChange={(e) => setPhone(e.target.value)} type="tel"
              className="mt-1 h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary" />
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button type="submit" disabled={saving}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-glow disabled:opacity-60">
            {saving ? "Saving…" : "Save changes"}
          </button>
          {saved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              <Check className="h-4 w-4" /> Saved
            </span>
          )}
        </div>
      </form>

      {/* Change password */}
      <form onSubmit={handlePassword} noValidate className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-xl font-bold">Change password</h2>

        {pwError && <p className="mt-4 rounded-xl bg-ember/10 px-4 py-3 text-sm text-ember">{pwError}</p>}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Current password</label>
            <input
              value={currentPassword}
              onChange={(e) => { setCurrentPassword(e.target.value); setPwFieldErrors((p) => ({ ...p, currentPassword: "" })); }}
              type="password"
              className={`mt-1 h-11 w-full rounded-full border bg-background px-4 text-sm outline-none focus:border-primary ${pwFieldErrors.currentPassword ? "border-red-400" : "border-border"}`}
            />
            {pwFieldErrors.currentPassword && <FieldError message={pwFieldErrors.currentPassword} />}
          </div>
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">New password</label>
            <input
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setPwFieldErrors((p) => ({ ...p, newPassword: "" })); }}
              type="password"
              className={`mt-1 h-11 w-full rounded-full border bg-background px-4 text-sm outline-none focus:border-primary ${pwFieldErrors.newPassword ? "border-red-400" : "border-border"}`}
            />
            {pwFieldErrors.newPassword && <FieldError message={pwFieldErrors.newPassword} />}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button type="submit" disabled={pwSaving}
            className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-glow disabled:opacity-60">
            {pwSaving ? "Updating…" : "Update password"}
          </button>
          {pwSaved && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              <Check className="h-4 w-4" /> Updated
            </span>
          )}
        </div>
      </form>
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
