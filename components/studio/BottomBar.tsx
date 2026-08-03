"use client";

import { useEditorStore } from "@/store/useEditorStore";

export function BottomBar() {
  const customWidth = useEditorStore((s) => s.customWidth);
  const customHeight = useEditorStore((s) => s.customHeight);
  const generatorId = useEditorStore((s) => s.generatorId);

  return (
    <footer
      className="flex h-8 w-full shrink-0 items-center justify-between px-4 font-mono text-[10.5px] select-none z-20"
      style={{
        background: "var(--color-bg)",
        borderTop: "1px solid var(--color-border)",
        color: "var(--color-muted)",
      }}
    >
      {/* ── Left: Resolution & Aspect ────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5">
          <span className="text-ink-500 uppercase text-[9px] tracking-wider">Canvas</span>
          <strong className="text-ink-900 font-medium">{customWidth} × {customHeight} px</strong>
        </span>

        <span className="h-3 w-px bg-paper-300" />

        <span className="text-ink-500">
          Aspect: {(customWidth / (customHeight || 1)).toFixed(2)}:1
        </span>
      </div>

      {/* ── Center: Active Layer / Generator ─────────────────────────────── */}
      <div className="hidden md:flex items-center gap-2 text-ink-900">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Active Layer: <strong className="capitalize">{generatorId}</strong></span>
      </div>

      {/* ── Right: Zoom & Shortcuts ──────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 rounded bg-paper-100 border border-paper-300 px-2 py-0.5 text-ink-900">
          <span>Fit View</span>
          <span className="text-ink-500">100%</span>
        </span>

        <div className="hidden sm:flex items-center gap-2 text-ink-500">
          <kbd className="rounded border border-paper-300 bg-paper-100 px-1 py-0.5 text-[9px]">
            ⌘S export
          </kbd>
        </div>
      </div>
    </footer>
  );
}
