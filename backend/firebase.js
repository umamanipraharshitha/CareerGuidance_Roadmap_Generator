// src/firebase.js
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

// Your Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyApeiEU6nIJBWTDkcdjKQfZvkJYx14c8m4",
  authDomain: "csp-2025-44e86.firebaseapp.com",
  projectId: "csp-2025-44e86",
  storageBucket: "csp-2025-44e86.appspot.com",
  messagingSenderId: "681766331900",
  appId: "1:681766331900:web:fae424eedb1e1b8f5c3e79",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Firebase Auth
const auth = getAuth(app);

// Google Auth Provider
const googleProvider = new GoogleAuthProvider();

export { app, auth, googleProvider };
