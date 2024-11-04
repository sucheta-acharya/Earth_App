const CACHE_NAME = 'TremorTrack-cache-v1';
const urlsToCache = [
    '/',
    '/static/style.css',
    '/static/images/logo.png',
    '/static/images/logo_fav.png',
    '/static/script.js'
];

// Install the service worker and cache assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache and caching assets');
            return cache.addAll(urlsToCache);
        })
    );
});

// Cache and return requests
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request);
        }).catch(error => {
            console.error('Error fetching resource:', error);
        })
    );
});

// Update the service worker and delete old caches
self.addEventListener('activate', event => {
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (cacheWhitelist.indexOf(cacheName) === -1) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});

self.addEventListener('push', event => {
    console.log('Push event received:', event);

    const data = event.data ? event.data.json() : { title: 'No Title', message: 'No Message' }; 
    console.log('Push data:', data);

    const options = {
        body: data.message || 'No message provided',
        icon: '/static/images/logo.png',
        badge: '/static/images/logo_fav.png',
        vibrate: [200, 100, 200],
        requireInteraction: true,
        actions: [
            { action: 'explore', title: 'View' },
            { action: 'close', title: 'Close' }
        ]
    };

    event.waitUntil(
        self.registration.showNotification(data.title || 'Notification', options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('Notification click event:', event);

    event.notification.close(); // Close the notification

    // Handle different actions
    if (event.action === 'explore') {
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(clientList => {
                // Check if the app is already open
                const client = clientList.find(c => c.url === 'https://tremor-track-innovibe.netlify.app/' && 'focus' in c);
                
                if (client) {
                    console.log('Focusing on existing PWA window');
                    return client.focus();
                } else {
                    console.log('Opening new PWA window');
                    return clients.openWindow('https://tremor-track-innovibe.netlify.app/');
                }
            })
        );
    }
});
