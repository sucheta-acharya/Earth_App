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
            // Try the cache first, if no match, fetch from the network
            return response || fetch(event.request).then(fetchResponse => {
                // Update the cache with the fresh network response
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

// Activate the new service worker, delete old caches, and notify clients
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
            return self.clients.claim();
        })
    );
});

// Listen for messages from the client to prompt an update
self.addEventListener('message', event => {
    if (event.data && event.data.action === 'skipWaiting') {
        console.log('Skipping waiting and activating new service worker.');
        self.skipWaiting();
    }
});

// Notify clients of a new service worker
self.addEventListener('controllerchange', () => {
    console.log('Controller has changed. Reloading the page...');
    // This will force the page to reload when a new SW takes over
    window.location.reload();
});
