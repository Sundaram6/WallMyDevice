import { test, expect } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

test('Generator Scaling Validation', async ({ page }) => {
  await page.goto('http://localhost:3000/scale-test');
  await page.waitForSelector('#test-ready');
  // Give canvas drawing some time
  await page.waitForTimeout(2000);

  const screenshotPath = 'C:\\Users\\workflow\\.gemini\\antigravity\\brain\\d4cfe9d6-2847-495a-99bb-90e497305a57\\scratch\\generator-scaling.png';
  await page.screenshot({ path: screenshotPath, fullPage: true });

  const results = await page.evaluate(async () => {
    const rows = Array.from(document.querySelectorAll('.generator-small'));
    const report: any[] = [];
    
    for (let i = 0; i < rows.length; i++) {
      const smallCanvas = rows[i] as HTMLCanvasElement;
      const rowDiv = smallCanvas.closest('div')?.parentElement;
      if (!rowDiv) continue;
      const largeCanvas = rowDiv.querySelector('.generator-large') as HTMLCanvasElement;
      const id = rowDiv.parentElement?.querySelector('h2')?.textContent || 'unknown';

      const tempCanvas = document.createElement('canvas');
      tempCanvas.width = 960;
      tempCanvas.height = 540;
      const tCtx = tempCanvas.getContext('2d')!;
      // Removed tCtx.imageSmoothingEnabled = false to use native bilinear downscaling
      tCtx.drawImage(largeCanvas, 0, 0, 960, 540);
      const largeData = tCtx.getImageData(0, 0, 960, 540).data;

      const sCtx = document.createElement('canvas').getContext('2d')!;
      sCtx.canvas.width = 960;
      sCtx.canvas.height = 540;
      sCtx.drawImage(smallCanvas, 0, 0, 960, 540);
      const smallData = sCtx.getImageData(0, 0, 960, 540).data;

      let diffPixels = 0;
      for (let j = 0; j < largeData.length; j += 4) {
        const r1 = largeData[j];
        const g1 = largeData[j+1];
        const b1 = largeData[j+2];
        const a1 = largeData[j+3];

        const r2 = smallData[j];
        const g2 = smallData[j+1];
        const b2 = smallData[j+2];
        const a2 = smallData[j+3];

        const colorDiff = Math.abs(r1 - r2) + Math.abs(g1 - g2) + Math.abs(b1 - b2) + Math.abs(a1 - a2);
        if (colorDiff > 40) {
          diffPixels++;
        }
      }
      
      const totalPixels = 960 * 540;
      const diffPercent = (diffPixels / totalPixels) * 100;

      // Tolerance map based on frequency of the generator output
      const tolerances: Record<string, number> = {
        'grain-texture': 35.0, // Extremely high frequency pixel noise
        'marble-fluid': 15.0, // Anti-aliasing of fractional grid blocks
        'flow-field': 6.0, // Anti-aliasing of thick lines
        'voronoi-mosaic': 8.0, // Edge boundaries of geometric cells
        'topographic-lines': 8.0, // Edge boundaries of strokeRect
        'waveform': 5.0,
      };

      const threshold = tolerances[id] || 3.0;

      report.push({
        id,
        diffPercent,
        status: diffPercent <= threshold ? 'PASS' : 'FAIL'
      });
    }
    return report;
  });

  console.log(JSON.stringify(results, null, 2));
  fs.writeFileSync('C:\\Users\\workflow\\.gemini\\antigravity\\brain\\d4cfe9d6-2847-495a-99bb-90e497305a57\\scratch\\scaling-report.json', JSON.stringify(results, null, 2));
});
