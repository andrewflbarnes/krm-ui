import { defineConfig, devices } from '@playwright/test';

// locally go through the netlify
const baseURL = process.env.PLAYWRIGHT_TARGET || "http://localhost:5173"

/**
 * See https://playwright.dev/docs/test-configuration.
 */
export default defineConfig({
  testDir: './playwright',
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 0,
  workers: process.env.CI ? 1 : undefined,
  reporter: 'html',
  use: {
    baseURL,
    trace: 'on-first-retry',
    actionTimeout: 5000,
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'pnpm start --host',
    url: baseURL,
    reuseExistingServer: !process.env.CI || !!process.env.KRM_LIVE,
  }
});
