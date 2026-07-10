"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  LogOut,
  Menu,
  X,
} from "lucide-react";
import { useState } from "react";
import { useAuth } from "@/lib/store-context";

const NAV = [
  { href: "/admin-dashboard",          icon: LayoutDashboard, label: "Dashboard", exact: true },
  { href: "/admin-dashboard/products", icon: Package,         label: "Products" },
  { href: "/admin-dashboard/orders",   icon: ShoppingBag,     label: "Orders" },
  { href: "/admin-dashboard/users",    icon: Users,           label: "Users" },
];

export default function AdminLayout({ children }) {
  const path = usePathname();
  const router = useRouter();
  const { signout } = useAuth();
  const [open, setOpen] = useState(false);

  return (
    <div className="min-h-screen bg-secondary/40">
      {/* Top bar */}
      <header className="sticky top-0 z-50 flex h-14 items-center justify-between border-b border-border bg-card px-4 shadow-(--shadow-soft)">
        <div className="flex items-center gap-3">
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-secondary lg:hidden"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
          <Link href="/admin-dashboard" className="flex items-center gap-2">
            <div className="grid h-8 w-8 place-items-center rounded-lg gradient-primary">
              <span className="font-display text-sm font-extrabold text-primary-foreground">M</span>
            </div>
            <span className="font-display text-base font-bold text-foreground">Admin</span>
          </Link>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/" className="rounded-full px-3 py-1.5 text-xs font-medium text-muted-foreground hover:bg-secondary">
            ← Store
          </Link>
          <button
            onClick={() => { signout(); router.push("/signin"); }}
            className="inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-medium text-ember hover:bg-ember/10"
          >
            <LogOut className="h-3.5 w-3.5" /> Sign out
          </button>
        </div>
      </header>

      <div className="flex">
        {/* Sidebar */}
        <aside className={`fixed inset-y-14 left-0 z-40 w-56 border-r border-border bg-card transition-transform lg:sticky lg:top-14 lg:translate-x-0 lg:self-start ${open ? "translate-x-0" : "-translate-x-full"}`}>
          <nav className="space-y-1 p-3">
            {NAV.map((n) => {
              const active = n.exact ? path === n.href : path.startsWith(n.href);
              return (
                <Link
                  key={n.href}
                  href={n.href}
                  onClick={() => setOpen(false)}
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
          </nav>
        </aside>

        {/* Overlay for mobile */}
        {open && (
          <div
            className="fixed inset-0 z-30 bg-black/40 lg:hidden"
            onClick={() => setOpen(false)}
          />
        )}

        <main className="min-h-[calc(100vh-3.5rem)] flex-1 p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
