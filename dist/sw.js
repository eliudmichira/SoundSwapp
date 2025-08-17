// SoundSwapp Service Worker - Enhanced Version
const SW_VERSION = '2.0.0';
const CACHE_VERSION = 'v2.0.0';

// Cache names with versioning
const CACHES = {
  STATIC: `soundswapp-static-${CACHE_VERSION}`,
  DYNAMIC: `soundswapp-dynamic-${CACHE_VERSION}`,
  API: `soundswapp-api-${CACHE_VERSION}`,
  IMAGES: `soundswapp-images-${CACHE_VERSION}`
};

// Cache configurations
const CACHE_CONFIG = {
  STATIC: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 100
  },
  DYNAMIC: {
    maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    maxEntries: 50
  },
  API: {
    maxAge: 5 * 60 * 1000, // 5 minutes
    maxEntries: 100
  },
  IMAGES: {
    maxAge: 30 * 24 * 60 * 60 * 1000, // 30 days
    maxEntries: 200
  }
};

// Static files to precache (only existing files)
const STATIC_FILES = [
  '/',
  '/index.html',
  '/manifest.json'
  // Removed non-existent image files that were causing cache failures
];

// API patterns and their cache strategies
const API_PATTERNS = [
  {
    pattern: /^https:\/\/api\.spotify\.com\/v1\/(me|playlists)/,
    strategy: 'networkFirst',
    maxAge: 5 * 60 * 1000 // 5 minutes
  },
  {
    pattern: /^https:\/\/www\.googleapis\.com\/youtube\/v3\/(search|playlists)/,
    strategy: 'networkFirst',
    maxAge: 10 * 60 * 1000 // 10 minutes
  }
  // Removed Firebase patterns - Firebase requests should bypass service worker completely
];

// Installation event - Enhanced with better error handling
self.addEventListener('install', event => {
  console.log(`[SW ${SW_VERSION}] Installing...`);
  
  event.waitUntil(
    (async () => {
      try {
        // Precache static files
        const staticCache = await caches.open(CACHES.STATIC);
        await staticCache.addAll(STATIC_FILES);
        
        // Precache critical API responses if needed
        await precacheCriticalData();
        
        console.log(`[SW ${SW_VERSION}] Installation successful`);
        
        // Skip waiting to activate immediately
        await self.skipWaiting();
      } catch (error) {
        console.error(`[SW ${SW_VERSION}] Installation failed:`, error);
        throw error;
      }
    })()
  );
});

// Activation event - Enhanced cache cleanup
self.addEventListener('activate', event => {
  console.log(`[SW ${SW_VERSION}] Activating...`);
  
  event.waitUntil(
    (async () => {
      try {
        // Clean up old caches
        await cleanupOldCaches();
        
        // Clean up expired entries in current caches
        await cleanupExpiredEntries();
        
        // Take control of all clients
        await self.clients.claim();
        
        // Notify clients of activation
        await notifyClientsOfUpdate();
        
        console.log(`[SW ${SW_VERSION}] Activation complete`);
      } catch (error) {
        console.error(`[SW ${SW_VERSION}] Activation failed:`, error);
      }
    })()
  );
});

// Enhanced fetch handler with sophisticated routing and GA blocking
self.addEventListener('fetch', event => {
  const { request } = event;
  const url = new URL(request.url);

  // Block Google Analytics requests first
  if (url.href.includes('google-analytics.com') || 
      url.href.includes('googletagmanager.com') ||
      url.href.includes('mp/collect')) {
    event.respondWith(
      new Response(null, { 
        status: 204, 
        statusText: 'Blocked by SW' 
      })
    );
    return;
  }

  // Always bypass SW for ALL Firebase/Google API endpoints - let them go directly to network
  if (url.hostname.endsWith('googleapis.com') || 
      url.hostname.endsWith('firebase.googleapis.com') ||
      url.hostname.endsWith('firestore.googleapis.com') ||
      url.hostname.endsWith('identitytoolkit.googleapis.com') ||
      url.href.includes('firebaseapp.com') ||
      url.href.includes('firebase')) {
    // Don't intercept Firebase requests at all - let them go directly to network
    return;
  }

  // Skip non-GET requests and extension requests
  if (request.method !== 'GET' || url.protocol === 'chrome-extension:') {
    return;
  }

  // Route different types of requests
  if (isNavigationRequest(request)) {
    event.respondWith(handleNavigationRequest(request));
  } else if (isApiRequest(request)) {
    event.respondWith(handleApiRequest(request));
  } else if (isImageRequest(request)) {
    event.respondWith(handleImageRequest(request));
  } else if (isStaticAsset(request)) {
    event.respondWith(handleStaticAssetRequest(request));
  } else {
    event.respondWith(handleGenericRequest(request));
  }
});

self.addEventListener('install', function(event) {
  self.skipWaiting();
});

self.addEventListener('activate', function(event) {
  event.waitUntil(self.clients.claim());
});

// Navigation request handler - App Shell pattern
async function handleNavigationRequest(request) {
  try {
    // Try network first for navigation
    const networkResponse = await fetch(request, {
      timeout: 3000 // 3 second timeout
    });
    
    if (networkResponse.ok) {
      // Cache successful navigation responses
      const cache = await caches.open(CACHES.DYNAMIC);
      cache.put(request, networkResponse.clone());
      return networkResponse;
    }
    
    throw new Error(`Network response not ok: ${networkResponse.status}`);
  } catch (error) {
    console.log(`[SW] Navigation fallback for ${request.url}:`, error.message);
    
    // Try cached version
    const cachedResponse = await caches.match(request);
    if (cachedResponse) {
      return cachedResponse;
    }
    
    // Return app shell (index.html) for SPA routing
    const appShell = await caches.match('/');
    if (appShell) {
      return appShell;
    }
    
    // Last resort - offline page
    return caches.match('/offline.html') || new Response('Offline', { 
      status: 503,
      statusText: 'Service Unavailable'
    });
  }
}

// API request handler with smart caching
async function handleApiRequest(request) {
  const apiConfig = getApiConfig(request);
  
  if (!apiConfig) {
    return fetch(request);
  }
  
  const cacheKey = generateCacheKey(request);
  const cache = await caches.open(CACHES.API);
  
  if (apiConfig.strategy === 'cacheFirst') {
    return handleCacheFirst(request, cache, apiConfig);
  } else {
    return handleNetworkFirst(request, cache, apiConfig);
  }
}

// Network-first strategy for API requests
async function handleNetworkFirst(request, cache, config) {
  try {
    const networkResponse = await fetchWithTimeout(request, 5000);
    
    if (networkResponse.ok) {
      // Cache successful responses with metadata
      const responseToCache = networkResponse.clone();
      const cacheEntry = {
        response: responseToCache,
        timestamp: Date.now(),
        maxAge: config.maxAge
      };
      
      // Store with expiration metadata
      cache.put(request, new Response(JSON.stringify({
        data: await responseToCache.json(),
        metadata: {
          timestamp: cacheEntry.timestamp,
          maxAge: config.maxAge
        }
      }), {
        headers: {
          'Content-Type': 'application/json',
          'SW-Cache': 'true'
        }
      }));
    }
    
    return networkResponse;
  } catch (error) {
    console.log(`[SW] API network failed, trying cache:`, error.message);
    
    // Try cache fallback
    const cachedResponse = await cache.match(request);
    if (cachedResponse && await isCacheEntryValid(cachedResponse, config.maxAge)) {
      // Check if the cached response is JSON before attempting to parse
      const contentType = cachedResponse.headers.get('Content-Type');
      const isJsonResponse = contentType && contentType.includes('application/json');
      
      if (isJsonResponse) {
        try {
          // Parse the cached response and extract the data
          const cachedData = await cachedResponse.clone().json();
          
          // Check if this is our wrapped format with metadata
          if (cachedData && typeof cachedData === 'object' && 'data' in cachedData) {
            // Return just the data portion, unwrapped
            const unwrappedResponse = new Response(JSON.stringify(cachedData.data), {
              status: 200,
              statusText: 'OK',
              headers: {
                'Content-Type': 'application/json',
                'SW-Source': 'cache'
              }
            });
            return unwrappedResponse;
          } else {
            // Legacy cache format or direct response - return as is
            const response = cachedResponse.clone();
            response.headers.append('SW-Source', 'cache');
            return response;
          }
        } catch (parseError) {
          console.warn('[SW] Failed to parse cached JSON response:', parseError);
          // If parsing fails, try to return the cached response as-is
          const response = cachedResponse.clone();
          response.headers.append('SW-Source', 'cache-fallback');
          return response;
        }
      } else {
        // Non-JSON response - return as-is without trying to parse
        const response = cachedResponse.clone();
        response.headers.append('SW-Source', 'cache');
        return response;
      }
    }
    
    // Return error response
    return new Response(JSON.stringify({
      error: 'Network unavailable and no valid cache',
      offline: true
    }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

// Cache-first strategy
async function handleCacheFirst(request, cache, config) {
  const cachedResponse = await cache.match(request);
  
  if (cachedResponse && await isCacheEntryValid(cachedResponse, config.maxAge)) {
    // Update cache in background if needed
    updateCacheInBackground(request, cache, config);
    return cachedResponse;
  }
  
  return handleNetworkFirst(request, cache, config);
}

// Image request handler with optimized caching
async function handleImageRequest(request) {
  const cache = await caches.open(CACHES.IMAGES);
  
  // Try cache first for images
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetchWithTimeout(request, 10000);
    
    if (networkResponse.ok) {
      // Cache images with size limits
      const contentLength = networkResponse.headers.get('content-length');
      const sizeMB = contentLength ? parseInt(contentLength) / (1024 * 1024) : 0;
      
      if (sizeMB < 5) { // Only cache images under 5MB
        cache.put(request, networkResponse.clone());
      }
    }
    
    return networkResponse;
  } catch (error) {
    // Return placeholder for failed image loads
    return generateImagePlaceholder();
  }
}

// Static asset handler
async function handleStaticAssetRequest(request) {
  const cache = await caches.open(CACHES.STATIC);
  
  // Cache first for static assets
  const cachedResponse = await cache.match(request);
  if (cachedResponse) {
    return cachedResponse;
  }
  
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse.clone());
    }
    return networkResponse;
  } catch (error) {
    return new Response('Asset not found', { status: 404 });
  }
}

// Generic request handler
async function handleGenericRequest(request) {
  try {
    return await fetch(request);
  } catch (error) {
    const cachedResponse = await caches.match(request);
    return cachedResponse || new Response('Not found', { status: 404 });
  }
}

// Enhanced background sync with retry logic
self.addEventListener('sync', event => {
  console.log(`[SW] Background sync: ${event.tag}`);
  
  switch (event.tag) {
    case 'background-conversion':
      event.waitUntil(handleBackgroundConversion());
      break;
    case 'sync-failed-requests':
      event.waitUntil(retrySyncFailedRequests());
      break;
    default:
      console.log(`[SW] Unknown sync tag: ${event.tag}`);
  }
});

// Enhanced push notification handling
self.addEventListener('push', event => {
  console.log('[SW] Push notification received');
  
  let notificationData;
  
  try {
    notificationData = event.data ? event.data.json() : {};
  } catch (error) {
    notificationData = { title: 'SoundSwapp', body: 'New update available!' };
  }
  
  const options = {
    body: notificationData.body || 'Your playlist conversion is complete!',
    icon: '/images/app-icon-192.png',
    badge: '/images/app-icon-192.png',
    image: notificationData.image,
    vibrate: [100, 50, 100],
    data: notificationData.data || {},
    actions: [
      {
        action: 'view',
        title: 'View',
        icon: '/images/app-icon-192.png'
      },
      {
        action: 'dismiss',
        title: 'Dismiss'
      }
    ],
    requireInteraction: notificationData.requireInteraction || false,
    silent: notificationData.silent || false
  };
  
  event.waitUntil(
    self.registration.showNotification(
      notificationData.title || 'SoundSwapp',
      options
    )
  );
});

// Enhanced notification click handling
self.addEventListener('notificationclick', event => {
  console.log('[SW] Notification clicked:', event.action);
  
  event.notification.close();
  
  const notificationData = event.notification.data || {};
  
  event.waitUntil(
    (async () => {
      const clients = await self.clients.matchAll({ type: 'window' });
      
      if (event.action === 'view' || !event.action) {
        const urlToOpen = notificationData.url || '/';
        
        // Try to focus existing client
        for (const client of clients) {
          if (client.url.includes(urlToOpen) && 'focus' in client) {
            return client.focus();
          }
        }
        
        // Open new window
        if (self.clients.openWindow) {
          return self.clients.openWindow(urlToOpen);
        }
      }
    })()
  );
});

// Enhanced message handling
self.addEventListener('message', event => {
  const { type, payload } = event.data || {};
  
  switch (type) {
    case 'SKIP_WAITING':
      self.skipWaiting();
      break;
      
    case 'GET_VERSION':
      event.ports[0].postMessage({ version: SW_VERSION });
      break;
      
    case 'CLEAR_CACHE':
      event.waitUntil(clearAllCaches());
      break;
      
    case 'CACHE_URLS':
      event.waitUntil(cacheUrls(payload.urls));
      break;
      
    case 'PREFETCH_CRITICAL':
      event.waitUntil(prefetchCriticalResources());
      break;
      
    default:
      console.log(`[SW] Unknown message type: ${type}`);
  }
});

// Helper functions

function isNavigationRequest(request) {
  return request.mode === 'navigate' || 
         (request.method === 'GET' && request.headers.get('accept').includes('text/html'));
}

function isApiRequest(request) {
  return API_PATTERNS.some(pattern => pattern.pattern.test(request.url));
}

function isImageRequest(request) {
  return request.destination === 'image' || 
         /\.(jpg|jpeg|png|gif|webp|svg)$/i.test(new URL(request.url).pathname);
}

function isStaticAsset(request) {
  const url = new URL(request.url);
  return url.pathname.startsWith('/static/') ||
         url.pathname.startsWith('/assets/') ||
         /\.(js|css|woff|woff2|ttf|eot)$/i.test(url.pathname);
}

function getApiConfig(request) {
  return API_PATTERNS.find(pattern => pattern.pattern.test(request.url));
}

function generateCacheKey(request) {
  const url = new URL(request.url);
  // Remove auth tokens and timestamp params for better cache hits
  url.searchParams.delete('access_token');
  url.searchParams.delete('_t');
  return url.toString();
}

async function fetchWithTimeout(request, timeout = 5000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(request, { signal: controller.signal });
    clearTimeout(timeoutId);
    return response;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

async function isCacheEntryValid(response, maxAge) {
  try {
    const data = await response.clone().json();
    if (data.metadata && data.metadata.timestamp) {
      return (Date.now() - data.metadata.timestamp) < maxAge;
    }
  } catch (error) {
    // If we can't parse metadata, assume it's valid for now
    return true;
  }
  return false;
}

async function updateCacheInBackground(request, cache, config) {
  try {
    const networkResponse = await fetch(request);
    if (networkResponse.ok) {
      cache.put(request, networkResponse);
    }
  } catch (error) {
    console.log('[SW] Background cache update failed:', error.message);
  }
}

function generateImagePlaceholder() {
  const svg = `
    <svg width="200" height="200" xmlns="http://www.w3.org/2000/svg">
      <rect width="200" height="200" fill="#f3f4f6"/>
      <text x="100" y="100" text-anchor="middle" dy=".3em" fill="#9ca3af">
        Image unavailable
      </text>
    </svg>
  `;
  
  return new Response(svg, {
    headers: {
      'Content-Type': 'image/svg+xml',
      'Cache-Control': 'no-cache'
    }
  });
}

async function cleanupOldCaches() {
  const cacheNames = await caches.keys();
  const currentCaches = Object.values(CACHES);
  
  return Promise.all(
    cacheNames.map(cacheName => {
      if (!currentCaches.includes(cacheName)) {
        console.log(`[SW] Deleting old cache: ${cacheName}`);
        return caches.delete(cacheName);
      }
    })
  );
}

async function cleanupExpiredEntries() {
  for (const [cacheName, config] of Object.entries(CACHE_CONFIG)) {
    const cache = await caches.open(CACHES[cacheName]);
    const requests = await cache.keys();
    
    for (const request of requests) {
      const response = await cache.match(request);
      if (response && !(await isCacheEntryValid(response, config.maxAge))) {
        console.log(`[SW] Removing expired entry: ${request.url}`);
        cache.delete(request);
      }
    }
  }
}

async function notifyClientsOfUpdate() {
  const clients = await self.clients.matchAll();
  clients.forEach(client => {
    client.postMessage({
      type: 'SW_UPDATED',
      version: SW_VERSION
    });
  });
}

async function precacheCriticalData() {
  // Precache critical API responses if needed
  // This could include user profile, initial playlists, etc.
  console.log('[SW] Precaching critical data...');
}

async function handleBackgroundConversion() {
  try {
    // Implementation for background conversion processing
    console.log('[SW] Processing background conversions...');
    
    // Get queued conversions from IndexedDB
    const conversions = await getQueuedConversions();
    
    for (const conversion of conversions) {
      try {
        await processConversion(conversion);
        await removeQueuedConversion(conversion.id);
        
        // Show success notification
        self.registration.showNotification('Conversion Complete', {
          body: `Your playlist "${conversion.name}" has been converted successfully!`,
          icon: '/images/app-icon-192.png',
          data: { url: `/conversions/${conversion.id}` }
        });
      } catch (error) {
        console.error('[SW] Background conversion failed:', error);
      }
    }
  } catch (error) {
    console.error('[SW] Background sync failed:', error);
  }
}

async function retrySyncFailedRequests() {
  // Implementation for retrying failed sync requests
  console.log('[SW] Retrying failed sync requests...');
}

async function clearAllCaches() {
  const cacheNames = await caches.keys();
  return Promise.all(cacheNames.map(name => caches.delete(name)));
}

async function cacheUrls(urls) {
  const cache = await caches.open(CACHES.DYNAMIC);
  return Promise.all(
    urls.map(async url => {
      try {
        const response = await fetch(url);
        if (response.ok) {
          return cache.put(url, response);
        }
      } catch (error) {
        console.error(`[SW] Failed to cache ${url}:`, error);
      }
    })
  );
}

async function prefetchCriticalResources() {
  // Implementation for prefetching critical resources
  console.log('[SW] Prefetching critical resources...');
}

// Placeholder implementations for IndexedDB operations
async function getQueuedConversions() {
  // TODO: Implement IndexedDB operations
  return [];
}

async function processConversion(conversion) {
  // TODO: Implement conversion processing
  console.log('Processing conversion:', conversion);
}

async function removeQueuedConversion(id) {
  // TODO: Implement removal from IndexedDB
  console.log('Removing conversion:', id);
}

console.log(`[SW ${SW_VERSION}] Service Worker script loaded`);