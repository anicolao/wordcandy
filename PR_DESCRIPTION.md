## Fix: Drag Visibility Regression & Interaction Polish

## Summary
Addressed a critical regression where tile text would disappear instantly upon dragging. Also refined the drag interaction logic to implement a "Sticky Click" threshold (0.5 units) to prevent accidental drag starts/vanishing on simple clicks.

## Changes

### 1. Fix: Drag Visibility (Occlusion)
- **Problem**: The invisible "Interaction Plane" (used to catch mouse events during drag) was jumping to `Y=2.0` and writing to the Depth Buffer. Even though it was transparent (`opacity={0}`), the 3D renderer treated it as a solid wall, occluding the text components below it.
- **Fix**: Added `depthWrite={false}` to the Interaction Plane's material in `UnifiedGame.svelte`. This allows the text to render correctly "behind" the event catcher.

### 2. Enhancement: "Sticky Click" Threshold
- **Problem**: The original tile would vanish instantly on `pointerdown`, causing a visual glitch if the user just clicked or held the mouse without moving.
- **Solution**: Implemented a drag threshold of **0.5 units**. The static tile remains visible on click. The transition to "Ghost Tile" mode only occurs after the mouse has moved significantly.
- **Files**: `UnifiedGame.svelte` (Updated `handlePointerDown`, `handlePointerMove`, `handlePointerUp`).

### 3. Cleanup & Verification
- **Code**: Fixed a syntax error introduced during debugging (nested functions).
- **Tests**: Updated `mvp.spec.ts` to target canvas elements instead of obsolete DOM nodes (`.board-wrapper`).
- **Snapshots**: Regenerated E2E snapshots to reflect the valid visual state.

## Testing
- Verified visually in browser: Text remains visible during drag.
- Verified "Sticky Click": Clicking a tile does not make it vanish.
- Passed `npm run test:e2e`.

## Original User Prompt
> The text on all the tiles is still disappearing during drag. This wasn't happening when we first implemented drag.
...
> ***NO NO NO***, you are not paying attention to what I'm telling you... Logically, that must mean you do something on drag start that wrecks the render.
...
> Much better! But, when mousedown happens, the tile vanishes. it reappears as soon as the drag moves it a bit...
 Candy".
