import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const QA_DIR = path.join(process.cwd(), 'public', 'qa');
if (!fs.existsSync(QA_DIR)) fs.mkdirSync(QA_DIR, { recursive: true });

test.describe('Consolidated Stage Toolbar Verification', () => {

  test('1. Desktop (1440x900) - Toolbar sits above canvas in normal document flow with zero overlap', async ({ page }) => {
    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/studio?g=starfield-nebula&s=testseed99', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const toolbar = page.locator('[data-testid="stage-toolbar"]');
    await expect(toolbar).toBeVisible();

    // Verify all 9 action buttons exist in the stage toolbar
    await expect(toolbar.locator('button', { hasText: 'Back' })).toBeVisible();
    await expect(toolbar.locator('button', { hasText: 'Forward' })).toBeVisible();
    await expect(toolbar.locator('button', { hasText: 'Reset' })).toBeVisible();
    await expect(toolbar.locator('button', { hasText: 'Seed' })).toBeVisible();
    await expect(toolbar.locator('button', { hasText: 'Colors' })).toBeVisible();
    await expect(toolbar.locator('button', { hasText: 'Remix' })).toBeVisible();
    await expect(toolbar.locator('button', { hasText: 'Surprise' })).toBeVisible();
    await expect(toolbar.locator('button', { hasText: 'Link' })).toBeVisible();
    await expect(toolbar.locator('button', { hasText: 'Export' })).toBeVisible();

    // Measure bounding box of toolbar vs the rendered canvas frame container
    const toolbarBox = await toolbar.boundingBox();
    const canvasContainer = page.locator('canvas').first();
    const canvasBox = await canvasContainer.boundingBox();

    expect(toolbarBox).not.toBeNull();
    expect(canvasBox).not.toBeNull();

    if (toolbarBox && canvasBox) {
      // The canvas top must be strictly below the bottom of the stage toolbar
      expect(canvasBox.y).toBeGreaterThanOrEqual(toolbarBox.y + toolbarBox.height - 1);
    }

    await page.screenshot({ path: path.join(QA_DIR, 'real_phase15_desktop_toolbar.png') });
  });

  test('2. Tablet (768x1024) - Toolbar wraps gracefully without overlapping canvas stage', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000/studio?g=aurora-flow&s=tablettest', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const toolbar = page.locator('[data-testid="stage-toolbar"]');
    await expect(toolbar).toBeVisible();

    // Verify key buttons exist
    await expect(toolbar.locator('button', { hasText: 'Seed' })).toBeVisible();
    await expect(toolbar.locator('button', { hasText: 'Export' })).toBeVisible();

    const toolbarBox = await toolbar.boundingBox();
    const canvasContainer = page.locator('canvas').first();
    const canvasBox = await canvasContainer.boundingBox();

    expect(toolbarBox).not.toBeNull();
    expect(canvasBox).not.toBeNull();

    if (toolbarBox && canvasBox) {
      expect(canvasBox.y).toBeGreaterThanOrEqual(toolbarBox.y + toolbarBox.height - 1);
    }

    await page.screenshot({ path: path.join(QA_DIR, 'real_phase15_tablet_toolbar.png') });
  });

  test('3. Phone (375x812) - Toolbar sits above preview in reserved row with zero overlap', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000/studio?g=waveform&s=phonetest', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const toolbar = page.locator('[data-testid="stage-toolbar"]');
    await expect(toolbar).toBeVisible();

    const toolbarBox = await toolbar.boundingBox();
    const canvasContainer = page.locator('canvas').first();
    const canvasBox = await canvasContainer.boundingBox();

    expect(toolbarBox).not.toBeNull();
    expect(canvasBox).not.toBeNull();

    if (toolbarBox && canvasBox) {
      expect(canvasBox.y).toBeGreaterThanOrEqual(toolbarBox.y + toolbarBox.height - 1);
    }

    await page.screenshot({ path: path.join(QA_DIR, 'real_phase15_phone_toolbar.png') });
  });

});
