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
      // Logic to move tile from rack/board to board
    },
    returnTileToRack: (state, action: PayloadAction<{ tileId: string }>) => {
      // Logic to return tile
    },
    submitWord: (state) => {
      // Logic to validate and finalize
      state.submitted = true;
    },
  },
});

export const {
  initializeGame,
  drawTiles,
  placeTile,
  returnTileToRack,
  submitWord,
} = gameSlice.actions;
export const gameReducer = gameSlice.reducer;
