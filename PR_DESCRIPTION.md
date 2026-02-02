# WordCandy MVP Implementation

## User Requests
> Read DEVELOPMENT.md and MVP_DESIGN.md and implement the MVP and corresponding e2e tests, put it up as a PR for me to review.

> words is not the target project. it is an example project you can use for reference, but you're meant to build a new (similar) thing in this top level folder, writing your own flake.nix and package.json as needed to install packages and software.

## Goal
Implement the core Minimum Viable Product for WordCandy, a duplicate crossword daily challenge game.

## Changes
- **Project Setup**:
    - Added `flake.nix` for consistent dev environment.
    - Added `package.json` with SvelteKit, Threlte, Redux, Firebase.
    - Configured Vite and Playwright.
- **Core Infrastructure**:
    - Implemented `src/lib/store.ts` with Redux and Event Sourcing middleware.
    - Implemented `src/lib/firebase.ts` for backend connection.
    - Added "Nano Banana" design system in `src/lib/styles/app.css`.
- **Features**:
    - **Daily Lobby**: Homepage with "Play" button.
    - **Gameplay**: `/play` route with 3D Board (Threlte) and Tile Rack.
    - **Board**: Basic 3D grid and camera controls.
- **Testing**:
    - Added `tests/e2e/mvp.spec.ts` verifying the flow from Lobby to Gameplay.
    - Configured Playwright to run on port 5179 to avoid conflicts.
- **Documentation**:
    - Added `docs/implementation_plan.md`.
    - Added `docs/walkthrough.md`.

## Verification
- Ran `npm run test:e2e` locally.
- 1 test passed (MVP Walkthrough).
