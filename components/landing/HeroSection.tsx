"use client";

import Link from "next/link";
import React, { useEffect, useRef, useState } from "react";
import { IPhone17ProMaxHero } from "@/components/landing/iPhone17ProMaxHero";
import { CURATED_COLLECTIONS } from "@/lib/presets/collections";
import { listGenerators } from "@/lib/generators";

type Props = {
  onOpenStudioClick?: () => void;
};

/** Animated count-up hook using Intersection Observer */
function useCountUp(target: number, durationMs = 1600, startOnce = true) {
  const [count, setCount] = useState(0);
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
            // Ease-out cubic
            const eased = 1 - Math.pow(1 - progress, 3);
            setCount(Math.round(eased * target));
            if (progress < 1) requestAnimationFrame(tick);
          };
          requestAnimationFrame(tick);
        }
      },
      { threshold: 0.5 }
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [target, durationMs, startOnce]);

  return { count, ref };
}

export function HeroSection({ onOpenStudioClick }: Props) {
  const generatorsCount = listGenerators().length;
  const collectionsCount = CURATED_COLLECTIONS.length;

  const generators = useCountUp(generatorsCount, 1400);
  const collections = useCountUp(collectionsCount, 1600);
  const devices = useCountUp(5, 1200);

  return (
    <section className="relative w-full bg-brand-bg text-brand-ink pt-16 pb-24 px-6 sm:px-10 lg:px-16 overflow-hidden border-b border-brand-border">
      {/* Background Noise & Ambient Animated Glow Orbs */}
      <div className="absolute inset-0 bg-[radial-gradient(var(--color-ink)_1px,transparent_1px)] [background-size:24px_24px] opacity-[0.04] pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-96 h-96 bg-brand-accent/20 rounded-full blur-[120px] pointer-events-none animate-float-slow" />
      <div className="absolute bottom-10 right-10 w-96 h-96 bg-brand-accent/10 rounded-full blur-[140px] pointer-events-none animate-float-reverse" />

      <div className="relative mx-auto max-w-7xl grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
        {/* Left Column: Copy & CTAs */}
        <div className="lg:col-span-7 flex flex-col items-start space-y-6">
          <span className="font-mono text-[10px] uppercase tracking-widest text-brand-accent border-b border-brand-accent/40 pb-0.5">
            ✦ PRINTABLE WALLPAPER STUDIO
          </span>

          <h1 className="font-serif text-4xl sm:text-5xl lg:text-6xl font-normal leading-[1.1] text-brand-ink tracking-tight">
            Wallpapers,<br />
            <span className="italic font-serif text-brand-accent">rendered</span> for<br />
            your device.
          </h1>

          <p className="max-w-lg text-sm sm:text-base leading-relaxed text-brand-muted font-sans">
            A generative print house. Every wallpaper is a seed, a palette and a curve — customizable in real-time, exported at native resolution, entirely in your browser.
          </p>

          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              type="button"
              onClick={onOpenStudioClick}
              className="rounded-full bg-brand-accent px-6 py-3.5 text-xs font-medium text-white shadow-lg hover:bg-brand-accent-hover transition-all transform hover:-translate-y-0.5"
            >
              Open the Studio ✦
            </button>
            <Link
              href="/archive"
              className="rounded-full border border-brand-border bg-brand-surface px-6 py-3.5 text-xs font-medium text-brand-ink hover:bg-brand-surface-2 transition shadow-2xs"
            >
              Browse Archive →
            </Link>
          </div>

          {/* Stats Bar with Count-Up Animation */}
          <div className="pt-8 border-t border-brand-border w-full grid grid-cols-3 gap-4 max-w-md text-left">
            <div ref={generators.ref}>
              <div className="font-serif text-2xl font-medium text-brand-ink tabular-nums">
                {generators.count}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-brand-faint">GENERATORS</div>
            </div>
            <div ref={collections.ref}>
              <div className="font-serif text-2xl font-medium text-brand-ink tabular-nums">
                {collections.count}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-brand-faint">COLLECTIONS</div>
            </div>
            <div ref={devices.ref}>
              <div className="font-serif text-2xl font-medium text-brand-ink tabular-nums">
                {devices.count}
              </div>
              <div className="font-mono text-[10px] uppercase tracking-wider text-brand-faint">DEVICE TYPES</div>
            </div>
          </div>
        </div>

        {/* Right Column: Hyper-Realistic iPhone 17 Pro Max Hero */}
        <div className="lg:col-span-5 flex justify-center lg:justify-end">
          <IPhone17ProMaxHero />
        </div>
      </div>
    </section>
  );
}
