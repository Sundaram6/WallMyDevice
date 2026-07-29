import { z } from "zod";
import type { Generator } from "../types";

const Schema = z.object({
  frequency: z.number().min(0.005).max(0.05),
  waveSources: z.number().min(2).max(6),
  amplitude: z.number().min(0.2).max(2),
});

type Params = z.infer<typeof Schema>;

export const waveInterference: Generator<Params> = {
  id: "wave-interference",
  label: "Wave Interference",
  category: "Organic",
  description: "Overlapping ripple wave fields creating moiré patterns",
  kind: "canvas2d",
  supportsSvgExport: false,
  schema: {
    zod: Schema,
    defaults: {
      frequency: 0.015,
      waveSources: 3,
      amplitude: 1,
    },
  },
  paramControls: [
    { key: "waveSources", label: "Wave Emitter Sources", type: "slider", min: 2, max: 6, step: 1 },
    { key: "frequency", label: "Wave Frequency", type: "slider", min: 0.005, max: 0.05, step: 0.005 },
    { key: "amplitude", label: "Wave Amplitude", type: "slider", min: 0.2, max: 2, step: 0.1 },
  ],
  render(target, params, _seed, palette, rng, _context) {
    if (target.kind !== "canvas2d") return;
    const { ctx, width, height } = target;
    ctx.clearRect(0, 0, width, height);

    const step = 4;
    const cols = Math.ceil(width / step);
    const rows = Math.ceil(height / step);

    const sources: Array<{ x: number; y: number }> = [];
    for (let s = 0; s < params.waveSources; s++) {
      sources.push({ x: rng() * width, y: rng() * height });
    }

    const c1 = palette[0] || "#080711";
    const c2 = palette[1] || "#3E6E9E";
    const c3 = palette[2] || "#FAF8F4";

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = c * step;
        const y = r * step;

        let totalVal = 0;
        sources.forEach((src) => {
          const dist = Math.hypot(x - src.x, y - src.y);
          totalVal += Math.sin(dist * params.frequency) * params.amplitude;
        });

        const norm = (totalVal / params.waveSources + 1) / 2;

        if (norm < 0.35) {
          ctx.fillStyle = c1;
        } else if (norm < 0.7) {
          ctx.fillStyle = c2;
        } else {
          ctx.fillStyle = c3;
        }

        ctx.fillRect(x, y, step, step);
      }
    }
  },
};
