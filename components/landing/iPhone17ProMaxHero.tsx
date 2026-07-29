"use client";

import React, { useState, useEffect, useRef } from "react";
import { SwatchThumbnail } from "@/components/archive/SwatchThumbnail";
import { ARCHIVE_PRESETS, type SwatchRecipe } from "@/lib/presets/archive-presets";

const HERO_PRESETS: SwatchRecipe[] = [
  ARCHIVE_PRESETS[0],  // Terracotta Bloom
  ARCHIVE_PRESETS[1],  // Indigo Garden
  ARCHIVE_PRESETS[13], // Cobalt Fracture
  ARCHIVE_PRESETS[21], // Solar Flare
  ARCHIVE_PRESETS[5]   // Velvet Midnight
];

export function IPhone17ProMaxHero() {
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
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  const goTo = (index: number) => {
    setCurrentIndex(index);
    startTimer();
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
        goTo((currentIndex + 1) % HERO_PRESETS.length);
      } else {
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
      <div className="absolute -inset-8 bg-gradient-to-tr from-[#C9552F]/25 via-[#4F3B78]/20 to-[#DAA520]/20 rounded-[4rem] blur-3xl opacity-80 group-hover:opacity-100 transition-opacity duration-700 pointer-events-none" />

      {/* iPhone 17 Pro Max Outer Titanium Chassis Container */}
      <div className="relative w-[285px] h-[590px] sm:w-[325px] sm:h-[675px] rounded-[3.2rem] p-[4px] bg-gradient-to-b from-[#C4B5A5] via-[#635B53] to-[#2B2724] shadow-[0_30px_70px_-15px_rgba(0,0,0,0.85),0_0_3px_1px_rgba(255,255,255,0.25)] transition-transform duration-500 hover:scale-[1.018]">
        
        {/* Inner Titanium Brushed Bezel & Antenna Channels */}
        <div className="relative w-full h-full rounded-[3.05rem] p-[10px] bg-[#1E1C1A] ring-1 ring-white/15 shadow-inner overflow-hidden flex flex-col justify-between">
          
          {/* Subtle Titanium Brushed Grain */}
          <div className="absolute inset-0 bg-[linear-gradient(135deg,rgba(255,255,255,0.06)_0%,transparent_50%,rgba(0,0,0,0.4)_100%)] pointer-events-none" />
          
          {/* Physical Side Action Button & Volume Rocker (Left side hints) */}
          <div className="absolute top-24 -left-[4px] w-[4px] h-7 bg-[#8C8074] rounded-l-sm" />
          <div className="absolute top-36 -left-[4px] w-[4px] h-11 bg-[#8C8074] rounded-l-sm" />
          <div className="absolute top-52 -left-[4px] w-[4px] h-11 bg-[#8C8074] rounded-l-sm" />
          
          {/* Power Button (Right side hint) */}
          <div className="absolute top-32 -right-[4px] w-[4px] h-16 bg-[#8C8074] rounded-r-sm" />

          {/* OLED Super Retina XDR Display Container */}
          <div className="relative w-full h-full rounded-[2.6rem] bg-black overflow-hidden shadow-2xl ring-1 ring-black/90">
            
            {/* Crossfading Wallpapers */}
            {HERO_PRESETS.map((preset, idx) => (
              <div
                key={preset.id}
                className={`absolute inset-0 transition-opacity duration-1000 ease-in-out ${
                  idx === currentIndex ? "opacity-100 z-10" : "opacity-0 z-0"
                }`}
              >
                <SwatchThumbnail swatch={preset} width={325} height={675} />
              </div>
            ))}

            {/* Dynamic Island (Photorealistic Pills with Lens & Sensor Optics) */}
            <div className="absolute top-3.5 left-1/2 -translate-x-1/2 z-30 w-28 h-7 bg-black rounded-full ring-1 ring-white/10 flex items-center justify-between px-3 shadow-lg">
              {/* Front Camera Lens with Blue Anti-Reflective Coating */}
              <div className="w-3.5 h-3.5 rounded-full bg-[#050A14] ring-1 ring-[#1A2535] flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#0F2840] ring-1 ring-[#3A75B4]/50" />
              </div>
              {/* Face ID Flood Illuminator Sensor optics */}
              <div className="w-2.5 h-2.5 rounded-full bg-[#08080C] ring-1 ring-white/10 flex items-center justify-center">
                <div className="w-1 h-1 rounded-full bg-[#181020]" />
              </div>
            </div>

            {/* Premium Screen Ceramic Shield Glass Reflection */}
            <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-transparent via-white/[0.06] to-transparent transform -rotate-12 scale-150" />
            <div className="pointer-events-none absolute top-0 inset-x-0 h-32 z-20 bg-gradient-to-b from-black/50 via-transparent to-transparent" />

            {/* iOS Home Indicator Bar */}
            <div className="absolute bottom-2 left-1/2 -translate-x-1/2 z-30 w-32 h-1 bg-white/70 rounded-full shadow-sm" />

            {/* Dot Pagination Indicators */}
            <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-30 flex items-center gap-1.5 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/10">
              {HERO_PRESETS.map((_, idx) => (
                <button
                  key={idx}
                  type="button"
                  aria-label={`View wallpaper ${idx + 1}`}
                  onClick={() => goTo(idx)}
                  className={`rounded-full transition-all duration-300 ${
                    idx === currentIndex
                      ? "w-4 h-1.5 bg-white shadow-md"
                      : "w-1.5 h-1.5 bg-white/40 hover:bg-white/80"
                  }`}
                />
              ))}
            </div>

            {/* Screen Inner Bezel Ultra-thin Outline */}
            <div className="pointer-events-none absolute inset-0 z-20 rounded-[2.6rem] ring-1 ring-inset ring-white/10" />
          </div>
        </div>

        {/* Floating Pro Badge */}
        <div className="absolute -top-3.5 -right-2 z-30 flex items-center gap-1.5 bg-[#1C1A18]/95 backdrop-blur-md border border-white/20 px-3 py-1.5 rounded-full shadow-xl">
          <div className="w-2 h-2 rounded-full bg-[#D4AF37] animate-pulse" />
          <span className="font-mono text-[9.5px] uppercase tracking-wider text-white/90">
            iPhone 17 Pro Max · Natural Titanium
          </span>
        </div>
      </div>
    </div>
  );
}
