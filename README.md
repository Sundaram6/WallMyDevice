# WallMyDevice

**Create custom wallpapers for any screen**

WallMyDevice is a client-side wallpaper generator that lets you create unique, high-quality wallpapers using various algorithms. Generate wallpapers from waveforms, geometric patterns, typography, or fluid gradients — all deterministically with seeds.

## Features

- **18 Procedural Wallpaper Generators**: Aurora Flow, Bauhaus Blocks, Duotone Burst, Flow Field, Fluid Gradient, Geometric, Grain Texture, Halftone Dots, Low-Poly Terrain, Marble Fluid, Mesh Gradient, Metaballs, Starfield Nebula, Topographic Lines, Typography, Voronoi Mosaic, Wave Interference, Waveform
- **125 Archive Presets & 17 Curated Categories**: Rich, non-repetitive print swatch archive with real canvas swatches and modal preview cards
- **Photorealistic Device Frames**: iPhone 16 Pro, Samsung Galaxy S25 Ultra, iPad Pro 13", 4K Desktop, Ultrawide, and Custom aspect bounds
- **Dynamic Volumetric Underglow**: Adaptive 5×5 grid color-sampled backlight halo around device mockups for every generator
- **Deterministic Seed System**: Same seed = same wallpaper every time
- **Recipe System**: Import/Export configurations as JSON or URL hash
- **Drag & Drop Import**: Drop recipe files directly onto the app
- **Export Formats**: PNG, JPG, WEBP, SVG
- **Batch Export**: Download multiple wallpapers as ZIP
- **Custom Resolutions**: From 320px to 7680px (up to 50MP)
- **Accessibility & Contrast Auditing**: Built-in vision deficiency filters & legibility grid overlay
- **Keyboard Shortcuts**: Speed up your workflow
- **Effects**: Grain and blur overlays
- **Text Overlays**: Clock, date, and custom text
- **Color Palettes**: Curated palettes, HSL lightness sorting, or extract from photos

## Generators

1. **Aurora Flow**: Animated-style flowing aurora color ribbons & plasma field
2. **Bauhaus Blocks**: Constructivist flat-color geometric circles, squares & diagonal compositions (SVG supported)
3. **Duotone Burst**: Radial sunburst gradient with ray sharpness & center offset controls
4. **Flow Field**: Noise-driven particle trail vector flow lines
5. **Fluid Gradient**: Smooth multi-point radial gradients with composited noise (WebGL with 2D Canvas fallback)
6. **Geometric**: Grid pattern of repeated geometric primitives (SVG supported)
7. **Grain Texture**: Fine analog film noise composited over gradient fills
8. **Halftone Dots**: Screenprint halftone dot grid driven by luminance
9. **Low-Poly Terrain**: Faceted triangulated mesh landscape grid
10. **Marble Fluid**: Domain-warped fluid marble paint texture
11. **Mesh Gradient**: Multi-point smooth gradient mesh with soft color blending
12. **Metaballs**: Soft fluid metaball blobs merging via implicit fields
13. **Starfield Nebula**: Particle stars over soft gradient nebula cloud base
14. **Topographic Lines**: Elevation contour map lines generated from noise (SVG supported)
15. **Typography**: Minimalist statement text and typographic layouts (SVG supported)
16. **Voronoi Mosaic**: Cellular tessellation mosaic with border styling
17. **Wave Interference**: Overlapping ripple wave fields creating moiré patterns
18. **Waveform**: Layered sine waves and terrain contours (SVG supported)

## Supported Formats

| Format | Export | Notes |
|--------|--------|-------|
| PNG | ✓ | Lossless, supports transparency |
| JPG | ✓ | Smaller file size, no transparency |
| WEBP | ✓ | Modern format, good compression |
| SVG | ✓ | Vector, infinite scalability |

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `R` | Randomize seed |
| `Space` | Regenerate with new seed |
| `1-4` | Switch generator (1=Waveform, 2=Geometric, 3=Typography, 4=Fluid) |
| `Ctrl+S` | Export wallpaper |
| `Ctrl+Shift+S` | Batch export |
| `Escape` | Close modals/panels |

## Local Development

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Setup

```bash
# Clone the repository
git clone https://github.com/Sundaram6/WallMyDevice.git
cd WallMyDevice

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:3000`

### Testing

```bash
# Run unit tests
npm test

# Run E2E tests
npm run test:e2e
```

### Building

```bash
# Build for production
npm run build

# Start production server
npm run start
```

## Deployment

Deployment status: v0.1.0 Released at https://wallmydevice.vercel.app

WallMyDevice is configured for Vercel deployment:

```bash
# Deploy to Vercel
vercel

# Deploy to production
vercel --prod
```

## Known Limitations

- **WebGL Required**: Fluid-gradient generator requires WebGL support (fallback message shown if unavailable)
- **Max Export Size**: 7680px maximum dimension
- **Max Total Pixels**: 50MP total pixel limit
- **Client-Side Only**: No server-side rendering
- **No Cloud Sync**: No user accounts or cloud storage

## Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+
