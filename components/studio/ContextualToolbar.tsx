"use client";

import { useEditorStore } from "@/store/useEditorStore";
import { editorCore } from "@/lib/engine/EditorCore";
import { copyStudioLink } from "@/lib/share/shareUrl";

export function ContextualToolbar() {
  const surpriseMe = useEditorStore((s) => s.surpriseMe);
  const remix = useEditorStore((s) => s.remix);
  const randomizeSeed = useEditorStore((s) => s.randomizeSeed);
  const randomizePalette = useEditorStore((s) => s.randomizePalette);

  return (
    <div
      className="absolute top-4 left-1/2 -translate-x-1/2 z-40 flex items-center gap-1.5 rounded-xl p-1.5 shadow-2 border border-paper-300 backdrop-blur-md text-xs select-none bg-paper-100/90 text-ink-900"
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

      <button
        type="button"
        onClick={remix}
        title="Remix Style (Keep Generator, Shuffle Seed & Colors)"
        className="flex items-center gap-1 rounded-lg px-2.5 py-1.5 font-medium bg-paper-200/80 hover:bg-paper-300 border border-paper-300 transition-all duration-[--dur-fast] active:scale-95 text-accent-500"
      >
        <span>🔀 Remix</span>
      </button>

      <div className="h-4 w-px bg-paper-300 mx-0.5" />

      <button
        type="button"
        onClick={surpriseMe}
        title="Full Reroll (Random Generator + Seed + Colors)"
        className="flex items-center gap-1 rounded-lg bg-accent-500 text-white px-3 py-1.5 font-medium shadow-1 hover:bg-accent-600 transition-all duration-[--dur-fast] active:scale-95"
      >
        <span>✦ Surprise</span>
      </button>

      <button
        type="button"
        onClick={() => copyStudioLink(useEditorStore.getState())}
        title="Copy Shareable Link"
        className="flex items-center gap-1 rounded-lg border border-paper-300 bg-paper-50 hover:bg-paper-200 px-2.5 py-1.5 font-medium transition-all duration-[--dur-fast] active:scale-95 text-ink-900"
      >
        <span>🔗 Link</span>
      </button>
    </div>
  );
}
