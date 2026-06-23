"use client";

import Link from "next/link";
import { useRouter, usePathname } from "next/navigation";
import {
  User,
  Package,
  MapPin,
  Heart,
  Settings,
  Star,
  LogOut,
  Home as HomeIcon,
} from "lucide-react";

const NAV = [
  { to: "/account", icon: HomeIcon, label: "Dashboard", exact: true },
  { to: "/account/profile", icon: User, label: "Profile" },
  { to: "/account/orders", icon: Package, label: "Orders" },
  { to: "/account/addresses", icon: MapPin, label: "Addresses" },
  { to: "/account/wishlist", icon: Heart, label: "Wishlist" },
  { to: "/account/reviews", icon: Star, label: "Reviews" },
  { to: "/account/settings", icon: Settings, label: "Settings" },
];

export default function AccountLayout({ children }) {
  const path = usePathname();
  const router = useRouter();

  return (
    <div>
      <section className="border-b border-border bg-linear-to-br from-primary/5 via-background to-gold/10">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex items-center gap-4">
            <div className="grid h-16 w-16 place-items-center rounded-2xl gradient-primary text-2xl font-extrabold text-primary-foreground">
              A
            </div>

            <div>
              <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
                Hi, Amara
              </h1>

              <p className="text-sm text-muted-foreground">
                Member since June 2024 · Gold tier
              </p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside>
            <nav className="sticky top-32 space-y-1 rounded-2xl border border-border bg-card p-3">
              {NAV.map((n) => {
                const active = n.exact ? path === n.to : path.startsWith(n.to);

                return (
                  <Link
                    key={n.to}
                    href={n.to}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${
                      active
                        ? "bg-primary text-primary-foreground"
                        : "text-foreground hover:bg-secondary"
                    }`}
                  >
                    <n.icon className="h-4 w-4" />
                    {n.label}
                  </Link>
                );
              })}

              <button
                onClick={() => router.push("/signin")}
                className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ember hover:bg-ember/10"
              >
                <LogOut className="h-4 w-4" />
                Sign out
              </button>
            </nav>
          </aside>

          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
