import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore, connectFirestoreEmulator, type Firestore } from 'firebase/firestore';

// Replace with your actual config
const firebaseConfig = {
    apiKey: "demo-key",
    authDomain: "demo-project.firebaseapp.com",
    projectId: "demo-project",
    storageBucket: "demo-project.appspot.com",
    messagingSenderId: "1234567890",
    appId: "1:1234567890:web:1234567890"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const firestore = getFirestore(app);

// Use emulators in development
if (import.meta.env.DEV) {
    // connectFirestoreEmulator(firestore, 'localhost', 8080);
    // connectAuthEmulator(auth, 'http://localhost:9099');
}

export { auth, firestore };
