import { faker } from '@faker-js/faker';

export interface UserCredentials {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
}

export interface CheckoutAddress {
  firstName: string;
  lastName: string;
  address: string;
  city: string;
  postalCode: string;
  country: string;
}

export const products = {
  keyChain: 'Penguin key chain',
  ecoBag: 'Penguin eco bag',
  mediumPlushToy: 'Penguin medium plush toy',
  travelNeckPillow: 'Penguin Travel Neck Pillow'
} as const;

export function createUser(overrides: Partial<UserCredentials> = {}): UserCredentials {
  return {
    email: faker.internet.email().toLowerCase(),
    password: `P@ss${faker.string.alphanumeric(8)}`,
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    ...overrides
  };
}

export function createCheckoutAddress(overrides: Partial<CheckoutAddress> = {}): CheckoutAddress {
  return {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    address: faker.location.streetAddress(),
    city: faker.location.city(),
    postalCode: faker.location.zipCode(),
    country: 'United States',
    ...overrides
  };
}

export const validUser: UserCredentials = {
  email: 'maybuyer@example.com',
  password: 'Password123!',
  firstName: 'May',
  lastName: 'Buyer'
};
