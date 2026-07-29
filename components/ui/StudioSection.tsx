"use client";

import React, { useState } from "react";

interface StudioSectionProps {
  title: string;
  subtitle?: string;
  icon?: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}

export function StudioSection({
  title,
  subtitle,
  icon,
  defaultOpen = false,
  children,
}: StudioSectionProps) {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="rounded-2xl border border-brand-border bg-brand-surface overflow-hidden transition-all duration-250 shadow-xs">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 text-left hover:bg-brand-surface-2/60 transition group focus-visible:outline-none"
      >
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-base select-none">{icon}</span>}
          <div>
            <h2 className="text-xs font-serif font-medium uppercase tracking-wider text-brand-ink group-hover:text-brand-accent transition">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[10px] text-brand-faint font-mono mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-brand-faint uppercase">
            {isOpen ? "Hide" : "Edit"}
          </span>
          <svg
            className={`w-4 h-4 text-brand-muted transition-transform duration-300 ${
              isOpen ? "rotate-180 text-brand-accent" : "rotate-0"
            }`}
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth="2"
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </button>

      {isOpen && (
        <div className="p-3.5 pt-1 border-t border-brand-border/60 bg-brand-bg/50 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}
