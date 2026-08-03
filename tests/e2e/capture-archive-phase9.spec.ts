import { test } from '@playwright/test';
import fs from 'fs';
import path from 'path';

test('capture desktop archive view and collections view for Phase 9', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });

  // 1. Archive Page Capture
  await page.goto('http://localhost:3000/archive', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const publicQaDir = path.join(process.cwd(), 'public', 'qa');
  if (!fs.existsSync(publicQaDir)) fs.mkdirSync(publicQaDir, { recursive: true });

  const archiveDest = path.join(publicQaDir, 'real_archive_phase9.png');
  await page.screenshot({ path: archiveDest, fullPage: false });
  console.log('Saved Archive Phase 9 screenshot to:', archiveDest);

  // 2. Collections Page Capture
  await page.goto('http://localhost:3000/collections', { waitUntil: 'networkidle' });
  await page.waitForTimeout(600);

  const collectionsDest = path.join(publicQaDir, 'real_collections_phase9.png');
  await page.screenshot({ path: collectionsDest, fullPage: false });
  console.log('Saved Collections Phase 9 screenshot to:', collectionsDest);
});
