import { createSlice, type PayloadAction } from '@reduxjs/toolkit';

interface Tile {
    id: string;
    letter: string;
    value: number;
}

interface GameState {
    rack: Tile[];
    board: Record<string, Tile>; // key: "x,y"
    score: number;
    submitted: boolean;
}

const initialState: GameState = {
    rack: [],
    board: {},
    score: 0,
    submitted: false
};

const gameSlice = createSlice({
    name: 'game',
    initialState,
    reducers: {
        initializeGame: (state, action: PayloadAction<{ tiles: Tile[] }>) => {
            state.rack = action.payload.tiles;
            state.board = {};
            state.score = 0;
            state.submitted = false;
        },
        placeTile: (state, action: PayloadAction<{ tileId: string, x: number, y: number }>) => {
            // Logic to move tile from rack/board to board
        },
        returnTileToRack: (state, action: PayloadAction<{ tileId: string }>) => {
            // Logic to return tile
        },
        submitWord: (state) => {
            // Logic to validate and finalize
            state.submitted = true;
        }
    }
});

export const { initializeGame, placeTile, returnTileToRack, submitWord } = gameSlice.actions;
export const gameReducer = gameSlice.reducer;
