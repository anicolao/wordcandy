import { initializeApp, getApps, getApp, type FirebaseApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {
    getAuth,
    GoogleAuthProvider,
    signInWithPopup,
    onAuthStateChanged,
    signOut as firebaseSignOut,
    type User
} from "firebase/auth";
import { writable } from "svelte/store";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDWrBRQmuUsXbBafUL5nrZ34YbqQnXQZJk",
    authDomain: "wordcandy-762b1.firebaseapp.com",
    projectId: "wordcandy-762b1",
    storageBucket: "wordcandy-762b1.firebasestorage.app",
    messagingSenderId: "676984498397",
    appId: "1:676984498397:web:27d8d2099da9868e925334",
    measurementId: "G-VWGYXWPJLN"
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
    if (typeof window !== 'undefined') {
        analytics = getAnalytics(app);
        auth = getAuth(app);

        onAuthStateChanged(auth, (u) => {
            user.set(u);
        });
    }
};

// Auth Actions
export const signInWithGoogle = async () => {
    if (!auth) return;
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
