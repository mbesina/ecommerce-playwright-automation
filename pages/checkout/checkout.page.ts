import type { Locator, Page } from '@playwright/test';
import type { CheckoutAddress } from '../../utils/data/testData';

export class CheckoutPage {
  readonly placeOrderButton: Locator;
  readonly orderConfirmation: Locator;

  constructor(private readonly page: Page) {
    this.placeOrderButton = page.getByRole('button', { name: /place order/i });
    this.orderConfirmation = page.getByTestId('order-confirmation');
  }

  async goto(): Promise<void> {
    await this.page.goto('/checkout.html');
  }

  async fillShippingAddress(address: CheckoutAddress): Promise<void> {
    await this.page.getByLabel('First name').fill(address.firstName);
    await this.page.getByLabel('Last name').fill(address.lastName);
    await this.page.getByLabel('Address').fill(address.address);
    await this.page.getByLabel('City').fill(address.city);
    await this.page.getByLabel('Postal code').fill(address.postalCode);
    await this.page.getByLabel('Country').fill(address.country);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
  }
}
