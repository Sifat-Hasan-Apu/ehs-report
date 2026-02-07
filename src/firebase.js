import { initializeApp } from "firebase/app";
import { getDatabase } from "firebase/database";

// Firebase configuration from user
const firebaseConfig = {
    apiKey: "AIzaSyCp-Mj0X-4iQK8n3bAwvQCby-Cwcwq6jec",
    authDomain: "ehs-site-report.firebaseapp.com",
    projectId: "ehs-site-report",
    storageBucket: "ehs-site-report.firebasestorage.app",
    messagingSenderId: "539131422738",
    appId: "1:539131422738:web:8108bd39ac80382724d0cb",
    measurementId: "G-7V2STLG1Y9"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Realtime Database and export it
export const db = getDatabase(app);
