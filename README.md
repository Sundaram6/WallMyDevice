# WallMyDevice

**Create custom wallpapers for any screen**

WallMyDevice is a client-side wallpaper generator that lets you create unique, high-quality wallpapers using various algorithms. Generate wallpapers from waveforms, geometric patterns, typography, or fluid gradients — all deterministically with seeds.

## Features

- **4 Wallpaper Generators**: Waveform, Geometric, Typography, Fluid-Gradient
- **Deterministic Seed System**: Same seed = same wallpaper every time
- **Recipe System**: Import/Export configurations as JSON or URL hash
- **Drag & Drop Import**: Drop recipe files directly onto the app
- **Export Formats**: PNG, JPG, WEBP, SVG
- **Batch Export**: Download multiple wallpapers as ZIP
- **Custom Resolutions**: From 320px to 7680px
- **Device Frame Presets**: 10 device frames for preview
- **Mobile Support**: Responsive layout with bottom sheet
- **Keyboard Shortcuts**: Speed up your workflow
- **Effects**: Grain and blur overlays
- **Text Overlays**: Clock, date, and custom text
- **Color Palettes**: Curated palettes or extract from photos

## Generators

### Waveform
Generate abstract wave patterns with customizable frequency, amplitude, and color gradients.

### Geometric
Create tessellated geometric shapes with adjustable complexity and color schemes.

### Typography
Design text-based wallpapers with font, size, layout, and color options.

### Fluid-Gradient
Produce smooth, flowing gradients with organic movement (requires WebGL).

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
