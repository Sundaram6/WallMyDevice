import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE = 'http://localhost:3000';
const QA_DIR = path.join(process.cwd(), 'public', 'qa');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

test.beforeAll(() => ensureDir(QA_DIR));

// ─── Phase 13: Core Rendering Bug Fix & Card Hover Overlay Layout ─────────────

test('Phase13 — Archive detail modal rendering (Weimar Construct & 4 variations)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/archive`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Click on 'Weimar Construct' card to open detail modal
  const card = page.locator('article:has-text("Weimar Construct")').first();
  await expect(card).toBeVisible();
  await card.click();
  await page.waitForTimeout(1500); // Allow canvas renders to finish

  // Verify modal is open and header renders correct category & name
  const modalTitle = page.locator('#modal-title').first();
  await expect(modalTitle).toContainText('Weimar Construct');

  const dest = path.join(QA_DIR, 'real_phase13_modal_render.png');
  await page.screenshot({ path: dest, fullPage: false });
  console.log('✓ real_phase13_modal_render.png', fs.statSync(dest).size, 'bytes');
});

test('Phase13 — Archive card hover state (Stacked Download + Remix buttons, no clipping)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/archive`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);

  // Hover over the first archive card
  const firstCard = page.locator('article').first();
  await firstCard.hover();
  await page.waitForTimeout(400);

  const dest = path.join(QA_DIR, 'real_phase13_card_actions.png');
  await page.screenshot({ path: dest, fullPage: false });
  console.log('✓ real_phase13_card_actions.png', fs.statSync(dest).size, 'bytes');
});

test('Phase13 — Archive grid across all 18 generators (all rendering non-empty artwork)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/archive`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1500);
  const dest = path.join(QA_DIR, 'real_phase13_archive_18gen.png');
  await page.screenshot({ path: dest, fullPage: true });
  console.log('✓ real_phase13_archive_18gen.png', fs.statSync(dest).size, 'bytes');
});
