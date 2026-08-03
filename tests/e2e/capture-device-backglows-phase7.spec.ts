import { test } from '@playwright/test';

test('capture backglow across all four device types in studio', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/studio', { waitUntil: 'networkidle' });

  // 1. Phone Frame Capture
  const phoneBtn = page.locator('button:has-text("Phone")').first();
  if (await phoneBtn.isVisible()) {
    await phoneBtn.click();
    await page.waitForTimeout(600);
  }
  const phoneTarget = page.locator('main[data-theme="stage"]').first();
  await phoneTarget.screenshot({ path: 'C:\\Users\\workflow\\.gemini\\antigravity\\brain\\d4cfe9d6-2847-495a-99bb-90e497305a57\\real_backglow_phone_phase7.png' });

  // 2. Tablet Frame Capture
  const tabletBtn = page.locator('button:has-text("Tablet")').first();
  if (await tabletBtn.isVisible()) {
    await tabletBtn.click();
    await page.waitForTimeout(600);
  }
  await phoneTarget.screenshot({ path: 'C:\\Users\\workflow\\.gemini\\antigravity\\brain\\d4cfe9d6-2847-495a-99bb-90e497305a57\\real_backglow_tablet_phase7.png' });

  // 3. Desktop Frame Capture
  const desktopBtn = page.locator('button:has-text("Desktop")').first();
  if (await desktopBtn.isVisible()) {
    await desktopBtn.click();
    await page.waitForTimeout(600);
  }
  await phoneTarget.screenshot({ path: 'C:\\Users\\workflow\\.gemini\\antigravity\\brain\\d4cfe9d6-2847-495a-99bb-90e497305a57\\real_backglow_desktop_phase7.png' });

  // 4. Custom Frame Capture
  const customBtn = page.locator('button:has-text("Custom")').first();
  if (await customBtn.isVisible()) {
    await customBtn.click();
    await page.waitForTimeout(600);
  }
  await phoneTarget.screenshot({ path: 'C:\\Users\\workflow\\.gemini\\antigravity\\brain\\d4cfe9d6-2847-495a-99bb-90e497305a57\\real_backglow_custom_phase7.png' });

  console.log('Successfully captured backglow across all four device types!');
});
