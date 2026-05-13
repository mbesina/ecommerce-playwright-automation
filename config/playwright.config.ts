import { defineConfig, devices } from '@playwright/test';
import dotenv from 'dotenv';
import path from 'node:path';

const testEnv = process.env.TEST_ENV ?? 'dev';
dotenv.config({ path: path.resolve(__dirname, `env/${testEnv}.env`) });
dotenv.config({ override: true });

const baseURL = process.env.BASE_URL || 'http://127.0.0.1:4173';
const isLocalBaseURL = /^https?:\/\/(127\.0\.0\.1|localhost)(:\d+)?(\/|$)/.test(baseURL);
const workers = process.env.PLAYWRIGHT_WORKERS ? Number(process.env.PLAYWRIGHT_WORKERS) : undefined;

export default defineConfig({
  testDir: '../tests',
  timeout: 45_000,
  expect: {
    timeout: 10_000
  },
  fullyParallel: true,
  forbidOnly: !!process.env.CI,
  retries: process.env.CI ? 2 : 1,
  workers: process.env.CI ? workers || 2 : undefined,
  outputDir: '../test-results',
  reporter: [
    ['list'],
    ['html', { outputFolder: '../reports/html', open: 'never' }],
    ['allure-playwright', { resultsDir: 'reports/allure-results' }]
  ],
  use: {
    baseURL,
    trace: 'retain-on-failure',
    screenshot: 'only-on-failure',
    video: 'retain-on-failure',
    actionTimeout: 15_000,
    navigationTimeout: 30_000
  },
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] }
    },
    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] }
    }
  ],
  webServer: isLocalBaseURL
    ? {
        command: 'node ../mock-app/server.mjs',
        url: baseURL,
        reuseExistingServer: !process.env.CI,
        timeout: 30_000
      }
    : undefined
});
