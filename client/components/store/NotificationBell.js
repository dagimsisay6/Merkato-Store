"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Bell, Mail, MessageSquare, X } from "lucide-react";
import { useAuth } from "@/lib/store-context";

const BASE = process.env.NEXT_PUBLIC_API_URL;

export function NotificationBell() {
  const { isAdmin, mounted } = useAuth();
  const [unread, setUnread]         = useState(0);
  const [messages, setMessages]     = useState([]);
  const [open, setOpen]             = useState(false);
  const [prevUnread, setPrevUnread] = useState(0);
  const [flash, setFlash]           = useState(false);
  const dropRef                     = useRef(null);

  // Close on outside click
  useEffect(() => {
    if (!open) return;
    const handler = (e) => {
      if (dropRef.current && !dropRef.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, [open]);

  async function fetchNotifications() {
    const token = localStorage.getItem("merkato.token");
    if (!token) return;
    try {
      const res = await fetch(`${BASE}/admin/messages?limit=5&status=unread`, {
        headers: { Authorization: `Bearer ${token}` },
        cache: "no-store",
      });
      if (!res.ok) return;
      const data = await res.json();
      const count = data.unread ?? 0;
      // Flash bell when new messages arrive
      if (count > prevUnread && prevUnread !== 0) {
        setFlash(true);
        setTimeout(() => setFlash(false), 2000);
      }
      setPrevUnread(count);
      setUnread(count);
      setMessages(data.messages?.slice(0, 5) ?? []);
    } catch {}
  }

  useEffect(() => {
    if (!isAdmin) return;
    fetchNotifications();
    const interval = setInterval(fetchNotifications, 30000);
    return () => clearInterval(interval);
  }, [isAdmin]);

  if (!mounted || !isAdmin) return null;

  return (
    <div className="relative" ref={dropRef}>
      <button
        onClick={() => setOpen((v) => !v)}
        className={`relative grid h-10 w-10 place-items-center rounded-full transition hover:bg-secondary ${flash ? "animate-bounce-soft" : ""}`}
        aria-label="Notifications"
      >
        <Bell className="h-5 w-5" />
        {unread > 0 && (
          <span className="absolute -right-0.5 -top-0.5 grid h-5 w-5 place-items-center rounded-full bg-ember text-[10px] font-bold text-white">
            {unread > 9 ? "9+" : unread}
          </span>
        )}
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-2 w-80 overflow-hidden rounded-2xl border border-border bg-card shadow-(--shadow-elegant)">
          {/* Header */}
          <div className="flex items-center justify-between border-b border-border px-4 py-3">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-4 w-4 text-primary" />
              <span className="text-sm font-bold text-foreground">Customer Messages</span>
              {unread > 0 && (
                <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full bg-primary px-1.5 text-[10px] font-bold text-primary-foreground">
                  {unread}
                </span>
              )}
            </div>
            <button onClick={() => setOpen(false)} className="text-muted-foreground hover:text-foreground">
              <X className="h-4 w-4" />
            </button>
          </div>

          {/* Message list */}
          <div className="max-h-72 overflow-y-auto">
            {messages.length === 0 ? (
              <div className="py-8 text-center">
                <Mail className="mx-auto h-8 w-8 text-muted-foreground/30 mb-2" />
                <p className="text-xs text-muted-foreground">No unread messages</p>
              </div>
            ) : (
              messages.map((m) => (
                <Link
                  key={m.id}
                  href={`/admin-dashboard/messages/${m.id}`}
                  onClick={() => setOpen(false)}
                  className="flex items-start gap-3 border-b border-border px-4 py-3 transition hover:bg-secondary/50 last:border-0"
                >
                  <div className="mt-0.5 grid h-8 w-8 shrink-0 place-items-center rounded-full bg-primary/10 text-primary text-xs font-bold">
                    {m.name?.[0]?.toUpperCase() ?? "?"}
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-xs font-semibold text-foreground">{m.name}</p>
                    <p className="truncate text-xs font-medium text-muted-foreground">{m.subject}</p>
                    <p className="truncate text-[11px] text-muted-foreground/70">{m.message}</p>
                  </div>
                  <span className="shrink-0 text-[10px] text-muted-foreground">
                    {new Date(m.created_at).toLocaleDateString()}
                  </span>
                </Link>
              ))
            )}
          </div>

          {/* Footer */}
          <div className="border-t border-border px-4 py-2.5">
            <Link
              href="/admin-dashboard/messages"
              onClick={() => setOpen(false)}
              className="block text-center text-xs font-semibold text-primary hover:underline"
            >
              View all messages →
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
