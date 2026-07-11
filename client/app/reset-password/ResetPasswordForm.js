"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function ResetPasswordForm() {
  const [show, setShow] = useState(false);
  const [newPassword, setNewPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});
  const router = useRouter();

  const handleSubmit = (e) => {
    e.preventDefault();
    const errs = {};
    if (!newPassword || newPassword.length < 8) errs.newPassword = "Password must be at least 8 characters.";
    if (!confirm) errs.confirm = "Please confirm your password.";
    else if (newPassword !== confirm) errs.confirm = "Passwords do not match.";
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }
    router.push("/signin");
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Set a new password</h1>
      <p className="mt-2 text-muted-foreground">Choose a strong password you haven&apos;t used before.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-6 space-y-4">
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">New password</label>
          <div className="relative mt-1">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={show ? "text" : "password"}
              value={newPassword}
              onChange={(e) => { setNewPassword(e.target.value); setFieldErrors((p) => ({ ...p, newPassword: "" })); }}
              className={`h-12 w-full rounded-full border bg-card pl-11 pr-12 text-sm outline-none focus:border-primary ${fieldErrors.newPassword ? "border-red-400" : "border-border"}`}
            />
            <button type="button" onClick={() => setShow((v) => !v)} className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground">
              {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.newPassword && <FieldError message={fieldErrors.newPassword} />}
        </div>

        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Confirm password</label>
          <div className="relative mt-1">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={show ? "text" : "password"}
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setFieldErrors((p) => ({ ...p, confirm: "" })); }}
              className={`h-12 w-full rounded-full border bg-card pl-11 pr-12 text-sm outline-none focus:border-primary ${fieldErrors.confirm ? "border-red-400" : "border-border"}`}
            />
          </div>
          {fieldErrors.confirm && <FieldError message={fieldErrors.confirm} />}
        </div>

        <button type="submit" className="h-12 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-glow">
          Save &amp; sign in
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/signin" className="font-semibold text-primary hover:underline">Back to sign in</Link>
      </p>
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
