"use client";

import Link from "next/link";
import {
  Truck,
  RotateCcw,
  CreditCard,
  Package,
  MessageCircle,
  HelpCircle,
} from "lucide-react";

import { PageHeader } from "@/components/store/PageHeader";

export default function HelpCenter() {
  const topics = [
    {
      icon: Package,
      title: "Orders & Tracking",
      description: "Check status, modify or cancel orders.",
      href: "/account/orders",
    },
    {
      icon: Truck,
      title: "Shipping & Delivery",
      description: "Rates, times, and supported regions.",
      href: "/shipping",
    },
    {
      icon: RotateCcw,
      title: "Returns & Refunds",
      description: "Our 14-day return policy explained.",
      href: "/returns",
    },
    {
      icon: CreditCard,
      title: "Payments",
      description: "Cards, mobile money, and cash on delivery.",
      href: "/faq",
    },
    {
      icon: HelpCircle,
      title: "Account Help",
      description: "Login, password, and profile issues.",
      href: "/account/settings",
    },
    {
      icon: MessageCircle,
      title: "Contact Support",
      description: "Reach our team 24/7.",
      href: "/contact",
    },
  ];

  return (
    <div>
      <PageHeader
        crumbs={[
          { label: "Home", href: "/" },
          { label: "Help Center" },
        ]}
        eyebrow="Support"
        title="How can we help?"
        subtitle="Browse the most common topics or reach our team directly."
      />

      <div className="mx-auto max-w-6xl px-4 py-12">
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {topics.map((topic) => {
            const Icon = topic.icon;

            return (
              <Link
                key={topic.title}
                href={topic.href}
                className="group rounded-3xl border border-border bg-card p-6 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-lg"
              >
                <div className="grid h-12 w-12 place-items-center rounded-2xl bg-primary/10 text-primary transition group-hover:bg-primary group-hover:text-primary-foreground">
                  <Icon className="h-6 w-6" />
                </div>

                <h2 className="mt-4 text-lg font-bold">
                  {topic.title}
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  {topic.description}
                </p>
              </Link>
            );
          })}
        </div>

        <div className="mt-12 rounded-3xl bg-primary p-10 text-center text-primary-foreground">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Still need help?
          </h2>

          <p className="mt-2 text-primary-foreground/80">
            Our support team is online 24/7 in English & Arabic.
          </p>

          <Link
            href="/contact"
            className="mt-5 inline-block rounded-full bg-white px-6 py-2.5 text-sm font-semibold text-primary"
          >
            Contact us
          </Link>
        </div>
      </div>
    </div>
  );
}