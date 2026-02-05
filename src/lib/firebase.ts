import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
  getAuth,
  GoogleAuthProvider,
  signInWithPopup,
  onAuthStateChanged,
  signOut as firebaseSignOut,
  connectAuthEmulator,
  type User,
} from "firebase/auth";
import { writable } from "svelte/store";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY,
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: import.meta.env.VITE_FIREBASE_APP_ID,
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID,
};

// Initialize Firebase (Singleton pattern)
let app: FirebaseApp;
let auth: ReturnType<typeof getAuth>;
let analytics: ReturnType<typeof getAnalytics>;

if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

// Auth Store
export const user = writable<User | null>(null);

// Initialize Client-Side Services
export const initFirebase = () => {
  if (typeof window !== "undefined") {
    analytics = getAnalytics(app);
    auth = getAuth(app);

    // Connect to Auth Emulator in Dev
    if (location.hostname === "localhost") {
      // Port 9099 is default for Auth Emulator
      connectAuthEmulator(auth, "http://localhost:9099");
    }

    if (location.search.includes('mockAuth=1')) {
      // Skip listener in mock mode
    } else {
      onAuthStateChanged(auth, (u) => {
        user.set(u);
      });
    }
  }
};

// Auth Actions
export const signInWithGoogle = async () => {
  if (!auth) return;

  // E2E Test Bypass
  if (location.search.includes('mockAuth=1')) {
    console.log('Mocking Auth for E2E');
    user.set({
      uid: "local-user-123",
      displayName: "E2E User",
      email: "e2e@example.com",
    } as any);
    return;
  }

  const provider = new GoogleAuthProvider();
  try {
    await signInWithPopup(auth, provider);
  } catch (error) {
    console.error("Login failed", error);
  }
};

export const signOut = async () => {
  if (!auth) return;
  try {
    await firebaseSignOut(auth);
  } catch (error) {
    console.error("Logout failed", error);
  }
};
