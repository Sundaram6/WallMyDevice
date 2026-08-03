import { test } from '@playwright/test';

test('capture tight crop of right sidebar in studio for Phase 6', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/studio', { waitUntil: 'networkidle' });

  // Locate the right sidebar (the second aside element in Studio layout)
  const rightSidebar = page.locator('aside').nth(1);
  await rightSidebar.waitFor({ state: 'visible' });
  await page.waitForTimeout(600);

  const screenshotPath = 'C:\\Users\\workflow\\.gemini\\antigravity\\brain\\d4cfe9d6-2847-495a-99bb-90e497305a57\\real_studio_inspector_phase6.png';
  await rightSidebar.screenshot({ path: screenshotPath });
  console.log('Successfully captured tight RightSidebar Phase 6 screenshot to:', screenshotPath);
});
