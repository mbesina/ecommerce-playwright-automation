import { test, expect } from '@tests/fixtures/base.fixture';
import { validUser } from '@utils/data/testData';

test.describe('Authentication', () => {
  test('allows a valid customer to sign in @smoke @regression', async ({ loginPage, page }) => {
    await loginPage.goto();
    await loginPage.login(validUser.email, validUser.password);

    await expect(page).toHaveURL(/products/);
    await expect(page.getByTestId('account-label')).toContainText(validUser.firstName);
  });

  test('shows a clear error for invalid credentials @regression', async ({ loginPage }) => {
    await loginPage.goto();
    await loginPage.login('unknown@example.com', 'bad-password');

    await expect(loginPage.errorMessage).toHaveText('Invalid email or password');
  });
});
