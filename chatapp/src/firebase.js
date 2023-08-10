// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCYh3yu5o3c-60WbMfQAHBYcSYWqA7cRE4",
  authDomain: "chatapp-12-14.firebaseapp.com",
  projectId: "chatapp-12-14",
  storageBucket: "chatapp-12-14.appspot.com",
  messagingSenderId: "647815291064",
  appId: "1:647815291064:web:2ffe95ee13836dc077144d",
  measurementId: "G-RQFG0X7M7T",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
