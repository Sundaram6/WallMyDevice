import { z } from "zod";
import type { Generator } from "../types";
import { getPaletteByLuminance } from "../../palettes/contrast";

const Schema = z.object({
  pointsCount: z.number().min(2).max(10),
  blurRadius: z.number().min(0).max(1),
  pointSize: z.number().min(0.2).max(2),
});

type Params = z.infer<typeof Schema>;

export const meshGradient: Generator<Params> = {
  id: "mesh-gradient",
  label: "Mesh Gradient",
  category: "Gradient & Color",
  description: "Soft multi-point mesh color blend",
  kind: "canvas2d",
  supportsSvgExport: false,
  schema: {
    zod: Schema,
    defaults: {
      pointsCount: 4,
      blurRadius: 0.5,
      pointSize: 1.0,
    },
  },
  paramControls: [
    { key: "pointsCount", label: "Color Points", type: "slider", min: 2, max: 10, step: 1 },
    { key: "blurRadius", label: "Mesh Smoothness", type: "slider", min: 0, max: 1, step: 0.05 },
    { key: "pointSize", label: "Point Spread", type: "slider", min: 0.2, max: 2, step: 0.1 },
  ],
  render(target, params, _seed, palette, rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    const { darkest, sorted, darkestLuminance } = getPaletteByLuminance(palette);
    const baseColor = darkestLuminance <= 0.45 ? darkest : "#0f172a";
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    const pointColors = sorted.filter((c) => c !== baseColor);
    const colorsToUse = pointColors.length > 0 ? pointColors : sorted;
    const minDim = Math.min(width, height);

    const points: Array<{ x: number; y: number; color: string; radius: number }> = [];

    for (let i = 0; i < params.pointsCount; i++) {
      const color = colorsToUse[i % colorsToUse.length];
      const x = rng() * width;
      const y = rng() * height;
      const radius = minDim * (0.3 + rng() * 0.5) * params.pointSize;
      points.push({ x, y, color, radius });
    }

    ctx.save();
    ctx.globalCompositeOperation = darkestLuminance <= 0.45 ? "screen" : "source-over";
    ctx.globalAlpha = 0.75;

    points.forEach((pt) => {
      const grad = ctx.createRadialGradient(pt.x, pt.y, 0, pt.x, pt.y, pt.radius);
      grad.addColorStop(0, pt.color);
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.beginPath();
      ctx.arc(pt.x, pt.y, pt.radius, 0, Math.PI * 2);
      ctx.fill();
    });

    ctx.restore();

    if (params.blurRadius > 0) {
      const blurAmount = Math.round(params.blurRadius * minDim * 0.08);
      ctx.filter = `blur(${blurAmount}px)`;
      ctx.drawImage(ctx.canvas, 0, 0);
      ctx.filter = "none";
    }
  },
};
