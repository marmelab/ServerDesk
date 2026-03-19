import { test, expect } from '@playwright/test';
import { login, waitForAgentsPage } from './helpers/auth';

test.describe('Agents Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    // Note: You'll need to update these credentials with valid test user
    await login(page, 'jerome@marmelab.com', '123456');
    await page.goto('/ServerDesk/admin/agents');

    // Wait for page to fully load (agents query to complete)
    await expect(page.getByText('Agents', { exact: true })).toBeVisible();
    await expect(
      page.getByRole('button', { name: /Invite Agent/i }),
    ).toBeVisible();
  });

  test('should display agents list', async ({ page }) => {
    // Check that the description text is present
    await expect(
      page.getByText('Manage agents and their company assignments'),
    ).toBeVisible();
  });
});
