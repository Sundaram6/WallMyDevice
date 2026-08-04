"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { editorCore } from "@/lib/engine/EditorCore";
import { copyStudioLink } from "@/lib/share/shareUrl";
import { triggerSingleExport } from "@/lib/export/actions";

export function ContextualToolbar() {
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const reset = useEditorStore((s) => s.reset);
  const surpriseMe = useEditorStore((s) => s.surpriseMe);
  const remix = useEditorStore((s) => s.remix);
  const randomizeSeed = useEditorStore((s) => s.randomizeSeed);
  const randomizePalette = useEditorStore((s) => s.randomizePalette);

  return (
    <div
      data-testid="stage-toolbar"
      className="w-full shrink-0 z-30 border-b border-paper-300 bg-paper-100/90 backdrop-blur-md px-3 py-1.5 flex items-center justify-between gap-2 text-xs select-none text-ink-900 overflow-x-auto whitespace-nowrap"
      style={{ scrollbarWidth: "none" }}
    >
      {/* ── Left Cluster: History & Reset ───────────────────────────────── */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={undo}
          title="Undo (⌘Z)"
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium hover:bg-paper-200 border border-paper-300 bg-paper-50 transition-all duration-[--dur-fast] active:scale-95 text-ink-900 cursor-pointer"
        >
          <span>↩ Back</span>
        </button>
        <button
          type="button"
          onClick={redo}
          title="Redo (⌘⇧Z)"
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium hover:bg-paper-200 border border-paper-300 bg-paper-50 transition-all duration-[--dur-fast] active:scale-95 text-ink-900 cursor-pointer"
        >
          <span>↪ Forward</span>
        </button>
        <button
          type="button"
          onClick={reset}
          title="Reset Defaults"
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium hover:bg-red-500/10 text-red-500 border border-paper-300 bg-paper-50 transition-all duration-[--dur-fast] active:scale-95 cursor-pointer"
        >
          <span>🔄 Reset</span>
        </button>
      </div>

      {/* ── Middle Cluster: Generator Controls & Randomizers ─────────────── */}
      <div className="flex items-center gap-1.5 shrink-0">
        <button
          type="button"
          onClick={() => {
            editorCore.selection.deselect();
            randomizeSeed();
          }}
          title="Randomize Seed"
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium bg-paper-50 hover:bg-paper-200 border border-paper-300 transition-all duration-[--dur-fast] active:scale-95 cursor-pointer"
        >
          <span>🎲 Seed</span>
        </button>

        <button
          type="button"
          onClick={randomizePalette}
          title="Randomize Colors"
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium bg-paper-50 hover:bg-paper-200 border border-paper-300 transition-all duration-[--dur-fast] active:scale-95 cursor-pointer"
        >
          <span>🎨 Colors</span>
        </button>

        <button
          type="button"
          onClick={remix}
          title="Remix Style (Keep Generator, Shuffle Seed & Colors)"
          className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium bg-paper-200/80 hover:bg-paper-300 border border-paper-300 transition-all duration-[--dur-fast] active:scale-95 text-accent-500 cursor-pointer"
        >
          <span>🔀 Remix</span>
        </button>

        <button
          type="button"
          onClick={surpriseMe}
          title="Full Reroll (Random Generator + Seed + Colors)"
          className="flex items-center gap-1 rounded-lg bg-accent-500/10 hover:bg-accent-500/20 text-accent-500 border border-accent-500/30 px-3 py-1.5 font-medium transition-all duration-[--dur-fast] active:scale-95 cursor-pointer"
        >
          <span>✦ Surprise</span>
        </button>

        <button
          type="button"
          onClick={() => copyStudioLink(useEditorStore.getState())}
          title="Copy Shareable Link"
          className="flex items-center gap-1 rounded-lg border border-paper-300 bg-paper-50 hover:bg-paper-200 px-2.5 py-1.5 font-medium transition-all duration-[--dur-fast] active:scale-95 text-ink-900 cursor-pointer"
        >
          <span>🔗 Link</span>
        </button>
      </div>

      {/* ── Right Cluster: Primary Export Action ─────────────────────────── */}
      <div className="flex items-center gap-2 shrink-0">
        <button
          type="button"
          onClick={() => triggerSingleExport()}
          title="Download / Export Wallpaper"
          className="flex items-center gap-1.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white px-3.5 py-1.5 font-medium shadow-1 transition-all duration-[--dur-fast] active:scale-95 cursor-pointer"
        >
          <span>⚡ Export</span>
        </button>
      </div>
    </div>
  );
}
