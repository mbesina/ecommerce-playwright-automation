import type { APIRequestContext } from '@playwright/test';
import type { UserCredentials } from '@utils/data/testData';

export interface Product {
  id: string;
  name: string;
  price: number;
}

export interface AuthenticatedUser {
  email: string;
  firstName: string;
  lastName: string;
}

export class EcommerceApiClient {
  constructor(
    private readonly request: APIRequestContext,
    private readonly baseURL = process.env.API_BASE_URL ||
      process.env.BASE_URL ||
      'http://127.0.0.1:4173'
  ) {}

  async getProducts(): Promise<Product[]> {
    const response = await this.request.get(new URL('/api/products', this.baseURL).toString());
    if (!response.ok()) {
      throw new Error(`Failed to get products: ${response.status()} ${await response.text()}`);
    }
    return response.json() as Promise<Product[]>;
  }

  async login(
    credentials: Pick<UserCredentials, 'email' | 'password'>
  ): Promise<AuthenticatedUser> {
    const response = await this.request.post(new URL('/api/login', this.baseURL).toString(), {
      data: credentials
    });
    if (!response.ok()) {
      throw new Error(`Failed to authenticate test user: ${response.status()}`);
    }
    return response.json() as Promise<AuthenticatedUser>;
  }
}
