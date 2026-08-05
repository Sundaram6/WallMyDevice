import { z } from "zod";
import type { Generator } from "../types";
import { getPaletteByLuminance } from "../../palettes/contrast";

const Schema = z.object({
  bandsCount: z.number().min(2).max(10),
  curvature: z.number().min(0.2).max(2),
  glowIntensity: z.number().min(0.1).max(1),
});

type Params = z.infer<typeof Schema>;

export const auroraFlow: Generator<Params> = {
  id: "aurora-flow",
  label: "Aurora / Plasma Flow",
  category: "Gradient & Color",
  description: "Waving northern lights plasma bands",
  kind: "canvas2d",
  supportsSvgExport: false,
  schema: {
    zod: Schema,
    defaults: {
      bandsCount: 4,
      curvature: 1.0,
      glowIntensity: 0.7,
    },
  },
  paramControls: [
    { key: "bandsCount", label: "Aurora Bands", type: "slider", min: 2, max: 10, step: 1 },
    { key: "curvature", label: "Wave Curvature", type: "slider", min: 0.2, max: 2, step: 0.1 },
    { key: "glowIntensity", label: "Glow Intensity", type: "slider", min: 0.1, max: 1, step: 0.05 },
  ],
  render(target, params, _seed, palette, rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    const { darkest, sorted, darkestLuminance } = getPaletteByLuminance(palette);
    const bg = darkestLuminance <= 0.45 ? darkest : "#080711";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const bandColors = sorted.filter((c) => c !== bg);
    const colorsToUse = bandColors.length > 0 ? bandColors : sorted;

    ctx.save();
    ctx.globalCompositeOperation = darkestLuminance <= 0.45 ? "screen" : "source-over";
    ctx.globalAlpha = 0.75;

    for (let b = 0; b < params.bandsCount; b++) {
      const color = colorsToUse[b % colorsToUse.length];
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
