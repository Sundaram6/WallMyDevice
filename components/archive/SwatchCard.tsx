"use client";

import React, { useState } from "react";
import type { SwatchRecipe } from "@/lib/presets/archive-presets";
import { SwatchThumbnail } from "./SwatchThumbnail";
import { getResolutionStrategyLabel, getOrientationLabel } from "@/lib/recipe/metadata";

import { ensureRegistered } from "@/lib/generators";
import { getGenerator } from "@/lib/generators/registry";
import { renderToTarget, buildRenderInput } from "@/lib/render/renderToTarget";
import type { Canvas2DTarget } from "@/lib/generators/types";

type Props = {
  swatch: SwatchRecipe;
  isSelected?: boolean;
  isFavorite?: boolean;
  onSelect: (swatch: SwatchRecipe) => void;
  onToggleFavorite?: (swatchId: string) => void;
  onRemix?: (swatch: SwatchRecipe) => void;
};

export function SwatchCard({ swatch, isSelected, isFavorite, onSelect, onToggleFavorite, onRemix }: Props) {
  const [isHovered, setIsHovered] = useState(false);
  const resLabel = getResolutionStrategyLabel(swatch);
  const orientLabel = getOrientationLabel(swatch);

  function handleDownload(e: React.MouseEvent) {
    e.stopPropagation();
    try {
      ensureRegistered();
      const generator = getGenerator(swatch.generatorId);
      if (!generator) return;

      const width = 1920;
      const height = 1080;
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const input = {
        generatorId: swatch.generatorId,
        params: swatch.params,
        palette: swatch.palette,
        mode: swatch.mode,
        seed: swatch.seed,
        customWidth: width,
        customHeight: height,
      };

      const domTarget: Canvas2DTarget = {
        kind: "canvas2d",
        canvas,
        ctx: canvas.getContext("2d")!,
        width,
        height,
        dpr: 1,
      };

      renderToTarget(domTarget, buildRenderInput(input as any, { width, height }));

      const a = document.createElement("a");
      a.download = `${swatch.id}-1920x1080.png`;
      a.href = canvas.toDataURL("image/png");
      a.click();
    } catch (err) {
      console.error("Failed to download swatch:", err);
    }
  }

  return (
    <article
      onClick={() => onSelect(swatch)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect(swatch);
        }
      }}
      tabIndex={0}
      role="button"
      aria-pressed={isSelected}
      className={`group relative cursor-pointer transition-all duration-[--dur-fast] ease-[--ease-out] hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-accent-500 ${
        isSelected ? "ring-2 ring-[var(--accent-500)] rounded-md" : ""
      }`}
    >
      {/* 3:4 Portrait specimen frame with pinked/scalloped fabric edges */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-md border border-paper-300 bg-paper-50 shadow-1 group-hover:shadow-2 transition-shadow duration-[--dur-fast]">
        {/* Pinked scalloped top & bottom edge overlays */}
        <div className="pinked-edge-top pointer-events-none absolute inset-x-0 top-0 z-10 h-[9px]" />
        <div className="pinked-edge-bottom pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[9px]" />

        {/* Favorite Heart Badge */}
        <button
          type="button"
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite?.(swatch.id);
          }}
          aria-label={`Favorite ${swatch.name}`}
          className="absolute left-3.5 top-3.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-paper-100/90 text-xs text-ink-500 shadow-1 transition hover:text-accent-500"
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        {/* Truthful Resolution / Strategy Tag */}
        <div className="absolute right-0 top-3.5 z-20 rounded-l border border-r-0 border-paper-300 bg-paper-100/90 px-2 py-1 font-mono text-[10px] text-ink-500">
          {resLabel} · {orientLabel}
        </div>

        {/* Print Wallpaper Canvas Thumbnail */}
        <div className="absolute inset-[9px] overflow-hidden rounded-[1px]">
          <SwatchThumbnail swatch={swatch} isHovered={isHovered} />
        </div>

        {/* Hover Action Layer: Dual Actions (Download + Remix) */}
        <div className="absolute inset-0 z-30 flex flex-col items-center justify-center gap-2 p-4 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity duration-[--dur-fast] backdrop-blur-[2px]">
          <button
            type="button"
            onClick={handleDownload}
            title="Download PNG (1920×1080)"
            className="w-full max-w-[150px] flex items-center justify-center gap-1.5 rounded-xl bg-paper-0 px-3 py-2 text-xs font-medium text-ink-900 shadow-2 hover:bg-paper-200 transition-colors duration-[--dur-fast] whitespace-nowrap"
          >
            <span>⬇</span>
            <span>Download</span>
          </button>
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemix?.(swatch);
            }}
            title="Open recipe in Studio"
            className="w-full max-w-[150px] flex items-center justify-center gap-1.5 rounded-xl bg-accent-500 px-3 py-2 text-xs font-medium text-white shadow-2 hover:bg-accent-600 transition-colors duration-[--dur-fast] whitespace-nowrap"
          >
            <span>✦</span>
            <span>Remix</span>
          </button>
        </div>
      </div>

      {/* Palette Chips */}
      <div className="mt-3 flex gap-1.5">
        {swatch.palette.slice(0, 5).map((color, idx) => (
          <div
            key={idx}
            style={{ backgroundColor: color }}
            className="h-5 w-5 rounded border border-black/10 shadow-inner"
            title={color}
          />
        ))}
      </div>

      {/* Meta Information */}
      <div className="mt-2.5 flex items-start justify-between">
        <div>
          <h3 className="font-serif text-base font-medium leading-tight text-ink-900 group-hover:text-accent-500 transition-colors duration-[--dur-fast]">
            {swatch.name}
          </h3>
          <p className="mt-0.5 text-xs text-ink-500">
            {swatch.category} · {swatch.volume}
          </p>
        </div>
      </div>
    </article>
  );
}
