import { test, expect } from "@playwright/test";
import fs from "node:fs";
import path from "node:path";

test.describe("Phase 10 — Full System Audit Captures", () => {
  test("Capture full system verification screenshots for Phase 10", async ({ page }) => {
    // Set viewport
    await page.setViewportSize({ width: 1440, height: 900 });

    // 1. Homepage
    await page.goto("http://localhost:3000/", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const homepageBuffer = await page.screenshot({ fullPage: false });
    const homepagePath = path.join(process.cwd(), "public", "qa", "real_phase10_homepage.png");
    fs.writeFileSync(homepagePath, homepageBuffer);

    // 2. Studio
    await page.goto("http://localhost:3000/studio", { waitUntil: "networkidle" });
    await page.waitForTimeout(1500);
    const studioBuffer = await page.screenshot({ fullPage: false });
    const studioPath = path.join(process.cwd(), "public", "qa", "real_phase10_studio.png");
    fs.writeFileSync(studioPath, studioBuffer);

    // 3. Archive
    await page.goto("http://localhost:3000/archive", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const archiveBuffer = await page.screenshot({ fullPage: false });
    const archivePath = path.join(process.cwd(), "public", "qa", "real_phase10_archive.png");
    fs.writeFileSync(archivePath, archiveBuffer);

    // 4. Collections
    await page.goto("http://localhost:3000/collections", { waitUntil: "networkidle" });
    await page.waitForTimeout(1000);
    const collectionsBuffer = await page.screenshot({ fullPage: false });
    const collectionsPath = path.join(process.cwd(), "public", "qa", "real_phase10_collections.png");
    fs.writeFileSync(collectionsPath, collectionsBuffer);
  });
});
