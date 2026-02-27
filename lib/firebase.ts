// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAnalytics, isSupported } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyD0SDYS3wTUDM3PLvLUsM0I2-a9vsjdxuM",
  authDomain: "obels-d68c0.firebaseapp.com",
  projectId: "obels-d68c0",
  storageBucket: "obels-d68c0.firebasestorage.app",
  messagingSenderId: "10130857024",
  appId: "1:10130857024:web:d3b9a3b56cb9e843e993a5",
  measurementId: "G-H95LTZHK9E"
};

// Initialize Firebase (Safely for Next.js SSR)
const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);

const auth = getAuth(app);
const db = getFirestore(app);

// Initialize Analytics conditionally since it only works in the browser
let analytics;
if (typeof window !== "undefined") {
  isSupported().then((supported) => {
    if (supported) {
      analytics = getAnalytics(app);
    }
  });
}

export { app, auth, db, analytics };
