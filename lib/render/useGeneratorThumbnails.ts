"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import { getGenerator } from "@/lib/generators/registry";
import { createRng } from "@/lib/prng";
import type { Canvas2DTarget } from "@/lib/generators/types";

/** Curated per-generator palettes for thumbnails — chosen to look vibrant and representative */
const GENERATOR_PALETTES: Record<string, { dark: string[]; light: string[] }> = {
  waveform: {
    dark: ["#0d0d1a", "#7c3aed", "#a855f7", "#e879f9", "#f0abfc"],
    light: ["#f5f3ff", "#7c3aed", "#a855f7", "#c084fc", "#e9d5ff"],
  },
  geometric: {
    dark: ["#0a0f1e", "#f59e0b", "#ef4444", "#3b82f6", "#10b981"],
    light: ["#fefce8", "#f59e0b", "#ef4444", "#3b82f6", "#10b981"],
  },
  typography: {
    dark: ["#0f172a", "#f8fafc", "#94a3b8", "#64748b"],
    light: ["#f8fafc", "#0f172a", "#334155", "#64748b"],
  },
  "fluid-gradient": {
    dark: ["#090d14", "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff"],
    light: ["#090d14", "#ff6b6b", "#ffd93d", "#6bcb77", "#4d96ff"],
  },
  "mesh-gradient": {
    dark: ["#180830", "#f472b6", "#a78bfa", "#38bdf8", "#34d399"],
    light: ["#180830", "#f472b6", "#a78bfa", "#38bdf8", "#34d399"],
  },
  "aurora-flow": {
    dark: ["#030f0a", "#22d3ee", "#6ee7b7", "#a3e635", "#4ade80"],
    light: ["#030f0a", "#22d3ee", "#6ee7b7", "#a3e635", "#4ade80"],
  },
  "duotone-burst": {
    dark: ["#1e0030", "#ff00ff", "#00ffff"],
    light: ["#f0f0ff", "#7c3aed", "#06b6d4"],
  },
  "flow-field": {
    dark: ["#0a0a0a", "#ff4444", "#ff8800", "#ffcc00", "#00ff88"],
    light: ["#fafafa", "#dc2626", "#ea580c", "#ca8a04", "#16a34a"],
  },
  "grain-texture": {
    dark: ["#1c1410", "#d97706", "#92400e", "#fbbf24"],
    light: ["#fef3c7", "#92400e", "#d97706", "#78350f"],
  },
  "marble-fluid": {
    dark: ["#0f0f0f", "#e2e8f0", "#94a3b8", "#475569", "#1e293b"],
    light: ["#f8fafc", "#1e293b", "#475569", "#94a3b8", "#cbd5e1"],
  },
  "voronoi-mosaic": {
    dark: ["#0d0d2b", "#3b82f6", "#8b5cf6", "#ec4899", "#f59e0b"],
    light: ["#f0f4ff", "#2563eb", "#7c3aed", "#db2777", "#d97706"],
  },
  "lowpoly-terrain": {
    dark: ["#001a0d", "#10b981", "#34d399", "#6ee7b7", "#a7f3d0"],
    light: ["#f0fdf4", "#15803d", "#16a34a", "#22c55e", "#4ade80"],
  },
  "halftone-dots": {
    dark: ["#1a0000", "#ef4444", "#fbbf24", "#f9a8d4"],
    light: ["#fff1f2", "#ef4444", "#f59e0b", "#fbcfe8"],
  },
  "bauhaus-blocks": {
    dark: ["#000000", "#ef4444", "#3b82f6", "#eab308", "#ffffff"],
    light: ["#ffffff", "#dc2626", "#2563eb", "#ca8a04", "#111827"],
  },
  "topographic-lines": {
    dark: ["#052e16", "#16a34a", "#4ade80", "#a7f3d0"],
    light: ["#f0fdf4", "#166534", "#15803d", "#16a34a"],
  },
  metaballs: {
    dark: ["#0d0820", "#f472b6", "#8b5cf6", "#38bdf8"],
    light: ["#fdf2f8", "#ec4899", "#7c3aed", "#0ea5e9"],
  },
  "wave-interference": {
    dark: ["#000814", "#00b4d8", "#0077b6", "#90e0ef", "#caf0f8"],
    light: ["#f0f9ff", "#0369a1", "#0284c7", "#38bdf8", "#7dd3fc"],
  },
  "starfield-nebula": {
    dark: ["#000000", "#1e1b4b", "#4c1d95", "#db2777", "#f9a8d4"],
    light: ["#0f0523", "#1e1b4b", "#4c1d95", "#7c3aed", "#a855f7"],
  },
};

const THUMBNAIL_W = 160;
const THUMBNAIL_H = 200;

/** Seeds — one per mode, derived from generator id so they're stable and varied */
function getThumbnailSeed(generatorId: string, mode: "light" | "dark"): string {
  return `thumb-${generatorId}-${mode}`;
}

export type ThumbnailMap = Record<string, { light: string; dark: string }>;

/**
 * Renders small thumbnails for all 18 generators (both light and dark mode variants).
 * Returns a stable map of { generatorId → { light: dataURL, dark: dataURL } }.
 * Thumbnails are rendered sequentially using requestIdleCallback/setTimeout to avoid
 * blocking the main thread during startup.
 */
export function useGeneratorThumbnails(generatorIds: string[]): ThumbnailMap {
  const [thumbnails, setThumbnails] = useState<ThumbnailMap>({});
  const renderedRef = useRef(new Set<string>());
  const activeRef = useRef(true);

  const renderAll = useCallback(() => {
    if (typeof window === "undefined") return;

    const schedule =
      typeof (window as any).requestIdleCallback === "function"
        ? (fn: () => void) => (window as any).requestIdleCallback(fn, { timeout: 2000 })
        : (fn: () => void) => setTimeout(fn, 0);

    let idx = 0;

    function renderNext() {
      if (!activeRef.current) return;
      if (idx >= generatorIds.length) return;

      const gId = generatorIds[idx++];
      if (!gId || renderedRef.current.has(gId)) {
        schedule(renderNext);
        return;
      }

      const generator = getGenerator(gId);
      if (!generator) {
        renderedRef.current.add(gId);
        schedule(renderNext);
        return;
      }
      // Note: shader generators (e.g. fluid-gradient) have a canvas2d fallback path —
      // we always pass a canvas2d target so they degrade gracefully for thumbnails.

      try {
        const palettes = GENERATOR_PALETTES[gId] ?? {
          dark: ["#0f172a", "#7c3aed", "#a855f7"],
          light: ["#f8fafc", "#3b82f6", "#a855f7"],
        };

        const results: { light?: string; dark?: string } = {};

        for (const mode of ["dark", "light"] as const) {
          const canvas = document.createElement("canvas");
          canvas.width = THUMBNAIL_W;
          canvas.height = THUMBNAIL_H;
          const ctx = canvas.getContext("2d");
          if (!ctx) continue;

          const palette = palettes[mode];
          const seed = getThumbnailSeed(gId, mode);
          const rng = createRng(seed);
          const defaults = (generator.schema as any)?.defaults ?? {};

          const target: Canvas2DTarget = {
            kind: "canvas2d",
            canvas,
            ctx: ctx as CanvasRenderingContext2D,
            width: THUMBNAIL_W,
            height: THUMBNAIL_H,
            dpr: 1,
          };

          // Fill background with first palette color first
          ctx.fillStyle = palette[0] ?? "#000000";
          ctx.fillRect(0, 0, THUMBNAIL_W, THUMBNAIL_H);

          generator.render(
            target,
            defaults,
            seed,
            palette,
            rng,
            { blur: 0, grain: { enabled: false, intensity: 0 } }
          );

          results[mode] = canvas.toDataURL("image/jpeg", 0.82);
        }

        if (results.light && results.dark) {
          renderedRef.current.add(gId);
          setThumbnails((prev) => ({
            ...prev,
            [gId]: { light: results.light!, dark: results.dark! },
          }));
        }
      } catch {
        renderedRef.current.add(gId);
      }

      schedule(renderNext);
    }

    schedule(renderNext);
  }, [generatorIds]);

  useEffect(() => {
    activeRef.current = true;
    renderAll();
    return () => {
      activeRef.current = false;
    };
  }, [renderAll]);

  return thumbnails;
}
