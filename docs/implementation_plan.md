# Implementation Plan - WordCandy MVP

This plan outlines the steps to initialize the WordCandy project and implement the Minimum Viable Product (MVP) as defined in `MVP_DESIGN.md`.

## Goal Description
Build a "Duplicate Crossword" daily challenge web application.
- **Root**: `/Users/anicolao/projects/antigravity/wordcandy`
- **Stack**: SvelteKit, Threlte (3D), Redux (Event Sourcing), Firebase, Playwright.
- **Design**: "Nano Banana" (Dark mode, Neon, Glassmorphism).

## User Review Required
- **Project Structure**: I will initialize a new SvelteKit app directly in the root directory. This might overwrite existing files if not careful, but I will ensure `words`, `food`, and `admin` directories are preserved.
- **Porting**: I will adapt core logic from `words` but refactor it to match the "Nano Banana" aesthetic and strict MVP requirements (no chat, no multiplayer moves broadcasting).

## Proposed Changes

### 1. Project Initialization
#### [NEW] [flake.nix](file:///Users/anicolao/projects/antigravity/wordcandy/flake.nix)
- Define dev environment with Node.js, Playwright dependencies.

#### [NEW] [package.json](file:///Users/anicolao/projects/antigravity/wordcandy/package.json)
- Define dependencies: SvelteKit, Threlte, Redux Toolkit, Firebase, Three.js.

#### [NEW] [svelte.config.js](file:///Users/anicolao/projects/antigravity/wordcandy/svelte.config.js)
- SvelteKit configuration.

#### [NEW] [vite.config.ts](file:///Users/anicolao/projects/antigravity/wordcandy/vite.config.ts)
- Vite configuration.

### 2. Core Infrastructure
#### [NEW] src/lib/store.ts
- Redux store configuration with Svelte binding (adapted from `words`).
- Event sourcing middleware.

#### [NEW] src/lib/firebase.ts
- Firebase initialization and Firestore helpers.

#### [NEW] src/lib/styles/app.css
- Global styles implementing "Nano Banana" variables (colors, fonts).

### 3. MVP Features
#### [NEW] src/routes/+layout.svelte
- Main layout with Auth check and Navigation.

#### [NEW] src/routes/+page.svelte
- Daily Lobby (Play button, Countdown, Leaderboard teaser).

#### [NEW] src/routes/play/+page.svelte
- Main Gameplay view.
- 3D Board (Threlte Canvas).
- Rack (Drag & Drop).

#### [NEW] src/lib/components/game/Board.svelte
- Threlte 3D board implementation.

#### [NEW] src/lib/reducers/game.ts
- Redux logic for tile placement, validation, and scoring.

## Verification Plan

### Automated Tests
- **E2E Tests**: Run `npm run test:e2e` (Playwright).
    - `tests/e2e/auth.spec.ts`: Verify flow from Landing -> Google Sign-In -> Lobby.
    - `tests/e2e/gameplay.spec.ts`: Verify tile drag/drop and score update.
- **Unit Tests**: Run `npm run test:unit` (Vitest).
    - `src/lib/reducers/game.test.ts`: Verify scoring logic and reducer state changes.

### Manual Verification
1.  **Auth**: Sign in with Google Emulator.
2.  **Lobby**: Verify accurate countdown and "Play" button.
3.  **Gameplay**:
    - Drag tiles to board.
    - Verify words are validated (mock dictionary).
    - Verify score updates in real-time.
    - Submit word and verify Leaderboard update.
