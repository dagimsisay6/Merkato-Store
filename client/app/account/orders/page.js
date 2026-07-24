"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Package, Search } from "lucide-react";
import { fmt } from "@/lib/store-data";
import { useAuth } from "@/lib/store-context";
import { OrderRowSkeleton } from "@/components/ui/Skeleton";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const STATUS_STYLE = {
  delivered:  "bg-primary/10 text-primary",
  in_transit: "bg-gold/20 text-gold-foreground",
  processing: "bg-secondary text-foreground",
  pending:    "bg-secondary text-foreground",
  cancelled:  "bg-ember/10 text-ember",
};

export default function OrdersPage() {
  const { token, mounted } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState("all");
  const [q, setQ] = useState("");

  useEffect(() => {
    if (!mounted || !token) return;
    async function load() {
      try {
        const res = await fetch(`${BASE}/orders`, { headers: { Authorization: `Bearer ${token}` } });
        const data = await res.json();
        setOrders(data.orders ?? []);
      } catch {}
      setLoading(false);
    }
    load();
  }, [mounted, token]);

  const filtered = orders.filter((o) =>
    (filter === "all" || o.status === filter) &&
    String(o.id).includes(q)
  );

  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-display text-2xl font-bold">Your orders</h2>
        <p className="mt-1 text-sm text-muted-foreground">Track, return, or buy again.</p>
      </div>

      <div className="flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-48">
          <Search className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search order ID..."
            className="h-11 w-full rounded-full border border-border bg-card pl-11 pr-4 text-sm outline-none focus:border-primary" />
        </div>
        <div className="flex gap-1.5">
          {["all", "pending", "processing", "in_transit", "delivered", "cancelled"].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={`rounded-full px-3 py-2 text-xs font-semibold transition ${filter === s ? "bg-primary text-primary-foreground" : "bg-secondary text-foreground hover:bg-muted"}`}>
              {s.replace("_", " ")}
            </button>
          ))}
        </div>
      </div>

      {loading ? (
        <div className="space-y-3">
          {Array.from({ length: 4 }).map((_, i) => <OrderRowSkeleton key={i} />)}
        </div>
      ) : filtered.length === 0 ? (
        <div className="rounded-3xl border border-border bg-card p-12 text-center">
          <div className="mx-auto grid h-14 w-14 place-items-center rounded-full bg-primary/10 text-primary">
            <Package className="h-7 w-7" />
          </div>
          <h3 className="mt-4 font-display text-xl font-bold">No orders found</h3>
          <Link href="/products" className="mt-4 inline-block rounded-full bg-primary px-5 py-2 text-sm font-semibold text-primary-foreground">
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-3">
          {filtered.map((o) => (
            <div key={o.id} className="flex flex-wrap items-center justify-between gap-4 rounded-2xl border border-border bg-card p-5">
              <div className="flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-xl bg-secondary">
                  <Package className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="font-display font-bold">#{o.id}</p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(o.created_at).toLocaleDateString()} · {o.items?.length ?? 0} items
                    {o.tracking_number && ` · ${o.tracking_number}`}
                  </p>
                </div>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${STATUS_STYLE[o.status] ?? ""}`}>
                {o.status}
              </span>
              <p className="font-display text-lg font-bold">{fmt(Number(o.total))}</p>
              <Link href={`/account/orders/${o.id}`}
                className="rounded-full bg-primary px-5 py-2 text-xs font-semibold text-primary-foreground hover:bg-primary-glow">
                View details
              </Link>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
