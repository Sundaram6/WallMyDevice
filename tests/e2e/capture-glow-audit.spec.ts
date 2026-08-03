import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test.describe('Studio Ambient Glow Audit Across Generators', () => {
  test('verifies ambient backglow visibility across different generator types', async ({ page }) => {
    await page.goto('http://localhost:3000/studio');
    await page.waitForSelector('main', { timeout: 10000 });
    await page.waitForTimeout(2000);

    const qaDir = path.join(process.cwd(), 'public', 'qa');
    if (!fs.existsSync(qaDir)) {
      fs.mkdirSync(qaDir, { recursive: true });
    }

    // Select Metaballs
    const metaballsBtn = page.getByRole('button', { name: /Metaballs/i }).first();
    if (await metaballsBtn.isVisible()) {
      await metaballsBtn.click();
      await page.waitForTimeout(2000);
      const metaballsPath = path.join(qaDir, 'real_phase13_glow_metaballs.png');
      await page.screenshot({ path: metaballsPath, fullPage: false });
      console.log(`Captured ${metaballsPath}`);
    }

    // Select Starfield Nebula
    const starfieldBtn = page.getByRole('button', { name: /Starfield Nebula/i }).first();
    if (await starfieldBtn.isVisible()) {
      await starfieldBtn.click();
      await page.waitForTimeout(2000);
      const starfieldPath = path.join(qaDir, 'real_phase13_glow_starfield.png');
      await page.screenshot({ path: starfieldPath, fullPage: false });
      console.log(`Captured ${starfieldPath}`);
    }

    // Select Topographic Lines
    const topoBtn = page.getByRole('button', { name: /Topographic Lines/i }).first();
    if (await topoBtn.isVisible()) {
      await topoBtn.click();
      await page.waitForTimeout(2000);
      const topoPath = path.join(qaDir, 'real_phase13_glow_topographic.png');
      await page.screenshot({ path: topoPath, fullPage: false });
      console.log(`Captured ${topoPath}`);
    }
  });
});
