// src/firebase/config.js
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDukWsah9iWICjZNOE47xBaheH3XWITpX4",
  authDomain: "minimal-inventory-project.firebaseapp.com",
  projectId: "minimal-inventory-project",
  storageBucket: "minimal-inventory-project.firebasestorage.app",
  messagingSenderId: "936337316761",
  appId: "1:936337316761:web:2d9a044807d5c8d18f9108",
  measurementId: "G-8T8YKWX95F"
};


const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { app, auth, db };
