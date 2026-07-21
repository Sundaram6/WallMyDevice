export const MAX_WIDTH = 7680;
export const MAX_HEIGHT = 7680;
export const MAX_PIXELS = 50_000_000;

export function validateExportSize(w: number, h: number): { ok: true } | { ok: false; error: string } {
  if (w < 1 || h < 1) return { ok: false, error: "Dimensions must be positive" };
  if (w > MAX_WIDTH || h > MAX_HEIGHT) return { ok: false, error: `Max dimension is ${MAX_WIDTH}px. Current: ${w}x${h}` };
  if (w * h > MAX_PIXELS) return { ok: false, error: `Max total pixels is ${(MAX_PIXELS / 1e6).toFixed(0)}MP. Current: ${((w * h) / 1e6).toFixed(1)}MP` };
  return { ok: true };
}
