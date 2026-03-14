/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js');
importScripts('/firebase-config.js');

if (!self.firebaseConfig) {
  throw new Error('Missing firebaseConfig. Update /firebase-config.js.');
}

firebase.initializeApp(self.firebaseConfig);
firebase.messaging();
