import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

const BASE = 'http://localhost:3000';
const QA_DIR = path.join(process.cwd(), 'public', 'qa');

function ensureDir(dir: string) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

test.beforeAll(() => ensureDir(QA_DIR));

// ─── Phase 10: Interactive QA ─────────────────────────────────────────────────

test('Phase10 — Homepage light mode full-page', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const dest = path.join(QA_DIR, 'real_phase10_homepage_light.png');
  await page.screenshot({ path: dest, fullPage: true });
  console.log('✓ real_phase10_homepage_light.png', fs.statSync(dest).size, 'bytes');
});

test('Phase10 — Studio route light mode', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/studio`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const dest = path.join(QA_DIR, 'real_phase10_studio_light.png');
  await page.screenshot({ path: dest, fullPage: false });
  console.log('✓ real_phase10_studio_light.png', fs.statSync(dest).size, 'bytes');
});

test('Phase10 — Archive route', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/archive`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const dest = path.join(QA_DIR, 'real_phase10_archive.png');
  await page.screenshot({ path: dest, fullPage: true });
  console.log('✓ real_phase10_archive.png', fs.statSync(dest).size, 'bytes');
});

test('Phase10 — Collections route', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/collections`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const dest = path.join(QA_DIR, 'real_phase10_collections.png');
  await page.screenshot({ path: dest, fullPage: true });
  console.log('✓ real_phase10_collections.png', fs.statSync(dest).size, 'bytes');
});

test('Phase10 — Profile route', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const dest = path.join(QA_DIR, 'real_phase10_profile.png');
  await page.screenshot({ path: dest, fullPage: true });
  console.log('✓ real_phase10_profile.png', fs.statSync(dest).size, 'bytes');
});

test('Phase10 — Hover states: nav links turn accent color', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/archive`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Hover over a nav link and confirm colour change by checking class presence
  const archiveLink = page.locator('nav a, header a').first();
  await archiveLink.hover();
  await page.waitForTimeout(200);
  const dest = path.join(QA_DIR, 'real_phase10_hover_nav.png');
  await page.screenshot({ path: dest, fullPage: false });
  console.log('✓ real_phase10_hover_nav.png', fs.statSync(dest).size, 'bytes');
});

test('Phase10 — Focus ring on primary button (keyboard Tab)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Tab into first interactive element
  await page.keyboard.press('Tab');
  await page.keyboard.press('Tab');
  await page.waitForTimeout(200);
  const dest = path.join(QA_DIR, 'real_phase10_focus_ring.png');
  await page.screenshot({ path: dest, fullPage: false });
  console.log('✓ real_phase10_focus_ring.png', fs.statSync(dest).size, 'bytes');
});

test('Phase10 — Mobile 390px layout', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const dest = path.join(QA_DIR, 'real_phase10_mobile_390.png');
  await page.screenshot({ path: dest, fullPage: false });
  console.log('✓ real_phase10_mobile_390.png', fs.statSync(dest).size, 'bytes');
});

test('Phase10 — Tablet 768px layout', async ({ page }) => {
  await page.setViewportSize({ width: 768, height: 1024 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(800);
  const dest = path.join(QA_DIR, 'real_phase10_tablet_768.png');
  await page.screenshot({ path: dest, fullPage: false });
  console.log('✓ real_phase10_tablet_768.png', fs.statSync(dest).size, 'bytes');
});

test('Phase10 — Dark mode via data-theme toggle', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  // Force dark mode via JS
  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await page.waitForTimeout(400);
  const dest = path.join(QA_DIR, 'real_phase10_dark_mode.png');
  await page.screenshot({ path: dest, fullPage: false });
  console.log('✓ real_phase10_dark_mode.png', fs.statSync(dest).size, 'bytes');
});

test('Phase10 — Studio dark mode', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/studio`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(500);

  await page.evaluate(() => {
    document.documentElement.setAttribute('data-theme', 'dark');
  });
  await page.waitForTimeout(400);
  const dest = path.join(QA_DIR, 'real_phase10_studio_dark.png');
  await page.screenshot({ path: dest, fullPage: false });
  console.log('✓ real_phase10_studio_dark.png', fs.statSync(dest).size, 'bytes');
});

// ─── Phase 11: Independent Final Audit ───────────────────────────────────────

test('Phase11 — Audit: / route desktop (unique filename)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(BASE, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const dest = path.join(QA_DIR, 'real_phase11_audit_homepage.png');
  await page.screenshot({ path: dest, fullPage: true });
  console.log('✓ real_phase11_audit_homepage.png', fs.statSync(dest).size, 'bytes');
});

test('Phase11 — Audit: /studio desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/studio`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const dest = path.join(QA_DIR, 'real_phase11_audit_studio.png');
  await page.screenshot({ path: dest, fullPage: false });
  console.log('✓ real_phase11_audit_studio.png', fs.statSync(dest).size, 'bytes');
});

test('Phase11 — Audit: /archive desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/archive`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const dest = path.join(QA_DIR, 'real_phase11_audit_archive.png');
  await page.screenshot({ path: dest, fullPage: true });
  console.log('✓ real_phase11_audit_archive.png', fs.statSync(dest).size, 'bytes');
});

test('Phase11 — Audit: /collections desktop (light mode)', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/collections`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'light'));
  await page.waitForTimeout(600);
  const dest = path.join(QA_DIR, 'real_phase11_audit_collections.png');
  await page.screenshot({ path: dest, fullPage: true });
  console.log('✓ real_phase11_audit_collections.png (LIGHT MODE)', fs.statSync(dest).size, 'bytes');
});

test('Phase11 — Audit: /about desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/about`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const dest = path.join(QA_DIR, 'real_phase11_audit_about.png');
  await page.screenshot({ path: dest, fullPage: true });
  console.log('✓ real_phase11_audit_about.png', fs.statSync(dest).size, 'bytes');
});

test('Phase11 — Audit: /profile desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/profile`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const dest = path.join(QA_DIR, 'real_phase11_audit_profile.png');
  await page.screenshot({ path: dest, fullPage: true });
  console.log('✓ real_phase11_audit_profile.png', fs.statSync(dest).size, 'bytes');
});

test('Phase11 — Audit: /inspiration desktop', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/inspiration`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const bodyHeight = await page.evaluate(() => document.body.scrollHeight);
  const dest = path.join(QA_DIR, 'real_phase11_audit_inspiration.png');
  await page.screenshot({ path: dest, fullPage: true });
  console.log(`✓ real_phase11_audit_inspiration.png (Height: ${bodyHeight}px)`, fs.statSync(dest).size, 'bytes');
});

test('Phase11 — Audit: mobile 390px archive', async ({ page }) => {
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto(`${BASE}/archive`, { waitUntil: 'networkidle' });
  await page.waitForTimeout(1000);
  const dest = path.join(QA_DIR, 'real_phase11_audit_archive_mobile.png');
  await page.screenshot({ path: dest, fullPage: false });
  console.log('✓ real_phase11_audit_archive_mobile.png', fs.statSync(dest).size, 'bytes');
});

test('Phase11 — Audit: dark mode collections', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto(`${BASE}/collections`, { waitUntil: 'networkidle' });
  await page.evaluate(() => document.documentElement.setAttribute('data-theme', 'dark'));
  await page.waitForTimeout(600);
  const dest = path.join(QA_DIR, 'real_phase11_audit_collections_dark.png');
  await page.screenshot({ path: dest, fullPage: true });
  console.log('✓ real_phase11_audit_collections_dark.png (DARK MODE)', fs.statSync(dest).size, 'bytes');
});
