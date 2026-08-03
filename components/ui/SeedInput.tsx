"use client";

import React, { type InputHTMLAttributes } from "react";

type Props = Omit<InputHTMLAttributes<HTMLInputElement>, "onChange"> & {
  value: string;
  onChange: (value: string) => void;
  onShuffle?: () => void;
  ariaLabel?: string;
};

export function SeedInput({
  value,
  onChange,
  onShuffle,
  ariaLabel = "Seed input",
  className = "",
  disabled,
  ...rest
}: Props) {
  return (
    <div className="relative flex items-center w-full">
      <input
        {...rest}
        type="text"
        value={value}
        disabled={disabled}
        aria-label={ariaLabel}
        onChange={(e) => onChange(e.target.value)}
        className={`w-full rounded-sm bg-paper-0 border border-paper-200 px-3 py-2 font-mono text-xs text-ink-900 placeholder:text-ink-400 focus-visible:outline-none focus-visible:border-accent-500 focus-visible:ring-2 focus-visible:ring-accent-500/30 transition-all duration-[--dur-fast] ease-[--ease-out] disabled:opacity-50 disabled:cursor-not-allowed ${
          onShuffle ? "pr-9" : ""
        } ${className}`}
      />
      {onShuffle && (
        <button
          type="button"
          disabled={disabled}
          onClick={onShuffle}
          title="Generate random seed"
          aria-label="Generate random seed"
          className="absolute right-1.5 p-1 rounded-sm text-ink-500 hover:text-accent-500 hover:bg-paper-100 transition-colors duration-[--dur-fast] disabled:opacity-50"
        >
          <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
            <path d="M10.59 9.17L5.41 4 4 5.41l5.17 5.17 1.42-1.41zM14.5 4l2.04 2.04L4 18.59 5.41 20 17.96 7.45 20 9.5V4h-5.5zm.33 9.41l-1.41 1.41 3.13 3.13L14.5 20H20v-5.5l-2.04 2.04-3.13-3.13z"/>
          </svg>
        </button>
      )}
    </div>
  );
}
