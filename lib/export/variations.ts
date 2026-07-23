import { deriveSeed } from "../prng";
import type { SwatchRecipe } from "../presets/archive-presets";

export function deriveFourVariations(baseSeed: string, setIndex = 0): string[] {
  return [
    deriveSeed(baseSeed, `var-0-set-${setIndex}`),
    deriveSeed(baseSeed, `var-1-set-${setIndex}`),
    deriveSeed(baseSeed, `var-2-set-${setIndex}`),
    deriveSeed(baseSeed, `var-3-set-${setIndex}`),
  ];
}

export type PackDeviceCategory = "phone" | "tablet" | "laptop" | "desktop" | "ultrawide";

export type PackPresetSize = {
  id: string;
  label: string;
  category: PackDeviceCategory;
  width: number;
  height: number;
  cropWarning?: string;
};

export const PACK_PRESETS: PackPresetSize[] = [
  { id: "phone-portrait", label: "Phone (Portrait)", category: "phone", width: 1170, height: 2532 },
  { id: "tablet-portrait", label: "Tablet (Portrait)", category: "tablet", width: 1640, height: 2360 },
  { id: "laptop-14", label: "Laptop 14\"", category: "laptop", width: 3024, height: 1964 },
  { id: "desktop-4k", label: "Desktop 4K Widescreen", category: "desktop", width: 3840, height: 2160 },
  { id: "ultrawide-5k", label: "Ultrawide 5K (21:9)", category: "ultrawide", width: 5120, height: 2160, cropWarning: "Extreme 21:9 ratio: top/bottom content will crop" },
];

export function buildPackManifest(
  recipe: Partial<SwatchRecipe>,
  sizes: PackPresetSize[],
  fitStrategy: "fill" | "fit" | "adaptive"
): string {
  const manifest = {
    app: "WallMyDevice Multi-Device Export Pack",
    version: "1.0",
    createdAt: new Date().toISOString(),
    recipe: {
      id: recipe.id || "custom-recipe",
      name: recipe.name || "Custom Wallpaper",
      generator: recipe.generatorId || "waveform",
      seed: recipe.seed || "seed",
      mode: recipe.mode || "dark",
      palette: recipe.palette || [],
      params: recipe.params || {},
    },
    fitStrategy,
    exportedSizes: sizes.map((s) => ({
      label: s.label,
      category: s.category,
      dimensions: `${s.width}x${s.height} px`,
      aspectRatio: (s.width / s.height).toFixed(2),
    })),
  };
  return JSON.stringify(manifest, null, 2);
}

/**
 * Capability boundary documentation for future live wallpaper / animated video export.
 */
export const LIVE_WALLPAPER_CAPABILITY_BOUNDARY = {
  status: "future_capability_boundary",
  supportedFormats: ["png", "jpg", "webp", "svg", "zip_pack"],
  animatedExportSupported: false,
  documentation:
    "Live Wallpaper Engine, MP4, and WebM exports are documented future features. Clean static image exports and multi-device ZIP packs are fully supported.",
};
