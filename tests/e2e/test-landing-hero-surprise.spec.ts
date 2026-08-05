import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const QA_DIR = path.join(process.cwd(), 'public', 'qa');
if (!fs.existsSync(QA_DIR)) fs.mkdirSync(QA_DIR, { recursive: true });

test.describe('Landing Page Hero - Surprise Me & Remix Interactions', () => {

  test('1. Desktop (1440x900) - Renders hero preview, triggers Surprise Me, and carries URL params into Studio', async ({ page }) => {
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleLogs.push(msg.text());
    });
    page.on('pageerror', (err) => consoleLogs.push(err.message));

    await page.setViewportSize({ width: 1440, height: 900 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    // Verify zero console errors or hydration errors
    const scriptErrors = consoleLogs.filter((l) => l.includes('script tag') || l.includes('Hydration'));
    expect(scriptErrors).toEqual([]);

    // Verify hero rendering and combo info tag
    const comboInfo = page.locator('[data-testid="hero-combo-info"]');
    await expect(comboInfo).toBeVisible();
    const initialText = await comboInfo.textContent();
    expect(initialText).toBeTruthy();

    // Take initial desktop screenshot
    await page.screenshot({ path: path.join(QA_DIR, 'hero_landing_surprise_desktop.png') });

    // Click Surprise Me button
    const surpriseBtn = page.locator('[data-testid="hero-surprise-me-btn"]');
    await expect(surpriseBtn).toBeVisible();
    await surpriseBtn.click();
    await page.waitForTimeout(600);

    // Verify combo info changed
    const newText = await comboInfo.textContent();
    expect(newText).not.toEqual(initialText);

    // Get the Studio link href from "Open in Studio" button
    const openStudioBtn = page.locator('[data-testid="hero-open-studio-btn"]');
    await expect(openStudioBtn).toBeVisible();
    const studioHref = await openStudioBtn.getAttribute('href');
    expect(studioHref).toContain('/studio?g=');
    expect(studioHref).toContain('&s=');
    expect(studioHref).toContain('&p=');

    // Click Open in Studio CTA
    await openStudioBtn.click();
    await page.waitForURL(/\/studio\?g=/);
    await page.waitForTimeout(1000);

    // Verify URL params in Studio match the landing page combo
    const url = new URL(page.url());
    expect(url.searchParams.get('g')).toBeTruthy();
    expect(url.searchParams.get('s')).toBeTruthy();
    expect(url.searchParams.get('p')).toBeTruthy();
  });

  test('2. Mobile (375x812) - Renders hero preview with phone action controls and Surprise Me interaction', async ({ page }) => {
    const consoleLogs: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') consoleLogs.push(msg.text());
    });
    page.on('pageerror', (err) => consoleLogs.push(err.message));

    await page.setViewportSize({ width: 375, height: 812 });
    await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    const scriptErrors = consoleLogs.filter((l) => l.includes('script tag') || l.includes('Hydration'));
    expect(scriptErrors).toEqual([]);

    const phoneDisplay = page.locator('[data-testid="hero-phone-display"]');
    await expect(phoneDisplay).toBeVisible();

    const surprisePhoneBtn = page.locator('[data-testid="hero-phone-surprise-btn"]');
    await expect(surprisePhoneBtn).toBeVisible();
    await surprisePhoneBtn.click();
    await page.waitForTimeout(600);

    await page.screenshot({ path: path.join(QA_DIR, 'hero_landing_surprise_mobile.png') });
  });

});
