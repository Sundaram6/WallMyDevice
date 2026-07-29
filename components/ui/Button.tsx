import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
  children: ReactNode;
  variant?: "primary" | "secondary" | "ghost";
};

export function Button({ children, className = "", variant = "secondary", ...rest }: Props) {
  const baseStyle = "rounded-lg px-3 py-1.5 text-xs font-medium transition disabled:cursor-not-allowed disabled:opacity-50";
  const variantStyles = {
    primary: "bg-[#2B2A26] text-white hover:bg-[#C9552F] shadow-xs",
    secondary: "border border-[#D4CDBC] bg-white text-[#2B2A26] hover:bg-[#F3EFE6]",
    ghost: "text-[#5B584F] hover:bg-[#F3EFE6] hover:text-[#2B2A26]",
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
