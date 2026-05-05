import type { Locator, Page } from '@playwright/test';

export class HeaderComponent {
  readonly searchInput: Locator;
  readonly cartLink: Locator;
  readonly accountLabel: Locator;

  constructor(private readonly page: Page) {
    this.searchInput = page.getByPlaceholder('Search penguin products');
    this.cartLink = page.getByRole('link', { name: /cart/i });
    this.accountLabel = page.getByTestId('account-label');
  }

  async search(term: string): Promise<void> {
    await this.searchInput.fill(term);
    await this.searchInput.press('Enter');
  }

  async openCart(): Promise<void> {
    await this.cartLink.click();
  }
}
