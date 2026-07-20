# WallMyDevice — Design Spec

**Date:** 2026-07-20
**Status:** Approved
**Scope:** v1 (lean)

A web application that generates highly customizable, downloadable wallpapers for desktop and mobile devices. Pure client-side, no signup, reproducible from a recipe. This spec covers v1 only; accounts and the public gallery are explicitly deferred to Phase 2.

---

## 1. Constitution (non-negotiable)

These principles govern every decision in the spec. If a conflict arises, the constitution wins.

1. **Instant, local, no-friction.** Open the site, get a wallpaper in under 3 seconds. No signup, no paywalls, no spinners for the core preview.
2. **The preview is the source of truth.** What the user sees in the preview is pixel-accurate to the export. No surprises.
3. **Every generator is a pure function.** `generate(params, seed, palette) -> render(target)`. No global state, no hidden randomness, no browser-only side effects that prevent a future Flutter port.
4. **Reproducibility is a first-class feature.** Any wallpaper is exactly reproducible from its seed + params + palette + resolution + overlays. The recipe JSON captures all of these.
5. **Resolution independence.** Every generator scales cleanly to any custom width × height, not just presets.
6. **Minimal, uncluttered UI.** The preview is the hero. The control panel supports, never competes.
7. **Pluggable generators.** Adding a new style = a new folder under `lib/generators/` + one line in the registry. No app-shell changes.
8. **Client-side first.** Preview generation never requires a server round-trip. Server work (Phase 2) is for accounts and gallery only.
9. **No dark patterns.** No fake urgency, no forced signups, no disguised upsells.
10. **Performance is a feature.** Slider drags feel live. If a generator can't hit reasonable performance, it gets optimized or descoped.

---

## 2. Tech stack

| Concern | Choice | Why |
|---|---|---|
| Framework | Next.js 14 (App Router) + TypeScript | Per brief; SSR not needed for the editor route but useful for landing/marketing pages. |
| Styling | Tailwind CSS | Per brief. |
| State | Zustand | Tiny, no provider boilerplate, fine-grained subscriptions, easy URL/localStorage persistence. |
| Canvas2D rendering | Native `<canvas>` 2D context | For waveform, geometric, typography. No library needed. |
| Shader rendering | `ogl` (~30KB) | Lightweight, raw GLSL, no scene-graph opinions that would fight the pure-function principle. |
| Batch export | `jszip` | Standard client-side zip. |
| Testing | Vitest + Testing Library + Playwright | Per project conventions. |
| Lint/format | ESLint + Prettier | Per project conventions. |
| Deployment | Vercel | Per brief. |

**No additional UI libraries** (no Radix, no shadcn, no headlessui). The control panel uses small in-house primitives — sliders, toggles, color pickers, file inputs. Total UI primitive count stays under 10 files.

---

## 3. Repo structure

```
wallmydevice/
├─ app/
│  ├─ layout.tsx                 # dark theme, fonts, global shell
│  ├─ page.tsx                   # main editor: preview + panel
│  └─ globals.css
├─ components/
│  ├─ Preview/
│  │  ├─ PreviewCanvas.tsx       # generic <canvas> wrapper, renders the active generator
│  │  ├─ DeviceFrame.tsx         # CSS phone/monitor bezel around the canvas
│  │  └─ BottomSheet.tsx         # mobile-only draggable panel
│  ├─ Panel/
│  │  ├─ ControlPanel.tsx        # composes all controls
│  │  ├─ GeneratorPicker.tsx     # 4-card picker
│  │  ├─ ParamsForm.tsx          # dynamically rendered from generator.schema
│  │  ├─ PalettePicker.tsx       # swatches + custom + image-extract
│  │  ├─ ModeToggle.tsx          # light/dark/auto
│  │  ├─ SeedBar.tsx             # seed input, randomize, copy-share
│  │  ├─ ResolutionPicker.tsx    # device presets + custom WxH
│  │  └─ ExportBar.tsx           # single + batch export, recipe export
│  └─ ui/                        # small primitives (Slider, Button, etc.)
├─ lib/
│  ├─ generators/                # ★ the pluggable core
│  │  ├─ types.ts                # Generator<Params> interface, Recipe type
│  │  ├─ registry.ts             # map of id -> Generator
│  │  ├─ waveform/index.ts       # Canvas2D generator
│  │  ├─ geometric/index.ts      # Canvas2D generator
│  │  ├─ typography/index.ts     # Canvas2D generator
│  │  └─ fluid-gradient/index.ts # ogl shader generator + GLSL
│  ├─ render/
│  │  ├─ renderToTarget.ts       # shared render helper (the constitution-enforcer)
│  │  ├─ renderPreview.ts        # wraps renderToTarget for the preview canvas
│  │  ├─ renderExport.ts         # wraps renderToTarget for export
│  │  ├─ grain.ts                # post-pass grain overlay
│  │  └─ overlays.ts             # post-pass clock/date/text overlays
│  ├─ prng.ts                    # seeded mulberry32
│  ├─ recipe/
│  │  ├─ encode.ts               # Recipe -> URL hash + JSON
│  │  ├─ decode.ts               # inverse
│  │  └─ validate.ts             # zod schema
│  ├─ export/
│  │  ├─ exportImage.ts          # canvas -> blob (png/jpg/webp)
│  │  ├─ batchExport.ts          # generates N images + zips
│  │  └─ filename.ts             # naming convention
│  └─ devices/
│     ├─ presets.ts              # the list of device resolutions
│     └─ aspectRatio.ts          # helpers
├─ store/
│  └─ useEditorStore.ts          # Zustand
├─ tests/
│  ├─ generators/                # per-generator snapshot test
│  │  └─ *.test.ts
│  ├─ recipe.test.ts             # roundtrip encode/decode
│  └─ e2e/
│     ├─ fidelity.spec.ts        # Playwright
│     ├─ recipe.spec.ts
│     └─ keyboard.spec.ts
├─ docs/
│  ├─ qa.md                      # manual QA checklist
│  └─ perf.md                    # perf testing notes
├─ package.json
├─ tsconfig.json
├─ tailwind.config.ts
├─ next.config.mjs
├─ vitest.config.ts
└─ playwright.config.ts
```

**Key rule:** `app/` and `components/` never reach into generator internals. They call `registry.get(generatorId).render(target, params, seed, palette)`. The generator's own `params` shape and `schema` drive the dynamic `ParamsForm.tsx`. Adding a 5th generator = new folder + one line in `registry.ts`. Nothing else.

---

## 4. Generator interface contract

The single source of truth for what makes a generator a generator.

```ts
// lib/generators/types.ts
import type { z } from 'zod';

export type Rng = () => number;          // returns [0, 1), deterministic from seed
export type RenderTarget = {
  ctx: CanvasRenderingContext2D | WebGLRenderingContext;
  width: number;                         // pixels
  height: number;                        // pixels
  dpr: number;                           // device pixel ratio
};
export type GlobalContext = {
  blur: number;                          // 0..1; opt-in per generator
  grain: { enabled: boolean; intensity: number }; // for generators that bake grain in (none in v1)
};

export type ParamSchema<S extends z.ZodTypeAny> = {
  zod: S;                                // validation + form generation
  defaults: z.infer<S>;
};

export type Generator<P = unknown> = {
  id: string;                            // 'waveform', 'geometric', ...
  label: string;                         // human-readable
  kind: 'canvas2d' | 'shader';
  schema: ParamSchema<z.ZodType<P>>;
  render: (
    target: RenderTarget,
    params: P,
    seed: string,
    palette: string[],
    rng: Rng,
    context: GlobalContext
  ) => void;
  toSvg?: (                              // only present if supportsSvgExport
    size: { width: number; height: number },
    params: P,
    seed: string,
    palette: string[]
  ) => string;
  supportsSvgExport: boolean;
  paramControls: ParamControl<P>[];
};

export type ParamControl<P> = {
  key: keyof P;
  label: string;
  type: 'slider' | 'color' | 'select' | 'toggle' | 'text';
  min?: number;
  max?: number;
  step?: number;
  options?: readonly { value: string; label: string }[];
  helperText?: string;
};
```

**Render function contract** (constitution #3, #5, #6):

- **Pure:** no closures over outer state, no `Date.now()`, no `Math.random()`. All randomness via the provided `Rng`, seeded from `seed`.
- **Total:** works at any `width × height`. No hardcoded resolutions.
- **Idempotent:** calling `render` twice with the same target, params, and seed produces pixel-identical output. The generator mutates the provided target; it does not allocate new canvases.
- **Resizes internally:** scales drawing to `target.width × target.height`. The caller sets the canvas's pixel size before invoking `render`.

**Registry:**

```ts
// lib/generators/registry.ts
import { waveform } from './waveform';
import { geometric } from './geometric';
import { typography } from './typography';
import { fluidGradient } from './fluid-gradient';

export const REGISTRY = {
  [waveform.id]: waveform,
  [geometric.id]: geometric,
  [typography.id]: typography,
  [fluidGradient.id]: fluidGradient,
} as const;

export type GeneratorId = keyof typeof REGISTRY;

export function getGenerator(id: string): Generator | undefined {
  return REGISTRY[id as GeneratorId];
}
```

**Why `paramControls` is separate from `schema.zod`:** zod is great for validation but its API is awkward for driving a polished slider UI. `paramControls` is the UI-facing description; a small test at module load validates that every `key` in `paramControls` exists in the zod schema.

**v1 generators:**

| ID | Kind | Params (planned, ≥4 each) | SVG export |
|---|---|---|---|
| `waveform` | canvas2d | layers, jaggedness, smoothing, lineThickness, amplitude | No |
| `geometric` | canvas2d | shape, gridSize, rotation, strokeWidth, density | Yes |
| `typography` | canvas2d | text, font, size, weight, letterSpacing, alignment | Yes |
| `fluid-gradient` | shader | blobCount, distortion, swirl, contrast, saturation | No |

---

## 5. State & recipe model

**Single Zustand store** for editor state.

```ts
// store/useEditorStore.ts
type Mode = 'light' | 'dark' | 'auto';
type ExportFormat = 'png' | 'jpg' | 'webp' | 'svg';

type EditorState = {
  // selection
  generatorId: GeneratorId;
  params: Record<GeneratorId, unknown>; // lazy-filled with defaults on first use

  // style
  paletteId: string | null;            // 'sunset' etc., null = custom
  palette: string[];                   // 2–6 hex colors
  mode: Mode;
  seed: string;                        // 1–16 chars, base36

  // finishing passes
  grainEnabled: boolean;
  grainIntensity: number;              // 0..1
  blurIntensity: number;               // 0..1, only affects fluid-gradient in v1

  // resolution
  resolutionId: string;                // 'iphone-15-pro' | 'custom' | ...
  customWidth: number;
  customHeight: number;
  aspectLock: boolean;

  // overlays (each independently toggleable)
  overlayClock: boolean;
  overlayDate: boolean;
  overlayText: boolean;
  overlayTextValue: string;
  overlayFont: string;                 // 'Inter' | 'JetBrains Mono' | 'Playfair Display'
  overlaySize: number;                 // em factor

  // export
  exportFormat: ExportFormat;

  // UI (not in recipe)
  bottomSheetOpen: boolean;

  // actions
  setGenerator: (id: GeneratorId) => void;
  updateParam: (id: GeneratorId, key: string, value: unknown) => void;
  setPalette: (palette: string[]) => void;
  randomizeSeed: () => void;
  setSeed: (seed: string) => void;
  // ... etc
};
```

**Recipe format (the JSON you download / put in the URL hash):**

```json
{
  "v": 1,
  "type": "wallmydevice/recipe",
  "generator": "waveform",
  "params": { "layers": 5, "jaggedness": 0.4, "smoothing": 0.7, "lineThickness": 1.5, "amplitude": 0.6 },
  "palette": ["#0f172a", "#1e293b", "#f59e0b", "#fbbf24"],
  "mode": "dark",
  "seed": "k3p9x2a7",
  "grain": { "enabled": true, "intensity": 0.08 },
  "blur": 0.0,
  "resolution": { "preset": "iphone-15-pro", "width": 1179, "height": 2556 },
  "overlays": {
    "clock": false, "date": false, "text": true, "value": "stay hungry",
    "font": "Inter", "size": 1.0
  }
}
```

**Recipe invariants** (enforced by `lib/recipe/validate.ts` with zod):

1. `v: 1` always present.
2. `type: "wallmydevice/recipe"` distinguishes from arbitrary JSON.
3. `generator` must be a registered id; otherwise recipe is rejected with a human-readable error.
4. `params` validated against the chosen generator's `schema.zod`.
5. `seed` matches `/^[0-9a-z]{1,16}$/` (base36, max 16 chars).
6. `palette` is 2–6 valid 6-digit hex strings (`/^#[0-9a-fA-F]{6}$/`).

**URL hash encoding:**

- Recipe JSON → minify → `pako.deflate` (gzip) → base64url → `#r=<encoded>`.
- Cap at ~2KB raw; recipes beyond that get a "too long for URL" warning and fall back to file export.
- On page load: parse hash, decode, validate, hydrate store. Invalid hash → silently ignored.
- A top-level effect subscribes to store changes and rewrites `location.hash` (debounced 500ms).

**localStorage:**

- Last-used editor state persisted under `wallmydevice:lastState`. Restored on next visit. URL hash wins if present.
- Imported recipes do NOT overwrite `lastState`.

---

## 6. Preview & export pipeline

**The contract:** `renderPreview` and `renderExport` both call the same `renderToTarget` helper with the same params and seed. They differ only in canvas size.

```
┌────────────────────────────────────────────────────────────┐
│ useEditorStore (Zustand)                                    │
└─────────────────────┬──────────────────────────────────────┘
                      │ (change, rAF-throttled for sliders)
                      ▼
┌────────────────────────────────────────────────────────────┐
│ PreviewCanvas (React)                                       │
│   - canvas pixel size = device-frame inner box × DPR        │
│     (capped at 2× DPR)                                      │
│   - calls renderPreview(canvas, store, generator)           │
└─────────────────────┬──────────────────────────────────────┘
                      │
                      ▼
┌────────────────────────────────────────────────────────────┐
│ renderToTarget(target, state, generator)                    │
│   1. resolve palette for current mode                       │
│   2. build rng from seed                                    │
│   3. build GlobalContext from state (blur, grain)           │
│   4. generator.render(target, params, seed, palette,        │
│        rng, context) — blur is opt-in per generator         │
│   5. apply grain overlay if enabled (post-pass)             │
│   6. draw overlays (clock/date/text) if enabled             │
└────────────────────────────────────────────────────────────┘

On Download:
┌────────────────────────────────────────────────────────────┐
│ renderExport(state, generator, targetSize, format)          │
│   - creates an OffscreenCanvas at full target size          │
│   - calls the SAME renderToTarget helper                   │
│   - exports to blob (PNG/JPG/WEBP via canvas.toBlob,        │
│     SVG via generator's dedicated toSvg() method)           │
└────────────────────────────────────────────────────────────┘
```

**`renderToTarget` is the constitution-enforcer** — it is the single function both preview and export invoke. Same code, same params, same seed → same pixels. The only differences are (a) canvas pixel dimensions, (b) DPR, both of which are inputs to the generator, not branching logic inside it.

**Mode resolution:**

```ts
function resolvePalette(raw: string[], mode: Mode, auto: 'light' | 'dark'): string[] {
  if (mode === 'auto') return auto === 'dark' ? darkPalette(raw) : lightPalette(raw);
  return mode === 'dark' ? darkPalette(raw) : lightPalette(raw);
}
```

- **Curated palettes tagged `light` / `dark` / `both`.** The palette picker shows only palettes matching the current mode. Avoids muddy tonal inversions.
- **Auto mode:** uses `Intl.DateTimeFormat().resolvedOptions().timeZone` + local hour. Heuristic: 6am–6pm → light, else dark. No location permission needed.

**Debounce strategy:**

- Slider drags: rAF-throttled (one render per frame).
- Color, mode, generator, seed, resolution: 250ms debounce (color/mode/generator/seed are still cheap, but they re-trigger the device-frame safe-zone overlay; resolution change requires a canvas resize).
- On generator switch: 200ms cross-fade between the old and new canvas state (old canvas kept around for the fade duration, then disposed).

**The "preview is the source of truth" guarantee, mechanically:**

1. Same `renderToTarget` function, same params, same seed → same pixels.
2. Drift is caught by a per-generator test (see §8).

---

## 7. UI: control panel, device frame, mobile

**Desktop layout (≥1024px):**

- Top bar: 48px. Logo + "Share" button (copies URL) + theme indicator. Always visible.
- Control panel: 320px right sidebar, scrollable independently.
- Preview area: remaining width. Centered. The preview canvas is always at the device-frame inner-box size × DPR, regardless of export resolution.
- 24px gutter between preview and panel. 16px panel internal padding.

**Device frame component (`components/Preview/DeviceFrame.tsx`):**

- Pure CSS. The frame is a styled div containing the canvas. Inner box has a known aspect ratio per device. Canvas fills inner box.
- Frame variants: `desktop-monitor` (bezel + thin stand), `iphone` (rounded corners + Dynamic Island + home indicator), `ipad`, `macbook` (notch + camera), `android`, `ultrawide` (thin bezel, very wide), `none` (just the canvas on a dark surface, for custom resolutions).
- Frame dimensions are independent of the wallpaper's resolution. The CSS size of the frame is fixed; the canvas inside fills the inner box at the frame's aspect ratio.
- Notch / home indicator are CSS overlays on top of the canvas. They are NOT part of the export. A thin dashed line shows the mobile lock-screen safe-zone (top 12%, bottom 8%) as a visual hint only.

**Device presets (`lib/devices/presets.ts`):**

| ID | Label | W × H | Frame |
|---|---|---|---|
| `desktop-1080p` | Desktop 1080p | 1920 × 1080 | desktop-monitor |
| `desktop-1440p` | Desktop 1440p | 2560 × 1440 | desktop-monitor |
| `desktop-4k` | Desktop 4K | 3840 × 2160 | desktop-monitor |
| `ultrawide-3440x1440` | Ultrawide 21:9 | 3440 × 1440 | ultrawide |
| `macbook-14` | MacBook 14" | 3024 × 1964 | macbook |
| `iphone-15-pro` | iPhone 15 Pro | 1179 × 2556 | iphone |
| `iphone-15` | iPhone 15 | 1170 × 2532 | iphone |
| `pixel-8-pro` | Pixel 8 Pro | 1344 × 2992 | android |
| `ipad-air-11` | iPad Air 11" | 1640 × 2360 | ipad |
| `custom` | Custom… | 1920 × 1080 | none |

**Custom resolution input:**

- Two number inputs (W × H), min 320, max 15360 per dimension.
- Aspect-lock toggle: when on, changing W adjusts H to keep aspect, and vice versa.
- "Common" links: 16:9, 9:16, 4:3, 3:4, 21:9, 1:1 — click to set W×H from the first matching preset.

**Mobile (<768px) — bottom sheet:**

- Top bar 48px, preview area takes remaining height, bottom sheet at bottom.
- Sheet snap points: collapsed (64px, shows active generator name + "tap to expand"), half (50vh), full (90vh).
- Drag handle on top. Pointer Events API (not touch+mouse duplication).
- Sheet body is the *same* `ControlPanel` from desktop, wrapped in a draggable container.
- On mobile, the frame picker hides desktop/ultrawide/macbook options (only `iphone`, `android`, `ipad`, `none` show).

**Tablet (768–1023px):** narrower 280px sidebar, same as desktop but compact. No bottom sheet.

**Keyboard shortcuts:**

| Key | Action |
|---|---|
| `R` or `Space` | Randomize seed (preventDefault on Space to avoid page scroll) |
| `1` / `2` / `3` / `4` | Switch to generator 1–4 in picker order |
| `Cmd/Ctrl+S` | Focus the export bar |
| `Cmd/Ctrl+Shift+S` | Copy share-link to clipboard |
| `Esc` | Collapse mobile bottom sheet |

Shortcuts are ignored when focus is in an input (text field, slider being dragged) so they don't fight the form.

**Theming:**

- App is always dark mode in v1. No theme switcher. The wallpapers can be light or dark; the chrome is always dark.
- One accent color: soft off-white (`text-zinc-100`) for active states, a single subtle blue (`bg-blue-500/10`) for selected pills. No rainbow, no decorative gradient.

**Motion:**

- Generator switch: 200ms cross-fade on the preview canvas.
- Bottom sheet snap: spring physics (300ms).
- No animation on slider value text.
- No skeleton loaders or spinners in the core flow.

---

## 8. Export, batch export, recipe I/O

**Single export (`lib/export/exportImage.ts`):**

```ts
export async function exportImage(
  state: EditorState,
  generator: Generator,
  size: { width: number; height: number },
  format: ExportFormat
): Promise<Blob> {
  if (format === 'svg' && !generator.supportsSvgExport) {
    throw new Error(`${generator.label} cannot export as SVG`);
  }

  if (format === 'svg') {
    return new Blob([generator.toSvg!(size, state.params[generator.id], state.seed, state.palette)], { type: 'image/svg+xml' });
  }

  const canvas = new OffscreenCanvas(size.width, size.height);
  const ctx = canvas.getContext('2d')!;
  await renderToTarget(
    { ctx, width: size.width, height: size.height, dpr: 1 },
    state,
    generator
  );

  const mime = { png: 'image/png', jpg: 'image/jpeg', webp: 'image/webp' }[format];
  const quality = format === 'jpg' ? 0.92 : undefined;
  return canvas.convertToBlob({ type: mime, quality });
}
```

- PNG is the default. JPG and WEBP available. WEBP produces smaller files than PNG at equivalent visual quality.
- SVG only available for generators with `supportsSvgExport: true` (in v1: `geometric` and `typography`).
- `OffscreenCanvas` for zero-DOM rendering; works in a Web Worker if we want to offload later.

**Download UX:**

- Filename pattern: `wallmydevice-{generatorId}-{seed}-{w}x{h}.{ext}`. Example: `wallmydevice-waveform-k3p9x2a7-1179x2556.png`.
- During generation: button shows "Rendering…" (max 200ms perceived; even 4K exports are sub-100ms on modern hardware). No blocking modal.
- On error: inline red text under the button, "Render failed: <reason>". Never a popup.

**Batch export (`lib/export/batchExport.ts`):**

- Triggered by "Batch export" button. Opens an inline panel (not a modal) listing device presets as checkboxes. Default selection: the current device + 2 alternatives.
- User can add custom sizes via the same W×H inputs.
- Format is shared across all selected items.
- On "Generate all": sequentially render each size, add to a `JSZip` instance, show a thin progress bar. Cancellable.
- Result: single download of `wallmydevice-batch-{timestamp}.zip`.
- For large batches (>20 items), render in `requestIdleCallback` to keep UI responsive. v1 batches are 2–10 items; this is future-proofing.

**Recipe JSON export:**

- "Recipe JSON" button → `recipe.encode(state)` → pretty-printed (2-space indent) JSON → download as `wallmydevice-recipe-{seed}.json`.
- "Share link" button in the top bar is a shortcut for the URL hash form: copies `location.href` to clipboard with a brief "Copied!" toast.

**Recipe import (three mechanisms, all converge on one decoder):**

1. **URL hash on page load.** `app/page.tsx` initial effect reads `location.hash`, decodes, validates, and if valid, replaces the entire store state.
2. **Drag-and-drop a `.json` file.** Top-level drop zone on `<body>`. On drop: read the file, decode, validate, hydrate store. Invalid → dismissible toast "That doesn't look like a WallMyDevice recipe."
3. **"Load recipe" button.** Opens an inline paste area (not a modal) below the button. User pastes JSON, hits Load.

All three converge on `applyRecipe(recipeJson)` in `lib/recipe/decode.ts`.

**Error handling:** all errors are user-readable strings, no stack traces, no third-party `Error.message` leaking. The vocabulary is controlled.

---

## 9. Performance, testing, what's out of v1

### Performance budgets

| Action | Target |
|---|---|
| Initial page load → first wallpaper visible | < 1.5s on 4G, mid-range laptop |
| Slider drag → preview update | < 16ms per frame (60fps) |
| Color picker / mode toggle → preview update | < 50ms |
| Generator switch → preview stable | < 250ms |
| Single 4K PNG export | < 500ms |
| Batch of 5 sizes (mixed) | < 4s |

### Optimizations we ship in v1

- Slider drags rAF-throttled. Color/toggle/seed immediate.
- Preview canvas size = device-frame inner box × DPR, capped at 2× DPR.
- The ogl program for the fluid-gradient generator reuses the same `Program` across renders; only uniforms update.
- Font loading: 2 font files max (Inter for UI, one display font for typography generator, lazy-loaded). `font-display: swap`.
- Shader GLSL inlined as JS template strings (no fetch, no extra round-trip).
- Image-extract palette uses `OffscreenCanvas` to downscale to 64×64 then k-means (5 iterations, < 5ms).

### Optimizations we explicitly do NOT do in v1

- Web Worker for rendering (16ms budget is achievable on main thread for these generators).
- IndexedDB caching of generated images.
- WASM port of any generator.

### Testing strategy

1. **Per-generator unit tests** (`tests/generators/<name>.test.ts`):
   - Renders with default params + fixed seed → non-empty canvas.
   - Renders at three sizes (200×400, 2000×4000, 600×600) → no exceptions, output size matches input.
   - Renders with all-slider-min and all-slider-max params → no exceptions.
   - **Fidelity test**: renders at preview size and at export size, downscales export to preview with nearest-neighbor, asserts pixel diff < 1% on a per-channel mean.

2. **Pure-function tests:**
   - `prng.test.ts` — seeded PRNG is deterministic; different seeds → different sequences; same seed → identical.
   - `recipe.test.ts` — roundtrip: encode → decode → deep-equal original. Schema rejects malformed inputs.
   - `palette.test.ts` — color extraction from a test image returns 5 valid hex colors.
   - `aspectRatio.test.ts` — lock toggle maintains aspect under W and H changes.

3. **Component tests (Vitest + Testing Library):**
   - `ParamsForm.test.tsx` — given a generator's `paramControls`, renders the right number of controls. Changing a slider calls `updateParam` with the right key/value.
   - `ControlPanel.test.tsx` — switching generator updates the visible params. Mobile `BottomSheet` collapses/expands on drag.

4. **E2E (Playwright):**
   - `fidelity.spec.ts` — visits the app, picks each generator, screenshots preview canvas at 800×600, downloads PNG at 1600×1200, downscales the latter, asserts pixel similarity > 99%.
   - `recipe.spec.ts` — sets a known state, exports recipe JSON, reloads with the recipe, asserts the new state matches the original.
   - `keyboard.spec.ts` — pressing `R` updates the seed, pressing `1`/`2`/`3`/`4` switches generators.

5. **Manual QA checklist** (lives in `docs/qa.md`):
   - Each generator × each palette × each mode = 4 × ~10 × 3 = 120 combinations. Verified on Chrome, Safari, Firefox latest.

6. **Performance testing:**
   - One Playwright test times the initial page load and asserts < 1.5s. Runs on every PR.
   - Manual: DevTools Performance tab, drag a slider for 5 seconds, assert no frame > 20ms. Documented in `docs/perf.md`.

**Test coverage target:** 80% on `lib/` (generators, render, recipe, export). Components are lightly tested (high ROI only).

### Out of scope for v1

- ❌ Accounts, login, Supabase — Phase 2.
- ❌ Public gallery, community presets, favorites — Phase 2.
- ❌ Auto-changing daily wallpaper (Flutter) — future port, not a v1 deliverable.
- ❌ Weather overlay — requires a data dependency (location + API). v1 supports clock, date, text. Weather comes in v1.1 if requested.
- ❌ Multi-monitor stitched panorama — future preset.
- ❌ More than 4 generator styles — v1.1 adds 2–3 more; v2 hits 10.
- ❌ Light-mode UI chrome — app is dark-only. Wallpapers can be light or dark; the app cannot.
- ❌ i18n / l10n — English only.
- ❌ PWA / offline / service worker — defer to v1.1; an SW that mishandles cache invalidation can break the "preview is the source of truth" guarantee.
- ❌ 3D / WebGPU — generators stay in plain GLSL ES 3.0 fragment shaders for Flutter portability.
- ❌ Image-extract palette on mobile — desktop only.
- ❌ Touch gestures for the preview canvas itself — mobile UX is "view on phone, edit on desktop."

### In scope for v1 — definition of done

- 4 generators (waveform, geometric, typography, fluid-gradient), each with ≥4 params, registered, tested.
- Curated palette library: 8 named palettes, each tagged `light` / `dark` / `both`.
- Custom hex color picker (1–6 colors).
- Image-extract palette (desktop only).
- Light/dark/auto mode.
- Seed with copy-link + randomize (`R` / `Space`).
- Grain overlay (toggle + intensity).
- Blur slider (only affects fluid-gradient in v1).
- Overlays: clock, date, custom text — each independently toggleable, with font/size controls.
- 9 device presets + custom WxH with aspect lock.
- Device frame preview (6 frame styles).
- Mobile bottom sheet (3 snap points).
- Single PNG/JPG/WEBP/SVG* export. (*SVG: geometric + typography only.)
- Batch export as ZIP.
- Recipe JSON export/import (file, paste, URL hash).
- Keyboard shortcuts: R, Space, 1–4, Cmd/Ctrl+S, Cmd/Ctrl+Shift+S, Esc.
- Dark UI, single accent color, no decorative chrome.
- Lighthouse perf: 90+ on a mid-range laptop.
- Tests: per-generator fidelity, recipe roundtrip, e2e fidelity, keyboard.
- Deploy to Vercel.

---

## 10. Open questions

None at spec-time. All material decisions are resolved above. If a future v1.x question arises (e.g. "should we add a 5th generator before launch?"), it gets its own spec, not an amendment to this one.
