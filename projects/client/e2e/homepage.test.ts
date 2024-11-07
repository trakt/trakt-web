import { expect, test } from '@playwright/test';

test('home page has title contain Trakt', async ({ page }) => {
  await page.goto('/');
  expect(await page.title()).toContain('Trakt');
});
