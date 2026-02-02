# Development Guide

Welcome to the **WordCandy** development team. This guide outlines the standards and workflows required to contribute to this project. Your primary goal is to build a high-quality, resilient, and visually stunning application.

## 1. Quick Start

1.  **Environment**: Ensure you are in the project's Nix environment (`nix develop`).
2.  **Install**: Run `npm install`.
3.  **Dev Server**: Run `npm run dev`.
4.  **Test**: Run `npm run test:e2e` to verify the baseline.

## 2. Core Workflow (AI Agents & Humans)

We follow a strict rigorous process:

1.  **Write Tests First**:
    *   Before writing implementation code, write a test that fails.
    *   **Unit Tests**: For logic (reducers, utils).
    *   **E2E Tests**: For features (user flows). See [E2E_GUIDE.md](./E2E_GUIDE.md) for our **Zero-Pixel Tolerance** policy.
    *   **Note**: You MUST use the `TestStepHelper` to auto-generate standard screenshots and documentation (`README.md`) for every E2E test. Do not write raw Playwright tests without this wrapper.

2.  **Design & Plan**:
    *   For complex features, write a design document in `docs/designs/`.
    *   Update `implementation_plan.md` before coding.

3.  **Implement**:
    *   Write the code.
    *   Ensure **Green Tests**: All tests must pass.
    *   **Event Sourcing**: Use the Redux+Firestore pattern defined in [EVENT_SOURCING.md](./EVENT_SOURCING.md). record "facts on the ground".

4.  **Submit PR**:
    *   Create a branch: `feature/your-feature-name`.
    *   Push execution.
    *   Use `gh pr create` to submit.
    *   **Comment**: Your PR description must include the *original user prompt* and context.

## 3. Technology Stack

-   **Frontend**: SvelteKit + Threlte (3D).
-   **State**: Redux (Event Sourced).
-   **Backend**: Firebase (Firestore, Auth, Hosting).
-   **Testing**: Playwright (E2E), Vitest (Unit).
-   **Styling**: "Nano Banana" Design System (CSS Variables, Glassmorphism).

## 4. Key References

-   **[E2E_GUIDE.md](./E2E_GUIDE.md)**: How to write zero-tolerance visual tests.
-   **[EVENT_SOURCING.md](./EVENT_SOURCING.md)**: How to manage state and multiplayer sync.
-   **[MVP_DESIGN.md](./MVP_DESIGN.md)**: The minimal scope for the initial release.

## 5. Development Tips

-   **Emulators**: We use Firebase Emulators for local development. Run `npm run emulators` in a separate terminal BEFORE running `npm run test:e2e`.
-   **Reducers**: Logic lives in reducers. If the state is wrong, fix the reducer, don't patch the state.
