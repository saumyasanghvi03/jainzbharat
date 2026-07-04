import { expect, test } from '@playwright/test';
test('homepage renders mission and declaration link', async ({ page }) => { await page.goto('/'); await expect(page.getByRole('heading', { name: /open digital civilization/i })).toBeVisible(); await expect(page.getByRole('link', { name: /read declaration/i })).toBeVisible(); });
