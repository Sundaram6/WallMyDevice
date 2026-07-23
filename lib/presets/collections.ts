import { ARCHIVE_PRESETS, type SwatchRecipe } from "./archive-presets";

export type CuratedCollection = {
  id: string;
  title: string;
  description: string;
  coverRecipeId: string;
  itemIds: string[];
};

export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    id: "botanical-calm",
    title: "Botanical Calm",
    description: "Organic flora waves, sage foliage and warm earthy earth tones.",
    coverRecipeId: "terracotta-bloom",
    itemIds: ["terracotta-bloom", "indigo-garden", "olive-branch"],
  },
  {
    id: "midnight-screens",
    title: "Midnight Screens",
    description: "Deep dark mode themes tailored for late-night viewing.",
    coverRecipeId: "indigo-garden",
    itemIds: ["indigo-garden", "terracotta-bloom"],
  },
  {
    id: "warm-minimalism",
    title: "Warm Minimalism",
    description: "Uncluttered geometric forms with subtle paper grain textures.",
    coverRecipeId: "olive-branch",
    itemIds: ["olive-branch", "terracotta-bloom"],
  },
  {
    id: "bold-geometry",
    title: "Bold Geometry",
    description: "High-contrast architectural grids, sharp angles and structured lines.",
    coverRecipeId: "terracotta-bloom",
    itemIds: ["terracotta-bloom", "olive-branch"],
  },
  {
    id: "soft-pastels",
    title: "Soft Pastels",
    description: "Gentle fluid gradients and soothing muted color spectra.",
    coverRecipeId: "indigo-garden",
    itemIds: ["indigo-garden", "olive-branch"],
  },
  {
    id: "oled-dark",
    title: "OLED Dark",
    description: "True black wallpapers optimized for battery-saving OLED displays.",
    coverRecipeId: "indigo-garden",
    itemIds: ["indigo-garden", "terracotta-bloom"],
  },
  {
    id: "editorial-type",
    title: "Editorial Type",
    description: "Typography-inspired statement pieces and bold typographic layouts.",
    coverRecipeId: "terracotta-bloom",
    itemIds: ["terracotta-bloom"],
  },
  {
    id: "earth-tones",
    title: "Earth Tones",
    description: "Terracotta, clay, and forest tones for modern workspaces.",
    coverRecipeId: "olive-branch",
    itemIds: ["olive-branch", "terracotta-bloom"],
  },
];

export function getFeaturedTodayRecipe(): SwatchRecipe {
  const dateStr = new Date().toISOString().slice(0, 10);
  let hash = 0;
  for (let i = 0; i < dateStr.length; i++) {
    hash = (hash << 5) - hash + dateStr.charCodeAt(i);
    hash |= 0;
  }
  const index = Math.abs(hash) % ARCHIVE_PRESETS.length;
  return ARCHIVE_PRESETS[index] || ARCHIVE_PRESETS[0];
}
