"use client";

import { useState, useEffect, useCallback, createContext, useContext } from "react";
import { X, CheckCircle2, AlertCircle, Info, Loader2 } from "lucide-react";

export type ToastType = "success" | "error" | "info" | "loading";

export interface Toast {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
}

interface ToastContextValue {
  toasts: Toast[];
  showToast: (toast: Omit<Toast, "id">) => string;
  hideToast: (id: string) => void;
  hideAllToasts: () => void;
}

const ToastContext = createContext<ToastContextValue | null>(null);

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider");
  }
  return context;
}

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((toast: Omit<Toast, "id">) => {
    const id = Math.random().toString(36).substring(2, 9);
    const newToast = { ...toast, id };
    setToasts((prev) => [...prev, newToast]);
    return id;
  }, []);

  const hideToast = useCallback((id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const hideAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  return (
    <ToastContext.Provider value={{ toasts, showToast, hideToast, hideAllToasts }}>
      {children}
      <ToastContainer toasts={toasts} onHide={hideToast} />
    </ToastContext.Provider>
  );
}

function ToastContainer({ toasts, onHide }: { toasts: Toast[]; onHide: (id: string) => void }) {
  return (
    <div className="fixed bottom-4 right-4 z-[100] flex flex-col gap-2 pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onHide={onHide} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onHide }: { toast: Toast; onHide: (id: string) => void }) {
  const [isExiting, setIsExiting] = useState(false);

  useEffect(() => {
    if (toast.duration !== 0 && toast.type !== "loading") {
      const timer = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => onHide(toast.id), 300);
      }, toast.duration ?? 5000);
      return () => clearTimeout(timer);
    }
  }, [toast, onHide]);

  const icons = {
    success: <CheckCircle2 className="w-5 h-5 text-[var(--color-fc-cyan)]" />,
    error: <AlertCircle className="w-5 h-5 text-red-500" />,
    info: <Info className="w-5 h-5 text-[var(--color-fc-primary)]" />,
    loading: <Loader2 className="w-5 h-5 text-[var(--color-fc-primary)] animate-spin" />,
  };

  const backgrounds = {
    success: "bg-[var(--color-fc-cyan)]/10 border-[var(--color-fc-cyan)]/30",
    error: "bg-red-50 border-red-200",
    info: "bg-[var(--color-fc-primary)]/10 border-[var(--color-fc-primary)]/30",
    loading: "bg-[var(--color-fc-primary)]/10 border-[var(--color-fc-primary)]/30",
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-3 px-4 py-3 rounded-xl border shadow-lg shadow-[var(--color-fc-deep)]/10 min-w-[300px] max-w-md animate-slide-in ${
        backgrounds[toast.type]
      }`}
      role="alert"
      aria-live="polite"
    >
      <div className="flex-shrink-0 mt-0.5">
        {({
          success: <CheckCircle2 className="w-5 h-5 text-[var(--color-fc-cyan)]" />,
          error: <AlertCircle className="w-5 h-5 text-red-500" />,
          info: <Info className="w-5 h-5 text-[var(--color-fc-primary)]" />,
          loading: <Loader2 className="w-5 h-5 text-[var(--color-fc-primary)] animate-spin" />,
        }[toast.type])}
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-[var(--color-fc-black)]">{toast.title}</p>
        {toast.message && (
          <p className="mt-1 text-sm text-[var(--color-fc-gray-mid)]">{toast.message}</p>
        )}
      </div>
      <button
        onClick={() => onHide(toast.id)}
        className="flex-shrink-0 text-[var(--color-fc-gray-mid)] hover:text-[var(--color-fc-black)] transition-colors p-1"
        aria-label="Fermer"
      >
        <X className="w-4 h-4" />
      </button>
    </div>
  );
}