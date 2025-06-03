// Service Worker for Playlist Converter
const CACHE_NAME = 'playlist-converter-cache-v1';
const URLS_TO_CACHE = [
  '/',
  '/index.html',
  '/manifest.json',
  '/images/app-icon.png',
  '/images/app-icon-512.png',
  '/images/og-image.png'
];

// Install event - cache essential files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Opened cache');
        return cache.addAll(URLS_TO_CACHE);
      })
  );
  // Activate immediately
  self.skipWaiting();
});

// Activate event - clean up old caches
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
  // Take control of all clients
  self.clients.claim();
});

// Fetch event - serve from cache if available, otherwise fetch and cache
self.addEventListener('fetch', event => {
  // Don't cache API calls or third-party resources
  if (
    event.request.url.includes('/api/') || 
    event.request.url.includes('spotify.com') ||
    event.request.url.includes('googleapis.com') ||
    event.request.url.includes('google-analytics.com')
  ) {
    return;
  }
  
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        // Cache hit - return response
        if (response) {
          return response;
        }
        
        // Clone the request because it's a one-time use stream
        const fetchRequest = event.request.clone();
        
        return fetch(fetchRequest).then(response => {
          // Check if we received a valid response
          if (!response || response.status !== 200 || response.type !== 'basic') {
            return response;
          }
          
          // Clone the response because it's a one-time use stream
          const responseToCache = response.clone();
          
          caches.open(CACHE_NAME)
            .then(cache => {
              // Don't cache non-GET requests
              if (event.request.method === 'GET') {
                cache.put(event.request, responseToCache);
              }
            });
            
          return response;
        });
      })
  );
}); 