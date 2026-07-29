"use client";

import React, { useState, useEffect, useRef } from "react";
import { SwatchThumbnail } from "@/components/archive/SwatchThumbnail";
import { ARCHIVE_PRESETS, type SwatchRecipe } from "@/lib/presets/archive-presets";

const HERO_PRESETS: SwatchRecipe[] = [
  ARCHIVE_PRESETS[0], // Terracotta Bloom
  ARCHIVE_PRESETS[1], // Indigo Garden
  ARCHIVE_PRESETS[13], // Cobalt Fracture
  ARCHIVE_PRESETS[21], // Solar Flare
];

export function S25UltraHero() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % HERO_PRESETS.length);
    }, 4500);
  };

  useEffect(() => {
    startTimer();
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const goTo = (index: number) => {
    setCurrentIndex(index);
    startTimer(); // reset timer so we don't skip quickly after manual nav
  };

  const handleTouchStart = (e: React.TouchEvent) => {
    setTouchStart(e.touches[0].clientX);
  };

  const handleTouchEnd = (e: React.TouchEvent) => {
    if (touchStart === null) return;
    const touchEnd = e.changedTouches[0].clientX;
    const diff = touchStart - touchEnd;

    if (Math.abs(diff) > 40) {
      if (diff > 0) {
        // Swiped left -> next
        goTo((currentIndex + 1) % HERO_PRESETS.length);
      } else {
        // Swiped right -> prev
        goTo((currentIndex - 1 + HERO_PRESETS.length) % HERO_PRESETS.length);
      }
    }
    setTouchStart(null);
  };

  return (
    <div
      onTouchStart={handleTouchStart}
      onTouchEnd={handleTouchEnd}
      className="relative group flex flex-col items-center justify-center gap-4 cursor-grab active:cursor-grabbing select-none"
    >
      {/* Volumetric Ambient Underglow */}
      <div className="absolute -inset-6 bg-gradient-to-tr from-[#C9552F]/20 via-[#1F3A5F]/20 to-[#8A9A6E]/15 rounded-[3.5rem] blur-3xl opacity-70 group-hover:opacity-90 transition-opacity duration-700 pointer-events-none" />

      {/* S25 Ultra Chassis Container */}
      <div className="relative w-[280px] h-[580px] sm:w-[320px] sm:h-[660px] rounded-[2.2rem] p-[3px] bg-gradient-to-b from-[#43454A] via-[#1D1E22] to-[#121316] shadow-[0_25px_60px_-15px_rgba(0,0,0,0.8),0_0_2px_1px_rgba(255,255,255,0.15)] transition-transform duration-500 hover:scale-[1.015]">
        
        {/* Outer Titanium Bezel Chamfer & Metal Texture */}
        <div className="relative w-full h-full rounded-[2.05rem] p-[10px] bg-[#16171A] ring-1 ring-white/10 shadow-inner overflow-hidden flex flex-col justify-between">
          
          {/* Subtle Metallic Grain & Side Antenna Lines */}
          <div className="absolute inset-0 bg-[radial-gradient(#ffffff_1px,transparent_1px)] [background-size:16px_16px] opacity-[0.03] pointer-events-none" />
          
          {/* Antenna Bands (Left/Right Sides) */}
          <div className="absolute top-16 -left-[3px] w-[3px] h-3 bg-[#3A3B40]" />
          <div className="absolute bottom-24 -left-[3px] w-[3px] h-3 bg-[#3A3B40]" />
          <div className="absolute top-16 -right-[3px] w-[3px] h-3 bg-[#3A3B40]" />
          <div className="absolute bottom-24 -right-[3px] w-[3px] h-3 bg-[#3A3B40]" />

          {/* Screen Container (Dynamic AMOLED Flat Display) */}
          <div className="relative w-full h-full rounded-[1.6rem] bg-black overflow-hidden shadow-2xl ring-1 ring-black/80">
            
            {/* Crossfading Wallpapers */}
            {HERO_PRESETS.map((preset, idx) => (
              <div
                key={preset.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <SwatchThumbnail swatch={preset} width={320} height={660} />
              </div>
            ))}

            {/* S25 Ultra Hole-Punch Camera (Centered Infinity-O) */}
            <div className="absolute top-3 left-1/2 -translate-x-1/2 z-30 w-3.5 h-3.5 rounded-full bg-black ring-1 ring-[#2A2B30] flex items-center justify-center shadow-xs">
              <div className="w-1.5 h-1.5 rounded-full bg-[#05101A] ring-1 ring-[#1A2535]/60" />
            </div>

            {/* Premium Screen Glass Reflection Highlights */}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/[0.04] to-transparent transform -rotate-12 scale-150" />
            <div className="pointer-events-none absolute top-0 inset-x-0 h-40 z-20 bg-gradient-to-b from-black/40 via-transparent to-transparent" />

            {/* Dot Pagination Indicators (on screen bottom) */}
            <div className="absolute bottom-5 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5">
              {HERO_PRESETS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`View wallpaper ${idx + 1}`}
                  onClick={() => goTo(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-5 h-1.5 bg-white shadow-lg"
                      : "w-1.5 h-1.5 bg-white/40 hover:bg-white/70"
                  }`}
                />
              ))}
            </div>

            {/* Screen Inner Bezel Border Accent */}
            <div className="pointer-events-none absolute inset-0 z-20 rounded-[1.6rem] ring-1 ring-inset ring-white/10" />
          </div>
        </div>

        {/* Photorealistic S25 Ultra Rear Camera Module (Floating Accent Badge peek) */}
        <div className="absolute -top-3 -right-3 z-30 flex items-center gap-1.5 bg-[#1B1C20]/90 backdrop-blur-md border border-white/15 px-3 py-1.5 rounded-full shadow-xl">
          <div className="w-2 h-2 rounded-full bg-[#C9552F] animate-pulse" />
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-white/90">
            S25 Ultra Titanium Black
          </span>
        </div>
      </div>
    </div>
  );
}
