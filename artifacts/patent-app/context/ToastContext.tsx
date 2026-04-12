import React, { createContext, useCallback, useContext, useRef, useState } from "react";

export type ToastType = "success" | "error" | "info";

export type ToastItem = {
  id: string;
  message: string;
  type: ToastType;
  icon?: string;
};

type ToastContextType = {
  showToast: (message: string, type?: ToastType, icon?: string) => void;
  current: ToastItem | null;
  dismiss: () => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [current, setCurrent] = useState<ToastItem | null>(null);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const dismiss = useCallback(() => {
    setCurrent(null);
    if (timerRef.current) clearTimeout(timerRef.current);
  }, []);

  const showToast = useCallback((message: string, type: ToastType = "success", icon?: string) => {
    if (timerRef.current) clearTimeout(timerRef.current);
    const id = String(Date.now());
    setCurrent({ id, message, type, icon });
    timerRef.current = setTimeout(() => setCurrent(null), 2200);
  }, []);

  return (
    <ToastContext.Provider value={{ showToast, current, dismiss }}>
      {children}
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast must be inside ToastProvider");
  return ctx;
}
