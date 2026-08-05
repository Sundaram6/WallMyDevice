const { chromium } = require("@playwright/test");
const path = require("path");

async function main() {
  const browser = await chromium.launch({ headless: true });
  const context = await browser.newContext({ viewport: { width: 1280, height: 800 } });
  const page = await context.newPage();

  const brainDir = "C:\\Users\\workflow\\.gemini\\antigravity\\brain\\d4cfe9d6-2847-495a-99bb-90e497305a57";

  // 1. Capture Login Modal
  await page.goto("http://localhost:3000/studio");
  await page.waitForTimeout(1000);

  const saveBtn = page.locator('[data-testid="save-wallpaper-button"]');
  await saveBtn.click();
  await page.waitForTimeout(500);

  const modalPath = path.join(brainDir, "real_login_modal.png");
  await page.screenshot({ path: modalPath, fullPage: false });
  console.log("Captured real_login_modal.png ->", modalPath);

  await page.keyboard.press("Escape");

  // 2. Perform Registration & Sign-in
  const testEmail = "artist-studio@wallmydevice.app";
  await page.goto("http://localhost:3000/signup");
  await page.fill('input[placeholder="Studio Artist"]', "Studio Master");
  await page.fill('input[placeholder="you@example.com"]', testEmail);
  await page.fill('input[placeholder="At least 6 characters"]', "Password123!");
  await page.click('button[type="submit"]');

  await page.waitForURL((url) => url.pathname === "/saved");
  await page.waitForTimeout(500);

  // 3. Save a wallpaper from Studio
  await page.goto("http://localhost:3000/studio");
  await page.waitForTimeout(1000);
  await page.click('[data-testid="save-wallpaper-button"]');
  await page.waitForTimeout(1000);

  // 4. Capture User Menu Post-Auth on /saved page (Clean & Crystal Clear)
  await page.goto("http://localhost:3000/saved");
  await page.waitForTimeout(1000);

  const userMenuBtn = page.locator('[data-testid="user-menu-button"]');
  await userMenuBtn.click();
  await page.waitForSelector('[data-testid="user-menu-dropdown"]', { state: "visible" });
  await page.waitForTimeout(500);

  const userMenuPath = path.join(brainDir, "real_user_menu_post_auth.png");
  
  // Capture header region (x: 750, y: 0, width: 530, height: 260)
  await page.screenshot({
    path: userMenuPath,
    clip: {
      x: 750,
      y: 0,
      width: 530,
      height: 260,
    },
  });
  console.log("Captured real_user_menu_post_auth.png ->", userMenuPath);

  // Close menu
  await page.mouse.click(10, 10);
  await page.waitForTimeout(300);

  // 5. Capture Saved Favorites Grid
  const favoritesGridPath = path.join(brainDir, "real_favorites_grid.png");
  await page.screenshot({ path: favoritesGridPath, fullPage: false });
  console.log("Captured real_favorites_grid.png ->", favoritesGridPath);

  await browser.close();
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
