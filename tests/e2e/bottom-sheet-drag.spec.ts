// Playwright drag-recording test for BottomSheet 3.0
//
// Records a continuous drag gesture: Peek -> Control -> Full -> Control -> Peek
// at both 390x844 and 412x915 viewports.
//
// Run with:
//   npx.cmd playwright test tests/e2e/bottom-sheet-drag.spec.ts --project=chromium
//
// Videos are saved to test-results/bottom-sheet-drag-{viewport}/

import { test, expect } from "@playwright/test";
import path from "path";

const VIEWPORTS = [
  { width: 390, height: 844, label: "390x844" },
  { width: 412, height: 915, label: "412x915" },
];

// Helper: smooth drag from one Y to another on a given element
async function smoothDrag(
  page: import("@playwright/test").Page,
  selector: string,
  fromY: number,
  toY: number,
  steps = 30,
) {
  const el = page.locator(selector);
  const box = await el.boundingBox();
  if (!box) throw new Error(`Element not found: ${selector}`);

  const x = box.x + box.width / 2;
  await page.mouse.move(x, fromY);
  await page.mouse.down();
  const dy = (toY - fromY) / steps;
  for (let i = 1; i <= steps; i++) {
    await page.mouse.move(x, fromY + dy * i, { steps: 1 });
    await page.waitForTimeout(16); // ~60fps
  }
  await page.mouse.up();
  // Wait for spring snap animation to settle
  await page.waitForTimeout(600);
}

for (const vp of VIEWPORTS) {
  test(`BottomSheet drag Peek→Control→Full→Control→Peek @ ${vp.label}`, async ({
    browser,
  }) => {
    const context = await browser.newContext({
      viewport: { width: vp.width, height: vp.height },
      recordVideo: {
        dir: path.join("test-results", `bottom-sheet-drag-${vp.label}`),
        size: { width: vp.width, height: vp.height },
      },
    });
    const page = await context.newPage();
    await page.goto("http://localhost:3000/studio");
    // Wait for the sheet to mount
    await page.waitForSelector('[data-testid="bottom-sheet"]', { timeout: 10000 });

    const sheet = page.locator('[data-testid="bottom-sheet"]');

    // ── 1. Initial state: Peek ───────────────────────────────────────
    await expect(sheet).toHaveAttribute("data-snap", "peek");

    // Screenshot: Peek
    await page.screenshot({
      path: path.join("test-results", `bottom-sheet-drag-${vp.label}`, "01-peek.png"),
    });

    // ── 2. Drag up to Control (~40dvh) ────────────────────────────────
    // Drag from handle upward by ~vh*0.35 pixels
    const peekBottom = vp.height; // bottom of viewport
    const peekHandleY = vp.height - 36; // approx centre of handle at peek
    const controlY = vp.height - Math.round(vp.height * 0.40) + 36;

    await smoothDrag(page, '[data-testid="sheet-handle"]', peekHandleY, controlY);
    await expect(sheet).toHaveAttribute("data-snap", "control");

    await page.screenshot({
      path: path.join("test-results", `bottom-sheet-drag-${vp.label}`, "02-control.png"),
    });

    // ── 3. Drag up to Full ────────────────────────────────────────────
    const fullY = Math.round(vp.height * 0.10);
    await smoothDrag(page, '[data-testid="sheet-handle"]', controlY, fullY);
    await expect(sheet).toHaveAttribute("data-snap", "full");

    await page.screenshot({
      path: path.join("test-results", `bottom-sheet-drag-${vp.label}`, "03-full.png"),
    });

    // ── 4. Swipe-down from Full → should land at Control (not Peek) ───
    const fullHandleY = Math.round(vp.height * 0.14) + 36;
    await smoothDrag(page, '[data-testid="sheet-handle"]', fullHandleY, vp.height - Math.round(vp.height * 0.35));
    await expect(sheet).toHaveAttribute("data-snap", "control");

    await page.screenshot({
      path: path.join("test-results", `bottom-sheet-drag-${vp.label}`, "04-control-again.png"),
    });

    // ── 5. Drag down to Peek ──────────────────────────────────────────
    const controlHandleY = vp.height - Math.round(vp.height * 0.40) + 36;
    await smoothDrag(page, '[data-testid="sheet-handle"]', controlHandleY, vp.height - 36);
    await expect(sheet).toHaveAttribute("data-snap", "peek");

    await page.screenshot({
      path: path.join("test-results", `bottom-sheet-drag-${vp.label}`, "05-peek-again.png"),
    });

    await context.close();
    // Note: video is saved automatically when context closes.
  });
}
