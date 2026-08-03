import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test('capture expanded archive page', async ({ page }) => {
  await page.goto('http://localhost:3000/archive');
  await page.waitForSelector('main', { timeout: 10000 });
  await page.waitForTimeout(2000);

  const qaDir = path.join(process.cwd(), 'public', 'qa');
  if (!fs.existsSync(qaDir)) {
    fs.mkdirSync(qaDir, { recursive: true });
  }

  const archivePath = path.join(qaDir, 'real_phase13_archive_expanded.png');
  await page.screenshot({ path: archivePath, fullPage: true });
  console.log(`Captured ${archivePath}`);
});
