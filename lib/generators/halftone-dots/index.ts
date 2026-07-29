import { z } from "zod";
import type { Generator } from "../types";

const Schema = z.object({
  dotGridSize: z.number().min(10).max(60),
  maxDotScale: z.number().min(0.5).max(1.5),
});

type Params = z.infer<typeof Schema>;

export const halftoneDots: Generator<Params> = {
  id: "halftone-dots",
  label: "Halftone Dots",
  category: "Geometric & Pattern",
  description: "Screenprint halftone dot grid driven by luminance mapping",
  kind: "canvas2d",
  supportsSvgExport: false,
  schema: {
    zod: Schema,
    defaults: {
      dotGridSize: 24,
      maxDotScale: 0.9,
    },
  },
  paramControls: [
    { key: "dotGridSize", label: "Dot Grid Count", type: "slider", min: 10, max: 60, step: 2 },
    { key: "maxDotScale", label: "Max Dot Scale", type: "slider", min: 0.5, max: 1.5, step: 0.1 },
  ],
  render(target, params, _seed, palette, rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    const bg = palette[0] || "#080711";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const dotColors = palette.slice(1).length > 0 ? palette.slice(1) : palette;

    const cols = params.dotGridSize;
    const rows = Math.round(cols * (height / width));
    const cellW = width / cols;
    const cellH = height / rows;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const cx = (c + 0.5) * cellW;
        const cy = (r + 0.5) * cellH;

        const distFromCenter = Math.hypot(cx - width * 0.5, cy - height * 0.5);
        const maxDist = Math.hypot(width * 0.5, height * 0.5);
        const luminance = 1 - distFromCenter / maxDist;

        const radius = (Math.min(cellW, cellH) * 0.5 * Math.max(0.1, luminance) * params.maxDotScale);
        const color = dotColors[(c + r) % dotColors.length];

        ctx.fillStyle = color;
        ctx.beginPath();
        ctx.arc(cx, cy, radius, 0, Math.PI * 2);
        ctx.fill();
      }
    }
  },
};
