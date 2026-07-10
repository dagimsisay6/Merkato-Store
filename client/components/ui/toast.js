"use client";

import { createContext, useContext, useState, useCallback } from "react";
import { X, Info, CheckCircle, AlertCircle } from "lucide-react";

const ToastContext = createContext(null);

const ICONS = {
  info: <Info className="h-4 w-4 shrink-0" />,
  success: <CheckCircle className="h-4 w-4 shrink-0 text-green-500" />,
  error: <AlertCircle className="h-4 w-4 shrink-0 text-red-500" />,
};

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const toast = useCallback(({ message, type = "info", duration = 3500 }) => {
    const id = Date.now();
    setToasts(prev => [...prev, { id, message, type }]);
    setTimeout(() => setToasts(prev => prev.filter(t => t.id !== id)), duration);
  }, []);

  const dismiss = (id) => setToasts(prev => prev.filter(t => t.id !== id));

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <div className="fixed top-6 right-6 z-[9999] flex flex-col gap-2 w-max max-w-sm">
        {toasts.map(t => (
          <div
            key={t.id}
            className="flex items-center gap-3 rounded-2xl border border-border bg-card px-4 py-3 shadow-lg text-sm font-medium animate-in fade-in slide-in-from-bottom-2"
          >
            {ICONS[t.type]}
            <span className="flex-1">{t.message}</span>
            <button onClick={() => dismiss(t.id)} className="text-muted-foreground hover:text-foreground">
              <X className="h-3.5 w-3.5" />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const t = useContext(ToastContext);
  if (!t) throw new Error("useToast outside ToastProvider");
  return t;
}
