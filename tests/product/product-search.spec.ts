import { test, expect } from '@tests/fixtures/base.fixture';
import { products } from '@utils/data/testData';

test.describe('Product search', () => {
  test('finds products by keyword @smoke @regression', async ({ authenticatedPage }) => {
    await authenticatedPage.goto();
    await authenticatedPage.header.search('plush');

    await expect(authenticatedPage.productCards).toHaveCount(1);
    await expect(authenticatedPage.productCard(products.mediumPlushToy)).toBeVisible();
  });

  test('shows an empty message when search returns no results @regression', async ({ authenticatedPage }) => {
    await authenticatedPage.goto();
    await authenticatedPage.header.search('nonexistent item');

    await expect(authenticatedPage.emptyState).toBeVisible();
  });
});
