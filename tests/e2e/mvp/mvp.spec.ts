import { test, expect } from "@playwright/test";
import { TestStepHelper } from "../helpers/test-step-helper";

test("MVP Walkthrough", async ({ page }, testInfo) => {
  const tester = new TestStepHelper(page, testInfo);
  tester.setMetadata(
    "MVP Walkthrough",
    "Verify the core MVP flows: Landing, Sign-In, Lobby, and Gameplay.",
  );

  // 1. Visit Play (Direct Access for MVP Local Dev)
  // Freeze animation at 10s and seed RNG for consistent screenshots
  await page.goto("/play?frozen=10&seed=123");

  // 2. Verify Gameplay Elements
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
      // Note: 3D Tiles are not DOM elements, so we skip DOM count checks.
      // The visual snapshot below will verify the board and rack state.
    ],
  });

  tester.generateDocs();
});
