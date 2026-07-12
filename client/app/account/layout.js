"use client";

import { useEffect } from "react";
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
import { useAuth } from "@/lib/store-context";
import Avatar from "@/components/ui/Avatar";

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
  const { user, signout, isLoggedIn, isAdmin, mounted } = useAuth();

  useEffect(() => {
    if (!mounted) return;
    if (!isLoggedIn) router.replace(`/signin?redirect=${encodeURIComponent(path)}`);
    else if (isAdmin) router.replace("/admin-dashboard");
  }, [mounted, isLoggedIn, isAdmin]);

  if (!mounted) return null;
  if (!isLoggedIn || isAdmin) return null;

  function handleSignout() {
    signout();
    router.push("/signin");
  }

  return (
    <div>
      <section className="border-b border-border bg-linear-to-br from-primary/5 via-background to-gold/10">
        <div className="mx-auto max-w-7xl px-4 py-10">
          <div className="flex items-center gap-4">
            <Avatar
              src={user?.avatar}
              name={user?.name}
              className="h-16 w-16 rounded-2xl"
              textClassName="text-2xl"
            />
            <div>
              <h1 className="font-display text-2xl font-extrabold sm:text-3xl">
                Hi, {user?.name ?? "there"}
              </h1>
              <p className="text-sm text-muted-foreground">{user?.email}</p>
            </div>
          </div>
        </div>
      </section>

      <div className="mx-auto max-w-7xl px-4 py-10">
        <nav className="no-scrollbar mb-6 flex gap-1 overflow-x-auto rounded-2xl border border-border bg-card p-1.5 lg:hidden">
          {NAV.map((n) => {
            const active = n.exact ? path === n.to : path.startsWith(n.to);
            return (
              <Link
                key={n.to}
                href={n.to}
                className={`inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold transition ${active ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:bg-secondary hover:text-foreground"}`}
              >
                <n.icon className="h-3.5 w-3.5" />
                {n.label}
              </Link>
            );
          })}
          <button
            onClick={handleSignout}
            className="inline-flex shrink-0 items-center gap-1.5 rounded-xl px-3 py-2 text-xs font-semibold text-ember hover:bg-ember/10"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </nav>

        <div className="grid gap-8 lg:grid-cols-[260px_1fr]">
          <aside className="hidden lg:block">
            <nav className="sticky top-32 space-y-1 rounded-2xl border border-border bg-card p-3">
              {NAV.map((n) => {
                const active = n.exact ? path === n.to : path.startsWith(n.to);
                return (
                  <Link
                    key={n.to}
                    href={n.to}
                    className={`flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium transition ${active ? "bg-primary text-primary-foreground" : "text-foreground hover:bg-secondary"}`}
                  >
                    <n.icon className="h-4 w-4" />
                    {n.label}
                  </Link>
                );
              })}
              <button
                onClick={handleSignout}
                className="mt-2 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ember hover:bg-ember/10"
              >
                <LogOut className="h-4 w-4" /> Sign out
              </button>
            </nav>
          </aside>
          <div>{children}</div>
        </div>
      </div>
    </div>
  );
}
