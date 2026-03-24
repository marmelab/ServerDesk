import { BrowserContext, expect, Page } from '@playwright/test';

/**
 * Login helper for e2e tests
 * @param page - Playwright page object
 * @param email - User email
 * @param password - User password
 */
export async function login(page: Page, email: string, password: string) {
  await page.goto('auth/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: 'Login' }).click();
  // Wait for navigation after login
  await page.waitForURL(/\/ServerDesk\/?(admin|agent|tickets)?\/?$/, {
    timeout: 10000,
  });
}

/**
 * Logout helper for e2e tests
 * @param page - Playwright page object
 */
export async function logout(page: Page, context: BrowserContext) {
  // Click on avatar dropdown or logout button
  await page.getByRole('button', { name: 'User menu' }).click();
  await page.getByText('Log out').click();

  await context.clearCookies();
  await page.evaluate(() => window.localStorage.clear());
  await page.evaluate(() => window.sessionStorage.clear());
  await expect(page.getByText('Login').first()).toBeVisible();
}

/**
 * Signup helper for e2e tests
 * @param page - Playwright page object
 * @param email - User email
 * @param name - User name
 * @param token - Invite token
 * @param password - User password
 */
export async function signup(
  page: Page,
  context: BrowserContext,
  email: string,
  name: string,
  token: string,
  password: string,
) {
  await page.goto(`auth/signup?invite=${token}`);
  const nameLabel = page.getByLabel('Name');
  await nameLabel.fill(name);
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').first().fill(password);
  await page.getByLabel('Repeat Password').fill(password);
  await page.getByRole('button', { name: 'Sign up' }).click();
  await expect(nameLabel).not.toBeVisible({ timeout: 15000 });
  await page.goto('');
  await expect(page.getByText('Login').first()).toBeVisible();
}
