import { z } from "zod";
import type { Generator } from "../types";

const Schema = z.object({
  bandsCount: z.number().min(3).max(12),
  curvature: z.number().min(0.1).max(2),
  glowIntensity: z.number().min(0.1).max(1),
});

type Params = z.infer<typeof Schema>;

export const auroraFlow: Generator<Params> = {
  id: "aurora-flow",
  label: "Aurora / Plasma Flow",
  category: "Gradient & Color",
  description: "Animated-style flowing aurora color ribbons",
  kind: "canvas2d",
  supportsSvgExport: false,
  schema: {
    zod: Schema,
    defaults: {
      bandsCount: 6,
      curvature: 0.8,
      glowIntensity: 0.7,
    },
  },
  paramControls: [
    { key: "bandsCount", label: "Aurora Bands", type: "slider", min: 3, max: 12, step: 1 },
    { key: "curvature", label: "Flow Wave Curve", type: "slider", min: 0.1, max: 2, step: 0.1 },
    { key: "glowIntensity", label: "Glow Intensity", type: "slider", min: 0.1, max: 1, step: 0.05 },
  ],
  render(target, params, _seed, palette, rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    // Deep dark night backdrop
    const bg = palette[0] || "#080711";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const bandColors = palette.slice(1).length > 0 ? palette.slice(1) : palette;

    ctx.save();
    ctx.globalCompositeOperation = "screen";

    for (let b = 0; b < params.bandsCount; b++) {
      const color = bandColors[b % bandColors.length];
      const startY = height * (0.2 + (b / params.bandsCount) * 0.6);
      const amp = height * 0.15 * params.curvature;
      const freq = (1.0 + rng() * 1.5) / Math.max(1, width);
      const phase = rng() * Math.PI * 2;
      const step = Math.max(2, Math.floor(width / 100));

      ctx.beginPath();
      ctx.moveTo(0, height);

      for (let x = 0; x <= width + step; x += step) {
        const y = startY + Math.sin(x * freq + phase) * amp + Math.cos(x * freq * 0.5) * amp * 0.5;
        ctx.lineTo(x, y);
      }

      ctx.lineTo(width, height);
      ctx.closePath();

      const grad = ctx.createLinearGradient(0, startY - amp, 0, height);
      grad.addColorStop(0, color);
      grad.addColorStop(0.4, color);
      grad.addColorStop(1, "transparent");

      ctx.fillStyle = grad;
      ctx.shadowColor = color;
      ctx.shadowBlur = Math.max(width, height) * 0.05 * params.glowIntensity;
      ctx.fill();
    }

    ctx.restore();
  },
};
