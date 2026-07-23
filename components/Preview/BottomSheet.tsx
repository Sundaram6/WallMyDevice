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
      className="absolute inset-x-0 bottom-0 z-30 rounded-t-2xl border-t border-[#D4CDBC] bg-[#FAF8F4] text-[#2B2A26] transition-all shadow-xl pb-[env(safe-area-inset-bottom)]"
      style={{ height: collapsed ? 64 : "55dvh" }}
      aria-expanded={!collapsed}
    >
      <div className="flex w-full items-center justify-center border-b border-[#E4DFD3]">
        <button
          type="button"
          onClick={() => onSnap(!collapsed)}
          aria-label="Toggle bottom sheet"
          className="flex h-16 w-full items-center justify-center px-4"
        >
          <div className="flex flex-col items-center gap-1.5">
            <div className="h-1.5 w-12 rounded-full bg-[#D4CDBC]" />
            <span className="text-xs font-serif font-medium text-[#2B2A26] tracking-wide flex items-center gap-1">
              <span>{title}</span>
              <span className="text-[10px] text-[#8A8579]">{collapsed ? "▲" : "▼"}</span>
            </span>
          </div>
        </button>
      </div>
      {!collapsed ? <div className="h-[calc(100%-4rem)] overflow-y-auto p-4">{children}</div> : null}
    </div>
  );
}
