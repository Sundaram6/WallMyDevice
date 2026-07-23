export type ChangelogRelease = {
  version: string;
  releaseDate: string;
  title: string;
  summary: string;
  changes: string[];
  fixes: string[];
  limitations: string[];
};

export const CHANGELOG_HISTORY: ChangelogRelease[] = [
  {
    version: "v0.1.2",
    releaseDate: "2026-07-24",
    title: "Product Coherence Pass & Multi-Device Pack Export",
    summary: "Complete mobile/tablet responsiveness, 4 deterministic variations, multi-device pack ZIP exports, and real feedback delivery.",
    changes: [
      "4 Deterministic Variations with '+ Another Set' seed advancing",
      "Multi-device pack export (ZIP) with manifest.json containing resolution & seed metadata",
      "Real GitHub issue prefilled feedback delivery endpoint",
      "Preview-only vision deficiency & contrast legibility overlays",
      "Curated Collections with real cover wallpaper renders",
      "Deterministic Featured Today daily wallpaper drop",
    ],
    fixes: [
      "Mobile navigation drawer threshold updated to 768px (md)",
      "Touch targets enlarged to >= 44x44px across all controls",
      "Search indexing expanded across tags, category, generator, and palette colors",
      "Fixed hardcoded resolution labels with adaptive orientation tags",
    ],
    limitations: [
      "Local-only profile; user preferences saved in browser localStorage (no cloud sync)",
      "4 active procedural generators (Waveform, Fluid Gradient, Geometric, Typography)",
      "WebGL shader fallbacks active when GPU hardware acceleration is unavailable",
      "Animated / Live Wallpaper export (MP4/WebM) is a documented future boundary",
    ],
  },
  {
    version: "v0.1.0",
    releaseDate: "2026-07-01",
    title: "Initial WallMyDevice Release",
    summary: "Print Swatch Archive, procedural generators, and resolution preset export tools.",
    changes: [
      "Interactive procedural Studio canvas renderer",
      "Curated archive presets and palette swatches",
      "Resolution preset exporter for mobile & desktop displays",
    ],
    fixes: ["Initial release stability"],
    limitations: [
      "Browser local storage fallback only",
    ],
  },
];

export const CURRENT_VERSION = CHANGELOG_HISTORY[0].version;
export const CURRENT_RELEASE_DATE = CHANGELOG_HISTORY[0].releaseDate;
