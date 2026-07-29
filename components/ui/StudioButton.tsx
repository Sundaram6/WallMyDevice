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
        ? "bg-brand-accent text-white shadow-xs hover:bg-brand-accent-hover active:scale-[0.98]"
        : "bg-brand-accent text-white shadow-xs hover:bg-brand-accent-hover active:scale-[0.98]";
      break;
    case "secondary":
      variantClasses = active
        ? "bg-brand-ink text-brand-bg font-medium shadow-xs"
        : "bg-brand-surface text-brand-ink border border-brand-border hover:bg-brand-surface-2 hover:border-brand-faint";
      break;
    case "outline":
      variantClasses = active
        ? "bg-brand-accent/15 text-brand-accent border border-brand-accent font-medium"
        : "bg-transparent text-brand-muted border border-brand-border hover:bg-brand-surface hover:text-brand-ink";
      break;
    case "ghost":
      variantClasses = active
        ? "bg-brand-surface-2 text-brand-ink font-medium"
        : "bg-transparent text-brand-muted hover:bg-brand-surface hover:text-brand-ink";
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
      className={`inline-flex items-center justify-center font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-accent ${sizeClasses} ${variantClasses} ${disabledClasses} ${className}`}
      {...props}
    >
      {icon && <span className="shrink-0">{icon}</span>}
      {children}
    </button>
  );
}
