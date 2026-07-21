import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests/e2e',
  fullyParallel: true,
  retries: 0,
  workers: 1,
  reporter: 'list',
  use: {
    baseURL: (process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000'),
    trace: 'on-first-retry',
    extraHTTPHeaders: {
      'x-vercel-protection-bypass': process.env.VERCEL_AUTOMATION_BYPASS_SECRET || '',
    },
  },
  projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
  webServer: { command: 'cmd /c npm run dev', url: (process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000'), reuseExistingServer: true, timeout: 60_000 },
});
