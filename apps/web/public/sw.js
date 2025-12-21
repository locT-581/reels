/**
 * VortexStream Service Worker
 * 
 * Caching strategies:
 * - Static assets: Cache-first
 * - API calls: Network-first
 * - Thumbnails: Stale-while-revalidate
 * - HLS manifests: Network-first
 * - HLS segments: Cache-first
 */

const CACHE_NAME = 'vortex-v1'
const STATIC_CACHE = 'vortex-static-v1'
const DYNAMIC_CACHE = 'vortex-dynamic-v1'
const VIDEO_CACHE = 'vortex-video-v1'

// Static assets to precache
const STATIC_ASSETS = [
  '/',
  '/offline',
  '/manifest.json',
]

// ============================================
// Install Event
// ============================================

self.addEventListener('install', (event) => {
  console.log('[SW] Installing...')
  
  event.waitUntil(
    caches.open(STATIC_CACHE).then((cache) => {
      console.log('[SW] Precaching static assets')
      return cache.addAll(STATIC_ASSETS)
    })
  )
  
  // Skip waiting to activate immediately
  self.skipWaiting()
})

// ============================================
// Activate Event
// ============================================

self.addEventListener('activate', (event) => {
  console.log('[SW] Activating...')
  
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => {
            // Delete old caches
            return name.startsWith('vortex-') && 
                   name !== STATIC_CACHE && 
                   name !== DYNAMIC_CACHE &&
                   name !== VIDEO_CACHE
          })
          .map((name) => {
            console.log('[SW] Deleting old cache:', name)
            return caches.delete(name)
          })
      )
    })
  )
  
  // Take control of all clients
  self.clients.claim()
})

// ============================================
// Fetch Event
// ============================================

self.addEventListener('fetch', (event) => {
  const { request } = event
  const url = new URL(request.url)
  
  // Skip non-GET requests
  if (request.method !== 'GET') return
  
  // Skip chrome-extension requests
  if (url.protocol === 'chrome-extension:') return
  
  // Route to appropriate strategy
  if (isStaticAsset(url)) {
    event.respondWith(cacheFirst(request, STATIC_CACHE))
  } else if (isApiRequest(url)) {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
  } else if (isThumbnail(url)) {
    event.respondWith(staleWhileRevalidate(request, DYNAMIC_CACHE))
  } else if (isHlsManifest(url)) {
    event.respondWith(networkFirst(request, VIDEO_CACHE, 3000))
  } else if (isHlsSegment(url)) {
    event.respondWith(cacheFirst(request, VIDEO_CACHE))
  } else if (isNavigationRequest(request)) {
    event.respondWith(networkFirstWithOfflineFallback(request))
  } else {
    event.respondWith(networkFirst(request, DYNAMIC_CACHE))
  }
})

// ============================================
// URL Matchers
// ============================================

function isStaticAsset(url) {
  const staticExtensions = ['.js', '.css', '.woff', '.woff2', '.ttf', '.ico']
  return staticExtensions.some(ext => url.pathname.endsWith(ext)) ||
         url.pathname.startsWith('/_next/static/')
}

function isApiRequest(url) {
  return url.pathname.startsWith('/api/')
}

function isThumbnail(url) {
  return url.pathname.includes('/thumbnails/') ||
         url.pathname.includes('/covers/') ||
         url.pathname.includes('/avatars/')
}

function isHlsManifest(url) {
  return url.pathname.endsWith('.m3u8')
}

function isHlsSegment(url) {
  return url.pathname.endsWith('.ts') || url.pathname.endsWith('.m4s')
}

function isNavigationRequest(request) {
  return request.mode === 'navigate'
}

// ============================================
// Caching Strategies
// ============================================

/**
 * Cache-first strategy
 * Best for: Static assets, video segments
 */
async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  if (cached) {
    return cached
  }
  
  try {
    const response = await fetch(request)
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.error('[SW] Cache-first fetch failed:', error)
    return new Response('Offline', { status: 503 })
  }
}

/**
 * Network-first strategy
 * Best for: API calls, HLS manifests
 */
async function networkFirst(request, cacheName, timeout = 5000) {
  const cache = await caches.open(cacheName)
  
  try {
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), timeout)
    
    const response = await fetch(request, { signal: controller.signal })
    clearTimeout(timeoutId)
    
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  } catch (error) {
    console.log('[SW] Network-first falling back to cache:', request.url)
    const cached = await cache.match(request)
    if (cached) {
      return cached
    }
    return new Response(JSON.stringify({ error: 'Offline' }), {
      status: 503,
      headers: { 'Content-Type': 'application/json' }
    })
  }
}

/**
 * Stale-while-revalidate strategy
 * Best for: Thumbnails, avatars
 */
async function staleWhileRevalidate(request, cacheName) {
  const cache = await caches.open(cacheName)
  const cached = await cache.match(request)
  
  const fetchPromise = fetch(request).then((response) => {
    if (response.ok) {
      cache.put(request, response.clone())
    }
    return response
  }).catch(() => null)
  
  return cached || fetchPromise || new Response('', { status: 503 })
}

/**
 * Network-first with offline fallback for navigation
 */
async function networkFirstWithOfflineFallback(request) {
  try {
    const response = await fetch(request)
    return response
  } catch (error) {
    const cache = await caches.open(STATIC_CACHE)
    const offlinePage = await cache.match('/offline')
    if (offlinePage) {
      return offlinePage
    }
    return new Response('Offline', { status: 503 })
  }
}

// ============================================
// Background Sync
// ============================================

self.addEventListener('sync', (event) => {
  console.log('[SW] Background sync:', event.tag)
  
  if (event.tag === 'sync-actions') {
    event.waitUntil(syncOfflineActions())
  }
})

async function syncOfflineActions() {
  // Get pending actions from IndexedDB and sync
  // This will be handled by the main app
  const clients = await self.clients.matchAll()
  clients.forEach(client => {
    client.postMessage({ type: 'SYNC_OFFLINE_ACTIONS' })
  })
}

// ============================================
// Push Notifications
// ============================================

self.addEventListener('push', (event) => {
  if (!event.data) return
  
  const data = event.data.json()
  
  const options = {
    body: data.body,
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    vibrate: [100, 50, 100],
    data: {
      url: data.url || '/',
    },
    actions: data.actions || [],
  }
  
  event.waitUntil(
    self.registration.showNotification(data.title, options)
  )
})

self.addEventListener('notificationclick', (event) => {
  event.notification.close()
  
  const url = event.notification.data.url
  
  event.waitUntil(
    self.clients.matchAll({ type: 'window' }).then((clients) => {
      // Focus existing window if available
      for (const client of clients) {
        if (client.url === url && 'focus' in client) {
          return client.focus()
        }
      }
      // Open new window
      if (self.clients.openWindow) {
        return self.clients.openWindow(url)
      }
    })
  )
})

// ============================================
// Message Handler
// ============================================

self.addEventListener('message', (event) => {
  console.log('[SW] Message received:', event.data)
  
  if (event.data.type === 'SKIP_WAITING') {
    self.skipWaiting()
  }
  
  if (event.data.type === 'CLEAR_CACHE') {
    event.waitUntil(
      caches.keys().then((names) => 
        Promise.all(names.map((name) => caches.delete(name)))
      )
    )
  }
  
  if (event.data.type === 'CACHE_VIDEO') {
    event.waitUntil(cacheVideo(event.data.url))
  }
})

async function cacheVideo(url) {
  const cache = await caches.open(VIDEO_CACHE)
  try {
    const response = await fetch(url)
    if (response.ok) {
      await cache.put(url, response)
      console.log('[SW] Video cached:', url)
    }
  } catch (error) {
    console.error('[SW] Failed to cache video:', error)
  }
}

console.log('[SW] Service Worker loaded')

