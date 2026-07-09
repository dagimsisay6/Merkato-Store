"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
  ArrowLeft,
  User,
  Mail,
  Phone,
  MapPin,
  Briefcase,
  Upload,
  CheckCircle,
} from "lucide-react";
import { PageHeader } from "@/components/store/PageHeader";

const POSITIONS = [
  "Senior Frontend Engineer",
  "Product Designer",
  "Marketplace Operations Manager",
  "Seller Success Specialist",
  "Logistics Coordinator",
  "Customer Experience Lead",
];

export default function ApplyPage() {
  const searchParams = useSearchParams();
  const [submitted, setSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");

  const [form, setForm] = useState({
    position: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    location: "",
    linkedin: "",
    portfolio: "",
    experience: "",
    coverLetter: "",
    resume: null,
  });

  useEffect(() => {
    const pos = searchParams.get("position");
    if (pos && POSITIONS.includes(pos)) {
      setForm((f) => ({ ...f, position: pos }));
    }
  }, [searchParams]);

  const set = (field) => (e) =>
    setForm((f) => ({ ...f, [field]: e.target.value }));

  const handleResume = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setForm((f) => ({ ...f, resume: file }));
      setFileName(file.name);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    await new Promise((r) => setTimeout(r, 1000)); // simulate submission
    console.log("Application submitted:", form);
    setLoading(false);
    setSubmitted(true);
  };

  if (submitted) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center px-4">
        <div className="max-w-md w-full text-center">
          <div className="mx-auto grid h-20 w-20 place-items-center rounded-full bg-primary/10 text-primary">
            <CheckCircle className="h-10 w-10" />
          </div>
          <h1 className="mt-6 font-display text-3xl font-extrabold">
            Application Sent!
          </h1>
          <p className="mt-3 text-muted-foreground">
            Thanks for applying for{" "}
            <span className="font-semibold text-foreground">
              {form.position}
            </span>
            . Our team will review your application and get back to you within
            5–7 business days.
          </p>
          <div className="mt-8 flex flex-wrap justify-center gap-3">
            <Link
              href="/careers"
              className="rounded-full bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground"
            >
              Back to Careers
            </Link>
            <Link
              href="/"
              className="rounded-full border border-border px-6 py-2.5 text-sm font-semibold"
            >
              Go Home
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div>
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Careers", href: "/careers" },
          { label: "Apply" },
        ]}
        eyebrow="Join the team"
        title="Apply for a position"
        subtitle="Fill in the form below and we'll get back to you within 5–7 business days."
      />

      <div className="mx-auto max-w-2xl px-4 py-12">
        <Link
          href="/careers"
          className="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary mb-8"
        >
          <ArrowLeft className="h-4 w-4" /> Back to open roles
        </Link>

        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Position */}
          <Section title="Position" icon={Briefcase}>
            <Field label="Position Applying For">
              <select
                value={form.position}
                onChange={set("position")}
                required
                className="input-field"
              >
                <option value="" disabled>
                  Select a position
                </option>
                {POSITIONS.map((p) => (
                  <option key={p} value={p}>
                    {p}
                  </option>
                ))}
              </select>
            </Field>
          </Section>

          {/* Personal Info */}
          <Section title="Personal Information" icon={User}>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="First Name">
                <input
                  type="text"
                  value={form.firstName}
                  onChange={set("firstName")}
                  required
                  placeholder="Amara"
                  className="input-field"
                />
              </Field>
              <Field label="Last Name">
                <input
                  type="text"
                  value={form.lastName}
                  onChange={set("lastName")}
                  required
                  placeholder="Okafor"
                  className="input-field"
                />
              </Field>
            </div>
            <Field label="Email Address" icon={Mail}>
              <input
                type="email"
                value={form.email}
                onChange={set("email")}
                required
                placeholder="you@email.com"
                className="input-field"
              />
            </Field>
            <Field label="Phone Number" icon={Phone}>
              <input
                type="tel"
                value={form.phone}
                onChange={set("phone")}
                placeholder="+234 800 000 0000"
                className="input-field"
              />
            </Field>
            <Field label="Current Location" icon={MapPin}>
              <input
                type="text"
                value={form.location}
                onChange={set("location")}
                required
                placeholder="Lagos, Nigeria"
                className="input-field"
              />
            </Field>
          </Section>

          {/* Professional Info */}
          <Section title="Professional Details" icon={Briefcase}>
            <Field label="Years of Experience">
              <select
                value={form.experience}
                onChange={set("experience")}
                required
                className="input-field"
              >
                <option value="" disabled>
                  Select range
                </option>
                {[
                  "0–1 years",
                  "1–3 years",
                  "3–5 years",
                  "5–10 years",
                  "10+ years",
                ].map((e) => (
                  <option key={e} value={e}>
                    {e}
                  </option>
                ))}
              </select>
            </Field>
            <Field label="LinkedIn Profile (optional)">
              <input
                type="url"
                value={form.linkedin}
                onChange={set("linkedin")}
                placeholder="https://linkedin.com/in/yourname"
                className="input-field"
              />
            </Field>
            <Field label="Portfolio / Website (optional)">
              <input
                type="url"
                value={form.portfolio}
                onChange={set("portfolio")}
                placeholder="https://yourportfolio.com"
                className="input-field"
              />
            </Field>
          </Section>

          {/* Resume */}
          <Section title="Resume / CV" icon={Upload}>
            <Field label="Upload Resume (PDF, DOC — max 5MB)">
              <label className="flex cursor-pointer flex-col items-center justify-center gap-2 rounded-2xl border-2 border-dashed border-border bg-secondary/40 px-6 py-8 transition hover:border-primary hover:bg-primary/5">
                <Upload className="h-6 w-6 text-muted-foreground" />
                <span className="text-sm font-medium text-muted-foreground">
                  {fileName ? fileName : "Click to upload or drag and drop"}
                </span>
                <input
                  type="file"
                  accept=".pdf,.doc,.docx"
                  onChange={handleResume}
                  className="sr-only"
                  required
                />
              </label>
            </Field>
          </Section>

          {/* Cover Letter */}
          <Section title="Cover Letter" icon={Mail}>
            <Field label="Tell us why you'd be a great fit">
              <textarea
                value={form.coverLetter}
                onChange={set("coverLetter")}
                required
                rows={6}
                placeholder="Briefly describe your experience, why you're interested in Merkato Store, and what you'd bring to the team..."
                className="input-field resize-none"
              />
            </Field>
          </Section>

          <div className="flex flex-col gap-3 sm:flex-row sm:justify-between sm:items-center pt-2">
            <p className="text-xs text-muted-foreground">
              By submitting you agree to our{" "}
              <Link
                href="/privacy-policy"
                className="text-primary hover:underline"
              >
                Privacy Policy
              </Link>
              .
            </p>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex h-12 items-center justify-center rounded-full bg-primary px-10 text-sm font-bold text-primary-foreground transition hover:bg-primary-glow disabled:opacity-50"
            >
              {loading ? "Submitting..." : "Submit Application"}
            </button>
          </div>
        </form>
      </div>

      <style jsx>{`
        .input-field {
          width: 100%;
          border: 1px solid var(--border);
          border-radius: 0.75rem;
          padding: 0.75rem 1rem;
          font-size: 0.875rem;
          background: var(--card);
          color: var(--foreground);
          outline: none;
          transition:
            border-color 0.2s,
            box-shadow 0.2s;
        }
        .input-field:focus {
          border-color: var(--primary);
          box-shadow: 0 0 0 3px
            color-mix(in srgb, var(--primary) 20%, transparent);
        }
      `}</style>
    </div>
  );
}

function Section({ title, icon: Icon, children }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 space-y-4">
      <div className="flex items-center gap-2 border-b border-border pb-3">
        <div className="grid h-8 w-8 place-items-center rounded-lg bg-primary/10 text-primary">
          <Icon className="h-4 w-4" />
        </div>
        <h2 className="font-display text-base font-bold">{title}</h2>
      </div>
      {children}
    </div>
  );
}

function Field({ label, children }) {
  return (
    <div className="space-y-1.5">
      <label className="block text-[10px] font-bold uppercase tracking-widest text-muted-foreground">
        {label}
      </label>
      {children}
    </div>
  );
}

