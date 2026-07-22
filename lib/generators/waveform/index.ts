import { z } from "zod";
import type { Generator, Rng, RenderTarget, GlobalContext } from "../types";

const Schema = z.object({
  layers: z.number().int().min(1).max(12),
  jaggedness: z.number().min(0).max(1),
  smoothing: z.number().min(0).max(1),
  lineThickness: z.number().min(0.5).max(8),
  amplitude: z.number().min(0).max(1),
  fillBelow: z.boolean(),
});

type Params = z.infer<typeof Schema>;

export const waveform: Generator<Params> = {
  id: "waveform",
  label: "Waveform",
  description: "Layered sine waves and terrain contours",
  kind: "canvas2d",
  schema: {
    zod: Schema,
    defaults: { layers: 5, jaggedness: 0.4, smoothing: 0.7, lineThickness: 1.5, amplitude: 0.6, fillBelow: true },
  },
  supportsSvgExport: false,
  paramControls: [
    { key: "layers", label: "Layers", type: "slider", min: 1, max: 12, step: 1 },
    { key: "jaggedness", label: "Jaggedness", type: "slider", min: 0, max: 1, step: 0.01 },
    { key: "smoothing", label: "Smoothing", type: "slider", min: 0, max: 1, step: 0.01 },
    { key: "lineThickness", label: "Line thickness", type: "slider", min: 0.5, max: 8, step: 0.5 },
    { key: "amplitude", label: "Amplitude", type: "slider", min: 0, max: 1, step: 0.01 },
    { key: "fillBelow", label: "Fill below line", type: "toggle" },
  ],
  render(target: RenderTarget, params: Params, seed: string, palette: string[], rng: Rng, _context: GlobalContext) {
    const ctx = target.ctx as CanvasRenderingContext2D;
    const { width: W, height: H } = target;
    const bg = palette[0] ?? "#000000";
    const fg = palette[palette.length - 1] ?? "#ffffff";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const stepCount = Math.max(40, Math.floor(W / 8));
    const baseY = H * 0.65;

    for (let layer = 0; layer < params.layers; layer++) {
      const layerProgress = params.layers === 1 ? 0.5 : layer / (params.layers - 1);
      const yOffset = baseY - layerProgress * H * 0.35;
      const amp = params.amplitude * H * (0.3 + layerProgress * 0.4);
      const colorIdx = Math.min(palette.length - 1, 1 + Math.floor(layerProgress * (palette.length - 2)));
      ctx.strokeStyle = palette[colorIdx] ?? fg;
      ctx.fillStyle = palette[colorIdx] ?? fg;
      ctx.lineWidth = params.lineThickness;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      const points: Array<[number, number]> = [];
      for (let i = 0; i <= stepCount; i++) {
        const x = (i / stepCount) * W;
        const t = i / stepCount;
        const noise = (rng() - 0.5) * 2 * params.jaggedness;
        const wave = Math.sin(t * Math.PI * (2 + layer) + seed.charCodeAt(0) * 0.01) * 0.5;
        const y = yOffset - (wave + noise) * amp;
        points.push([x, y]);
      }
      const strength = Math.min(1, Math.max(0, params.smoothing));
      if (strength > 0) {
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length - 1; i++) {
          const [x0, y0] = points[i];
          const [x1, y1] = points[i + 1];
          const midX = (x0 + x1) / 2;
          const midY = (y0 + y1) / 2;
          const endX = x0 + (midX - x0) * strength;
          const endY = y0 + (midY - y0) * strength;
          ctx.quadraticCurveTo(x0, y0, endX, endY);
        }
        ctx.lineTo(points[points.length - 1][0], points[points.length - 1][1]);
      } else {
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
      }
      if (params.fillBelow) {
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        ctx.globalAlpha = 0.3 + 0.5 * (1 - layerProgress);
        ctx.fill();
        ctx.globalAlpha = 1;
      } else {
        ctx.stroke();
      }
    }
  },
};
