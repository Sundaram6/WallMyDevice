"use client";

import { useEffect, useState, useRef } from "react";

type ToastProps = {
  message: string | null;
  durationMs?: number;
  onClose?: () => void;
};

export function Toast({ message, durationMs = 3000, onClose }: ToastProps) {
  const onCloseRef = useRef(onClose);
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        if (onCloseRef.current) onCloseRef.current();
      }, durationMs);
      return () => clearTimeout(timer);
    }
  }, [message, durationMs]);

  if (!message) return null;

  return (
    <div
      id="studio-toast"
      data-testid="toast-notification"
      role="status"
      aria-live="polite"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 rounded-xl px-4 py-3 text-xs font-medium shadow-2 border border-accent-500/30 bg-paper-0/95 backdrop-blur-md text-ink-900 animate-in fade-in slide-in-from-bottom-3 duration-[--dur-normal]"
      style={{
        boxShadow: "0 8px 32px rgba(0, 0, 0, 0.4), 0 0 0 1px var(--accent-500)/20",
      }}
    >
      <span className="text-accent-500 font-semibold">{message}</span>
      <button
        type="button"
        onClick={() => {
          if (onClose) onClose();
        }}
        aria-label="Dismiss toast notification"
        className="ml-2 text-ink-500 hover:text-ink-900 transition-colors"
      >
        ✕
      </button>
    </div>
  );
}
