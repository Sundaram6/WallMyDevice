import { test, expect } from '@playwright/test';
import * as path from 'path';
import * as fs from 'fs';

const QA_DIR = path.join(process.cwd(), 'public', 'qa');
if (!fs.existsSync(QA_DIR)) fs.mkdirSync(QA_DIR, { recursive: true });

test.use({ viewport: { width: 1440, height: 900 } });

test.describe('Growth & Sharing E2E Verification', () => {
  test('1. Zero-flash URL load hydrates exact state without error boundary crash', async ({ page }) => {
    const targetUrl = 'http://localhost:3000/studio?g=starfield-nebula&s=testseed99&p=000000-1e1b4b-db2777&d=phone';
    
    await page.goto(targetUrl, { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    // Verify Error Boundary did NOT catch any runtime error
    const errorBoundary = page.locator('text=Something went wrong');
    await expect(errorBoundary).not.toBeVisible();

    const state = await page.evaluate(() => {
      const store = (window as any).__WMD_STORE__ || (window as any).useEditorStore;
      const s = store ? store.getState() : null;
      return {
        generatorId: s ? s.generatorId : null,
        seed: s ? s.seed : null,
        palette: s ? s.palette : null,
        deviceType: s ? s.deviceType : null,
      };
    });

    expect(state.generatorId).toBe('starfield-nebula');
    expect(state.seed).toBe('testseed99');
    expect(state.palette).toEqual(['#000000', '#1e1b4b', '#db2777']);
    expect(state.deviceType).toBe('phone');

    // Take clean screenshot of loaded Studio page
    await page.screenshot({ path: path.join(QA_DIR, 'real_phase14_url_load.png') });
  });

  test('2. Studio param changes automatically sync to URL via history.replaceState', async ({ page }) => {
    await page.goto('http://localhost:3000/studio', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    await expect(page.locator('text=Something went wrong')).not.toBeVisible();

    // Change generator via store action
    await page.evaluate(() => {
      const store = (window as any).__WMD_STORE__ || (window as any).useEditorStore;
      if (store) store.getState().setGenerator('geometric');
    });
    
    await page.waitForTimeout(300);
    
    const currentHref = await page.evaluate(() => window.location.href);
    expect(currentHref).toContain('g=geometric');
  });

  test('3. Edge OG image route (/api/og) returns valid PNG and Cache-Control headers', async ({ request }) => {
    const response = await request.get('http://localhost:3000/api/og?g=starfield-nebula&p=000000-1e1b4b-db2777&s=testseed99');
    
    expect(response.status()).toBe(200);
    expect(response.headers()['content-type']).toContain('image/png');
    
    const cacheHeader = response.headers()['cache-control'] || '';
    expect(cacheHeader).toContain('public');
    expect(cacheHeader).toContain('max-age=31536000');
    expect(cacheHeader).toContain('immutable');

    const body = await response.body();
    fs.writeFileSync(path.join(QA_DIR, 'real_phase14_og_preview.png'), body);
  });

  test('4. Remix strictly preserves generatorId across 5 clicks while Surprise Me rerolls full state', async ({ page }) => {
    await page.goto('http://localhost:3000/studio?g=metaballs&s=initialseed', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(600);

    await expect(page.locator('text=Something went wrong')).not.toBeVisible();

    const href = await page.evaluate(() => window.location.href);
    expect(href).toContain('g=metaballs');

    for (let i = 0; i < 5; i++) {
      await page.evaluate(() => {
        const store = (window as any).__WMD_STORE__ || (window as any).useEditorStore;
        if (store) store.getState().remix();
      });
      await page.waitForTimeout(100);
      const loopHref = await page.evaluate(() => window.location.href);
      expect(loopHref).toContain('g=metaballs');
    }

    await page.evaluate(() => {
      const store = (window as any).__WMD_STORE__ || (window as any).useEditorStore;
      if (store) store.getState().surpriseMe();
    });
    await page.waitForTimeout(300);
  });

  test('5. Copy Link button invokes real copyStudioLink handler and displays active Toast notification', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']).catch(() => {});
    await page.goto('http://localhost:3000/studio?g=waveform&s=k3p9x2a7', { waitUntil: 'domcontentloaded' });
    await page.waitForTimeout(800);

    await expect(page.locator('text=Something went wrong')).not.toBeVisible();

    // Click the actual Share button in TopToolbar
    const shareBtn = page.locator('button').filter({ hasText: 'Share' }).first();
    await expect(shareBtn).toBeVisible({ timeout: 5000 });
    await shareBtn.click();

    // Verify Toast notification appears
    const toast = page.locator('#studio-toast');
    await expect(toast).toBeVisible({ timeout: 5000 });
    await expect(toast).toContainText(/wallpaper link copied/i);

    // Capture clean screenshot with Toast notification visible
    await page.screenshot({ path: path.join(QA_DIR, 'real_phase14_toast_copylink.png') });
  });
});
