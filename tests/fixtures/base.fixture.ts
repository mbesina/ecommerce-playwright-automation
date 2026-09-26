import { expect, test as base } from '@playwright/test';
import { LoginPage } from '@pages/auth/login.page';
import { ProductPage } from '@pages/product/product.page';
import { CartPage } from '@pages/cart/cart.page';
import { CheckoutPage } from '@pages/checkout/checkout.page';
import { EcommerceApiClient } from '@api/clients/ecommerceApiClient';
import { validUser } from '@utils/data/testData';

type EcommerceFixtures = {
  loginPage: LoginPage;
  productPage: ProductPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  authenticatedPage: ProductPage;
};

export const test = base.extend<EcommerceFixtures>({
  loginPage: async ({ page }, use) => {
    await use(new LoginPage(page));
  },
  productPage: async ({ page }, use) => {
    await use(new ProductPage(page));
  },
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },
  authenticatedPage: async ({ page, request }, use) => {
    const user = await new EcommerceApiClient(request).login(validUser);
    await page.addInitScript((sessionUser) => {
      globalThis.localStorage.setItem('session', JSON.stringify(sessionUser));
    }, user);

    const productPage = new ProductPage(page);
    await productPage.goto();
    await expect(productPage.header.accountLabel).toContainText(user.firstName);
    await use(productPage);
  }
});

export { expect };
