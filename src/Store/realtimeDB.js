// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyDiO9j8oeL-6G5zSqylSn2UmtMnbNTiDxk",
  authDomain: "reviewprovider-afd9d.firebaseapp.com",
  databaseURL: "https://reviewprovider-afd9d-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "reviewprovider-afd9d",
  storageBucket: "reviewprovider-afd9d.appspot.com",
  messagingSenderId: "732027694749",
  appId: "1:732027694749:web:b7dec5a3930d2bbd3cae74",
  measurementId: "G-KD1HJTJ4B5"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

export const auth = getAuth(app);

export default app;

