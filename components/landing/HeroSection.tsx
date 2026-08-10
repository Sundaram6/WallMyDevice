"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { IPhone17ProMaxHero } from "@/components/landing/iPhone17ProMaxHero";
import { CURATED_COLLECTIONS } from "@/lib/presets/collections";
import { listGenerators, getGenerator, getDefaultParams } from "@/lib/generators";
import {
  getRandomCombo,
  getRemixCombo,
  applyComboToStore,
  type WallpaperCombo,
} from "@/lib/randomization";
import { buildShareQueryString } from "@/lib/share/shareUrl";
import { Sparkles, Shuffle, ArrowRight } from "lucide-react";

type Props = {
  onOpenStudioClick?: () => void;
};

const DEFAULT_HERO_COMBO: WallpaperCombo = {
  generatorId: "waveform",
  seed: "k3p9x2a7",
  palette: ["#1F3A5F", "#8A9A6E", "#D9541F", "#FAF7F0"],
  params: getDefaultParams("waveform"),
};

/** Animated count-up hook using Intersection Observer */
function useCountUp(target: number, durationMs = 1600, startOnce = true) {
  const [count, setCount] = useState(target);
  const hasAnimated = useRef(false);
  const ref = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && (!startOnce || !hasAnimated.current)) {
          hasAnimated.current = true;
          const start = performance.now();
          const tick = (now: number) => {
            const elapsed = now - start;
            const progress = Math.min(elapsed / durationMs, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.1 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, durationMs, startOnce]);

  return { count, ref };
}

export function HeroSection({ onOpenStudioClick }: Props) {
  const [combo, setCombo] = useState<WallpaperCombo>(DEFAULT_HERO_COMBO);
  const [prevCombo, setPrevCombo] = useState<WallpaperCombo | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    // On mount, pick a random combo for initial fresh display
    setCombo(getRandomCombo());
  }, []);

  const handleSurpriseMe = () => {
    setPrevCombo(combo);
    setCombo(getRandomCombo(combo.generatorId));
  };

  const handleRemix = () => {
    setPrevCombo(combo);
    setCombo(getRemixCombo(combo.generatorId));
  };

  const currentGenLabel = getGenerator(combo.generatorId)?.label ?? combo.generatorId;

  // Build share query string for studio CTAs so the user lands in Studio with exact wallpaper state
  const studioQuery = buildShareQueryString({
    generatorId: combo.generatorId,
    seed: combo.seed,
    palette: combo.palette,
    deviceType: "phone",
  });
  const studioUrl = `/studio?${studioQuery}`;

  const generatorsCount = listGenerators().length;
  const collectionsCount = CURATED_COLLECTIONS.length;

  const generators = useCountUp(generatorsCount, 1400);
  const collections = useCountUp(collectionsCount, 1600);
  const devices = useCountUp(5, 1200);

  return (
    <section className="relative w-full bg-paper-50 text-ink-900 pt-16 pb-24 px-6 sm:px-10 lg:px-16 overflow-hidden border-b border-paper-300">
      {/* Background Noise & Ambient Animated Glow Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--ink-900)_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-accent-500/20 rounded-full blur-[120px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-accent-500/10 rounded-full blur-[140px] pointer-events-none animate-float-reverse" />

      <div className="relative mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Copy & Interactive CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-accent-500 border-b border-accent-500/40 pb-0.5">
            ✦ PRINTABLE WALLPAPER STUDIO
          </span>

          <h1 className="font-serif text-5xl sm:text-6xl lg:text-7xl font-normal leading-[1.08] text-ink-900 tracking-tight">
            Wallpapers,<br />
            <span className="italic font-serif text-accent-500">rendered</span> for<br />
            your device.
          </h1>

          <p className="max-w-lg text-sm sm:text-base leading-relaxed text-ink-500 font-sans">
            A generative print house. Every wallpaper is a seed, a palette and a curve — customizable in real-time, exported at native resolution, entirely in your browser.
          </p>

          {/* CTAs with Surprise Me & Remix interactions */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <Link
              href={studioUrl as any}
              onClick={() => applyComboToStore(combo)}
              data-testid="hero-open-studio-btn"
              className="inline-flex items-center justify-center gap-2 rounded-pill px-6 py-3.5 text-xs font-medium font-sans bg-accent-500 text-paper-0 hover:bg-accent-500/90 shadow-1 hover:shadow-2 transition-all duration-[--dur-fast] active:scale-[0.99]"
            >
              <span>Open in Studio</span>
              <ArrowRight size={14} className="shrink-0" />
            </Link>

            <button
              type="button"
              onClick={handleSurpriseMe}
              data-testid="hero-surprise-me-btn"
              title="Reroll full generator, seed, and color palette"
              aria-label="Surprise Me"
              className="inline-flex items-center justify-center gap-1.5 rounded-pill border border-accent-500/40 bg-accent-500/10 text-accent-500 px-5 py-3.5 text-xs font-medium font-sans hover:bg-accent-500/20 shadow-1 transition-all duration-[--dur-fast] active:scale-95 cursor-pointer"
            >
              <Sparkles size={14} className="shrink-0" />
              <span>Surprise Me</span>
            </button>

            <button
              type="button"
              onClick={handleRemix}
              data-testid="hero-remix-btn"
              title="Remix seed and colors for current style"
              aria-label="Remix Wallpaper"
              className="inline-flex items-center justify-center gap-1.5 rounded-pill border border-paper-300 bg-paper-50 px-4 py-3.5 text-xs font-medium font-sans text-ink-900 hover:bg-paper-100 shadow-1 transition-all duration-[--dur-fast] active:scale-95 cursor-pointer"
            >
              <Shuffle size={14} className="shrink-0 text-accent-500" />
              <span>Remix</span>
            </button>

            <Link
              href="/archive"
              className="inline-flex items-center justify-center gap-1.5 rounded-pill border border-paper-300 bg-paper-50 px-5 py-3.5 text-xs font-medium font-sans text-ink-700 hover:text-ink-900 hover:bg-paper-100 shadow-1 transition-all duration-[--dur-fast]"
            >
              <span>Archive</span>
            </Link>
          </div>

          {/* Active Preview Metadata Tag */}
          <div className="flex items-center gap-2 pt-1 font-mono text-[11px] text-ink-500" data-testid="hero-combo-info">
            <span className="w-2 h-2 rounded-full bg-accent-500 shrink-0" />
            <span>Style: <strong className="font-semibold text-ink-900">{currentGenLabel}</strong></span>
            <span>·</span>
            <span>Seed: <code className="font-mono text-ink-700">{combo.seed.slice(0, 8)}</code></span>
          </div>

          {/* Stats Bar with Count-Up Animation */}
          <div className="pt-6 border-t border-paper-300 w-full grid grid-cols-3 gap-4 max-w-md text-left">
            <div ref={generators.ref}>
              <div className="font-serif text-2xl font-medium text-ink-900 tabular-nums">
                {generators.count}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-500">GENERATORS</div>
            </div>
            <div ref={collections.ref}>
              <div className="font-serif text-2xl font-medium text-ink-900 tabular-nums">
                {collections.count}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-500">COLLECTIONS</div>
            </div>
            <div ref={devices.ref}>
              <div className="font-serif text-2xl font-medium text-ink-900 tabular-nums">
                {devices.count}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-ink-500">DEVICE TYPES</div>
            </div>
          </div>
        </div>

        {/* Right Column: Hyper-Realistic iPhone 17 Pro Max Live Hero */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <IPhone17ProMaxHero
            combo={combo}
            prevCombo={prevCombo}
            onSurpriseMe={handleSurpriseMe}
            onRemix={handleRemix}
            studioUrl={studioUrl}
          />
        </div>
      </div>
    </section>
  );
}
