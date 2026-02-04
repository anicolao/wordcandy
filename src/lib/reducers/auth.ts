import { createSlice, type PayloadAction } from "@reduxjs/toolkit";

interface AuthState {
  uid: string | null;
  user: {
    displayName: string;
    email: string;
    photoURL: string;
  } | null;
  signedIn: boolean;
}

const initialState: AuthState = {
  uid: "local-user-123",
  user: {
    displayName: "Test User",
    email: "test@example.com",
    photoURL: "",
  },
  signedIn: true,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    signIn: (
      state,
      action: PayloadAction<{ uid: string; user: AuthState["user"] }>,
    ) => {
      state.uid = action.payload.uid;
      state.user = action.payload.user;
      state.signedIn = true;
    },
    signOut: (state) => {
      state.uid = null;
      state.user = null;
      state.signedIn = false;
    },
  },
});

export const { signIn, signOut } = authSlice.actions;
export const authReducer = authSlice.reducer;
