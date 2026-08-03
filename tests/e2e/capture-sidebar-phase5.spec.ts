import { test } from '@playwright/test';

test('capture tight crop of left sidebar in studio for Phase 5', async ({ page }) => {
  await page.setViewportSize({ width: 1440, height: 900 });
  await page.goto('http://localhost:3000/studio', { waitUntil: 'networkidle' });

  // Wait for sidebar and generator cards to be visible
  const sidebar = page.locator('aside').first();
  await sidebar.waitFor({ state: 'visible' });
  await page.waitForTimeout(600);

  // Capture tight crop of the LeftSidebar element specifically
  const screenshotPath = 'C:\\Users\\workflow\\.gemini\\antigravity\\brain\\d4cfe9d6-2847-495a-99bb-90e497305a57\\real_studio_sidebar_phase5.png';
  await sidebar.screenshot({ path: screenshotPath });
  console.log('Successfully captured tight LeftSidebar Phase 5 screenshot to:', screenshotPath);
});
