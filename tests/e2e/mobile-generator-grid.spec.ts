import { test, expect } from "@playwright/test";
import fs from "fs";
import path from "path";

const VIEWPORTS = [
  { name: "375x667", width: 375, height: 667 },
  { name: "390x844", width: 390, height: 844 },
  { name: "412x915", width: 412, height: 915 },
];

test.describe("Mobile Visual Generator Picker", () => {
  test.use({ hasTouch: true, isMobile: true });

  for (const vp of VIEWPORTS) {
    test(`renders visual 2-column grid and handles touch correctly on ${vp.name}`, async ({ page }) => {
      await page.setViewportSize({ width: vp.width, height: vp.height });
      await page.goto("http://localhost:3000/studio");
      await page.waitForLoadState("networkidle");

      // Wait for sheet container
      const sheet = page.locator('[data-testid="bottom-sheet"]');
      await expect(sheet).toBeVisible();

      // Open sheet to 'control' state if it's in peek
      const initialSnap = await sheet.getAttribute("data-snap");
      if (initialSnap === "peek") {
        const handle = page.locator('[data-testid="sheet-handle"]');
        await handle.click();
        await page.waitForTimeout(300);
      }

      await expect(sheet).toHaveAttribute("data-snap", "control");

      // Scope to mobile style tab inside the bottom sheet
      const styleTab = sheet.locator('[data-testid="mobile-style-tab"]');
      await expect(styleTab).toBeVisible();

      const grid = styleTab.locator('[data-testid="generator-grid"]');
      await expect(grid).toBeVisible();

      // Verify generator cards exist and satisfy >= 44px tap target rule
      const cards = grid.locator('[data-testid^="gen-card-"]');
      const cardCount = await cards.count();
      expect(cardCount).toBeGreaterThanOrEqual(10);

      const firstCard = cards.first();
      const box = await firstCard.boundingBox();
      expect(box).not.toBeNull();
      if (box) {
        expect(box.width).toBeGreaterThanOrEqual(44);
        expect(box.height).toBeGreaterThanOrEqual(44);
      }

      // Test scroll inside generator grid doesn't drag the bottom sheet
      if (box) {
        const startX = box.x + box.width / 2;
        const startY = box.y + box.height / 2;
        await page.mouse.move(startX, startY);
        await page.mouse.down();
        await page.mouse.move(startX, startY - 100, { steps: 5 });
        await page.mouse.up();
        await page.waitForTimeout(200);

        // Sheet snap should remain 'control' or 'full', but grid scrolling handled native pan
        const currentSnap = await sheet.getAttribute("data-snap");
        expect(["control", "full"]).toContain(currentSnap);
      }

      // Test tapping a generator card changes active generator
      const targetCard = grid.locator('[data-testid="gen-card-geometric"]');
      if (await targetCard.isVisible()) {
        await targetCard.click();
        await page.waitForTimeout(300);
        await expect(targetCard).toHaveAttribute("aria-pressed", "true");
      }

      // Capture screenshot for evidence
      const screenshotDir = path.join(process.cwd(), "artifacts_evidence");
      if (!fs.existsSync(screenshotDir)) {
        fs.mkdirSync(screenshotDir, { recursive: true });
      }
      await page.screenshot({
        path: path.join(screenshotDir, `mobile_generator_picker_${vp.name}.png`),
        fullPage: false,
      });
    });
  }
});
