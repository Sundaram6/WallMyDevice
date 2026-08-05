/**
 * Palette Contrast & Luminance Utilities
 * Ensures wallpaper generators never render blown-out, solid white, or pitch-black empty canvases.
 */

export function getLuminance(hex: string): number {
  if (!hex || typeof hex !== "string") return 0.5;
  const clean = hex.replace("#", "").trim();
  let r = 0, g = 0, b = 0;
  if (clean.length === 3) {
    r = parseInt(clean[0] + clean[0], 16);
    g = parseInt(clean[1] + clean[1], 16);
    b = parseInt(clean[2] + clean[2], 16);
  } else if (clean.length >= 6) {
    r = parseInt(clean.substring(0, 2), 16);
    g = parseInt(clean.substring(2, 4), 16);
    b = parseInt(clean.substring(4, 6), 16);
  }
  if (isNaN(r)) r = 0;
  if (isNaN(g)) g = 0;
  if (isNaN(b)) b = 0;

  return (0.299 * r + 0.587 * g + 0.114 * b) / 255;
}

export interface LuminancePaletteInfo {
  darkest: string;
  lightest: string;
  sorted: string[];
  darkestLuminance: number;
  lightestLuminance: number;
}

export function getPaletteByLuminance(palette: string[]): LuminancePaletteInfo {
  const valid = palette && palette.length > 0 ? palette : ["#0f172a", "#f59e0b"];
  const sorted = [...valid].sort((a, b) => getLuminance(a) - getLuminance(b));
  const darkest = sorted[0];
  const lightest = sorted[sorted.length - 1];

  return {
    darkest,
    lightest,
    sorted,
    darkestLuminance: getLuminance(darkest),
    lightestLuminance: getLuminance(lightest),
  };
}
