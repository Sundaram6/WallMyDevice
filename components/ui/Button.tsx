import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode };

export function Button({ children, className = "", ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
