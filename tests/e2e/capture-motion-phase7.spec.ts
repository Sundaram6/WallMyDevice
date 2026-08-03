import { test } from '@playwright/test';

test('capture 3D tilt motion state on stage in studio for Phase 7', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/studio', { waitUntil: 'networkidle' });

  const stage = page.locator('main[data-theme="stage"]').first();
  await stage.waitFor({ state: 'visible' });

  // Move cursor near top-right corner of stage to trigger 3D perspective tilt
  const box = await stage.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width * 0.8, box.y + box.height * 0.2);
    await page.waitForTimeout(400);
  }

  const screenshotPath = 'C:\\Users\\workflow\\.gemini\\antigravity\\brain\\d4cfe9d6-2847-495a-99bb-90e497305a57\\real_studio_motion_phase7.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Successfully captured Phase 7 motion & 3D tilt screenshot to:', screenshotPath);
});
