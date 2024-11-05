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
    console.log('Service Worker installing...');
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => {
            console.log('Opened cache and caching assets');
            return cache.addAll(urlsToCache);
        })
    );
    // Force the waiting service worker to become active immediately
    self.skipWaiting();
});

// Cache and return requests
self.addEventListener('fetch', event => {
    console.log('Fetching:', event.request.url);
    event.respondWith(
        caches.match(event.request).then(response => {
            return response || fetch(event.request).then(fetchResponse => {
                return caches.open(CACHE_NAME).then(cache => {
                    cache.put(event.request, fetchResponse.clone());
                    return fetchResponse;
                });
            });
        }).catch(error => {
            console.error('Error fetching resource:', error);
        })
    );
});

// Activate the new service worker, delete old caches and notify clients
self.addEventListener('activate', event => {
    console.log('Activating new service worker...');
    const cacheWhitelist = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then(cacheNames => {
            return Promise.all(
                cacheNames.map(cacheName => {
                    if (!cacheWhitelist.includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => {
            // Take control of any open clients immediately
            console.log('Service Worker activated, claiming clients.');
            return self.clients.claim();  // This is crucial
        })
    );
});

// Listen for messages from the client to prompt an update
self.addEventListener('message', event => {
    if (event.data && event.data.action === 'skipWaiting') {
        self.skipWaiting();
    }
});

// Automatically notify clients about the new version and reload
self.addEventListener('controllerchange', () => {
    // This triggers when the new service worker takes control
    console.log('New service worker is controlling the page. Reloading...');
    window.location.reload();
});

// Handle push notifications
self.addEventListener('push', event => {
    const data = event.data ? event.data.json() : {};
    const { title, message } = data;

    const options = {
        body: message,
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
        self.registration.showNotification(title, options)
    );
});

// Handle notification clicks
self.addEventListener('notificationclick', event => {
    console.log('Notification click event:', event);

    event.notification.close();

    if (event.action === 'explore') {
        event.waitUntil(
            clients.matchAll({ type: 'window' }).then(clientList => {
                const client = clientList.find(c => c.url === 'https://tremor-track-innovibe.netlify.app/' && 'focus' in c);
                
                if (client) {
                    console.log('Focusing on existing PWA window');
                    return client.focus();
                } else {
                    console.log('Opening new PWA window');
                    return clients.open('https://tremor-track-innovibe.netlify.app/');
                }
            })
        );
    }
});
