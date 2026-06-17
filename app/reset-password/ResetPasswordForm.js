"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { Lock, Eye, EyeOff } from "lucide-react";

export default function ResetPasswordForm() {
  const [show, setShow] = useState(false);
  const router = useRouter();

  const handleSubmit = (event) => {
    event.preventDefault();
    router.push("/login");
  };

  return (
    <div>
      <h1 className="font-display text-3xl font-extrabold sm:text-4xl">Set a new password</h1>
      <p className="mt-2 text-muted-foreground">Choose a strong password you haven't used before.</p>

      <form onSubmit={handleSubmit} className="mt-6 space-y-4">
        {['New password', 'Confirm password'].map((label) => (
          <div key={label}>
            <label className="text-xs font-bold uppercase tracking-widest text-muted-foreground">{label}</label>
            <div className="relative mt-1">
              <Lock className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <input
                required
                type={show ? 'text' : 'password'}
                className="h-12 w-full rounded-full border border-border bg-card pl-11 pr-12 text-sm outline-none focus:border-primary"
              />
              <button
                type="button"
                onClick={() => setShow((current) => !current)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground"
              >
                {show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        ))}

        <button
          type="submit"
          className="h-12 w-full rounded-full bg-primary text-sm font-semibold text-primary-foreground hover:bg-primary-glow"
        >
          Save & sign in
        </button>
      </form>

      <p className="mt-6 text-sm text-muted-foreground">
        Remembered it?{' '}
        <Link href="/login" className="font-semibold text-primary hover:underline">
          Back to sign in
        </Link>
      </p>
    </div>
  );
}
