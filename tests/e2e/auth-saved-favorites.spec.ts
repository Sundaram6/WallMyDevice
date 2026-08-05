import { test, expect } from "@playwright/test";

test.describe("Phase: Accounts & Saved Favorites E2E", () => {
  const testUser = {
    name: "Playwright Artist",
    email: `playwright-${Date.now()}@wallmydevice.app`,
    password: "TestPassword123!",
  };

  test("1. Unmocked Credentials Registration, Login, Save Wallpaper, Reload Persistence & Delete", async ({ page }) => {
    // Step 1: Sign up new user
    await page.goto("/signup");
    await page.fill('input[placeholder="Studio Artist"]', testUser.name);
    await page.fill('input[placeholder="you@example.com"]', testUser.email);
    await page.fill('input[placeholder="At least 6 characters"]', testUser.password);
    await page.click('button[type="submit"]');

    // Wait for redirect to /saved post-auth
    await page.waitForURL((url) => url.pathname === "/saved", { timeout: 15000 });
    expect(page.url()).toContain("/saved");

    // Step 2: Navigate to Studio
    await page.goto("/studio");

    // Click Save button in Studio Contextual Toolbar
    const saveButton = page.locator('[data-testid="save-wallpaper-button"]');
    await expect(saveButton).toBeVisible();
    await saveButton.click();

    // Verify Save button changes state to Saved
    await expect(saveButton).toContainText("Saved");

    // Step 3: Reload Studio page and verify persistent saved state
    await page.reload();
    await expect(page.locator('[data-testid="save-wallpaper-button"]')).toContainText("Saved");

    // Step 4: Navigate to /saved page
    await page.goto("/saved");
    await expect(page.locator('[data-testid="saved-grid"]')).toBeVisible();

    const savedCard = page.locator('[data-testid="saved-wallpaper-card"]').first();
    await expect(savedCard).toBeVisible();

    // Step 5: Remove saved wallpaper
    const removeBtn = savedCard.locator('[data-testid="remove-saved-button"]');
    await removeBtn.click();

    // Verify card is removed
    await expect(page.locator('[data-testid="saved-wallpaper-card"]')).toHaveCount(0);
  });

  test("2. Google OAuth Session Mocking Callback Test", async ({ page, context }) => {
    // Set NextAuth session cookie for Google user mock
    const googleUser = {
      name: "Google OAuth Test User",
      email: "google-test-user@wallmydevice.app",
      image: undefined,
    };

    // Intercept /api/auth/session to simulate active Google OAuth session
    await page.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: googleUser,
          expires: new Date(Date.now() + 86400000).toISOString(),
        }),
      });
    });

    // Intercept /api/favorites GET & POST
    await page.route("**/api/favorites*", async (route) => {
      if (route.request().method() === "GET") {
        await route.fulfill({
          status: 200,
          contentType: "application/json",
          body: JSON.stringify([
            {
              id: "fav-google-1",
              userId: "google-user-1",
              title: "starfield-nebula (seed123)",
              recipe: {
                generatorId: "starfield-nebula",
                seed: "seed123",
                palette: ["#000000", "#1e1b4b", "#4c1d95", "#db2777"],
                params: {},
              },
              deviceType: "phone",
              createdAt: new Date().toISOString(),
            },
          ]),
        });
      } else {
        await route.continue();
      }
    });

    await page.goto("/saved");

    // Verify User Menu shows Google User initials
    const userMenuBtn = page.locator('[data-testid="user-menu-button"]');
    await expect(userMenuBtn).toBeVisible();
    await expect(userMenuBtn).toContainText("GO");

    // Verify Saved Wallpapers grid displays the favorite card
    await expect(page.locator('[data-testid="saved-grid"]')).toBeVisible();
    await expect(page.locator('[data-testid="saved-wallpaper-card"]')).toHaveCount(1);
  });
});
