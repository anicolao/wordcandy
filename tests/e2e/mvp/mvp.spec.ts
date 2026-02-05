import { test, expect } from "@playwright/test";
import { TestStepHelper } from "../helpers/test-step-helper";

test("MVP Walkthrough", async ({ page }, testInfo) => {
  const tester = new TestStepHelper(page, testInfo);
  tester.setMetadata(
    "MVP Walkthrough",
    "Verify the core MVP flows: Landing, Sign-In, Lobby, and Gameplay.",
  );

  // 1. Landing Page
  // Capture console logs for debugging
  page.on('console', msg => console.log(`[BROWSER] ${msg.text()}`));

  await page.goto("/");
  await tester.step("00-landing", {
    description: "Landing Page",
    verifications: [
      {
        spec: "Title is WordCandy",
        check: async () => await expect(page).toHaveTitle(/WordCandy/),
      },
      {
        spec: "Sign In button is visible",
        check: async () =>
          await expect(
            page.getByRole("button", { name: "Sign in with Google" }),
          ).toBeVisible(),
      },
    ],
  });

  // 2. Sign In Flow (Emulator Popup)
  // Trigger popup and wait for it
  const popupPromise = page.waitForEvent('popup');
  await page.getByRole("button", { name: "Sign in with Google" }).click();
  const popup = await popupPromise;
  await popup.waitForLoadState();

  // Interact with Firebase Auth Emulator UI
  console.log('Interacting with Popup...');

  // Wait for either list or add button
  const emulatorUI = popup.locator('.js-new-account, .js-reuse-account').first();
  await emulatorUI.waitFor({ state: 'visible', timeout: 10000 });

  if (await popup.locator('.js-reuse-account').count() > 0) {
    console.log('Clicking Existing Account');
    // Click the first account's button (usually the list item itself or a button inside)
    // Based on HTML dump: .js-reuse-account allows click
    await popup.locator('.js-reuse-account').first().click();
  } else {
    console.log('Creating New Account');
    await popup.locator('.js-new-account').click();

    const autogen = popup.locator('#autogen-button');
    await autogen.waitFor({ state: 'visible' });
    await autogen.click();

    await popup.locator('#sign-in').click();
  }

  // Wait for popup to close
  await popup.waitForEvent('close');
  console.log('Popup Closed');

  // Wait for main page to reflect login
  await expect(page.getByRole("link", { name: "PLAY" })).toBeVisible({ timeout: 10000 });

  await tester.step("01-lobby", {
    description: "Lobby (Signed In)",
    verifications: [
      {
        spec: "Play button is visible",
        check: async () =>
          await expect(
            page.getByRole("link", { name: "PLAY" }),
          ).toBeVisible(),
      },
    ],
  });

  // 3. Navigate to Gameplay (with deterministic params)
  // We click the link to verify routing, then reload with parameters for the snapshot
  await page.getByRole("link", { name: "PLAY" }).click();
  await expect(page).toHaveURL(/\/play/);

  // Reload with Frozen/Seed params for deterministic snapshot
  await page.goto("/play?frozen=10&seed=123");

  // 4. Verify Gameplay Elements
  await tester.step("02-gameplay", {
    description: "Enter Gameplay",
    verifications: [
      {
        spec: "URL is /play",
        check: async () => await expect(page).toHaveURL(/\/play/),
      },
      {
        spec: "Header says Daily Challenge",
        check: async () =>
          await expect(page.locator(".game-header")).toContainText(
            "Daily Challenge",
          ),
      },
      {
        spec: "Game container is visible",
        check: async () =>
          await expect(page.locator(".game-wrapper canvas")).toBeVisible(),
      },
      {
        spec: "Rack tiles are present (Logic Check)",
        check: async () =>
          await expect(page.locator('[data-testid="rack-tile"]')).toHaveCount(8),
      },
      // Note: We snapshot here with frozen params to ensure pixel-perfect determinism
    ],
  });

  tester.generateDocs();
});
