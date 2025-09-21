import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyC08nC2tG_...REDACTED",
  authDomain: "studio-6517283771-3fc00.firebaseapp.com",
  projectId: "studio-6517283771-3fc00",
  storageBucket: "studio-6517283771-3fc00.appspot.com",
  messagingSenderId: "1017823610994",
  appId: "1:1017823610994:web:e459a728ac7c524e12de97",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
