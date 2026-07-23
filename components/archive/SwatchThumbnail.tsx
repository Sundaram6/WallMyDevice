import React, { useEffect, useRef, useState } from "react";
import type { SwatchRecipe } from "@/lib/presets/archive-presets";
import { ensureRegistered } from "@/lib/generators";
import { renderToTarget, buildRenderInput } from "@/lib/render/renderToTarget";
import type { Canvas2DTarget } from "@/lib/generators/types";

type Props = {
  swatch: SwatchRecipe;
  width?: number;
  height?: number;
};

export function SwatchThumbnail({ swatch, width = 240, height = 320 }: Props) {
  const containerRef = useRef<HTMLDivElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [isInView, setIsInView] = useState(false);

  // Lazy observation: only render when scrolled near viewport
  useEffect(() => {
    const el = containerRef.current;
    if (!el) return;

    // Fallback if IntersectionObserver is unsupported in test/old environments
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
        seed: swatch.seed,
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
      // Fallback clean background if webgl offscreen unavailable for thumbnail
      ctx.fillStyle = swatch.palette[0] || "#FAF8F4";
      ctx.fillRect(0, 0, width, height);
    }
  }, [isInView, swatch, width, height]);

  // Derive background gradient style for placeholder before render
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
        className={`h-full w-full object-cover ${!isInView ? "hidden" : "block"}`}
      />
    </div>
  );
}
