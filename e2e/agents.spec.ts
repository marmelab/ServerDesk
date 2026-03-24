import { test, expect } from '@playwright/test';
import { login, logout, signup } from './helpers/auth';

test.describe('Agents Page', () => {
  test.beforeEach(async ({ page }) => {
    // Login as admin before each test
    // Note: You'll need to update these credentials with valid test user
    await login(page, 'jerome@marmelab.com', '123456');
    await page.goto('admin/agents');

    // Wait for page to fully load (agents query to complete)
    await expect(page.getByText('Agents', { exact: true })).toBeVisible();
  });

  test('should display agents list and assign company to agent', async ({
    page,
  }) => {
    // Check that the description text is present
    await expect(
      page.getByText('Manage agents and their company assignments'),
    ).toBeVisible();

    // Check if first agent is here and have no companies
    const firstCard = page.getByTestId('agent-card').first();
    const firstCardCompanies = firstCard.getByText('No companies assigned', {
      exact: true,
    });
    await expect(firstCardCompanies).toBeVisible();

    // Click to assign companies
    await firstCard.getByRole('button', { name: 'Assign companies' }).click();

    const dialogTitle = page.getByText(/assign companies to agent/i);
    await expect(dialogTitle).toBeVisible();

    // Assign a company
    await page.getByTestId('assign-company').first().click();
    await page.getByRole('button', { name: 'Save Changes' }).click();

    await expect(dialogTitle).not.toBeVisible();

    await expect(firstCardCompanies).not.toBeVisible();
  });

  test('invite agent', async ({ page, context }) => {
    // Check that the description text is present
    await expect(
      page.getByText('Manage agents and their company assignments'),
    ).toBeVisible();

    const inviteAgentButton = page.getByRole('button', {
      name: /Invite Agent/i,
    });
    await expect(inviteAgentButton).toBeVisible();

    await test.step('Invite agent with no company', async () => {
      await inviteAgentButton.click();
      const dialogTitle = page.getByRole('heading', { name: /invite agent/i });
      await expect(dialogTitle).toBeVisible();

      await page.getByRole('button', { name: 'Generate Invite Link' }).click();
      const inputToken = page.getByRole('textbox');
      await expect(inputToken).toBeVisible();
      await expect(inputToken).not.toHaveValue('');
      const inviteLink = await inputToken.inputValue();

      await context.grantPermissions(['clipboard-read', 'clipboard-write']);
      const copyButton = page.getByTestId('button-copy');
      await copyButton.click();

      await page.getByRole('button', { name: /close/i }).click();
      await expect(dialogTitle).not.toBeVisible();

      await logout(page, context);
      await signup(
        page,
        context,
        'agent1@test.com',
        'Agent1',
        inviteLink.split('=')[1],
        '123456',
      );

      await login(page, 'jerome@marmelab.com', '123456');
      await page.goto('admin/agents');
      await expect(
        page.getByText('Agents', { exact: true }).first(),
      ).toBeVisible();
      await expect(page.getByText('Agent1').first()).toBeVisible();
    });
  });
});
