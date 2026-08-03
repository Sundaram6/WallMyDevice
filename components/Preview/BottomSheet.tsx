import type { ReactNode } from "react";

type Props = {
  title: string;
  collapsed: boolean;
  onSnap: (collapsed: boolean) => void;
  children: ReactNode;
};

export function BottomSheet({ title, collapsed, onSnap, children }: Props) {
  return (
    <div
      data-testid="bottom-sheet"
      data-collapsed={collapsed}
      className="absolute inset-x-0 bottom-0 z-30 rounded-t-2xl border-t border-paper-300 bg-paper-100 text-ink-900 transition-all duration-[--dur-normal] ease-[--ease-spring] shadow-2 pb-[env(safe-area-inset-bottom)]"
      style={{ height: collapsed ? 64 : "55dvh" }}
      aria-expanded={!collapsed}
    >
      <div className="flex w-full items-center justify-center border-b border-paper-200 bg-paper-100 rounded-t-2xl">
        <button
          type="button"
          onClick={() => onSnap(!collapsed)}
          aria-label="Toggle bottom sheet"
          className="flex h-16 w-full items-center justify-center px-4 hover:bg-paper-200 transition-colors duration-[--dur-fast] rounded-t-2xl group"
        >
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-1.5 w-12 rounded-full bg-paper-300 group-hover:bg-ink-500 transition-colors duration-[--dur-fast]" />
            <span className="text-xs font-serif font-medium text-ink-900 tracking-wide flex items-center gap-1.5">
              <span>{title}</span>
              <svg 
                className={`w-3 h-3 text-ink-500 transition-transform duration-[--dur-normal] ease-[--ease-out] ${collapsed ? "rotate-180" : "rotate-0"}`}
                fill="none" viewBox="0 0 24 24" stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </span>
          </div>
        </button>
      </div>
      {!collapsed ? <div className="h-[calc(100%-4rem)] overflow-y-auto p-4">{children}</div> : null}
    </div>
  );
}
