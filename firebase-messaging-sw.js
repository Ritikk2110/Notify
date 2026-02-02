// =============================================
// CREVATE NOTIFICATIONS - Firebase Messaging Service Worker
// File MUST be named: firebase-messaging-sw.js
// =============================================

// Import Firebase scripts
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.7.0/firebase-messaging-compat.js');

// Firebase Configuration
firebase.initializeApp({
    apiKey: "AIzaSyB-4_TMB9alq9kHdxW-JHhHD5XuP-njHdw",
    authDomain: "crevate-notify.firebaseapp.com",
    projectId: "crevate-notify",
    storageBucket: "crevate-notify.firebasestorage.app",
    messagingSenderId: "935742275454",
    appId: "1:935742275454:web:f241e1f1e8633328e87d2f"
});

const messaging = firebase.messaging();

// Background message handler
messaging.onBackgroundMessage(payload => {
    console.log('Background message:', payload);

    const notificationTitle = payload.notification?.title || 'New Submission!';
    const notificationOptions = {
        body: payload.notification?.body || 'You have a new form submission',
        icon: '/icons/icon-192.png',
        badge: '/icons/icon-72.png',
        vibrate: [200, 100, 200],
        tag: 'crevate-' + Date.now(),
        renotify: true
    };

    return self.registration.showNotification(notificationTitle, notificationOptions);
});

// Notification click handler
self.addEventListener('notificationclick', event => {
    event.notification.close();
    event.waitUntil(
        clients.openWindow('/')
    );
});