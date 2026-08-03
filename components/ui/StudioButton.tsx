"use client";

import React from "react";

type ButtonVariant = "primary" | "secondary" | "ghost" | "danger" | "outline";
type ButtonSize = "sm" | "md" | "lg";

interface StudioButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant;
  size?: ButtonSize;
  icon?: React.ReactNode;
  active?: boolean;
}

export function StudioButton({
  variant = "secondary",
  size = "md",
  icon,
  active = false,
  children,
  className = "",
  disabled,
  ...props
}: StudioButtonProps) {
  // Size classes
  const sizeClasses = {
    sm: "px-2.5 py-1 text-[11px] min-h-[32px] gap-1.5 rounded-lg",
    md: "px-3.5 py-2 text-xs min-h-[38px] gap-2 rounded-xl",
    lg: "px-4 py-2.5 text-sm min-h-[44px] gap-2.5 rounded-xl",
  }[size];

  // Variant classes using brand CSS tokens
  let variantClasses = "";

  switch (variant) {
    case "primary":
      variantClasses = active
        ? "bg-accent-500 text-paper-0 shadow-1 hover:bg-accent-500/90 active:scale-[0.98]"
        : "bg-accent-500 text-paper-0 shadow-1 hover:bg-accent-500/90 active:scale-[0.98]";
      break;
    case "secondary":
      variantClasses = active
        ? "bg-ink-900 text-paper-0 font-medium shadow-1"
        : "bg-paper-100 text-ink-900 border border-paper-300 hover:bg-paper-200 hover:border-ink-900/30";
      break;
    case "outline":
      variantClasses = active
        ? "bg-accent-500/15 text-accent-500 border border-accent-500 font-medium"
        : "bg-transparent text-ink-500 border border-paper-300 hover:bg-paper-100 hover:text-ink-900";
      break;
    case "ghost":
      variantClasses = active
        ? "bg-paper-200 text-ink-900 font-medium"
        : "bg-transparent text-ink-500 hover:bg-paper-100 hover:text-ink-900";
      break;
    case "danger":
      variantClasses = "bg-rose-500/10 text-rose-500 border border-rose-500/20 hover:bg-rose-500/20";
      break;
  }

  // Disabled styling
  const disabledClasses = disabled
    ? "opacity-50 cursor-not-allowed pointer-events-none"
    : "cursor-pointer";

  return (
    <button
      type="button"
      disabled={disabled}
      className={`inline-flex items-center justify-center font-medium transition-all duration-[--dur-fast] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent-500 ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
