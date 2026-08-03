import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const QA_DIR = path.join(process.cwd(), 'public', 'qa');
if (!fs.existsSync(QA_DIR)) fs.mkdirSync(QA_DIR, { recursive: true });

test.use({ viewport: { width: 1440, height: 900 } });

test('debug: verify all thumbnail data URLs are present', async ({ page }) => {
  // Add console monitoring
  const consoleMessages: string[] = [];
  page.on('console', msg => { if (msg.type() !== 'error') consoleMessages.push(msg.text()); });
  page.on('pageerror', err => consoleMessages.push('PAGEERROR: ' + err.message));

  await page.goto('http://localhost:3000/studio', { waitUntil: 'networkidle', timeout: 20000 });
  
  const genTab = page.getByRole('tab', { name: /generators/i }).first();
  if (await genTab.isVisible()) await genTab.click();
  
  // Wait for thumbnails
  await page.waitForTimeout(8000);

  // Check via DOM: look for background-image style on thumbnail divs
  const thumbnailInfo = await page.evaluate(() => {
    const cards = document.querySelectorAll('[id^="gen-picker-"]');
    const info: Record<string, string> = {};
    cards.forEach((card) => {
      const id = card.id.replace('gen-picker-', '');
      const thumbDiv = card.querySelector('[style*="background-image"]') as HTMLElement | null;
      const bgImage = thumbDiv?.style?.backgroundImage ?? 'MISSING';
      info[id] = bgImage.startsWith('url(') ? `HAS_THUMB (${bgImage.length}chars)` : bgImage.substring(0, 60);
    });
    return info;
  });
  
  console.log('Thumbnail info:', JSON.stringify(thumbnailInfo, null, 2));
  
  // Write debug info to QA dir
  fs.writeFileSync(path.join(QA_DIR, 'thumbnail_debug.json'), JSON.stringify(thumbnailInfo, null, 2));
  
  // Take final screenshot
  await page.screenshot({ path: path.join(QA_DIR, 'real_gen_picker_debug.png'), fullPage: false });
});
