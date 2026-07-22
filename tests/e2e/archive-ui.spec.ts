import { test, expect } from "@playwright/test";

test.describe("Archive UI & Swatch Integration", () => {
  test("Archive page loads and renders swatch grid", async ({ page }) => {
    await page.goto("/");
    await expect(page.getByRole("heading", { name: "Print Swatch Archive." })).toBeVisible();
    await expect(page.getByText("14 prints")).toBeVisible();

    // Verify swatch cards render
    const firstCard = page.locator("article").first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard).toContainText("Terracotta Bloom");
  });

  test("Category filtering updates displayed swatches", async ({ page }) => {
    await page.goto("/");
    // Click Monochrome category
    await page.getByRole("button", { name: "Monochrome 18" }).click();
    await expect(page.getByText("Inkleaf")).toBeVisible();
    await expect(page.getByText("Terracotta Bloom")).not.toBeVisible();
  });

  test("Selecting a swatch updates store and active preset", async ({ page }) => {
    await page.goto("/");
    // Click on Inkleaf swatch card
    await page.locator("article").filter({ hasText: "Inkleaf" }).click();
    await expect(page.locator("article").filter({ hasText: "Inkleaf" })).toHaveAttribute("aria-pressed", "true");
  });

  test("Open Studio workspace button switches to Studio view", async ({ page }) => {
    await page.goto("/");
    await page.getByRole("button", { name: "Open Workspace →" }).click();
    await expect(page.getByText("Editor")).toBeVisible();
    await expect(page.locator("canvas")).toBeVisible();
  });
});
