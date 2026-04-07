/* eslint-disable no-undef */
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/12.9.0/firebase-messaging-compat.js');
importScripts('/firebase-config.js');

if (!self.firebaseConfig) {
  throw new Error('Missing firebaseConfig. Update /firebase-config.js.');
}

firebase.initializeApp(self.firebaseConfig);
const messaging = firebase.messaging();
const defaultLink = self.location.origin;
const iconUrl = `${self.location.origin}/icons/Icon-192.png`;

function normalizePayload(payload) {
  const notification = payload.notification || {};
  const data = payload.data || {};

  return {
    title: notification.title || data.title || 'PangaLeo',
    options: {
      body: notification.body || data.body || '',
      icon: notification.icon || iconUrl,
      badge: notification.badge || iconUrl,
      data: {
        ...data,
        link: data.link || defaultLink,
      },
      requireInteraction: true,
    },
  };
}

messaging.onBackgroundMessage((payload) => {
  const { title, options } = normalizePayload(payload);
  self.registration.showNotification(title, options);
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();

  const targetLink =
    event.notification?.data?.link || defaultLink;

  event.waitUntil(
    clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clientList) => {
      for (const client of clientList) {
        if ('focus' in client) {
          client.postMessage({
            type: 'pangaleo_notification_click',
            link: targetLink,
          });
          return client.focus();
        }
      }

      if (clients.openWindow) {
        return clients.openWindow(targetLink);
      }

      return undefined;
    }),
  );
});
