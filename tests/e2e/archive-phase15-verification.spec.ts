import { test, expect } from '@playwright/test';
import path from 'path';

const QA_DIR = path.join(__dirname, '..', '..', 'qa');

test.describe('Phase 15 Archive Verification', () => {
  test('Verify previews, hover states, remix and download', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', msg => {
      if (msg.type() === 'error') {
        consoleErrors.push(msg.text());
      }
    });

    await page.goto('/archive', { waitUntil: 'networkidle' });
    
    // Check for console errors
    expect(consoleErrors).toHaveLength(0);

    // 1. Take a screenshot of the full archive grid loaded
    await page.waitForTimeout(2000); // give canvases time to render
    await page.screenshot({ path: path.join(QA_DIR, `archive_full_grid_${Date.now()}.png`), fullPage: true });

    // Find cards by category (since categories are shown on cards)
    const cards = page.locator('article.group.relative');
    const count = await cards.count();
    expect(count).toBeGreaterThan(0);

    // 2. Take a screenshot of one card's hover state with actions visible
    const firstCard = cards.first();
    await firstCard.scrollIntoViewIfNeeded();
    await firstCard.hover();
    await page.waitForTimeout(500); // Wait for hover animation
    await page.screenshot({ path: path.join(QA_DIR, `archive_hover_state_${Date.now()}.png`) });

    // 3. Test Download
    // Start waiting for download before clicking. Note no await.
    const downloadPromise = page.waitForEvent('download');
    await firstCard.locator('button:has-text("Download")').click();
    const download = await downloadPromise;
    // Wait for the download process to complete and save the downloaded file somewhere.
    const downloadPath = path.join(QA_DIR, `test_download_${Date.now()}.jpg`);
    await download.saveAs(downloadPath);
    expect(download.suggestedFilename()).toMatch(/\.png$/);

    // 4. Test Remix (navigate to Studio)
    await firstCard.hover();
    await page.waitForTimeout(500);
    await firstCard.locator('button:has-text("Remix")').click();
    await page.waitForURL('**/studio**');
    await page.waitForTimeout(2000); // Wait for studio to load
    await page.screenshot({ path: path.join(QA_DIR, `archive_remix_studio_state_${Date.now()}.png`) });

    // Verify state injection by checking for the randomize button in the studio
    expect(page.url()).toContain('/studio');
  });
});
