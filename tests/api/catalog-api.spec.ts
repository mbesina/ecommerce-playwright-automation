import { test, expect } from '@tests/fixtures/base.fixture';
import { EcommerceApiClient } from '@api/clients/ecommerceApiClient';
import { products } from '@utils/data/testData';

const apiBaseURL = process.env.API_BASE_URL || process.env.BASE_URL || 'http://127.0.0.1:4173';

test.describe('Catalog API', () => {
  test('returns healthy mock app metadata @smoke @regression', async ({ request }) => {
    const response = await request.get(new URL('/health', apiBaseURL).toString());

    await expect(response).toBeOK();
    expect(response.headers()['content-type']).toContain('application/json');
    expect(await response.json()).toMatchObject({
      status: 'ok',
      productCount: 4
    });
  });

  test('returns searchable product catalog data @regression', async ({ request }) => {
    const client = new EcommerceApiClient(request);
    const catalog = await client.getProducts();

    expect(catalog).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          id: 'penguin-medium-plush-toy',
          name: products.mediumPlushToy,
          price: 34
        })
      ])
    );
  });
});
