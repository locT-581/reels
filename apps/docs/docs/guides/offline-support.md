---
sidebar_position: 5
---

# Offline Support

Hướng dẫn triển khai tính năng offline cho VortexStream.

## Tổng quan

VortexStream hỗ trợ offline với:

- 💾 **IndexedDB** - Lưu video metadata và segments
- 🔄 **Service Worker** - Cache static assets và API
- 📤 **Action Queue** - Queue actions khi offline
- 🔔 **Network Detection** - Detect và respond to network changes

## Storage Layers

| Layer | Content | Max Size | TTL |
|-------|---------|----------|-----|
| **L1 - Memory** | Decoded frames | 3 videos | Session |
| **L2 - IndexedDB** | Segments, metadata | 200MB | 7 days |
| **L3 - Service Worker** | Assets, thumbnails | 50MB | 30 days |

## Network Status

```tsx
import { useNetworkStatus } from '@vortex/core'

function NetworkIndicator() {
  const {
    isOnline,
    isSlowConnection,
    effectiveType,  // '4g' | '3g' | '2g' | 'slow-2g'
    downlink,       // Mbps
    rtt,            // Round-trip time ms
  } = useNetworkStatus()

  if (!isOnline) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-yellow-500 text-black p-2 text-center z-50">
        📴 Không có kết nối - Đang xem nội dung đã lưu
      </div>
    )
  }

  if (isSlowConnection) {
    return (
      <div className="fixed top-0 left-0 right-0 bg-orange-500 text-white p-2 text-center z-50">
        ⚠️ Mạng yếu - Video có thể bị giật
      </div>
    )
  }

  return null
}
```

## Video Caching

### Cache video metadata

```tsx
import { cacheVideo, getCachedVideo, getCachedVideos } from '@vortex/core/storage'

// Cache video khi xem
async function handleVideoView(video: Video) {
  await cacheVideo(video)
}

// Lấy cached video
const cached = await getCachedVideo('video123')

// Lấy tất cả cached videos
const allCached = await getCachedVideos()
```

### Manual video download

```tsx
import { queueAction, registerActionHandler, syncAllActions } from '@vortex/core/offline'

async function queueLikeWhileOffline(videoId: string) {
  await queueAction('like', { videoId })
}

// Somewhere during app init:
registerActionHandler('like', async (action) => {
  await api.likeVideo(action.payload.videoId as string)
})

// When back online (or on demand):
await syncAllActions()
```

## Watch History

```tsx
import {
  saveWatchProgress,
  getWatchProgress,
  getWatchHistory,
  clearWatchHistory,
} from '@vortex/core/storage'

// Lưu progress mỗi 5s
useEffect(() => {
  const interval = setInterval(() => {
    if (isPlaying) {
      saveWatchProgress(video.id, currentTime, duration)
    }
  }, 5000)
  
  return () => clearInterval(interval)
}, [video.id, currentTime, duration, isPlaying])

// Resume playback
async function resumeVideo(videoId: string) {
  const progress = await getWatchProgress(videoId)
  if (progress && progress.percentage < 90) {
    // Resume from saved position
    player.seek(progress.position)
  }
}

// Get watch history
const history = await getWatchHistory(50) // limit 50
// [{ videoId, watchedAt, progress, completed }]
```

## Action Queue

Queue actions khi offline, sync khi online:

```tsx
import {
  queueAction,
  registerActionHandler,
  syncAllActions,
  getPendingActions,
} from '@vortex/core/offline'

// Queue like action
async function likeVideo(videoId: string) {
  // Optimistic UI update
  updateUI(videoId, { liked: true })
  
  // Queue for later sync
  await queueAction('like', { videoId })
}

// Process queue when online
useEffect(() => {
  if (isOnline) {
    registerActionHandler('like', async (action) => {
      await api.likeVideo(action.payload.videoId as string)
    })

    registerActionHandler('comment', async (action) => {
      await api.postComment(
        action.payload.videoId as string,
        action.payload.content as string
      )
    })

    void syncAllActions()
  }
}, [isOnline])

// Inspect pending actions (optional)
const pending = await getPendingActions()
```

## Service Worker

### Setup với next-pwa

```bash npm2yarn
npm install next-pwa
```

```js title="next.config.js"
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    // HLS manifests - Network First
    {
      urlPattern: /\.m3u8$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'hls-manifests',
        networkTimeoutSeconds: 5,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 3600,
        },
      },
    },
    // HLS segments - Cache First
    {
      urlPattern: /\.ts$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'hls-segments',
        expiration: {
          maxEntries: 200,
          maxAgeSeconds: 86400,
        },
      },
    },
    // Thumbnails - Stale While Revalidate
    {
      urlPattern: /\.(jpg|jpeg|png|webp)$/,
      handler: 'StaleWhileRevalidate',
      options: {
        cacheName: 'images',
        expiration: {
          maxEntries: 100,
          maxAgeSeconds: 604800,
        },
      },
    },
    // API - Network First with fallback
    {
      urlPattern: /\/api\//,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'api-cache',
        networkTimeoutSeconds: 3,
        expiration: {
          maxEntries: 50,
          maxAgeSeconds: 300,
        },
      },
    },
  ],
})

module.exports = withPWA(nextConfig)
```

### Custom Service Worker

```js title="public/sw.js"
import { precacheAndRoute } from 'workbox-precaching'
import { registerRoute } from 'workbox-routing'
import { NetworkFirst, CacheFirst, StaleWhileRevalidate } from 'workbox-strategies'
import { ExpirationPlugin } from 'workbox-expiration'

// Precache static assets
precacheAndRoute(self.__WB_MANIFEST)

// HLS Manifests
registerRoute(
  ({ url }) => url.pathname.endsWith('.m3u8'),
  new NetworkFirst({
    cacheName: 'hls-manifests',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 50,
        maxAgeSeconds: 3600,
      }),
    ],
  })
)

// HLS Segments
registerRoute(
  ({ url }) => url.pathname.endsWith('.ts'),
  new CacheFirst({
    cacheName: 'hls-segments',
    plugins: [
      new ExpirationPlugin({
        maxEntries: 200,
        maxAgeSeconds: 86400,
      }),
    ],
  })
)
```

## Offline UI

### Offline Feed

```tsx
import { useNetworkStatus } from '@vortex/core'
import { getCachedVideos } from '@vortex/core/storage'

function OfflineFeed() {
  const { isOnline } = useNetworkStatus()
  const [offlineVideos, setOfflineVideos] = useState([])

  useEffect(() => {
    if (!isOnline) {
      getCachedVideos().then(setOfflineVideos)
    }
  }, [isOnline])

  if (!isOnline) {
    return (
      <div className="h-screen bg-black">
        <div className="p-4 bg-yellow-500 text-black">
          📴 Chế độ offline - Hiển thị video đã lưu
        </div>
        
        {offlineVideos.length > 0 ? (
          <VideoFeed videos={offlineVideos} />
        ) : (
          <div className="flex items-center justify-center h-full text-white">
            Không có video đã lưu
          </div>
        )}
      </div>
    )
  }

  return <VideoFeed videos={videos} />
}
```

### Offline indicator

```tsx
import { useNetworkStatus } from '@vortex/core'
import { motion, AnimatePresence } from 'motion/react'

function OfflineIndicator() {
  const { isOnline } = useNetworkStatus()
  const [wasOffline, setWasOffline] = useState(false)

  useEffect(() => {
    if (!isOnline) {
      setWasOffline(true)
    } else if (wasOffline) {
      // Show "back online" message briefly
      setTimeout(() => setWasOffline(false), 3000)
    }
  }, [isOnline])

  return (
    <AnimatePresence>
      {!isOnline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 bg-gray-800 text-white p-3 text-center z-50"
        >
          📴 Không có kết nối mạng
        </motion.div>
      )}
      
      {isOnline && wasOffline && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 bg-green-500 text-white p-3 text-center z-50"
        >
          ✅ Đã kết nối lại
        </motion.div>
      )}
    </AnimatePresence>
  )
}
```

## Cache Management

### Cache size

```tsx
import { getStorageUsage, clearOldCache } from '@vortex/core/storage'

function CacheSettings() {
  const [cacheSize, setCacheSize] = useState(0)

  useEffect(() => {
    getStorageUsage().then((usage) => setCacheSize(usage.total))
  }, [])

  const handleClear = async () => {
    // Delete cached videos older than 7 days (example policy)
    await clearOldCache(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
    setCacheSize(0)
  }

  return (
    <div className="p-4">
      <p>Cache size: {formatBytes(cacheSize)}</p>
      <button onClick={handleClear}>
        Xóa cache
      </button>
    </div>
  )
}

function formatBytes(bytes: number) {
  if (bytes === 0) return '0 Bytes'
  const k = 1024
  const sizes = ['Bytes', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}
```

### Auto cleanup

```tsx
import { clearOldCache } from '@vortex/core/storage'

// Clean up on app start
useEffect(() => {
  void clearOldCache(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
}, [])
```

## Best Practices

1. **Cache strategically** - Only cache videos user has watched
2. **Respect storage limits** - Monitor and cleanup old cache
3. **Graceful degradation** - Always show offline UI
4. **Queue important actions** - Don't lose user interactions
5. **Sync on reconnect** - Process queue when back online

