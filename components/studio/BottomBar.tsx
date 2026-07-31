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
          <span className="text-brand-faint uppercase text-[9px] tracking-wider">Canvas</span>
          <strong className="text-brand-ink font-medium">{customWidth} × {customHeight} px</strong>
        </span>

        <span className="h-3 w-px bg-brand-border" />

        <span className="text-brand-faint">
          Aspect: {(customWidth / (customHeight || 1)).toFixed(2)}:1
        </span>
      </div>

      {/* ── Center: Active Layer / Generator ─────────────────────────────── */}
      <div className="hidden md:flex items-center gap-2 text-brand-ink">
        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-pulse" />
        <span>Active Layer: <strong className="capitalize">{generatorId}</strong></span>
      </div>

      {/* ── Right: Zoom & Shortcuts ──────────────────────────────────────── */}
      <div className="flex items-center gap-4">
        <span className="flex items-center gap-1 rounded bg-brand-surface border border-brand-border px-2 py-0.5 text-brand-ink">
          <span>Fit View</span>
          <span className="text-brand-faint">100%</span>
        </span>

        <div className="hidden sm:flex items-center gap-2 text-brand-faint">
          <kbd className="rounded border border-brand-border bg-brand-surface px-1 py-0.5 text-[9px]">
            ⌘S export
          </kbd>
        </div>
      </div>
    </footer>
  );
}
