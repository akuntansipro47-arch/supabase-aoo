const CACHE_NAME = 'bengkel-pwa-v1'
const urlsToCache = [
  '/',
  '/login',
  '/api/tables',
  '/api/auth/me',
  '/api/auth/login',
  '/api/auth/logout',
  '/static/css/main.css',
  '/static/js/main.js',
  '/manifest.json',
  'https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap'
]

// Install Service Worker
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache')
        return cache.addAll(urlsToCache)
      })
      .catch((error) => {
        console.error('Failed to cache urls:', error)
      })
  )
})

// Activate Service Worker
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            return caches.delete(cacheName)
          }
        })
      )
    })
  )
})

// Fetch Event
self.addEventListener('fetch', (event) => {
  // Skip non-GET requests
  if (event.request.method !== 'GET') {
    return
  }

  // Skip external requests (API calls to Supabase)
  if (event.request.url.includes('supabase')) {
    return
  }

  event.respondWith(
    caches.match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response
        }

        // Clone the request because request streams can only be read once
        const fetchRequest = event.request.clone()

        return fetch(fetchRequest).then(
          (response) => {
            // Check if valid response
            if (!response || response.status !== 200 || response.type !== 'basic') {
              return response
            }

            // Clone the response because response streams can only be read once
            const responseToCache = response.clone()

            caches.open(CACHE_NAME)
              .then((cache) => {
                cache.put(event.request, responseToCache)
              })

            return response
          }
        ).catch(() => {
          // If fetch fails, try to serve from cache
          return caches.match(event.request)
        })
      })
  )
})

// Background Sync for offline data
self.addEventListener('sync', (event) => {
  if (event.tag === 'background-sync') {
    event.waitUntil(doBackgroundSync())
  }
})

function doBackgroundSync() {
  // Handle background sync for offline data
  return self.registration.showNotification('Data Sync', {
    body: 'Syncing your offline data...',
    icon: '/icons/icon-192x192.png'
  })
}

// Push Notifications
self.addEventListener('push', (event) => {
  const options = {
    body: event.data.text(),
    icon: '/icons/icon-192x192.png',
    badge: '/icons/icon-96x96.png',
    vibrate: [100, 50, 100],
    data: {
      dateOfArrival: Date.now(),
      primaryKey: 1
    },
    actions: [
      {
        action: 'explore',
        title: 'View Details',
        icon: '/icons/checkmark.png'
      },
      {
        action: 'close',
        title: 'Close',
        icon: '/icons/xmark.png'
      }
    ]
  }

  event.waitUntil(
    self.registration.showNotification('Bengkel PWA', options)
  )
})

// Notification Click
self.addEventListener('notificationclick', (event) => {
  event.notification.close()

  if (event.action === 'explore') {
    event.waitUntil(
      clients.openWindow('/notifications')
    )
  } else if (event.action === 'close') {
    // Just close the notification
  } else {
    // Default action - open the app
    event.waitUntil(
      clients.openWindow('/')
    )
  }
})
