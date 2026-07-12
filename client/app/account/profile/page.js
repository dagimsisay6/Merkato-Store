"use client";

import { useState, useEffect, useRef } from "react";
import { Check, AlertCircle, Loader2, Camera } from "lucide-react";
import { useAuth } from "@/lib/store-context";
import Avatar from "@/components/ui/Avatar";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function ProfilePage() {
  const { user, token, updateUser } = useAuth();

  const [form, setForm] = useState({ name: "", email: "", phone: "" });
  const [errors, setErrors] = useState({});
  const [saving, setSaving] = useState(false);
  const [profileMsg, setProfileMsg] = useState(null);

  // Avatar
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [avatarUploading, setAvatarUploading] = useState(false);
  const [removingAvatar, setRemovingAvatar] = useState(false);
  const [confirmRemove, setConfirmRemove] = useState(false);
  const fileRef = useRef(null);

  useEffect(() => {
    if (user) {
      setForm({ name: user.name ?? "", email: user.email ?? "", phone: user.phone ?? "" });
      setAvatarPreview(user.avatar ?? null);
    }
  }, [user]);

  const setField = (key, val) => {
    setForm((p) => ({ ...p, [key]: val }));
    setErrors((p) => ({ ...p, [key]: "" }));
    setProfileMsg(null);
  };

  // ── Avatar upload ──────────────────────────────────────
  const handleAvatarChange = async (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith("image/")) { setProfileMsg({ type: "error", text: "Please select an image file." }); return; }
    if (file.size > 5 * 1024 * 1024) { setProfileMsg({ type: "error", text: "Image must be under 5 MB." }); return; }

    // Show local preview immediately
    const reader = new FileReader();
    reader.onload = (ev) => setAvatarPreview(ev.target.result);
    reader.readAsDataURL(file);

    setAvatarUploading(true);
    setProfileMsg(null);
    try {
      const base64 = await toBase64(file);
      const res = await fetch(`${BASE}/users/avatar`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ data: base64 }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Upload failed.");
      setAvatarPreview(data.user.avatar);
      updateUser(data.user);
      setProfileMsg({ type: "success", text: "Profile picture updated." });
    } catch (err) {
      setAvatarPreview(user?.avatar ?? null);
      setProfileMsg({ type: "error", text: err.message });
    } finally {
      setAvatarUploading(false);
      e.target.value = "";
    }
  };

  // ── Avatar remove ──────────────────────────────────────
  const handleRemoveAvatar = async () => {
    setRemovingAvatar(true);
    setProfileMsg(null);
    try {
      const res = await fetch(`${BASE}/users/avatar`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Failed to remove photo.");
      setAvatarPreview(null);
      updateUser(data.user);
      setProfileMsg({ type: "success", text: "Profile picture removed." });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.message });
    } finally {
      setRemovingAvatar(false);
      setConfirmRemove(false);
    }
  };

  // ── Profile form ───────────────────────────────────────
  const validateProfile = () => {
    const errs = {};
    if (!form.name.trim()) errs.name = "Full name is required.";
    if (!form.email.trim()) errs.email = "Email address is required.";
    else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) errs.email = "Please enter a valid email address.";
    if (form.phone && !/^\+?[\d\s\-().]{7,20}$/.test(form.phone)) errs.phone = "Please enter a valid phone number.";
    return errs;
  };

  const handleProfile = async (e) => {
    e.preventDefault();
    const errs = validateProfile();
    if (Object.keys(errs).length) { setErrors(errs); return; }

    const unchanged =
      form.name.trim() === (user?.name ?? "") &&
      form.email.trim().toLowerCase() === (user?.email ?? "") &&
      (form.phone || "") === (user?.phone ?? "");
    if (unchanged) { setProfileMsg({ type: "info", text: "No changes to save." }); return; }

    setSaving(true);
    setProfileMsg(null);
    try {
      const res = await fetch(`${BASE}/users/profile`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ name: form.name.trim(), email: form.email.trim(), phone: form.phone || null, avatar: user?.avatar }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Update failed.");
      updateUser(data.user);
      setProfileMsg({ type: "success", text: "Your profile has been updated successfully." });
    } catch (err) {
      setProfileMsg({ type: "error", text: err.message });
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="space-y-6">
      <form onSubmit={handleProfile} noValidate className="rounded-3xl border border-border bg-card p-6 sm:p-8">
        <h2 className="font-display text-2xl font-bold">Profile</h2>
        <p className="mt-1 text-sm text-muted-foreground">Update your personal information.</p>

        {/* Avatar */}
        <div className="mt-6 flex items-center gap-5">
          <div className="relative">
            <Avatar
              src={avatarPreview}
              name={user?.name}
              className="h-20 w-20 rounded-2xl"
              textClassName="text-3xl"
            />
            {avatarUploading && (
              <div className="absolute inset-0 flex items-center justify-center rounded-2xl bg-black/40">
                <Loader2 className="h-5 w-5 animate-spin text-white" />
              </div>
            )}
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={avatarUploading || removingAvatar}
              className="absolute -bottom-1.5 -right-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-card bg-primary text-primary-foreground shadow transition hover:bg-primary-glow disabled:opacity-60"
              title="Change photo"
            >
              <Camera className="h-3.5 w-3.5" />
            </button>
            <input ref={fileRef} type="file" accept="image/*" className="hidden" onChange={handleAvatarChange} />
          </div>
          <div>
            <p className="text-sm font-semibold">{user?.name}</p>
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={avatarUploading || removingAvatar}
              className="mt-1 text-xs font-medium text-primary hover:underline disabled:opacity-60"
            >
              {avatarUploading ? "Uploading…" : "Change photo"}
            </button>
            <p className="mt-0.5 text-xs text-muted-foreground">JPG, PNG or WebP · Max 5 MB</p>

            {/* Remove photo */}
            {avatarPreview && !confirmRemove && (
              <button
                type="button"
                onClick={() => setConfirmRemove(true)}
                disabled={avatarUploading || removingAvatar}
                className="mt-1.5 block text-xs font-medium text-red-500 hover:underline disabled:opacity-60"
              >
                Remove photo
              </button>
            )}
            {confirmRemove && (
              <div className="mt-2 flex items-center gap-2">
                <span className="text-xs text-muted-foreground">Remove photo?</span>
                <button
                  type="button"
                  onClick={handleRemoveAvatar}
                  disabled={removingAvatar}
                  className="inline-flex items-center gap-1 text-xs font-semibold text-red-500 hover:underline disabled:opacity-60"
                >
                  {removingAvatar ? <><Loader2 className="h-3 w-3 animate-spin" /> Removing…</> : "Yes, remove"}
                </button>
                <button
                  type="button"
                  onClick={() => setConfirmRemove(false)}
                  className="text-xs font-medium text-muted-foreground hover:underline"
                >
                  Cancel
                </button>
              </div>
            )}
          </div>
        </div>

        {profileMsg && (
          <p className={`mt-5 rounded-xl px-4 py-3 text-sm font-medium ${
            profileMsg.type === "success" ? "bg-primary/10 text-primary" :
            profileMsg.type === "error"   ? "bg-red-50 text-red-600 dark:bg-red-950/30" :
            "bg-muted text-muted-foreground"
          }`}>
            {profileMsg.text}
          </p>
        )}

        <div className="mt-6 grid gap-4 sm:grid-cols-2">
          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Full name</label>
            <input
              value={form.name}
              onChange={(e) => setField("name", e.target.value)}
              className={`mt-1 h-11 w-full rounded-full border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.name ? "border-red-400" : "border-border"}`}
            />
            {errors.name && <FieldError message={errors.name} />}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Email address</label>
            <input
              type="email"
              value={form.email}
              onChange={(e) => setField("email", e.target.value)}
              className={`mt-1 h-11 w-full rounded-full border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.email ? "border-red-400" : "border-border"}`}
            />
            {errors.email && <FieldError message={errors.email} />}
          </div>

          <div>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Phone number</label>
            <input
              type="tel"
              value={form.phone}
              onChange={(e) => setField("phone", e.target.value)}
              placeholder="+1 234 567 8900"
              className={`mt-1 h-11 w-full rounded-full border bg-background px-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 ${errors.phone ? "border-red-400" : "border-border"}`}
            />
            {errors.phone && <FieldError message={errors.phone} />}
          </div>
        </div>

        <div className="mt-6 flex items-center gap-4">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center gap-2 rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-glow disabled:opacity-60 transition-colors"
          >
            {saving ? <><Loader2 className="h-3.5 w-3.5 animate-spin" /> Saving…</> : "Save changes"}
          </button>
          {profileMsg?.type === "success" && (
            <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-primary">
              <Check className="h-4 w-4" /> Saved
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
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />{message}
    </p>
  );
}

function toBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}
