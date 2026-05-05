import type { APIRequestContext } from '@playwright/test';

export interface Product {
  id: string;
  name: string;
  price: number;
}

export class EcommerceApiClient {
  constructor(private readonly request: APIRequestContext) {}

  async getProducts(): Promise<Product[]> {
    const response = await this.request.get('/api/products');
    if (!response.ok()) {
      throw new Error(`Failed to get products: ${response.status()} ${await response.text()}`);
    }
    return response.json() as Promise<Product[]>;
  }
}
