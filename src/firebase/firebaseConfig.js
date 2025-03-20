// firebaseConfig.js
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "AIzaSyBtxdEUgH1PKDwniJy1vh_nVjI6YWsFOvw",
  authDomain: "admin-dashboard-995f8.firebaseapp.com",
  projectId: "admin-dashboard-995f8",
  storageBucket: "admin-dashboard-995f8.firebasestorage.app",
    messagingSenderId: "1091748651648",
  appId: "1:1091748651648:web:470703d3f6fc9277bd3c65",
    measurementId: "G-PXCGJLD3P5"
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);

export {app, auth };
