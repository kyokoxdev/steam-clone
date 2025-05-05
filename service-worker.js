/**
 * Service Worker for Steam Clone
 * Provides offline capabilities and caching
 */

const CACHE_NAME = 'steam-clone-v1';
const STATIC_ASSETS = [
  '/',
  '/index.html',
  '/css/main.css',
  '/css/normalize.css',
  '/js/main.js',
  '/js/lazy-loading.js',
  '/assets/images/logo.png',
  '/assets/fonts/roboto.woff2'
];

// Install event - cache static assets
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Service Worker: Caching static assets');
        return cache.addAll(STATIC_ASSETS);
      })
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log('Service Worker: Deleting old cache', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});

// Fetch event - serve from cache or network
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Return cache hit if found
        if (response) {
          return response;
        }
        
        // Otherwise make a network request
        return fetch(event.request)
          .then((response) => {
            // Don't cache non-successful responses
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response;
            }
            
            // Clone the response - one to return, one to cache
            const responseToCache = response.clone();
            
            // Cache the fetched resource
            caches.open(CACHE_NAME)
              .then((cache) => {
                // Only cache GET requests
                if (event.request.method === 'GET') {
                  // Don't cache API responses or dynamic content
                  if (!event.request.url.includes('/api/')) {
                    cache.put(event.request, responseToCache);
                  }
                }
              });
              
            return response;
          })
          .catch((error) => {
            // Fallback to offline page if network fails
            console.log('Service Worker: Fetch failed', error);
            
            // Check if the request is for an HTML page
            if (event.request.headers.get('accept').includes('text/html')) {
              return caches.match('/offline.html');
            }
          });
      })
  );
});