import { z } from "zod";
import type { Generator } from "../types";

const Schema = z.object({
  raysCount: z.number().min(8).max(64),
  raySharpness: z.number().min(0).max(1),
  centerX: z.number().min(0).max(1),
  centerY: z.number().min(0).max(1),
});

type Params = z.infer<typeof Schema>;

export const duotoneBurst: Generator<Params> = {
  id: "duotone-burst",
  label: "Duotone Burst",
  category: "Gradient & Color",
  description: "Radial sunburst gradient with ray sharpness controls",
  kind: "canvas2d",
  supportsSvgExport: true,
  schema: {
    zod: Schema,
    defaults: {
      raysCount: 24,
      raySharpness: 0.5,
      centerX: 0.5,
      centerY: 0.5,
    },
  },
  paramControls: [
    { key: "raysCount", label: "Rays Count", type: "slider", min: 8, max: 64, step: 2 },
    { key: "raySharpness", label: "Ray Sharpness", type: "slider", min: 0, max: 1, step: 0.05 },
    { key: "centerX", label: "Center X Position", type: "slider", min: 0, max: 1, step: 0.05 },
    { key: "centerY", label: "Center Y Position", type: "slider", min: 0, max: 1, step: 0.05 },
  ],
  render(target, params, _seed, palette, _rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    const c1 = palette[0] || "#0f172a";
    const c2 = palette[1] || "#f59e0b";

    const cx = width * params.centerX;
    const cy = height * params.centerY;
    const maxRadius = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy));

    // Base background
    ctx.fillStyle = c1;
    ctx.fillRect(0, 0, width, height);

    const angleStep = (Math.PI * 2) / params.raysCount;

    ctx.fillStyle = c2;
    for (let i = 0; i < params.raysCount; i += 2) {
      const a1 = i * angleStep;
      const a2 = (i + 1 * (1 - params.raySharpness * 0.5)) * angleStep;

      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.arc(cx, cy, maxRadius, a1, a2);
      ctx.closePath();
      ctx.fill();
    }
  },
  toSvg(size, params, _seed, palette) {
    const { width, height } = size;
    const c1 = palette[0] || "#0f172a";
    const c2 = palette[1] || "#f59e0b";
    const cx = width * params.centerX;
    const cy = height * params.centerY;
    const maxRadius = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy));
    const angleStep = (Math.PI * 2) / params.raysCount;

    let paths = "";
    for (let i = 0; i < params.raysCount; i += 2) {
      const a1 = i * angleStep;
      const a2 = (i + 1 * (1 - params.raySharpness * 0.5)) * angleStep;

      const x1 = cx + maxRadius * Math.cos(a1);
      const y1 = cy + maxRadius * Math.sin(a1);
      const x2 = cx + maxRadius * Math.cos(a2);
      const y2 = cy + maxRadius * Math.sin(a2);

      paths += `<path d="M ${cx} ${cy} L ${x1} ${y1} A ${maxRadius} ${maxRadius} 0 0 1 ${x2} ${y2} Z" fill="${c2}" />`;
    }

    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="${width}" height="${height}"><rect width="100%" height="100%" fill="${c1}" />${paths}</svg>`;
  },
};
