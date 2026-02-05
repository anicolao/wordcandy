import { configureStore } from "@reduxjs/toolkit";
import type { Middleware } from "@reduxjs/toolkit";
import { createSlice, type PayloadAction } from "@reduxjs/toolkit";
import { gameReducer } from "./reducers/game";
import { authReducer } from "./reducers/auth";
import { writable } from "svelte/store";

// Drag Slice
interface DragState {
  draggingTileId: string | null;
}

const initialDragState: DragState = {
  draggingTileId: null,
};

const dragSlice = createSlice({
  name: 'drag',
  initialState: initialDragState,
  reducers: {
    startDrag: (state, action: PayloadAction<string>) => {
      state.draggingTileId = action.payload;
    },
    stopDrag: (state) => {
      state.draggingTileId = null;
    }
  }
});

export const { startDrag, stopDrag } = dragSlice.actions;
export const dragReducer = dragSlice.reducer;

// Event Sourcing Middleware (Simplified for MVP)
const eventSourcingMiddleware: Middleware = (store) => (next) => (action) => {
  // Determine if this action should be persisted or broadcasted
  // For MVP, we mainly care about 'SUBMIT_WORD' or similar significant events.
  // Local moves might be kept in memory or local storage.

  // console.log('Dispatching:', action);
  const result = next(action);

  // Check state after action
  // const state = store.getState();

  return result;
};

// Svelte Store Binder
function createStore() {
  const store = configureStore({
    reducer: {
      game: gameReducer,
      auth: authReducer,
      drag: dragReducer,
    },
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware().concat(eventSourcingMiddleware),
  });

  const { subscribe } = writable(store.getState(), (set) => {
    const unsubscribe = store.subscribe(() => {
      set(store.getState());
    });
    return unsubscribe;
  });

  return {
    subscribe,
    dispatch: store.dispatch,
    getState: store.getState,
  };
}

export const store = createStore();

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
