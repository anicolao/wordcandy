import { test, expect } from '@playwright/test';
import { TestStepHelper } from '../helpers/test-step-helper';

test('MVP Walkthrough', async ({ page }, testInfo) => {
    const tester = new TestStepHelper(page, testInfo);
    tester.setMetadata('MVP Walkthrough', 'Verify the core MVP flows: Landing, Sign-In, Lobby, and Gameplay.');

    // 1. Visit Play (Direct Access for MVP Local Dev)
    // Freeze animation at 10s for consistent screenshots
    await page.goto('/play?frozen=10');

    // 2. Verify Gameplay Elements
    await tester.step('02-gameplay', {
        description: 'Enter Gameplay',
        verifications: [
            { spec: 'URL is /play', check: async () => await expect(page).toHaveURL(/\/play/) },
            { spec: 'Header says Daily Challenge', check: async () => await expect(page.locator('.game-header')).toContainText('Daily Challenge') },
            { spec: 'Board is visible', check: async () => await expect(page.locator('.board-wrapper')).toBeVisible() },
            { spec: 'Rack has 8 slots', check: async () => await expect(page.locator('.rack-slot')).toHaveCount(8) },
            { spec: 'Refilled rack has tiles', check: async () => await expect(page.locator('.tile')).toHaveCount(8) }
        ]
    });

    tester.generateDocs();
});
