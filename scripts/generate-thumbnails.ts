import { chromium } from "@playwright/test";
import fs from "fs";
import path from "path";
import { ARCHIVE_PRESETS } from "../lib/presets/archive-presets";

async function generateThumbnails() {
  console.log("🎨 Starting static thumbnail generation pipeline...");

  const outputDir = path.join(process.cwd(), "public", "thumbnails");
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 600, height: 800 } });

  const baseUrl = process.env.BASE_URL || "http://localhost:3000";

  let count = 0;
  for (const swatch of ARCHIVE_PRESETS) {
    try {
      const recipeUrl = `${baseUrl}/studio?recipe=${swatch.id}`;
      await page.goto(recipeUrl, { waitUntil: "networkidle" });
      await page.waitForTimeout(300);

      const canvasElement = await page.$("canvas");
      if (canvasElement) {
        const filePath = path.join(outputDir, `${swatch.id}.png`);
        await canvasElement.screenshot({ path: filePath, type: "png" });
        count++;
        console.log(`✓ Generated [${count}/${ARCHIVE_PRESETS.length}]: ${swatch.id}.png`);
      }
    } catch (err) {
      console.error(`❌ Failed to render thumbnail for ${swatch.id}:`, err);
    }
  }

  await browser.close();
  console.log(`✨ Successfully pre-rendered ${count} thumbnail assets in public/thumbnails/`);
}

generateThumbnails().catch((err) => {
  console.error("Fatal error generating thumbnails:", err);
  process.exit(1);
});
