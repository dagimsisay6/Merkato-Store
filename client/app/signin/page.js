"use client";

import { Suspense, useState } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Eye, EyeOff, Mail, Lock, AlertCircle } from "lucide-react";
import { useAuth } from "@/lib/store-context";

export default function LoginPage() {
  return (
    <Suspense fallback={<LoginPageSkeleton />}>
      <LoginPageContent />
    </Suspense>
  );
}

function LoginPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { signin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState({});

  const clearField = (key) => setFieldErrors((p) => ({ ...p, [key]: "" }));

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    const errs = {};
    if (!email.trim()) errs.email = "Email is required.";
    if (!password) errs.password = "Password is required.";
    if (Object.keys(errs).length) {
      setFieldErrors(errs);
      return;
    }
    setFieldErrors({});
    setLoading(true);
    try {
      const user = await signin(email, password);
      const redirect = searchParams.get("redirect");
      router.push(
        redirect || (user.role === "admin" ? "/admin-dashboard" : "/account"),
      );
    } catch (err) {
      setError(err.message);
    }
    setLoading(false);
  };

  return (
    <div className="flex-1 max-w-6xl w-full mx-auto px-6 grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16 items-center py-12 lg:py-20">
      {/* Members Get More Box */}
      <div className="md:col-span-5 bg-linear-to-br from-[#005A36] via-[#01683E] to-[#7CB75D] rounded-[2rem] p-10 text-white flex flex-col justify-between shadow-xs min-h-[28rem] relative overflow-hidden">
        <div className="absolute inset-0 opacity-10 bg-[linear-gradient(to_right,#fff_1px,transparent_1px),linear-gradient(to_bottom,#fff_1px,transparent_1px)] bg-[size:24px_24px]" />
        <div className="relative z-10">
          <span className="inline-block bg-white/15 backdrop-blur-md text-xs font-bold tracking-wider px-3 py-1.5 rounded-full mb-6 uppercase text-white/90">
            MEMBERS GET MORE
          </span>
          <h2 className="text-3xl lg:text-[2rem] font-extrabold leading-[1.2] tracking-tight mb-8">
            Sign in to unlock app-only deals &amp; faster checkout.
          </h2>
        </div>
        <ul className="space-y-4 text-xs font-semibold opacity-95 relative z-10">
          {[
            "Saved addresses & payment methods",
            "Order tracking with live updates",
            "Loyalty points on every purchase",
            "Personalised recommendations",
          ].map((item) => (
            <li key={item} className="flex items-center gap-2.5">
              <span className="text-sm font-bold">✓</span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>

      {/* Sign In Form */}
      <div className="md:col-span-7 max-w-md w-full mx-auto md:ml-auto md:mr-0">
        <div className="mb-6">
          <h1 className="text-[2rem] lg:text-[2.25rem] font-black text-foreground tracking-tight mb-1.5">
            Welcome back
          </h1>
          <p className="text-muted-foreground text-sm font-medium">
            Sign in to your Merkato account.
          </p>
        </div>

        <form onSubmit={handleSubmit} noValidate className="space-y-5">
          {error && (
            <p className="rounded-xl bg-ember/10 px-4 py-3 text-sm font-medium text-ember">
              {error}
            </p>
          )}

          <div>
            <label className="block text-[10px] font-bold text-muted-foreground tracking-widest mb-2 uppercase">
              Email
            </label>
            <div className="relative">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type="email"
                value={email}
                onChange={(e) => {
                  setEmail(e.target.value);
                  clearField("email");
                }}
                className={`w-full pl-11 pr-4 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-card text-foreground placeholder:text-muted-foreground ${fieldErrors.email ? "border-red-400" : "border-border"}`}
                placeholder="you@email.com"
              />
            </div>
            {fieldErrors.email && <FieldError message={fieldErrors.email} />}
          </div>

          <div>
            <div className="flex justify-between items-center mb-2">
              <label className="block text-[10px] font-bold text-muted-foreground tracking-widest uppercase">
                Password
              </label>
              <Link
                href="/forgot-password"
                className="text-xs font-bold text-primary hover:underline"
              >
                Forgot?
              </Link>
            </div>
            <div className="relative">
              <Lock className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => {
                  setPassword(e.target.value);
                  clearField("password");
                }}
                className={`w-full pl-11 pr-11 py-3 border rounded-full focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary text-sm bg-card text-foreground placeholder:text-muted-foreground ${fieldErrors.password ? "border-red-400" : "border-border"}`}
                placeholder="Your password"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
              >
                {showPassword ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </button>
            </div>
            {fieldErrors.password && (
              <FieldError message={fieldErrors.password} />
            )}
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary text-primary-foreground py-3.5 rounded-full font-bold text-sm hover:bg-primary-glow transition-colors disabled:opacity-50"
          >
            {loading ? "Signing in..." : "Sign in"}
          </button>
        </form>

        <div className="mt-4">
          <button
            type="button"
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-card border border-border rounded-full hover:bg-secondary transition font-medium text-sm text-foreground"
          >
            <GoogleIcon />
            Sign in with Google
          </button>
        </div>

        <p className="text-center text-xs text-muted-foreground mt-8">
          New to Merkato?{" "}
          <Link
            href="/signup"
            className="font-bold text-primary hover:underline"
          >
            Create an account
          </Link>
        </p>
      </div>
    </div>
  );
}

function LoginPageSkeleton() {
  return (
    <div className="mx-auto flex w-full max-w-6xl flex-1 items-center px-6 py-12 lg:py-20">
      <div className="w-full animate-pulse rounded-[2rem] bg-muted/50 p-10" />
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

function GoogleIcon() {
  return (
    <svg className="h-4 w-4" viewBox="0 0 24 24">
      <path
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
        fill="#4285F4"
      />
      <path
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
        fill="#34A853"
      />
      <path
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
        fill="#FBBC05"
      />
      <path
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
        fill="#EA4335"
      />
    </svg>
  );
}
