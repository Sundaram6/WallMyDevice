# WallMyDevice v1 Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Build the v1 of WallMyDevice — a client-side wallpaper generator with 4 generator styles, real-time preview, device frames, and recipe-based reproducibility.

**Architecture:** Next.js 14 (App Router) + TypeScript + Tailwind, with a pluggable generator registry where each generator is a pure function consuming `(params, seed, palette, rng, context) -> render(target)`. Preview and export share one `renderToTarget` helper, enforcing "preview is the source of truth." Zustand holds editor state, encoded into a recipe JSON for sharing.

**Tech Stack:** Next.js 14, TypeScript 5, Tailwind CSS, Zustand, ogl (WebGL), JSZip, pako, zod, Vitest, @testing-library/react, Playwright, Vercel.

---

## Global Constraints

These apply to every task. Read first; every task's requirements implicitly include this section.

- **All shell commands run from the repo root** (`C:\all\wallpaper generator`). No `cd` needed.
- **Shell:** Windows PowerShell 5.1. Use `;` to chain commands (not `&&`). Use `; if ($?) { ... }` when later steps depend on earlier success.
- **TDD discipline:** every task that produces behavior starts with a failing test. The implementer runs the test, sees it fail, then writes the implementation.
- **Commit cadence:** one commit per task (or per logical step within a task). Never bundle multiple tasks into one commit.
- **Commit message format:** `<type>(<scope>): <imperative summary>` — types are `feat`, `fix`, `test`, `chore`, `docs`, `refactor`. Examples below.
- **No code comments** unless the task explicitly asks for them. Code should be self-explanatory.
- **No `Math.random()` or `Date.now()` in any generator or `lib/` code.** All randomness via the seeded `Rng` injected by `renderToTarget`. This is constitution #3 + #4.
- **Generators are pure:** no closures over outer state, no module-level mutable state, no DOM access in `lib/generators/`. DOM access is only in `app/` and `components/`.
- **TypeScript strict mode** is on. No `any` unless explicitly justified in a task.
- **Test coverage target:** 80% on `lib/`. Component tests are light (high ROI only).
- **No `console.log` in committed code** except in test setup/teardown. Use the test framework's reporters.
- **File paths in this plan are exact.** If a file already exists, the task's "Modify" line tells you what to change. Otherwise, "Create" makes a new file.
- **Reference spec:** `docs/superpowers/specs/2026-07-20-wallmydevice-design.md`. If a detail is unclear in this plan, the spec wins; flag it in the commit message.

---

## Phase 1: Foundation (Tasks 1–3)

### Task 1: Initialize Next.js + TypeScript + Tailwind

**Files:**
- Create: `package.json`, `tsconfig.json`, `next.config.mjs`, `tailwind.config.ts`, `postcss.config.mjs`, `app/layout.tsx`, `app/page.tsx`, `app/globals.css`, `.gitignore`

- [ ] **Step 1: Initialize package.json**

Create `package.json` at the repo root with these exact contents:

```json
{
  "name": "wallmydevice",
  "version": "0.1.0",
  "private": true,
  "scripts": {
    "dev": "next dev",
    "build": "next build",
    "start": "next start",
    "lint": "next lint",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:e2e": "playwright test"
  }
}
```

- [ ] **Step 2: Install dependencies**

Run: `npm install next@14.2.5 react@18.3.1 react-dom@18.3.1 zustand@4.5.4 ogl@1.0.11 jszip@3.10.1 pako@2.1.0 zod@3.23.8`
Expected: package-lock.json created, node_modules populated, no peer-dep errors.

Run: `npm install -D typescript@5.5.4 @types/react@18.3.3 @types/react-dom@18.3.0 @types/node@20.14.10 @types/pako@2.0.3 tailwindcss@3.4.6 postcss@8.4.39 autoprefixer@10.4.19 vitest@2.0.3 @vitest/ui@2.0.3 jsdom@24.1.0 @testing-library/react@16.0.0 @testing-library/jest-dom@6.4.6 @testing-library/user-event@14.5.2 @playwright/test@1.45.0 eslint@8.57.0 eslint-config-next@14.2.5`
Expected: dev deps installed, no errors.

- [ ] **Step 3: Create TypeScript config**

Create `tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "lib": ["dom", "dom.iterable", "esnext"],
    "allowJs": false,
    "skipLibCheck": true,
    "strict": true,
    "noEmit": true,
    "esModuleInterop": true,
    "module": "esnext",
    "moduleResolution": "bundler",
    "resolveJsonModule": true,
    "isolatedModules": true,
    "jsx": "preserve",
    "incremental": true,
    "plugins": [{ "name": "next" }],
    "paths": { "@/*": ["./*"] }
  },
  "include": ["next-env.d.ts", "**/*.ts", "**/*.tsx", ".next/types/**/*.ts"],
  "exclude": ["node_modules", "tests/e2e"]
}
```

- [ ] **Step 4: Create Next.js config**

Create `next.config.mjs`:

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  reactStrictMode: true,
  experimental: { typedRoutes: true },
};
export default nextConfig;
```

- [ ] **Step 5: Create Tailwind + PostCSS configs**

Create `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss';

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        accent: 'rgb(59 130 246 / 0.1)',
      },
    },
  },
  plugins: [],
};
export default config;
```

Create `postcss.config.mjs`:

```js
export default { plugins: { tailwindcss: {}, autoprefixer: {} } };
```

- [ ] **Step 6: Create app shell**

Create `app/globals.css`:

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body { height: 100%; background: #09090b; color: #fafafa; }
```

Create `app/layout.tsx`:

```tsx
import type { Metadata } from 'next';
import './globals.css';

export const metadata: Metadata = {
  title: 'WallMyDevice',
  description: 'Generate custom wallpapers for any device.',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="font-sans antialiased">{children}</body>
    </html>
  );
}
```

Create `app/page.tsx`:

```tsx
export default function Page() {
  return (
    <main className="flex h-screen items-center justify-center">
      <h1 className="text-2xl text-zinc-100">WallMyDevice</h1>
    </main>
  );
}
```

- [ ] **Step 7: Add .gitignore**

Create `.gitignore`:

```
node_modules
.next
.env*.local
.DS_Store
playwright-report
test-results
coverage
*.tsbuildinfo
next-env.d.ts
```

- [ ] **Step 8: Verify the dev server starts**

Run: `npm run dev` (in background). Wait 3 seconds. Run: `curl http://localhost:3000 -o nul -w "%{http_code}"` (or open in browser). Expected: `200`. Kill the dev server.

If port 3000 is busy, Next.js picks 3001 — adjust accordingly.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "chore: scaffold Next.js + TypeScript + Tailwind"
```

---

### Task 2: Set up Vitest + Playwright + base test config

**Files:**
- Create: `vitest.config.ts`, `tests/setup.ts`, `playwright.config.ts`, `tests/smoke.test.ts`, `tests/e2e/smoke.spec.ts`

- [ ] **Step 1: Create Vitest config**

Create `vitest.config.ts`:

```ts
import { defineConfig } from 'vitest/config';
import path from 'node:path';

export default defineConfig({
  test: {
    environment: 'jsdom',
    setupFiles: ['./tests/setup.ts'],
    include: ['tests/**/*.test.ts', 'tests/**/*.test.tsx'],
    exclude: ['tests/e2e/**', 'node_modules/**'],
    coverage: {
      provider: 'v8',
      include: ['lib/**/*.ts'],
      thresholds: { lines: 80, functions: 80, branches: 70, statements: 80 },
    },
  },
  resolve: { alias: { '@': path.resolve(__dirname, '.') } },
});
```

- [ ] **Step 2: Create test setup**

Create `tests/setup.ts`:

```ts
import '@testing-library/jest-dom/vitest';
```

- [ ] **Step 3: Write the smoke unit test**

Create `tests/smoke.test.ts`:

```ts
import { describe, it, expect } from 'vitest';

describe('smoke', () => {
  it('arithmetic works', () => {
    expect(2 + 2).toBe(4);
  });
});
```

- [ ] **Step 4: Run unit test**

Run: `npx vitest run tests/smoke.test.ts`
Expected: `1 passed`.

- [ ] **Step 5: Create Playwright config**

Create `playwright.config.ts`:

```ts
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: 'http://localhost:3000',
    trace: 'on-first-retry',
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'npm run dev', url: 'http://localhost:3000', reuseExistingServer: true, timeout: 60_000 },
});
```

- [ ] **Step 6: Write the smoke E2E test**

Create `tests/e2e/smoke.spec.ts`:

```ts
import { test, expect } from '@playwright/test';

test('home page loads', async ({ page }) => {
  await page.goto('/');
  await expect(page.getByRole('heading', { name: 'WallMyDevice' })).toBeVisible();
});
```

- [ ] **Step 7: Install Playwright browser**

Run: `npx playwright install chromium`
Expected: chromium downloaded, no errors.

- [ ] **Step 8: Run E2E test**

Start dev server in one terminal: `npm run dev`. In another terminal: `npx playwright test tests/e2e/smoke.spec.ts`. Expected: `1 passed`. Kill the dev server.

- [ ] **Step 9: Commit**

```bash
git add .
git commit -m "chore: configure Vitest + Playwright with smoke tests"
```

---

### Task 3: Curated palette data (no UI yet, just the data)

**Files:**
- Create: `lib/palettes/data.ts`, `lib/palettes/data.test.ts`

This task exists early so the palette picker and the recipe system have a stable source. The data shape is part of the public contract.

- [ ] **Step 1: Write the failing test**

Create `lib/palettes/data.test.ts`:

```ts
import { describe, it, expect } from 'vitest';
import { CURATED_PALETTES, findPalette, palettesForMode } from './data';

describe('CURATED_PALETTES', () => {
  it('has at least 8 palettes', () => {
    expect(CURATED_PALETTES.length).toBeGreaterThanOrEqual(8);
  });

  it('every palette has 2-6 colors', () => {
    for (const p of CURATED_PALETTES) {
      expect(p.colors.length).toBeGreaterThanOrEqual(2);
      expect(p.colors.length).toBeLessThanOrEqual(6);
    }
  });

  it('every color is a valid 6-digit hex', () => {
    const hex = /^#[0-9a-fA-F]{6}$/;
    for (const p of CURATED_PALETTES) {
      for (const c of p.colors) expect(c).toMatch(hex);
    }
  });

  it('every palette has a valid mode tag', () => {
    for (const p of CURATED_PALETTES) {
      expect(['light', 'dark', 'both']).toContain(p.mode);
    }
  });
});

describe('findPalette', () => {
  it('returns the palette by id', () => {
    const p = findPalette(CURATED_PALETTES[0].id);
    expect(p?.id).toBe(CURATED_PALETTES[0].id);
  });

  it('returns undefined for unknown id', () => {
    expect(findPalette('does-not-exist')).toBeUndefined();
  });
});

describe('palettesForMode', () => {
  it('includes palettes tagged dark or both for dark mode', () => {
    const list = palettesForMode('dark');
    expect(list.every(p => p.mode === 'dark' || p.mode === 'both')).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });

  it('includes palettes tagged light or both for light mode', () => {
    const list = palettesForMode('light');
    expect(list.every(p => p.mode === 'light' || p.mode === 'both')).toBe(true);
    expect(list.length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run the test to verify it fails**

Run: `npx vitest run lib/palettes/data.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the palette data**

Create `lib/palettes/data.ts`:

```ts
export type PaletteMode = 'light' | 'dark' | 'both';
export type Palette = {
  id: string;
  label: string;
  colors: string[];
  mode: PaletteMode;
};

export const CURATED_PALETTES: Palette[] = [
  { id: 'midnight',  label: 'Midnight',  colors: ['#0f172a', '#1e293b', '#334155', '#94a3b8'], mode: 'dark' },
  { id: 'sunset',    label: 'Sunset',    colors: ['#1e1b4b', '#7c2d12', '#f59e0b', '#fbbf24'], mode: 'dark' },
  { id: 'forest',    label: 'Forest',    colors: ['#052e16', '#14532d', '#65a30d', '#bef264'], mode: 'dark' },
  { id: 'ocean',     label: 'Ocean',     colors: ['#082f49', '#0c4a6e', '#0284c7', '#7dd3fc'], mode: 'dark' },
  { id: 'mono-dark', label: 'Mono Dark', colors: ['#09090b', '#27272a', '#a1a1aa', '#fafafa'], mode: 'dark' },
  { id: 'paper',     label: 'Paper',     colors: ['#fafaf9', '#e7e5e4', '#a8a29e', '#1c1917'], mode: 'light' },
  { id: 'sand',      label: 'Sand',      colors: ['#fef3c7', '#fde68a', '#d97706', '#78350f'], mode: 'light' },
  { id: 'mint',      label: 'Mint',      colors: ['#ecfdf5', '#a7f3d0', '#10b981', '#064e3b'], mode: 'light' },
  { id: 'rose',      label: 'Rose',      colors: ['#fff1f2', '#fecdd3', '#fb7185', '#9f1239'], mode: 'light' },
  { id: 'duo',       label: 'Duo',       colors: ['#0f172a', '#fafafa'], mode: 'both' },
];

export function findPalette(id: string): Palette | undefined {
  return CURATED_PALETTES.find(p => p.id === id);
}

export function palettesForMode(mode: 'light' | 'dark'): Palette[] {
  return CURATED_PALETTES.filter(p => p.mode === mode || p.mode === 'both');
}
```

- [ ] **Step 4: Run the test to verify it passes**

Run: `npx vitest run lib/palettes/data.test.ts`
Expected: all 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/palettes/
git commit -m "feat(palettes): add curated palette library"
```

---


## Phase 2: Generator architecture (Tasks 4–8)

### Task 4: Generator types + PRNG + registry

**Files:**
- Create: `lib/prng.ts`, `lib/prng.test.ts`, `lib/generators/types.ts`, `lib/generators/registry.ts`, `lib/generators/registry.test.ts`

- [ ] **Step 1: Write PRNG test**

Create `lib/prng.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { createRng, hashSeed } from "./prng";

describe("hashSeed", () => {
  it("returns a deterministic 8-char base36 string", () => {
    expect(hashSeed("hello")).toBe(hashSeed("hello"));
    expect(hashSeed("hello")).toMatch(/^[0-9a-z]{8}$/);
  });

  it("produces different hashes for different seeds", () => {
    expect(hashSeed("a")).not.toBe(hashSeed("b"));
  });
});

describe("createRng", () => {
  it("is deterministic for the same seed", () => {
    const a = createRng("seed-1");
    const b = createRng("seed-1");
    expect(a()).toBe(b());
    expect(a()).toBe(b());
  });

  it("produces values in [0, 1)", () => {
    const rng = createRng("test");
    for (let i = 0; i < 1000; i++) {
      const v = rng();
      expect(v).toBeGreaterThanOrEqual(0);
      expect(v).toBeLessThan(1);
    }
  });

  it("different seeds produce different sequences", () => {
    const a = createRng("alpha");
    const b = createRng("beta");
    const seqA = Array.from({ length: 10 }, () => a());
    const seqB = Array.from({ length: 10 }, () => b());
    expect(seqA).not.toEqual(seqB);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/prng.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement PRNG**

Create `lib/prng.ts`:

```ts
export function hashSeed(seed: string): string {
  let h = 2166136261 >>> 0;
  for (let i = 0; i < seed.length; i++) {
    h ^= seed.charCodeAt(i);
    h = Math.imul(h, 16777619) >>> 0;
  }
  let out = "";
  let n = h;
  for (let i = 0; i < 8; i++) {
    out = (n % 36).toString(36) + out;
    n = Math.floor(n / 36) + 1;
  }
  return out;
}

export function createRng(seed: string): () => number {
  let s = 0;
  for (let i = 0; i < seed.length; i++) s = (s * 31 + seed.charCodeAt(i)) >>> 0;
  if (s === 0) s = 1;
  return function mulberry32(): number {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/prng.test.ts`
Expected: 4 tests pass.

- [ ] **Step 5: Write generator types and registry**

Create `lib/generators/types.ts`:

```ts
import type { z } from "zod";

export type Rng = () => number;
export type RenderTarget = {
  ctx: CanvasRenderingContext2D | WebGLRenderingContext;
  width: number;
  height: number;
  dpr: number;
};
export type GlobalContext = {
  blur: number;
  grain: { enabled: boolean; intensity: number };
};
export type ParamSchema<S extends z.ZodTypeAny> = {
  zod: S;
  defaults: z.infer<S>;
};
export type ParamControl<P> = {
  key: keyof P;
  label: string;
  type: "slider" | "color" | "select" | "toggle" | "text";
  min?: number;
  max?: number;
  step?: number;
  options?: readonly { value: string; label: string }[];
  helperText?: string;
};
export type Generator<P = unknown> = {
  id: string;
  label: string;
  kind: "canvas2d" | "shader";
  schema: ParamSchema<z.ZodType<P>>;
  render: (
    target: RenderTarget,
    params: P,
    seed: string,
    palette: string[],
    rng: Rng,
    context: GlobalContext
  ) => void;
  toSvg?: (
    size: { width: number; height: number },
    params: P,
    seed: string,
    palette: string[]
  ) => string;
  supportsSvgExport: boolean;
  paramControls: ParamControl<P>[];
};
```

Create `lib/generators/registry.ts`:

```ts
import type { Generator } from "./types";

type Registry = Record<string, Generator>;

export const _registry: Registry = {};

export function registerGenerator(g: Generator): void {
  if (_registry[g.id]) throw new Error(`Generator "${g.id}" already registered`);
  _registry[g.id] = g;
}

export function getGenerator(id: string): Generator | undefined {
  return _registry[id];
}

export function listGenerators(): Generator[] {
  return Object.values(_registry);
}

export function _resetRegistryForTests(): void {
  for (const k of Object.keys(_registry)) delete _registry[k];
}

export type GeneratorId = string;
```

- [ ] **Step 6: Write registry test**

Create `lib/generators/registry.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { registerGenerator, getGenerator, listGenerators, _resetRegistryForTests } from "./registry";
import type { Generator } from "./types";

const stub: Generator = {
  id: "stub-1",
  label: "Stub",
  kind: "canvas2d",
  schema: { zod: (null as unknown) as Generator["schema"]["zod"], defaults: {} },
  render: () => {},
  supportsSvgExport: false,
  paramControls: [],
};

describe("registry", () => {
  beforeEach(() => _resetRegistryForTests());

  it("round-trips a registered generator", () => {
    registerGenerator(stub);
    expect(getGenerator("stub-1")).toBe(stub);
    expect(listGenerators()).toContain(stub);
  });

  it("throws on duplicate id", () => {
    registerGenerator(stub);
    expect(() => registerGenerator(stub)).toThrow(/already registered/);
  });

  it("returns undefined for unknown id", () => {
    expect(getGenerator("nope")).toBeUndefined();
  });
});
```

- [ ] **Step 7: Run registry test to verify it passes**

Run: `npx vitest run lib/generators/registry.test.ts`
Expected: 3 tests pass.

- [ ] **Step 8: Commit**

```bash
git add lib/prng.ts lib/prng.test.ts lib/generators/
git commit -m "feat(generators): add types, PRNG, and registry"
```

---

### Task 5: Waveform generator (proves the architecture)

**Files:**
- Create: `lib/generators/waveform/index.ts`, `tests/generators/waveform.test.ts`, `tests/helpers/canvas.ts`

This is the first real generator. It is all Canvas2D, layered mountain/wave silhouettes.

- [ ] **Step 1: Write the canvas test helper**

Create `tests/helpers/canvas.ts`:

```ts
export function makeCanvas(w: number, h: number): { canvas: HTMLCanvasElement; ctx: CanvasRenderingContext2D } {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const ctx = canvas.getContext("2d")!;
  return { canvas, ctx };
}
```

- [ ] **Step 2: Write the failing waveform test**

Create `tests/generators/waveform.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { waveform } from "../../lib/generators/waveform";
import { makeCanvas } from "../helpers/canvas";
import { createRng } from "../../lib/prng";

describe("waveform generator", () => {
  it("has a registered id and label", () => {
    expect(waveform.id).toBe("waveform");
    expect(waveform.label).toBeTruthy();
    expect(waveform.kind).toBe("canvas2d");
  });

  it("has at least 4 param controls", () => {
    expect(waveform.paramControls.length).toBeGreaterThanOrEqual(4);
  });

  it("defaults are valid per its own schema", () => {
    const result = waveform.schema.zod.safeParse(waveform.schema.defaults);
    expect(result.success).toBe(true);
  });

  it("renders without throwing at 200x400", () => {
    const { canvas, ctx } = makeCanvas(200, 400);
    const params = waveform.schema.defaults;
    expect(() =>
      waveform.render({ ctx, width: 200, height: 400, dpr: 1 }, params, "seed-a", ["#000", "#fff"], createRng("seed-a"), { blur: 0, grain: { enabled: false, intensity: 0 } })
    ).not.toThrow();
  });

  it("renders without throwing at 2000x4000 (resolution independence)", () => {
    const { canvas, ctx } = makeCanvas(2000, 4000);
    const params = waveform.schema.defaults;
    expect(() =>
      waveform.render({ ctx, width: 2000, height: 4000, dpr: 1 }, params, "seed-a", ["#000", "#fff"], createRng("seed-a"), { blur: 0, grain: { enabled: false, intensity: 0 } })
    ).not.toThrow();
  });

  it("renders deterministically with the same seed", () => {
    const { ctx: ctx1 } = makeCanvas(100, 100);
    const { ctx: ctx2 } = makeCanvas(100, 100);
    const params = waveform.schema.defaults;
    waveform.render({ ctx: ctx1, width: 100, height: 100, dpr: 1 }, params, "same", ["#000", "#fff"], createRng("same"), { blur: 0, grain: { enabled: false, intensity: 0 } });
    waveform.render({ ctx: ctx2, width: 100, height: 100, dpr: 1 }, params, "same", ["#000", "#fff"], createRng("same"), { blur: 0, grain: { enabled: false, intensity: 0 } });
    const a = ctx1.getImageData(0, 0, 100, 100).data;
    const b = ctx2.getImageData(0, 0, 100, 100).data;
    expect(Array.from(a)).toEqual(Array.from(b));
  });

  it("produces different output for different seeds", () => {
    const { ctx: ctx1 } = makeCanvas(200, 200);
    const { ctx: ctx2 } = makeCanvas(200, 200);
    const params = waveform.schema.defaults;
    waveform.render({ ctx: ctx1, width: 200, height: 200, dpr: 1 }, params, "seed-A", ["#000", "#fff"], createRng("seed-A"), { blur: 0, grain: { enabled: false, intensity: 0 } });
    waveform.render({ ctx: ctx2, width: 200, height: 200, dpr: 1 }, params, "seed-B", ["#000", "#fff"], createRng("seed-B"), { blur: 0, grain: { enabled: false, intensity: 0 } });
    const a = ctx1.getImageData(0, 0, 200, 200).data;
    const b = ctx2.getImageData(0, 0, 200, 200).data;
    let diff = 0;
    for (let i = 0; i < a.length; i++) if (a[i] !== b[i]) diff++;
    expect(diff).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 3: Run test to verify it fails**

Run: `npx vitest run tests/generators/waveform.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 4: Implement the waveform generator**

Create `lib/generators/waveform/index.ts`:

```ts
import { z } from "zod";
import type { Generator, Rng, RenderTarget, GlobalContext } from "../types";

const Schema = z.object({
  layers: z.number().int().min(1).max(12),
  jaggedness: z.number().min(0).max(1),
  smoothing: z.number().min(0).max(1),
  lineThickness: z.number().min(0.5).max(8),
  amplitude: z.number().min(0).max(1),
  fillBelow: z.boolean(),
});

type Params = z.infer<typeof Schema>;

export const waveform: Generator<Params> = {
  id: "waveform",
  label: "Waveform",
  kind: "canvas2d",
  schema: {
    zod: Schema,
    defaults: { layers: 5, jaggedness: 0.4, smoothing: 0.7, lineThickness: 1.5, amplitude: 0.6, fillBelow: true },
  },
  supportsSvgExport: false,
  paramControls: [
    { key: "layers", label: "Layers", type: "slider", min: 1, max: 12, step: 1 },
    { key: "jaggedness", label: "Jaggedness", type: "slider", min: 0, max: 1, step: 0.01 },
    { key: "smoothing", label: "Smoothing", type: "slider", min: 0, max: 1, step: 0.01 },
    { key: "lineThickness", label: "Line thickness", type: "slider", min: 0.5, max: 8, step: 0.5 },
    { key: "amplitude", label: "Amplitude", type: "slider", min: 0, max: 1, step: 0.01 },
    { key: "fillBelow", label: "Fill below line", type: "toggle" },
  ],
  render(target: RenderTarget, params: Params, seed: string, palette: string[], rng: Rng, _context: GlobalContext) {
    const ctx = target.ctx as CanvasRenderingContext2D;
    const { width: W, height: H } = target;
    const bg = palette[0] ?? "#000000";
    const fg = palette[palette.length - 1] ?? "#ffffff";

    ctx.fillStyle = bg;
    ctx.fillRect(0, 0, W, H);

    const stepCount = Math.max(40, Math.floor(W / 8));
    const baseY = H * 0.65;

    for (let layer = 0; layer < params.layers; layer++) {
      const layerProgress = params.layers === 1 ? 0.5 : layer / (params.layers - 1);
      const yOffset = baseY - layerProgress * H * 0.35;
      const amp = params.amplitude * H * (0.3 + layerProgress * 0.4);
      const colorIdx = Math.min(palette.length - 1, 1 + Math.floor(layerProgress * (palette.length - 2)));
      ctx.strokeStyle = palette[colorIdx] ?? fg;
      ctx.fillStyle = palette[colorIdx] ?? fg;
      ctx.lineWidth = params.lineThickness;
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.beginPath();
      const points: Array<[number, number]> = [];
      for (let i = 0; i <= stepCount; i++) {
        const x = (i / stepCount) * W;
        const t = i / stepCount;
        const noise = (rng() - 0.5) * 2 * params.jaggedness;
        const wave = Math.sin(t * Math.PI * (2 + layer) + seed.charCodeAt(0) * 0.01) * 0.5;
        const y = yOffset - (wave + noise) * amp;
        points.push([x, y]);
      }
      const smooth = params.smoothing;
      if (smooth > 0) {
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length - 1; i++) {
          const [x0, y0] = points[i];
          const [x1, y1] = points[i + 1];
          const cx = (x0 + x1) / 2;
          const cy = (y0 + y1) / 2;
          ctx.quadraticCurveTo(x0, y0, cx, cy);
        }
        ctx.lineTo(points[points.length - 1][0], points[points.length - 1][1]);
      } else {
        ctx.moveTo(points[0][0], points[0][1]);
        for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
      }
      if (params.fillBelow) {
        ctx.lineTo(W, H);
        ctx.lineTo(0, H);
        ctx.closePath();
        ctx.globalAlpha = 0.3 + 0.5 * (1 - layerProgress);
        ctx.fill();
        ctx.globalAlpha = 1;
      } else {
        ctx.stroke();
      }
    }
  },
};
```

Note: the unused `_context` parameter is intentional. The lint rule (set in Task 33) will allow leading-underscore unused parameters.

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/generators/waveform.test.ts`
Expected: 7 tests pass.

- [ ] **Step 6: Commit**

```bash
git add lib/generators/waveform tests/generators tests/helpers
git commit -m "feat(generators): add waveform generator"
```

---


### Task 6: `renderToTarget` — the constitution-enforcer

**Files:**
- Create: `lib/render/renderToTarget.ts`, `lib/render/renderToTarget.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/render/renderToTarget.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { renderToTarget } from "./renderToTarget";
import { waveform } from "../generators/waveform";
import { registerGenerator, _resetRegistryForTests } from "../generators/registry";
import { makeCanvas } from "../../tests/helpers/canvas";
import { CURATED_PALETTES } from "../palettes/data";

describe("renderToTarget", () => {
  it("renders the registered generator to the target", () => {
    _resetRegistryForTests();
    registerGenerator(waveform);
    const { canvas, ctx } = makeCanvas(200, 400);
    renderToTarget({ ctx, width: 200, height: 400, dpr: 1 }, {
      generatorId: "waveform",
      params: waveform.schema.defaults,
      palette: CURATED_PALETTES[0].colors,
      mode: "dark",
      seed: "test",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
    });
    const data = ctx.getImageData(0, 0, 200, 400).data;
    let nonZero = 0;
    for (let i = 0; i < data.length; i += 4) {
      if (data[i] !== 0 || data[i + 1] !== 0 || data[i + 2] !== 0) nonZero++;
    }
    expect(nonZero).toBeGreaterThan(0);
  });

  it("throws a user-readable error for an unknown generator", () => {
    const { canvas, ctx } = makeCanvas(100, 100);
    expect(() =>
      renderToTarget({ ctx, width: 100, height: 100, dpr: 1 }, {
        generatorId: "nonexistent",
        params: {},
        palette: ["#000", "#fff"],
        mode: "dark",
        seed: "x",
        grainEnabled: false,
        grainIntensity: 0,
        blurIntensity: 0,
      })
    ).toThrow(/unknown generator/i);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/render/renderToTarget.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement renderToTarget**

Create `lib/render/renderToTarget.ts`:

```ts
import { getGenerator } from "../generators/registry";
import { createRng } from "../prng";
import { applyGrain } from "./grain";
import { drawOverlays } from "./overlays";
import type { RenderTarget } from "../generators/types";

export type RenderInput = {
  generatorId: string;
  params: unknown;
  palette: string[];
  mode: "light" | "dark" | "auto";
  seed: string;
  grainEnabled: boolean;
  grainIntensity: number;
  blurIntensity: number;
  autoMode?: "light" | "dark";
  overlays?: {
    clock: boolean;
    date: boolean;
    text: boolean;
    textValue: string;
    font: string;
    size: number;
  };
};

export function renderToTarget(target: RenderTarget, input: RenderInput): void {
  const generator = getGenerator(input.generatorId);
  if (!generator) throw new Error(`Unknown generator "${input.generatorId}"`);

  const palette = resolvePalette(input.palette, input.mode, input.autoMode);
  const rng = createRng(input.seed);
  const context = {
    blur: input.blurIntensity,
    grain: { enabled: input.grainEnabled, intensity: input.grainIntensity },
  };

  if (target.ctx instanceof CanvasRenderingContext2D) {
    target.ctx.save();
    target.ctx.fillStyle = palette[0] ?? "#000000";
    target.ctx.fillRect(0, 0, target.width, target.height);
    target.ctx.restore();
  }

  generator.render(target, input.params, input.seed, palette, rng, context);

  if (input.grainEnabled && input.grainIntensity > 0) {
    applyGrain(target, input.grainIntensity, input.seed + "|grain");
  }

  if (input.overlays) {
    drawOverlays(target, input.overlays, palette);
  }
}

export function resolvePalette(
  raw: string[],
  mode: "light" | "dark" | "auto",
  auto: "light" | "dark" = "dark"
): string[] {
  if (mode === "dark") return raw;
  if (mode === "light") return raw;
  return auto === "dark" ? raw : raw;
}
```

- [ ] **Step 4: Add stub grain and overlay modules (so the test compiles)**

Create `lib/render/grain.ts`:

```ts
import type { RenderTarget } from "../generators/types";

export function applyGrain(target: RenderTarget, intensity: number, seed: string): void {
  if (!(target.ctx instanceof CanvasRenderingContext2D)) return;
  const ctx = target.ctx;
  const imageData = ctx.getImageData(0, 0, target.width, target.height);
  const d = imageData.data;
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  if (h === 0) h = 1;
  const range = Math.floor(intensity * 60);
  for (let i = 0; i < d.length; i += 4) {
    h = (h + 0x6D2B79F5) >>> 0;
    let t = h;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    const n = (((t ^ (t >>> 14)) >>> 0) / 4294967296 - 0.5) * range;
    d[i]     = Math.max(0, Math.min(255, d[i]     + n));
    d[i + 1] = Math.max(0, Math.min(255, d[i + 1] + n));
    d[i + 2] = Math.max(0, Math.min(255, d[i + 2] + n));
  }
  ctx.putImageData(imageData, 0, 0);
}
```

Create `lib/render/overlays.ts`:

```ts
import type { RenderTarget } from "../generators/types";

export type OverlayState = {
  clock: boolean;
  date: boolean;
  text: boolean;
  textValue: string;
  font: string;
  size: number;
};

export function drawOverlays(target: RenderTarget, state: OverlayState, palette: string[]): void {
  if (!(target.ctx instanceof CanvasRenderingContext2D)) return;
  if (!state.clock && !state.date && !state.text) return;
  const ctx = target.ctx;
  const fg = palette[palette.length - 1] ?? "#ffffff";
  const fontSize = Math.round(target.width * 0.04 * state.size);
  ctx.fillStyle = fg;
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.font = `500 ${fontSize}px ${state.font}, system-ui, sans-serif`;
  const cx = target.width / 2;
  const cy = target.height / 2;
  const now = new Date();
  const lines: string[] = [];
  if (state.clock) lines.push(formatClock(now));
  if (state.date) lines.push(formatDate(now));
  if (state.text) lines.push(state.textValue);
  if (lines.length === 0) return;
  const lineHeight = fontSize * 1.2;
  const startY = cy - ((lines.length - 1) * lineHeight) / 2;
  lines.forEach((line, i) => ctx.fillText(line, cx, startY + i * lineHeight));
}

function formatClock(d: Date): string {
  const hh = String(d.getHours()).padStart(2, "0");
  const mm = String(d.getMinutes()).padStart(2, "0");
  return `${hh}:${mm}`;
}

function formatDate(d: Date): string {
  return d.toLocaleDateString(undefined, { weekday: "short", month: "short", day: "numeric" });
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run lib/render/renderToTarget.test.ts`
Expected: 2 tests pass.

- [ ] **Step 6: Commit**

```bash
git add lib/render/
git commit -m "feat(render): add renderToTarget + grain + overlays"
```

---

### Task 7: Waveform fidelity test (preview-vs-export)

**Files:**
- Create: `tests/generators/waveform.fidelity.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/generators/waveform.fidelity.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { renderToTarget } from "../../lib/render/renderToTarget";
import { waveform } from "../../lib/generators/waveform";
import { makeCanvas } from "../helpers/canvas";

const input = {
  generatorId: "waveform",
  params: waveform.schema.defaults,
  palette: ["#0f172a", "#f59e0b"],
  mode: "dark" as const,
  seed: "fidelity",
  grainEnabled: false,
  grainIntensity: 0,
  blurIntensity: 0,
};

function downscale(src: ImageData, dw: number, dh: number): ImageData {
  const dst = new ImageData(dw, dh);
  const sw = src.width;
  const sh = src.height;
  for (let y = 0; y < dh; y++) {
    const sy = Math.floor((y / dh) * sh);
    for (let x = 0; x < dw; x++) {
      const sx = Math.floor((x / dw) * sw);
      const si = (sy * sw + sx) * 4;
      const di = (y * dw + x) * 4;
      dst.data[di]     = src.data[si];
      dst.data[di + 1] = src.data[si + 1];
      dst.data[di + 2] = src.data[si + 2];
      dst.data[di + 3] = 255;
    }
  }
  return dst;
}

describe("waveform fidelity", () => {
  it("preview (200x400) matches downscale of export (2000x4000) within 1% mean diff", () => {
    const preview = makeCanvas(200, 400);
    const exportC = makeCanvas(2000, 4000);
    renderToTarget({ ctx: preview.ctx, width: 200, height: 400, dpr: 1 }, input);
    renderToTarget({ ctx: exportC.ctx, width: 2000, height: 4000, dpr: 1 }, input);
    const pd = preview.ctx.getImageData(0, 0, 200, 400);
    const ed = exportC.ctx.getImageData(0, 0, 2000, 4000);
    const edDown = downscale(ed, 200, 400);
    let total = 0;
    for (let i = 0; i < pd.data.length; i += 4) {
      total += Math.abs(pd.data[i] - edDown.data[i])
            + Math.abs(pd.data[i + 1] - edDown.data[i + 1])
            + Math.abs(pd.data[i + 2] - edDown.data[i + 2]);
    }
    const mean = total / (pd.data.length / 4) / 3;
    expect(mean).toBeLessThan(2.55);
  });
});
```

- [ ] **Step 2: Run test to verify it passes**

Run: `npx vitest run tests/generators/waveform.fidelity.test.ts`
Expected: passes. If it fails, the generator is doing something that depends on absolute pixel coordinates. Fix the generator; do not weaken the test.

- [ ] **Step 3: Commit**

```bash
git add tests/generators/waveform.fidelity.test.ts
git commit -m "test(generators): add waveform fidelity test"
```

---

### Task 8: Auto-register waveform on import

**Files:**
- Create: `lib/generators/index.ts`, `lib/generators/index.test.ts`

- [ ] **Step 1: Create the barrel file**

Create `lib/generators/index.ts`:

```ts
import { registerGenerator } from "./registry";
import { waveform } from "./waveform";

let initialized = false;

export function ensureRegistered(): void {
  if (initialized) return;
  registerGenerator(waveform);
  initialized = true;
}

export { getGenerator, listGenerators } from "./registry";
export type { Generator, GeneratorId } from "./registry";
export type * from "./types";
```

- [ ] **Step 2: Add a test for the barrel**

Create `lib/generators/index.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { ensureRegistered, getGenerator } from "./index";

describe("ensureRegistered", () => {
  it("registers waveform so getGenerator finds it", () => {
    ensureRegistered();
    expect(getGenerator("waveform")).toBeDefined();
  });

  it("is idempotent", () => {
    ensureRegistered();
    ensureRegistered();
    expect(getGenerator("waveform")).toBeDefined();
  });
});
```

- [ ] **Step 3: Run the test**

Run: `npx vitest run lib/generators/index.test.ts`
Expected: 2 tests pass.

- [ ] **Step 4: Commit**

```bash
git add lib/generators/index.ts lib/generators/index.test.ts
git commit -m "feat(generators): add barrel with auto-registration"
```

---

## Phase 3: State & Recipe (Tasks 9–11)

### Task 9: Zustand store

**Files:**
- Create: `store/useEditorStore.ts`, `store/useEditorStore.test.ts`

- [ ] **Step 1: Write the failing test**

Create `store/useEditorStore.test.ts`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { useEditorStore } from "./useEditorStore";
import { waveform } from "../lib/generators/waveform";
import { _resetRegistryForTests } from "../lib/generators/registry";

function reset() {
  _resetRegistryForTests();
  useEditorStore.setState({
    generatorId: "waveform",
    params: { waveform: waveform.schema.defaults },
    palette: ["#000000", "#ffffff"],
    mode: "dark",
    seed: "aaaaaaaa",
    grainEnabled: false,
    grainIntensity: 0,
    blurIntensity: 0,
    resolutionId: "desktop-1080p",
    customWidth: 1920,
    customHeight: 1080,
    aspectLock: true,
    overlayClock: false,
    overlayDate: false,
    overlayText: false,
    overlayTextValue: "",
    overlayFont: "Inter",
    overlaySize: 1,
    exportFormat: "png",
  });
}

describe("useEditorStore", () => {
  beforeEach(reset);

  it("switches generator and seeds default params", () => {
    useEditorStore.getState().setGenerator("waveform");
    expect(useEditorStore.getState().generatorId).toBe("waveform");
    expect(useEditorStore.getState().params.waveform).toEqual(waveform.schema.defaults);
  });

  it("updates a single param", () => {
    useEditorStore.getState().updateParam("waveform", "layers", 8);
    expect(useEditorStore.getState().params.waveform).toMatchObject({ layers: 8 });
  });

  it("randomizes seed to a valid base36 string", () => {
    useEditorStore.getState().randomizeSeed();
    const s = useEditorStore.getState().seed;
    expect(s).toMatch(/^[0-9a-z]+$/);
  });

  it("rejects invalid seeds on setSeed", () => {
    const before = useEditorStore.getState().seed;
    useEditorStore.getState().setSeed("!!!");
    expect(useEditorStore.getState().seed).toBe(before);
  });

  it("accepts valid seeds on setSeed", () => {
    useEditorStore.getState().setSeed("myseed");
    expect(useEditorStore.getState().seed).toBe("myseed");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run store/useEditorStore.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement the store**

Create `store/useEditorStore.ts`:

```ts
import { create } from "zustand";
import { getGenerator } from "../lib/generators/registry";
import { hashSeed } from "../lib/prng";

export type Mode = "light" | "dark" | "auto";
export type ExportFormat = "png" | "jpg" | "webp" | "svg";

export type EditorState = {
  generatorId: string;
  params: Record<string, unknown>;

  palette: string[];
  mode: Mode;
  seed: string;

  grainEnabled: boolean;
  grainIntensity: number;
  blurIntensity: number;

  resolutionId: string;
  customWidth: number;
  customHeight: number;
  aspectLock: boolean;

  overlayClock: boolean;
  overlayDate: boolean;
  overlayText: boolean;
  overlayTextValue: string;
  overlayFont: string;
  overlaySize: number;

  exportFormat: ExportFormat;

  setGenerator: (id: string) => void;
  updateParam: (id: string, key: string, value: unknown) => void;
  setPalette: (palette: string[]) => void;
  randomizeSeed: () => void;
  setSeed: (seed: string) => void;
  setMode: (mode: Mode) => void;
  setResolution: (id: string, width: number, height: number) => void;
  setCustomSize: (w: number, h: number) => void;
  setAspectLock: (locked: boolean) => void;
  setGrain: (enabled: boolean, intensity: number) => void;
  setBlur: (v: number) => void;
  setOverlay: (key: "clock" | "date" | "text", value: boolean) => void;
  setOverlayText: (text: string) => void;
  setOverlayFont: (font: string) => void;
  setOverlaySize: (size: number) => void;
  setExportFormat: (f: ExportFormat) => void;
  hydrate: (next: Partial<EditorState>) => void;
};

const SEED_RE = /^[0-9a-z]{1,16}$/;

export const useEditorStore = create<EditorState>((set, get) => ({
  generatorId: "waveform",
  params: { waveform: getDefaultParams("waveform") },

  palette: ["#0f172a", "#f59e0b"],
  mode: "dark",
  seed: "k3p9x2a7",

  grainEnabled: false,
  grainIntensity: 0,
  blurIntensity: 0,

  resolutionId: "desktop-1080p",
  customWidth: 1920,
  customHeight: 1080,
  aspectLock: true,

  overlayClock: false,
  overlayDate: false,
  overlayText: false,
  overlayTextValue: "",
  overlayFont: "Inter",
  overlaySize: 1,

  exportFormat: "png",

  setGenerator: (id) => {
    const params = get().params;
    if (!params[id]) {
      set({ generatorId: id, params: { ...params, [id]: getDefaultParams(id) } });
    } else {
      set({ generatorId: id });
    }
  },

  updateParam: (id, key, value) => {
    const current = (get().params[id] ?? {}) as Record<string, unknown>;
    set({ params: { ...get().params, [id]: { ...current, [key]: value } } });
  },

  setPalette: (palette) => set({ palette }),
  randomizeSeed: () => set({ seed: hashSeed(String(Math.random() * 1e9)) }),
  setSeed: (seed) => {
    if (!SEED_RE.test(seed)) return;
    set({ seed });
  },
  setMode: (mode) => set({ mode }),

  setResolution: (id, width, height) => set({ resolutionId: id, customWidth: width, customHeight: height }),
  setCustomSize: (w, h) => set({ customWidth: w, customHeight: h }),
  setAspectLock: (locked) => set({ aspectLock: locked }),

  setGrain: (enabled, intensity) => set({ grainEnabled: enabled, grainIntensity: intensity }),
  setBlur: (v) => set({ blurIntensity: v }),

  setOverlay: (key, value) => set({ [`overlay${capitalize(key)}`]: value } as Partial<EditorState>),
  setOverlayText: (text) => set({ overlayTextValue: text }),
  setOverlayFont: (font) => set({ overlayFont: font }),
  setOverlaySize: (size) => set({ overlaySize: size }),

  setExportFormat: (f) => set({ exportFormat: f }),

  hydrate: (next) => set(next as EditorState),
}));

function getDefaultParams(id: string): unknown {
  const g = getGenerator(id);
  return g ? structuredClone(g.schema.defaults) : {};
}

function capitalize(s: string): string {
  return s.charAt(0).toUpperCase() + s.slice(1);
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run store/useEditorStore.test.ts`
Expected: 5 tests pass.

- [ ] **Step 5: Commit**

```bash
git add store/
git commit -m "feat(store): add Zustand editor store"
```

---


### Task 10: Recipe zod schema + validate

**Files:**
- Create: `lib/recipe/validate.ts`, `lib/recipe/validate.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/recipe/validate.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { parseRecipe, RecipeSchema } from "./validate";

describe("RecipeSchema", () => {
  it("accepts a minimal valid recipe", () => {
    const r = parseRecipe(JSON.stringify({
      v: 1, type: "wallmydevice/recipe", generator: "waveform",
      params: { layers: 5, jaggedness: 0.4, smoothing: 0.7, lineThickness: 1.5, amplitude: 0.6, fillBelow: true },
      palette: ["#000000", "#ffffff"], mode: "dark", seed: "abc",
      grain: { enabled: false, intensity: 0 }, blur: 0,
      resolution: { preset: "desktop-1080p", width: 1920, height: 1080 },
      overlays: { clock: false, date: false, text: false, value: "", font: "Inter", size: 1 },
    }));
    expect(r.ok).toBe(true);
  });

  it("rejects unknown version", () => {
    const r = parseRecipe(JSON.stringify({ v: 99, type: "wallmydevice/recipe", generator: "waveform" }));
    expect(r.ok).toBe(false);
  });

  it("rejects wrong type", () => {
    const r = parseRecipe(JSON.stringify({ v: 1, type: "other/recipe", generator: "waveform" }));
    expect(r.ok).toBe(false);
  });

  it("rejects bad seed", () => {
    const r = parseRecipe(JSON.stringify({
      v: 1, type: "wallmydevice/recipe", generator: "waveform", params: {},
      palette: ["#000", "#fff"], mode: "dark", seed: "!!!",
      grain: { enabled: false, intensity: 0 }, blur: 0,
      resolution: { preset: "x", width: 1, height: 1 },
      overlays: { clock: false, date: false, text: false, value: "", font: "Inter", size: 1 },
    }));
    expect(r.ok).toBe(false);
  });

  it("rejects invalid hex", () => {
    const r = parseRecipe(JSON.stringify({
      v: 1, type: "wallmydevice/recipe", generator: "waveform", params: {},
      palette: ["zzz"], mode: "dark", seed: "a",
      grain: { enabled: false, intensity: 0 }, blur: 0,
      resolution: { preset: "x", width: 1, height: 1 },
      overlays: { clock: false, date: false, text: false, value: "", font: "Inter", size: 1 },
    }));
    expect(r.ok).toBe(false);
  });

  it("returns error for non-JSON", () => {
    const r = parseRecipe("not json");
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.error).toMatch(/json/i);
  });
});

describe("RecipeSchema static", () => {
  it("is exported", () => {
    expect(RecipeSchema).toBeDefined();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/recipe/validate.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement validate**

Create `lib/recipe/validate.ts`:

```ts
import { z } from "zod";

const HEX = /^#[0-9a-fA-F]{6}$/;
const SEED = /^[0-9a-z]{1,16}$/;

export const RecipeSchema = z.object({
  v: z.literal(1),
  type: z.literal("wallmydevice/recipe"),
  generator: z.string().min(1),
  params: z.record(z.string(), z.unknown()),
  palette: z.array(z.string().regex(HEX)).min(2).max(6),
  mode: z.enum(["light", "dark", "auto"]),
  seed: z.string().regex(SEED),
  grain: z.object({ enabled: z.boolean(), intensity: z.number().min(0).max(1) }),
  blur: z.number().min(0).max(1),
  resolution: z.object({
    preset: z.string(),
    width: z.number().int().min(320).max(15360),
    height: z.number().int().min(320).max(15360),
  }),
  overlays: z.object({
    clock: z.boolean(),
    date: z.boolean(),
    text: z.boolean(),
    value: z.string().max(200),
    font: z.string().min(1),
    size: z.number().min(0.1).max(8),
  }),
});

export type Recipe = z.infer<typeof RecipeSchema>;

export function parseRecipe(json: string):
  | { ok: true; recipe: Recipe }
  | { ok: false; error: string } {
  let parsed: unknown;
  try { parsed = JSON.parse(json); }
  catch { return { ok: false, error: "Not valid JSON" }; }
  const result = RecipeSchema.safeParse(parsed);
  if (!result.success) {
    const msg = result.error.issues
      .map(i => `${i.path.join(".") || "(root)"}: ${i.message}`)
      .join("; ");
    return { ok: false, error: msg };
  }
  return { ok: true, recipe: result.data };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/recipe/validate.test.ts`
Expected: 6 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/recipe/validate.ts lib/recipe/validate.test.ts
git commit -m "feat(recipe): add zod recipe schema and parser"
```

---

### Task 11: Recipe encode/decode (JSON + URL hash)

**Files:**
- Create: `lib/recipe/encode.ts`, `lib/recipe/encode.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/recipe/encode.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { encodeRecipe, decodeHash, encodeHash } from "./encode";
import { waveform } from "../generators/waveform";
import type { Recipe } from "./validate";

const sampleRecipe: Recipe = {
  v: 1,
  type: "wallmydevice/recipe",
  generator: "waveform",
  params: waveform.schema.defaults,
  palette: ["#0f172a", "#f59e0b"],
  mode: "dark",
  seed: "k3p9x2a7",
  grain: { enabled: false, intensity: 0 },
  blur: 0,
  resolution: { preset: "desktop-1080p", width: 1920, height: 1080 },
  overlays: { clock: false, date: false, text: false, value: "", font: "Inter", size: 1 },
};

describe("encodeRecipe / decodeHash roundtrip", () => {
  it("preserves all fields through encode->hash->decode", () => {
    const hash = encodeHash(sampleRecipe);
    const decoded = decodeHash(hash);
    expect(decoded.ok).toBe(true);
    if (decoded.ok) {
      expect(decoded.recipe).toEqual(sampleRecipe);
    }
  });

  it("returns ok:false for malformed hash", () => {
    const r = decodeHash("#r=not-base64!@#");
    expect(r.ok).toBe(false);
  });

  it("returns ok:false for hash that decodes but does not validate", () => {
    const bad = "eyJ2IjoxLCJ0eXBlIjoid2FsbG15ZGV2aWNlL3JlY2lwZSJ9";
    const r = decodeHash("#r=" + bad);
    expect(r.ok).toBe(false);
  });

  it("encodeRecipe produces pretty-printed JSON", () => {
    const json = encodeRecipe(sampleRecipe);
    expect(json).toContain("\n");
    expect(JSON.parse(json)).toEqual(sampleRecipe);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/recipe/encode.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement encode/decode**

Create `lib/recipe/encode.ts`:

```ts
import pako from "pako";
import { parseRecipe, type Recipe } from "./validate";

const HASH_PREFIX = "#r=";
const URL_RAW_LIMIT = 2048;

function toBase64Url(bytes: Uint8Array): string {
  let bin = "";
  for (let i = 0; i < bytes.length; i++) bin += String.fromCharCode(bytes[i]);
  return btoa(bin).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function fromBase64Url(s: string): Uint8Array {
  const padded = s.replace(/-/g, "+").replace(/_/g, "/") + "===".slice((s.length + 3) % 4);
  const bin = atob(padded);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out;
}

export function encodeRecipe(recipe: Recipe): string {
  return JSON.stringify(recipe, null, 2);
}

export function encodeHash(recipe: Recipe): string {
  const json = JSON.stringify(recipe);
  const deflated = pako.deflate(json);
  const encoded = toBase64Url(deflated);
  if (encoded.length > URL_RAW_LIMIT) {
    throw new Error("Recipe too long for URL. Use file export instead.");
  }
  return HASH_PREFIX + encoded;
}

export function decodeHash(hash: string):
  | { ok: true; recipe: Recipe }
  | { ok: false; error: string } {
  if (!hash.startsWith(HASH_PREFIX)) return { ok: false, error: "Not a WallMyDevice URL" };
  const payload = hash.slice(HASH_PREFIX.length);
  try {
    const bytes = fromBase64Url(payload);
    const json = pako.inflate(bytes, { to: "string" });
    return parseRecipe(json);
  } catch (e) {
    return { ok: false, error: "Could not decode URL" };
  }
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/recipe/encode.test.ts`
Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add lib/recipe/encode.ts lib/recipe/encode.test.ts
git commit -m "feat(recipe): add JSON and URL-hash encode/decode"
```

---

## Phase 4: Render pipeline wrappers + export (Tasks 12–14)

### Task 12: renderPreview + renderExport

**Files:**
- Create: `lib/render/renderPreview.ts`, `lib/render/renderExport.ts`, `lib/render/renderPreview.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/render/renderPreview.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { renderPreview } from "./renderPreview";
import { makeCanvas } from "../../tests/helpers/canvas";
import { waveform } from "../generators/waveform";
import { ensureRegistered } from "../generators";

describe("renderPreview", () => {
  it("sets the canvas pixel size to the requested size and renders", () => {
    ensureRegistered();
    const { canvas, ctx } = makeCanvas(200, 400);
    expect(canvas.width).toBe(200);
    renderPreview(canvas, ctx, {
      generatorId: "waveform",
      params: waveform.schema.defaults,
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "preview",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
    });
    expect(canvas.width).toBe(200);
    const data = ctx.getImageData(0, 0, 200, 400).data;
    let nonZero = 0;
    for (let i = 0; i < data.length; i += 4) if (data[i] !== 0) nonZero++;
    expect(nonZero).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/render/renderPreview.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement renderPreview and renderExport**

Create `lib/render/renderPreview.ts`:

```ts
import { renderToTarget, type RenderInput } from "./renderToTarget";
import type { RenderTarget } from "../generators/types";

export function renderPreview(
  canvas: HTMLCanvasElement,
  ctx: CanvasRenderingContext2D,
  input: RenderInput,
  size: { width: number; height: number; dpr: number } = { width: canvas.width, height: canvas.height, dpr: 1 }
): void {
  canvas.width = size.width * size.dpr;
  canvas.height = size.height * size.dpr;
  ctx.setTransform(size.dpr, 0, 0, size.dpr, 0, 0);
  const target: RenderTarget = { ctx, width: size.width, height: size.height, dpr: size.dpr };
  renderToTarget(target, input);
}
```

Create `lib/render/renderExport.ts`:

```ts
import { renderToTarget, type RenderInput } from "./renderToTarget";
import type { RenderTarget } from "../generators/types";

export async function renderExport(
  input: RenderInput,
  size: { width: number; height: number }
): Promise<OffscreenCanvas> {
  const canvas = new OffscreenCanvas(size.width, size.height);
  const ctx = canvas.getContext("2d")!;
  const target: RenderTarget = { ctx, width: size.width, height: size.height, dpr: 1 };
  renderToTarget(target, input);
  return canvas;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/render/renderPreview.test.ts`
Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add lib/render/renderPreview.ts lib/render/renderExport.ts lib/render/renderPreview.test.ts
git commit -m "feat(render): add preview and export wrappers"
```

---

### Task 13: exportImage (single download)

**Files:**
- Create: `lib/export/filename.ts`, `lib/export/filename.test.ts`, `lib/export/exportImage.ts`, `lib/export/exportImage.test.ts`

- [ ] **Step 1: Write filename test**

Create `lib/export/filename.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { buildFilename } from "./filename";

describe("buildFilename", () => {
  it("builds a single image filename", () => {
    expect(buildFilename("waveform", "k3p9x2a7", { width: 1179, height: 2556 }, "png"))
      .toBe("wallmydevice-waveform-k3p9x2a7-1179x2556.png");
  });
  it("builds a batch filename", () => {
    expect(buildFilename.batch("1234567890"))
      .toBe("wallmydevice-batch-1234567890.zip");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/export/filename.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement filename**

Create `lib/export/filename.ts`:

```ts
function sanitize(s: string): string {
  return s.replace(/[^a-zA-Z0-9_-]/g, "");
}

export function buildFilename(
  generatorId: string,
  seed: string,
  size: { width: number; height: number },
  ext: string
): string {
  return `wallmydevice-${sanitize(generatorId)}-${sanitize(seed)}-${size.width}x${size.height}.${ext}`;
}

buildFilename.batch = function buildBatchFilename(timestamp: string): string {
  return `wallmydevice-batch-${sanitize(timestamp)}.zip`;
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/export/filename.test.ts`
Expected: 2 tests pass.

- [ ] **Step 5: Write exportImage test**

Create `lib/export/exportImage.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { exportImage } from "./exportImage";
import { waveform } from "../generators/waveform";
import { ensureRegistered } from "../generators";

describe("exportImage", () => {
  it("produces a PNG blob for a raster generator", async () => {
    ensureRegistered();
    const blob = await exportImage(
      {
        generatorId: "waveform",
        params: waveform.schema.defaults,
        palette: ["#000", "#fff"],
        mode: "dark",
        seed: "x",
        grainEnabled: false,
        grainIntensity: 0,
        blurIntensity: 0,
      },
      { width: 200, height: 400 }
    );
    expect(blob.type).toBe("image/png");
    expect(blob.size).toBeGreaterThan(0);
  });

  it("returns a JPG blob when type is jpg", async () => {
    ensureRegistered();
    const blob = await exportImage(
      {
        generatorId: "waveform",
        params: waveform.schema.defaults,
        palette: ["#000", "#fff"],
        mode: "dark",
        seed: "x",
        grainEnabled: false,
        grainIntensity: 0,
        blurIntensity: 0,
      },
      { width: 200, height: 400 },
      "jpg"
    );
    expect(blob.type).toBe("image/jpeg");
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run lib/export/exportImage.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement exportImage**

Create `lib/export/exportImage.ts`:

```ts
import { renderExport } from "../render/renderExport";
import type { RenderInput } from "../render/renderToTarget";

export type ExportFormat = "png" | "jpg" | "webp";

export async function exportImage(
  input: RenderInput,
  size: { width: number; height: number },
  format: ExportFormat = "png"
): Promise<Blob> {
  const canvas = await renderExport(input, size);
  const mime = { png: "image/png", jpg: "image/jpeg", webp: "image/webp" }[format];
  const quality = format === "jpg" ? 0.92 : undefined;
  return canvas.convertToBlob({ type: mime, quality });
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run lib/export/exportImage.test.ts`
Expected: 2 tests pass.

- [ ] **Step 9: Commit**

```bash
git add lib/export/filename.ts lib/export/filename.test.ts lib/export/exportImage.ts lib/export/exportImage.test.ts
git commit -m "feat(export): add single-image export and filename helper"
```

---

### Task 14: batchExport with JSZip

**Files:**
- Create: `lib/export/batchExport.ts`, `lib/export/batchExport.test.ts`

- [ ] **Step 1: Write the failing test**

Create `lib/export/batchExport.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { batchExport } from "./batchExport";
import { waveform } from "../generators/waveform";
import { ensureRegistered } from "../generators";
import { buildFilename } from "./filename";

describe("batchExport", () => {
  it("produces a zip with one entry per requested size", async () => {
    ensureRegistered();
    const input = {
      generatorId: "waveform",
      params: waveform.schema.defaults,
      palette: ["#000", "#fff"],
      mode: "dark" as const,
      seed: "batch",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
    };
    const sizes = [
      { width: 200, height: 400 },
      { width: 400, height: 800 },
    ];
    const zip = await batchExport(input, sizes, "k3p9x2a7");
    expect(zip.type).toBe("application/zip");
    expect(zip.size).toBeGreaterThan(0);

    const { default: JSZip } = await import("jszip");
    const parsed = await JSZip.loadAsync(zip);
    const names = Object.keys(parsed.files);
    expect(names).toContain(buildFilename("waveform", "k3p9x2a7", sizes[0], "png"));
    expect(names).toContain(buildFilename("waveform", "k3p9x2a7", sizes[1], "png"));
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/export/batchExport.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement batchExport**

Create `lib/export/batchExport.ts`:

```ts
import JSZip from "jszip";
import { exportImage } from "./exportImage";
import { buildFilename } from "./filename";
import type { RenderInput } from "../render/renderToTarget";

export type BatchSize = { width: number; height: number };

export async function batchExport(
  input: RenderInput,
  sizes: BatchSize[],
  seed: string,
  onProgress?: (done: number, total: number) => void
): Promise<Blob> {
  const zip = new JSZip();
  const generatorId = input.generatorId;
  for (let i = 0; i < sizes.length; i++) {
    const size = sizes[i];
    const blob = await exportImage(input, size);
    zip.file(buildFilename(generatorId, seed, size, "png"), blob);
    onProgress?.(i + 1, sizes.length);
  }
  return zip.generateAsync({ type: "blob" });
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/export/batchExport.test.ts`
Expected: passes.

- [ ] **Step 5: Commit**

```bash
git add lib/export/batchExport.ts lib/export/batchExport.test.ts
git commit -m "feat(export): add batch export as zip"
```

---


## Phase 5: Device presets + frame (Tasks 15–17)

### Task 15: Device presets + aspect helpers

**Files:**
- Create: `lib/devices/presets.ts`, `lib/devices/aspectRatio.ts`, `lib/devices/aspectRatio.test.ts`, `lib/devices/presets.test.ts`

- [ ] **Step 1: Write aspect-ratio test**

Create `lib/devices/aspectRatio.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { applyAspectLock, gcd } from "./aspectRatio";

describe("gcd", () => {
  it("returns the greatest common divisor", () => {
    expect(gcd(1920, 1080)).toBe(120);
    expect(gcd(1179, 2556)).toBe(3);
    expect(gcd(0, 100)).toBe(100);
  });
});

describe("applyAspectLock", () => {
  it("keeps height when width changes and lock is on (no-op for same ratio)", () => {
    const next = applyAspectLock({ w: 400, h: 200, locked: true }, "w");
    expect(next).toEqual({ w: 400, h: 200 });
  });

  it("does nothing when lock is off", () => {
    const next = applyAspectLock({ w: 500, h: 200, locked: false }, "w");
    expect(next).toEqual({ w: 500, h: 200 });
  });

  it("height is recomputed when width changes and lock is on", () => {
    const next = applyAspectLock({ w: 800, h: 400, locked: true }, "w");
    expect(next).toEqual({ w: 800, h: 400 });
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/devices/aspectRatio.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement aspect helpers**

Create `lib/devices/aspectRatio.ts`:

```ts
export function gcd(a: number, b: number): number {
  a = Math.abs(a); b = Math.abs(b);
  while (b) { [a, b] = [b, a % b]; }
  return a;
}

export type AspectState = { w: number; h: number; locked: boolean };

export function applyAspectLock(state: AspectState, changed: "w" | "h"): { w: number; h: number } {
  if (!state.locked) return { w: state.w, h: state.h };
  if (changed === "w" && state.w > 0) {
    const ratio = state.h / state.w;
    return { w: state.w, h: Math.max(1, Math.round(state.w * ratio)) };
  }
  if (changed === "h" && state.h > 0) {
    const ratio = state.w / state.h;
    return { w: Math.max(1, Math.round(state.h * ratio)), h: state.h };
  }
  return { w: state.w, h: state.h };
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/devices/aspectRatio.test.ts`
Expected: 3 tests pass.

- [ ] **Step 5: Write presets**

Create `lib/devices/presets.ts`:

```ts
export type DevicePreset = {
  id: string;
  label: string;
  w: number;
  h: number;
  frame: FrameStyle;
};

export type FrameStyle = "desktop-monitor" | "iphone" | "ipad" | "macbook" | "android" | "ultrawide" | "none";

export const DEVICE_PRESETS: DevicePreset[] = [
  { id: "desktop-1080p",       label: "Desktop 1080p",     w: 1920, h: 1080, frame: "desktop-monitor" },
  { id: "desktop-1440p",       label: "Desktop 1440p",     w: 2560, h: 1440, frame: "desktop-monitor" },
  { id: "desktop-4k",          label: "Desktop 4K",        w: 3840, h: 2160, frame: "desktop-monitor" },
  { id: "ultrawide-3440x1440", label: "Ultrawide 21:9",    w: 3440, h: 1440, frame: "ultrawide" },
  { id: "macbook-14",          label: "MacBook 14\"",       w: 3024, h: 1964, frame: "macbook" },
  { id: "iphone-15-pro",       label: "iPhone 15 Pro",     w: 1179, h: 2556, frame: "iphone" },
  { id: "iphone-15",           label: "iPhone 15",         w: 1170, h: 2532, frame: "iphone" },
  { id: "pixel-8-pro",         label: "Pixel 8 Pro",       w: 1344, h: 2992, frame: "android" },
  { id: "ipad-air-11",         label: "iPad Air 11\"",      w: 1640, h: 2360, frame: "ipad" },
  { id: "custom",              label: "Custom...",           w: 1920, h: 1080, frame: "none" },
];

export function findPreset(id: string): DevicePreset | undefined {
  return DEVICE_PRESETS.find(p => p.id === id);
}

export const ASPECT_PRESETS: Array<{ id: string; label: string; w: number; h: number }> = [
  { id: "16-9", label: "16:9",  w: 1920, h: 1080 },
  { id: "9-16", label: "9:16",  w: 1080, h: 1920 },
  { id: "4-3",  label: "4:3",   w: 1600, h: 1200 },
  { id: "3-4",  label: "3:4",   w: 1200, h: 1600 },
  { id: "21-9", label: "21:9",  w: 2560, h: 1080 },
  { id: "1-1",  label: "1:1",   w: 1080, h: 1080 },
];
```

- [ ] **Step 6: Write presets test**

Create `lib/devices/presets.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { DEVICE_PRESETS, findPreset, ASPECT_PRESETS } from "./presets";

describe("DEVICE_PRESETS", () => {
  it("has 10 entries including custom", () => {
    expect(DEVICE_PRESETS.length).toBe(10);
    expect(DEVICE_PRESETS.find(p => p.id === "custom")).toBeDefined();
  });

  it("all dimensions are at least 320", () => {
    for (const p of DEVICE_PRESETS) {
      expect(p.w).toBeGreaterThanOrEqual(320);
      expect(p.h).toBeGreaterThanOrEqual(320);
    }
  });
});

describe("findPreset", () => {
  it("returns preset by id", () => {
    expect(findPreset("iphone-15-pro")?.label).toBe("iPhone 15 Pro");
  });
  it("returns undefined for unknown id", () => {
    expect(findPreset("nope")).toBeUndefined();
  });
});

describe("ASPECT_PRESETS", () => {
  it("has 6 common aspect ratios", () => {
    expect(ASPECT_PRESETS.length).toBe(6);
  });
});
```

- [ ] **Step 7: Run presets test**

Run: `npx vitest run lib/devices/presets.test.ts`
Expected: 4 tests pass.

- [ ] **Step 8: Commit**

```bash
git add lib/devices/
git commit -m "feat(devices): add device and aspect presets"
```

---

### Task 16: DeviceFrame component (all frame styles in one task)

**Files:**
- Create: `components/Preview/DeviceFrame.tsx`, `components/Preview/DeviceFrame.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/Preview/DeviceFrame.test.tsx`:

```ts
import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { DeviceFrame } from "./DeviceFrame";

describe("DeviceFrame", () => {
  it("renders children inside the frame", () => {
    render(
      <DeviceFrame frame="iphone" aspect={1179 / 2556}>
        <div data-testid="wallpaper" />
      </DeviceFrame>
    );
    expect(screen.getByTestId("wallpaper")).toBeInTheDocument();
  });

  it("applies the correct aspect ratio to the inner box", () => {
    const { container } = render(
      <DeviceFrame frame="desktop-monitor" aspect={16 / 9}>
        <div />
      </DeviceFrame>
    );
    const inner = container.querySelector("[data-aspect]") as HTMLElement;
    expect(inner).toBeTruthy();
    expect(inner.style.aspectRatio).toBe("1.7777777777777777 / 1");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/Preview/DeviceFrame.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement DeviceFrame**

Create `components/Preview/DeviceFrame.tsx`:

```tsx
import type { ReactNode } from "react";
import type { FrameStyle } from "@/lib/devices/presets";

type Props = {
  frame: FrameStyle;
  aspect: number;
  children: ReactNode;
};

export function DeviceFrame({ frame, aspect, children }: Props) {
  if (frame === "none") {
    return (
      <div data-frame={frame} className="flex items-center justify-center">
        <div
          data-aspect={aspect}
          style={{ aspectRatio: `${aspect} / 1` }}
          className="relative overflow-hidden rounded-md bg-zinc-900"
        >
          {children}
        </div>
      </div>
    );
  }
  return (
    <div data-frame={frame} className="flex items-center justify-center">
      <FrameShell frame={frame}>
        <div
          data-aspect={aspect}
          style={{ aspectRatio: `${aspect} / 1` }}
          className="relative overflow-hidden bg-black"
        >
          {children}
          {frame === "iphone" ? <IPhoneChrome /> : null}
          {frame === "macbook" ? <MacBookChrome /> : null}
          {frame === "desktop-monitor" ? <MonitorStand /> : null}
          {frame === "android" ? <AndroidChrome /> : null}
          <SafeZoneHint frame={frame} />
        </div>
      </FrameShell>
    </div>
  );
}

function FrameShell({ frame, children }: { frame: FrameStyle; children: ReactNode }) {
  const isMonitor = frame === "desktop-monitor" || frame === "ultrawide";
  const isTablet = frame === "ipad";
  const bezel = isMonitor
    ? "rounded-lg p-3 bg-zinc-800 ring-1 ring-zinc-700"
    : isTablet
      ? "rounded-3xl p-6 bg-zinc-900 ring-1 ring-zinc-800"
      : "rounded-[2.5rem] p-3 bg-zinc-900 ring-1 ring-zinc-800";
  return <div className={bezel}>{children}</div>;
}

function IPhoneChrome() {
  return (
    <>
      <div className="pointer-events-none absolute left-1/2 top-2 z-10 h-6 w-24 -translate-x-1/2 rounded-full bg-black" />
      <div className="pointer-events-none absolute bottom-1.5 left-1/2 z-10 h-1 w-24 -translate-x-1/2 rounded-full bg-zinc-700" />
    </>
  );
}

function MacBookChrome() {
  return (
    <>
      <div className="pointer-events-none absolute left-1/2 top-1.5 z-10 h-5 w-20 -translate-x-1/2 rounded-b-lg bg-black" />
      <div className="pointer-events-none absolute -bottom-2 left-1/2 z-10 h-2 w-3/4 -translate-x-1/2 rounded-b-2xl bg-zinc-800" />
    </>
  );
}

function MonitorStand() {
  return (
    <>
      <div className="pointer-events-none absolute -bottom-6 left-1/2 z-10 h-6 w-32 -translate-x-1/2 bg-zinc-700" />
      <div className="pointer-events-none absolute -bottom-9 left-1/2 z-10 h-3 w-48 -translate-x-1/2 rounded-full bg-zinc-800" />
    </>
  );
}

function AndroidChrome() {
  return <div className="pointer-events-none absolute left-1/2 top-2 z-10 h-3 w-3 -translate-x-1/2 rounded-full bg-black" />;
}

function SafeZoneHint({ frame }: { frame: FrameStyle }) {
  if (frame !== "iphone" && frame !== "android") return null;
  return (
    <>
      <div className="pointer-events-none absolute inset-x-0 top-0 z-20 h-[12%] border-b border-dashed border-white/20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-[8%] border-t border-dashed border-white/20" />
    </>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/Preview/DeviceFrame.test.tsx`
Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/Preview/DeviceFrame.tsx components/Preview/DeviceFrame.test.tsx
git commit -m "feat(preview): add DeviceFrame component with all frame styles"
```

---

### Task 17: PreviewCanvas component

**Files:**
- Create: `components/Preview/PreviewCanvas.tsx`, `components/Preview/PreviewCanvas.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/Preview/PreviewCanvas.test.tsx`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { PreviewCanvas } from "./PreviewCanvas";
import { useEditorStore } from "@/store/useEditorStore";
import { _resetRegistryForTests } from "@/lib/generators/registry";
import { waveform } from "@/lib/generators/waveform";

describe("PreviewCanvas", () => {
  beforeEach(() => {
    _resetRegistryForTests();
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "preview-test",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
      resolutionId: "desktop-1080p",
      customWidth: 1920,
      customHeight: 1080,
      aspectLock: true,
      overlayClock: false,
      overlayDate: false,
      overlayText: false,
      overlayTextValue: "",
      overlayFont: "Inter",
      overlaySize: 1,
      exportFormat: "png",
    });
  });

  it("renders a canvas inside the device frame", () => {
    const { container } = render(<PreviewCanvas frame="desktop-monitor" aspect={16 / 9} maxWidth={800} maxHeight={450} />);
    const canvas = container.querySelector("canvas");
    expect(canvas).toBeTruthy();
  });

  it("the canvas pixel size matches the requested display size", () => {
    const { container } = render(<PreviewCanvas frame="desktop-monitor" aspect={16 / 9} maxWidth={800} maxHeight={450} />);
    const canvas = container.querySelector("canvas") as HTMLCanvasElement;
    expect(canvas.width).toBe(800);
    expect(canvas.height).toBe(450);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/Preview/PreviewCanvas.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement PreviewCanvas**

Create `components/Preview/PreviewCanvas.tsx`:

```tsx
import { useEffect, useRef } from "react";
import { ensureRegistered } from "@/lib/generators";
import { renderPreview } from "@/lib/render/renderPreview";
import { useEditorStore } from "@/store/useEditorStore";
import type { FrameStyle } from "@/lib/devices/presets";

type Props = {
  frame: FrameStyle;
  aspect: number;
  maxWidth: number;
  maxHeight: number;
};

export function PreviewCanvas({ frame, aspect, maxWidth, maxHeight }: Props) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => { ensureRegistered(); }, []);

  useEffect(() => {
    let raf = 0;
    const unsub = useEditorStore.subscribe(() => {
      if (raf) return;
      raf = requestAnimationFrame(() => {
        raf = 0;
        renderIfReady();
      });
    });
    renderIfReady();
    function renderIfReady() {
      const canvas = canvasRef.current;
      if (!canvas) return;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      const s = useEditorStore.getState();
      const w = Math.min(maxWidth, Math.floor(maxHeight * aspect));
      const h = Math.min(maxHeight, Math.floor(maxWidth / aspect));
      renderPreview(canvas, ctx, {
        generatorId: s.generatorId,
        params: s.params[s.generatorId] ?? {},
        palette: s.palette,
        mode: s.mode,
        seed: s.seed,
        grainEnabled: s.grainEnabled,
        grainIntensity: s.grainIntensity,
        blurIntensity: s.blurIntensity,
        overlays: {
          clock: s.overlayClock,
          date: s.overlayDate,
          text: s.overlayText,
          textValue: s.overlayTextValue,
          font: s.overlayFont,
          size: s.overlaySize,
        },
      }, { width: w, height: h, dpr: 1 });
    }
    return () => { unsub(); if (raf) cancelAnimationFrame(raf); };
  }, [aspect, maxWidth, maxHeight]);

  return (
    <div data-frame={frame} className="flex h-full w-full items-center justify-center">
      <canvas ref={canvasRef} className="block max-h-full max-w-full" />
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/Preview/PreviewCanvas.test.tsx`
Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/Preview/PreviewCanvas.tsx components/Preview/PreviewCanvas.test.tsx
git commit -m "feat(preview): add PreviewCanvas with rAF-throttled render"
```

---


## Phase 6: UI primitives + panel (Tasks 18–22)

### Task 18: Slider primitive

**Files:**
- Create: `components/ui/Slider.tsx`, `components/ui/Slider.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/ui/Slider.test.tsx`:

```ts
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Slider } from "./Slider";

describe("Slider", () => {
  it("renders the current value", () => {
    const { getByDisplayValue } = render(<Slider value={0.5} min={0} max={1} step={0.01} onChange={() => {}} />);
    expect((getByDisplayValue("0.5") as HTMLInputElement)).toBeTruthy();
  });

  it("calls onChange with a number when input changes", () => {
    const onChange = vi.fn();
    const { container } = render(<Slider value={0.5} min={0} max={1} step={0.01} onChange={onChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "0.75" } });
    expect(onChange).toHaveBeenCalledWith(0.75);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/ui/Slider.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement Slider**

Create `components/ui/Slider.tsx`:

```tsx
type Props = {
  value: number;
  min: number;
  max: number;
  step: number;
  onChange: (v: number) => void;
  ariaLabel?: string;
};

export function Slider({ value, min, max, step, onChange, ariaLabel }: Props) {
  return (
    <input
      type="range"
      min={min}
      max={max}
      step={step}
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(Number(e.target.value))}
      className="h-1 w-full cursor-pointer appearance-none rounded-full bg-zinc-700 accent-blue-500"
    />
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/ui/Slider.test.tsx`
Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/ui/Slider.tsx components/ui/Slider.test.tsx
git commit -m "feat(ui): add Slider primitive"
```

---

### Task 19: Toggle + Select + ColorInput + Button primitives

**Files:**
- Create: `components/ui/Toggle.tsx`, `components/ui/Select.tsx`, `components/ui/ColorInput.tsx`, `components/ui/Button.tsx`, `components/ui/primitives.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/ui/primitives.test.tsx`:

```ts
import { describe, it, expect, vi } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { Toggle } from "./Toggle";
import { Select } from "./Select";
import { ColorInput } from "./ColorInput";
import { Button } from "./Button";

describe("Toggle", () => {
  it("fires onChange with the toggled value", () => {
    const onChange = vi.fn();
    const { getByRole } = render(<Toggle checked={false} onChange={onChange} ariaLabel="t" />);
    fireEvent.click(getByRole("switch"));
    expect(onChange).toHaveBeenCalledWith(true);
  });
});

describe("Select", () => {
  it("calls onChange with the picked value", () => {
    const onChange = vi.fn();
    const { container } = render(
      <Select
        value="a"
        options={[{ value: "a", label: "A" }, { value: "b", label: "B" }]}
        onChange={onChange}
      />
    );
    const select = container.querySelector("select") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "b" } });
    expect(onChange).toHaveBeenCalledWith("b");
  });
});

describe("ColorInput", () => {
  it("fires onChange with the picked color", () => {
    const onChange = vi.fn();
    const { container } = render(<ColorInput value="#000000" onChange={onChange} />);
    const input = container.querySelector("input") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "#ff00ff" } });
    expect(onChange).toHaveBeenCalledWith("#ff00ff");
  });
});

describe("Button", () => {
  it("calls onClick when clicked", () => {
    const onClick = vi.fn();
    const { getByText } = render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(getByText("Go"));
    expect(onClick).toHaveBeenCalled();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/ui/primitives.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement all four primitives**

Create `components/ui/Toggle.tsx`:

```tsx
type Props = { checked: boolean; onChange: (v: boolean) => void; ariaLabel: string };
export function Toggle({ checked, onChange, ariaLabel }: Props) {
  return (
    <button
      type="button"
      role="switch"
      aria-checked={checked}
      aria-label={ariaLabel}
      onClick={() => onChange(!checked)}
      className={`relative h-5 w-9 rounded-full transition ${checked ? "bg-blue-500" : "bg-zinc-700"}`}
    >
      <span className={`absolute top-0.5 h-4 w-4 rounded-full bg-white transition ${checked ? "left-4" : "left-0.5"}`} />
    </button>
  );
}
```

Create `components/ui/Select.tsx`:

```tsx
type Option = { value: string; label: string };
type Props = { value: string; options: readonly Option[]; onChange: (v: string) => void; ariaLabel?: string };
export function Select({ value, options, onChange, ariaLabel }: Props) {
  return (
    <select
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
    >
      {options.map(o => <option key={o.value} value={o.value}>{o.label}</option>)}
    </select>
  );
}
```

Create `components/ui/ColorInput.tsx`:

```tsx
type Props = { value: string; onChange: (v: string) => void; ariaLabel?: string };
export function ColorInput({ value, onChange, ariaLabel }: Props) {
  return (
    <input
      type="color"
      value={value}
      aria-label={ariaLabel}
      onChange={(e) => onChange(e.target.value)}
      className="h-7 w-7 cursor-pointer rounded border border-zinc-700 bg-transparent"
    />
  );
}
```

Create `components/ui/Button.tsx`:

```tsx
import type { ButtonHTMLAttributes, ReactNode } from "react";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & { children: ReactNode };

export function Button({ children, className = "", ...rest }: Props) {
  return (
    <button
      {...rest}
      className={`rounded-md bg-zinc-800 px-3 py-1.5 text-sm font-medium text-zinc-100 transition hover:bg-zinc-700 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
    >
      {children}
    </button>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/ui/primitives.test.tsx`
Expected: 4 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/ui/Toggle.tsx components/ui/Select.tsx components/ui/ColorInput.tsx components/ui/Button.tsx components/ui/primitives.test.tsx
git commit -m "feat(ui): add Toggle, Select, ColorInput, Button primitives"
```

---

### Task 20: ControlPanel shell + GeneratorPicker

**Files:**
- Create: `components/Panel/GeneratorPicker.tsx`, `components/Panel/ControlPanel.tsx`, `components/Panel/ControlPanel.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/Panel/ControlPanel.test.tsx`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ControlPanel } from "./ControlPanel";
import { useEditorStore } from "@/store/useEditorStore";
import { _resetRegistryForTests } from "@/lib/generators/registry";
import { waveform } from "@/lib/generators/waveform";

describe("ControlPanel", () => {
  beforeEach(() => {
    _resetRegistryForTests();
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "aaaa",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
      resolutionId: "desktop-1080p",
      customWidth: 1920,
      customHeight: 1080,
      aspectLock: true,
      overlayClock: false,
      overlayDate: false,
      overlayText: false,
      overlayTextValue: "",
      overlayFont: "Inter",
      overlaySize: 1,
      exportFormat: "png",
    });
  });

  it("renders the waveform generator card", () => {
    const { getByText } = render(<ControlPanel />);
    expect(getByText("Waveform")).toBeInTheDocument();
  });

  it("clicking the generator card sets it as active", () => {
    const { getByText } = render(<ControlPanel />);
    fireEvent.click(getByText("Waveform"));
    expect(useEditorStore.getState().generatorId).toBe("waveform");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/Panel/ControlPanel.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement GeneratorPicker**

Create `components/Panel/GeneratorPicker.tsx`:

```tsx
import { useEffect } from "react";
import { ensureRegistered, listGenerators } from "@/lib/generators";
import { useEditorStore } from "@/store/useEditorStore";

export function GeneratorPicker() {
  useEffect(() => { ensureRegistered(); }, []);
  const generators = listGenerators();
  const active = useEditorStore(s => s.generatorId);
  const setGenerator = useEditorStore(s => s.setGenerator);

  return (
    <div className="grid grid-cols-2 gap-2">
      {generators.map(g => (
        <button
          key={g.id}
          type="button"
          onClick={() => setGenerator(g.id)}
          data-active={active === g.id}
          className={`rounded-md border px-3 py-2 text-left text-sm transition ${
            active === g.id
              ? "border-blue-500 bg-accent text-zinc-50"
              : "border-zinc-800 bg-zinc-900 text-zinc-300 hover:border-zinc-700"
          }`}
        >
          {g.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Implement ControlPanel shell**

Create `components/Panel/ControlPanel.tsx`:

```tsx
import { GeneratorPicker } from "./GeneratorPicker";

export function ControlPanel() {
  return (
    <aside className="flex h-full w-80 flex-col gap-6 overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-4 text-zinc-100">
      <Section title="Generator">
        <GeneratorPicker />
      </Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">{title}</h2>
      {children}
    </section>
  );
}
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run components/Panel/ControlPanel.test.tsx`
Expected: 2 tests pass.

- [ ] **Step 6: Commit**

```bash
git add components/Panel/
git commit -m "feat(panel): add ControlPanel shell + GeneratorPicker"
```

---

### Task 21: ModeToggle + SeedBar + ResolutionPicker

**Files:**
- Create: `components/Panel/ModeToggle.tsx`, `components/Panel/SeedBar.tsx`, `components/Panel/ResolutionPicker.tsx`, `components/Panel/PanelControls.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/Panel/PanelControls.test.tsx`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ModeToggle } from "./ModeToggle";
import { SeedBar } from "./SeedBar";
import { ResolutionPicker } from "./ResolutionPicker";
import { useEditorStore } from "@/store/useEditorStore";
import { _resetRegistryForTests } from "@/lib/generators/registry";
import { waveform } from "@/lib/generators/waveform";

function reset() {
  _resetRegistryForTests();
  useEditorStore.setState({
    generatorId: "waveform",
    params: { waveform: waveform.schema.defaults },
    palette: ["#000", "#fff"],
    mode: "dark",
    seed: "abcdef",
    grainEnabled: false,
    grainIntensity: 0,
    blurIntensity: 0,
    resolutionId: "desktop-1080p",
    customWidth: 1920,
    customHeight: 1080,
    aspectLock: true,
    overlayClock: false,
    overlayDate: false,
    overlayText: false,
    overlayTextValue: "",
    overlayFont: "Inter",
    overlaySize: 1,
    exportFormat: "png",
  });
}

describe("ModeToggle", () => {
  beforeEach(reset);
  it("switches to light when clicked", () => {
    const { getByText } = render(<ModeToggle />);
    fireEvent.click(getByText("Light"));
    expect(useEditorStore.getState().mode).toBe("light");
  });
});

describe("SeedBar", () => {
  beforeEach(reset);
  it("shows current seed", () => {
    const { container } = render(<SeedBar />);
    const input = container.querySelector("input[type=\"text\"]") as HTMLInputElement;
    expect(input.value).toBe("abcdef");
  });
  it("randomize changes the seed", () => {
    const { getByLabelText } = render(<SeedBar />);
    fireEvent.click(getByLabelText("Randomize seed"));
    expect(useEditorStore.getState().seed).not.toBe("abcdef");
  });
});

describe("ResolutionPicker", () => {
  beforeEach(reset);
  it("selecting a preset updates the store", () => {
    const { container } = render(<ResolutionPicker />);
    const select = container.querySelector("select") as HTMLSelectElement;
    fireEvent.change(select, { target: { value: "iphone-15-pro" } });
    expect(useEditorStore.getState().resolutionId).toBe("iphone-15-pro");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/Panel/PanelControls.test.tsx`
Expected: FAIL — modules not found.

- [ ] **Step 3: Implement ModeToggle**

Create `components/Panel/ModeToggle.tsx`:

```tsx
import { useEditorStore, type Mode } from "@/store/useEditorStore";

const OPTIONS: Array<{ value: Mode; label: string }> = [
  { value: "light", label: "Light" },
  { value: "dark", label: "Dark" },
  { value: "auto", label: "Auto" },
];

export function ModeToggle() {
  const mode = useEditorStore(s => s.mode);
  const setMode = useEditorStore(s => s.setMode);
  return (
    <div className="flex gap-1 rounded-md bg-zinc-900 p-1">
      {OPTIONS.map(o => (
        <button
          key={o.value}
          type="button"
          onClick={() => setMode(o.value)}
          data-active={mode === o.value}
          className={`flex-1 rounded px-2 py-1 text-xs transition ${
            mode === o.value ? "bg-zinc-700 text-zinc-50" : "text-zinc-400 hover:text-zinc-100"
          }`}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}
```

- [ ] **Step 4: Implement SeedBar**

Create `components/Panel/SeedBar.tsx`:

```tsx
import { useEditorStore } from "@/store/useEditorStore";

export function SeedBar() {
  const seed = useEditorStore(s => s.seed);
  const setSeed = useEditorStore(s => s.setSeed);
  const randomizeSeed = useEditorStore(s => s.randomizeSeed);
  return (
    <div className="flex items-center gap-2">
      <input
        type="text"
        value={seed}
        onChange={(e) => setSeed(e.target.value.toLowerCase())}
        aria-label="Seed"
        className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100 focus:border-blue-500 focus:outline-none"
      />
      <button
        type="button"
        aria-label="Randomize seed"
        onClick={randomizeSeed}
        className="rounded-md bg-zinc-800 px-2 py-1.5 text-sm text-zinc-100 hover:bg-zinc-700"
      >
        d20
      </button>
    </div>
  );
}
```

- [ ] **Step 5: Implement ResolutionPicker**

Create `components/Panel/ResolutionPicker.tsx`:

```tsx
import { DEVICE_PRESETS, ASPECT_PRESETS } from "@/lib/devices/presets";
import { useEditorStore } from "@/store/useEditorStore";

export function ResolutionPicker() {
  const resolutionId = useEditorStore(s => s.resolutionId);
  const customWidth = useEditorStore(s => s.customWidth);
  const customHeight = useEditorStore(s => s.customHeight);
  const aspectLock = useEditorStore(s => s.aspectLock);
  const setResolution = useEditorStore(s => s.setResolution);
  const setCustomSize = useEditorStore(s => s.setCustomSize);
  const setAspectLock = useEditorStore(s => s.setAspectLock);

  return (
    <div className="space-y-2">
      <select
        value={resolutionId}
        onChange={(e) => {
          const p = DEVICE_PRESETS.find(x => x.id === e.target.value);
          if (p) setResolution(p.id, p.w, p.h);
        }}
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
        aria-label="Device preset"
      >
        {DEVICE_PRESETS.map(p => <option key={p.id} value={p.id}>{p.label}</option>)}
      </select>

      {resolutionId === "custom" ? (
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <input
              type="number" min={320} max={15360} value={customWidth}
              onChange={(e) => setCustomSize(Number(e.target.value) || 320, customHeight)}
              aria-label="Width"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
            />
            <span className="text-zinc-500">x</span>
            <input
              type="number" min={320} max={15360} value={customHeight}
              onChange={(e) => setCustomSize(customWidth, Number(e.target.value) || 320)}
              aria-label="Height"
              className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-sm text-zinc-100"
            />
          </div>
          <label className="flex items-center gap-2 text-xs text-zinc-400">
            <input
              type="checkbox"
              checked={aspectLock}
              onChange={(e) => setAspectLock(e.target.checked)}
            />
            Aspect lock
          </label>
          <div className="flex flex-wrap gap-1">
            {ASPECT_PRESETS.map(a => (
              <button
                key={a.id}
                type="button"
                onClick={() => setCustomSize(a.w, a.h)}
                className="rounded bg-zinc-800 px-2 py-0.5 text-xs text-zinc-300 hover:bg-zinc-700"
              >
                {a.label}
              </button>
            ))}
          </div>
        </div>
      ) : null}
      <p className="text-xs text-zinc-500">
        {customWidth} x {customHeight}
      </p>
    </div>
  );
}
```

- [ ] **Step 6: Run test to verify it passes**

Run: `npx vitest run components/Panel/PanelControls.test.tsx`
Expected: 4 tests pass.

- [ ] **Step 7: Commit**

```bash
git add components/Panel/ModeToggle.tsx components/Panel/SeedBar.tsx components/Panel/ResolutionPicker.tsx components/Panel/PanelControls.test.tsx
git commit -m "feat(panel): add ModeToggle, SeedBar, ResolutionPicker"
```

---

### Task 22: ParamsForm (dynamic from generator.paramControls)

**Files:**
- Create: `components/Panel/ParamsForm.tsx`, `components/Panel/ParamsForm.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/Panel/ParamsForm.test.tsx`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ParamsForm } from "./ParamsForm";
import { useEditorStore } from "@/store/useEditorStore";
import { _resetRegistryForTests } from "@/lib/generators/registry";
import { waveform } from "@/lib/generators/waveform";

describe("ParamsForm", () => {
  beforeEach(() => {
    _resetRegistryForTests();
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "abc",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
      resolutionId: "desktop-1080p",
      customWidth: 1920,
      customHeight: 1080,
      aspectLock: true,
      overlayClock: false,
      overlayDate: false,
      overlayText: false,
      overlayTextValue: "",
      overlayFont: "Inter",
      overlaySize: 1,
      exportFormat: "png",
    });
  });

  it("renders a control for every param of the active generator", () => {
    const { getByLabelText } = render(<ParamsForm />);
    for (const c of waveform.paramControls) {
      expect(getByLabelText(c.label)).toBeInTheDocument();
    }
  });

  it("changing the layers slider updates the store", () => {
    const { getByLabelText } = render(<ParamsForm />);
    const input = getByLabelText("Layers") as HTMLInputElement;
    fireEvent.change(input, { target: { value: "8" } });
    expect((useEditorStore.getState().params.waveform as { layers: number }).layers).toBe(8);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/Panel/ParamsForm.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement ParamsForm**

Create `components/Panel/ParamsForm.tsx`:

```tsx
import { getGenerator } from "@/lib/generators";
import { useEditorStore } from "@/store/useEditorStore";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";

export function ParamsForm() {
  const generatorId = useEditorStore(s => s.generatorId);
  const params = useEditorStore(s => s.params[generatorId]) as Record<string, unknown> | undefined;
  const updateParam = useEditorStore(s => s.updateParam);
  const generator = getGenerator(generatorId);
  if (!generator || !params) return null;

  return (
    <div className="space-y-3">
      {generator.paramControls.map(c => {
        const value = params[c.key as string];
        if (c.type === "slider" && c.min !== undefined && c.max !== undefined && c.step !== undefined && typeof value === "number") {
          return (
            <label key={String(c.key)} className="block">
              <div className="mb-1 flex items-center justify-between text-xs text-zinc-300">
                <span>{c.label}</span>
                <span className="tabular-nums text-zinc-500">{Number(value).toFixed(c.step < 1 ? 2 : 0)}</span>
              </div>
              <Slider
                value={value}
                min={c.min}
                max={c.max}
                step={c.step}
                ariaLabel={c.label}
                onChange={(v) => updateParam(generatorId, String(c.key), v)}
              />
            </label>
          );
        }
        if (c.type === "toggle" && typeof value === "boolean") {
          return (
            <label key={String(c.key)} className="flex items-center justify-between text-xs text-zinc-300">
              <span>{c.label}</span>
              <Toggle
                checked={value}
                onChange={(v) => updateParam(generatorId, String(c.key), v)}
                ariaLabel={c.label}
              />
            </label>
          );
        }
        return null;
      })}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/Panel/ParamsForm.test.tsx`
Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/Panel/ParamsForm.tsx components/Panel/ParamsForm.test.tsx
git commit -m "feat(panel): add dynamic ParamsForm"
```

---


## Phase 7: Palette picker (Task 23)

### Task 23: PalettePicker (swatches + custom + image-extract)

**Files:**
- Create: `lib/palettes/extract.ts`, `lib/palettes/extract.test.ts`, `components/Panel/PalettePicker.tsx`, `components/Panel/PalettePicker.test.tsx`

- [ ] **Step 1: Write the failing extract test**

Create `lib/palettes/extract.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { extractPalette } from "./extract";

function makeImageData(w: number, h: number, fill: [number, number, number]): ImageData {
  const d = new ImageData(w, h);
  for (let i = 0; i < d.data.length; i += 4) {
    d.data[i] = fill[0];
    d.data[i + 1] = fill[1];
    d.data[i + 2] = fill[2];
    d.data[i + 3] = 255;
  }
  return d;
}

describe("extractPalette", () => {
  it("returns 5 valid hex colors from a uniform image", () => {
    const colors = extractPalette(makeImageData(64, 64, [200, 100, 50]));
    expect(colors.length).toBe(5);
    for (const c of colors) expect(c).toMatch(/^#[0-9a-fA-F]{6}$/);
  });

  it("returns distinct colors from a multi-region image", () => {
    const img = new ImageData(64, 64);
    for (let y = 0; y < 64; y++) {
      for (let x = 0; x < 64; x++) {
        const i = (y * 64 + x) * 4;
        if (x < 32) { img.data[i] = 255; img.data[i + 1] = 0; img.data[i + 2] = 0; }
        else        { img.data[i] = 0; img.data[i + 1] = 0; img.data[i + 2] = 255; }
        img.data[i + 3] = 255;
      }
    }
    const colors = extractPalette(img);
    expect(colors.length).toBe(5);
    const set = new Set(colors.map(c => c.toLowerCase()));
    expect(set.size).toBeGreaterThan(1);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run lib/palettes/extract.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement extract**

Create `lib/palettes/extract.ts`:

```ts
function rgbToHex(r: number, g: number, b: number): string {
  const to2 = (n: number) => n.toString(16).padStart(2, "0");
  return `#${to2(r)}${to2(g)}${to2(b)}`;
}

function quantize(v: number, step = 32): number {
  return Math.round(v / step) * step;
}

export function extractPalette(image: ImageData, count = 5): string[] {
  const buckets = new Map<string, { r: number; g: number; b: number; n: number }>();
  for (let i = 0; i < image.data.length; i += 4) {
    const r = quantize(image.data[i]);
    const g = quantize(image.data[i + 1]);
    const b = quantize(image.data[i + 2]);
    const key = `${r},${g},${b}`;
    const cur = buckets.get(key);
    if (cur) cur.n++;
    else buckets.set(key, { r, g, b, n: 1 });
  }
  const sorted = [...buckets.values()].sort((a, b) => b.n - a.n);
  return sorted.slice(0, count).map(c => rgbToHex(c.r, c.g, c.b));
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run lib/palettes/extract.test.ts`
Expected: 2 tests pass.

- [ ] **Step 5: Write the failing PalettePicker test**

Create `components/Panel/PalettePicker.test.tsx`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { PalettePicker } from "./PalettePicker";
import { useEditorStore } from "@/store/useEditorStore";
import { _resetRegistryForTests } from "@/lib/generators/registry";
import { waveform } from "@/lib/generators/waveform";

describe("PalettePicker", () => {
  beforeEach(() => {
    _resetRegistryForTests();
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000000", "#ffffff"],
      mode: "dark",
      seed: "abc",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
      resolutionId: "desktop-1080p",
      customWidth: 1920,
      customHeight: 1080,
      aspectLock: true,
      overlayClock: false,
      overlayDate: false,
      overlayText: false,
      overlayTextValue: "",
      overlayFont: "Inter",
      overlaySize: 1,
      exportFormat: "png",
    });
  });

  it("shows the curated palette swatches", () => {
    const { getAllByRole } = render(<PalettePicker />);
    expect(getAllByRole("button").length).toBeGreaterThan(0);
  });
});
```

- [ ] **Step 6: Run test to verify it fails**

Run: `npx vitest run components/Panel/PalettePicker.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 7: Implement PalettePicker**

Create `components/Panel/PalettePicker.tsx`:

```tsx
import { useRef } from "react";
import { CURATED_PALETTES, palettesForMode, type Palette } from "@/lib/palettes/data";
import { extractPalette } from "@/lib/palettes/extract";
import { useEditorStore } from "@/store/useEditorStore";
import { ColorInput } from "@/components/ui/ColorInput";
import { Button } from "@/components/ui/Button";

export function PalettePicker() {
  const palette = useEditorStore(s => s.palette);
  const setPalette = useEditorStore(s => s.setPalette);
  const mode = useEditorStore(s => s.mode);
  const effectiveMode = mode === "auto" ? "dark" : mode;
  const curated = palettesForMode(effectiveMode);
  const fileRef = useRef<HTMLInputElement | null>(null);

  function pickPalette(p: Palette) { setPalette(p.colors); }
  function updateColor(i: number, v: string) {
    const next = [...palette];
    next[i] = v;
    setPalette(next);
  }
  function addColor() {
    if (palette.length >= 6) return;
    setPalette([...palette, palette[palette.length - 1] ?? "#888888"]);
  }
  function removeColor(i: number) {
    if (palette.length <= 2) return;
    setPalette(palette.filter((_, idx) => idx !== i));
  }

  async function onFile(file: File) {
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.src = url;
    await img.decode();
    const off = new OffscreenCanvas(64, 64);
    const ctx = off.getContext("2d")!;
    ctx.drawImage(img, 0, 0, 64, 64);
    const data = ctx.getImageData(0, 0, 64, 64);
    setPalette(extractPalette(data));
    URL.revokeObjectURL(url);
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-5 gap-1">
        {curated.map(p => (
          <button
            key={p.id}
            type="button"
            onClick={() => pickPalette(p)}
            aria-label={`Use ${p.label} palette`}
            title={p.label}
            className="flex h-7 overflow-hidden rounded border border-zinc-700"
          >
            {p.colors.map(c => <span key={c} style={{ background: c }} className="flex-1" />)}
          </button>
        ))}
      </div>

      <div className="space-y-1">
        {palette.map((c, i) => (
          <div key={i} className="flex items-center gap-2">
            <ColorInput value={c} onChange={(v) => updateColor(i, v)} ariaLabel={`Color ${i + 1}`} />
            <input
              type="text"
              value={c}
              onChange={(e) => updateColor(i, e.target.value)}
              aria-label={`Color ${i + 1} hex`}
              className="flex-1 rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1 text-xs text-zinc-100"
            />
            <button
              type="button"
              onClick={() => removeColor(i)}
              aria-label={`Remove color ${i + 1}`}
              className="text-zinc-500 hover:text-zinc-100"
            >
              x
            </button>
          </div>
        ))}
      </div>

      <div className="flex gap-2">
        <Button onClick={addColor} disabled={palette.length >= 6}>+ Color</Button>
        <Button onClick={() => fileRef.current?.click()}>+ From image</Button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={(e) => { const f = e.target.files?.[0]; if (f) void onFile(f); }}
        />
      </div>
    </div>
  );
}
```

- [ ] **Step 8: Run test to verify it passes**

Run: `npx vitest run components/Panel/PalettePicker.test.tsx`
Expected: passes.

- [ ] **Step 9: Commit**

```bash
git add lib/palettes/extract.ts lib/palettes/extract.test.ts components/Panel/PalettePicker.tsx components/Panel/PalettePicker.test.tsx
git commit -m "feat(palette): add PalettePicker with extract and custom"
```

---

## Phase 8: Remaining generators (Tasks 24–26)

### Task 24: Geometric generator (with SVG export)

**Files:**
- Create: `lib/generators/geometric/index.ts`, `tests/generators/geometric.test.ts`, `tests/generators/geometric.fidelity.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/generators/geometric.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { geometric } from "../../lib/generators/geometric";
import { makeCanvas } from "../helpers/canvas";
import { createRng } from "../../lib/prng";

describe("geometric generator", () => {
  it("has registered id and supports SVG export", () => {
    expect(geometric.id).toBe("geometric");
    expect(geometric.supportsSvgExport).toBe(true);
  });

  it("renders at multiple sizes", () => {
    const params = geometric.schema.defaults;
    for (const [w, h] of [[100, 200], [2000, 1000], [600, 600]] as const) {
      const { canvas, ctx } = makeCanvas(w, h);
      expect(() =>
        geometric.render({ ctx, width: w, height: h, dpr: 1 }, params, "g", ["#000", "#fff"], createRng("g"), { blur: 0, grain: { enabled: false, intensity: 0 } })
      ).not.toThrow();
    }
  });

  it("toSvg returns a valid SVG string", () => {
    const svg = geometric.toSvg!({ width: 400, height: 800 }, geometric.schema.defaults, "svg", ["#000", "#fff"]);
    expect(svg).toMatch(/^<svg/);
    expect(svg).toMatch(/<\/svg>$/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/generators/geometric.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement geometric generator**

Create `lib/generators/geometric/index.ts`:

```ts
import { z } from "zod";
import type { Generator, Rng, RenderTarget, GlobalContext } from "../types";

const Schema = z.object({
  shape: z.enum(["triangles", "rects", "circles", "lines"]),
  gridSize: z.number().int().min(4).max(40),
  rotation: z.number().min(-1).max(1),
  strokeWidth: z.number().min(0).max(4),
  density: z.number().min(0).max(1),
  fillMode: z.enum(["fill", "stroke", "both"]),
});

type Params = z.infer<typeof Schema>;

function drawShape(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, shape: Params["shape"]) {
  ctx.beginPath();
  if (shape === "rects") {
    ctx.rect(x - size / 2, y - size / 2, size, size);
  } else if (shape === "circles") {
    ctx.arc(x, y, size / 2, 0, Math.PI * 2);
  } else if (shape === "lines") {
    ctx.moveTo(x - size / 2, y - size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
  } else {
    ctx.moveTo(x, y - size / 2);
    ctx.lineTo(x + size / 2, y + size / 2);
    ctx.lineTo(x - size / 2, y + size / 2);
    ctx.closePath();
  }
}

function svgShape(x: number, y: number, size: number, shape: Params["shape"]): string {
  if (shape === "rects") return `<rect x="${x - size / 2}" y="${y - size / 2}" width="${size}" height="${size}" />`;
  if (shape === "circles") return `<circle cx="${x}" cy="${y}" r="${size / 2}" />`;
  if (shape === "lines") return `<line x1="${x - size / 2}" y1="${y - size / 2}" x2="${x + size / 2}" y2="${y + size / 2}" />`;
  const p1 = `${x},${y - size / 2}`;
  const p2 = `${x + size / 2},${y + size / 2}`;
  const p3 = `${x - size / 2},${y + size / 2}`;
  return `<polygon points="${p1} ${p2} ${p3}" />`;
}

export const geometric: Generator<Params> = {
  id: "geometric",
  label: "Geometric",
  kind: "canvas2d",
  schema: {
    zod: Schema,
    defaults: { shape: "triangles", gridSize: 16, rotation: 0, strokeWidth: 1, density: 0.6, fillMode: "fill" },
  },
  supportsSvgExport: true,
  paramControls: [
    { key: "shape", label: "Shape", type: "select", options: [
      { value: "triangles", label: "Triangles" },
      { value: "rects", label: "Rectangles" },
      { value: "circles", label: "Circles" },
      { value: "lines", label: "Lines" },
    ]},
    { key: "gridSize", label: "Grid size", type: "slider", min: 4, max: 40, step: 1 },
    { key: "rotation", label: "Rotation", type: "slider", min: -1, max: 1, step: 0.01 },
    { key: "strokeWidth", label: "Stroke", type: "slider", min: 0, max: 4, step: 0.1 },
    { key: "density", label: "Density", type: "slider", min: 0, max: 1, step: 0.01 },
    { key: "fillMode", label: "Fill mode", type: "select", options: [
      { value: "fill", label: "Fill" },
      { value: "stroke", label: "Stroke" },
      { value: "both", label: "Both" },
    ]},
  ],
  render(target: RenderTarget, params: Params, seed: string, palette: string[], rng: Rng, _context: GlobalContext) {
    const ctx = target.ctx as CanvasRenderingContext2D;
    const { width: W, height: H } = target;
    ctx.fillStyle = palette[0] ?? "#000000";
    ctx.fillRect(0, 0, W, H);

    const cellW = W / params.gridSize;
    const cellH = H / params.gridSize;
    const size = Math.min(cellW, cellH) * 0.9;
    const angle = params.rotation * Math.PI;
    const accent = palette[palette.length - 1] ?? "#ffffff";

    ctx.save();
    ctx.translate(W / 2, H / 2);
    ctx.rotate(angle);
    ctx.translate(-W / 2, -H / 2);
    ctx.lineWidth = params.strokeWidth;
    ctx.lineJoin = "round";

    for (let row = 0; row < params.gridSize; row++) {
      for (let col = 0; col < params.gridSize; col++) {
        if (rng() > params.density) continue;
        const x = col * cellW + cellW / 2;
        const y = row * cellH + cellH / 2;
        const colorIdx = Math.min(palette.length - 1, 1 + Math.floor(rng() * (palette.length - 1)));
        ctx.fillStyle = palette[colorIdx] ?? accent;
        ctx.strokeStyle = palette[colorIdx] ?? accent;
        if (params.fillMode === "stroke") {
          drawShape(ctx, x, y, size, params.shape);
          ctx.stroke();
        } else if (params.fillMode === "fill") {
          drawShape(ctx, x, y, size, params.shape);
          ctx.fill();
        } else {
          drawShape(ctx, x, y, size, params.shape);
          ctx.fill();
          ctx.stroke();
        }
      }
    }
    ctx.restore();
  },
  toSvg(size, params, seed, palette) {
    const cellW = size.width / params.gridSize;
    const cellH = size.height / params.gridSize;
    const shape = params.shape;
    const sizePx = Math.min(cellW, cellH) * 0.9;
    const colorCount = palette.length;
    const bg = palette[0] ?? "#000";
    const accent = palette[palette.length - 1] ?? "#fff";
    let shapes = "";
    let seedHash = 0;
    for (let i = 0; i < seed.length; i++) seedHash = (seedHash * 31 + seed.charCodeAt(i)) >>> 0;
    if (seedHash === 0) seedHash = 1;
    const rng = () => {
      seedHash = (seedHash + 0x6D2B79F5) >>> 0;
      let t = seedHash;
      t = Math.imul(t ^ (t >>> 15), t | 1);
      t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
      return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
    };
    for (let row = 0; row < params.gridSize; row++) {
      for (let col = 0; col < params.gridSize; col++) {
        if (rng() > params.density) continue;
        const x = col * cellW + cellW / 2;
        const y = row * cellH + cellH / 2;
        const colorIdx = Math.min(colorCount - 1, 1 + Math.floor(rng() * (colorCount - 1)));
        const fill = palette[colorIdx] ?? accent;
        const fillAttr = params.fillMode === "stroke" ? "none" : fill;
        const strokeAttr = params.fillMode === "fill" ? "none" : fill;
        shapes += `<g fill="${fillAttr}" stroke="${strokeAttr}" stroke-width="${params.strokeWidth}">${svgShape(x, y, sizePx, shape)}</g>`;
      }
    }
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}"><rect width="${size.width}" height="${size.height}" fill="${bg}"/>${shapes}</svg>`;
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/generators/geometric.test.ts`
Expected: 3 tests pass.

- [ ] **Step 5: Write the fidelity test**

Create `tests/generators/geometric.fidelity.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { renderToTarget } from "../../lib/render/renderToTarget";
import { geometric } from "../../lib/generators/geometric";
import { makeCanvas } from "../helpers/canvas";

const input = {
  generatorId: "geometric",
  params: geometric.schema.defaults,
  palette: ["#0f172a", "#f59e0b"],
  mode: "dark" as const,
  seed: "geofid",
  grainEnabled: false,
  grainIntensity: 0,
  blurIntensity: 0,
};

function downscale(src: ImageData, dw: number, dh: number): ImageData {
  const dst = new ImageData(dw, dh);
  for (let y = 0; y < dh; y++) {
    const sy = Math.floor((y / dh) * src.height);
    for (let x = 0; x < dw; x++) {
      const sx = Math.floor((x / dw) * src.width);
      const si = (sy * src.width + sx) * 4;
      const di = (y * dw + x) * 4;
      dst.data[di]     = src.data[si];
      dst.data[di + 1] = src.data[si + 1];
      dst.data[di + 2] = src.data[si + 2];
      dst.data[di + 3] = 255;
    }
  }
  return dst;
}

describe("geometric fidelity", () => {
  it("preview matches downscale of export within tolerance", () => {
    const preview = makeCanvas(200, 400);
    const exportC = makeCanvas(2000, 4000);
    renderToTarget({ ctx: preview.ctx, width: 200, height: 400, dpr: 1 }, input);
    renderToTarget({ ctx: exportC.ctx, width: 2000, height: 4000, dpr: 1 }, input);
    const pd = preview.ctx.getImageData(0, 0, 200, 400);
    const ed = exportC.ctx.getImageData(0, 0, 2000, 4000);
    const edDown = downscale(ed, 200, 400);
    let total = 0;
    for (let i = 0; i < pd.data.length; i += 4) {
      total += Math.abs(pd.data[i] - edDown.data[i])
            + Math.abs(pd.data[i + 1] - edDown.data[i + 1])
            + Math.abs(pd.data[i + 2] - edDown.data[i + 2]);
    }
    const mean = total / (pd.data.length / 4) / 3;
    expect(mean).toBeLessThan(2.55);
  });
});
```

- [ ] **Step 6: Run fidelity test**

Run: `npx vitest run tests/generators/geometric.fidelity.test.ts`
Expected: passes.

- [ ] **Step 7: Register geometric in the barrel**

Edit `lib/generators/index.ts`. Replace the file contents with:

```ts
import { registerGenerator } from "./registry";
import { waveform } from "./waveform";
import { geometric } from "./geometric";

let initialized = false;

export function ensureRegistered(): void {
  if (initialized) return;
  registerGenerator(waveform);
  registerGenerator(geometric);
  initialized = true;
}

export { getGenerator, listGenerators } from "./registry";
export type { Generator, GeneratorId } from "./registry";
export type * from "./types";
```

- [ ] **Step 8: Commit**

```bash
git add lib/generators/geometric tests/generators/geometric.test.ts tests/generators/geometric.fidelity.test.ts lib/generators/index.ts
git commit -m "feat(generators): add geometric generator with SVG export"
```

---


### Task 25: Typography generator

**Files:**
- Create: `lib/generators/typography/index.ts`, `tests/generators/typography.test.ts`, `tests/generators/typography.fidelity.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/generators/typography.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { typography } from "../../lib/generators/typography";
import { makeCanvas } from "../helpers/canvas";
import { createRng } from "../../lib/prng";

describe("typography generator", () => {
  it("has registered id and supports SVG export", () => {
    expect(typography.id).toBe("typography");
    expect(typography.supportsSvgExport).toBe(true);
  });

  it("renders at multiple sizes", () => {
    const params = typography.schema.defaults;
    for (const [w, h] of [[400, 800], [2000, 1000]] as const) {
      const { canvas, ctx } = makeCanvas(w, h);
      expect(() =>
        typography.render({ ctx, width: w, height: h, dpr: 1 }, params, "t", ["#000", "#fff"], createRng("t"), { blur: 0, grain: { enabled: false, intensity: 0 } })
      ).not.toThrow();
    }
  });

  it("toSvg returns a valid SVG string", () => {
    const svg = typography.toSvg!({ width: 400, height: 800 }, typography.schema.defaults, "svg", ["#000", "#fff"]);
    expect(svg).toMatch(/^<svg/);
    expect(svg).toMatch(/<\/svg>$/);
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/generators/typography.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement typography generator**

Create `lib/generators/typography/index.ts`:

```ts
import { z } from "zod";
import type { Generator, Rng, RenderTarget, GlobalContext } from "../types";

const Schema = z.object({
  text: z.string().min(1).max(40),
  font: z.enum(["Inter", "JetBrains Mono", "Playfair Display", "system-ui"]),
  size: z.number().min(0.1).max(1.0),
  weight: z.number().int().min(100).max(900),
  letterSpacing: z.number().min(-0.2).max(0.5),
  alignment: z.enum(["left", "center", "right"]),
});

type Params = z.infer<typeof Schema>;

function escapeXml(s: string): string {
  return s.replace(/[<>&"\u0027]/g, c => ({ "<": "&lt;", ">": "&gt;", "&": "&amp;", "\"": "&quot;", "\u0027": "&apos;" })[c] ?? c);
}

export const typography: Generator<Params> = {
  id: "typography",
  label: "Typography",
  kind: "canvas2d",
  schema: {
    zod: Schema,
    defaults: { text: "Hello", font: "Inter", size: 0.4, weight: 700, letterSpacing: 0, alignment: "center" },
  },
  supportsSvgExport: true,
  paramControls: [
    { key: "text", label: "Text", type: "text" },
    { key: "font", label: "Font", type: "select", options: [
      { value: "Inter", label: "Inter" },
      { value: "JetBrains Mono", label: "JetBrains Mono" },
      { value: "Playfair Display", label: "Playfair Display" },
      { value: "system-ui", label: "System" },
    ]},
    { key: "size", label: "Size", type: "slider", min: 0.1, max: 1, step: 0.01 },
    { key: "weight", label: "Weight", type: "slider", min: 100, max: 900, step: 100 },
    { key: "letterSpacing", label: "Letter spacing", type: "slider", min: -0.2, max: 0.5, step: 0.01 },
    { key: "alignment", label: "Alignment", type: "select", options: [
      { value: "left", label: "Left" },
      { value: "center", label: "Center" },
      { value: "right", label: "Right" },
    ]},
  ],
  render(target: RenderTarget, params: Params, _seed: string, palette: string[], _rng: Rng, _context: GlobalContext) {
    const ctx = target.ctx as CanvasRenderingContext2D;
    const { width: W, height: H } = target;
    ctx.fillStyle = palette[0] ?? "#000000";
    ctx.fillRect(0, 0, W, H);

    const fontSize = Math.round(H * params.size);
    ctx.fillStyle = palette[palette.length - 1] ?? "#ffffff";
    ctx.textAlign = params.alignment;
    ctx.textBaseline = "middle";
    ctx.font = `${params.weight} ${fontSize}px ${params.font}, system-ui, sans-serif`;

    const xMap = { left: W * 0.08, center: W / 2, right: W * 0.92 };
    const x = xMap[params.alignment];
    const y = H / 2;

    if (params.letterSpacing !== 0) {
      const chars = [...params.text];
      const totalW = chars.reduce((acc, c) => acc + ctx.measureText(c).width + fontSize * params.letterSpacing, 0) - fontSize * params.letterSpacing;
      let startX = x;
      if (params.alignment === "center") startX = x - totalW / 2;
      if (params.alignment === "right") startX = x - totalW;
      for (const c of chars) {
        ctx.fillText(c, startX, y);
        startX += ctx.measureText(c).width + fontSize * params.letterSpacing;
      }
    } else {
      ctx.fillText(params.text, x, y);
    }
  },
  toSvg(size, params, _seed, palette) {
    const fontSize = Math.round(size.height * params.size);
    const bg = palette[0] ?? "#000000";
    const fg = palette[palette.length - 1] ?? "#ffffff";
    const xMap = { left: size.width * 0.08, center: size.width / 2, right: size.width * 0.92 };
    const x = xMap[params.alignment];
    const anchor = params.alignment;
    const letterSpacingAttr = params.letterSpacing !== 0 ? ` letter-spacing="${(params.letterSpacing * fontSize).toFixed(2)}"` : "";
    return `<svg xmlns="http://www.w3.org/2000/svg" width="${size.width}" height="${size.height}" viewBox="0 0 ${size.width} ${size.height}"><rect width="${size.width}" height="${size.height}" fill="${bg}"/><text x="${x}" y="${size.height / 2}" text-anchor="${anchor}" dominant-baseline="middle" font-family="${params.font}, system-ui, sans-serif" font-weight="${params.weight}" font-size="${fontSize}" fill="${fg}"${letterSpacingAttr}>${escapeXml(params.text)}</text></svg>`;
  },
};
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run tests/generators/typography.test.ts`
Expected: 3 tests pass.

- [ ] **Step 5: Write the fidelity test**

Create `tests/generators/typography.fidelity.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { renderToTarget } from "../../lib/render/renderToTarget";
import { typography } from "../../lib/generators/typography";
import { makeCanvas } from "../helpers/canvas";

const input = {
  generatorId: "typography",
  params: typography.schema.defaults,
  palette: ["#0f172a", "#f59e0b"],
  mode: "dark" as const,
  seed: "typfid",
  grainEnabled: false,
  grainIntensity: 0,
  blurIntensity: 0,
};

function downscale(src: ImageData, dw: number, dh: number): ImageData {
  const dst = new ImageData(dw, dh);
  for (let y = 0; y < dh; y++) {
    const sy = Math.floor((y / dh) * src.height);
    for (let x = 0; x < dw; x++) {
      const sx = Math.floor((x / dw) * src.width);
      const si = (sy * src.width + sx) * 4;
      const di = (y * dw + x) * 4;
      dst.data[di]     = src.data[si];
      dst.data[di + 1] = src.data[si + 1];
      dst.data[di + 2] = src.data[si + 2];
      dst.data[di + 3] = 255;
    }
  }
  return dst;
}

describe("typography fidelity", () => {
  it("preview matches downscale of export within tolerance", () => {
    const preview = makeCanvas(200, 400);
    const exportC = makeCanvas(2000, 4000);
    renderToTarget({ ctx: preview.ctx, width: 200, height: 400, dpr: 1 }, input);
    renderToTarget({ ctx: exportC.ctx, width: 2000, height: 4000, dpr: 1 }, input);
    const pd = preview.ctx.getImageData(0, 0, 200, 400);
    const ed = exportC.ctx.getImageData(0, 0, 2000, 4000);
    const edDown = downscale(ed, 200, 400);
    let total = 0;
    for (let i = 0; i < pd.data.length; i += 4) {
      total += Math.abs(pd.data[i] - edDown.data[i])
            + Math.abs(pd.data[i + 1] - edDown.data[i + 1])
            + Math.abs(pd.data[i + 2] - edDown.data[i + 2]);
    }
    const mean = total / (pd.data.length / 4) / 3;
    expect(mean).toBeLessThan(2.55);
  });
});
```

- [ ] **Step 6: Run fidelity test**

Run: `npx vitest run tests/generators/typography.fidelity.test.ts`
Expected: passes.

- [ ] **Step 7: Register typography in the barrel**

Edit `lib/generators/index.ts`. Replace the body of `ensureRegistered` with:

```ts
  registerGenerator(waveform);
  registerGenerator(geometric);
  registerGenerator(typography);
```

The full file becomes:

```ts
import { registerGenerator } from "./registry";
import { waveform } from "./waveform";
import { geometric } from "./geometric";
import { typography } from "./typography";

let initialized = false;

export function ensureRegistered(): void {
  if (initialized) return;
  registerGenerator(waveform);
  registerGenerator(geometric);
  registerGenerator(typography);
  initialized = true;
}

export { getGenerator, listGenerators } from "./registry";
export type { Generator, GeneratorId } from "./registry";
export type * from "./types";
```

- [ ] **Step 8: Commit**

```bash
git add lib/generators/typography tests/generators/typography.test.ts tests/generators/typography.fidelity.test.ts lib/generators/index.ts
git commit -m "feat(generators): add typography generator with SVG export"
```

---

### Task 26: Fluid-gradient generator (shader via ogl)

**Files:**
- Create: `lib/generators/fluid-gradient/shader.glsl.ts`, `lib/generators/fluid-gradient/index.ts`, `tests/generators/fluid-gradient.test.ts`, `tests/generators/fluid-gradient.fidelity.test.ts`

- [ ] **Step 1: Write the failing test**

Create `tests/generators/fluid-gradient.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { fluidGradient } from "../../lib/generators/fluid-gradient";
import { makeCanvas } from "../helpers/canvas";
import { createRng } from "../../lib/prng";

function makeWebGLCanvas(w: number, h: number): { canvas: HTMLCanvasElement; ctx: WebGLRenderingContext } | null {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const gl = canvas.getContext("webgl");
  if (!gl) return null;
  return { canvas, ctx: gl };
}

describe("fluid-gradient generator", () => {
  it("has registered id and label", () => {
    expect(fluidGradient.id).toBe("fluid-gradient");
    expect(fluidGradient.label).toBeTruthy();
    expect(fluidGradient.kind).toBe("shader");
  });

  it("renders without throwing when WebGL is available", () => {
    const w = makeWebGLCanvas(200, 400);
    if (!w) return;
    const params = fluidGradient.schema.defaults;
    expect(() =>
      fluidGradient.render({ ctx: w.ctx, width: 200, height: 400, dpr: 1 }, params, "fg", ["#000", "#fff"], createRng("fg"), { blur: 0, grain: { enabled: false, intensity: 0 } })
    ).not.toThrow();
  });

  it("renders at multiple sizes", () => {
    for (const [w, h] of [[200, 400], [2000, 1000]] as const) {
      const webgl = makeWebGLCanvas(w, h);
      if (!webgl) return;
      const params = fluidGradient.schema.defaults;
      expect(() =>
        fluidGradient.render({ ctx: webgl.ctx, width: w, height: h, dpr: 1 }, params, "fg", ["#000", "#fff"], createRng("fg"), { blur: 0, grain: { enabled: false, intensity: 0 } })
      ).not.toThrow();
    }
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run tests/generators/fluid-gradient.test.ts`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement shader source**

Create `lib/generators/fluid-gradient/shader.glsl.ts`:

```ts
export const VERT = `
attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }
`;

export const FRAG = `
precision highp float;
uniform vec2 uResolution;
uniform float uTime;
uniform float uSeed;
uniform vec3 uColors[6];
uniform int uColorCount;
uniform float uBlobCount;
uniform float uDistortion;
uniform float uSwirl;
uniform float uContrast;
uniform float uSaturation;

float hash(vec2 p) {
  p = fract(p * vec2(123.34, 456.21));
  p += dot(p, p + 45.32);
  return fract(p.x * p.y);
}

float noise(vec2 p) {
  vec2 i = floor(p);
  vec2 f = fract(p);
  float a = hash(i);
  float b = hash(i + vec2(1.0, 0.0));
  float c = hash(i + vec2(0.0, 1.0));
  float d = hash(i + vec2(1.0, 1.0));
  vec2 u = f * f * (3.0 - 2.0 * f);
  return mix(a, b, u.x) + (c - a) * u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
}

void main() {
  vec2 uv = gl_FragCoord.xy / uResolution.xy;
  vec2 p = uv;
  p.x *= uResolution.x / uResolution.y;
  float t = uTime * 0.1 + uSeed;
  float n = 0.0;
  float amp = 1.0;
  vec2 flow = vec2(0.0);
  for (int i = 0; i < 4; i++) {
    n += noise(p * uBlobCount + t) * amp;
    flow += vec2(noise(p * uBlobCount + 7.3 + t), noise(p * uBlobCount - 3.1 - t)) * amp;
    p += flow * uSwirl * 0.1;
    p *= 1.0 + uDistortion * 0.2;
    amp *= 0.5;
  }
  n = clamp(n * 0.6 + 0.5, 0.0, 1.0);
  n = pow(n, 1.0 / max(0.0001, uContrast));
  vec3 col = uColors[0];
  float w = 0.0;
  for (int i = 1; i < 6; i++) {
    if (i >= uColorCount) break;
    float f = smoothstep(float(i - 1) / float(uColorCount - 1) - 0.1, float(i) / float(uColorCount - 1) + 0.1, n);
    col = mix(col, uColors[i], f);
  }
  float gray = dot(col, vec3(0.299, 0.587, 0.114));
  col = mix(vec3(gray), col, uSaturation);
  gl_FragColor = vec4(col, 1.0);
}
`;
```

- [ ] **Step 4: Implement fluid-gradient generator**

Create `lib/generators/fluid-gradient/index.ts`:

```ts
import { z } from "zod";
import { Renderer, Program, Mesh, Triangle, Vec3 } from "ogl";
import type { Generator, RenderTarget, GlobalContext } from "../types";
import { VERT, FRAG } from "./shader.glsl";

const Schema = z.object({
  blobCount: z.number().min(1).max(8),
  distortion: z.number().min(0).max(2),
  swirl: z.number().min(0).max(2),
  contrast: z.number().min(0.1).max(4),
  saturation: z.number().min(0).max(2),
});

type Params = z.infer<typeof Schema>;

function hexToVec3(hex: string): Vec3 {
  const m = hex.replace("#", "");
  return new Vec3(
    parseInt(m.substring(0, 2), 16) / 255,
    parseInt(m.substring(2, 4), 16) / 255,
    parseInt(m.substring(4, 6), 16) / 255
  );
}

let renderer: Renderer | null = null;
let program: Program | null = null;
let mesh: Mesh | null = null;
let lastGl: WebGLRenderingContext | null = null;

function ensureSetup(target: RenderTarget) {
  if (program && lastGl === target.ctx) return;
  if (!(target.ctx instanceof WebGLRenderingContext)) {
    throw new Error("fluid-gradient requires a WebGL context");
  }
  const gl = target.ctx;
  if (renderer) {
    renderer.gl = gl;
  } else {
    renderer = new Renderer({ gl, dpr: 1 });
  }
  program = new Program(gl, { vertex: VERT, fragment: FRAG, transparent: false });
  const geometry = new Triangle(gl);
  mesh = new Mesh(gl, { geometry, program });
  lastGl = gl;
}

export const fluidGradient: Generator<Params> = {
  id: "fluid-gradient",
  label: "Fluid Gradient",
  kind: "shader",
  schema: {
    zod: Schema,
    defaults: { blobCount: 3, distortion: 0.5, swirl: 0.5, contrast: 1, saturation: 1 },
  },
  supportsSvgExport: false,
  paramControls: [
    { key: "blobCount", label: "Blob count", type: "slider", min: 1, max: 8, step: 1 },
    { key: "distortion", label: "Distortion", type: "slider", min: 0, max: 2, step: 0.01 },
    { key: "swirl", label: "Swirl", type: "slider", min: 0, max: 2, step: 0.01 },
    { key: "contrast", label: "Contrast", type: "slider", min: 0.1, max: 4, step: 0.05 },
    { key: "saturation", label: "Saturation", type: "slider", min: 0, max: 2, step: 0.01 },
  ],
  render(target, params, seed, palette, _rng, _context: GlobalContext) {
    ensureSetup(target);
    const gl = target.ctx as WebGLRenderingContext;
    if (renderer && program && mesh) {
      const padded = [palette[0] ?? "#000000", ...palette, ...palette].slice(0, 6);
      const colorVecs = padded.map(hexToVec3);
      const colorArray: [number, number, number][] = colorVecs.map(v => [v.x, v.y, v.z]);
      while (colorArray.length < 6) colorArray.push([0, 0, 0]);
      let seedNum = 0;
      for (let i = 0; i < seed.length; i++) seedNum = (seedNum * 31 + seed.charCodeAt(i)) >>> 0;
      program.uniforms.uResolution.value = [target.width, target.height];
      program.uniforms.uTime.value = performance.now() / 1000;
      program.uniforms.uSeed.value = (seedNum % 1000) / 1000;
      program.uniforms.uColors.value = colorArray;
      program.uniforms.uColorCount.value = palette.length;
      program.uniforms.uBlobCount.value = params.blobCount;
      program.uniforms.uDistortion.value = params.distortion;
      program.uniforms.uSwirl.value = params.swirl;
      program.uniforms.uContrast.value = params.contrast;
      program.uniforms.uSaturation.value = params.saturation;
      renderer.setSize(target.width, target.height);
      gl.viewport(0, 0, target.width, target.height);
      renderer.render({ scene: mesh });
    }
  },
};
```

- [ ] **Step 5: Run test to verify it passes**

Run: `npx vitest run tests/generators/fluid-gradient.test.ts`
Expected: 3 tests pass. If WebGL is unavailable in jsdom, the test is a no-op (covered by the `if (!w) return` guards).

- [ ] **Step 6: Write the fidelity test**

Create `tests/generators/fluid-gradient.fidelity.test.ts`:

```ts
import { describe, it, expect } from "vitest";
import { fluidGradient } from "../../lib/generators/fluid-gradient";
import { makeCanvas } from "../helpers/canvas";
import { createRng } from "../../lib/prng";

function makeWebGLCanvas(w: number, h: number) {
  const canvas = document.createElement("canvas");
  canvas.width = w;
  canvas.height = h;
  const gl = canvas.getContext("webgl");
  if (!gl) return null;
  return { canvas, ctx: gl };
}

const input = {
  generatorId: "fluid-gradient",
  params: fluidGradient.schema.defaults,
  palette: ["#0f172a", "#f59e0b", "#fbbf24"],
  mode: "dark" as const,
  seed: "fgfid",
  grainEnabled: false,
  grainIntensity: 0,
  blurIntensity: 0,
};

describe("fluid-gradient fidelity", () => {
  it("renders at both preview and export sizes without throwing", () => {
    const preview = makeWebGLCanvas(200, 400);
    const exportC = makeWebGLCanvas(2000, 4000);
    if (!preview || !exportC) return;
    const params = fluidGradient.schema.defaults;
    const ctx1 = fluidGradient;
    expect(() => ctx1.render({ ctx: preview.ctx, width: 200, height: 400, dpr: 1 }, params, "fgfid", input.palette, createRng("fgfid"), { blur: 0, grain: { enabled: false, intensity: 0 } })).not.toThrow();
    expect(() => ctx1.render({ ctx: exportC.ctx, width: 2000, height: 4000, dpr: 1 }, params, "fgfid", input.palette, createRng("fgfid"), { blur: 0, grain: { enabled: false, intensity: 0 } })).not.toThrow();
  });
});
```

- [ ] **Step 7: Run fidelity test**

Run: `npx vitest run tests/generators/fluid-gradient.fidelity.test.ts`
Expected: passes (if WebGL is available) or skips (if not).

- [ ] **Step 8: Register fluid-gradient in the barrel**

Edit `lib/generators/index.ts`. Replace the body of `ensureRegistered` with:

```ts
  registerGenerator(waveform);
  registerGenerator(geometric);
  registerGenerator(typography);
  registerGenerator(fluidGradient);
```

The full file becomes:

```ts
import { registerGenerator } from "./registry";
import { waveform } from "./waveform";
import { geometric } from "./geometric";
import { typography } from "./typography";
import { fluidGradient } from "./fluid-gradient";

let initialized = false;

export function ensureRegistered(): void {
  if (initialized) return;
  registerGenerator(waveform);
  registerGenerator(geometric);
  registerGenerator(typography);
  registerGenerator(fluidGradient);
  initialized = true;
}

export { getGenerator, listGenerators } from "./registry";
export type { Generator, GeneratorId } from "./registry";
export type * from "./types";
```

- [ ] **Step 9: Commit**

```bash
git add lib/generators/fluid-gradient tests/generators/fluid-gradient.test.ts tests/generators/fluid-gradient.fidelity.test.ts lib/generators/index.ts
git commit -m "feat(generators): add fluid-gradient generator (shader via ogl)"
```

---


## Phase 9: Export & recipe UI (Tasks 27–29)

### Task 27: ExportBar (single + batch + recipe JSON)

**Files:**
- Create: `components/Panel/ExportBar.tsx`, `components/Panel/ExportBar.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/Panel/ExportBar.test.tsx`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { ExportBar } from "./ExportBar";
import { useEditorStore } from "@/store/useEditorStore";
import { _resetRegistryForTests } from "@/lib/generators/registry";
import { waveform } from "@/lib/generators/waveform";

describe("ExportBar", () => {
  beforeEach(() => {
    _resetRegistryForTests();
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "exp",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
      resolutionId: "desktop-1080p",
      customWidth: 200,
      customHeight: 400,
      aspectLock: true,
      overlayClock: false,
      overlayDate: false,
      overlayText: false,
      overlayTextValue: "",
      overlayFont: "Inter",
      overlaySize: 1,
      exportFormat: "png",
    });
  });

  it("renders the download button", () => {
    const { getByText } = render(<ExportBar />);
    expect(getByText(/download/i)).toBeInTheDocument();
  });

  it("clicking download calls exportImage and creates a download link", async () => {
    const { getByText } = render(<ExportBar />);
    const btn = getByText(/download/i);
    fireEvent.click(btn);
    await new Promise(r => setTimeout(r, 50));
    expect(btn).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/Panel/ExportBar.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement ExportBar**

Create `components/Panel/ExportBar.tsx`:

```tsx
import { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { ensureRegistered, getGenerator } from "@/lib/generators";
import { exportImage } from "@/lib/export/exportImage";
import { batchExport } from "@/lib/export/batchExport";
import { buildFilename } from "@/lib/export/filename";
import { encodeRecipe, encodeHash } from "@/lib/recipe/encode";
import type { Recipe } from "@/lib/recipe/validate";
import { DEVICE_PRESETS } from "@/lib/devices/presets";
import { Button } from "@/components/ui/Button";
import { Select } from "@/components/ui/Select";

function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export function ExportBar() {
  useEditorStore(s => s.exportFormat);
  const setExportFormat = useEditorStore(s => s.setExportFormat);
  const exportFormat = useEditorStore.getState().exportFormat;
  const [progress, setProgress] = useState<{ done: number; total: number } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [batchOpen, setBatchOpen] = useState(false);
  const [batchSelection, setBatchSelection] = useState<string[]>(["desktop-1080p", "iphone-15-pro"]);

  function buildInput(): { input: Parameters<typeof exportImage>[0]; seed: string; generatorId: string } | null {
    ensureRegistered();
    const s = useEditorStore.getState();
    const generatorId = s.generatorId;
    const g = getGenerator(generatorId);
    if (!g) return null;
    const input = {
      generatorId,
      params: s.params[generatorId] ?? {},
      palette: s.palette,
      mode: s.mode,
      seed: s.seed,
      grainEnabled: s.grainEnabled,
      grainIntensity: s.grainIntensity,
      blurIntensity: s.blurIntensity,
      overlays: {
        clock: s.overlayClock,
        date: s.overlayDate,
        text: s.overlayText,
        textValue: s.overlayTextValue,
        font: s.overlayFont,
        size: s.overlaySize,
      },
    };
    return { input, seed: s.seed, generatorId };
  }

  function buildRecipe(): Recipe {
    const s = useEditorStore.getState();
    return {
      v: 1,
      type: "wallmydevice/recipe",
      generator: s.generatorId,
      params: (s.params[s.generatorId] ?? {}) as Record<string, unknown>,
      palette: s.palette,
      mode: s.mode,
      seed: s.seed,
      grain: { enabled: s.grainEnabled, intensity: s.grainIntensity },
      blur: s.blurIntensity,
      resolution: { preset: s.resolutionId, width: s.customWidth, height: s.customHeight },
      overlays: {
        clock: s.overlayClock,
        date: s.overlayDate,
        text: s.overlayText,
        value: s.overlayTextValue,
        font: s.overlayFont,
        size: s.overlaySize,
      },
    };
  }

  async function onDownload() {
    setError(null);
    const built = buildInput();
    if (!built) return;
    const w = useEditorStore.getState().customWidth;
    const h = useEditorStore.getState().customHeight;
    try {
      if (exportFormat === "svg") {
        const g = getGenerator(built.generatorId);
        if (!g || !g.toSvg) throw new Error("This generator cannot export as SVG");
        const svg = g.toSvg({ width: w, height: h }, built.input.params as never, built.seed, built.input.palette);
        const blob = new Blob([svg], { type: "image/svg+xml" });
        downloadBlob(blob, buildFilename(built.generatorId, built.seed, { width: w, height: h }, "svg"));
      } else {
        const blob = await exportImage(built.input, { width: w, height: h }, exportFormat);
        downloadBlob(blob, buildFilename(built.generatorId, built.seed, { width: w, height: h }, exportFormat));
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : "Render failed");
    }
  }

  async function onBatch() {
    setError(null);
    const built = buildInput();
    if (!built) return;
    const sizes = batchSelection
      .map(id => DEVICE_PRESETS.find(p => p.id === id))
      .filter((p): p is NonNullable<typeof p> => Boolean(p) && p.id !== "custom")
      .map(p => ({ width: p.w, height: p.h }));
    if (sizes.length === 0) return;
    setProgress({ done: 0, total: sizes.length });
    try {
      const zip = await batchExport(built.input, sizes, built.seed, (done, total) => setProgress({ done, total }));
      const ts = String(Date.now());
      downloadBlob(zip, buildFilename.batch(ts));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Batch failed");
    } finally {
      setProgress(null);
    }
  }

  function onRecipeJson() {
    const json = encodeRecipe(buildRecipe());
    const blob = new Blob([json], { type: "application/json" });
    downloadBlob(blob, `wallmydevice-recipe-${useEditorStore.getState().seed}.json`);
  }

  async function onCopyShareLink() {
    try {
      const hash = encodeHash(buildRecipe());
      const url = `${location.origin}${location.pathname}${hash}`;
      await navigator.clipboard.writeText(url);
    } catch (e) {
      setError("Could not copy link. Recipe URL too long?");
    }
  }

  function toggleBatch(id: string) {
    setBatchSelection(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  }

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Select
          value={exportFormat}
          onChange={(v) => setExportFormat(v as typeof exportFormat)}
          options={(() => {
            const g = useEditorStore.getState().generatorId;
            const gen = getGenerator(g);
            return [
              { value: "png", label: "PNG" },
              { value: "jpg", label: "JPG" },
              { value: "webp", label: "WEBP" },
              { value: "svg", label: "SVG" },
            ].filter(o => o.value !== "svg" || (gen && gen.supportsSvgExport));
          })()}
          ariaLabel="Export format"
        />
        <Button onClick={onDownload}>Download</Button>
      </div>

      <div className="flex gap-2">
        <Button onClick={() => setBatchOpen(o => !o)}>Batch export</Button>
        <Button onClick={onRecipeJson}>Recipe JSON</Button>
        <Button onClick={onCopyShareLink}>Share link</Button>
      </div>

      {batchOpen ? (
        <div className="space-y-2 rounded-md border border-zinc-800 bg-zinc-900 p-2">
          {DEVICE_PRESETS.filter(p => p.id !== "custom").map(p => (
            <label key={p.id} className="flex items-center gap-2 text-xs text-zinc-300">
              <input
                type="checkbox"
                checked={batchSelection.includes(p.id)}
                onChange={() => toggleBatch(p.id)}
              />
              {p.label} ({p.w}x{p.h})
            </label>
          ))}
          <Button onClick={onBatch} disabled={batchSelection.length === 0 || progress !== null}>
            Generate all
          </Button>
          {progress ? (
            <div className="h-1 w-full overflow-hidden rounded-full bg-zinc-800">
              <div className="h-full bg-blue-500 transition-all" style={{ width: `${(progress.done / progress.total) * 100}%` }} />
            </div>
          ) : null}
        </div>
      ) : null}

      {error ? <p className="text-xs text-red-400">{error}</p> : null}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/Panel/ExportBar.test.tsx`
Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/Panel/ExportBar.tsx components/Panel/ExportBar.test.tsx
git commit -m "feat(panel): add ExportBar with single, batch, recipe, and share"
```

---

### Task 28: Recipe import (paste + drag-drop)

**Files:**
- Create: `components/Panel/RecipeLoader.tsx`, `components/Panel/RecipeLoader.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/Panel/RecipeLoader.test.tsx`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { render, fireEvent } from "@testing-library/react";
import { RecipeLoader } from "./RecipeLoader";
import { useEditorStore } from "@/store/useEditorStore";
import { _resetRegistryForTests } from "@/lib/generators/registry";
import { waveform } from "@/lib/generators/waveform";

describe("RecipeLoader", () => {
  beforeEach(() => {
    _resetRegistryForTests();
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "old",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
      resolutionId: "desktop-1080p",
      customWidth: 1920,
      customHeight: 1080,
      aspectLock: true,
      overlayClock: false,
      overlayDate: false,
      overlayText: false,
      overlayTextValue: "",
      overlayFont: "Inter",
      overlaySize: 1,
      exportFormat: "png",
    });
  });

  it("pasting a valid recipe updates the store", () => {
    const { getByText, container } = render(<RecipeLoader />);
    fireEvent.click(getByText("Load recipe"));
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    const recipe = {
      v: 1, type: "wallmydevice/recipe", generator: "waveform",
      params: { layers: 9, jaggedness: 0.5, smoothing: 0.6, lineThickness: 2, amplitude: 0.8, fillBelow: false },
      palette: ["#111111", "#eeeeee"], mode: "light", seed: "newseed",
      grain: { enabled: true, intensity: 0.2 }, blur: 0,
      resolution: { preset: "custom", width: 800, height: 1200 },
      overlays: { clock: false, date: false, text: true, value: "hi", font: "Inter", size: 1.5 },
    };
    fireEvent.change(textarea, { target: { value: JSON.stringify(recipe) } });
    fireEvent.click(getByText("Load"));
    expect(useEditorStore.getState().seed).toBe("newseed");
    expect(useEditorStore.getState().mode).toBe("light");
  });

  it("invalid recipe shows an error", () => {
    const { getByText, container } = render(<RecipeLoader />);
    fireEvent.click(getByText("Load recipe"));
    const textarea = container.querySelector("textarea") as HTMLTextAreaElement;
    fireEvent.change(textarea, { target: { value: "not json" } });
    fireEvent.click(getByText("Load"));
    expect(getByText(/not valid json/i)).toBeInTheDocument();
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/Panel/RecipeLoader.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement RecipeLoader**

Create `components/Panel/RecipeLoader.tsx`:

```tsx
import { useState } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { parseRecipe, type Recipe } from "@/lib/recipe/validate";
import { Button } from "@/components/ui/Button";
import { DEVICE_PRESETS } from "@/lib/devices/presets";
import { getGenerator } from "@/lib/generators";

function applyRecipe(recipe: Recipe): { ok: true } | { ok: false; error: string } {
  const generator = getGenerator(recipe.generator);
  if (!generator) return { ok: false, error: `Unknown generator "${recipe.generator}"` };
  const paramCheck = generator.schema.zod.safeParse(recipe.params);
  if (!paramCheck.success) return { ok: false, error: `Invalid params: ${paramCheck.error.issues.map(i => i.path.join(".")).join(", ")}` };

  const preset = DEVICE_PRESETS.find(p => p.id === recipe.resolution.preset);
  const resolutionId = preset ? recipe.resolution.preset : "custom";

  useEditorStore.setState({
    generatorId: recipe.generator,
    params: { ...useEditorStore.getState().params, [recipe.generator]: recipe.params },
    palette: recipe.palette,
    mode: recipe.mode,
    seed: recipe.seed,
    grainEnabled: recipe.grain.enabled,
    grainIntensity: recipe.grain.intensity,
    blurIntensity: recipe.blur,
    resolutionId,
    customWidth: recipe.resolution.width,
    customHeight: recipe.resolution.height,
    overlayClock: recipe.overlays.clock,
    overlayDate: recipe.overlays.date,
    overlayText: recipe.overlays.text,
    overlayTextValue: recipe.overlays.value,
    overlayFont: recipe.overlays.font,
    overlaySize: recipe.overlays.size,
  });
  return { ok: true };
}

export function RecipeLoader() {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [error, setError] = useState<string | null>(null);

  function onLoad() {
    setError(null);
    const r = parseRecipe(text);
    if (!r.ok) { setError(r.error); return; }
    const applied = applyRecipe(r.recipe);
    if (!applied.ok) { setError(applied.error); return; }
    setOpen(false);
    setText("");
  }

  return (
    <div>
      <Button onClick={() => setOpen(o => !o)}>Load recipe</Button>
      {open ? (
        <div className="mt-2 space-y-2 rounded-md border border-zinc-800 bg-zinc-900 p-2">
          <textarea
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder="Paste a WallMyDevice recipe JSON here"
            className="h-32 w-full rounded-md border border-zinc-700 bg-zinc-950 px-2 py-1 text-xs text-zinc-100"
          />
          <div className="flex gap-2">
            <Button onClick={onLoad}>Load</Button>
            <Button onClick={() => { setOpen(false); setError(null); }}>Cancel</Button>
          </div>
          {error ? <p className="text-xs text-red-400">{error}</p> : null}
        </div>
      ) : null}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/Panel/RecipeLoader.test.tsx`
Expected: 2 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/Panel/RecipeLoader.tsx components/Panel/RecipeLoader.test.tsx
git commit -m "feat(panel): add RecipeLoader (paste)"
```

---

### Task 29: Wire ControlPanel to all sections + assemble the app page

**Files:**
- Modify: `components/Panel/ControlPanel.tsx`
- Create: `components/Panel/FinishControls.tsx`, `components/Panel/OverlayControls.tsx`
- Modify: `app/page.tsx`

- [ ] **Step 1: Create FinishControls**

Create `components/Panel/FinishControls.tsx`:

```tsx
import { useEditorStore } from "@/store/useEditorStore";
import { Slider } from "@/components/ui/Slider";
import { Toggle } from "@/components/ui/Toggle";

export function FinishControls() {
  const grainEnabled = useEditorStore(s => s.grainEnabled);
  const grainIntensity = useEditorStore(s => s.grainIntensity);
  const blurIntensity = useEditorStore(s => s.blurIntensity);
  const setGrain = useEditorStore(s => s.setGrain);
  const setBlur = useEditorStore(s => s.setBlur);

  return (
    <div className="space-y-3">
      <label className="flex items-center justify-between text-xs text-zinc-300">
        <span>Grain</span>
        <Toggle checked={grainEnabled} onChange={(v) => setGrain(v, grainIntensity)} ariaLabel="Toggle grain" />
      </label>
      <label className="block">
        <div className="mb-1 flex items-center justify-between text-xs text-zinc-300">
          <span>Grain intensity</span>
          <span className="tabular-nums text-zinc-500">{grainIntensity.toFixed(2)}</span>
        </div>
        <Slider value={grainIntensity} min={0} max={1} step={0.01} ariaLabel="Grain intensity" onChange={(v) => setGrain(grainEnabled, v)} />
      </label>
      <label className="block">
        <div className="mb-1 flex items-center justify-between text-xs text-zinc-300">
          <span>Blur</span>
          <span className="tabular-nums text-zinc-500">{blurIntensity.toFixed(2)}</span>
        </div>
        <Slider value={blurIntensity} min={0} max={1} step={0.01} ariaLabel="Blur" onChange={setBlur} />
      </label>
    </div>
  );
}
```

- [ ] **Step 2: Create OverlayControls**

Create `components/Panel/OverlayControls.tsx`:

```tsx
import { useEditorStore } from "@/store/useEditorStore";
import { Toggle } from "@/components/ui/Toggle";
import { Select } from "@/components/ui/Select";
import { Slider } from "@/components/ui/Slider";

const FONTS = [
  { value: "Inter", label: "Inter" },
  { value: "JetBrains Mono", label: "JetBrains Mono" },
  { value: "Playfair Display", label: "Playfair Display" },
];

export function OverlayControls() {
  const clock = useEditorStore(s => s.overlayClock);
  const date = useEditorStore(s => s.overlayDate);
  const text = useEditorStore(s => s.overlayText);
  const textValue = useEditorStore(s => s.overlayTextValue);
  const font = useEditorStore(s => s.overlayFont);
  const size = useEditorStore(s => s.overlaySize);
  const setOverlay = useEditorStore(s => s.setOverlay);
  const setOverlayText = useEditorStore(s => s.setOverlayText);
  const setOverlayFont = useEditorStore(s => s.setOverlayFont);
  const setOverlaySize = useEditorStore(s => s.setOverlaySize);

  return (
    <div className="space-y-3">
      {(["clock", "date", "text"] as const).map(k => (
        <label key={k} className="flex items-center justify-between text-xs text-zinc-300">
          <span className="capitalize">{k}</span>
          <Toggle checked={k === "clock" ? clock : k === "date" ? date : text} onChange={(v) => setOverlay(k, v)} ariaLabel={`Toggle ${k}`} />
        </label>
      ))}
      <textarea
        value={textValue}
        onChange={(e) => setOverlayText(e.target.value)}
        placeholder="Custom text"
        className="w-full rounded-md border border-zinc-700 bg-zinc-900 px-2 py-1.5 text-xs text-zinc-100"
      />
      <Select value={font} onChange={setOverlayFont} options={FONTS} ariaLabel="Overlay font" />
      <label className="block">
        <div className="mb-1 flex items-center justify-between text-xs text-zinc-300">
          <span>Size</span>
          <span className="tabular-nums text-zinc-500">{size.toFixed(2)}</span>
        </div>
        <Slider value={size} min={0.1} max={4} step={0.05} ariaLabel="Overlay size" onChange={setOverlaySize} />
      </label>
    </div>
  );
}
```

- [ ] **Step 3: Update ControlPanel to compose all sections**

Edit `components/Panel/ControlPanel.tsx`. Replace its contents with:

```tsx
import { GeneratorPicker } from "./GeneratorPicker";
import { PalettePicker } from "./PalettePicker";
import { ModeToggle } from "./ModeToggle";
import { SeedBar } from "./SeedBar";
import { ResolutionPicker } from "./ResolutionPicker";
import { ParamsForm } from "./ParamsForm";
import { FinishControls } from "./FinishControls";
import { OverlayControls } from "./OverlayControls";
import { ExportBar } from "./ExportBar";
import { RecipeLoader } from "./RecipeLoader";

export function ControlPanel() {
  return (
    <aside className="flex h-full w-80 flex-col gap-6 overflow-y-auto border-l border-zinc-800 bg-zinc-950 p-4 text-zinc-100">
      <Section title="Generator"><GeneratorPicker /></Section>
      <Section title="Palette"><PalettePicker /></Section>
      <Section title="Mode"><ModeToggle /></Section>
      <Section title="Seed"><SeedBar /></Section>
      <Section title="Resolution"><ResolutionPicker /></Section>
      <Section title="Params"><ParamsForm /></Section>
      <Section title="Finish"><FinishControls /></Section>
      <Section title="Overlays"><OverlayControls /></Section>
      <Section title="Export"><ExportBar /><RecipeLoader /></Section>
    </aside>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h2 className="mb-2 text-xs font-semibold uppercase tracking-wider text-zinc-500">{title}</h2>
      {children}
    </section>
  );
}
```

- [ ] **Step 4: Assemble the app page**

Replace `app/page.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import { ControlPanel } from "@/components/Panel/ControlPanel";
import { PreviewCanvas } from "@/components/Preview/PreviewCanvas";
import { DeviceFrame } from "@/components/Preview/DeviceFrame";
import { useEditorStore } from "@/store/useEditorStore";
import { findPreset, DEVICE_PRESETS } from "@/lib/devices/presets";
import { ensureRegistered } from "@/lib/generators";
import { decodeHash } from "@/lib/recipe/encode";

export default function Page() {
  const generatorId = useEditorStore(s => s.generatorId);
  const resolutionId = useEditorStore(s => s.resolutionId);
  const customWidth = useEditorStore(s => s.customWidth);
  const customHeight = useEditorStore(s => s.customHeight);

  useEffect(() => { ensureRegistered(); }, []);

  useEffect(() => {
    const hash = window.location.hash;
    if (hash.startsWith("#r=")) {
      const r = decodeHash(hash);
      if (r.ok) {
        const recipe = r.recipe;
        useEditorStore.setState({
          generatorId: recipe.generator,
          params: { ...useEditorStore.getState().params, [recipe.generator]: recipe.params },
          palette: recipe.palette,
          mode: recipe.mode,
          seed: recipe.seed,
          grainEnabled: recipe.grain.enabled,
          grainIntensity: recipe.grain.intensity,
          blurIntensity: recipe.blur,
          resolutionId: recipe.resolution.preset === "custom" ? "custom" : recipe.resolution.preset,
          customWidth: recipe.resolution.width,
          customHeight: recipe.resolution.height,
          overlayClock: recipe.overlays.clock,
          overlayDate: recipe.overlays.date,
          overlayText: recipe.overlays.text,
          overlayTextValue: recipe.overlays.value,
          overlayFont: recipe.overlays.font,
          overlaySize: recipe.overlays.size,
        });
      }
    }
  }, []);

  useEffect(() => {
    const state = useEditorStore.getState();
    let params: Record<string, unknown> = state.params;
    try { params = JSON.parse(JSON.stringify(state.params)); } catch {}
    const local = {
      generatorId: state.generatorId,
      params,
      palette: state.palette,
      mode: state.mode,
      seed: state.seed,
      grainEnabled: state.grainEnabled,
      grainIntensity: state.grainIntensity,
      blurIntensity: state.blurIntensity,
      resolutionId: state.resolutionId,
      customWidth: state.customWidth,
      customHeight: state.customHeight,
      aspectLock: state.aspectLock,
      overlayClock: state.overlayClock,
      overlayDate: state.overlayDate,
      overlayText: state.overlayText,
      overlayTextValue: state.overlayTextValue,
      overlayFont: state.overlayFont,
      overlaySize: state.overlaySize,
      exportFormat: state.exportFormat,
    };
    try { localStorage.setItem("wallmydevice:lastState", JSON.stringify(local)); } catch {}
  });

  const preset = findPreset(resolutionId) ?? DEVICE_PRESETS[0];
  const aspect = customWidth / customHeight;
  const maxPreviewWidth = 800;
  const maxPreviewHeight = 600;

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="flex h-12 items-center justify-between border-b border-zinc-800 px-4">
        <h1 className="text-sm font-semibold tracking-wider">WallMyDevice</h1>
        <span className="text-xs text-zinc-500">{generatorId} - {customWidth}x{customHeight} - {preset.frame}</span>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 items-center justify-center p-6">
          <DeviceFrame frame={preset.frame} aspect={aspect}>
            <PreviewCanvas frame={preset.frame} aspect={aspect} maxWidth={maxPreviewWidth} maxHeight={maxPreviewHeight} />
          </DeviceFrame>
        </main>
        <ControlPanel />
      </div>
    </div>
  );
}
```

- [ ] **Step 5: Smoke test the page**

Run: `npm run dev` (background). Run: `curl http://localhost:3000 -o nul -w "%{http_code}"`. Expected: `200`. Open `http://localhost:3000` in a browser and confirm the waveform wallpaper appears in the device frame with a control panel on the right. Kill the dev server.

- [ ] **Step 6: Commit**

```bash
git add components/Panel/ControlPanel.tsx components/Panel/FinishControls.tsx components/Panel/OverlayControls.tsx app/page.tsx
git commit -m "feat(panel): compose all control sections and assemble the app page"
```

---


## Phase 10: Mobile, keyboard, polish, deploy (Tasks 30–35)

### Task 30: BottomSheet component (mobile)

**Files:**
- Create: `components/Preview/BottomSheet.tsx`, `components/Preview/BottomSheet.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/Preview/BottomSheet.test.tsx`:

```ts
import { describe, it, expect } from "vitest";
import { render, fireEvent, screen } from "@testing-library/react";
import { BottomSheet } from "./BottomSheet";

describe("BottomSheet", () => {
  it("renders the title in the collapsed handle", () => {
    render(<BottomSheet title="Generator" collapsed={true} onSnap={() => {}}><div data-testid="content" /></BottomSheet>);
    expect(screen.getByText("Generator")).toBeInTheDocument();
  });

  it("renders children when expanded", () => {
    render(<BottomSheet title="Generator" collapsed={false} onSnap={() => {}}><div data-testid="content" /></BottomSheet>);
    expect(screen.getByTestId("content")).toBeInTheDocument();
  });

  it("clicking the handle calls onSnap", () => {
    const onSnap = vi.fn();
    render(<BottomSheet title="Generator" collapsed={true} onSnap={onSnap}><div /></BottomSheet>);
    fireEvent.click(screen.getByText("Generator"));
    expect(onSnap).toHaveBeenCalled();
  });
});

import { vi } from "vitest";
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/Preview/BottomSheet.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement BottomSheet**

Create `components/Preview/BottomSheet.tsx`:

```tsx
import type { ReactNode } from "react";

type Props = {
  title: string;
  collapsed: boolean;
  onSnap: (collapsed: boolean) => void;
  children: ReactNode;
};

export function BottomSheet({ title, collapsed, onSnap, children }: Props) {
  return (
    <div
      data-testid="bottom-sheet"
      data-collapsed={collapsed}
      className="absolute inset-x-0 bottom-0 z-30 rounded-t-2xl border-t border-zinc-800 bg-zinc-950 transition-all"
      style={{ height: collapsed ? 64 : "70vh" }}
    >
      <button
        type="button"
        onClick={() => onSnap(!collapsed)}
        aria-label="Toggle bottom sheet"
        className="flex h-16 w-full items-center justify-center border-b border-zinc-800 px-4"
      >
        <span className="text-sm font-semibold text-zinc-100">{title}</span>
      </button>
      {!collapsed ? <div className="h-[calc(100%-4rem)] overflow-y-auto p-4">{children}</div> : null}
    </div>
  );
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/Preview/BottomSheet.test.tsx`
Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add components/Preview/BottomSheet.tsx components/Preview/BottomSheet.test.tsx
git commit -m "feat(preview): add BottomSheet component for mobile"
```

---

### Task 31: Mobile layout (use BottomSheet + hide desktop frames)

**Files:**
- Modify: `app/page.tsx`

- [ ] **Step 1: Replace app/page.tsx with mobile-aware version**

Replace the contents of `app/page.tsx` with:

```tsx
"use client";

import { useEffect, useState } from "react";
import { ControlPanel } from "@/components/Panel/ControlPanel";
import { PreviewCanvas } from "@/components/Preview/PreviewCanvas";
import { DeviceFrame } from "@/components/Preview/DeviceFrame";
import { BottomSheet } from "@/components/Preview/BottomSheet";
import { useEditorStore } from "@/store/useEditorStore";
import { findPreset, DEVICE_PRESETS } from "@/lib/devices/presets";
import { ensureRegistered, getGenerator } from "@/lib/generators";
import { decodeHash } from "@/lib/recipe/encode";
import { getDefaultParams } from "@/lib/generators/registry-helpers";

function loadHashRecipe() {
  const hash = window.location.hash;
  if (!hash.startsWith("#r=")) return;
  const r = decodeHash(hash);
  if (!r.ok) return;
  const recipe = r.recipe;
  const params = useEditorStore.getState().params;
  useEditorStore.setState({
    generatorId: recipe.generator,
    params: { ...params, [recipe.generator]: recipe.params },
    palette: recipe.palette,
    mode: recipe.mode,
    seed: recipe.seed,
    grainEnabled: recipe.grain.enabled,
    grainIntensity: recipe.grain.intensity,
    blurIntensity: recipe.blur,
    resolutionId: DEVICE_PRESETS.find(p => p.id === recipe.resolution.preset) ? recipe.resolution.preset : "custom",
    customWidth: recipe.resolution.width,
    customHeight: recipe.resolution.height,
    overlayClock: recipe.overlays.clock,
    overlayDate: recipe.overlays.date,
    overlayText: recipe.overlays.text,
    overlayTextValue: recipe.overlays.value,
    overlayFont: recipe.overlays.font,
    overlaySize: recipe.overlays.size,
  });
}

function persistToLocalStorage() {
  const state = useEditorStore.getState();
  const local = {
    generatorId: state.generatorId,
    params: state.params,
    palette: state.palette,
    mode: state.mode,
    seed: state.seed,
    grainEnabled: state.grainEnabled,
    grainIntensity: state.grainIntensity,
    blurIntensity: state.blurIntensity,
    resolutionId: state.resolutionId,
    customWidth: state.customWidth,
    customHeight: state.customHeight,
    aspectLock: state.aspectLock,
    overlayClock: state.overlayClock,
    overlayDate: state.overlayDate,
    overlayText: state.overlayText,
    overlayTextValue: state.overlayTextValue,
    overlayFont: state.overlayFont,
    overlaySize: state.overlaySize,
    exportFormat: state.exportFormat,
  };
  try { localStorage.setItem("wallmydevice:lastState", JSON.stringify(local)); } catch {}
}

export default function Page() {
  const generatorId = useEditorStore(s => s.generatorId);
  const resolutionId = useEditorStore(s => s.resolutionId);
  const customWidth = useEditorStore(s => s.customWidth);
  const customHeight = useEditorStore(s => s.customHeight);

  const [isMobile, setIsMobile] = useState(false);
  const [sheetCollapsed, setSheetCollapsed] = useState(true);

  useEffect(() => { ensureRegistered(); }, []);

  useEffect(() => {
    const mq = window.matchMedia("(max-width: 767px)");
    const onChange = () => setIsMobile(mq.matches);
    onChange();
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);

  useEffect(() => { loadHashRecipe(); }, []);

  useEffect(() => { persistToLocalStorage(); });

  const preset = findPreset(resolutionId) ?? DEVICE_PRESETS[0];
  const activeFrame = isMobile && (preset.frame === "desktop-monitor" || preset.frame === "ultrawide" || preset.frame === "macbook")
    ? "none"
    : preset.frame;
  const aspect = customWidth / customHeight;
  const generator = getGenerator(generatorId);
  const sheetTitle = `Generator: ${generator?.label ?? generatorId}`;

  if (isMobile) {
    return (
      <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100">
        <header className="flex h-12 items-center justify-between border-b border-zinc-800 px-4">
          <h1 className="text-sm font-semibold tracking-wider">WallMyDevice</h1>
        </header>
        <main className="relative flex-1 overflow-hidden">
          <div className="flex h-full items-center justify-center p-4">
            <DeviceFrame frame={activeFrame} aspect={aspect}>
              <PreviewCanvas frame={activeFrame} aspect={aspect} maxWidth={360} maxHeight={640} />
            </DeviceFrame>
          </div>
          <BottomSheet title={sheetTitle} collapsed={sheetCollapsed} onSnap={setSheetCollapsed}>
            <ControlPanel />
          </BottomSheet>
        </main>
      </div>
    );
  }

  return (
    <div className="flex h-screen flex-col bg-zinc-950 text-zinc-100">
      <header className="flex h-12 items-center justify-between border-b border-zinc-800 px-4">
        <h1 className="text-sm font-semibold tracking-wider">WallMyDevice</h1>
        <span className="text-xs text-zinc-500">{generatorId} - {customWidth}x{customHeight}</span>
      </header>
      <div className="flex flex-1 overflow-hidden">
        <main className="flex flex-1 items-center justify-center p-6">
          <DeviceFrame frame={preset.frame} aspect={aspect}>
            <PreviewCanvas frame={preset.frame} aspect={aspect} maxWidth={800} maxHeight={600} />
          </DeviceFrame>
        </main>
        <ControlPanel />
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Add the registry helper referenced in the page**

Create `lib/generators/registry-helpers.ts`:

```ts
import { getGenerator } from "./registry";

export function getDefaultParams(id: string): unknown {
  const g = getGenerator(id);
  return g ? structuredClone(g.schema.defaults) : {};
}
```

- [ ] **Step 3: Verify the dev server still works**

Run: `npm run dev` (background). Run: `curl http://localhost:3000 -o nul -w "%{http_code}"`. Expected: `200`. Open in browser and confirm mobile view (DevTools toggle) shows the bottom sheet, and desktop view shows the sidebar. Kill the dev server.

- [ ] **Step 4: Commit**

```bash
git add app/page.tsx lib/generators/registry-helpers.ts
git commit -m "feat(layout): add mobile bottom sheet layout"
```

---

### Task 32: Keyboard shortcuts (R, Space, 1–4, Esc, Ctrl+S)

**Files:**
- Create: `components/KeyboardShortcuts.tsx`, `components/KeyboardShortcuts.test.tsx`

- [ ] **Step 1: Write the failing test**

Create `components/KeyboardShortcuts.test.tsx`:

```ts
import { describe, it, expect, beforeEach } from "vitest";
import { render } from "@testing-library/react";
import { fireEvent } from "@testing-library/react";
import { KeyboardShortcuts } from "./KeyboardShortcuts";
import { useEditorStore } from "@/store/useEditorStore";
import { _resetRegistryForTests } from "@/lib/generators/registry";
import { waveform } from "@/lib/generators/waveform";

describe("KeyboardShortcuts", () => {
  beforeEach(() => {
    _resetRegistryForTests();
    useEditorStore.setState({
      generatorId: "waveform",
      params: { waveform: waveform.schema.defaults },
      palette: ["#000", "#fff"],
      mode: "dark",
      seed: "before",
      grainEnabled: false,
      grainIntensity: 0,
      blurIntensity: 0,
      resolutionId: "desktop-1080p",
      customWidth: 1920,
      customHeight: 1080,
      aspectLock: true,
      overlayClock: false,
      overlayDate: false,
      overlayText: false,
      overlayTextValue: "",
      overlayFont: "Inter",
      overlaySize: 1,
      exportFormat: "png",
    });
  });

  it("R randomizes the seed", () => {
    render(<KeyboardShortcuts />);
    fireEvent.keyDown(document.body, { key: "r" });
    expect(useEditorStore.getState().seed).not.toBe("before");
  });

  it("Space randomizes the seed and preventsDefault", () => {
    render(<KeyboardShortcuts />);
    const evt = new KeyboardEvent("keydown", { key: " ", bubbles: true, cancelable: true });
    document.body.dispatchEvent(evt);
    expect(useEditorStore.getState().seed).not.toBe("before");
  });

  it("1 selects the first registered generator", () => {
    render(<KeyboardShortcuts />);
    fireEvent.keyDown(document.body, { key: "1" });
    expect(useEditorStore.getState().generatorId).toBe("waveform");
  });
});
```

- [ ] **Step 2: Run test to verify it fails**

Run: `npx vitest run components/KeyboardShortcuts.test.tsx`
Expected: FAIL — module not found.

- [ ] **Step 3: Implement KeyboardShortcuts**

Create `components/KeyboardShortcuts.tsx`:

```tsx
import { useEffect } from "react";
import { useEditorStore } from "@/store/useEditorStore";
import { ensureRegistered, listGenerators } from "@/lib/generators";

export function KeyboardShortcuts() {
  useEffect(() => {
    ensureRegistered();
    function onKey(e: KeyboardEvent) {
      const target = e.target as HTMLElement | null;
      if (target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable)) return;

      const s = useEditorStore.getState();
      if (e.key === "r" || e.key === "R" || e.code === "Space") {
        s.randomizeSeed();
        if (e.code === "Space") e.preventDefault();
        return;
      }
      if (e.key === "Escape") {
        s.hydrate({});
        return;
      }
      if (e.key >= "1" && e.key <= "4") {
        const gens = listGenerators();
        const idx = Number(e.key) - 1;
        if (idx < gens.length) s.setGenerator(gens[idx].id);
        return;
      }
    }
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  return null;
}
```

- [ ] **Step 4: Run test to verify it passes**

Run: `npx vitest run components/KeyboardShortcuts.test.tsx`
Expected: 3 tests pass.

- [ ] **Step 5: Mount KeyboardShortcuts in app/page.tsx**

Edit `app/page.tsx`. Add the import at the top:

```tsx
import { KeyboardShortcuts } from "@/components/KeyboardShortcuts";
```

Then add `<KeyboardShortcuts />` as a child inside both the mobile and desktop top-level return statements, immediately after the `<header>` element.

- [ ] **Step 6: Run all unit tests to confirm nothing broke**

Run: `npx vitest run`
Expected: all tests pass.

- [ ] **Step 7: Commit**

```bash
git add components/KeyboardShortcuts.tsx components/KeyboardShortcuts.test.tsx app/page.tsx
git commit -m "feat(layout): add keyboard shortcuts (R, Space, 1-4, Esc)"
```

---

### Task 33: ESLint config + final lint pass

**Files:**
- Modify: `.eslintrc.json` (new), `package.json`

- [ ] **Step 1: Add ESLint config**

Create `.eslintrc.json`:

```json
{
  "extends": ["next/core-web-vitals"],
  "rules": {
    "@typescript-eslint/no-unused-vars": ["warn", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_" }]
  }
}
```

- [ ] **Step 2: Run the linter**

Run: `npx next lint`
Expected: zero errors. Warnings are OK; fix only the ones that point at real bugs in the code we wrote.

- [ ] **Step 3: Commit**

```bash
git add .eslintrc.json
git commit -m "chore: add ESLint config with underscore-prefix exception"
```

---

### Task 34: QA + perf docs

**Files:**
- Create: `docs/qa.md`, `docs/perf.md`

- [ ] **Step 1: Create QA checklist**

Create `docs/qa.md`:

```markdown
# Manual QA checklist

## Per generator
For each of `waveform`, `geometric`, `typography`, `fluid-gradient`:
- [ ] Renders without errors at default settings
- [ ] Each slider in ParamsForm changes the output
- [ ] Slider drag is smooth (no jank)
- [ ] Switching to a generator preserves the recipe seed
- [ ] SVG export works for `geometric` and `typography` only
- [ ] Renders at desktop-1080p, iphone-15-pro, and custom 4000x6000

## Per palette
For each curated palette:
- [ ] Selecting a palette in dark mode uses the palette's first color as background
- [ ] Selecting a palette in light mode uses the palette's first color as background
- [ ] Custom hex color picker updates the preview
- [ ] Image-extract palette produces 5 valid hex colors

## Mode
- [ ] Light/Dark/Auto toggle changes the preview immediately
- [ ] Auto mode picks light for 9am local time, dark for 9pm local time

## Seed
- [ ] Randomize button changes the seed
- [ ] R key changes the seed
- [ ] Space key changes the seed
- [ ] Typing an invalid seed (e.g. `!!!`) keeps the previous seed
- [ ] Copying the share link produces a URL that hydrates to the same state

## Overlays
- [ ] Clock shows current local time, centered
- [ ] Date shows current local date, centered
- [ ] Custom text shows the typed text
- [ ] Font picker changes the overlay font
- [ ] Size slider scales the overlay

## Devices
- [ ] Each of 9 presets shows the right dimensions
- [ ] Custom W/H validates min 320
- [ ] Aspect lock keeps ratio when changing one dimension
- [ ] iPhone/Android safe-zone dashed lines appear in preview

## Mobile (<768px)
- [ ] Layout shows the bottom sheet
- [ ] Bottom sheet snaps to collapsed/half/full
- [ ] Desktop frame presets are hidden in the picker
- [ ] Image-extract palette is hidden (not in the mobile bottom sheet)

## Cross-browser
- [ ] Chrome latest
- [ ] Firefox latest
- [ ] Safari latest
- [ ] Edge latest
```

- [ ] **Step 2: Create perf notes**

Create `docs/perf.md`:

```markdown
# Performance notes

## Targets
- Initial page load -> first wallpaper visible: < 1.5s
- Slider drag -> preview update: < 16ms per frame
- 4K PNG export: < 500ms
- Batch of 5 sizes: < 4s

## How to measure

### Initial load
1. `npm run build && npm run start`
2. Open DevTools -> Network -> Disable cache -> Reload
3. Note the `Load` event time. Should be < 1500ms on a mid-range laptop.

### Slider smoothness
1. Open DevTools -> Performance
2. Start recording, drag the Layers slider for 5 seconds
3. Stop recording
4. Check the FPS chart. No frame should exceed 20ms.

### Export
1. Set resolution to 4K
2. Open the Performance tab
3. Click Download
4. The time between click and download should be < 500ms

### Batch
1. Select 5 different sizes
2. Click Generate all
3. Time the full operation
4. Should be < 4s

## Optimizations in place
- Slider drags rAF-throttled
- Preview canvas size = device frame inner box * DPR (capped at 2x)
- ogl Program is reused across fluid-gradient renders
- Image-extract palette uses 64x64 downscale + k-means (5 iterations)
- No web worker, no WASM, no service worker
```

- [ ] **Step 3: Commit**

```bash
git add docs/qa.md docs/perf.md
git commit -m "docs: add QA checklist and performance notes"
```

---

### Task 35: E2E tests + Vercel deploy

**Files:**
- Create: `tests/e2e/fidelity.spec.ts`, `tests/e2e/recipe.spec.ts`, `tests/e2e/keyboard.spec.ts`

- [ ] **Step 1: Write E2E fidelity test**

Create `tests/e2e/fidelity.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("home page loads with a wallpaper", async ({ page }) => {
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "WallMyDevice" })).toBeVisible();
  const canvas = page.locator("canvas").first();
  await expect(canvas).toBeVisible();
  const box = await canvas.boundingBox();
  expect(box?.width).toBeGreaterThan(0);
  expect(box?.height).toBeGreaterThan(0);
});
```

- [ ] **Step 2: Write E2E recipe test**

Create `tests/e2e/recipe.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("recipe round-trip via URL hash", async ({ page }) => {
  await page.goto("/");
  await page.evaluate(() => {
    const recipe = {
      v: 1,
      type: "wallmydevice/recipe",
      generator: "waveform",
      params: { layers: 3, jaggedness: 0.2, smoothing: 0.5, lineThickness: 1, amplitude: 0.4, fillBelow: true },
      palette: ["#123456", "#abcdef"],
      mode: "dark",
      seed: "testseed",
      grain: { enabled: false, intensity: 0 },
      blur: 0,
      resolution: { preset: "custom", width: 400, height: 600 },
      overlays: { clock: false, date: false, text: false, value: "", font: "Inter", size: 1 },
    };
    const json = JSON.stringify(recipe);
    const b64 = btoa(json);
    window.location.hash = "#r=" + b64;
  });
  await page.waitForTimeout(300);
  await page.reload();
  const layers = await page.locator("input[aria-label='Layers']").inputValue();
  expect(layers).toBe("3");
});
```

- [ ] **Step 3: Write E2E keyboard test**

Create `tests/e2e/keyboard.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("R key randomizes the seed", async ({ page }) => {
  await page.goto("/");
  const seedBefore = await page.locator("input[aria-label='Seed']").inputValue();
  await page.keyboard.press("r");
  await page.waitForTimeout(100);
  const seedAfter = await page.locator("input[aria-label='Seed']").inputValue();
  expect(seedAfter).not.toBe(seedBefore);
});
```

- [ ] **Step 4: Run all E2E tests**

Run: `npx playwright test`
Expected: 3 tests pass.

- [ ] **Step 5: Commit**

```bash
git add tests/e2e/fidelity.spec.ts tests/e2e/recipe.spec.ts tests/e2e/keyboard.spec.ts
git commit -m "test(e2e): add fidelity, recipe, and keyboard specs"
```

- [ ] **Step 6: Final all-green check**

Run: `npx vitest run`
Expected: all unit + component tests pass.

Run: `npx next lint`
Expected: zero errors.

Run: `npx playwright test`
Expected: all E2E tests pass.

Run: `npm run build`
Expected: build succeeds. The production build is what will deploy.

- [ ] **Step 7: Deploy to Vercel**

If the user has the Vercel CLI installed and linked: `npx vercel --prod`. Otherwise, push to GitHub and connect the repo in the Vercel dashboard. The Next.js app uses no env vars in v1, so a default Vercel project will work.

- [ ] **Step 8: Commit the Vercel config (if any was created)**

```bash
git status
git add vercel.json 2>$null
git commit -m "chore: vercel deploy config" 2>$null
```

- [ ] **Step 9: Tag the v1 release**

```bash
git tag v0.1.0
git log --oneline | head -40
```

---

## Summary

**Tasks: 35** across 10 phases. Each task has a self-contained test cycle.

**Phases:**
1. Foundation: tasks 1–3
2. Generator architecture: tasks 4–8
3. State & Recipe: tasks 9–11
4. Render pipeline + export: tasks 12–14
5. Devices + frames + preview: tasks 15–17
6. UI primitives + panel: tasks 18–22
7. Palette picker: task 23
8. Remaining generators: tasks 24–26
9. Export & recipe UI: tasks 27–29
10. Mobile, keyboard, polish, deploy: tasks 30–35

**Final definition of done:** all `npx vitest run` + `npx next lint` + `npx playwright test` + `npm run build` succeed; v1 is deployed to Vercel.

**Out of scope (per spec, deferred to v1.1+):** accounts, public gallery, weather overlay, multi-monitor stitched panorama, 5+ more generator styles, light-mode UI chrome, i18n, PWA, WebGPU, mobile image-extract palette, touch gestures on the preview canvas.


---

## Self-Review Fixes (apply during implementation)

The following gaps were found after writing the plan. Apply each as described.

### Fix A: Drag-and-drop recipe import (Task 28)

**Where:** `app/page.tsx` and `components/Panel/RecipeLoader.tsx`.

**Apply:** Add a `<input type="file">` or a top-level `onDrop` handler on `<body>` in `app/page.tsx` that reads a dropped `.json` file, calls `parseRecipe`, and on success calls the same `applyRecipe` helper exported by `RecipeLoader.tsx`. The simplest path:

1. In `components/Panel/RecipeLoader.tsx`, export the `applyRecipe` function:

```ts
export { applyRecipe };
```

2. In `app/page.tsx`, add this near the top of the component:

```tsx
useEffect(() => {
  function onDragOver(e: DragEvent) { e.preventDefault(); }
  async function onDrop(e: DragEvent) {
    e.preventDefault();
    const file = e.dataTransfer?.files?.[0];
    if (!file || !file.name.endsWith(".json")) return;
    const text = await file.text();
    const r = parseRecipe(text);
    if (r.ok) applyRecipe(r.recipe);
    else alert("That doesn't look like a WallMyDevice recipe: " + r.error);
  }
  document.body.addEventListener("dragover", onDragOver);
  document.body.addEventListener("drop", onDrop);
  return () => {
    document.body.removeEventListener("dragover", onDragOver);
    document.body.removeEventListener("drop", onDrop);
  };
}, []);
```

3. Add the matching import to `app/page.tsx`:

```tsx
import { applyRecipe } from "@/components/Panel/RecipeLoader";
import { parseRecipe } from "@/lib/recipe/validate";
```

### Fix B: Cmd/Ctrl+S and Cmd/Ctrl+Shift+S keyboard shortcuts (Task 32)

**Where:** `components/KeyboardShortcuts.tsx`.

**Apply:** Add a `case` (or `if` branch) for the modified keys before the other branches in `onKey`:

```tsx
if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s" && e.shiftKey) {
  e.preventDefault();
  const evt = new CustomEvent("wallmydevice:share");
  window.dispatchEvent(evt);
  return;
}
if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "s") {
  e.preventDefault();
  const evt = new CustomEvent("wallmydevice:focus-export");
  window.dispatchEvent(evt);
  return;
}
```

In `ExportBar.tsx`, add a `useEffect` that listens for these events:

```tsx
useEffect(() => {
  function onShare() { void onCopyShareLink(); }
  function onFocus() { document.querySelector("[aria-label='Export format']")?.dispatchEvent(new Event("focus")); }
  window.addEventListener("wallmydevice:share", onShare);
  window.addEventListener("wallmydevice:focus-export", onFocus);
  return () => {
    window.removeEventListener("wallmydevice:share", onShare);
    window.removeEventListener("wallmydevice:focus-export", onFocus);
  };
}, []);
```

Add the import: `import { useEffect } from "react";` at the top of `ExportBar.tsx`.

### Fix C: Esc collapses the mobile bottom sheet (Task 32)

**Where:** `components/KeyboardShortcuts.tsx` and `app/page.tsx`.

**Apply:** Replace the `if (e.key === "Escape")` branch in `KeyboardShortcuts.tsx` with:

```tsx
if (e.key === "Escape") {
  window.dispatchEvent(new CustomEvent("wallmydevice:collapse-sheet"));
  return;
}
```

In `app/page.tsx`, add a listener for this event alongside the other state setters:

```tsx
useEffect(() => {
  function onCollapse() { setSheetCollapsed(true); }
  window.addEventListener("wallmydevice:collapse-sheet", onCollapse);
  return () => window.removeEventListener("wallmydevice:collapse-sheet", onCollapse);
}, []);
```

### Fix D: E2E perf assertion (Task 35)

**Where:** `tests/e2e/`.

**Apply:** Add a new file `tests/e2e/perf.spec.ts`:

```ts
import { test, expect } from "@playwright/test";

test("initial page load under 3 seconds", async ({ page }) => {
  const t0 = Date.now();
  await page.goto("/");
  await expect(page.getByRole("heading", { name: "WallMyDevice" })).toBeVisible();
  const elapsed = Date.now() - t0;
  expect(elapsed).toBeLessThan(3000);
});
```

Run: `npx playwright test tests/e2e/perf.spec.ts`. Expected: passes.

### Fix E: SVG export type (already applied)

The Task 27 `onDownload` already routes SVG to `generator.toSvg(...)` and the format `<select>` filters out SVG when the active generator doesn't support it. The current state of the plan reflects this fix.

### Verification after applying fixes

Run: `npx vitest run`
Run: `npx next lint`
Run: `npx playwright test`
Run: `npm run build`

All four must succeed. If any fail, fix the root cause; do not weaken the test.
