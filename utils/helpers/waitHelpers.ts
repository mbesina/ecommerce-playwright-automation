import type { Page } from '@playwright/test';

export async function waitForAppReady(page: Page): Promise<void> {
  await page.locator('[data-testid="app-ready"]').waitFor({ state: 'attached' });
}
