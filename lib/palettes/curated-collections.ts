export type CuratedCollectionPalette = {
  id: string;
  label: string;
  description: string;
  colors: string[];
};

export const NAMED_CURATED_COLLECTIONS: CuratedCollectionPalette[] = [
  {
    id: "sunset-ember",
    label: "Sunset Ember",
    description: "Deep indigo sky with fiery orange and gold horizon tones",
    colors: ["#1A102F", "#5C1D40", "#D84A38", "#F59E0B", "#FCD34D"],
  },
  {
    id: "ocean-depths",
    label: "Ocean Depths",
    description: "Abyssal navy transitioning to vibrant cyan and seafoam",
    colors: ["#0B192C", "#1E3E62", "#00879E", "#00D9C0", "#E0F7FA"],
  },
  {
    id: "forest-canopy",
    label: "Forest Canopy",
    description: "Deep pine and moss greens with warm sunlit amber",
    colors: ["#0B1D12", "#1E3A2B", "#4A7C59", "#8FBC8F", "#E9D8A6"],
  },
  {
    id: "neon-cyberpunk",
    label: "Neon Cyberpunk",
    description: "Midnight black with electric magenta, cyan and acid yellow",
    colors: ["#080711", "#240046", "#FF007F", "#00F0FF", "#FFE600"],
  },
  {
    id: "pastel-dreamscape",
    label: "Pastel Dreamscape",
    description: "Soft ethereal lavender, blush pink, mint and baby blue",
    colors: ["#FAF5FF", "#E9D5FF", "#FBCFE8", "#A7F3D0", "#BAE6FD"],
  },
  {
    id: "earth-clay",
    label: "Earth & Clay",
    description: "Rich terracotta, warm sand, ochre and natural charcoal",
    colors: ["#2B2421", "#7A3E2D", "#C86D51", "#E09F67", "#F4E8C1"],
  },
  {
    id: "jewel-tones",
    label: "Jewel Tones",
    description: "Lustrous emerald, sapphire, amethyst and ruby accents",
    colors: ["#0F172A", "#0466C8", "#5A189A", "#B7094C", "#0096C7"],
  },
  {
    id: "metallic",
    label: "Metallic (Gold & Chrome)",
    description: "Polished brass, rose gold, chrome and dark obsidian",
    colors: ["#121212", "#3D3A37", "#D4AF37", "#F3C68F", "#E5E5E5"],
  },
  {
    id: "nordic-frost",
    label: "Nordic Frost",
    description: "Cool glacier ice, slate gray and crisp polar white",
    colors: ["#0F172A", "#334155", "#64748B", "#94A3B8", "#F8FAFC"],
  },
  {
    id: "vaporwave",
    label: "Vaporwave 80s",
    description: "Retro synthwave purple, hot pink, sky blue and peach",
    colors: ["#1B065E", "#6B0848", "#FF007F", "#FF884B", "#00F5D4"],
  },
  {
    id: "grayscale-accent",
    label: "Grayscale + Accent",
    description: "Pure monochrome contrast with a single vivid crimson spark",
    colors: ["#000000", "#262626", "#737373", "#E5E5E5", "#DC2626"],
  },
  {
    id: "desert-sand",
    label: "Desert Sand",
    description: "Warm dune clay, sun-bleached stone and terracotta shadow",
    colors: ["#3D261A", "#8B5E3C", "#C49A6C", "#E0C9A6", "#F7F0E6"],
  },
  {
    id: "cosmic-galaxy",
    label: "Cosmic / Galaxy",
    description: "Deep space darkness, starlight violet, magenta and cyan cloud",
    colors: ["#03001E", "#7303C0", "#EC38BC", "#FDEFF9", "#00F2FE"],
  },
];

export function findCuratedCollection(id: string): CuratedCollectionPalette | undefined {
  return NAMED_CURATED_COLLECTIONS.find((c) => c.id === id);
}
