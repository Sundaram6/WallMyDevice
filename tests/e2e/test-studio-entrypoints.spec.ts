import { test, expect } from "@playwright/test";
import path from "path";

const QA_DIR = path.join(__dirname, "..", "..", "qa");

test.describe("Studio Entry Points State Injection", () => {
  // 1. Archive
  test("Archive card -> Open in Studio", async ({ page }) => {
    await page.goto("/archive");
    const archiveItem = page.locator("article.group.relative").first();
    await archiveItem.hover();
    // In archive, the button says "Remix"
    await archiveItem.locator('button:has-text("Remix")').click();
    await page.waitForURL("**/studio**");
    await page.waitForTimeout(3000); // Wait for hydration and rendering
    
    // Screenshot
    await page.screenshot({ path: path.join(QA_DIR, "archive_entry_studio.png") });
    
    // Verify generator picker shows something selected
    await expect(page.locator('[data-testid="generator-select"]')).not.toBeNull();
  });

  // 2. Collections
  test("Collections card -> Open in Studio", async ({ page }) => {
    await page.goto("/collections");
    const collectionsItem = page.locator("article").first();
    // Expand the collection
    await collectionsItem.locator("h2").click();
    await page.waitForTimeout(500); // Wait for animation
    
    // Click the first button in the expanded list
    await collectionsItem.locator('button').filter({ hasText: 'Open' }).first().click();
    await page.waitForURL("**/studio**");
    await page.waitForTimeout(3000); // Wait for hydration and rendering
    
    // Screenshot
    await page.screenshot({ path: path.join(QA_DIR, "collections_entry_studio.png") });
  });

  // 3. Inspiration
  test("Inspiration page -> Open in Studio", async ({ page }) => {
    await page.goto("/inspiration");
    const inspItem = page.locator("button.group.relative").first();
    await inspItem.click();
    await page.waitForURL("**/studio**");
    await page.waitForTimeout(3000); // Wait for hydration and rendering
    
    // Screenshot
    await page.screenshot({ path: path.join(QA_DIR, "inspiration_entry_studio.png") });
  });

  // 4. Saved Favorites
  test("Saved favorites -> Open in Studio", async ({ page, context }) => {
    // Mock auth and intercept favorites API
    const googleUser = {
      name: "Google Test User",
      email: "google-test-user@wallmydevice.app",
      image: undefined,
    };
    await context.route("**/api/auth/session", async (route) => {
      await route.fulfill({
        status: 200,
        contentType: "application/json",
        body: JSON.stringify({
          user: googleUser,
          expires: new Date(Date.now() + 86400000).toISOString(),
        }),
      });
    });

    await context.route("**/api/favorites*", async (route) => {
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
    const savedItem = page.locator('[data-testid="saved-wallpaper-card"]').first();
    await savedItem.hover();
    await savedItem.locator('button:has-text("Load in Studio")').click();
    await page.waitForURL("**/studio**");
    await page.waitForTimeout(3000); // Wait for hydration and rendering
    
    // Screenshot
    await page.screenshot({ path: path.join(QA_DIR, "saved_entry_studio.png") });
  });
});
