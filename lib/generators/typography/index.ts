import { z } from "zod";
import type { Generator, Rng, RenderTarget, GlobalContext } from "../types";

const Schema = z.object({
  text: z.string().min(1).max(40),
  font: z.enum(["Inter", "JetBrains Mono", "Playfair Display", "system-ui"]),
  size: z.number().min(0.1).max(1.0),
  weight: z.number().int().min(100).max(900),
  letterSpacing: z.number().min(-0.2).max(0.5),
  alignment: z.enum(["left", "center", "right"]),
});

type Params = z.infer<typeof Schema>;

function escapeXml(s: string): string {
  return s.replace(/[<>&"\u0027]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;", "\u0027": "&apos;" })[c] ?? c);
}

export const typography: Generator<Params> = {
  id: "typography",
  label: "Typography",
  kind: "canvas2d",
  schema: {
    zod: Schema,
    defaults: { text: "Hello", font: "Inter", size: 0.4, weight: 700, letterSpacing: 0, alignment: "center" },
  },
  supportsSvgExport: true,
  paramControls: [
    { key: "text", label: "Text", type: "text" },
    { key: "font", label: "Font", type: "select", options: [
      { value: "Inter", label: "Inter" },
      { value: "JetBrains Mono", label: "JetBrains Mono" },
      { value: "Playfair Display", label: "Playfair Display" },
      { value: "system-ui", label: "System" },
    ]},
    { key: "size", label: "Size", type: "slider", min: 0.1, max: 1, step: 0.01 },
    { key: "weight", label: "Weight", type: "slider", min: 100, max: 900, step: 100 },
    { key: "letterSpacing", label: "Letter spacing", type: "slider", min: -0.2, max: 0.5, step: 0.01 },
    { key: "alignment", label: "Alignment", type: "select", options: [
      { value: "left", label: "Left" },
      { value: "center", label: "Center" },
      { value: "right", label: "Right" },
    ]},
  ],
  render(target: RenderTarget, params: Params, _seed: string, palette: string[], _rng: Rng, _context: GlobalContext) {
    const ctx = target.ctx as CanvasRenderingContext2D;
    const { width: W, height: H } = target;
    ctx.fillStyle = palette[0] ?? "#000000";
    ctx.fillRect(0, 0, W, H);

    const fontSize = Math.round(H * params.size);
    ctx.fillStyle = palette[palette.length - 1] ?? "#ffffff";
    ctx.textAlign = params.alignment;
    ctx.textBaseline = "middle";
    ctx.font = `${params.weight} ${fontSize}px ${params.font}, system-ui, sans-serif`;

    const xMap = { left: W * 0.08, center: W / 2, right: W * 0.92 };
    const x = xMap[params.alignment];
    const y = H / 2;

    if (params.letterSpacing !== 0) {
      const chars = [...params.text];
      const totalW = chars.reduce((acc, c) => acc + ctx.measureText(c).width + fontSize * params.letterSpacing, 0) - fontSize * params.letterSpacing;
      let startX = x;
      if (params.alignment === "center") startX = x - totalW / 2;
      if (params.alignment === "right") startX = x - totalW;
      for (const c of chars) {
        ctx.fillText(c, startX, y);
        startX += ctx.measureText(c).width + fontSize * params.letterSpacing;
      }
    } else {
      ctx.fillText(params.text, x, y);
    }
  },
  toSvg(size, params, _seed, palette) {
    const fontSize = Math.round(size.height * params.size);
    const bg = palette[0] ?? "#000000";
    const fg = palette[palette.length - 1] ?? "#ffffff";
    const xMap = { left: size.width * 0.08, center: size.width / 2, right: size.width * 0.92 };
    const x = xMap[params.alignment];
    const anchorMap = { left: "start", center: "middle", right: "end" } as const;
    const anchor = anchorMap[params.alignment];
    const letterSpacingAttr = params.letterSpacing !== 0 ? ` letter-spacing="${(params.letterSpacing * fontSize).toFixed(2)}"` : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}"><rect width="${size.width}" height="${size.height}" fill="${bg}"/><text x="${x}" y="${size.height / 2}" text-anchor="${anchor}" dominant-baseline="middle" font-family="${params.font}, system-ui, sans-serif" font-weight="${params.weight}" font-size="${fontSize}" fill="${fg}"${letterSpacingAttr}>${escapeXml(params.text)}</text></svg>`;
  },
};
