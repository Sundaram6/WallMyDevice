const { chromium } = require('playwright');
const fs = require('fs');

(async () => {
  const outDir = 'artifacts/ui-before';
  fs.mkdirSync(outDir, { recursive: true });

  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext();
  const page = await context.newPage();

  const url = 'http://localhost:3000';

  const viewports = [
    { name: 'desktop-1440x1000', width: 1440, height: 1000 },
    { name: 'tablet-768x1024', width: 768, height: 1024 },
    { name: 'mobile-375x812', width: 375, height: 812 },
  ];

  try {
    for (const v of viewports) {
      console.log('Capturing', v.name);
      await page.setViewportSize({ width: v.width, height: v.height });
      await page.goto(url, { waitUntil: 'networkidle' });
      // give app a moment to render
      await page.waitForTimeout(1000);
      const path = `${outDir}/${v.name}.png`;
      await page.screenshot({ path, fullPage: false });
      console.log('Saved', path);
    }
  } catch (err) {
    console.error('Screenshot capture failed', err);
    process.exitCode = 2;
  } finally {
    await browser.close();
  }
})();
