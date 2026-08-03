"use client";

import React, { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { StudioCore } from "@/components/studio/StudioCore";

export function InlineStudio() {
  const [isVisible, setIsVisible] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );

    if (containerRef.current) {
      observer.observe(containerRef.current);
    }

    return () => observer.disconnect();
  }, []);

  return (
    <section
      id="studio-section"
      ref={containerRef}
      className="w-full py-16 px-4 sm:px-8 lg:px-12 border-t transition-colors duration-200"
      style={{
        background: "var(--color-bg)",
        color: "var(--color-ink)",
        borderColor: "var(--color-border)",
      }}
    >
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div
          className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b pb-4 border-paper-300"
        >
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-accent-500">
              ✦ LIVE STUDIO PREVIEW
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-ink-900 mt-1">
              Compose your wallpaper.
            </h2>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-ink-500 sm:text-right font-sans">
            Choose a generator, drop a palette, pick a device. Every change is interactive — no waiting on servers.
          </p>
        </div>

        {/* Embedded Inline Studio (Lazy mounted) */}
        {isVisible ? (
          <StudioCore layout="inline" />
        ) : (
          <div
            className="h-[600px] w-full rounded-3xl border border-paper-300 bg-paper-100 flex items-center justify-center text-xs font-mono text-ink-500"
          >
            Loading interactive studio…
          </div>
        )}

        {/* Link to Full Studio */}
        <div className="mt-6 flex justify-end">
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-ink-900 hover:text-accent-500 transition-colors duration-[--dur-fast] border-b border-paper-300 pb-0.5"
          >
            <span>Open Full-Screen Studio</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
