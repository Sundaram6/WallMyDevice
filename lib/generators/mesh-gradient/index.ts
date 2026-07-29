import { z } from "zod";
import type { Generator } from "../types";

const Schema = z.object({
  pointsCount: z.number().min(3).max(12),
  blurRadius: z.number().min(0).max(1),
  pointSize: z.number().min(0.2).max(2),
});

type Params = z.infer<typeof Schema>;

export const meshGradient: Generator<Params> = {
  id: "mesh-gradient",
  label: "Mesh Gradient",
  category: "Gradient & Color",
  description: "Multi-point smooth gradient mesh with soft blending",
  kind: "canvas2d",
  supportsSvgExport: false,
  schema: {
    zod: Schema,
    defaults: {
      pointsCount: 6,
      blurRadius: 0.6,
      pointSize: 0.9,
    },
  },
  paramControls: [
    { key: "pointsCount", label: "Control Points", type: "slider", min: 3, max: 12, step: 1 },
    { key: "blurRadius", label: "Blend Blur", type: "slider", min: 0, max: 1, step: 0.05 },
    { key: "pointSize", label: "Point Spread", type: "slider", min: 0.2, max: 2, step: 0.1 },
  ],
  render(target, params, _seed, palette, rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    const baseColor = palette[0] || "#0f172a";
    ctx.fillStyle = baseColor;
    ctx.fillRect(0, 0, width, height);

    if (palette.length < 2) return;

    // Generate random control point positions based on seed rng
    const points: Array<{ x: number; y: number; color: string; radius: number }> = [];
    const minDim = Math.min(width, height);

    for (let i = 0; i < params.pointsCount; i++) {
      const color = palette[i % palette.length];
      const x = rng() * width;
      const y = rng() * height;
      const radius = (minDim * (0.3 + rng() * 0.5) * params.pointSize);
      points.push({ x, y, color, radius });
    }

    ctx.save();
    ctx.globalCompositeOperation = "screen";

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
      ctx.filter = `blur(${Math.round(params.blurRadius * 40)}px)`;
      ctx.drawImage(ctx.canvas, 0, 0);
      ctx.filter = "none";
    }
  },
};
