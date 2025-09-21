import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyBdVQfN6RtZtfGY1FAXuXXT1lrnV2XarPI",
  authDomain: "studio-6517283771-3fc00.firebaseapp.com",
  projectId: "studio-6517283771-3fc00",
  storageBucket: "studio-6517283771-3fc00.appspot.com",
  messagingSenderId: "1017823610994",
  appId: "1:1017823610994:web:114735ab9896cf63c3daeb"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
