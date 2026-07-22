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
      className="absolute inset-x-0 bottom-0 z-30 rounded-t-2xl border-t border-zinc-800 bg-zinc-950 transition-all shadow-lg"
      style={{ height: collapsed ? 64 : "70vh" }}
      aria-expanded={!collapsed}
    >
      <div className="flex w-full items-center justify-center border-b border-zinc-800">
        <button
          type="button"
          onClick={() => onSnap(!collapsed)}
          aria-label="Toggle bottom sheet"
          className="flex h-16 w-full items-center justify-center px-4"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="h-1.5 w-12 rounded-full bg-zinc-700" />
            <span className="text-sm font-semibold text-zinc-100">{title}</span>
          </div>
        </button>
      </div>
      {!collapsed ? <div className="h-[calc(100%-4rem)] overflow-y-auto p-4">{children}</div> : null}
    </div>
  );
}
