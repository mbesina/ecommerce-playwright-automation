import type { Locator, Page } from '@playwright/test';
import { HeaderComponent } from '../components/header.component';

export class ProductPage {
  readonly header: HeaderComponent;
  readonly productCards: Locator;
  readonly emptyState: Locator;

  constructor(private readonly page: Page) {
    this.header = new HeaderComponent(page);
    this.productCards = page.locator('[data-testid-product-card]');
    this.emptyState = page.getByText('No penguin products found');
  }

  async goto(): Promise<void> {
    await this.page.goto('/products.html');
  }

  productCard(name: string): Locator {
    return this.page.getByTestId(`product-${name.toLowerCase().replaceAll(' ', '-')}`);
  }

  async addToCart(productName: string): Promise<void> {
    await this.productCard(productName).getByRole('button', { name: /add to waddle cart/i }).click();
  }
}
