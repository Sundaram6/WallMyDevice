import { ARCHIVE_PRESETS, type SwatchRecipe } from "./archive-presets";

export type CuratedCollection = {
  id: string;
  title: string;
  description: string;
  coverRecipeId: string;
  coverPalette: string[];
  itemIds: string[];
};

export const CURATED_COLLECTIONS: CuratedCollection[] = [
  {
    id: "botanical-calm",
    title: "Botanical Calm",
    description: "Organic flora waves, sage foliage and warm earthy earth tones.",
    coverRecipeId: "terracotta-bloom",
    coverPalette: ["#8A9A6E", "#E4DCC8", "#4B5A3E", "#2B2A26"],
    itemIds: ["terracotta-bloom", "indigo-garden", "olive-branch", "forest-depth", "fern-shadow", "sage-smoke", "moss-tide"],
  },
  {
    id: "midnight-screens",
    title: "Midnight Screens",
    description: "Deep dark mode themes tailored for late-night viewing.",
    coverRecipeId: "indigo-garden",
    coverPalette: ["#101820", "#1F3A5F", "#3E6E9E", "#FAF8F4"],
    itemIds: ["indigo-garden", "midnight-flora", "cobalt-fracture", "hex-field", "forest-depth", "fern-shadow"],
  },
  {
    id: "warm-minimalism",
    title: "Warm Minimalism",
    description: "Uncluttered geometric forms with subtle paper grain textures.",
    coverRecipeId: "olive-branch",
    coverPalette: ["#DAD4C4", "#8A9A72", "#5C6E4E", "#37402C"],
    itemIds: ["olive-branch", "arches-shadows", "grid-lattice", "diamond-grid", "terracotta-bloom"],
  },
  {
    id: "bold-geometry",
    title: "Bold Geometry",
    description: "High-contrast architectural grids, sharp angles and structured lines.",
    coverRecipeId: "arches-shadows",
    coverPalette: ["#DAD4C4", "#6E7A5C", "#3E4A32", "#2B2A26"],
    itemIds: ["arches-shadows", "cobalt-fracture", "grid-lattice", "hex-field", "diamond-grid", "moss-tide"],
  },
  {
    id: "soft-pastels",
    title: "Soft Pastels",
    description: "Gentle fluid gradients and soothing muted color spectra.",
    coverRecipeId: "sage-smoke",
    coverPalette: ["#E2DDD4", "#A0A882", "#627058", "#2E3328"],
    itemIds: ["sage-smoke", "olive-branch", "terracotta-bloom"],
  },
  {
    id: "oled-dark",
    title: "OLED Dark",
    description: "True black wallpapers optimized for battery-saving OLED displays.",
    coverRecipeId: "cobalt-fracture",
    coverPalette: ["#101820", "#1F3A5F", "#3E6E9E", "#D4CDBC"],
    itemIds: ["cobalt-fracture", "indigo-garden", "midnight-flora", "hex-field"],
  },
  {
    id: "editorial-type",
    title: "Editorial Type",
    description: "Typography-inspired statement pieces and bold typographic layouts.",
    coverRecipeId: "midnight-flora",
    coverPalette: ["#101820", "#C9552F", "#8A9A6E", "#E4DCC8"],
    itemIds: ["midnight-flora", "terracotta-bloom"],
  },
  {
    id: "earth-tones",
    title: "Earth Tones",
    description: "Terracotta, clay, and forest tones for modern workspaces.",
    coverRecipeId: "terracotta-bloom",
    coverPalette: ["#8A9A6E", "#E4DCC8", "#4B5A3E", "#2B2A26"],
    itemIds: ["terracotta-bloom", "olive-branch", "arches-shadows", "grid-lattice"],
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
