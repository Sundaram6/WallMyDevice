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
    version: "v2.2.0",
    releaseDate: "2026-08-11",
    title: "Mobile Sheet 3.0, Visual Generator Picker, Resolution Split & Hydration Fix",
    summary: "Draggable 3-state mobile bottom sheet, 2-column visual generator picker grid, tiered preview vs export resolution split, and React hydration fix.",
    changes: [
      "Mobile Bottom Sheet 3.0: 3-state draggable sheet (Peek ~72px, Control ~40dvh, Full ~86dvh) with real-time pointer capture and velocity-based snapping",
      "Mobile Visual Generator Picker: 2-column scrollable visual grid with portrait card thumbnails, scrim overlays, active state border indicators, and unblocked touch-scrolling",
      "Preview / Export Resolution Split: Tiered canvas rendering (dragging @ 380px, idle-mobile @ 640px, idle-desktop @ 1200px) with 100% resolution-independence across all 18 generators",
      "Smooth Resolution Tier Transitions: 200ms ease-out GPU compositor CSS transitions for zero visual pop on slider release",
    ],
    fixes: [
      "React Hydration Mismatch Fix: Resolved SSR vs Client timestamp discrepancy in SeasonalDropSection countdown timer using stable initial mount state",
      "Touch-conflict disambiguation: Pointer capture on sheet handle prevents scroll conflict between generator grid and sheet dragging",
    ],
    limitations: [
      "Shader generators degrade to 2D canvas fallback when WebGL context is unavailable",
    ],
  },
  {
    version: "v2.1.0",
    releaseDate: "2026-08-04",
    title: "Growth & Sharing: URL State Sync, Edge OG Cards, Remix & Surprise Me",
    summary: "Instant shareable studio state URLs, fast Edge OG card preview generation, two-tier random discovery (Surprise Me & Remix), and unified copy link notifications.",
    changes: [
      "Zero-Flash URL State Sync: Parse and initialize Studio state from URL query parameters (g, s, p, d) synchronously on load with zero flash",
      "Real-Time Address Bar Sync: Studio parameter changes automatically update URL via history.replaceState without page reload or history clutter",
      "Edge OG Image Generation: Dedicated /api/og route rendering fast 1200x630 social cards with public 1-year immutable CDN caching",
      "Surprise Me & Remix CTAs: Surprise Me for full random rerolls and Remix for fixed-generator seed and palette variation",
      "Unified Share Handler: Centralized copyStudioLink helper with copy-to-clipboard fallback and on-brand toast feedback",
    ],
    fixes: [
      "Fixed Toast notification ref lifecycle to prevent premature closure on Studio re-renders",
      "Resolved search parameter hex palette decoding and fallback behavior",
    ],
    limitations: [
      "Edge OG image preview uses fast CSS gradient approximation",
    ],
  },
  {
    version: "v2.0.0",
    releaseDate: "2026-08-03",
    title: "WallMyDevice 2.0: Studio Redesign & Expanded Archive",
    summary: "Complete Studio overhaul with 18 procedural generators, 125 curated archive swatches, photorealistic device frames, dynamic volumetric backlight underglow, and high-performance export pipeline.",
    changes: [
      "18 Procedural Generators: Added Aurora Flow, Bauhaus Blocks, Duotone Burst, Flow Field, Grain Texture, Halftone Dots, Low-Poly Terrain, Marble Fluid, Mesh Gradient, Metaballs, Starfield Nebula, Topographic Lines, Voronoi Mosaic, and Wave Interference",
      "125 Archive Presets: Expanded swatch library with 36 new distinct presets across 17 categories including Generative, Cosmic, Landscape, and Print",
      "Photorealistic Device Frames: Dedicated iPhone 16 Pro Max (Titanium + Dynamic Island), Samsung Galaxy S25 Ultra, iPad Pro 13\", and 4K Desktop Display frames",
      "Volumetric Backlight Underglow: 5×5 grid adaptive color sampling with luminance boosting for vibrant ambient backlight halos on all 18 generators",
      "Typography Auto-Fit Engine: Dynamic canvas width scaling preventing text overflow on narrow targets",
      "Single-Click High-Res & Batch ZIP Exporter: Export PNG, JPG, WEBP, and SVG with deterministic resolution presets",
      "Decoupled UI Theme & Canvas Rendering: Switching UI light/dark mode updates chrome elements without altering wallpaper artwork",
    ],
    fixes: [
      "Resolved export button click handler and batch zip generator",
      "Fixed 2D canvas fallback for fluid gradient and WebGL shader targets",
      "Fixed preset parameter schema alignment across all 125 archive presets",
      "Corrected top toolbar contrast & truncation issues on small viewports",
    ],
    limitations: [
      "Local-only profile; preferences saved in browser localStorage",
      "WebGL shader acceleration active for complex 3D/fluid generators with 2D Canvas fallback",
    ],
  },
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
