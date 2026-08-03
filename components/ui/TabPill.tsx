"use client";

import React from "react";

export type TabOption<T extends string = string> = {
  id: T;
  label: string;
  badge?: string | number;
};

type Props<T extends string = string> = {
  tabs: readonly TabOption<T>[];
  activeTab: T;
  onChange: (tabId: T) => void;
  ariaLabel?: string;
  className?: string;
};

export function TabPill<T extends string = string>({
  tabs,
  activeTab,
  onChange,
  ariaLabel = "Tab selector",
  className = "",
}: Props<T>) {
  return (
    <div
      role="tablist"
      aria-label={ariaLabel}
      className={`inline-flex items-center gap-1 rounded-pill bg-paper-100 p-1 border border-paper-200 shadow-1 ${className}`}
    >
      {tabs.map((tab) => {
        const isActive = tab.id === activeTab;
        return (
          <button
            key={tab.id}
            role="tab"
            type="button"
            aria-selected={isActive}
            onClick={() => onChange(tab.id)}
            className={`relative flex items-center gap-1.5 rounded-pill px-3 py-1.5 text-xs font-sans font-medium transition-all duration-[--dur-fast] ease-[--ease-out] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500/50 ${
              isActive
                ? "bg-ink-900 text-paper-0 shadow-1"
                : "text-ink-500 hover:text-ink-900 hover:bg-paper-200/50"
            }`}
          >
            <span>{tab.label}</span>
            {tab.badge !== undefined && (
              <span
                className={`rounded-full px-1.5 py-0.25 text-[10px] font-mono ${
                  isActive
                    ? "bg-paper-0/20 text-paper-0"
                    : "bg-paper-200 text-ink-700"
                }`}
              >
                {tab.badge}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
