import { test, expect } from '@playwright/test';

test('MVP Walkthrough', async ({ page }) => {
    // 1. Visit Home
    await page.goto('/');
    await expect(page.locator('h1')).toHaveText('WordCandy');

    // 2. Click Play
    await page.click('text=PLAY');
    await expect(page).toHaveURL('/play');

    // 3. Verify Game Elements
    await expect(page.locator('.game-header')).toContainText('Daily Challenge');
    await expect(page.locator('.score')).toContainText('Score: 0');

    // 4. Verify Board (Canvas)
    // Note: Canvas interactions are hard to test, just checking existence
    await expect(page.locator('canvas')).toBeVisible();

    // 5. Verify Rack
    await expect(page.locator('.rack-slot')).toHaveCount(8);

    // 6. Verify Submit Button
    await expect(page.locator('button.submit-btn')).toBeVisible();
});
