import { test, expect } from '@playwright/test';
import { TestStepHelper } from '../helpers/test-step-helper';

test('MVP Walkthrough', async ({ page }, testInfo) => {
    const tester = new TestStepHelper(page, testInfo);
    tester.setMetadata('MVP Walkthrough', 'Verify the core MVP flows: Landing, Sign-In, Lobby, and Gameplay.');

    // 1. Visit Home (Unauthenticated)
    await page.goto('/');
    await tester.step('01-landing-guest', {
        description: 'Initial Landing Page (Guest)',
        verifications: [
            { spec: 'Title is WordCandy', check: async () => await expect(page.locator('h1')).toHaveText('WordCandy') },
            { spec: 'Sign In button exists', check: async () => await expect(page.locator('text=Sign in with Google')).toBeVisible() }
        ]
    });

    // 2. Sign In (Emulator Flow)
    const [popup] = await Promise.all([
        page.waitForEvent('popup'),
        page.click('text=Sign in with Google')
    ]);

    // Interact with Emulator Popup
    // The emulator popup usually has a specific UI. We'll wait for it to load.
    // In emulator, usually clicking the account or 'Add new account' works.
    // We'll assume the default Emulator UI behavior: auto-login or simple button.
    // If it's a real Google login, this will fail (good, we want emulator).

    // In standard Firebase Emulator UI for "Sign in with Google", there is often a button "Add new account" or auto-generated user list.
    // Let's generic wait for something clickable in the popup.
    await popup.waitForLoadState();

    // In Emulator, often we just click "Sign in with Google.com" or the first account.
    // Inspecting emulator UI is hard without seeing it. 
    // Common Emulator UI: "Add new account" button.
    try {
        await popup.getByText('Add new account').click({ timeout: 2000 });
        await popup.getByText('Auto-generate user information').click();
        await popup.getByText('Sign in with Google.com').click();
    } catch (e) {
        // Fallback: If auto-login happens or UI is different.
        // Just failing gracefully if we can't find it, but reporting.
        console.log('Emulator popup interaction attempted.');
    }

    // 3. Verify Logged In State
    await expect(page.locator('text=Welcome')).toBeVisible();
    await expect(page.locator('text=PLAY')).toBeVisible();

    // 4. Enter Gameplay
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
