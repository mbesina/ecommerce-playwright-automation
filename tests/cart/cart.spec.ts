import { test, expect } from '@tests/fixtures/base.fixture';
import { products } from '@utils/data/testData';

test.describe('Cart', () => {
  test('adds a product to cart @smoke @regression', async ({ authenticatedPage, cartPage }) => {
    await authenticatedPage.goto();
    await authenticatedPage.addToCart(products.ecoBag);
    await authenticatedPage.header.openCart();

    await expect(cartPage.cartItems).toHaveCount(1);
    await expect(cartPage.cartItems.first()).toContainText(products.ecoBag);
  });

  test('blocks checkout when cart is empty @regression', async ({ cartPage }) => {
    await cartPage.goto();

    await expect(cartPage.emptyCart).toBeVisible();
    await expect(cartPage.checkoutButton).toBeHidden();
  });
});
