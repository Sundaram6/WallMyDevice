export type SwatchRecipe = {
  id: string;
  name: string;
  category: string;
  categoryTag: string;
  volume: string;
  generatorId: "waveform" | "fluid-gradient" | "geometric" | "typography";
  palette: string[];
  mode: "light" | "dark" | "auto";
  seed: string;
  params: Record<string, unknown>;
  tags: string[];
  isNew?: boolean;
  isTrending?: boolean;
};

export type ArchiveCategory = {
  id: string;
  label: string;
  count: number;
};

export const ARCHIVE_PRESETS: SwatchRecipe[] = [
  {
    id: "terracotta-bloom",
    name: "Terracotta Bloom",
    category: "Botanicals",
    categoryTag: "botanicals",
    volume: "Vol. 04",
    generatorId: "waveform",
    palette: ["#8A9A6E", "#E4DCC8", "#4B5A3E", "#2B2A26"],
    mode: "dark",
    seed: "bloom99",
    params: { layers: 6, jaggedness: 0.35, smoothing: 0.75, lineThickness: 2, amplitude: 0.65, fillBelow: true },
    tags: ["botanicals", "new"],
    isNew: true,
  },
  {
    id: "dune-flow",
    name: "Dune Flow",
    category: "Earth & sand",
    categoryTag: "earth-sand",
    volume: "Vol. 02",
    generatorId: "fluid-gradient",
    palette: ["#E4DCC8", "#C79A66", "#8A8579", "#2F4A5C"],
    mode: "light",
    seed: "dune42",
    params: { blobCount: 4, distortion: 0.6, swirl: 0.45, contrast: 1.1, saturation: 0.9 },
    tags: ["earth-sand", "trending"],
    isTrending: true,
  },
  {
    id: "sagebrush-lines",
    name: "Sagebrush Lines",
    category: "Abstract",
    categoryTag: "abstract",
    volume: "Vol. 03",
    generatorId: "waveform",
    palette: ["#DAD4C4", "#8A9A72", "#5C6E4E", "#37402C"],
    mode: "light",
    seed: "sage88",
    params: { layers: 8, jaggedness: 0.15, smoothing: 0.9, lineThickness: 1.2, amplitude: 0.5, fillBelow: false },
    tags: ["abstract", "earth-sand"],
  },
  {
    id: "inkleaf",
    name: "Inkleaf",
    category: "Monochrome",
    categoryTag: "monochrome",
    volume: "Vol. 01",
    generatorId: "geometric",
    palette: ["#FAF8F4", "#5B584F", "#2B2A26", "#8A8579"],
    mode: "dark",
    seed: "inkleaf01",
    params: { shape: "circles", gridSize: 12, rotation: 15, strokeWidth: 1.5, density: 0.7, fillMode: "fill" },
    tags: ["monochrome", "trending"],
    isTrending: true,
  },
  {
    id: "indigo-garden",
    name: "Indigo Garden",
    category: "Botanicals",
    categoryTag: "botanicals",
    volume: "Vol. 06",
    generatorId: "fluid-gradient",
    palette: ["#FAF8F4", "#1F3A5F", "#3E6E9E", "#101820"],
    mode: "dark",
    seed: "indigo77",
    params: { blobCount: 5, distortion: 0.4, swirl: 0.7, contrast: 1.2, saturation: 1.1 },
    tags: ["botanicals", "new"],
    isNew: true,
  },
  {
    id: "arches-shadows",
    name: "Arches & Shadows",
    category: "Geometric",
    categoryTag: "geometric",
    volume: "Vol. 02",
    generatorId: "geometric",
    palette: ["#DAD4C4", "#6E7A5C", "#3E4A32", "#2B2A26"],
    mode: "light",
    seed: "arch33",
    params: { shape: "squares", gridSize: 10, rotation: 45, strokeWidth: 2, density: 0.65, fillMode: "both" },
    tags: ["geometric"],
  },
  {
    id: "blush-terrain",
    name: "Blush Terrain",
    category: "Abstract",
    categoryTag: "abstract",
    volume: "Vol. 05",
    generatorId: "fluid-gradient",
    palette: ["#F3DDD1", "#C9552F", "#5A2411", "#FAF8F4"],
    mode: "light",
    seed: "blush12",
    params: { blobCount: 3, distortion: 0.7, swirl: 0.3, contrast: 0.95, saturation: 1.05 },
    tags: ["abstract", "new"],
    isNew: true,
  },
  {
    id: "olive-branch",
    name: "Olive Branch",
    category: "Botanicals",
    categoryTag: "botanicals",
    volume: "Vol. 01",
    generatorId: "waveform",
    palette: ["#DAD4C4", "#8A9A72", "#5C6E4E", "#37402C"],
    mode: "light",
    seed: "olive05",
    params: { layers: 4, jaggedness: 0.25, smoothing: 0.85, lineThickness: 2.5, amplitude: 0.7, fillBelow: true },
    tags: ["botanicals"],
  },
  {
    id: "horizon-weave",
    name: "Horizon Weave",
    category: "Earth & sand",
    categoryTag: "earth-sand",
    volume: "Vol. 03",
    generatorId: "waveform",
    palette: ["#E4DCC8", "#C79A66", "#4B5A6E", "#2F4A5C"],
    mode: "dark",
    seed: "horizon10",
    params: { layers: 7, jaggedness: 0.45, smoothing: 0.6, lineThickness: 1.8, amplitude: 0.55, fillBelow: true },
    tags: ["earth-sand", "trending"],
    isTrending: true,
  },
  {
    id: "midnight-flora",
    name: "Midnight Flora",
    category: "Botanicals",
    categoryTag: "botanicals",
    volume: "Vol. 07",
    generatorId: "typography",
    palette: ["#101820", "#C9552F", "#8A9A6E", "#E4DCC8"],
    mode: "dark",
    seed: "flora99",
    params: { text: "WallMyDevice", font: "Fraunces", size: 0.35, weight: 500, letterSpacing: 2, alignment: "center" },
    tags: ["botanicals", "trending"],
    isTrending: true,
  },
  {
    id: "cobalt-fracture",
    name: "Cobalt Fracture",
    category: "Bold & graphic",
    categoryTag: "bold-graphic",
    volume: "Vol. 01",
    generatorId: "geometric",
    palette: ["#101820", "#1F3A5F", "#3E6E9E", "#D4CDBC"],
    mode: "dark",
    seed: "cobalt88",
    params: { shape: "triangles", gridSize: 18, rotation: 30, strokeWidth: 1, density: 0.8, fillMode: "stroke" },
    tags: ["bold-graphic", "trending"],
    isTrending: true,
  },
  {
    id: "ember-field",
    name: "Ember Field",
    category: "Bold & graphic",
    categoryTag: "bold-graphic",
    volume: "Vol. 03",
    generatorId: "fluid-gradient",
    palette: ["#5A2411", "#C9552F", "#F0B27A", "#2B2A26"],
    mode: "dark",
    seed: "ember55",
    params: { blobCount: 4, distortion: 0.8, swirl: 0.6, contrast: 1.3, saturation: 1.2 },
    tags: ["bold-graphic", "new"],
    isNew: true,
  },
  {
    id: "monochrome-grid",
    name: "Monochrome Grid",
    category: "Monochrome",
    categoryTag: "monochrome",
    volume: "Vol. 02",
    generatorId: "geometric",
    palette: ["#09090b", "#27272a", "#a1a1aa", "#fafafa"],
    mode: "dark",
    seed: "monogrid",
    params: { shape: "squares", gridSize: 14, rotation: 0, strokeWidth: 1.2, density: 0.75, fillMode: "fill" },
    tags: ["monochrome"],
  },
  {
    id: "type-specimen",
    name: "Type Specimen",
    category: "Monochrome",
    categoryTag: "monochrome",
    volume: "Vol. 03",
    generatorId: "typography",
    palette: ["#FAF8F4", "#2B2A26", "#8A8579"],
    mode: "light",
    seed: "typespec",
    params: { text: "SWATCH", font: "Inter", size: 0.45, weight: 700, letterSpacing: 4, alignment: "center" },
    tags: ["monochrome", "new"],
    isNew: true,
  },
];

export function getArchiveCategories(): ArchiveCategory[] {
  const allCount = ARCHIVE_PRESETS.length;
  const newCount = ARCHIVE_PRESETS.filter(p => p.isNew).length;
  const trendingCount = ARCHIVE_PRESETS.filter(p => p.isTrending).length;
  const monochromeCount = ARCHIVE_PRESETS.filter(p => p.categoryTag === "monochrome").length;
  const earthSandCount = ARCHIVE_PRESETS.filter(p => p.categoryTag === "earth-sand").length;
  const botanicalsCount = ARCHIVE_PRESETS.filter(p => p.categoryTag === "botanicals").length;
  const geometricCount = ARCHIVE_PRESETS.filter(p => p.categoryTag === "geometric").length;
  const abstractCount = ARCHIVE_PRESETS.filter(p => p.categoryTag === "abstract").length;
  const boldGraphicCount = ARCHIVE_PRESETS.filter(p => p.categoryTag === "bold-graphic").length;

  return [
    { id: "all", label: "All prints", count: allCount },
    { id: "new", label: "New arrivals", count: newCount },
    { id: "trending", label: "Trending", count: trendingCount },
    { id: "monochrome", label: "Monochrome", count: monochromeCount },
    { id: "earth-sand", label: "Earth & sand", count: earthSandCount },
    { id: "botanicals", label: "Botanicals", count: botanicalsCount },
    { id: "geometric", label: "Geometric", count: geometricCount },
    { id: "abstract", label: "Abstract", count: abstractCount },
    { id: "bold-graphic", label: "Bold & graphic", count: boldGraphicCount },
  ].filter(c => c.count > 0);
}

export const ARCHIVE_CATEGORIES: ArchiveCategory[] = getArchiveCategories();
