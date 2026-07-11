"use client";

import { AlertCircle, AlertTriangle, CheckCircle, Info, X } from "lucide-react";

const VARIANTS = {
  error:   { icon: AlertCircle,   bg: "bg-red-500/10",    border: "border-red-400/30",   text: "text-red-600 dark:text-red-400" },
  warning: { icon: AlertTriangle, bg: "bg-amber-500/10",  border: "border-amber-400/30", text: "text-amber-700 dark:text-amber-400" },
  success: { icon: CheckCircle,   bg: "bg-primary/10",    border: "border-primary/30",   text: "text-primary" },
  info:    { icon: Info,          bg: "bg-blue-500/10",   border: "border-blue-400/30",  text: "text-blue-700 dark:text-blue-400" },
};

export function Alert({ variant = "error", title, message, onDismiss }) {
  const { icon: Icon, bg, border, text } = VARIANTS[variant];
  return (
    <div className={`flex items-start gap-3 rounded-2xl border ${bg} ${border} px-4 py-3.5`}>
      <Icon className={`mt-0.5 h-4 w-4 shrink-0 ${text}`} />
      <div className="flex-1 min-w-0">
        {title && <p className={`text-sm font-semibold ${text}`}>{title}</p>}
        {message && <p className={`text-sm ${title ? "mt-0.5 opacity-90" : ""} ${text}`}>{message}</p>}
      </div>
      {onDismiss && (
        <button onClick={onDismiss} className={`shrink-0 ${text} opacity-60 hover:opacity-100`}>
          <X className="h-3.5 w-3.5" />
        </button>
      )}
    </div>
  );
}
