# Changelog

## [2.2.0] - 2026-08-11

### Added
- **Mobile Bottom Sheet 3.0**: 3-state draggable sheet (Peek ~72px, Control ~40dvh, Full ~86dvh) with real-time pointer capture and least-squares velocity snapping.
- **Mobile Visual Generator Picker**: 2-column scrollable grid of visual cards with full-bleed thumbnail backgrounds, scrim overlays, active state border indicators, and unblocked native touch-scrolling.
- **Preview / Export Resolution Split**: Tiered canvas rendering engine (`dragging` @ 380px, `idle-mobile` @ 640px, `idle-desktop` @ 1200px, `export` native) with 100% resolution-independence verified across all 18 generators.
- **Smooth Resolution Tier Transitions**: 200ms ease-out GPU compositor CSS transitions for zero visual pop on slider release.

### Fixed
- **React Hydration Mismatch Fix**: Resolved SSR vs Client timestamp discrepancy in `SeasonalDropSection` countdown timer using stable initial mount state.
- **Touch-conflict disambiguation**: Pointer capture on sheet handle prevents scroll conflict between generator grid and sheet dragging.

## [2.1.0] - 2026-08-04

### Added
- **Zero-Flash URL State Sync**: Read `g` (generator), `s` (seed), `p` (dash-separated hex palette), and `d` (device frame) query params on load with zero flash.
- **Real-Time Address Bar Sync**: Automatic `history.replaceState` updates on Studio param changes without page reloads.
- **Edge OG Image Generator (`/api/og`)**: Fast social preview card route powered by Next.js `ImageResponse` with 1-year immutable CDN caching.
- **Surprise Me & Remix CTAs**: Full random reroll ("Surprise Me") and generator-isolated seed + palette reroll ("Remix").
- **Centralized Share & Toast Handler**: Unified `copyStudioLink` utility with clipboard fallback and `"✦ Wallpaper link copied to clipboard!"` toast feedback.

### Fixed
- Fixed Toast notification `onClose` ref lifecycle preventing premature closure on Studio re-renders.
- Resolved search parameter hex palette decoding and fallback behavior.

## [2.0.0] - 2026-08-03

### Added
- **18 Procedural Generators**: Added Aurora Flow, Bauhaus Blocks, Duotone Burst, Flow Field, Grain Texture, Halftone Dots, Low-Poly Terrain, Marble Fluid, Mesh Gradient, Metaballs, Starfield Nebula, Topographic Lines, Voronoi Mosaic, and Wave Interference.
- **125 Archive Swatches & 17 Curated Categories**: Expanded print archive with auto-rendered thumbnails and modal previews.
- **Photorealistic Device Frames**: Dedicated iPhone 16 Pro Max (Titanium + Dynamic Island), Samsung Galaxy S25 Ultra, iPad Pro 13", and 4K Desktop Display frames.
- **Volumetric Backlight Underglow**: Adaptive 5×5 grid color-sampled backlight halo around device mockups.
- **Thumbnail Auto-Render Generator Picker**: Live side-by-side light and dark mode thumbnail cards with scrim gradient overlays.

### Fixed
- Decoupled UI light/dark theme from canvas artwork rendering.
- Fixed Export button download handler and batch ZIP exporter.
- Scaled stroke and spatial parameters relative to target resolution for identical 500px preview vs 4K export rendering.

## [0.1.2] - 2026-07-22

- Continuous Waveform smoothing.
- Functional Light, Dark, and Auto palette modes.
- Correct palette resolution for SVG exports.
- Typography SVG alignment regression coverage.
- Fluid Gradient preview recovery after WebGL failure or generator switching.
- Reuse of the offscreen WebGL surface to avoid context exhaustion.

## [0.1.0] - 2026-07-21

### Added
- 4 wallpaper generators: waveform, geometric, typography, fluid-gradient
- Deterministic seed system with seeded PRNG
- Recipe import/export (JSON and URL hash)
- Drag-and-drop recipe import
- Single export (PNG, JPG, WEBP, SVG)
- Batch export (ZIP)
- Custom resolution support (320px to 7680px)
- 10 device frame presets
- Mobile-responsive layout with bottom sheet
- Keyboard shortcuts (R, Space, 1-4, Ctrl+S, Ctrl+Shift+S, Escape)
- Grain and blur effects
- Clock, date, and text overlays
- Curated color palette library
- Image-extract palette from photos
- Error boundary for crash recovery
- Export size limits (7680px max, 50MP total)
- WebGL fallback for fluid-gradient generator

### Verified
- 128 unit and component tests passing
- Production build successful
- Deterministic rendering across all generators
- Recipe round-trip lossless
- Export dimensions exact
- Mobile layout functional
- Keyboard shortcuts safe

### Known Limitations
- WebGL required for fluid-gradient generator (fallback message shown)
- Maximum export dimension: 7680px
- Maximum total pixels: 50MP
- No server-side rendering (client-side only)
- No user accounts or cloud sync
