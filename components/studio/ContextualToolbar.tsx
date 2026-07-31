"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { editorCore } from "@/lib/engine/EditorCore";

export function ContextualToolbar() {
  const surpriseMe = useEditorStore((s) => s.surpriseMe);
  const randomizeSeed = useEditorStore((s) => s.randomizeSeed);
  const randomizePalette = useEditorStore((s) => s.randomizePalette);
  const undo = useEditorStore((s) => s.undo);
  const redo = useEditorStore((s) => s.redo);
  const reset = useEditorStore((s) => s.reset);

  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 rounded-xl p-1.5 shadow-xl border border-brand-border backdrop-blur-md text-xs select-none"
      style={{
        background: "var(--color-card-bg)",
        color: "var(--color-ink)",
      }}
    >
      <button
        type="button"
        onClick={undo}
        title="Undo Action (⌘Z)"
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 font-medium hover:bg-brand-surface border border-transparent hover:border-brand-border transition-all"
      >
        <span>↩ Back</span>
      </button>

      <button
        type="button"
        onClick={redo}
        title="Redo Action (⌘⇧Z)"
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 font-medium hover:bg-brand-surface border border-transparent hover:border-brand-border transition-all"
      >
        <span>↪ Forward</span>
      </button>

      <button
        type="button"
        onClick={reset}
        title="Reset to Defaults"
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 font-medium hover:bg-red-500/10 text-red-500 border border-transparent hover:border-red-500/30 transition-all"
      >
        <span>🔄 Reset</span>
      </button>

      <div className="h-4 w-px bg-brand-border mx-1" />

      <button
        type="button"
        onClick={() => {
          editorCore.selection.deselect();
          randomizeSeed();
        }}
        title="Randomize Seed"
        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium hover:bg-brand-surface border border-transparent hover:border-brand-border transition-all"
      >
        <span>🎲 Seed</span>
      </button>

      <button
        type="button"
        onClick={randomizePalette}
        title="Randomize Colors"
        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium hover:bg-brand-surface border border-transparent hover:border-brand-border transition-all"
      >
        <span>🎨 Colors</span>
      </button>

      <div className="h-4 w-px bg-brand-border mx-1" />

      <button
        type="button"
        onClick={() => {
          editorCore.history.pushSnapshot("Auto Align", useEditorStore.getState());
        }}
        title="Auto Align Center"
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 font-medium hover:bg-brand-surface transition-all"
      >
        <span>🎯 Align</span>
      </button>

      <button
        type="button"
        onClick={surpriseMe}
        title="Randomize All"
        className="flex items-center gap-1 rounded-lg bg-brand-accent text-white px-3 py-1.5 font-medium shadow-xs hover:bg-brand-accent-hover transition-all active:scale-95"
      >
        <span>✦ Surprise</span>
      </button>
    </div>
  );
}
