import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import {
  TILE_DISTRIBUTION,
  TILE_VALUES,
  RACK_CAPACITY,
} from "../game/constants";

export interface Tile {
  id: string; // Unique ID (e.g., "A-1", "A-2")
  letter: string;
  value: number;
}

export interface PlayerState {
  id: string;
  rack: Tile[];
  score: number;
}

export interface GameState {
  bag: Tile[];
  players: Record<string, PlayerState>; // key: playerId
  board: Record<string, Tile>; // key: "x,y"
  currentPlayerId: string | null;
  submitted: boolean;
}

const initialState: GameState = {
  bag: [],
  players: {},
  board: {},
  currentPlayerId: null,
  submitted: false,
};

// Helper: Simple Linear Congruential Generator for seeding
class Seeder {
  private seed: number;
  constructor(seed: string) {
    // Simple hash to convert string to number
    let h = 0x811c9dc5;
    for (let i = 0; i < seed.length; i++) {
      h ^= seed.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    this.seed = h >>> 0;
  }

  random() {
    this.seed = (this.seed * 1664525 + 1013904223) % 4294967296;
    return this.seed / 4294967296;
  }
}

// Helper: Shuffle array in place (Fisher-Yates) using custom RNG logic
function shuffle<T>(array: T[], rng: () => number = Math.random): T[] {
  let currentIndex = array.length,
    randomIndex;
  while (currentIndex != 0) {
    randomIndex = Math.floor(rng() * currentIndex);
    currentIndex--;
    [array[currentIndex], array[randomIndex]] = [
      array[randomIndex],
      array[currentIndex],
    ];
  }
  return array;
}

const gameSlice = createSlice({
  name: "game",
  initialState,
  reducers: {
    initializeGame: (
      state,
      action: PayloadAction<{ playerIds: string[]; seed?: string }>,
    ) => {
      console.log("REDUCER: initializeGame", action.payload);

      // Setup RNG
      const rng = action.payload.seed
        ? new Seeder(action.payload.seed).random.bind(
          new Seeder(action.payload.seed),
        )
        : Math.random;

      // 1. Create Bag
      const bag: Tile[] = [];
      if (!TILE_DISTRIBUTION) {
        console.error("REDUCER: TILE_DISTRIBUTION is undefined");
        return;
      }
      Object.entries(TILE_DISTRIBUTION).forEach(([letter, count]) => {
        for (let i = 0; i < count; i++) {
          bag.push({
            id: `${letter}-${i}`,
            letter,
            value: TILE_VALUES[letter] || 0,
          });
        }
      });
      state.bag = shuffle(bag, rng);
      console.log("REDUCER: Bag created, size:", state.bag.length);

      // 2. Initialize Players
      state.players = {};
      action.payload.playerIds.forEach((id) => {
        state.players[id] = {
          id,
          rack: [],
          score: 0,
        };
      });
      console.log("REDUCER: ensure players", JSON.stringify(state.players));

      // 3. Reset Board & State
      state.board = {};
      state.submitted = false;
      state.currentPlayerId = action.payload.playerIds[0] || null;
    },
    drawTiles: (state, action: PayloadAction<{ playerId: string }>) => {
      console.log("REDUCER: drawTiles", action.payload);
      const player = state.players[action.payload.playerId];
      if (!player) {
        console.error("REDUCER: Player not found", action.payload.playerId);
        return;
      }

      const needed = RACK_CAPACITY - player.rack.length;
      if (needed <= 0) return;

      console.log(
        "REDUCER: Drawing",
        needed,
        "from bag size",
        state.bag.length,
      );
      const drawn = state.bag.splice(0, needed);
      player.rack.push(...drawn);
      console.log("REDUCER: Player rack size now", player.rack.length);
    },
    placeTile: (
      state,
      action: PayloadAction<{ tileId: string; x: number; y: number }>,
    ) => {
      const { tileId, x, y } = action.payload;
      const key = `${x},${y}`;
      console.log(`REDUCER: placing tile ${tileId} at ${key}`);

      // 1. Check if spot is occupied
      if (state.board[key]) {
        console.warn(`REDUCER: Space ${key} already occupied`);
        return;
      }

      // 2. Debug/Test Mode
      if (tileId.startsWith("debug-")) {
        const letter = tileId.split("-")[1] || "?";
        state.board[key] = {
          id: tileId,
          letter,
          value: TILE_VALUES[letter] || 0,
        };
        return;
      }

      // 3. Search in Racks (Rack -> Board)
      let foundPlayerId: string | undefined;
      let tileIndex = -1;

      for (const pid of Object.keys(state.players)) {
        const idx = state.players[pid].rack.findIndex((t) => t.id === tileId);
        if (idx !== -1) {
          foundPlayerId = pid;
          tileIndex = idx;
          break;
        }
      }

      if (foundPlayerId && tileIndex !== -1) {
        // Rack -> Board
        const tile = state.players[foundPlayerId].rack[tileIndex];
        state.players[foundPlayerId].rack.splice(tileIndex, 1);
        state.board[key] = tile;
        console.log(`REDUCER: Moved tile ${tile.letter} from Rack to ${key}`);
        return;
      }

      // 4. Search on Board (Board -> Board)
      const oldKey = Object.keys(state.board).find(k => state.board[k].id === tileId);
      if (oldKey) {
        const tile = state.board[oldKey];
        delete state.board[oldKey];
        state.board[key] = tile;
        console.log(`REDUCER: Moved tile ${tile.letter} from ${oldKey} to ${key}`);
        return;
      }

      console.error("REDUCER: Tile not found in any rack or on board", tileId);
    },
    returnTileToRack: (state, action: PayloadAction<{ tileId: string }>) => {
      const { tileId } = action.payload;
      // Find on board
      const boardKey = Object.keys(state.board).find(k => state.board[k].id === tileId);
      if (boardKey) {
        const tile = state.board[boardKey];
        delete state.board[boardKey];

        // Add to current player's rack
        const pid = state.currentPlayerId;
        if (pid && state.players[pid]) {
          state.players[pid].rack.push(tile);
          console.log(`REDUCER: Returned ${tile.letter} from board to player ${pid}`);
        } else {
          // Fallback: first player
          const firstPid = Object.keys(state.players)[0];
          if (firstPid) state.players[firstPid].rack.push(tile);
        }
      }
    },
    joinGame: (state, action: PayloadAction<{ uid: string; name?: string; seed?: string }>) => {
      const { uid, seed } = action.payload;
      console.log("REDUCER: joinGame", uid, seed ? `(Seed: ${seed})` : "(Random)");

      // Lazy Init: If bag is empty, fill it (assuming game hasn't truly started)
      if (state.bag.length === 0 && Object.keys(state.players).length === 0) {
        // Setup RNG (Seeded or Random)
        const rng = seed
          ? new Seeder(seed).random.bind(new Seeder(seed))
          : Math.random;

        console.log("REDUCER: Lazy initializing bag for first joiner");
        if (TILE_DISTRIBUTION) {
          Object.entries(TILE_DISTRIBUTION).forEach(([letter, count]) => {
            for (let i = 0; i < count; i++) {
              state.bag.push({
                id: `${letter}-${i}`,
                letter,
                value: TILE_VALUES[letter] || 0,
              });
            }
          });
          state.bag = shuffle(state.bag, rng);
        }
      }

      if (!state.players[uid]) {
        state.players[uid] = {
          id: uid,
          rack: [],
          score: 0,
        };
        // Set as current player if none exists
        if (!state.currentPlayerId) {
          state.currentPlayerId = uid;
        }
        console.log(`REDUCER: Player ${uid} joined.`);
      }
    },
    submitWord: (state) => {
      state.submitted = true;
    },
  },
});

export const {
  initializeGame,
  joinGame,
  drawTiles,
  placeTile,
  returnTileToRack,
  submitWord,
} = gameSlice.actions;
export const gameReducer = gameSlice.reducer;
