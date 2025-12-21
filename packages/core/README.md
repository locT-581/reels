# @vortex/core

> Core logic, types, stores, and utilities for VortexStream

## Installation

```bash
npm install @vortex/core
# or
pnpm add @vortex/core
# or
yarn add @vortex/core
```

## Features

- 📦 **Types** - TypeScript definitions for Video, Author, Comment, etc.
- 🏪 **Stores** - Zustand stores for player, feed, and UI state
- 🪝 **Hooks** - Custom React hooks (useDebounce, useThrottle, useNetworkStatus)
- 🛠️ **Utilities** - Formatting, device detection, haptic feedback
- 💾 **Storage** - IndexedDB for video cache, watch history, preferences
- 🔄 **API Layer** - TanStack Query setup with optimized defaults
- 📴 **Offline** - Action queue for offline-first support

## Usage

### Types

```typescript
import type { Video, Author, Comment, PlayerState } from '@vortex/core'

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
import { usePlayerStore, useFeedStore, useUIStore } from '@vortex/core'

// Player store
const { isPlaying, play, pause, togglePlay } = usePlayerStore()

// Feed store
const { videos, currentIndex, goToNext, goToPrevious } = useFeedStore()

// UI store
const { openCommentSheet, closeCommentSheet, showToast } = useUIStore()
```

### Hooks

```typescript
import { useDebounce, useThrottle, useNetworkStatus } from '@vortex/core'

// Debounce search input
const debouncedSearch = useDebounce(searchQuery, 300)

// Throttle scroll handler
const throttledValue = useThrottle(value, 100)

// Network status
const { isOnline, isSlowConnection, effectiveType } = useNetworkStatus()
```

### Utilities

```typescript
import { formatCount, formatDuration, formatTimestamp } from '@vortex/core'

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
} from '@vortex/core'

// Save watch progress
await saveWatchProgress('video-id', 30, 120) // position, duration

// Get watch history
const history = await getWatchHistory(20) // limit

// Cache video for offline
await cacheVideo(video)
```

### Constants

```typescript
import { ANIMATION, TIMING, COLORS, GESTURE } from '@vortex/core/constants'

// Animation constants
ANIMATION.SPRING.STIFFNESS // 400
ANIMATION.SPRING.DAMPING   // 30
ANIMATION.EASING.VORTEX    // [0.32, 0.72, 0, 1]

// Timing
TIMING.DOUBLE_TAP_DELAY    // 300ms
TIMING.LONG_PRESS_DELAY    // 500ms

// Colors
COLORS.VIOLET              // #8B5CF6
COLORS.LIKE                // #FF2D55
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

