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
    id: "prismatic-gradients",
    title: "Prismatic & Gradients",
    description: "Mesh gradients, aurora flows, and rich duotone color sweeps.",
    coverRecipeId: "mesh-prismatic",
    coverPalette: ["#1F3A5F", "#8A9A6E", "#D9541F", "#FAF7F0"],
    itemIds: ["mesh-prismatic", "aurora-boreal", "indigo-garden", "duotone-flare", "sage-smoke"],
  },
  {
    id: "bauhaus-architecture",
    title: "Bauhaus & Construct",
    description: "High-contrast geometric blocks, Voronoi cells, and halftone pop art.",
    coverRecipeId: "bauhaus-construct",
    coverPalette: ["#FAF7F0", "#D9541F", "#1F3A5F", "#F59E0B"],
    itemIds: ["bauhaus-construct", "voronoi-cells", "halftone-pop", "lowpoly-peaks", "arches-shadows"],
  },
  {
    id: "generative-fluids",
    title: "Generative & Fluids",
    description: "Particle flow fields, marble turbulence, metaballs, and organic motion.",
    coverRecipeId: "flow-vector",
    coverPalette: ["#0F0D0B", "#10B981", "#06B6D4", "#F4F0E8"],
    itemIds: ["flow-vector", "marble-swirl", "metaballs-lava", "wave-harmonic", "forest-depth"],
  },
  {
    id: "minimalist-contours",
    title: "Minimalist Contours",
    description: "Topographic lines, analog film grain, and subtle paper specimen prints.",
    coverRecipeId: "topography-elevation",
    coverPalette: ["#FAF7F0", "#1C1A16", "#756E60", "#D9541F"],
    itemIds: ["topography-elevation", "grain-analog", "olive-branch", "terracotta-bloom"],
  },
  {
    id: "cosmic-night",
    title: "Cosmic & Deep Night",
    description: "Orion starfield nebulas, deep OLED darks, and midnight flora.",
    coverRecipeId: "starfield-cosmic",
    coverPalette: ["#0A0A0D", "#6366F1", "#A855F7", "#F43F5E"],
    itemIds: ["starfield-cosmic", "indigo-garden", "midnight-flora", "cobalt-fracture", "hex-field"],
  },
  {
    id: "botanical-calm",
    title: "Botanical Calm",
    description: "Organic flora waves, sage foliage and warm earthy earth tones.",
    coverRecipeId: "terracotta-bloom",
    coverPalette: ["#8A9A6E", "#E4DCC8", "#4B5A3E", "#2B2A26"],
    itemIds: ["terracotta-bloom", "indigo-garden", "olive-branch", "forest-depth", "fern-shadow"],
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
