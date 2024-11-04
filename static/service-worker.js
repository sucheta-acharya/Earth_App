const CACHE_NAME = 'TremorTrack-cache-v1';
const urlsToCache = [
    '/',
    '/static/style.css',
    '/static/images/logo.png',
    '/static/images/logo_fav.png',
    '/static/script.js'
];

// Install the service worker
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                return cache.addAll(urlsToCache);
            })
    );
});

// Cache and return requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(response => {
                return response || fetch(event.request);
            })
    );
});

// Update a service worker
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

// Handle push notifications
self.addEventListener('push', function(event) {
    const data = event.data ? event.data.json() : { title: 'No Title', message: 'No Message' }; // Default message if no data is provided
    const options = {
        body: data.message,
        icon: '/static/images/logo.png', // Optional icon for the notification
        badge: '/static/images/logo_fav.png', // Badge icon
        vibrate: [200, 100, 200], // Vibration pattern
        actions: [
            { action: 'explore', title: 'View' },
            { action: 'close', title: 'Close' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', function(event) {
    event.notification.close(); // Close the notification

    // Open the PWA app or focus on it
    event.waitUntil(
        clients.matchAll({ type: 'window' }).then(clients => {
            // Check if there is already an open client (window)
            const client = clients.find(c => c.url === 'https://tremor-track-innovibe.netlify.app/' && 'focus' in c); // Replace with your PWA URL

            if (client) {
                // If the client is already open, focus on it
                return client.focus();
            } else {
                // If not, open a new window for the PWA
                return clients.openWindow('https://tremor-track-innovibe.netlify.app/'); // Replace with your PWA URL
            }
        })
    );
});
