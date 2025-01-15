// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Import the functions you need from the SDKs you need
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "racial-harmony-5.firebaseapp.com",
  projectId: "racial-harmony-5",
  storageBucket: "racial-harmony-5.firebasestorage.app",
  messagingSenderId: "1084468393654",
  appId: "1:1084468393654:web:f96684cc9a7b6a06069817"
};


// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 
export const auth = getAuth(app);
export const database = getFirestore(app);
