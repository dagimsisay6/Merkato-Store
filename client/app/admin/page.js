"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Users, ShoppingBag, TrendingUp, ArrowRight } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL;

function StatCard({ icon: Icon, label, value, color }) {
  return (
    <div className="rounded-2xl border border-border bg-card p-6 shadow-(--shadow-soft)">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-sm font-medium text-muted-foreground">{label}</p>
          <p className="mt-1 font-display text-3xl font-extrabold text-foreground">{value ?? "—"}</p>
        </div>
        <div className={`grid h-12 w-12 place-items-center rounded-2xl ${color}`}>
          <Icon className="h-6 w-6 text-white" />
        </div>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [orders, setOrders] = useState([]);
  const token = typeof window !== "undefined" ? localStorage.getItem("merkato.token") : null;

  useEffect(() => {
    async function load() {
      try {
        const [pRes, uRes] = await Promise.all([
          fetch(`${BASE}/products?limit=1`, { cache: "no-store" }),
          fetch(`${BASE}/users`, { headers: { Authorization: `Bearer ${token}` } }),
        ]);
        const pData = await pRes.json();
        const uData = await uRes.json();
        setStats({ products: pData.total ?? 0, users: uData.total ?? 0 });
      } catch {}
    }
    load();
  }, [token]);

  return (
    <div>
      <div className="mb-8">
        <h1 className="font-display text-3xl font-extrabold text-foreground">Dashboard</h1>
        <p className="mt-1 text-sm text-muted-foreground">Welcome back, Admin</p>
      </div>

      <div className="grid gap-5 sm:grid-cols-2 xl:grid-cols-4">
        <StatCard icon={Package}     label="Total Products" value={stats?.products} color="bg-primary" />
        <StatCard icon={Users}       label="Total Users"    value={stats?.users}    color="bg-accent" />
        <StatCard icon={ShoppingBag} label="Total Orders"   value="—"               color="bg-gold" />
        <StatCard icon={TrendingUp}  label="Revenue"        value="—"               color="bg-ember" />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-3">
        {[
          { href: "/admin/products", label: "Manage Products", desc: "Add, edit or remove products", icon: Package },
          { href: "/admin/orders",   label: "Manage Orders",   desc: "View and update order status", icon: ShoppingBag },
          { href: "/admin/users",    label: "Manage Users",    desc: "View users and manage roles",  icon: Users },
        ].map((c) => (
          <Link
            key={c.href}
            href={c.href}
            className="group flex items-center justify-between rounded-2xl border border-border bg-card p-6 shadow-(--shadow-soft) transition hover:-translate-y-0.5 hover:border-primary/30 hover:shadow-(--shadow-elegant)"
          >
            <div className="flex items-center gap-4">
              <div className="grid h-11 w-11 place-items-center rounded-xl gradient-primary text-primary-foreground">
                <c.icon className="h-5 w-5" />
              </div>
              <div>
                <p className="font-semibold text-foreground">{c.label}</p>
                <p className="text-xs text-muted-foreground">{c.desc}</p>
              </div>
            </div>
            <ArrowRight className="h-4 w-4 text-muted-foreground transition group-hover:translate-x-1 group-hover:text-primary" />
          </Link>
        ))}
      </div>
    </div>
  );
}
