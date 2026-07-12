"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingBag,
  Users,
  MessageSquare,
  Briefcase,
  LogOut,
  Menu,
  X,
  Store,
  ChevronDown,
} from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "@/lib/store-context";
import { getUnreadCount, getNewApplicationsCount } from "@/lib/api";
import { NotificationBell } from "@/components/store/NotificationBell";

const NAV = [
  { href: "/admin-dashboard",          icon: LayoutDashboard, label: "Dashboard",  exact: true },
  { href: "/admin-dashboard/products", icon: Package,         label: "Products" },
  { href: "/admin-dashboard/orders",   icon: ShoppingBag,     label: "Orders" },
  { href: "/admin-dashboard/users",    icon: Users,           label: "Users" },
  { href: "/admin-dashboard/messages",     icon: MessageSquare, label: "Messages" },
  { href: "/admin-dashboard/applications",  icon: Briefcase,     label: "Applications" },
];

export default function AdminLayout({ children }) {
  const path     = usePathname();
  const router   = useRouter();
  const { signout, user, mounted, isAdmin, isLoggedIn } = useAuth();
  const [open,      setOpen]      = useState(false);
  const [unread,    setUnread]    = useState(0);
  const [newApps,   setNewApps]   = useState(0);
  const [userMenu,  setUserMenu]  = useState(false);
  const userMenuRef = useRef(null);

  // Guard: redirect non-admins
  useEffect(() => {
    if (!mounted) return;
    if (!isLoggedIn) router.replace(`/signin?redirect=${encodeURIComponent(path)}`);
    else if (!isAdmin) router.replace("/");
  }, [mounted, isLoggedIn, isAdmin]);

  useEffect(() => {
    if (!userMenu) return;
    const handler = (e) => {
      if (userMenuRef.current && !userMenuRef.current.contains(e.target))
        setUserMenu(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [userMenu]);

  // close drawer on route change
  useEffect(() => { setOpen(false); }, [path]);

  useEffect(() => {
    const fetch = () => {
      const t = localStorage.getItem("merkato.token");
      if (!t) return;
      getUnreadCount(t).then((d) => setUnread(d?.count ?? 0)).catch(() => {});
      getNewApplicationsCount(t).then((d) => setNewApps(d?.count ?? 0)).catch(() => {});
    };
    fetch();
    const id = setInterval(fetch, 30000);
    return () => clearInterval(id);
  }, []);

  if (!mounted || !isLoggedIn || !isAdmin) return null;

  const Sidebar = ({ onNav }) => (
    <div className="flex h-full flex-col">
      {/* Logo */}
      <div className="flex h-14 shrink-0 items-center gap-2.5 border-b border-border px-4">
        <div className="grid h-8 w-8 shrink-0 place-items-center rounded-lg gradient-primary">
          <span className="font-display text-sm font-extrabold text-primary-foreground">M</span>
        </div>
        <span className="font-display text-base font-bold text-foreground">Merkato Admin</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 overflow-y-auto p-3 space-y-0.5">
        {NAV.map((n) => {
          const active = n.exact ? path === n.href : path.startsWith(n.href);
          return (
            <Link
              key={n.href}
              href={n.href}
              onClick={onNav}
              className={`flex items-center justify-between rounded-xl px-3 py-2.5 text-sm font-medium transition-colors ${
                active
                  ? "bg-primary text-primary-foreground"
                  : "text-foreground hover:bg-secondary"
              }`}
            >
              <span className="flex items-center gap-3">
                <n.icon className="h-4 w-4 shrink-0" />
                {n.label}
              </span>
              {n.label === "Messages" && unread > 0 && (
                <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                  active ? "bg-white/20 text-white" : "bg-primary text-primary-foreground"
                }`}>
                  {unread > 99 ? "99+" : unread}
                </span>
              )}
              {n.label === "Applications" && newApps > 0 && (
                <span className={`inline-flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[11px] font-bold ${
                  active ? "bg-white/20 text-white" : "bg-accent text-accent-foreground"
                }`}>
                  {newApps > 99 ? "99+" : newApps}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="shrink-0 border-t border-border p-3 space-y-1">
        <Link
          href="/"
          onClick={onNav}
          className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-muted-foreground hover:bg-secondary transition-colors"
        >
          <Store className="h-4 w-4 shrink-0" />
          Back to Store
        </Link>
        <button
          onClick={() => { signout(); router.push("/signin"); }}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-ember hover:bg-ember/10 transition-colors"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          Sign out
        </button>
        {mounted && user && (
          <div className="flex items-center gap-2.5 rounded-xl px-3 py-2.5">
            <div className="grid h-7 w-7 shrink-0 place-items-center rounded-full gradient-primary text-[11px] font-extrabold text-primary-foreground">
              {user.name?.[0]?.toUpperCase()}
            </div>
            <div className="min-w-0">
              <p className="truncate text-xs font-semibold text-foreground">{user.name}</p>
              <p className="truncate text-[10px] text-muted-foreground">{user.email}</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );

  return (
    <div className="flex h-screen overflow-hidden bg-secondary/40">

      {/* ── Desktop sidebar (fixed, full height) ── */}
      <aside className="hidden lg:flex lg:w-56 lg:shrink-0 flex-col border-r border-border bg-card">
        <Sidebar onNav={() => {}} />
      </aside>

      {/* ── Mobile drawer backdrop ── */}
      {open && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setOpen(false)}
        />
      )}

      {/* ── Mobile drawer ── */}
      <aside className={`fixed inset-y-0 left-0 z-50 w-64 flex-col border-r border-border bg-card transition-transform duration-300 lg:hidden ${
        open ? "translate-x-0" : "-translate-x-full"
      } flex`}>
        <Sidebar onNav={() => setOpen(false)} />
      </aside>

      {/* ── Main column ── */}
      <div className="flex flex-1 flex-col overflow-hidden">

        {/* Top bar */}
        <header className="flex h-14 shrink-0 items-center justify-between border-b border-border bg-card px-4 shadow-(--shadow-soft)">
          <button
            onClick={() => setOpen((v) => !v)}
            className="grid h-9 w-9 place-items-center rounded-lg hover:bg-secondary lg:hidden"
            aria-label="Toggle menu"
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>

          {/* Mobile logo (hidden on desktop since sidebar has it) */}
          <Link href="/admin-dashboard" className="flex items-center gap-2 lg:hidden">
            <div className="grid h-7 w-7 place-items-center rounded-lg gradient-primary">
              <span className="font-display text-xs font-extrabold text-primary-foreground">M</span>
            </div>
            <span className="font-display text-sm font-bold text-foreground">Admin</span>
          </Link>

          <div className="ml-auto flex items-center gap-2">
            <NotificationBell />
            {mounted && user && (
              <div className="relative" ref={userMenuRef}>
                <button
                  onClick={() => setUserMenu((v) => !v)}
                  title={user.name}
                  className="flex items-center gap-2 rounded-full border border-border px-2.5 py-1.5 hover:bg-secondary transition-colors"
                >
                  <div className="grid h-6 w-6 place-items-center rounded-full gradient-primary text-[10px] font-extrabold text-primary-foreground">
                    {user.name[0].toUpperCase()}
                  </div>
                  <span className="hidden sm:block text-xs font-semibold text-foreground max-w-24 truncate">{user.name}</span>
                  <ChevronDown className="h-3.5 w-3.5 text-muted-foreground" />
                </button>

                {userMenu && (
                  <div className="absolute right-0 top-full z-50 mt-2 w-56 overflow-hidden rounded-2xl border border-border bg-card shadow-(--shadow-elegant)">
                    <div className="border-b border-border px-4 py-3">
                      <p className="text-sm font-bold text-foreground truncate">{user.name}</p>
                      <p className="text-xs text-muted-foreground truncate">{user.email}</p>
                      <span className="mt-1 inline-block rounded-full bg-primary/10 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-primary">Admin</span>
                    </div>
                    <div className="border-t border-border">
                      <button
                        onClick={() => { signout(); router.push("/signin"); }}
                        className="flex w-full items-center gap-2.5 px-4 py-2.5 text-sm font-medium text-ember hover:bg-ember/10 transition-colors"
                      >
                        <LogOut className="h-4 w-4" /> Sign out
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
