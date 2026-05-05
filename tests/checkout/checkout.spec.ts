import { test, expect } from '@tests/fixtures/base.fixture';
import { createCheckoutAddress, products } from '@utils/data/testData';

test.describe('Checkout', () => {
  test('places an order from cart @smoke @regression', async ({
    authenticatedPage,
    cartPage,
    checkoutPage
  }) => {
    await authenticatedPage.goto();
    await authenticatedPage.addToCart(products.travelNeckPillow);
    await authenticatedPage.header.openCart();
    await cartPage.checkout();
    await checkoutPage.fillShippingAddress(createCheckoutAddress());
    await checkoutPage.placeOrder();

    await expect(checkoutPage.orderConfirmation).toContainText('Order confirmed');
  });

  test('requires shipping fields before order placement @regression', async ({
    authenticatedPage,
    cartPage,
    checkoutPage,
    page
  }) => {
    await authenticatedPage.goto();
    await authenticatedPage.addToCart(products.keyChain);
    await authenticatedPage.header.openCart();
    await cartPage.checkout();
    await checkoutPage.placeOrder();

    await expect(page.getByRole('alert')).toHaveText('Complete all shipping fields');
  });
});
