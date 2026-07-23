"use client";

import React, { useState } from "react";
import type { SwatchRecipe } from "@/lib/presets/archive-presets";
import { SwatchThumbnail } from "./SwatchThumbnail";
import { getResolutionStrategyLabel, getOrientationLabel } from "@/lib/recipe/metadata";

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
      className={`group relative cursor-pointer transition-transform duration-200 hover:-translate-y-1 focus:outline-none focus:ring-2 focus:ring-[#C9552F] ${
        isSelected ? "ring-2 ring-[#C9552F] rounded-sm" : ""
      }`}
    >
      {/* 3:4 Portrait specimen frame with pinked/scalloped fabric edges */}
      <div className="relative aspect-[3/4] w-full overflow-hidden rounded-[2px] border border-[#D4CDBC] bg-[#F6F3EC]">
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
          className="absolute left-3.5 top-3.5 z-20 flex h-7 w-7 items-center justify-center rounded-full bg-[#FAF8F4]/90 text-xs text-[#5B584F] shadow-sm transition hover:text-[#C9552F]"
        >
          {isFavorite ? "♥" : "♡"}
        </button>

        {/* Truthful Resolution / Strategy Tag */}
        <div className="absolute right-0 top-3.5 z-20 rounded-l border border-r-0 border-[#D4CDBC] bg-[#FAF8F4]/90 px-2 py-1 font-mono text-[10px] text-[#5B584F]">
          {resLabel} · {orientLabel}
        </div>

        {/* Print Wallpaper Canvas Thumbnail */}
        <div className="absolute inset-[9px] overflow-hidden rounded-[1px]">
          <SwatchThumbnail swatch={swatch} isHovered={isHovered} />
        </div>

        {/* Hover Action Layer: Remix This */}
        <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity backdrop-blur-[1px]">
          <button
            type="button"
            onClick={(e) => {
              e.stopPropagation();
              onRemix?.(swatch);
            }}
            className="rounded-xl bg-[#2B2A26] px-4 py-2 text-xs font-medium text-white shadow-md hover:bg-[#C9552F] transition"
          >
            ✦ Remix This
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
          <h3 className="font-serif text-base font-medium leading-tight text-[#2B2A26] group-hover:text-[#C9552F]">
            {swatch.name}
          </h3>
          <p className="mt-0.5 text-xs text-[#8A8579]">
            {swatch.category} · {swatch.volume}
          </p>
        </div>
      </div>
    </article>
  );
}
