"use client";

import React, { useEffect } from "react";
import Link from "next/link";

type NavLink = {
  href?: string;
  label: string;
  onClick?: () => void;
  highlight?: boolean;
};

type Props = {
  isOpen: boolean;
  onClose: () => void;
  links: NavLink[];
};

export function MobileNavDrawer({ isOpen, onClose, links }: Props) {
  // Prevent scrolling when drawer is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 md:hidden flex flex-col">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/40 backdrop-blur-xs transition-opacity duration-300"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Sheet Content */}
      <div className="relative z-10 w-full bg-paper-50 border-b border-paper-200 p-6 shadow-2xl flex flex-col gap-6 animate-in slide-in-from-top duration-300">
        <div className="flex items-center justify-between">
          <Link
            href="/"
            onClick={onClose}
            className="font-serif text-xl font-medium tracking-tight text-ink-900"
          >
            WallMyDevice
          </Link>
          <button
            type="button"
            onClick={onClose}
            aria-label="Close menu"
            className="flex min-h-[44px] min-w-[44px] items-center justify-center rounded-full border border-paper-300 bg-white text-ink-900 hover:bg-paper-100 transition"
          >
            ✕
          </button>
        </div>

        <nav aria-label="Mobile Navigation" className="flex flex-col gap-3 pt-2">
          {links.map((link, i) => {
            if (link.onClick) {
              return (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    link.onClick?.();
                    onClose();
                  }}
                  className={`flex min-h-[48px] items-center justify-between rounded-xl px-4 text-sm font-medium transition text-left ${
                    link.highlight
                      ? "bg-ink-900 text-white shadow-xs"
                      : "bg-paper-100 text-ink-900 hover:bg-paper-200"
                  }`}
                >
                  <span>{link.label}</span>
                  <span className="text-xs opacity-60">→</span>
                </button>
              );
            }

            return (
              <Link
                key={i}
                href={(link.href || "/") as any}
                onClick={onClose}
                className={`flex min-h-[48px] items-center justify-between rounded-xl px-4 text-sm font-medium transition ${
                  link.highlight
                    ? "bg-ink-900 text-white shadow-xs"
                    : "bg-paper-100 text-ink-900 hover:bg-paper-200"
                }`}
              >
                <span>{link.label}</span>
                <span className="text-xs opacity-60">→</span>
              </Link>
            );
          })}
        </nav>

        <div className="pt-2 border-t border-paper-200 flex items-center justify-between text-xs text-ink-500 font-mono">
          <span>Generative Print House</span>
          <span>© 2026</span>
        </div>
      </div>
    </div>
  );
}
