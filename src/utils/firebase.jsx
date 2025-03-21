// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";

// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCWHHt6ZOXIp4y5xKw3JUEkG965aDlaTZU",
  authDomain: "cinegpt-67576.firebaseapp.com",
  projectId: "cinegpt-67576",
  storageBucket: "cinegpt-67576.firebasestorage.app",
  messagingSenderId: "918480172357",
  appId: "1:918480172357:web:47d0dc2269ad5aee29fa2c",
  measurementId: "G-2NDYWN4WH3",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth();
