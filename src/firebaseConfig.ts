import { initializeApp } from "firebase/app";
import { getAuth, createUserWithEmailAndPassword, GoogleAuthProvider, FacebookAuthProvider, signInWithPopup, signOut } from "firebase/auth";
import { getFirestore, doc, setDoc } from "firebase/firestore";


// 🔥 Replace these values with your actual Firebase config from the Firebase Console
const firebaseConfig = {
    apiKey: "AIzaSyCmLMI1z1dlv9CaIhSLTilBCR_cDtT9-0o",
    authDomain: "fylinde-app.firebaseapp.com",
    projectId: "fylinde-app",
    storageBucket: "fylinde-app.firebasestorage.app",
    messagingSenderId: "316691824419",
    appId: "1:316691824419:web:fbf5401481a51f671a5696",
    measurementId: "G-YQV6HNHGVW"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

// Social Login Providers
const googleProvider = new GoogleAuthProvider();
const facebookProvider = new FacebookAuthProvider();

export { auth, db, googleProvider, facebookProvider, createUserWithEmailAndPassword, signInWithPopup, setDoc, doc, signOut };
