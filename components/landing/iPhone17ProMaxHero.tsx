"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { SwatchThumbnail } from "@/components/archive/SwatchThumbnail";
import type { SwatchRecipe } from "@/lib/presets/archive-presets";
import { getGenerator } from "@/lib/generators/registry";
import { applyComboToStore, type WallpaperCombo } from "@/lib/randomization";
import { Sparkles, Shuffle, ArrowRight } from "lucide-react";

type Props = {
  combo: WallpaperCombo;
  prevCombo?: WallpaperCombo | null;
  onSurpriseMe?: () => void;
  onRemix?: () => void;
  studioUrl: string;
};

function comboToSwatchRecipe(combo: WallpaperCombo): SwatchRecipe {
  return {
    id: `hero-${combo.generatorId}-${combo.seed}`,
    name: getGenerator(combo.generatorId)?.label ?? combo.generatorId,
    category: "generative",
    categoryTag: "generative",
    volume: "Vol. 1",
    mode: "auto",
    generatorId: combo.generatorId,
    seed: combo.seed,
    palette: combo.palette,
    params: combo.params,
    tags: ["hero"],
  };
}

export function IPhone17ProMaxHero({
  combo,
  prevCombo,
  onSurpriseMe,
  onRemix,
  studioUrl,
}: Props) {
  const [activeRecipe, setActiveRecipe] = useState<SwatchRecipe>(() => comboToSwatchRecipe(combo));

  const [fadingRecipe, setFadingRecipe] = useState<SwatchRecipe | null>(null);
  const [isCrossfading, setIsCrossfading] = useState(false);

  useEffect(() => {
    const nextRecipe = comboToSwatchRecipe(combo);

    if (activeRecipe.seed !== nextRecipe.seed || activeRecipe.generatorId !== nextRecipe.generatorId) {
      setFadingRecipe(activeRecipe);
      setActiveRecipe(nextRecipe);
      setIsCrossfading(true);

      const timer = setTimeout(() => {
        setIsCrossfading(false);
        setFadingRecipe(null);
      }, 600);

      return () => clearTimeout(timer);
    }
  }, [combo, activeRecipe]);

  const generatorLabel = getGenerator(combo.generatorId)?.label ?? combo.generatorId;

  return (
    <div className="relative group flex flex-col items-center justify-center gap-4 select-none">
      {/* Volumetric Ambient Underglow */}
      <div className="absolute -inset-8 bg-gradient-to-tr from-[#C9552F]/25 via-[#4F3B78]/20 to-[#DAA520]/20 rounded-[4rem] blur-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* iPhone 17 Pro Max Outer Titanium Chassis Container */}
      <div className="relative w-[285px] h-[590px] sm:w-[325px] sm:h-[675px] rounded-[3.2rem] p-[4px] bg-gradient-to-b from-[#C4B5A5] via-[#635B53] to-[#2B2724] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85),0_0_3px_1px_rgba(255,255,255,0.25)] transition-transform duration-500 hover:scale-[1.018]">
        {/* Inner Titanium Brushed Bezel & Antenna Channels */}
        <div className="relative w-full h-full rounded-[3.05rem] p-[10px] bg-[#1E1C1A] ring-1 ring-white/15 shadow-inner overflow-hidden flex flex-col justify-between">
          {/* Subtle Titanium Brushed Grain */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />

          {/* Physical Side Buttons */}
          <div className="absolute top-24 -left-[4px] w-[4px] h-7 bg-[#8C8074] rounded-l-sm" />
          <div className="absolute top-36 -left-[4px] w-[4px] h-11 bg-[#8C8074] rounded-l-sm" />
          <div className="absolute top-52 -left-[4px] w-[4px] h-11 bg-[#8C8074] rounded-l-sm" />
          <div className="absolute top-32 -right-[4px] w-[4px] h-16 bg-[#8C8074] rounded-r-sm" />

          {/* OLED Super Retina XDR Display Container */}
          <div className="relative w-full h-full rounded-[2.6rem] bg-black overflow-hidden shadow-2xl ring-1 ring-black/90" data-testid="hero-phone-display">
            {/* Previous crossfade layer */}
            {fadingRecipe && (
              <div
                className={`absolute inset-0 transition-opacity duration-600 ease-in-out ${
                  isCrossfading ? "opacity-0 z-0" : "opacity-100 z-0"
                }`}
              >
                <SwatchThumbnail swatch={fadingRecipe} width={325} height={675} />
              </div>
            )}

            {/* Active Live Recipe Canvas */}
            <div
              className={`absolute inset-0 transition-opacity duration-600 ease-in-out z-10 ${
                isCrossfading ? "opacity-100" : "opacity-100"
              }`}
            >
              <SwatchThumbnail swatch={activeRecipe} width={325} height={675} />
            </div>

            {/* Dynamic Island optics */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-30 w-28 h-7 bg-black rounded-full ring-1 ring-white/10 flex items-center justify-between px-3 shadow-lg">
              <div className="w-3.5 h-3.5 rounded-full bg-[#050A14] ring-1 ring-[#1A2535] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0F2840] ring-1 ring-[#3A75B4]/50" />
              </div>
              <div className="w-2.5 h-2.5 rounded-full bg-[#08080C] ring-1 ring-white/10 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#181020]" />
              </div>
            </div>

            {/* Interactive Overlay Badge on Display Top */}
            <div className="absolute top-12 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-black/60 backdrop-blur-md px-3 py-1 rounded-full border border-white/15 text-[10px] font-mono text-white/90 shadow-md whitespace-nowrap" data-testid="hero-generator-badge">
              <span className="text-accent-500 font-bold">✦</span>
              <span>{generatorLabel}</span>
              <span className="text-white/40">·</span>
              <span className="text-white/70">{combo.seed.slice(0, 6)}</span>
            </div>

            {/* Screen Glass Reflection */}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent transform -rotate-12 scale-150" />
            <div className="pointer-events-none absolute top-0 inset-x-0 h-32 z-20 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

            {/* Interactive Hero Screen Bottom Action Bar */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-black/75 backdrop-blur-lg px-2.5 py-1.5 rounded-full border border-white/20 shadow-xl">
              {onSurpriseMe && (
                <button
                  type="button"
                  onClick={onSurpriseMe}
                  title="Surprise Me (Full Reroll)"
                  aria-label="Surprise Me"
                  data-testid="hero-phone-surprise-btn"
                  className="flex items-center gap-1 bg-accent-500 hover:bg-accent-600 text-white text-[10.5px] font-medium px-2.5 py-1 rounded-full transition-all active:scale-95 cursor-pointer shadow-1"
                >
                  <Sparkles size={12} className="shrink-0" />
                  <span>Surprise</span>
                </button>
              )}

              {onRemix && (
                <button
                  type="button"
                  onClick={onRemix}
                  title="Remix (Shuffle Seed & Colors)"
                  aria-label="Remix Wallpaper"
                  data-testid="hero-phone-remix-btn"
                  className="flex items-center gap-1 bg-white/15 hover:bg-white/25 text-white text-[10.5px] font-medium px-2 py-1 rounded-full transition-all active:scale-95 cursor-pointer"
                >
                  <Shuffle size={12} className="shrink-0 text-accent-500" />
                  <span>Remix</span>
                </button>
              )}

              <Link
                href={studioUrl as any}
                onClick={() => applyComboToStore(combo)}
                data-testid="hero-phone-open-studio-link"
                className="flex items-center gap-1 text-white/90 hover:text-white text-[10.5px] font-medium px-2 py-1 transition-colors"
              >
                <span>Edit</span>
                <ArrowRight size={11} className="shrink-0" />
              </Link>
            </div>

            {/* iOS Home Indicator Bar */}
            <div className="absolute bottom-1.5 left-1/2 -translate-x-1/2 z-30 w-28 h-1 bg-white/70 rounded-full shadow-sm" />

            {/* Screen Inner Bezel Ultra-thin Outline */}
            <div className="pointer-events-none absolute inset-0 z-20 rounded-[2.6rem] ring-1 ring-inset ring-white/10" />
          </div>
        </div>

        {/* Floating Pro Chassis Badge */}
        <div className="absolute -top-3.5 -right-2 z-30 flex items-center gap-1.5 bg-[#1C1A18]/95 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-xl">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-white/90">
            iPhone 17 Pro Max · Live Preview
          </span>
        </div>
      </div>
    </div>
  );
}
