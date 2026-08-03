import { test, expect } from '@playwright/test';

test('verify bottom sheet computed styles and capture screenshot', async ({ page }) => {
  // Set mobile viewport
  await page.setViewportSize({ width: 390, height: 844 });
  await page.goto('http://localhost:3000/studio', { waitUntil: 'networkidle' });

  // Locate bottom sheet
  const sheet = page.locator('[data-testid="bottom-sheet"]').first();
  await sheet.waitFor({ state: 'visible' });

  // Expand bottom sheet
  const toggleBtn = page.locator('button[aria-label="Toggle bottom sheet"]').first();
  if (await toggleBtn.isVisible()) {
    await toggleBtn.click();
    await page.waitForTimeout(600);
  }

  // Evaluate computed styles directly from browser DOM
  const computedStyles = await sheet.evaluate((el) => {
    const s = window.getComputedStyle(el);
    return {
      backgroundColor: s.backgroundColor,
      borderColor: s.borderColor,
      borderTopColor: s.borderTopColor,
      color: s.color,
    };
  });

  console.log('--- COMPUTED STYLES FOR BOTTOM SHEET ---');
  console.log(JSON.stringify(computedStyles, null, 2));

  // Take screenshot
  const screenshotPath = 'C:\\Users\\workflow\\.gemini\antigravity\\brain\\d4cfe9d6-2847-495a-99bb-90e497305a57\\real_mobile_bottomsheet_phase8.png';
  await page.screenshot({ path: screenshotPath, fullPage: false });
  console.log('Saved Phase 8 resubmitted screenshot to:', screenshotPath);
});
