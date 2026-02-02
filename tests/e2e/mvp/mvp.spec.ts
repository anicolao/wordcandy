import { test, expect } from '@playwright/test';
import { TestStepHelper } from '../helpers/test-step-helper';

test('MVP Walkthrough', async ({ page }, testInfo) => {
    const tester = new TestStepHelper(page, testInfo);
    tester.setMetadata('MVP Walkthrough', 'Verify the core MVP flows: Landing, Sign-In, Lobby, and Gameplay.');

    // 1. Visit Home
    await page.goto('/');
    await tester.step('01-landing', {
        description: 'Initial Landing Page',
        verifications: [
            { spec: 'Title is WordCandy', check: async () => await expect(page.locator('h1')).toHaveText('WordCandy') },
            { spec: 'Play button exists', check: async () => await expect(page.locator('text=PLAY')).toBeVisible() }
        ]
    });

    // 2. Click Play
    await page.click('text=PLAY');
    await tester.step('02-gameplay', {
        description: 'Enter Gameplay',
        verifications: [
            { spec: 'URL is /play', check: async () => await expect(page).toHaveURL('/play') },
            { spec: 'Header says Daily Challenge', check: async () => await expect(page.locator('.game-header')).toContainText('Daily Challenge') },
            { spec: 'Board is visible', check: async () => await expect(page.locator('.board-wrapper')).toBeVisible() },
            { spec: 'Rack has 8 slots', check: async () => await expect(page.locator('.rack-slot')).toHaveCount(8) }
        ]
    });

    tester.generateDocs();
});
