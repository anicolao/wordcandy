# Redux Actions

This document records the Redux actions and their purpose for the WordCandy application. These actions drive the game state transitions in `src/lib/reducers/game.ts`.

## Game Initialization

### `game/initializeGame`

- **Purpose**: Sets up the initial game state for a new session. It populates the tile bag based on the standard distribution, shuffles it, and initializes player states.
- **Payload**:
  ```typescript
  {
    playerIds: string[]; // Array of player IDs (e.g., ["uid123"])
  }
  ```
- **State Changes**:
  - `bag`: Populated with shuffled tiles (e.g., 100 tiles for Scrabble distribution).
  - `players`: Initialized with empty racks and 0 score.
  - `board`: Reset to empty `{}`.
  - `currentPlayerId`: Set to the first player in the list.
  - `submitted`: Set to `false`.

## Gameplay

### `game/drawTiles`

- **Purpose**: Draws tiles from the global bag to refill a player's rack up to the maximum capacity (7 or 8, defined by `RACK_CAPACITY`).
- **Payload**:
  ```typescript
  {
    playerId: string; // The player drawing tiles
  }
  ```
- **State Changes**:
  - `bag`: Tiles are removed from the start of the array.
  - `players[playerId].rack`: Drawn tiles are appended to the player's rack.

### `game/placeTile` (Stub)

- **Purpose**: Moves a specific tile from a player's rack to a coordinate on the board.
- **Payload**:
  ```typescript
  {
    tileId: string; // Unique ID of the tile (e.g. "A-1")
    x: number; // Grid X coordinate
    y: number; // Grid Y coordinate
  }
  ```
- **State Changes**:
  - Updates `board` with the new tile position.
  - Removes tile from `players[playerId].rack` (or marks it as placed).

### `game/returnTileToRack` (Stub)

- **Purpose**: Returns a tentatively placed tile from the board back to the player's rack.
- **Payload**:
  ```typescript
  {
    tileId: string; // The tile to recall
  }
  ```
- **State Changes**:
  - Removes tile from `board`.
  - Adds tile back to `players[playerId].rack`.

### `game/submitWord` (Stub)

- **Purpose**: Commits the current board state as a valid move, triggering validation and scoring.
- **Payload**: `void`
- **State Changes**:
  - `submitted`: Set to `true`.
  - (Future): Validates word connectivity and dictionary existence.
  - (Future): Calculates score and updates `players[playerId].score`.
  - (Future): Advances `currentPlayerId`.
