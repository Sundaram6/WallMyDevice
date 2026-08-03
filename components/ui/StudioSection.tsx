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
    <div className="rounded-2xl border border-paper-300 bg-paper-100 overflow-hidden transition-all duration-[--dur-fast] shadow-1">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full flex items-center justify-between p-3.5 text-left hover:bg-paper-200/60 transition-colors duration-[--dur-fast] group focus-visible:outline-none"
      >
        <div className="flex items-center gap-2.5">
          {icon && <span className="text-base select-none">{icon}</span>}
          <div>
            <h2 className="text-xs font-serif font-medium uppercase tracking-wider text-ink-900 group-hover:text-accent-500 transition-colors duration-[--dur-fast]">
              {title}
            </h2>
            {subtitle && (
              <p className="text-[10px] text-ink-500 font-mono mt-0.5">{subtitle}</p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <span className="text-[10px] font-mono text-ink-500 uppercase">
            {isOpen ? "Hide" : "Edit"}
          </span>
          <svg
            className={`w-4 h-4 text-ink-500 transition-transform duration-[--dur-normal] ease-[--ease-out] ${
              isOpen ? "rotate-180 text-accent-500" : "rotate-0"
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
        <div className="p-3.5 pt-1 border-t border-paper-200 bg-paper-50 space-y-3">
          {children}
        </div>
      )}
    </div>
  );
}
