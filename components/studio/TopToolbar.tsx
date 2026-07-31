"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { editorCore } from "@/lib/engine/EditorCore";

export function TopToolbar() {
  const surpriseMe = useEditorStore((s) => s.surpriseMe);
  const generatorId = useEditorStore((s) => s.generatorId);
  const mode = useEditorStore((s) => s.mode);
  const setMode = useEditorStore((s) => s.setMode);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const reset = useEditorStore((s) => s.reset);

  return (
    <header
      className="flex h-12 w-full shrink-0 items-center justify-between px-4 text-xs select-none z-20"
      style={{
        background: "var(--color-bg)",
        borderBottom: "1px solid var(--color-border)",
        color: "var(--color-ink)",
      }}
    >
      {/* ── Left: App Brand & History ────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-serif font-semibold tracking-tight text-sm">
          <span className="text-brand-accent">✦</span>
          <span>WallMyDevice</span>
          <span className="rounded bg-brand-surface px-1.5 py-0.5 font-mono text-[9.5px] text-brand-muted border border-brand-border">
            v2.0
          </span>
        </div>

        <div className="h-4 w-px bg-brand-border mx-1" />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={undo}
            title="Undo (⌘Z)"
            className="rounded p-1.5 hover:bg-brand-surface border border-transparent hover:border-brand-border transition-colors text-xs"
          >
            ↩ Back
          </button>
          <button
            type="button"
            onClick={redo}
            title="Redo (⌘⇧Z)"
            className="rounded p-1.5 hover:bg-brand-surface border border-transparent hover:border-brand-border transition-colors text-xs"
          >
            ↪ Forward
          </button>
          <button
            type="button"
            onClick={reset}
            title="Reset Defaults"
            className="rounded px-2 py-1 hover:bg-red-500/10 text-red-500 border border-transparent hover:border-red-500/30 transition-colors text-xs font-medium"
          >
            🔄 Reset
          </button>
        </div>
      </div>

      {/* ── Center: Search & Active Preset / Generator Tag ────────────────── */}
      <div className="hidden sm:flex items-center gap-2 rounded-lg bg-brand-surface border border-brand-border px-3 py-1 text-brand-muted font-mono text-[11px]">
        <span>🔍 Search tools, devices, presets…</span>
        <kbd className="rounded bg-brand-bg px-1 py-0.5 text-[9px] text-brand-faint border border-brand-border">
          ⌘K
        </kbd>
      </div>

      {/* ── Right: Actions & Theme Toggle ─────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={surpriseMe}
          className="flex items-center gap-1.5 rounded-lg bg-brand-surface hover:bg-brand-surface-2 border border-brand-border px-3 py-1.5 text-xs font-medium text-brand-ink transition-all active:scale-95"
        >
          <span>✦ Surprise Me</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const nextMode = mode === "dark" ? "light" : "dark";
            setMode(nextMode);
            editorCore.theme.setMode(nextMode);
          }}
          title="Toggle Theme Mode"
          className="rounded-lg p-2 hover:bg-brand-surface border border-brand-border transition-colors"
        >
          {mode === "dark" ? "☀️" : "🌙"}
        </button>

        <button
          type="button"
          onClick={() => {
            const el = document.getElementById("export-btn-primary");
            if (el) el.click();
          }}
          className="rounded-lg bg-brand-accent hover:bg-brand-accent-hover text-white px-3.5 py-1.5 text-xs font-medium shadow-xs transition-all active:scale-95"
        >
          Export
        </button>
      </div>
    </header>
  );
}
