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
      className="flex h-12 w-full shrink-0 items-center justify-between px-4 text-xs select-none z-20 shadow-1 border-b border-paper-200"
      style={{
        background: "var(--paper-50)",
        color: "var(--ink-900)",
      }}
    >
      {/* ── Left: App Brand & History ────────────────────────────────────── */}
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 font-serif font-semibold tracking-tight text-sm text-ink-900">
          <span className="text-accent-500">✦</span>
          <span>WallMyDevice</span>
          <span className="rounded bg-paper-100 px-1.5 py-0.5 font-mono text-[9.5px] text-ink-500 border border-paper-300">
            v2.0
          </span>
        </div>

        <div className="h-4 w-px bg-paper-300 mx-1" />

        <div className="flex items-center gap-1">
          <button
            type="button"
            onClick={undo}
            title="Undo (⌘Z)"
            className="rounded p-1.5 hover:bg-paper-100 border border-transparent hover:border-paper-300 transition-colors text-xs text-ink-700 hover:text-ink-900"
          >
            ↩ Back
          </button>
          <button
            type="button"
            onClick={redo}
            title="Redo (⌘⇧Z)"
            className="rounded p-1.5 hover:bg-paper-100 border border-transparent hover:border-paper-300 transition-colors text-xs text-ink-700 hover:text-ink-900"
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
      <div className="hidden sm:flex items-center gap-2 rounded-lg bg-paper-100 border border-paper-300 px-3 py-1 text-ink-500 font-mono text-[11px]">
        <span>🔍 Search tools, devices, presets…</span>
        <kbd className="rounded bg-paper-50 px-1 py-0.5 text-[9px] text-ink-500 border border-paper-300">
          ⌘K
        </kbd>
      </div>

      {/* ── Right: Actions & Theme Toggle ─────────────────────────────────── */}
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={() => {
            import("@/lib/share/shareUrl").then((mod) => {
              mod.copyStudioLink(useEditorStore.getState());
            });
          }}
          title="Copy Shareable Link"
          className="flex items-center gap-1.5 rounded-lg bg-paper-100 hover:bg-paper-200 border border-paper-300 px-3 py-1.5 text-xs font-medium text-ink-900 transition-all duration-[--dur-fast] active:scale-95 shadow-1 cursor-pointer"
        >
          <span>🔗 Share</span>
        </button>

        <button
          type="button"
          onClick={surpriseMe}
          title="Full Reroll (Random Generator + Seed + Palette)"
          className="flex items-center gap-1.5 rounded-lg bg-paper-100 hover:bg-paper-200 border border-paper-300 px-3 py-1.5 text-xs font-medium text-ink-900 transition-all duration-[--dur-fast] active:scale-95 shadow-1 cursor-pointer"
        >
          <span>✦ Surprise Me</span>
        </button>

        <button
          type="button"
          onClick={() => {
            const currentTheme = (typeof document !== "undefined" && document.documentElement.getAttribute("data-theme")) || "dark";
            const nextTheme = currentTheme === "dark" ? "light" : "dark";
            if (typeof document !== "undefined") {
              document.documentElement.setAttribute("data-theme", nextTheme);
              try { localStorage.setItem("wmd-theme", nextTheme); } catch {}
            }
          }}
          title="Toggle UI Chrome Theme (Light/Dark)"
          className="rounded-lg p-2 hover:bg-paper-100 border border-paper-300 transition-colors duration-[--dur-fast] text-ink-900"
        >
          <span>🌙</span>
        </button>

        <button
          type="button"
          onClick={() => {
            import("@/lib/export/actions").then((mod) => {
              mod.triggerSingleExport();
            });
          }}
          className="rounded-lg bg-accent-500 hover:bg-accent-600 text-white px-3.5 py-1.5 text-xs font-medium shadow-1 transition-all duration-[--dur-fast] active:scale-95 cursor-pointer"
        >
          Export
        </button>
      </div>
    </header>
  );
}
