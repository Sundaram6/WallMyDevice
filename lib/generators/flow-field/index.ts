import { z } from "zod";
import type { Generator } from "../types";

const Schema = z.object({
  particlesCount: z.number().min(200).max(3000),
  noiseScale: z.number().min(0.0005).max(0.01),
  lineThickness: z.number().min(0.5).max(5),
  stepCount: z.number().min(20).max(150),
});

type Params = z.infer<typeof Schema>;

export const flowField: Generator<Params> = {
  id: "flow-field",
  label: "Flow Field",
  category: "Noise & Texture",
  description: "Noise-driven particle trail flow lines",
  kind: "canvas2d",
  supportsSvgExport: false,
  schema: {
    zod: Schema,
    defaults: {
      particlesCount: 1000,
      noiseScale: 0.002,
      lineThickness: 1.5,
      stepCount: 60,
    },
  },
  paramControls: [
    { key: "particlesCount", label: "Particle Count", type: "slider", min: 200, max: 3000, step: 100 },
    { key: "noiseScale", label: "Noise Scale", type: "slider", min: 0.0005, max: 0.01, step: 0.0005 },
    { key: "lineThickness", label: "Line Thickness", type: "slider", min: 0.5, max: 5, step: 0.5 },
    { key: "stepCount", label: "Trail Length", type: "slider", min: 20, max: 150, step: 10 },
  ],
  render(target, params, _seed, palette, rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    const bg = palette[0] || "#080711";
    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, width, height);

    const strokeColors = palette.slice(1).length > 0 ? palette.slice(1) : palette;

    ctx.lineWidth = params.lineThickness;
    ctx.globalAlpha = 0.6;

    for (let p = 0; p < params.particlesCount; p++) {
      let x = rng() * width;
      let y = rng() * height;
      const color = strokeColors[Math.floor(rng() * strokeColors.length)];

      ctx.strokeStyle = color;
      ctx.beginPath();
      ctx.moveTo(x, y);

      for (let s = 0; s < params.stepCount; s++) {
        const angle = (Math.sin(x * params.noiseScale) + Math.cos(y * params.noiseScale)) * Math.PI * 2;
        x += Math.cos(angle) * 4;
        y += Math.sin(angle) * 4;
        ctx.lineTo(x, y);
      }

      ctx.stroke();
    }

    ctx.globalAlpha = 1.0;
  },
};
