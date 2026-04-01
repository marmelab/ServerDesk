import { test, expect } from '@playwright/test';
import { login } from './helpers/auth';

test.describe('Customers Page', () => {
  test('Create customer', async ({ page }) => {
    // Login as customer manager
    await login(page, 'test1@test.com', '123456');
    await page.goto('customers');

    // Add customer
    let uniqueName: string = `Test-${Date.now()}`;
    await page.getByRole('button', { name: 'Add Customer' }).click();
    await page.getByRole('textbox', { name: 'Name' }).fill(uniqueName);
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page
      .getByRole('textbox', { name: 'Email' })
      .fill('customer@test.com');
    const addButton = page.getByRole('button', { name: 'Add Customer' });
    await addButton.click();

    // Find customer role and click edit
    const row = page.getByRole('row').filter({ hasText: uniqueName });
    await expect(row).toBeVisible();
    await row.getByRole('button', { name: 'Edit customer' }).click();

    uniqueName = uniqueName.concat('Edit');
    await page.getByRole('textbox', { name: 'Name' }).fill(uniqueName);
    await page.getByRole('button', { name: 'Update Customer' }).click();

    // Find new edit name
    const editRow = page.getByRole('row').filter({ hasText: uniqueName });
    await expect(editRow).toContainText(uniqueName);

    // Try to add without fields
    await page.getByRole('button', { name: 'Add Customer' }).click();
    await expect(addButton).toBeDisabled();
    await page.getByRole('textbox', { name: 'Name' }).fill(uniqueName);
    await expect(addButton).toBeDisabled();
    await page.getByRole('textbox', { name: 'Email' }).click();
    await page
      .getByRole('textbox', { name: 'Email' })
      .fill('customer@test.com');
    await page.getByRole('button', { name: 'Add Customer' }).click();
    await expect(page.getByText(/this record already exists/i)).toBeVisible();

    // Test delete customer
    await editRow.getByRole('button', { name: 'Delete customer' }).click();

    const dialog = page.getByRole('alertdialog');
    await expect(dialog).toBeVisible();

    await page.getByRole('button', { name: 'Cancel' }).click();

    await expect(dialog).toBeHidden();
    await editRow.getByRole('button', { name: 'Delete customer' }).click();

    await expect(dialog).toBeVisible();
    await page.getByRole('button', { name: 'Delete' }).click();

    await expect(dialog).toBeHidden();
    const deletedRow = page.getByRole('row').filter({ hasText: uniqueName });
    await expect(deletedRow).not.toBeVisible();
  });
});
