import { test, expect } from '@playwright/test';
import { login, logout } from './helpers/auth';

test.describe('Tickets Page', () => {
  test('Create ticket', async ({ page, context }) => {
    // Login as customer manager
    await login(page, 'test1@test.com', '123456');

    // Create ticket
    await page.getByRole('button', { name: 'Add Ticket' }).click();
    const uniqueSubject = `Test-${Date.now()}`;
    await page.getByRole('textbox', { name: 'Subject' }).fill(uniqueSubject);
    await page.getByRole('textbox', { name: 'Description' }).click();
    await page
      .getByRole('textbox', { name: 'Description' })
      .fill('Test ticket description');
    await page.getByRole('combobox', { name: 'Priority' }).click();
    await page.getByRole('option', { name: 'High' }).click();
    await page.getByRole('button', { name: 'Add Ticket' }).click();

    // Add first message
    await page.getByText(uniqueSubject).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const idLocator = page.getByRole('dialog').locator('span:has-text("#")');
    await expect(idLocator).toBeVisible();
    const rawId = await idLocator.textContent();
    const ticketId = rawId?.replace('#', '').trim();

    await page.getByRole('textbox', { name: 'Type a reply:' }).click();
    await page
      .getByRole('textbox', { name: 'Type a reply:' })
      .fill('First message');
    await page.getByRole('button').click();
    await page.keyboard.press('Escape');
    await logout(page, context);

    // Login as agent and add second message and change status
    await login(page, 'agent1@test.com', '123456');
    await page.getByText(uniqueSubject).click();
    const statusBadge = page.getByTestId('ticket-status').first();
    await expect(statusBadge).toHaveText('Open');
    await page.getByRole('combobox', { name: 'Set status on reply:' }).click();
    await page.getByLabel('Resolved').getByText('Resolved').click();
    await page.getByRole('textbox', { name: 'Type a reply:' }).click();
    await page
      .getByRole('textbox', { name: 'Type a reply:' })
      .fill('Ticket finished');
    await page.getByRole('button').click();
    await expect(statusBadge).toHaveText('Resolved');

    const thread = page.locator('div:has-text("First message")');
    await expect(page.getByText('Ticket finished')).toBeVisible();
    await page.keyboard.press('Escape');

    // Verify status in summary
    await expect(page.getByRole('dialog')).toBeHidden();
    const row = page.locator('tr').filter({ hasText: uniqueSubject });
    await expect(row).toBeVisible();
    await expect(row).toContainText('Resolved');
  });
});
