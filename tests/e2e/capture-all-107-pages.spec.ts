import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Archive Grid 107-Preset Multi-Page Visual Verification', () => {
  test('captures multi-page grid screenshots and modal renders', async ({ page }) => {
    // Navigate to archive
    await page.goto('http://localhost:3000/archive');
    await page.waitForSelector('main', { timeout: 10000 });
    await page.waitForTimeout(2000); // Allow canvas previews to render

    const qaDir = path.join(process.cwd(), 'public', 'qa');
    if (!fs.existsSync(qaDir)) {
      fs.mkdirSync(qaDir, { recursive: true });
    }

    // Page 1 Capture
    const page1Path = path.join(qaDir, 'real_phase13_archive_page1.png');
    await page.screenshot({ path: page1Path, fullPage: false });
    console.log(`Captured ${page1Path}`);

    // Click load more for Page 2
    const loadMoreBtn = page.getByRole('button', { name: /load more/i });
    if (await loadMoreBtn.isVisible()) {
      await loadMoreBtn.click();
      await page.waitForTimeout(2000);
      const page2Path = path.join(qaDir, 'real_phase13_archive_page2.png');
      await page.screenshot({ path: page2Path, fullPage: false });
      console.log(`Captured ${page2Path}`);
    }

    // Click load more for Page 3
    if (await loadMoreBtn.isVisible()) {
      await loadMoreBtn.click();
      await page.waitForTimeout(2000);
      const page3Path = path.join(qaDir, 'real_phase13_archive_page3.png');
      await page.screenshot({ path: page3Path, fullPage: false });
      console.log(`Captured ${page3Path}`);
    }

    // Click load more for Page 4
    if (await loadMoreBtn.isVisible()) {
      await loadMoreBtn.click();
      await page.waitForTimeout(2000);
      const page4Path = path.join(qaDir, 'real_phase13_archive_page4.png');
      await page.screenshot({ path: page4Path, fullPage: false });
      console.log(`Captured ${page4Path}`);
    }

    // Search and test "Acid Wash" modal
    const searchInput = page.getByPlaceholder(/search/i);
    if (await searchInput.isVisible()) {
      await searchInput.fill('Acid Wash');
      await page.waitForTimeout(1000);
      const acidCard = page.locator('text=Acid Wash').first();
      if (await acidCard.isVisible()) {
        await acidCard.click();
        await page.waitForTimeout(2000);
        const modalPath = path.join(qaDir, 'real_phase13_acid_wash_modal.png');
        await page.screenshot({ path: modalPath, fullPage: false });
        console.log(`Captured ${modalPath}`);
        // Close modal
        await page.keyboard.press('Escape');
        await page.waitForTimeout(500);
      }
    }

    // Clear search and test "Blueprint Text" modal
    if (await searchInput.isVisible()) {
      await searchInput.fill('Blueprint Text');
      await page.waitForTimeout(1000);
      const blueprintCard = page.locator('text=Blueprint Text').first();
      if (await blueprintCard.isVisible()) {
        await blueprintCard.click();
        await page.waitForTimeout(2000);
        const blueprintModalPath = path.join(qaDir, 'real_phase13_blueprint_modal.png');
        await page.screenshot({ path: blueprintModalPath, fullPage: false });
        console.log(`Captured ${blueprintModalPath}`);
      }
    }
  });
});
