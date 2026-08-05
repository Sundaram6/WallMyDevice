"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { editorCore } from "@/lib/engine/EditorCore";
import { copyStudioLink } from "@/lib/share/shareUrl";
import { triggerSingleExport } from "@/lib/export/actions";
import {
  Undo2,
  Redo2,
  RotateCcw,
  Dices,
  Palette,
  Shuffle,
  Sparkles,
  Link2,
  Download,
} from "lucide-react";

export function ContextualToolbar() {
  const historyVersion = useEditorStore((s) => s.historyVersion);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const reset = useEditorStore((s) => s.reset);
  const canUndo = editorCore.history.canUndo();
  const canRedo = editorCore.history.canRedo();
  const surpriseMe = useEditorStore((s) => s.surpriseMe);
  const remix = useEditorStore((s) => s.remix);
  const randomizeSeed = useEditorStore((s) => s.randomizeSeed);
  const randomizePalette = useEditorStore((s) => s.randomizePalette);

  return (
    <div
      data-testid="stage-toolbar"
      className="w-full shrink-0 z-30 border-b border-paper-300 bg-paper-100/90 backdrop-blur-md px-2 sm:px-3 py-1.5 flex items-center justify-between gap-1.5 sm:gap-2 text-xs select-none text-ink-900"
    >
      {/* ── (a) Zone A: Left Fixed History & Reset (Never Scrolls, Always Visible) ── */}
      <div className="flex items-center gap-1 sm:gap-1.5 shrink-0 z-10 bg-paper-100/90 pr-1">
        <button
          type="button"
          onClick={undo}
          disabled={!canUndo}
          title="Undo (⌘Z)"
          aria-label="Undo"
          className={`flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1.5 font-medium border border-paper-300 bg-paper-50 transition-all duration-[--dur-fast] ${
            canUndo
              ? "hover:bg-paper-200 text-ink-900 cursor-pointer active:scale-95"
              : "opacity-40 text-ink-400 cursor-not-allowed pointer-events-none"
          }`}
        >
          <Undo2 size={15} strokeWidth={2} className={`shrink-0 ${canUndo ? "text-ink-900" : "text-ink-400"}`} />
          <span className="hidden sm:inline">Back</span>
        </button>

        <button
          type="button"
          onClick={redo}
          disabled={!canRedo}
          title="Redo (⌘⇧Z)"
          aria-label="Redo"
          className={`flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1.5 font-medium border border-paper-300 bg-paper-50 transition-all duration-[--dur-fast] ${
            canRedo
              ? "hover:bg-paper-200 text-ink-900 cursor-pointer active:scale-95"
              : "opacity-40 text-ink-400 cursor-not-allowed pointer-events-none"
          }`}
        >
          <Redo2 size={15} strokeWidth={2} className={`shrink-0 ${canRedo ? "text-ink-900" : "text-ink-400"}`} />
          <span className="hidden sm:inline">Forward</span>
        </button>

        <button
          type="button"
          onClick={reset}
          title="Reset Defaults"
          aria-label="Reset Defaults"
          className="flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1.5 font-medium hover:bg-red-500/10 text-red-500 border border-paper-300 bg-paper-50 transition-all duration-[--dur-fast] active:scale-95 cursor-pointer"
        >
          <RotateCcw size={15} strokeWidth={2} className="shrink-0 text-red-500" />
          <span className="hidden sm:inline">Reset</span>
        </button>
      </div>

      {/* ── (b) Zone B: Center Scrollable Container with Edge-Fade Gradient Masks ── */}
      <div className="relative flex-1 min-w-0 overflow-hidden flex items-center mx-1">
        {/* Left Edge Fade Mask */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-3.5 z-10 bg-gradient-to-r from-paper-100 to-transparent opacity-90" />

        {/* Scrollable Action Container */}
        <div
          className="w-full flex items-center gap-1 sm:gap-1.5 overflow-x-auto whitespace-nowrap px-1.5 py-0.5"
          style={{ scrollbarWidth: "none" }}
        >
          <button
            type="button"
            onClick={() => {
              editorCore.selection.deselect();
              randomizeSeed();
            }}
            title="Randomize Seed"
            aria-label="Randomize Seed"
            className="flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1.5 font-medium bg-paper-50 hover:bg-paper-200 border border-paper-300 transition-all duration-[--dur-fast] active:scale-95 text-ink-900 cursor-pointer shrink-0"
          >
            <Dices size={15} strokeWidth={2} className="shrink-0 text-ink-900" />
            <span className="hidden sm:inline">Seed</span>
          </button>

          <button
            type="button"
            onClick={randomizePalette}
            title="Randomize Colors"
            aria-label="Randomize Colors"
            className="flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1.5 font-medium bg-paper-50 hover:bg-paper-200 border border-paper-300 transition-all duration-[--dur-fast] active:scale-95 text-ink-900 cursor-pointer shrink-0"
          >
            <Palette size={15} strokeWidth={2} className="shrink-0 text-ink-900" />
            <span className="hidden sm:inline">Colors</span>
          </button>

          <button
            type="button"
            onClick={remix}
            title="Remix Style (Keep Generator, Shuffle Seed & Colors)"
            aria-label="Remix Style"
            className="flex items-center gap-1 rounded-lg px-2 sm:px-2.5 py-1.5 font-medium bg-paper-200/80 hover:bg-paper-300 border border-paper-300 transition-all duration-[--dur-fast] active:scale-95 text-accent-500 cursor-pointer shrink-0"
          >
            <Shuffle size={15} strokeWidth={2} className="shrink-0 text-accent-500" />
            <span className="hidden sm:inline">Remix</span>
          </button>

          <button
            type="button"
            onClick={surpriseMe}
            title="Full Reroll (Random Generator + Seed + Colors)"
            aria-label="Full Reroll"
            className="flex items-center gap-1 rounded-lg bg-accent-500/10 hover:bg-accent-500/20 text-accent-500 border border-accent-500/30 px-2.5 sm:px-3 py-1.5 font-medium transition-all duration-[--dur-fast] active:scale-95 cursor-pointer shrink-0"
          >
            <Sparkles size={15} strokeWidth={2} className="shrink-0 text-accent-500" />
            <span className="hidden sm:inline">Surprise</span>
          </button>

          <button
            type="button"
            onClick={() => copyStudioLink(useEditorStore.getState())}
            title="Copy Shareable Link"
            aria-label="Copy Shareable Link"
            className="flex items-center gap-1 rounded-lg border border-paper-300 bg-paper-50 hover:bg-paper-200 px-2 sm:px-2.5 py-1.5 font-medium transition-all duration-[--dur-fast] active:scale-95 text-ink-900 cursor-pointer shrink-0"
          >
            <Link2 size={15} strokeWidth={2} className="shrink-0 text-ink-900" />
            <span className="hidden sm:inline">Link</span>
          </button>
        </div>

        {/* Right Edge Fade Mask */}
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-3.5 z-10 bg-gradient-to-l from-paper-100 to-transparent opacity-90" />
      </div>

      {/* ── (c) Zone C: Right Fixed Export Action (Never Scrolls, Always Visible) ── */}
      <div className="flex items-center gap-1.5 shrink-0 z-10 bg-paper-100/90 pl-1">
        <button
          type="button"
          onClick={() => triggerSingleExport()}
          title="Download / Export Wallpaper"
          aria-label="Download / Export Wallpaper"
          className="flex items-center gap-1 sm:gap-1.5 rounded-lg bg-accent-500 hover:bg-accent-600 text-white px-2.5 sm:px-3.5 py-1.5 font-medium shadow-1 transition-all duration-[--dur-fast] active:scale-95 cursor-pointer"
        >
          <Download size={15} strokeWidth={2} className="shrink-0 text-white" />
          <span className="hidden sm:inline">Export</span>
        </button>
      </div>
    </div>
  );
}
