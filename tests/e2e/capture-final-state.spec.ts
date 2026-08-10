import { test, expect } from '@playwright/test';
import path from 'path';

const QA_DIR = path.join(__dirname, '..', '..', 'qa');

test.describe('Final Screenshot Capture', () => {
  test('Capture /archive and /collections', async ({ page }) => {
    await page.goto('http://localhost:3000/archive', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(QA_DIR, 'final_archive_page.png'), fullPage: true });

    await page.goto('http://localhost:3000/collections', { waitUntil: 'networkidle' });
    await page.waitForTimeout(2000);
    await page.screenshot({ path: path.join(QA_DIR, 'final_collections_page.png'), fullPage: true });
  });
});
