import { initializeApp } from "firebase/app";
import { getAuth, Auth } from "firebase/auth";
import { getFirestore, Firestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCQRn6QerAL8U6Js-sXnPuWGJlRdCuA5Ng",
  authDomain: "english1-dc0f6.firebaseapp.com",
  projectId: "english1-dc0f6",
  storageBucket: "english1-dc0f6.firebasestorage.app",
  messagingSenderId: "816049586866",
  appId: "1:816049586866:web:90ba6d4ccd559fa1333fab",
  measurementId: "G-4GL8JFXZND"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
export const auth: Auth = getAuth(app);

// Initialize Firestore
export const db: Firestore = getFirestore(app);

export default app;
