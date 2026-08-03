import { test, expect } from '@playwright/test';

test('capture phone device frame in studio', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/studio', { waitUntil: 'networkidle' });

  // Select 'phone' category by clicking phone button in resolution picker
  const phoneBtn = page.locator('button:has-text("phone")').first();
  if (await phoneBtn.isVisible()) {
    await phoneBtn.click();
    await page.waitForTimeout(600);
  }

  // Click 'Aurora' or 'Fluid Gradient' generator card to get fresh wallpaper artwork
  const auroraCard = page.locator('button:has-text("Aurora")').first();
  if (await auroraCard.isVisible()) {
    await auroraCard.click();
    await page.waitForTimeout(1000);
  }

  const screenshotPath = 'C:\\Users\\workflow\\.gemini\\antigravity\\brain\\d4cfe9d6-2847-495a-99bb-90e497305a57\\real_studio_phone_frame_phase4.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Successfully captured Phone device frame screenshot to:', screenshotPath);
});
