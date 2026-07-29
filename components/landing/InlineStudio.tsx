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
    <section id="studio-section" ref={containerRef} className="w-full bg-[#FAF8F4] py-16 px-4 sm:px-8 lg:px-12">
      <div className="mx-auto max-w-7xl">
        {/* Section Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-8 gap-4 border-b border-[#E4DFD3] pb-4">
          <div>
            <span className="font-mono text-[10px] uppercase tracking-widest text-[#C9552F]">
              ✦ LIVE STUDIO PREVIEW
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl font-normal text-[#2B2A26] mt-1">
              Compose your wallpaper.
            </h2>
          </div>
          <p className="max-w-xs text-xs leading-relaxed text-[#5B584F] sm:text-right font-sans">
            Choose a generator, drop a palette, pick a device. Every change is interactive — no waiting on servers.
          </p>
        </div>

        {/* Embedded Inline Studio (Lazy mounted) */}
        {isVisible ? (
          <StudioCore layout="inline" />
        ) : (
          <div className="h-[600px] w-full rounded-3xl border border-[#D4CDBC] bg-[#F3EFE6] flex items-center justify-center text-xs font-mono text-[#8A8579]">
            Loading interactive studio…
          </div>
        )}

        {/* Link to Full Studio */}
        <div className="mt-6 flex justify-end">
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 text-xs font-medium text-[#2B2A26] hover:text-[#C9552F] transition border-b border-[#2B2A26] hover:border-[#C9552F] pb-0.5"
          >
            <span>Open Full-Screen Studio</span>
            <span>→</span>
          </Link>
        </div>
      </div>
    </section>
  );
}
