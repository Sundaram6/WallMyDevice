import { test } from '@playwright/test';

test('capture mobile studio bottom sheet view for Phase 8', async ({ page }) => {
  // Mobile viewport: iPhone 14 / Pixel 7 form factor (390 x 844)
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/studio', { waitUntil: 'networkidle' });

  // Locate the bottom sheet element
  const bottomSheet = page.locator('[data-testid="bottom-sheet"]').first();
  await bottomSheet.waitFor({ state: 'visible' });

  // Expand the bottom sheet
  const toggleBtn = page.locator('button[aria-label="Toggle bottom sheet"]').first();
  if (await toggleBtn.isVisible()) {
    await toggleBtn.click();
    await page.waitForTimeout(600);
  }

  const screenshotPath = 'C:\\Users\\workflow\\.gemini\\antigravity\\brain\\d4cfe9d6-2847-495a-99bb-90e497305a57\\real_mobile_bottomsheet_phase8.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Successfully captured mobile BottomSheet Phase 8 screenshot to:', screenshotPath);
});
