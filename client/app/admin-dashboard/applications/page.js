"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Briefcase, RefreshCw, Inbox } from "lucide-react";
import { getAdminApplications } from "@/lib/api";

const FILTERS = ["all", "new", "reviewing", "shortlisted", "rejected", "hired", "archived"];

const STATUS_STYLES = {
  new:         "bg-primary/10 text-primary",
  reviewing:   "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  shortlisted: "bg-accent/10 text-accent",
  rejected:    "bg-ember/10 text-ember",
  hired:       "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  archived:    "bg-secondary text-muted-foreground",
};

export default function AdminApplications() {
  const [apps, setApps]               = useState([]);
  const [total, setTotal]             = useState(0);
  const [newCount, setNewCount]       = useState(0);
  const [loading, setLoading]         = useState(true);
  const [filter, setFilter]           = useState("all");
  const [search, setSearch]           = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage]               = useState(1);
  const LIMIT = 20;

  const load = useCallback(async () => {
    const token = localStorage.getItem("merkato.token");
    setLoading(true);
    try {
      const data = await getAdminApplications({ page, limit: LIMIT, status: filter, search }, token);
      setApps(data?.applications ?? []);
      setTotal(data?.total ?? 0);
      setNewCount(data?.newCount ?? 0);
    } catch {}
    setLoading(false);
  }, [page, filter, search]);

  useEffect(() => { load(); }, [load]);

  function handleSearch(e) {
    e.preventDefault();
    setSearch(searchInput);
    setPage(1);
  }

  const totalPages = Math.ceil(total / LIMIT);

  return (
    <div>
      {/* Header */}
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-display text-2xl font-extrabold text-foreground flex items-center gap-2">
            Applications
            {newCount > 0 && (
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground">
                {newCount} new
              </span>
            )}
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary px-2 text-xs font-semibold text-muted-foreground">
              {total} total
            </span>
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">Review and respond to job applications.</p>
        </div>
        <button onClick={load} className="inline-flex items-center gap-1.5 rounded-full border border-border px-3 py-1.5 text-xs font-medium hover:bg-secondary">
          <RefreshCw className="h-3.5 w-3.5" /> Refresh
        </button>
      </div>

      {/* Search */}
      <form onSubmit={handleSearch} className="mb-4 flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search by name, email or position…"
            className="w-full rounded-full border border-border bg-card pl-9 pr-4 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <button type="submit" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow">Search</button>
        {search && (
          <button type="button" onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
            className="rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">Clear</button>
        )}
      </form>

      {/* Filter tabs */}
      <div className="mb-4 flex flex-wrap gap-2">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => { setFilter(f); setPage(1); }}
            className={`rounded-full px-4 py-1.5 text-xs font-semibold capitalize transition ${
              filter === f ? "bg-primary text-primary-foreground" : "border border-border bg-card hover:bg-secondary"
            }`}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-(--shadow-soft)">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground">Loading…</div>
        ) : apps.length === 0 ? (
          <div className="py-16 text-center">
            <Inbox className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No applications found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {apps.map((a) => (
              <Link
                key={a.id}
                href={`/admin-dashboard/applications/${a.id}`}
                className={`flex items-start gap-4 px-5 py-4 transition hover:bg-secondary/40 ${a.status === "new" ? "bg-primary/[0.03]" : ""}`}
              >
                <div className="mt-0.5 grid h-9 w-9 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                  <Briefcase className="h-4 w-4" />
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className={`text-sm ${a.status === "new" ? "font-bold text-foreground" : "font-medium text-foreground"}`}>
                      {a.first_name} {a.last_name}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">{a.email}</span>
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[a.status] ?? ""}`}>
                        {a.status}
                      </span>
                      <span className="text-xs text-muted-foreground">{new Date(a.created_at).toLocaleDateString()}</span>
                    </div>
                  </div>
                  <p className={`mt-0.5 text-sm ${a.status === "new" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {a.position}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">{a.location} · {a.experience}</p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="mt-4 flex items-center justify-between text-sm">
          <p className="text-muted-foreground">Page {page} of {totalPages}</p>
          <div className="flex gap-2">
            <button disabled={page === 1} onClick={() => setPage((p) => p - 1)}
              className="rounded-full border border-border px-4 py-1.5 text-xs font-medium hover:bg-secondary disabled:opacity-40">Previous</button>
            <button disabled={page === totalPages} onClick={() => setPage((p) => p + 1)}
              className="rounded-full border border-border px-4 py-1.5 text-xs font-medium hover:bg-secondary disabled:opacity-40">Next</button>
          </div>
        </div>
      )}
    </div>
  );
}
