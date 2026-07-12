"use client";

import { Suspense, useEffect, useRef, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { AlertCircle, Mail } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export default function VerifyOtpPage() {
  return (
    <Suspense>
      <VerifyOtp />
    </Suspense>
  );
}

function VerifyOtp() {
  const router = useRouter();
  const params = useSearchParams();
  const email = params.get("email") || "";

  const [digits, setDigits] = useState(["", "", "", "", "", ""]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);
  const inputs = useRef([]);

  // Start resend cooldown on mount
  useEffect(() => {
    startCooldown();
  }, []);

  function startCooldown() {
    setResendCooldown(60);
    const id = setInterval(() => {
      setResendCooldown((s) => {
        if (s <= 1) { clearInterval(id); return 0; }
        return s - 1;
      });
    }, 1000);
  }

  function handleChange(i, val) {
    if (!/^\d?$/.test(val)) return;
    const next = [...digits];
    next[i] = val;
    setDigits(next);
    setError("");
    if (val && i < 5) inputs.current[i + 1]?.focus();
  }

  function handleKeyDown(i, e) {
    if (e.key === "Backspace" && !digits[i] && i > 0) {
      inputs.current[i - 1]?.focus();
    }
  }

  function handlePaste(e) {
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pasted.length === 6) {
      setDigits(pasted.split(""));
      inputs.current[5]?.focus();
    }
  }

  async function handleSubmit(e) {
    e.preventDefault();
    const otp = digits.join("");
    if (otp.length < 6) { setError("Please enter the 6-digit code."); return; }
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`${BASE}/auth/verify-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, otp }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || "Verification failed.");
      router.push("/signin?verified=1");
    } catch (err) {
      setError(err.message);
      setDigits(["", "", "", "", "", ""]);
      inputs.current[0]?.focus();
    }
    setLoading(false);
  }

  async function handleResend() {
    if (resendCooldown > 0) return;
    try {
      await fetch(`${BASE}/auth/resend-otp`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      startCooldown();
      setError("");
    } catch {
      setError("Failed to resend code. Please try again.");
    }
  }

  return (
    <div className="flex-1 w-full flex items-center justify-center py-12 lg:py-20 px-6">
      <div className="max-w-md w-full mx-auto text-center">

        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
          <Mail className="h-7 w-7 text-primary" />
        </div>

        <h1 className="text-[2rem] font-black text-foreground tracking-tight mb-2">
          Check your email
        </h1>
        <p className="text-muted-foreground text-sm font-medium mb-1">
          We sent a 6-digit code to
        </p>
        <p className="font-bold text-foreground text-sm mb-8">{email}</p>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <p className="rounded-xl bg-ember/10 px-4 py-3 text-sm font-medium text-ember flex items-center gap-2">
              <AlertCircle className="h-4 w-4 shrink-0" />
              {error}
            </p>
          )}

          <div className="flex justify-center gap-3" onPaste={handlePaste}>
            {digits.map((d, i) => (
              <input
                key={i}
                ref={(el) => (inputs.current[i] = el)}
                type="text"
                inputMode="numeric"
                maxLength={1}
                value={d}
                onChange={(e) => handleChange(i, e.target.value)}
                onKeyDown={(e) => handleKeyDown(i, e)}
                className="w-12 h-14 text-center text-xl font-bold border rounded-2xl focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary bg-card text-foreground border-border"
              />
            ))}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-bold text-sm hover:bg-primary-glow transition-colors disabled:opacity-50"
          >
            {loading ? "Verifying..." : "Verify email"}
          </button>
        </form>

        <p className="mt-6 text-sm text-muted-foreground">
          Didn&apos;t receive it?{" "}
          {resendCooldown > 0 ? (
            <span className="font-semibold text-muted-foreground">Resend in {resendCooldown}s</span>
          ) : (
            <button onClick={handleResend} className="font-bold text-primary hover:underline">
              Resend code
            </button>
          )}
        </p>

      </div>
    </div>
  );
}
