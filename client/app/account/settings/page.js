"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Lock, Trash2, Eye, EyeOff } from "lucide-react";
import { useAuth } from "@/lib/store-context";
import { deleteAccount } from "@/lib/api";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function SettingsPage() {
  const { token, signout } = useAuth();
  const router = useRouter();

  const [pwForm, setPwForm] = useState({ currentPassword: "", newPassword: "", confirm: "" });
  const [showPw, setShowPw] = useState(false);
  const [pwLoading, setPwLoading] = useState(false);
  const [pwMsg, setPwMsg] = useState(null);

  const [delPassword, setDelPassword] = useState("");
  const [delLoading, setDelLoading] = useState(false);
  const [delError, setDelError] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handlePasswordChange = async (e) => {
    e.preventDefault();
    if (pwForm.newPassword !== pwForm.confirm) {
      setPwMsg({ type: "error", text: "New passwords do not match." });
      return;
    }
    setPwLoading(true);
    setPwMsg(null);
    try {
      const res = await fetch(`${BASE}/users/password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: pwForm.currentPassword, newPassword: pwForm.newPassword }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed");
      setPwMsg({ type: "success", text: "Password updated successfully." });
      setPwForm({ currentPassword: "", newPassword: "", confirm: "" });
    } catch (err) {
      setPwMsg({ type: "error", text: err.message });
    } finally {
      setPwLoading(false);
    }
  };

  const handleDeleteAccount = async () => {
    setDelLoading(true);
    setDelError(null);
    try {
      await deleteAccount(delPassword, token);
      signout();
      router.push("/");
    } catch (err) {
      setDelError(err.message || "Incorrect password.");
      setDelLoading(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Settings</h2>
        <p className="mt-1 text-sm text-muted-foreground">
          Manage your account security.
        </p>
      </div>

      {/* Change Password */}
      <Card icon={Lock} title="Security">
        <form onSubmit={handlePasswordChange} className="space-y-4">
          <Field
            label="Current password"
            type={showPw ? "text" : "password"}
            value={pwForm.currentPassword}
            onChange={v => setPwForm(p => ({ ...p, currentPassword: v }))}
            suffix={
              <button type="button" onClick={() => setShowPw(v => !v)} className="text-muted-foreground">
                {showPw ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            }
          />
          <Field
            label="New password"
            type={showPw ? "text" : "password"}
            value={pwForm.newPassword}
            onChange={v => setPwForm(p => ({ ...p, newPassword: v }))}
          />
          <Field
            label="Confirm new password"
            type={showPw ? "text" : "password"}
            value={pwForm.confirm}
            onChange={v => setPwForm(p => ({ ...p, confirm: v }))}
          />
          {pwMsg && (
            <p className={`text-sm font-medium ${pwMsg.type === "success" ? "text-primary" : "text-red-500"}`}>
              {pwMsg.text}
            </p>
          )}
          <button
            type="submit"
            disabled={pwLoading}
            className="rounded-full bg-primary px-6 py-2 text-sm font-semibold text-primary-foreground disabled:opacity-60"
          >
            {pwLoading ? "Saving…" : "Update password"}
          </button>
        </form>
      </Card>

      {/* Danger Zone */}
      <Card icon={Trash2} title="Danger zone">
        <p className="text-sm text-muted-foreground">
          Permanently delete your account and all associated data. This cannot be undone.
        </p>
        {!confirmDelete ? (
          <button
            onClick={() => setConfirmDelete(true)}
            className="mt-3 rounded-full border border-red-400/40 px-5 py-2 text-sm font-semibold text-red-500 hover:bg-red-500/10"
          >
            Delete account
          </button>
        ) : (
          <div className="mt-4 space-y-3">
            <p className="text-sm font-semibold text-red-500">Enter your password to confirm deletion:</p>
            <input
              type="password"
              value={delPassword}
              onChange={e => setDelPassword(e.target.value)}
              placeholder="Your password"
              className="h-11 w-full max-w-xs rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-red-400"
            />
            {delError && <p className="text-sm text-red-500">{delError}</p>}
            <div className="flex gap-2">
              <button
                onClick={handleDeleteAccount}
                disabled={delLoading || !delPassword}
                className="rounded-full bg-red-500 px-5 py-2 text-sm font-semibold text-white disabled:opacity-60"
              >
                {delLoading ? "Deleting…" : "Confirm delete"}
              </button>
              <button
                onClick={() => { setConfirmDelete(false); setDelPassword(""); setDelError(null); }}
                className="rounded-full border border-border px-5 py-2 text-sm font-semibold"
              >
                Cancel
              </button>
            </div>
          </div>
        )}
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

function Field({ label, type, value, onChange, suffix }) {
  return (
    <div>
      <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
      <div className="relative mt-1">
        <input
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          required
          className="h-11 w-full rounded-full border border-border bg-background px-4 text-sm outline-none focus:border-primary"
        />
        {suffix && (
          <span className="absolute right-4 top-1/2 -translate-y-1/2">{suffix}</span>
        )}
      </div>
    </div>
  );
}
