import Link from "next/link";
import {
  MapPin,
  Briefcase,
  Clock,
  HeartHandshake,
  ArrowRight,
} from "lucide-react";

import { PageHeader } from "@/components/store/PageHeader";

export default function CareersPage() {
  const openings = [
    {
      title: "Senior Frontend Engineer",
      dept: "Engineering",
      loc: "Remote · Addis Ababa",
      type: "Full-time",
    },
    {
      title: "Product Designer",
      dept: "Design",
      loc: "Remote",
      type: "Full-time",
    },
    {
      title: "Marketplace Operations Manager",
      dept: "Operations",
      loc: "Addis Ababa",
      type: "Full-time",
    },
    {
      title: "Seller Success Specialist",
      dept: "Growth",
      loc: "Remote",
      type: "Full-time",
    },
    {
      title: "Logistics Coordinator",
      dept: "Operations",
      loc: "Addis Ababa",
      type: "Full-time",
    },
    {
      title: "Customer Experience Lead",
      dept: "Support",
      loc: "Remote",
      type: "Full-time",
    },
  ];

  const perks = [
    {
      icon: MapPin,
      t: "Remote-first",
      d: "Work from anywhere with a flexible work environment.",
    },
    {
      icon: Briefcase,
      t: "Career Growth",
      d: "Learn fast and grow with a rapidly expanding marketplace.",
    },
    {
      icon: Clock,
      t: "Flexible Hours",
      d: "Results matter more than fixed schedules.",
    },
    {
      icon: HeartHandshake,
      t: "Supportive Team",
      d: "Collaborative culture focused on helping each other succeed.",
    },
  ];

  return (
    <div>
      <PageHeader
        crumbs={[{ label: "Home", href: "/" }, { label: "Careers" }]}
        eyebrow="Join the team"
        title="Build the future of commerce"
        subtitle="Join Merkato Store and help create better shopping experiences for customers and sellers."
      />

      <div className="mx-auto max-w-4xl space-y-14 px-4 py-12">
        {/* Values */}
        <div className="grid gap-5 sm:grid-cols-2">
          {[
            {
              t: "Move Fast",
              d: "Turn ideas into real solutions quickly.",
            },
            {
              t: "Customer First",
              d: "Every decision starts with improving customer experience.",
            },
            {
              t: "Keep Learning",
              d: "Continuous improvement is part of our culture.",
            },
            {
              t: "Build Trust",
              d: "Honesty, transparency, and accountability matter.",
            },
          ].map((item) => (
            <div
              key={item.t}
              className="rounded-3xl border border-border bg-card p-6"
            >
              <h3 className="font-display text-lg font-bold">{item.t}</h3>

              <p className="mt-1 text-sm text-muted-foreground">{item.d}</p>
            </div>
          ))}
        </div>

        {/* Perks */}
        <div>
          <h2 className="font-display text-2xl font-bold">
            Why Merkato Store?
          </h2>

          <div className="mt-6 grid gap-5 sm:grid-cols-2">
            {perks.map((perk) => (
              <div
                key={perk.t}
                className="flex items-start gap-4 rounded-2xl border border-border bg-card p-5"
              >
                <div className="grid h-10 w-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <perk.icon className="h-5 w-5" />
                </div>

                <div>
                  <h3 className="font-display text-base font-bold">{perk.t}</h3>

                  <p className="mt-0.5 text-sm text-muted-foreground">
                    {perk.d}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Open Roles */}
        <div>
          <h2 className="font-display text-2xl font-bold">Open Roles</h2>

          <div className="mt-6 space-y-3">
            {openings.map((job) => (
              <div
                key={job.title}
                className="flex flex-col gap-3 rounded-2xl border border-border bg-card p-5 sm:flex-row sm:items-center sm:justify-between"
              >
                <div>
                  <h3 className="font-display text-base font-bold">
                    {job.title}
                  </h3>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {job.dept} · {job.loc} · {job.type}
                  </p>
                </div>

                <Link
                  href={`/careers/apply?position=${encodeURIComponent(job.title)}`}
                  className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground transition hover:bg-primary/90"
                >
                  Apply <ArrowRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center">
          <h2 className="font-display text-2xl font-bold">
            Don't see your role?
          </h2>

          <p className="mt-2 text-muted-foreground">
            We're always looking for talented people who can help us build the
            future of ecommerce.
          </p>

          <Link
            href="/contact"
            className="mt-5 inline-block rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground"
          >
            Get in Touch
          </Link>
        </div>
      </div>
    </div>
  );
}

