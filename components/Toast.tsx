"use client";

import { useEffect } from "react";

interface ToastProps {
  message: string;
  onDismiss: () => void;
}

export function Toast({ message, onDismiss }: ToastProps) {
  useEffect(() => {
    const t = setTimeout(onDismiss, 3500);
    return () => clearTimeout(t);
  }, [onDismiss]);

  return (
    <div
      className={[
        "fixed bottom-6 left-1/2 -translate-x-1/2 z-50",
        "bg-[#1a1424] text-[#f6f4f9] px-5 py-3 rounded-sm",
        "label-mono text-[11px] shadow-lg",
        "animate-fade-in",
      ].join(" ")}
    >
      {message}
    </div>
  );
}
