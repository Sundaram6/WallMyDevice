"use client";

import { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { editorCore } from "@/lib/engine/EditorCore";

type Props = {
  width: number;
  height: number;
  safeAreaTopPercent?: number;
  safeAreaBottomPercent?: number;
};

export function EditingOverlay({
  width,
  height,
  safeAreaTopPercent = 10,
  safeAreaBottomPercent = 8,
}: Props) {
  const [selected, setSelected] = useState<boolean>(false);
  const [rotation, setRotation] = useState<number>(0);

  // Proportional safe area bounds calculation
  const topPx = Math.round((height * safeAreaTopPercent) / 100);
  const bottomPx = Math.round((height * safeAreaBottomPercent) / 100);

  // Responsive selection box centered proportionally
  const boxW = Math.round(width * 0.7);
  const boxH = Math.round(height * 0.4);
  const boxX = Math.round((width - boxW) / 2);
  const boxY = Math.round((height - boxH) / 2);

  return (
    <div
      className="absolute inset-0 pointer-events-none z-30 select-none overflow-hidden"
      style={{ width, height }}
    >
      {/* ── Interactive Selection Box & Handles ─────────────────────────── */}

      {/* ── Interactive Selection Box & Handles ─────────────────────────── */}
      {selected && (
        <div
          className="absolute pointer-events-auto border-2 border-brand-accent rounded-sm transition-transform cursor-move"
          style={{
            left: boxX,
            top: boxY,
            width: boxW,
            height: boxH,
            transform: `rotate(${rotation}deg)`,
          }}
          onClick={(e) => {
            e.stopPropagation();
            setSelected(true);
            editorCore.selection.select({ id: "main-generator", type: "generator", name: "Procedural Generator" });
          }}
        >
          {/* Corner Resize Handles */}
          <div className="absolute -top-1.5 -left-1.5 h-3 w-3 rounded-xs border border-white bg-brand-accent shadow-xs cursor-nwse-resize" />
          <div className="absolute -top-1.5 -right-1.5 h-3 w-3 rounded-xs border border-white bg-brand-accent shadow-xs cursor-nesw-resize" />
          <div className="absolute -bottom-1.5 -left-1.5 h-3 w-3 rounded-xs border border-white bg-brand-accent shadow-xs cursor-nesw-resize" />
          <div className="absolute -bottom-1.5 -right-1.5 h-3 w-3 rounded-xs border border-white bg-brand-accent shadow-xs cursor-nwse-resize" />

          {/* Rotation Handle */}
          <div className="absolute -top-7 left-1/2 -translate-x-1/2 flex flex-col items-center">
            <div className="h-4 w-px bg-brand-accent" />
            <button
              type="button"
              onClick={(e) => {
                e.stopPropagation();
                setRotation((r) => (r + 45) % 360);
              }}
              title="Rotate 45°"
              className="h-4 w-4 rounded-full border border-white bg-brand-accent text-[8px] text-white flex items-center justify-center shadow-xs hover:scale-110 transition-transform cursor-grab"
            >
              ↻
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
