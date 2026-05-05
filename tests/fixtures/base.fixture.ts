import { expect, test as base } from '@playwright/test';
import { LoginPage } from '@pages/auth/login.page';
import { ProductPage } from '@pages/product/product.page';
import { CartPage } from '@pages/cart/cart.page';
import { CheckoutPage } from '@pages/checkout/checkout.page';
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
  authenticatedPage: async ({ page }, use) => {
    await page.goto('/login.html');
    await new LoginPage(page).login(validUser.email, validUser.password);
    await expect(page.getByTestId('account-label')).toContainText(validUser.firstName);
    await use(new ProductPage(page));
  }
});

export { expect };
