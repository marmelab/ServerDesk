import { Page } from '@playwright/test';

/**
 * Login helper for e2e tests
 * @param page - Playwright page object
 * @param email - User email
 * @param password - User password
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('/ServerDesk/auth/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  // Wait for navigation after login
  await page.waitForURL(/\/(admin|agent|tickets)$/, { timeout: 10000 });
}

/**
 * Logout helper for e2e tests
 * @param page - Playwright page object
 */
export async function logout(page: Page) {
  // Click on avatar dropdown or logout button
  // Adjust selector based on your actual UI
  const logoutButton = page.getByRole('button', { name: /logout|sign out/i });
  if (await logoutButton.isVisible()) {
    await logoutButton.click();
  }
}

/**
 * Wait for the agents page to load
 * @param page - Playwright page object
 */
export async function waitForAgentsPage(page: Page) {
  await page.getByText('Agents', { exact: true }).waitFor();
  await page.getByRole('button', { name: /Invite Agent/i }).waitFor();
}
