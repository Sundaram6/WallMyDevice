"use client";

import React, { useState, useEffect } from "react";
import { ARCHIVE_PRESETS, type SwatchRecipe } from "@/lib/presets/archive-presets";
import { SwatchThumbnail } from "@/components/archive/SwatchThumbnail";
import { useEditorStore } from "@/store/useEditorStore";

// Current Seasonal Drop presets (latest curation)
const DROP_PRESETS: SwatchRecipe[] = ARCHIVE_PRESETS.filter((p) => p.isNew).slice(0, 4);

// Fixed target deadline constant for the seasonal drop
const SEASONAL_DROP_DEADLINE_MS = new Date("2026-09-01T00:00:00Z").getTime();

function getRemainingTime() {
  const diff = Math.max(0, SEASONAL_DROP_DEADLINE_MS - Date.now());
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((diff / (1000 * 60)) % 60);
  const seconds = Math.floor((diff / 1000) % 60);
  return { days, hours, minutes, seconds };
}

export function SeasonalDropSection({ onOpenStudio }: { onOpenStudio?: () => void }) {
  const store = useEditorStore();
  const [mounted, setMounted] = useState(false);
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    setMounted(true);
    setTimeLeft(getRemainingTime());
    const timer = setInterval(() => {
      setTimeLeft(getRemainingTime());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const handleApplyPreset = (swatch: SwatchRecipe) => {
    store.setGenerator(swatch.generatorId);
    store.setPalette([...swatch.palette]);
    store.setMode(swatch.mode);
    store.setSeed(swatch.seed);
    Object.entries(swatch.params).forEach(([key, val]) => {
      store.updateParam(swatch.generatorId, key, val);
    });
    if (onOpenStudio) onOpenStudio();
  };

  return (
    <section className="w-full bg-paper-100 py-16 px-4 sm:px-8 lg:px-12 border-t border-paper-300">
      <div className="mx-auto max-w-7xl">
        {/* Banner Header */}
        <div className="rounded-3xl border border-paper-300 bg-gradient-to-r from-paper-50 via-paper-200 to-paper-50 p-6 sm:p-10 shadow-1 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-8">
          <div className="space-y-3 max-w-xl">
            <div className="inline-flex items-center gap-2 rounded-full bg-accent-500/10 border border-accent-500/30 px-3.5 py-1 text-xs font-mono text-accent-500 font-medium">
              <span className="w-2 h-2 rounded-full bg-accent-500 animate-ping" />
              <span>LIMITED SEASONAL DROP · VOL. 08</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-ink-900">
              The Winter Solstice Collection.
            </h2>
            <p className="text-xs sm:text-sm text-ink-500 leading-relaxed">
              4 exclusive hand-tuned generative algorithms released for a limited time. Curated palette curves designed specifically for modern AMOLED displays.
            </p>
          </div>

          {/* Countdown Clock */}
          <div className="flex items-center gap-3 bg-paper-50 p-4 rounded-2xl border border-paper-300 shadow-inner" suppressHydrationWarning>
            <div className="text-center px-2">
              <div className="font-mono text-xl sm:text-2xl font-bold text-ink-900" suppressHydrationWarning>
                {mounted ? String(timeLeft.days).padStart(2, "0") : "--"}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-ink-500">DAYS</div>
            </div>
            <span className="text-ink-500 text-lg font-mono">:</span>
            <div className="text-center px-2">
              <div className="font-mono text-xl sm:text-2xl font-bold text-ink-900" suppressHydrationWarning>
                {mounted ? String(timeLeft.hours).padStart(2, "0") : "--"}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-ink-500">HRS</div>
            </div>
            <span className="text-ink-500 text-lg font-mono">:</span>
            <div className="text-center px-2">
              <div className="font-mono text-xl sm:text-2xl font-bold text-ink-900" suppressHydrationWarning>
                {mounted ? String(timeLeft.minutes).padStart(2, "0") : "--"}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-ink-500">MINS</div>
            </div>
            <span className="text-ink-500 text-lg font-mono">:</span>
            <div className="text-center px-2">
              <div className="font-mono text-xl sm:text-2xl font-bold text-accent-500" suppressHydrationWarning>
                {mounted ? String(timeLeft.seconds).padStart(2, "0") : "--"}
              </div>
              <div className="font-mono text-[9px] uppercase tracking-wider text-accent-500 font-semibold">SECS</div>
            </div>
          </div>
        </div>

        {/* Drop Wallpaper Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 sm:gap-6 mt-8">
          {DROP_PRESETS.map((swatch) => (
            <div
              key={swatch.id}
              onClick={() => handleApplyPreset(swatch)}
              className="group cursor-pointer rounded-2xl border border-paper-300 bg-paper-50 p-3 transition-all duration-[--dur-fast] hover:border-accent-500 hover:-translate-y-1 shadow-1"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden rounded-xl bg-black">
                <SwatchThumbnail swatch={swatch} width={240} height={320} />
                <div className="absolute top-2 right-2 rounded-full bg-accent-500 px-2 py-0.5 font-mono text-[8.5px] font-semibold text-white shadow-md">
                  DROP
                </div>
              </div>
              <div className="mt-3 flex items-center justify-between">
                <div>
                  <div className="font-serif text-xs font-medium text-ink-900 group-hover:text-accent-500 transition-colors duration-[--dur-fast]">
                    {swatch.name}
                  </div>
                  <div className="font-mono text-[9.5px] text-ink-500 mt-0.5">#{swatch.seed}</div>
                </div>
                <div className="text-accent-500 text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-[--dur-fast]">✦</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
