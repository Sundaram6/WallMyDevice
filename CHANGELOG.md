# Changelog

## [0.1.0] - Unreleased

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
