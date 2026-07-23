import { getGenerator } from "../generators/registry";
import type { SwatchRecipe } from "../presets/archive-presets";

export function getResolutionStrategyLabel(recipe: Partial<SwatchRecipe>): string {
  if (recipe.palette && recipe.mode === "dark" && recipe.palette.some(c => c.toLowerCase() === "#000000" || c.toLowerCase() === "#050505" || c.toLowerCase() === "#101820")) {
    return "OLED";
  }
  const tag = recipe.categoryTag || recipe.category?.toLowerCase() || "";
  if (tag.includes("desktop") || tag.includes("architectural")) return "Desktop";
  if (tag.includes("phone") || tag.includes("botanicals") || tag.includes("minimalist")) return "Phone";
  return "Adaptive";
}

export function getOrientationLabel(recipe: Partial<SwatchRecipe>): "Portrait" | "Landscape" | "Universal" {
  const cat = (recipe.category || "").toLowerCase();
  if (cat.includes("desktop") || cat.includes("architectural")) return "Landscape";
  if (cat.includes("botanicals") || cat.includes("minimalist")) return "Portrait";
  return "Universal";
}

export function getDeviceDisplayName(deviceType?: string, phoneBrand?: string, phoneModel?: string): string {
  if (phoneModel) return phoneModel;
  if (phoneBrand) return `${phoneBrand} Phone`;
  if (deviceType === "phone") return "Mobile Phone";
  if (deviceType === "tablet") return "Tablet";
  if (deviceType === "desktop") return "Desktop Monitor";
  if (deviceType === "laptop") return "Laptop Screen";
  return "Universal Device";
}

export function getGeneratorDisplayName(generatorId: string): string {
  const g = getGenerator(generatorId);
  if (g) return g.label;
  if (generatorId === "fluid-gradient") return "Fluid Gradient";
  if (generatorId === "waveform") return "Waveform Lines";
  if (generatorId === "geometric") return "Geometric Grid";
  if (generatorId === "typography") return "Typography Layout";
  return generatorId;
}
