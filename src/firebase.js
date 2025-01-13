// Import the functions you need from the SDKs you need
import { initializeApp} from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import {getAuth} from "firebase/auth"
import {getFirestore} from "firebase/firestore"
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: process.env.REACT_APP_FIREBASE_API_KEY,
  authDomain: "racialharmony-4.firebaseapp.com",
  projectId: "racialharmony-4",
  storageBucket: "racialharmony-4.firebasestorage.app",
  messagingSenderId: "1003081221824",
  appId: "1:1003081221824:web:265ed3ad6ef33e67638f25",
  measurementId: "G-HZM7LWKRDL"
};

// Initialize Firebase
export const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app); 
export const auth = getAuth(app);
export const database = getFirestore(app);
