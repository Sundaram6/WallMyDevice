import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ children, className = "", variant = "secondary", ...rest }: Props) {
  const baseStyle = "inline-flex items-center justify-center gap-2 rounded-sm px-3.5 py-2 text-xs font-medium font-sans transition-all duration-[--dur-fast] ease-[--ease-out] disabled:cursor-not-allowed disabled:opacity-50 disabled:pointer-events-none active:scale-[0.99]";
  const variantStyles = {
    primary: "bg-accent-500 text-paper-0 hover:bg-accent-600 shadow-1 focus-visible:ring-2 focus-visible:ring-accent-500/50",
    secondary: "border border-paper-300 bg-paper-0 text-ink-700 hover:bg-paper-100 hover:text-ink-900 shadow-1 focus-visible:ring-2 focus-visible:ring-accent-500/30",
    ghost: "text-ink-700 hover:bg-paper-100 hover:text-ink-900 focus-visible:ring-2 focus-visible:ring-accent-500/30",
  };

  return (
    <button
      {...rest}
      className={`${baseStyle} ${variantStyles[variant]} ${className}`}
    >
      {children}
    </button>
  );
}
