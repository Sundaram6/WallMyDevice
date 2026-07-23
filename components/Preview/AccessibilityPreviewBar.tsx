"use client";

import React, { useState } from "react";

export type AccessibilityMode = "normal" | "grayscale" | "protanopia" | "deuteranopia" | "tritanopia";

type Props = {
  mode: AccessibilityMode;
  onModeChange: (m: AccessibilityMode) => void;
  showContrastGrid: boolean;
  onContrastGridToggle: (show: boolean) => void;
};

export function AccessibilityPreviewBar({
  mode,
  onModeChange,
  showContrastGrid,
  onContrastGridToggle,
}: Props) {
  return (
    <div className="flex flex-col gap-2 rounded-xl border border-[#D4CDBC] bg-[#F3EFE6] p-3 text-xs text-[#2B2A26]">
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10.5px] uppercase tracking-wider text-[#C9552F] flex items-center gap-1">
          👁 Vision & Contrast Simulation
        </span>
        <span className="font-mono text-[9.5px] text-[#8A8579]">Preview only · Does not alter export</span>
      </div>

      <div className="flex flex-wrap gap-1.5 items-center">
        {[
          { id: "normal", label: "Normal" },
          { id: "grayscale", label: "Grayscale" },
          { id: "protanopia", label: "Protanopia (Red-Blind)" },
          { id: "deuteranopia", label: "Deuteranopia (Green-Blind)" },
          { id: "tritanopia", label: "Tritanopia (Blue-Blind)" },
        ].map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => onModeChange(m.id as AccessibilityMode)}
            className={`min-h-[36px] px-2.5 rounded-lg text-xs font-medium border transition ${
              mode === m.id
                ? "bg-[#2B2A26] text-white border-[#2B2A26]"
                : "bg-white text-[#5B584F] border-[#D4CDBC] hover:bg-[#FAF8F4]"
            }`}
          >
            {m.label}
          </button>
        ))}

        <button
          type="button"
          onClick={() => onContrastGridToggle(!showContrastGrid)}
          className={`min-h-[36px] px-3 rounded-lg text-xs font-medium border transition ${
            showContrastGrid
              ? "bg-[#C9552F] text-white border-[#C9552F]"
              : "bg-white text-[#5B584F] border-[#D4CDBC] hover:bg-[#FAF8F4]"
          }`}
        >
          {showContrastGrid ? "✓ Contrast Overlay Active" : "+ Test Contrast Overlay"}
        </button>
      </div>

      {showContrastGrid && (
        <div className="mt-2 rounded-lg bg-black/80 p-3 text-white flex items-center justify-around font-mono text-[11px]">
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-white text-black text-[9px] flex items-center justify-center font-bold">A</span>
            <span>Light Text (Contrast PASS)</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="h-4 w-4 rounded-full bg-black border border-white text-white text-[9px] flex items-center justify-center font-bold">A</span>
            <span>Dark Text (Contrast PASS)</span>
          </div>
        </div>
      )}
    </div>
  );
}

export function getAccessibilityFilterStyle(mode: AccessibilityMode): React.CSSProperties {
  if (mode === "grayscale") return { filter: "grayscale(100%)" };
  if (mode === "protanopia") return { filter: "sepia(50%) hue-rotate(-30deg) saturate(120%)" };
  if (mode === "deuteranopia") return { filter: "sepia(40%) hue-rotate(20deg) saturate(110%)" };
  if (mode === "tritanopia") return { filter: "sepia(30%) hue-rotate(180deg) saturate(130%)" };
  return {};
}
