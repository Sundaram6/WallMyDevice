import type { RenderTarget } from "../generators/types";

export type OverlayState = {
  clock: boolean;
  date: boolean;
  text: boolean;
  textValue: string;
  font: string;
  size: number;
};

export function drawOverlays(target: RenderTarget, state: OverlayState, palette: string[]): void {
  if (!(target.ctx instanceof CanvasRenderingContext2D)) return;
  if (!state.clock && !state.date && !state.text) return;
  const ctx = target.ctx;
  const fg = palette[palette.length - 1] ?? "#ffffff";
  const fontSize = Math.round(target.width * 0.04 * state.size);
  ctx.fillStyle = fg;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `500 ${fontSize}px ${state.font}, system-ui, sans-serif`;
  const cx = target.width / 2;
  const cy = target.height / 2;
  const now = new Date();
  const lines: string[] = [];
  if (state.clock) lines.push(formatClock(now));
  if (state.date) lines.push(formatDate(now));
  if (state.text) lines.push(state.textValue);
  if (lines.length === 0) return;
  const lineHeight = fontSize * 1.2;
  const startY = cy - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => ctx.fillText(line, cx, startY + i * lineHeight));
}

function formatClock(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
