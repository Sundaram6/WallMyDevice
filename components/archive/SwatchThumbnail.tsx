"use client";

import React, { useEffect, useRef, useState } from "react";
import type { SwatchRecipe } from "@/lib/presets/archive-presets";
import { ensureRegistered } from "@/lib/generators";
import { renderToTarget, buildRenderInput } from "@/lib/render/renderToTarget";
import type { Canvas2DTarget } from "@/lib/generators/types";

type Props = {
  swatch: SwatchRecipe;
  width?: number;
  height?: number;
  isHovered?: boolean;
};

export function SwatchThumbnail({ swatch, width = 240, height = 320, isHovered = false }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isInView, setIsInView] = useState(false);
  const [activeSeed, setActiveSeed] = useState(swatch.seed);

  // Lazy observation: render canvas when in view
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    if (typeof IntersectionObserver === "undefined") {
      setIsInView(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setIsInView(true);
            observer.disconnect();
          }
        });
      },
      { rootMargin: "200px" }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  // Hover variation preview (pointer desktop only, respects prefers-reduced-motion)
  useEffect(() => {
    if (!isHovered) {
      setActiveSeed(swatch.seed);
      return;
    }

    const prefersReducedMotion =
      typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReducedMotion) return;

    // Hover variation preview: subtle seed variation after 200ms hover
    const timer = setTimeout(() => {
      setActiveSeed(`${swatch.seed}-var`);
    }, 200);

    return () => clearTimeout(timer);
  }, [isHovered, swatch.seed]);

  useEffect(() => {
    if (!isInView) return;

    ensureRegistered();
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const input = buildRenderInput(
      {
        generatorId: swatch.generatorId,
        params: { [swatch.generatorId]: swatch.params },
        palette: swatch.palette,
        mode: swatch.mode,
        seed: activeSeed,
        grainEnabled: false,
        grainIntensity: 0,
        blurIntensity: 0,
        overlayClock: false,
        overlayDate: false,
        overlayText: false,
        overlayTextValue: "",
        overlayFont: "Inter",
        overlaySize: 1,
      },
      { width, height }
    );

    const target: Canvas2DTarget = {
      kind: "canvas2d",
      canvas,
      ctx,
      width,
      height,
      dpr: 1,
    };

    try {
      renderToTarget(target, input);
    } catch {
      ctx.fillStyle = swatch.palette[0] || "#FAF8F4";
      ctx.fillRect(0, 0, width, height);
    }
  }, [isInView, swatch, activeSeed, width, height]);

  const placeholderBg =
    swatch.palette.length >= 2
      ? `linear-gradient(135deg, ${swatch.palette[0]} 0%, ${swatch.palette[1]} 100%)`
      : swatch.palette[0] || "#FAF8F4";

  return (
    <div ref={containerRef} className="h-full w-full relative">
      {!isInView && (
        <div
          className="h-full w-full animate-pulse transition-opacity duration-300"
          style={{ background: placeholderBg }}
        />
      )}
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className={`h-full w-full object-cover transition-opacity duration-200 ${!isInView ? "hidden" : "block"}`}
      />
    </div>
  );
}
