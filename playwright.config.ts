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
  projects: [
    {
      // Standard project: all tests EXCEPT those requiring WebGL rendering
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
      testIgnore: [
        '**/fluid-gradient.stability.spec.ts',
        '**/export.parity.spec.ts',
        '**/fluid-gradient.export.spec.ts',
        '**/webgl.fallback.spec.ts',
      ],
    },
    {
      // Dedicated WebGL project: SwiftShader software renderer for determinism tests.
      // --enable-unsafe-swiftshader lowers browser security guarantees intentionally;
      // this project is restricted to trusted local/CI testing only.
      testMatch: [
        '**/fluid-gradient.stability.spec.ts',
        '**/export.parity.spec.ts',
        '**/fluid-gradient.export.spec.ts',
        '**/webgl.fallback.spec.ts',
      ],
      use: {
        ...devices['Desktop Chrome'],
        launchOptions: {
          args: [
            '--use-gl=angle',
            '--use-angle=swiftshader-webgl',
            '--enable-unsafe-swiftshader',
          ],
        },
      },
    },
  ],
  webServer: {
    command: 'cmd /c npm run dev',
    url: (process.env.PLAYWRIGHT_TEST_BASE_URL || 'http://localhost:3000'),
    reuseExistingServer: true,
    timeout: 60_000,
  },
});
