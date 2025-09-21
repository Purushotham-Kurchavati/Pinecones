import { initializeApp, getApps, getApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSydsL5s-g1i3d3_sassycheese-iWi6_5Xjsjc",
  authDomain: "studio-6517283771-3fc00.firebaseapp.com",
  projectId: "studio-6517283771-3fc00",
  storageBucket: "studio-6517283771-3fc00.appspot.com",
  messagingSenderId: "1758416904232",
  appId: "1:1758416904232:web:7f6a7071018507851b22e7"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
