// Replace with your Firebase config
/*const firebaseConfig = {
    apiKey: "YOUR_API_KEY",
    authDomain: "YOUR_PROJECT.firebaseapp.com",
    projectId: "YOUR_PROJECT_ID",
    storageBucket: "YOUR_PROJECT.appspot.com",
    messagingSenderId: "YOUR_SENDER_ID",
    appId: "YOUR_APP_ID"
};

firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
const messaging = firebase.messaging();
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
  const firebaseConfig = {
    apiKey: "AIzaSyB-4_TMB9alq9kHdxW-JHhHD5XuP-njHdw",
    authDomain: "crevate-notify.firebaseapp.com",
    projectId: "crevate-notify",
    storageBucket: "crevate-notify.firebasestorage.app",
    messagingSenderId: "935742275454",
    appId: "1:935742275454:web:f241e1f1e8633328e87d2f",
    measurementId: "G-XRVBC0LFZE"
  };
  const firebaseConfig = {
  apiKey: "AIzaSyB-4_TMB9alq9kHdxW-JHhHD5XuP-njHdw",
  authDomain: "crevate-notify.firebaseapp.com",
  projectId: "crevate-notify",
  storageBucket: "crevate-notify.firebasestorage.app",
  messagingSenderId: "935742275454",
  appId: "1:935742275454:web:f241e1f1e8633328e87d2f",
  measurementId: "G-XRVBC0LFZE"
};

  // Initialize Firebase
  const app = initializeApp(firebaseConfig);
 // const analytics = getAnalytics(app);*/


 // Firebase Configuration for Crevate Notify
// This file is already configured with your Firebase project details

const firebaseConfig = {
    apiKey: "AIzaSyB-4_TMB9alq9kHdxW-JHhHD5XuP-njHdw",
    authDomain: "crevate-notify.firebaseapp.com",
    projectId: "crevate-notify",
    storageBucket: "crevate-notify.firebasestorage.app",
    messagingSenderId: "935742275454",
    appId: "1:935742275454:web:f241e1f1e8633328e87d2f",
    measurementId: "G-XRVBC0LFZE"
};

// Your VAPID Key for Web Push (from Firebase Console > Cloud Messaging > Web Push certificates)
const VAPID_KEY = "BLyRaYGy6g85FCVkPABfQRBma9LVK_veaOtuid55Lgf769EJVg46pLhjnWtgiDllBIFYhSM1X2PXcA24WXkYsr0";

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Initialize Firestore Database
const db = firebase.firestore();

// Initialize Firebase Cloud Messaging
const messaging = firebase.messaging();
