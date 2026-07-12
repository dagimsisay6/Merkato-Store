"use client";

import { useEffect, useState, use } from "react";
import { useRouter } from "next/navigation";
import {
  ArrowLeft, Mail, Phone, MapPin, Briefcase, ExternalLink,
  Send, Trash2, ArchiveRestore, AlertTriangle, X, FileText,
} from "lucide-react";
import {
  getAdminApplication, updateApplicationStatus,
  replyToApplication, deleteAdminApplication, restoreAdminApplication,
} from "@/lib/api";

const STATUS_STYLES = {
  new:         "bg-primary/10 text-primary",
  reviewing:   "bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400",
  shortlisted: "bg-accent/10 text-accent",
  rejected:    "bg-ember/10 text-ember",
  hired:       "bg-green-100 text-green-700 dark:bg-green-950/40 dark:text-green-400",
  archived:    "bg-secondary text-muted-foreground",
};

const STATUS_OPTIONS = ["reviewing", "shortlisted", "rejected", "hired", "archived"];

export default function ApplicationDetail({ params }) {
  const { id } = use(params);
  const router = useRouter();
  const [app, setApp]               = useState(null);
  const [replies, setReplies]       = useState([]);
  const [loading, setLoading]       = useState(true);
  const [reply, setReply]           = useState("");
  const [sending, setSending]       = useState(false);
  const [replyError, setReplyError] = useState("");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [statusLoading, setStatusLoading] = useState(false);

  function getToken() { return localStorage.getItem("merkato.token"); }

  useEffect(() => {
    async function load() {
      try {
        const data = await getAdminApplication(id, getToken());
        setApp(data.application);
        setReplies(data.replies ?? []);
      } catch {}
      setLoading(false);
    }
    load();
  }, [id]);

  async function handleStatus(status) {
    setStatusLoading(true);
    try {
      const data = await updateApplicationStatus(id, status, getToken());
      setApp(data.application);
    } catch {}
    setStatusLoading(false);
  }

  async function handleReply(e) {
    e.preventDefault();
    if (!reply.trim()) return;
    setReplyError("");
    setSending(true);
    try {
      const data = await replyToApplication(id, reply.trim(), getToken());
      setReplies((prev) => [...prev, data.reply]);
      setReply("");
    } catch (err) {
      setReplyError(err.message);
    } finally {
      setSending(false);
    }
  }

  async function handleDelete() {
    await deleteAdminApplication(id, getToken());
    router.push("/admin-dashboard/applications");
  }

  async function handleRestore() {
    const data = await restoreAdminApplication(id, getToken());
    setApp(data.application);
  }

  if (loading) return <div className="py-20 text-center text-muted-foreground">Loading…</div>;
  if (!app)    return <div className="py-20 text-center text-muted-foreground">Application not found.</div>;

  return (
    <div className="mx-auto max-w-3xl">
      <button
        onClick={() => router.push("/admin-dashboard/applications")}
        className="mb-5 inline-flex items-center gap-1.5 text-sm font-medium text-muted-foreground hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" /> Back to Applications
      </button>

      <div className="rounded-2xl border border-border bg-card shadow-(--shadow-soft)">
        {/* Header */}
        <div className="flex flex-wrap items-start justify-between gap-4 border-b border-border p-6">
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="font-display text-xl font-bold">{app.first_name} {app.last_name}</h2>
              <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold capitalize ${STATUS_STYLES[app.status] ?? ""}`}>
                {app.status}
              </span>
            </div>
            <p className="mt-1 font-semibold text-primary">{app.position}</p>
            <div className="mt-2 flex flex-wrap gap-4 text-xs text-muted-foreground">
              <span className="flex items-center gap-1"><Mail className="h-3.5 w-3.5" />{app.email}</span>
              {app.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{app.phone}</span>}
              <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" />{app.location}</span>
              <span className="flex items-center gap-1"><Briefcase className="h-3.5 w-3.5" />{app.experience}</span>
            </div>
            <div className="mt-2 flex flex-wrap gap-3">
              {app.linkedin && (
                <a href={app.linkedin} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  LinkedIn <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {app.portfolio && (
                <a href={app.portfolio} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  Portfolio <ExternalLink className="h-3 w-3" />
                </a>
              )}
              {app.resume_url && (
                <a href={app.resume_url} target="_blank" rel="noopener noreferrer"
                  className="inline-flex items-center gap-1 text-xs font-medium text-primary hover:underline">
                  <FileText className="h-3 w-3" /> Resume / CV
                </a>
              )}
            </div>
          </div>
          {/* Status selector */}
          <div className="flex flex-col gap-1.5">
            <p className="text-[10px] font-bold uppercase tracking-widest text-muted-foreground">Update Status</p>
            <select
              value={app.status}
              onChange={(e) => handleStatus(e.target.value)}
              disabled={statusLoading}
              className="rounded-xl border border-border bg-background px-3 py-2 text-sm outline-none focus:border-primary disabled:opacity-60"
            >
              {STATUS_OPTIONS.map((s) => (
                <option key={s} value={s} className="capitalize">{s.charAt(0).toUpperCase() + s.slice(1)}</option>
              ))}
            </select>
          </div>
        </div>

        {/* Cover letter */}
        <div className="p-6 border-b border-border">
          <p className="mb-2 text-xs font-bold uppercase tracking-widest text-muted-foreground">Cover Letter</p>
          <p className="text-sm leading-relaxed text-foreground whitespace-pre-wrap">{app.cover_letter}</p>
        </div>

        {/* Reply history */}
        {replies.length > 0 && (
          <div className="border-b border-border">
            <p className="px-6 pt-4 text-xs font-bold uppercase tracking-widest text-muted-foreground">
              Reply History ({replies.length})
            </p>
            <div className="divide-y divide-border">
              {replies.map((r) => (
                <div key={r.id} className="px-6 py-4 bg-primary/[0.02]">
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
        {app.status !== "archived" && (
          <form onSubmit={handleReply} className="p-6 space-y-3">
            <p className="text-xs font-bold uppercase tracking-widest text-muted-foreground">Send a Reply to Applicant</p>
            <textarea
              value={reply}
              onChange={(e) => setReply(e.target.value)}
              rows={4}
              placeholder="Write your message to the applicant… This will be sent to their email."
              className="w-full rounded-2xl border border-border bg-background p-3 text-sm outline-none focus:border-primary resize-none"
            />
            {replyError && <p className="text-xs text-ember">{replyError}</p>}
            <button
              type="submit"
              disabled={sending || !reply.trim()}
              className="inline-flex items-center gap-2 rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-primary-foreground hover:bg-primary-glow disabled:opacity-60 transition"
            >
              {sending ? "Sending…" : "Send Reply"} <Send className="h-4 w-4" />
            </button>
          </form>
        )}
      </div>

      {/* Action buttons */}
      <div className="mt-4 flex flex-wrap gap-2">
        {app.status === "archived" ? (
          <ActionBtn icon={ArchiveRestore} label="Restore" onClick={handleRestore} color="text-primary" />
        ) : null}
        <ActionBtn icon={Trash2} label="Delete" onClick={() => setConfirmDelete(true)} color="text-destructive" />
      </div>

      {confirmDelete && (
        <ConfirmDialog
          title="Delete this application?"
          message="This cannot be undone. The application and all replies will be permanently removed."
          onConfirm={handleDelete}
          onCancel={() => setConfirmDelete(false)}
        />
      )}
    </div>
  );
}

function ActionBtn({ icon: Icon, label, onClick, color = "text-foreground" }) {
  return (
    <button onClick={onClick}
      className={`inline-flex items-center gap-1.5 rounded-full border border-border bg-card px-4 py-2 text-xs font-semibold hover:bg-secondary transition ${color}`}>
      <Icon className="h-3.5 w-3.5" /> {label}
    </button>
  );
}

function ConfirmDialog({ title, message, onConfirm, onCancel }) {
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
          <button onClick={onCancel} className="text-muted-foreground hover:text-foreground"><X className="h-4 w-4" /></button>
        </div>
        <div className="mt-5 flex justify-end gap-2">
          <button onClick={onCancel} className="rounded-full border border-border px-4 py-2 text-sm font-semibold hover:bg-secondary">Cancel</button>
          <button onClick={onConfirm} className="rounded-full bg-ember px-4 py-2 text-sm font-semibold text-white hover:bg-ember/90">Delete</button>
        </div>
      </div>
    </div>
  );
}
