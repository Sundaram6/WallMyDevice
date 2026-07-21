# WallMyDevice Deep System Scan

## Executive Summary

This report documents the deep-scan and discovery audit for WallMyDevice v0.1.0 (commit `572db3ed6710e0f1be160c5f1763251849884e96`). The application was verified both structurally and behaviorally. While the unit/integration and Playwright test suites are nominally passing and the production build succeeds, several deep-seated architectural flaws, defects, security vulnerabilities, and state-management risks exist.

## Phase 1: Environment Integrity & Repository State

- **Environment:** Node v24.17.0
- **Git State:** Clean working tree on `main` branch.
- **Annotated Tag:** `v0.1.0` remains attached to `572db3e`.
- **Production Branch:** Verified that the GitHub default and Vercel production branch are both `main`.

## Phase 2: Dependency & Security Profile

- **Dependency Mismatches:** `.npmrc` relies on `legacy-peer-deps=true` due to internal dependency conflicts. This is a fragile constraint that disables critical peer-dependency validations across the project.
- **Outdated Packages:** Several crucial dependencies are out of date, including `next`, `typescript`, `playwright/test`, `vitest`, `zod`, and `zustand`.
- **Security Vulnerabilities:** An `npm audit` returned 17 vulnerabilities (3 moderate, 12 high, 2 critical). Of significant note are the critical Next.js cache poisoning vulnerabilities and high severity ReDoS vulnerabilities in glob and minimatch used in dev dependencies.

## Phase 3: Baseline Execution Audit

The following verification steps successfully executed against the codebase baseline without direct errors:
- `npm ci` completed.
- `npm run lint` reported zero critical failures, though raised several unused variable warnings (`@typescript-eslint/no-unused-vars` in `app/page.tsx`, `components/DropZone.test.tsx`, `components/Panel/PalettePicker.tsx`, and `lib/render/renderToTarget.test.ts`).
- `npx tsc --noEmit` found no type errors.
- `npm run test` (Vitest) successfully passed 128 tests in 38 test files.
- `npm run test:e2e` (Playwright) passed 4 core browser tests.
- `npm run build` generated the production output without unhandled rejection.

## Phase 4: Test Coverage Map

- **Unit/Integration Testing Coverage:** High across utility functions, recipe logic, render utilities, and individual generators (`fluid-gradient`, `geometric`, `typography`, `waveform`). Some components (`PanelControls`, `RecipeLoader`, `DropZone`) are well-tested.
- **E2E Coverage:** Lightly covered. E2E covers only the baseline smoke test, recipe round-trip, keyboard shortcuts, and fidelity loading. Complex drag/drop or canvas interactivity is unverified at the E2E level.
- **Untested Surfaces:**
  - Configurations (`next.config.js`, `playwright.config.ts`, `tailwind.config.ts`).
  - Next.js root layout and pages (`app/layout.tsx`, `app/page.tsx`).
  - Browser-level storage persistence (local storage logic is untested).

## Phase 5: Architecture Audit

- **Global Mutability Risk:** `lib/generators/registry.ts` exposes `_registry` as a mutable export object, allowing unchecked overriding of generators at runtime.
- **Store Initialization Race Condition:** In `store/useEditorStore.ts`, the default `params` for `waveform` relies on `getDefaultParams("waveform")`. However, because `ensureRegistered()` is only called on the client inside `app/page.tsx`'s `useEffect`, the initial static store evaluates before registration occurs, leading to `params.waveform` defaulting to an empty object `{}` on initial load until modified by the user.

## Phase 6: Performance & Bundle Profile

- **Initial Load Size:** The root `/` route produces an initial JS payload of ~179 kB (with ~91.7 kB page chunk). This is highly performant and well within acceptable thresholds.
- **Static vs Server:** The application is entirely statically prerendered (`○`), meeting the static export expectation.

## Phase 7: Determinism & Purity Audit

- **PRNG Purity:** Most generators correctly rely on the seeded PRNG, adhering to pure deterministic requirements.
- **Determinism Violation (Defect):** The `fluid-gradient` generator internally relies on `performance.now() / 1000` to set the `uTime` uniform. This breaks determinism entirely, causing unpredictable variations between preview frames and exported images, and rendering the "seed" partially useless for this generator.

## Phase 8: Component State Analysis

- **Animation Loop Defect:** `PreviewCanvas.tsx` syncs the WebGL/Canvas rendering via `useEditorStore.subscribe`. It only triggers a `requestAnimationFrame` when the Zustand store updates (e.g. dragging a slider). Because of this, time-based animations (like the buggy `fluid-gradient` `uTime` parameter) freeze as soon as the user stops interacting with the UI. There is no continuous render loop.

## Discovered Defects

1. **[Critical] Determinism Violation in Fluid Gradient:** `fluid-gradient/index.ts` uses `performance.now() / 1000` for `uTime`, resulting in non-deterministic image output.
2. **[High] Initial Store Parameter Drop:** `useEditorStore.ts` calls `getDefaultParams` before generator registration completes, assigning `{}` instead of the actual generator defaults on initial hydration.
3. **[High] Stalled Animations / Incomplete Render Loop:** `PreviewCanvas` only redraws on store changes, causing shader animations to "freeze" unless the user interacts.
4. **[Moderate] Unused Variables Warning:** Linting exposes unused variables in critical paths like `app/page.tsx` (`getDefaultParams`) and `renderToTarget.test.ts`.
5. **[Moderate] Security vulnerabilities & out-of-date core dependencies.**
6. **[Low] Mutable Generator Registry:** `lib/generators/registry.ts` exposes `_registry` unsafely.
