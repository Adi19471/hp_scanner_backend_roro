import { test, expect } from '@playwright/test';

test('Login Page Test', async ({ page }) => {

    // 👉 Open login page
    await page.goto('https://example.com/login');

    // 👉 Enter username
    await page.fill('#username', 'testuser');

    // 👉 Enter password
    await page.fill('#password', 'test123');

    // 👉 Click login button
    await page.click('#loginButton');

    // 👉 Verify successful login (change selector based on your app)
    await expect(page).toHaveURL(/dashboard/);

    // OR check welcome text
    await expect(page.locator('text=Welcome')).toBeVisible();

});