# WordCandy MVP Walkthrough

I have implemented the Minimum Viable Product for WordCandy.

## Changes

- **Project Structure**: Initialized SvelteKit project with Threlte (3D) and Redux.
- **Dependencies**: Added `three`, `@threlte/core`, `@reduxjs/toolkit`, `firebase`, `playwright`.
- **Core Logic**:
  - `src/lib/store.ts`: Redux store with event sourcing middleware placeholder.
  - `src/lib/firebase.ts`: Firebase configuration with Authentication support.
  - `src/lib/reducers/game.ts`: Game logic (score, rack, board).
- **UI**:
  - `src/routes/+page.svelte`: Daily Lobby with Sign-In/Sign-Out.
  - `src/routes/play/+page.svelte`: Gameplay view.
  - `src/lib/components/game/Board.svelte`: 3D Board component.
- **Testing**:
  - Created `tests/e2e/mvp/mvp.spec.ts` using `TestStepHelper`.
  - Generated verification artifacts:
    - `tests/e2e/mvp/README.md`
    - `tests/e2e/mvp/screenshots/`

- **CI/CD**:
  - `.github/workflows/playwright.yml`: GitHub Action to run E2E tests with Firebase Auth Emulator (`emulators:exec`).
- **Documentation**:
  - `docs/AUTH_SETUP.md`: Guide for configuring Auth domains for hosted deployments.

## Verification Results

- **E2E Test**:
  - **Requirement**: `npm run emulators` must be running (handled automatically in CI).
  - Checks: Sign In (Emulator), Lobby, Gameplay.
  - Zero-pixel tolerance enforced via `Playwright`.
  - Artifacts generated in `tests/e2e/mvp/`.
  - `README.md` correctly links to committed screenshots.
  - See `tests/e2e/mvp/README.md` for visual verification.

## Next Steps

1.  Review the PR.
2.  Connect to real Firebase instance (update config in `src/lib/firebase.ts`).
3.  Implement real-time Leaderboard with Firestore.
