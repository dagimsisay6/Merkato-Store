"use client";

import { useEffect, useState, useCallback } from "react";
import Link from "next/link";
import { Search, Mail, MailOpen, RefreshCw, Inbox } from "lucide-react";
import { getAdminMessages } from "@/lib/api";

const FILTERS = ["all", "unread", "read", "replied", "resolved", "archived"];

const STATUS_STYLES = {
  unread:   "bg-primary/10 text-primary",
  read:     "bg-secondary text-muted-foreground",
  replied:  "bg-accent/10 text-accent",
  resolved: "bg-green-100 text-green-700",
  archived: "bg-ember/10 text-ember",
};

export default function AdminMessages() {
  const [messages, setMessages]   = useState([]);
  const [total, setTotal]         = useState(0);
  const [unread, setUnread]       = useState(0);
  const [loading, setLoading]     = useState(true);
  const [filter, setFilter]       = useState("all");
  const [search, setSearch]       = useState("");
  const [searchInput, setSearchInput] = useState("");
  const [page, setPage]           = useState(1);
  const LIMIT = 20;

  const load = useCallback(async () => {
    const token = localStorage.getItem("merkato.token");
    setLoading(true);
    try {
      const data = await getAdminMessages({ page, limit: LIMIT, status: filter, search }, token);
      setMessages(data?.messages ?? []);
      setTotal(data?.total ?? 0);
      setUnread(data?.unread ?? 0);
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
            Messages
            {unread > 0 && (
              <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-primary px-2 text-xs font-bold text-primary-foreground">
                {unread} unread
              </span>
            )}
            <span className="inline-flex h-6 min-w-6 items-center justify-center rounded-full bg-secondary px-2 text-xs font-semibold text-muted-foreground">
              {total} total
            </span>
          </h1>
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
            placeholder="Search by name, email or subject…"
            className="w-full rounded-full border border-border bg-card pl-9 pr-4 py-2 text-sm outline-none focus:border-primary"
          />
        </div>
        <button type="submit" className="rounded-full bg-primary px-4 py-2 text-sm font-semibold text-primary-foreground hover:bg-primary-glow">
          Search
        </button>
        {search && (
          <button type="button" onClick={() => { setSearch(""); setSearchInput(""); setPage(1); }}
            className="rounded-full border border-border px-4 py-2 text-sm hover:bg-secondary">
            Clear
          </button>
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

      {/* Table */}
      <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-(--shadow-soft)">
        {loading ? (
          <div className="py-16 text-center text-muted-foreground">Loading…</div>
        ) : messages.length === 0 ? (
          <div className="py-16 text-center">
            <Inbox className="mx-auto h-10 w-10 text-muted-foreground/40 mb-3" />
            <p className="text-muted-foreground">No messages found</p>
          </div>
        ) : (
          <div className="divide-y divide-border">
            {messages.map((m) => (
              <Link
                key={m.id}
                href={`/admin-dashboard/messages/${m.id}`}
                className={`flex items-start gap-4 px-5 py-4 transition hover:bg-secondary/40 ${
                  m.status === "unread" ? "bg-primary/[0.03]" : ""
                }`}
              >
                <div className="mt-0.5 shrink-0 text-muted-foreground">
                  {m.status === "unread"
                    ? <Mail className="h-4 w-4 text-primary" />
                    : <MailOpen className="h-4 w-4" />
                  }
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className={`text-sm ${m.status === "unread" ? "font-bold text-foreground" : "font-medium text-foreground"}`}>
                      {m.name}
                      <span className="ml-2 text-xs font-normal text-muted-foreground">{m.email}</span>
                    </p>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[m.status] ?? ""}`}>
                        {m.status}
                      </span>
                      <span className="text-xs text-muted-foreground">
                        {new Date(m.created_at).toLocaleDateString()}
                      </span>
                    </div>
                  </div>
                  <p className={`mt-0.5 text-sm ${m.status === "unread" ? "font-semibold text-foreground" : "text-muted-foreground"}`}>
                    {m.subject}
                  </p>
                  <p className="mt-0.5 truncate text-xs text-muted-foreground">{m.message}</p>
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
            <button
              disabled={page === 1}
              onClick={() => setPage((p) => p - 1)}
              className="rounded-full border border-border px-4 py-1.5 text-xs font-medium hover:bg-secondary disabled:opacity-40"
            >
              Previous
            </button>
            <button
              disabled={page === totalPages}
              onClick={() => setPage((p) => p + 1)}
              className="rounded-full border border-border px-4 py-1.5 text-xs font-medium hover:bg-secondary disabled:opacity-40"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
