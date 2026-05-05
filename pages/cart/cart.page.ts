import type { Locator, Page } from '@playwright/test';

export class CartPage {
  readonly cartItems: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCart: Locator;

  constructor(private readonly page: Page) {
    this.cartItems = page.getByTestId('cart-item');
    this.checkoutButton = page.getByRole('link', { name: /checkout/i });
    this.emptyCart = page.getByText('Your waddle cart is empty');
  }

  async goto(): Promise<void> {
    await this.page.goto('/cart.html');
  }

  async checkout(): Promise<void> {
    await this.checkoutButton.click();
  }
}
