"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff, AlertCircle, Check, Loader2, ShieldAlert } from "lucide-react";
import { validateResetToken, resetPassword } from "@/lib/api";

const REQUIREMENTS = [
  { label: "At least 8 characters", test: (p) => p.length >= 8 },
  { label: "One uppercase letter", test: (p) => /[A-Z]/.test(p) },
  { label: "One lowercase letter", test: (p) => /[a-z]/.test(p) },
  { label: "One number", test: (p) => /\d/.test(p) },
  { label: "One special character", test: (p) => /[^A-Za-z0-9]/.test(p) },
];

function getStrength(password) {
  const passed = REQUIREMENTS.filter((r) => r.test(password)).length;
  if (passed <= 1) return { level: 0, label: "Very weak", color: "bg-red-500" };
  if (passed === 2) return { level: 1, label: "Weak", color: "bg-orange-400" };
  if (passed === 3) return { level: 2, label: "Fair", color: "bg-yellow-400" };
  if (passed === 4) return { level: 3, label: "Strong", color: "bg-blue-500" };
  return { level: 4, label: "Very strong", color: "bg-primary" };
}

export default function ResetPasswordForm({ token }) {
  const router = useRouter();
  const [tokenState, setTokenState] = useState("checking"); // checking | valid | invalid
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [serverError, setServerError] = useState("");

  useEffect(() => {
    if (!token) { setTokenState("invalid"); return; }
    validateResetToken(token).then((data) => {
      setTokenState(data?.valid ? "valid" : "invalid");
    }).catch(() => setTokenState("invalid"));
  }, [token]);

  const strength = getStrength(password);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setServerError("");
    const errs = {};
    const allPassed = REQUIREMENTS.every((r) => r.test(password));
    if (!password) errs.password = "Password is required.";
    else if (!allPassed) errs.password = "Password does not meet all requirements.";
    if (!confirm) errs.confirm = "Please confirm your password.";
    else if (password !== confirm) errs.confirm = "Passwords do not match.";
    if (Object.keys(errs).length) { setFieldErrors(errs); return; }

    setLoading(true);
    try {
      await resetPassword(token, password);
      setSuccess(true);
      setTimeout(() => router.push("/signin"), 3000);
    } catch (err) {
      setServerError(err.message || "Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  if (tokenState === "checking") {
    return (
      <div className="flex flex-col items-center gap-4 py-16 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin text-primary" />
        <p className="text-sm">Validating your reset link…</p>
      </div>
    );
  }

  if (tokenState === "invalid") {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-red-100 text-red-500 dark:bg-red-950/40">
          <ShieldAlert className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-bold">Link Invalid or Expired</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          This password reset link is invalid or has expired. Reset links are valid for 15 minutes.
        </p>
        <Link
          href="/forgot-password"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow"
        >
          Request a New Link
        </Link>
      </div>
    );
  }

  if (success) {
    return (
      <div className="rounded-3xl border border-border bg-card p-8 text-center shadow-sm">
        <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary/10 text-primary">
          <Check className="h-6 w-6" />
        </div>
        <h2 className="mt-4 text-xl font-bold">Password Updated!</h2>
        <p className="mt-2 text-sm text-muted-foreground">
          Your password has been successfully updated. Redirecting you to sign in…
        </p>
        <Link
          href="/signin"
          className="mt-6 inline-flex items-center justify-center rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow"
        >
          Sign In Now
        </Link>
      </div>
    );
  }

  return (
    <>
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Set a New Password</h1>
      <p className="mt-2 text-muted-foreground">Choose a strong password you haven&apos;t used before.</p>

      <form onSubmit={handleSubmit} noValidate className="mt-8 space-y-5">
        {serverError && (
          <p className="rounded-xl bg-red-50 px-4 py-3 text-sm font-medium text-red-600 dark:bg-red-950/30">
            {serverError}
          </p>
        )}

        {/* New Password */}
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">New Password</label>
          <div className="relative mt-2">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => { setPassword(e.target.value); setFieldErrors((p) => ({ ...p, password: "" })); }}
              autoComplete="new-password"
              className={`h-12 w-full rounded-full border bg-card pl-11 pr-12 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${fieldErrors.password ? "border-red-400" : "border-border"}`}
            />
            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
            </button>
          </div>
          {fieldErrors.password && <FieldError message={fieldErrors.password} />}

          {/* Strength bar */}
          {password.length > 0 && (
            <div className="mt-3 space-y-2">
              <div className="flex gap-1">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`h-1.5 flex-1 rounded-full transition-all duration-300 ${i <= strength.level - 1 ? strength.color : "bg-muted"}`}
                  />
                ))}
              </div>
              <p className="text-xs text-muted-foreground">
                Strength: <span className="font-semibold">{strength.label}</span>
              </p>
              <ul className="space-y-1">
                {REQUIREMENTS.map((req) => (
                  <li key={req.label} className={`flex items-center gap-1.5 text-xs transition-colors ${req.test(password) ? "text-primary" : "text-muted-foreground"}`}>
                    <Check className={`h-3 w-3 shrink-0 ${req.test(password) ? "opacity-100" : "opacity-30"}`} />
                    {req.label}
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* Confirm Password */}
        <div>
          <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Confirm Password</label>
          <div className="relative mt-2">
            <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <input
              type={showPassword ? "text" : "password"}
              value={confirm}
              onChange={(e) => { setConfirm(e.target.value); setFieldErrors((p) => ({ ...p, confirm: "" })); }}
              autoComplete="new-password"
              className={`h-12 w-full rounded-full border bg-card pl-11 pr-4 text-sm outline-none transition focus:border-primary focus:ring-2 focus:ring-primary/20 ${fieldErrors.confirm ? "border-red-400" : "border-border"}`}
            />
          </div>
          {fieldErrors.confirm && <FieldError message={fieldErrors.confirm} />}
        </div>

        <button
          type="submit"
          disabled={loading}
          className="flex h-12 w-full items-center justify-center gap-2 rounded-full bg-primary text-sm font-semibold text-primary-foreground transition hover:bg-primary-glow disabled:opacity-60"
        >
          {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Updating…</> : "Reset Password"}
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        Remembered it?{" "}
        <Link href="/signin" className="font-semibold text-primary hover:underline">Back to Sign In</Link>
      </p>
    </>
  );
}

function FieldError({ message }) {
  return (
    <p className="mt-1.5 flex items-center gap-1.5 text-xs font-medium text-red-500">
      <AlertCircle className="h-3.5 w-3.5 shrink-0" />{message}
    </p>
  );
}
