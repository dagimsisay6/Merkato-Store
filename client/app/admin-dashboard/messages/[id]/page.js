"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Mail, Phone, Calendar, Send, Trash2,
  ArchiveRestore, CheckCheck, MailOpen, MailX, Archive,
  AlertTriangle, X,
} from "lucide-react";
import {
  getAdminMessage, updateMessageStatus, replyToMessage,
  deleteAdminMessage, restoreAdminMessage,
} from "@/lib/api";

const STATUS_STYLES = {
  unread:   "bg-primary/10 text-primary",
  read:     "bg-secondary text-muted-foreground",
  replied:  "bg-accent/10 text-accent",
  resolved: "bg-green-100 text-green-700",
  archived: "bg-ember/10 text-ember",
};

export default function MessageDetail({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [msg,           setMsg]           = useState(null);
  const [replies,       setReplies]       = useState([]);
  const [loading,       setLoading]       = useState(true);
  const [reply,         setReply]         = useState("");
  const [sending,       setSending]       = useState(false);
  const [replyError,    setReplyError]    = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);

  function getToken() { return localStorage.getItem("merkato.token"); }

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminMessage(id, getToken());
        setMsg(data.message);
        setReplies(data.replies ?? []);
      } catch {}
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleStatus(status) {
    try {
      const data = await updateMessageStatus(id, status, getToken());
      setMsg(data.message);
    } catch {}
  }

  async function confirmDeleteMsg() {
    await deleteAdminMessage(id, getToken());
    router.push("/admin-dashboard/messages");
  }

  async function handleRestore() {
    const data = await restoreAdminMessage(id, getToken());
    setMsg(data.message);
  }

  async function handleReply(e) {
    e.preventDefault();
    if (!reply.trim()) return;
    setReplyError("");
    setSending(true);
    try {
      const data = await replyToMessage(id, reply.trim(), getToken());
      setReplies((prev) => [...prev, data.reply]);
      setMsg((prev) => ({ ...prev, status: "replied" }));
      setReply("");
    } catch (err) {
      setReplyError(err.message);
    } finally {
      setSending(false);
    }
  }

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading…</div>;
  if (!msg)    return <div className="py-20 text-center text-muted-foreground">Message not found.</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => router.push("/admin-dashboard/messages")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Messages
      </button>

      {/* Message card */}
      <div className="rounded-2xl border border-border bg-card shadow-(--shadow-soft)">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-xl font-bold text-foreground">{msg.subject}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[msg.status] ?? ""}`}>
                {msg.status}
              </span>
            </div>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" /> {msg.email}</span>
              {msg.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" /> {msg.phone}</span>}
              <span className="flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                {new Date(msg.created_at).toLocaleString()}
              </span>
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            <p className="w-full text-xs font-bold uppercase tracking-widest text-muted-foreground mb-1">From</p>
            <p className="text-sm font-semibold text-foreground">{msg.name}</p>
          </div>
        </div>

        {/* Original message */}
        <div className="p-6">
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{msg.message}</p>
        </div>

        {/* Replies */}
        {replies.length > 0 && (
          <div className="border-t border-border">
            <p className="px-6 pt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Reply History ({replies.length})
            </p>
            <div className="divide-y divide-border">
              {replies.map((r) => (
                <div key={r.id} className="px-6 py-4 bg-primary/2">
                  <div className="flex items-center justify-between mb-2">
                    <p className="text-xs font-semibold text-primary">{r.admin_name ?? "Admin"}</p>
                    <p className="text-xs text-muted-foreground">{new Date(r.created_at).toLocaleString()}</p>
                  </div>
                  <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{r.reply}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Reply form */}
        {msg.status !== "archived" && (
          <form onSubmit={handleReply} className="border-t border-border p-6 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Write a Reply</p>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              placeholder="Type your reply to the customer…"
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-primary resize-none"
            />
            {replyError && <p className="text-xs text-ember">{replyError}</p>}
            <button
              type="submit"
              disabled={sending || !reply.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-glow disabled:opacity-60 transition"
            >
              {sending ? "Sending…" : "Send Reply"}
              <Send className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {msg.status !== "unread" && (
          <ActionBtn icon={MailX} label="Mark Unread" onClick={() => handleStatus("unread")} />
        )}
        {msg.status === "unread" && (
          <ActionBtn icon={MailOpen} label="Mark Read" onClick={() => handleStatus("read")} />
        )}
        {msg.status !== "resolved" && msg.status !== "archived" && (
          <ActionBtn icon={CheckCheck} label="Mark Resolved" onClick={() => handleStatus("resolved")} color="text-green-600" />
        )}
        {msg.status !== "archived" && (
          <ActionBtn icon={Archive} label="Archive" onClick={() => handleStatus("archived")} color="text-ember" />
        )}
        {msg.status === "archived" && (
          <ActionBtn icon={ArchiveRestore} label="Restore" onClick={handleRestore} color="text-primary" />
        )}
        <ActionBtn icon={Trash2} label="Delete" onClick={() => setConfirmDelete(true)} color="text-destructive" />
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Delete this message?"
          message="This action cannot be undone. The message will be permanently removed."
          confirmLabel="Delete"
          onConfirm={confirmDeleteMsg}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}

function ActionBtn({ icon: Icon, label, onClick, color = "text-foreground" }) {
  return (
    <button
      onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-secondary transition ${color}`}
    >
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function ConfirmDialog({ title, message, confirmLabel, onConfirm, onCancel }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-sm rounded-2xl border border-border bg-card p-6 shadow-(--shadow-elegant)">
        <div className="flex items-start gap-3">
          <div className="grid h-10 w-10 shrink-0 place-items-center rounded-full bg-ember/10 text-ember">
            <AlertTriangle className="h-5 w-5" />
          </div>
          <div className="flex-1">
            <p className="font-display font-bold text-foreground">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{message}</p>
          </div>
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground">
            <X className="h-4 w-4" />
          </button>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary">Cancel</button>
          <button onClick={onConfirm} className="rounded-full bg-ember px-4 py-2 text-sm font-semibold text-white hover:bg-ember/90">{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}
