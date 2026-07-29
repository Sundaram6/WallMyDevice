export type HarmonyRule =
  | "complementary"
  | "analogous"
  | "triadic"
  | "split-complementary"
  | "monochromatic"
  | "tetradic";

export function hslToHex(h: number, s: number, l: number): string {
  const normH = ((h % 360) + 360) % 360;
  const normS = Math.max(0, Math.min(100, s)) / 100;
  const normL = Math.max(0, Math.min(100, l)) / 100;

  const c = (1 - Math.abs(2 * normL - 1)) * normS;
  const x = c * (1 - Math.abs(((normH / 60) % 2) - 1));
  const m = normL - c / 2;

  let r = 0, g = 0, b = 0;
  if (0 <= normH && normH < 60) { r = c; g = x; b = 0; }
  else if (60 <= normH && normH < 120) { r = x; g = c; b = 0; }
  else if (120 <= normH && normH < 180) { r = 0; g = c; b = x; }
  else if (180 <= normH && normH < 240) { r = 0; g = x; b = c; }
  else if (240 <= normH && normH < 300) { r = x; g = 0; b = c; }
  else if (300 <= normH && normH < 360) { r = c; g = 0; b = x; }

  const toHex = (n: number) => {
    const hex = Math.round((n + m) * 255).toString(16);
    return hex.length === 1 ? "0" + hex : hex;
  };

  return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export function generateHarmonyPalette(
  seedHue: number,
  rule: HarmonyRule,
  count: number = 4
): string[] {
  const h = ((seedHue % 360) + 360) % 360;

  switch (rule) {
    case "complementary": {
      // Base, Complement (+180), Muted Base, Muted Complement
      const colors = [
        hslToHex(h, 75, 55),
        hslToHex(h + 180, 70, 50),
        hslToHex(h, 45, 25),
        hslToHex(h + 180, 40, 80),
      ];
      return colors.slice(0, count);
    }
    case "analogous": {
      // h-30, h, h+30, h+60
      const colors = [
        hslToHex(h - 30, 70, 50),
        hslToHex(h, 80, 55),
        hslToHex(h + 30, 75, 50),
        hslToHex(h + 60, 65, 45),
      ];
      return colors.slice(0, count);
    }
    case "triadic": {
      // h, h+120, h+240, h+120 (light)
      const colors = [
        hslToHex(h, 80, 55),
        hslToHex(h + 120, 75, 50),
        hslToHex(h + 240, 70, 45),
        hslToHex(h + 120, 40, 80),
      ];
      return colors.slice(0, count);
    }
    case "split-complementary": {
      // h, h+150, h+210, h (dark)
      const colors = [
        hslToHex(h, 85, 55),
        hslToHex(h + 150, 75, 50),
        hslToHex(h + 210, 75, 50),
        hslToHex(h, 40, 20),
      ];
      return colors.slice(0, count);
    }
    case "monochromatic": {
      // Same hue, varying lightness & saturation
      const colors = [
        hslToHex(h, 70, 20),
        hslToHex(h, 65, 40),
        hslToHex(h, 80, 60),
        hslToHex(h, 40, 85),
      ];
      return colors.slice(0, count);
    }
    case "tetradic": {
      // h, h+90, h+180, h+270
      const colors = [
        hslToHex(h, 80, 55),
        hslToHex(h + 90, 75, 50),
        hslToHex(h + 180, 70, 45),
        hslToHex(h + 270, 65, 55),
      ];
      return colors.slice(0, count);
    }
    default:
      return [
        hslToHex(h, 80, 55),
        hslToHex(h + 180, 70, 50),
        hslToHex(h + 60, 65, 45),
        hslToHex(h + 240, 60, 35),
      ].slice(0, count);
  }
}
