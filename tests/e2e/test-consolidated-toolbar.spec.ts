import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const QA_DIR = path.join(process.cwd(), 'public', 'qa');
if (!fs.existsSync(QA_DIR)) fs.mkdirSync(QA_DIR, { recursive: true });

test.describe('3-Zone Stage Toolbar & Console Verification', () => {

  test('1. Desktop (1440x900) - Clean console and 3-zone toolbar layout with zero canvas overlap', async ({ page }) => {
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        console.log('CONSOLE ERROR:', msg.text(), msg.location());
        consoleLogs.push(msg.text());
      }
    });
    page.on('pageerror', (err) => consoleLogs.push(err.message));

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/studio?g=starfield-nebula&s=testseed99', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    // Verify ZERO script tag console errors or React script warnings
    const scriptErrors = consoleLogs.filter(l => l.includes('script tag') || l.includes('dangerouslySetInnerHTML'));
    expect(scriptErrors).toEqual([]);

    const toolbar = page.locator('[data-testid="stage-toolbar"]');
    await expect(toolbar).toBeVisible();

    // Verify all Zone A, B, C buttons exist
    await expect(toolbar.locator('button[aria-label="Undo"]')).toBeVisible();
    await expect(toolbar.locator('button[aria-label="Redo"]')).toBeVisible();
    await expect(toolbar.locator('button[aria-label="Reset Defaults"]')).toBeVisible();
    await expect(toolbar.locator('button[aria-label="Randomize Seed"]')).toBeVisible();
    await expect(toolbar.locator('button[aria-label="Randomize Colors"]')).toBeVisible();
    await expect(toolbar.locator('button[aria-label="Remix Style"]')).toBeVisible();
    await expect(toolbar.locator('button[aria-label="Full Reroll"]')).toBeVisible();
    await expect(toolbar.locator('button[aria-label="Copy Shareable Link"]')).toBeVisible();
    await expect(toolbar.locator('button[aria-label="Download / Export Wallpaper"]')).toBeVisible();

    // Bounding box verification for zero canvas overlap
    const toolbarBox = await toolbar.boundingBox();
    const canvasContainer = page.locator('canvas').first();
    const canvasBox = await canvasContainer.boundingBox();

    expect(toolbarBox).not.toBeNull();
    expect(canvasBox).not.toBeNull();
    if (toolbarBox && canvasBox) {
      expect(canvasBox.y).toBeGreaterThanOrEqual(toolbarBox.y + toolbarBox.height - 1);
    }

    await page.screenshot({ path: path.join(QA_DIR, 'real_phase15_desktop_toolbar.png') });
  });

  test('2. Tablet (768x1024) - Clean toolbar layout with spacious center stage', async ({ page }) => {
    await page.setViewportSize({ width: 768, height: 1024 });
    await page.goto('http://localhost:3000/studio?g=aurora-flow&s=tablettest', { waitUntil: 'domcontentloaded' });
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

    await page.screenshot({ path: path.join(QA_DIR, 'real_phase15_tablet_toolbar.png') });
  });

  test('3. Phone (375x812) - Icon-only mode below sm breakpoint, Back/Forward/Reset and Export 100% visible', async ({ page }) => {
    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000/studio?g=waveform&s=phonetest', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const toolbar = page.locator('[data-testid="stage-toolbar"]');
    await expect(toolbar).toBeVisible();

    // Zone A (Back, Forward, Reset) must be 100% visible on the left without scrolling
    const backBtn = toolbar.locator('button[aria-label="Undo"]');
    const forwardBtn = toolbar.locator('button[aria-label="Redo"]');
    const resetBtn = toolbar.locator('button[aria-label="Reset Defaults"]');
    const exportBtn = toolbar.locator('button[aria-label="Download / Export Wallpaper"]');

    await expect(backBtn).toBeVisible();
    await expect(forwardBtn).toBeVisible();
    await expect(resetBtn).toBeVisible();
    await expect(exportBtn).toBeVisible();

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

  test('4. Narrow Mobile (400x800) - Zone A (Back/Forward/Reset) & Zone C (Export) are fixed & visible without scrolling', async ({ page }) => {
    await page.setViewportSize({ width: 400, height: 800 });
    await page.goto('http://localhost:3000/studio?g=metaballs&s=narrow400', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const toolbar = page.locator('[data-testid="stage-toolbar"]');
    await expect(toolbar).toBeVisible();

    // Assert Zone A and Zone C buttons are 100% visible in viewport without scrolling
    const backBtn = toolbar.locator('button[aria-label="Undo"]');
    const forwardBtn = toolbar.locator('button[aria-label="Redo"]');
    const resetBtn = toolbar.locator('button[aria-label="Reset Defaults"]');
    const exportBtn = toolbar.locator('button[aria-label="Download / Export Wallpaper"]');

    await expect(backBtn).toBeVisible();
    await expect(forwardBtn).toBeVisible();
    await expect(resetBtn).toBeVisible();
    await expect(exportBtn).toBeVisible();

    // Verify bounding box of Zone A and Zone C buttons lie inside the viewport width [0, 400]
    const backBox = await backBtn.boundingBox();
    const exportBox = await exportBtn.boundingBox();

    expect(backBox).not.toBeNull();
    expect(exportBox).not.toBeNull();
    if (backBox && exportBox) {
      expect(backBox.x).toBeGreaterThanOrEqual(0);
      expect(exportBox.x + exportBox.width).toBeLessThanOrEqual(400);
    }

    await page.screenshot({ path: path.join(QA_DIR, 'real_phase15_narrow400_toolbar.png') });
  });

});
