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
      className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1 rounded-xl p-1.5 shadow-2 border border-paper-300 backdrop-blur-md text-xs select-none bg-paper-100/90 text-ink-900"
    >
      <button
        type="button"
        onClick={() => {
          editorCore.selection.deselect();
          randomizeSeed();
        }}
        title="Randomize Seed"
        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium hover:bg-paper-200 border border-transparent hover:border-paper-300 transition-all duration-[--dur-fast]"
      >
        <span>🎲 Seed</span>
      </button>

      <button
        type="button"
        onClick={randomizePalette}
        title="Randomize Colors"
        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium hover:bg-paper-200 border border-transparent hover:border-paper-300 transition-all duration-[--dur-fast]"
      >
        <span>🎨 Colors</span>
      </button>

      <div className="h-4 w-px bg-paper-300 mx-1" />

      <button
        type="button"
        onClick={() => {
          editorCore.history.pushSnapshot("Auto Align", useEditorStore.getState());
        }}
        title="Auto Align Center"
        className="flex items-center gap-1 rounded-lg px-2 py-1.5 font-medium hover:bg-paper-200 transition-all duration-[--dur-fast]"
      >
        <span>🎯 Align</span>
      </button>

      <button
        type="button"
        onClick={surpriseMe}
        title="Randomize All"
        className="flex items-center gap-1 rounded-lg bg-accent-500 text-white px-3 py-1.5 font-medium shadow-1 hover:bg-accent-500/90 transition-all duration-[--dur-fast] active:scale-95"
      >
        <span>✦ Surprise</span>
      </button>
    </div>
  );
}
