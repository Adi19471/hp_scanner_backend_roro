# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: login-page.spec.ts >> Login Page Test
- Location: tests\login-page.spec.ts:3:5

# Error details

```
Test timeout of 30000ms exceeded.
```

```
Error: page.fill: Test timeout of 30000ms exceeded.
Call log:
  - waiting for locator('#username')

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "Example Domain" [level=1] [ref=e3]
  - paragraph [ref=e4]: This domain is for use in documentation examples without needing permission. Avoid use in operations.
  - paragraph [ref=e5]:
    - link "Learn more" [ref=e6] [cursor=pointer]:
      - /url: https://iana.org/domains/example
```

# Test source

```ts
  1  | import { test, expect } from '@playwright/test';
  2  | 
  3  | test('Login Page Test', async ({ page }) => {
  4  | 
  5  |     // 👉 Open login page
  6  |     await page.goto('https://example.com/login');
  7  | 
  8  |     // 👉 Enter username
> 9  |     await page.fill('#username', 'testuser');
     |                ^ Error: page.fill: Test timeout of 30000ms exceeded.
  10 | 
  11 |     // 👉 Enter password
  12 |     await page.fill('#password', 'test123');
  13 | 
  14 |     // 👉 Click login button
  15 |     await page.click('#loginButton');
  16 | 
  17 |     // 👉 Verify successful login (change selector based on your app)
  18 |     await expect(page).toHaveURL(/dashboard/);
  19 | 
  20 |     // OR check welcome text
  21 |     await expect(page.locator('text=Welcome')).toBeVisible();
  22 | 
  23 | });
```