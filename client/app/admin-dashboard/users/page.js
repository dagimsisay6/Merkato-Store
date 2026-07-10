"use client";

import { useEffect, useState } from "react";
import { Search, ShieldCheck, ShieldOff } from "lucide-react";

const BASE = process.env.NEXT_PUBLIC_API_URL;

const ROLE_STYLES = {
  admin:    "bg-primary/10 text-primary",
  user:     "bg-secondary text-foreground",
  disabled: "bg-ember/10 text-ember",
};

export default function AdminUsers() {
  const [users, setUsers] = useState([]);
  const [total, setTotal] = useState(0);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const [q, setQ] = useState("");
  const [loading, setLoading] = useState(true);
  const token = typeof window !== "undefined" ? localStorage.getItem("merkato.token") : null;

  useEffect(() => {
    async function load() {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit: 20 });
        if (search) params.set("search", search);
        const res = await fetch(`${BASE}/users?${params}`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        const data = await res.json();
        setUsers(data.users ?? []);
        setTotal(data.total ?? 0);
      } catch {}
      setLoading(false);
    }
    load();
  }, [page, search, token]);

  async function updateRole(id, role) {
    try {
      const res = await fetch(`${BASE}/users/${id}/role`, {
        method: "PUT",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${token}` },
        body: JSON.stringify({ role }),
      });
      const data = await res.json();
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: data.user?.role ?? role } : u)));
    } catch {}
  }

  async function disableUser(id) {
    if (!confirm("Disable this user?")) return;
    try {
      await fetch(`${BASE}/users/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUsers((prev) => prev.map((u) => (u.id === id ? { ...u, role: "disabled" } : u)));
    } catch {}
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="font-display text-2xl font-extrabold">Users</h1>
        <p className="text-sm text-muted-foreground">{total} total users</p>
      </div>

      {/* Search */}
      <div className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            onKeyDown={(e) => { if (e.key === "Enter") { setSearch(q); setPage(1); } }}
            placeholder="Search by name or email…"
            className="h-10 w-full rounded-full border border-border bg-card pl-9 pr-4 text-sm outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
          />
        </div>
        <button
          onClick={() => { setSearch(q); setPage(1); }}
          className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow"
        >
          Search
        </button>
      </div>

      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-(--shadow-soft)">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="border-b border-border bg-secondary/50">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">User</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Joined</th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">Role</th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {loading ? (
                <tr><td colSpan={4} className="py-12 text-center text-muted-foreground">Loading…</td></tr>
              ) : users.length === 0 ? (
                <tr><td colSpan={4} className="py-12 text-center text-muted-foreground">No users found</td></tr>
              ) : users.map((u) => (
                <tr key={u.id} className="hover:bg-secondary/30">
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3">
                      <div className="grid h-9 w-9 place-items-center rounded-full gradient-primary text-sm font-bold text-primary-foreground">
                        {u.name?.[0]?.toUpperCase()}
                      </div>
                      <div>
                        <p className="font-medium text-foreground">{u.name}</p>
                        <p className="text-xs text-muted-foreground">{u.email}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</td>
                  <td className="px-4 py-3">
                    <span className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${ROLE_STYLES[u.role] ?? ""}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-2">
                      {u.role !== "admin" && u.role !== "disabled" && (
                        <button
                          onClick={() => updateRole(u.id, "admin")}
                          title="Make admin"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-border text-primary hover:bg-primary/10"
                        >
                          <ShieldCheck className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {u.role === "admin" && (
                        <button
                          onClick={() => updateRole(u.id, "user")}
                          title="Remove admin"
                          className="grid h-8 w-8 place-items-center rounded-lg border border-border text-muted-foreground hover:bg-secondary"
                        >
                          <ShieldOff className="h-3.5 w-3.5" />
                        </button>
                      )}
                      {u.role !== "disabled" && (
                        <button
                          onClick={() => disableUser(u.id)}
                          title="Disable user"
                          className="rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-ember hover:bg-ember/10"
                        >
                          Disable
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {total > 20 && (
          <div className="flex items-center justify-between border-t border-border px-4 py-3">
            <p className="text-xs text-muted-foreground">Page {page} of {Math.ceil(total / 20)}</p>
            <div className="flex gap-2">
              <button disabled={page === 1} onClick={() => setPage((p) => p - 1)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium disabled:opacity-40 hover:bg-secondary">Prev</button>
              <button disabled={page >= Math.ceil(total / 20)} onClick={() => setPage((p) => p + 1)} className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium disabled:opacity-40 hover:bg-secondary">Next</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
