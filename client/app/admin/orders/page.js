"use client";

import { useEffect, useState } from "react";

const BASE = process.env.NEXT_PUBLIC_API_URL;
const STATUSES = ["pending", "processing", "in_transit", "delivered", "cancelled"];

const STATUS_STYLES = {
  pending:    "bg-gold/15 text-gold-foreground",
  processing: "bg-primary/10 text-primary",
  in_transit: "bg-accent/10 text-accent",
  delivered:  "bg-green-100 text-green-700",
  cancelled:  "bg-ember/10 text-ember",
};

export default function AdminOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("merkato.token") : null;

  useEffect(() => {
    async function load() {
      try {
        const res = await fetch(`${BASE}/orders/all`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setOrders(data.orders ?? []);
      } catch {}
      setLoading(false);
    }
    load();
  }, [token]);

  async function updateStatus(id, status) {
    try {
      const res = await fetch(`${BASE}/orders/${id}/status`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: data.order?.status ?? status } : o)));
    } catch {}
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold">Orders</h1>
        <p className="text-sm text-muted-foreground">{orders.length} total orders</p>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-(--shadow-soft)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Order ID</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Customer</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Total</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Date</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">Loading…</td></tr>
              ) : orders.length === 0 ? (
                <tr><td colSpan={5} className="py-12 text-center text-muted-foreground">No orders yet</td></tr>
              ) : orders.map((o) => (
                <tr key={o.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3 font-mono text-xs font-semibold text-foreground">#{o.id}</td>
                  <td className="px-4 py-3 text-muted-foreground">{o.user_id}</td>
                  <td className="px-4 py-3 font-semibold text-accent">${Number(o.total).toFixed(2)}</td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(o.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <select
                      value={o.status}
                      onChange={(e) => updateStatus(o.id, e.target.value)}
                      className={`rounded-full border-0 px-3 py-1 text-xs font-bold outline-none ${STATUS_STYLES[o.status] ?? ""}`}
                    >
                      {STATUSES.map((s) => <option key={s} value={s}>{s.replace("_", " ")}</option>)}
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
