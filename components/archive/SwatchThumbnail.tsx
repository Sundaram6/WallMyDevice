import React, { useEffect, useRef } from "react";
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
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
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
  }, [swatch, width, height]);

  return (
    <canvas
      ref={canvasRef}
      width={width}
      height={height}
      className="h-full w-full object-cover"
    />
  );
}
