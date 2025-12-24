# @xhub-reel/core

> Core logic, types, stores, and utilities for XHubReel

## Installation

```bash
npm install @xhub-reel/core
# or
pnpm add @xhub-reel/core
# or
yarn add @xhub-reel/core
```

## Features

- 📦 **Types** - TypeScript definitions for Video, Author, Comment, etc.
- 🏪 **Stores** - Zustand stores for player, feed, and UI state
- 🪝 **Hooks** - Custom React hooks (useDebounce, useThrottle, useNetworkStatus)
- 🛠️ **Utilities** - Formatting, device detection, haptic feedback
- 💾 **Storage** - IndexedDB for video cache, watch history, preferences
- 🔄 **API Layer** - TanStack Query setup with optimized defaults
- 📴 **Offline** - Action queue for offline-first support
- 🔐 **API Integration** - XHubReelProvider for backend connectivity with auth support

## Usage

### Types

```typescript
import type { Video, Author, Comment, PlayerState } from '@xhub-reel/core'

const video: Video = {
  id: 'abc123',
  url: 'https://example.com/video.mp4',
  thumbnail: 'https://example.com/thumb.jpg',
  author: { id: '1', username: 'user', displayName: 'User' },
  caption: 'My video',
  // ...
}
```

### Stores

```typescript
import { usePlayerStore, useFeedStore, useUIStore } from '@xhub-reel/core'

// Player store
const { isPlaying, play, pause, togglePlay } = usePlayerStore()

// Feed store
const { videos, currentIndex, goToNext, goToPrevious } = useFeedStore()

// UI store
const { openCommentSheet, closeCommentSheet, showToast } = useUIStore()
```

### Hooks

```typescript
import { useDebounce, useThrottle, useNetworkStatus } from '@xhub-reel/core'

// Debounce search input
const debouncedSearch = useDebounce(searchQuery, 300)

// Throttle scroll handler
const throttledValue = useThrottle(value, 100)

// Network status
const { isOnline, isSlowConnection, effectiveType } = useNetworkStatus()
```

### Utilities

```typescript
import { formatCount, formatDuration, formatTimestamp } from '@xhub-reel/core'

formatCount(1500)      // "1.5K"
formatCount(2300000)   // "2.3M"
formatDuration(125)    // "2:05"
formatDuration(3661)   // "1:01:01"
formatTimestamp(date)  // "2h" or "3d"
```

### Storage

```typescript
import {
  saveWatchProgress,
  getWatchHistory,
  cacheVideo,
  getCachedVideo,
} from '@xhub-reel/core'

// Save watch progress
await saveWatchProgress('video-id', 30, 120) // position, duration

// Get watch history
const history = await getWatchHistory(20) // limit

// Cache video for offline
await cacheVideo(video)
```

### Constants

```typescript
import { ANIMATION, TIMING, COLORS, GESTURE } from '@xhub-reel/core/constants'

// Animation constants
ANIMATION.SPRING.STIFFNESS // 400
ANIMATION.SPRING.DAMPING   // 30
ANIMATION.EASING.XHUB_REEL    // [0.32, 0.72, 0, 1]

// Timing
TIMING.DOUBLE_TAP_DELAY    // 300ms
TIMING.LONG_PRESS_DELAY    // 500ms

// Colors
COLORS.VIOLET              // #8B5CF6
COLORS.LIKE                // #FF2D55
```

### API Integration (XHubReelProvider)

XHubReel supports two modes:
1. **Manual Mode**: Pass videos directly to components
2. **API Mode**: Automatic data fetching from your backend

#### Basic Setup with XHubReelProvider

```tsx
import { XHubReelProvider } from '@xhub-reel/core/api'
import { ConnectedVideoFeed } from '@xhub-reel/feed'

function App() {
  return (
    <XHubReelProvider
      config={{
        baseUrl: 'https://api.yoursite.com/v1',
        auth: {
          accessToken: userToken,
          onTokenExpired: async () => {
            // Refresh token logic
            const newToken = await refreshToken()
            return { accessToken: newToken }
          },
        },
      }}
    >
      <ConnectedVideoFeed feedType="foryou" />
    </XHubReelProvider>
  )
}
```

#### Full Configuration Options

```typescript
import type { XHubReelConfig } from '@xhub-reel/core'

const config: XHubReelConfig = {
  // Required: Your API base URL
  baseUrl: 'https://api.yoursite.com/v1',
  
  // Authentication
  auth: {
    accessToken: 'your-jwt-token',
    tokenType: 'Bearer', // default
    headerName: 'Authorization', // default
    
    // Called when API returns 401
    onTokenExpired: async () => {
      const newToken = await yourRefreshTokenLogic()
      return { accessToken: newToken }
    },
    
    // Called when refresh fails
    onAuthError: (error) => {
      console.error('Auth failed:', error)
      logout()
    },
    
    // Custom token expiry check (optional)
    isTokenExpired: (response, body) => {
      return response.status === 401
    },
  },
  
  // Custom endpoint mapping (match your backend)
  endpoints: {
    videos: '/feed/videos',           // GET - video list
    videoDetail: '/videos/:id',       // GET - single video
    likeVideo: '/videos/:id/like',    // POST - like
    unlikeVideo: '/videos/:id/like',  // DELETE - unlike
    saveVideo: '/videos/:id/save',    // POST - save
    comments: '/videos/:videoId/comments', // GET/POST - comments
    // ... more endpoints
  },
  
  // Transform API responses to XHubReel format
  transformers: {
    transformVideoList: (response) => ({
      videos: response.data.items,
      hasMore: response.data.has_more,
      nextCursor: response.data.next_cursor,
    }),
    transformVideo: (response) => response.data,
  },
  
  // Request/Response interceptors
  interceptors: {
    onRequest: (config) => {
      console.log('Request:', config)
      return config
    },
    onResponse: (response, body) => {
      console.log('Response:', response.status)
    },
    onError: (error) => {
      console.error('Request error:', error)
      return error // or throw modified error
    },
  },
  
  // Default fetch parameters
  defaultFetchParams: {
    limit: 10,
    feedType: 'foryou',
  },
  
  // Other options
  timeout: 30000, // Request timeout in ms
  headers: { 'X-App-Version': '1.0.0' }, // Additional headers
  debug: process.env.NODE_ENV === 'development',
}
```

#### Using with useXHubReelConfig Hook

```tsx
import { useXHubReelConfig } from '@xhub-reel/core/api'

function MyComponent() {
  const { config, isApiMode, setAccessToken } = useXHubReelConfig()
  
  // Update token after login
  const handleLogin = async () => {
    const token = await login()
    setAccessToken(token)
  }
  
  return (
    <div>
      {isApiMode ? 'Connected to API' : 'Manual mode'}
    </div>
  )
}
```

#### Creating Custom API Client

```typescript
import { createXHubReelApiClient } from '@xhub-reel/core/api'

const client = createXHubReelApiClient({
  baseUrl: 'https://api.example.com',
  auth: { accessToken: token },
})

// Fetch videos
const { videos, hasMore, nextCursor } = await client.fetchVideos({
  feedType: 'foryou',
  limit: 10,
})

// Like video
await client.likeVideo('video-id')

// Fetch comments
const comments = await client.fetchComments('video-id', { limit: 20 })
```

#### Using Pre-built Transformers

XHubReel provides pre-built transformers for common API response formats:

```typescript
import { 
  transformReelsResponse,
  transformSingleReelResponse,
  transformCommentsResponse,
  createVideoListTransformer,
} from '@xhub-reel/core'

// For APIs with structure:
// { code: 200, data: { reels: [...], has_next: true, next_cursor: "..." } }
const config: XHubReelConfig = {
  baseUrl: 'https://api.yoursite.com',
  transformers: {
    transformVideoList: transformReelsResponse,
    transformVideo: transformSingleReelResponse,
    transformComments: transformCommentsResponse,
  },
}
```

#### Custom Transformer Example

For APIs with custom structure:

```typescript
import { createVideoListTransformer } from '@xhub-reel/core'

// For APIs with structure:
// { code: 200, data: { items: [...], hasMore: true, nextPage: "..." } }
const customTransformer = createVideoListTransformer({
  videosPath: 'data.items',      // Path to videos array
  hasMorePath: 'data.hasMore',   // Path to hasMore boolean
  cursorPath: 'data.nextPage',   // Path to next cursor
  totalPath: 'data.totalCount',  // Optional: path to total
})

const config: XHubReelConfig = {
  baseUrl: 'https://api.yoursite.com',
  transformers: {
    transformVideoList: customTransformer,
  },
}
```

#### Complete Real-world Example

```typescript
import { XHubReelProvider } from '@xhub-reel/core/api'
import { transformReelsResponse } from '@xhub-reel/core'
import { ConnectedVideoFeed } from '@xhub-reel/feed'

function App() {
  const [token, setToken] = useState(getStoredToken())

  const config: XHubReelConfig = {
    baseUrl: 'https://gw-stg-messages.blocktrend.xyz/api/v1',
    
    // Authentication
    auth: {
      accessToken: token,
      onTokenExpired: async () => {
        const newToken = await refreshAccessToken()
        setToken(newToken)
        return { accessToken: newToken }
      },
      onAuthError: () => {
        // Redirect to login
        logout()
      },
    },
    
    // Custom endpoints matching your API
    endpoints: {
      videos: '/reels',                // GET - video list
      videoDetail: '/reels/:id',       // GET - single video
      likeVideo: '/reels/:id/like',    // POST - like
      unlikeVideo: '/reels/:id/unlike',// POST - unlike
      saveVideo: '/reels/:id/save',    // POST - save
      comments: '/reels/:videoId/comments',
    },
    
    // Use pre-built transformer for your API structure
    transformers: {
      transformVideoList: transformReelsResponse,
    },
    
    // Default params (api_key, etc.)
    defaultFetchParams: {
      api_key: 'YOUR_API_KEY',
      limit: 10,
    },
    
    debug: process.env.NODE_ENV === 'development',
  }

  return (
    <XHubReelProvider config={config}>
      <ConnectedVideoFeed />
    </XHubReelProvider>
  )
}
```

## API Reference

### Types

| Type | Description |
|------|-------------|
| `Video` | Video object with id, url, author, stats, etc. |
| `Author` | Author/user object |
| `Comment` | Comment object |
| `VideoStats` | Like, comment, share counts |
| `PlayerState` | idle, loading, playing, paused, buffering, error |
| `Quality` | auto, 360p, 480p, 720p, 1080p |
| `PlaybackSpeed` | 0.5, 0.75, 1, 1.25, 1.5, 2 |

### Stores

| Store | Purpose |
|-------|---------|
| `usePlayerStore` | Video playback state |
| `useFeedStore` | Video feed state |
| `useUIStore` | UI modals, sheets, toasts |
| `useUserStore` | User authentication |

### Hooks

| Hook | Description |
|------|-------------|
| `useDebounce(value, delay)` | Debounce a value |
| `useThrottle(value, limit)` | Throttle a value |
| `useNetworkStatus()` | Network connectivity |
| `useLike(videoId)` | Like functionality |
| `useSave(videoId)` | Save/bookmark |
| `useShare(videoId)` | Share functionality |

## License

MIT

