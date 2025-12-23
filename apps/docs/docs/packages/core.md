---
sidebar_position: 1
---

# @vortex/core

Core logic, types, stores, và utilities cho VortexStream.

## Cài đặt

```bash npm2yarn
npm install @vortex/core
```

## Tổng quan

`@vortex/core` là nền tảng của toàn bộ VortexStream SDK, cung cấp:

- 📦 **Types** - TypeScript definitions cho Video, Author, Comment
- 🏪 **Stores** - Zustand stores cho player, feed, UI state
- 🪝 **Hooks** - Custom React hooks
- 🛠️ **Utilities** - Formatting, device detection, haptic
- 💾 **Storage** - IndexedDB cho cache và history
- 📴 **Offline** - Action queue cho offline-first support

## Types

### Video

```typescript
import type { Video } from '@vortex/core'

const video: Video = {
  id: 'abc123',
  url: 'https://example.com/video.mp4',
  hlsUrl: 'https://example.com/video.m3u8',
  thumbnail: 'https://example.com/thumb.jpg',
  author: {
    id: 'user1',
    username: 'creator',
    displayName: 'Creator Name',
    avatar: 'https://example.com/avatar.jpg',
    verified: true,
    followers: 10000,
    following: 100,
  },
  caption: 'Video caption #hashtag',
  hashtags: ['hashtag'],
  stats: {
    views: 50000,
    likes: 5000,
    comments: 500,
    shares: 100,
    saves: 50,
  },
  duration: 30,
  createdAt: '2024-01-01T00:00:00Z',
}
```

### Author

```typescript
import type { Author } from '@vortex/core'

const author: Author = {
  id: 'user1',
  username: 'creator',
  displayName: 'Creator Name',
  avatar: 'https://example.com/avatar.jpg',
  verified: true,
  bio: 'Creator bio',
  followers: 10000,
  following: 100,
}
```

### Comment

```typescript
import type { Comment } from '@vortex/core'

const comment: Comment = {
  id: 'comment1',
  videoId: 'video1',
  author: {
    id: 'user2',
    username: 'commenter',
    displayName: 'Commenter',
    avatar: 'https://example.com/avatar2.jpg',
  },
  content: 'Great video!',
  likes: 50,
  replies: [],
  createdAt: '2024-01-01T12:00:00Z',
}
```

### Player Types

```typescript
import type {
  PlayerState,  // 'idle' | 'loading' | 'playing' | 'paused' | 'buffering' | 'error'
  Quality,      // 'auto' | '1080p' | '720p' | '480p' | '360p'
  PlaybackSpeed // 0.5 | 0.75 | 1 | 1.25 | 1.5 | 2
} from '@vortex/core'
```

## Stores

### usePlayerStore

Quản lý state của video player.

```typescript
import { usePlayerStore } from '@vortex/core'

function PlayerControls() {
  const {
    // State
    isPlaying,
    isMuted,
    volume,
    playbackSpeed,
    quality,
    currentTime,
    duration,
    buffered,
    
    // Actions
    play,
    pause,
    togglePlay,
    toggleMute,
    setVolume,
    setPlaybackSpeed,
    setQuality,
    seek,
  } = usePlayerStore()

  return (
    <div>
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={toggleMute}>
        {isMuted ? 'Unmute' : 'Mute'}
      </button>
      <input
        type="range"
        value={volume}
        onChange={(e) => setVolume(Number(e.target.value))}
      />
    </div>
  )
}
```

### useFeedStore

Quản lý state của video feed.

```typescript
import { useFeedStore } from '@vortex/core'

function FeedNavigation() {
  const {
    // State
    videos,
    currentIndex,
    currentVideo,
    feedType,
    
    // Actions
    setVideos,
    addVideos,
    setCurrentIndex,
    goToNext,
    goToPrevious,
    setFeedType,
  } = useFeedStore()

  return (
    <div>
      <p>Video {currentIndex + 1} of {videos.length}</p>
      <button onClick={goToPrevious}>Previous</button>
      <button onClick={goToNext}>Next</button>
    </div>
  )
}
```

### useUIStore

Quản lý UI modals, sheets, toasts.

```typescript
import { useUIStore } from '@vortex/core'

function VideoActions() {
  const {
    // State
    isCommentSheetOpen,
    isShareSheetOpen,
    activeVideoId,
    toast,
    
    // Actions
    openCommentSheet,
    closeCommentSheet,
    openShareSheet,
    closeShareSheet,
    showToast,
    hideToast,
  } = useUIStore()

  return (
    <div>
      <button onClick={() => openCommentSheet('video123')}>
        Comments
      </button>
      <button onClick={() => showToast('Đã lưu video!', 'success')}>
        Save
      </button>
    </div>
  )
}
```

## Hooks

### useDebounce

Debounce một giá trị.

```typescript
import { useDebounce } from '@vortex/core'

function Search() {
  const [query, setQuery] = useState('')
  const debouncedQuery = useDebounce(query, 300)

  useEffect(() => {
    if (debouncedQuery) {
      searchVideos(debouncedQuery)
    }
  }, [debouncedQuery])

  return <input value={query} onChange={(e) => setQuery(e.target.value)} />
}
```

### useThrottle

Throttle một giá trị.

```typescript
import { useThrottle } from '@vortex/core'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  const throttledScrollY = useThrottle(scrollY, 100)

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // throttledScrollY chỉ update mỗi 100ms
  return <p>Scroll: {throttledScrollY}</p>
}
```

### useNetworkStatus

Theo dõi trạng thái mạng.

```typescript
import { useNetworkStatus } from '@vortex/core'

function NetworkIndicator() {
  const {
    isOnline,
    isSlowConnection,
    effectiveType, // '4g' | '3g' | '2g' | 'slow-2g'
    downlink,      // Mbps
    rtt,           // ms
  } = useNetworkStatus()

  if (!isOnline) {
    return <div>Offline - Đang xem nội dung đã lưu</div>
  }

  if (isSlowConnection) {
    return <div>Mạng yếu - Video có thể bị giật</div>
  }

  return null
}
```

## Utilities

### Format functions

```typescript
import { formatCount, formatDuration, formatTimestamp } from '@vortex/core'

// Format số lượng
formatCount(1500)      // "1.5K"
formatCount(2300000)   // "2.3M"
formatCount(999)       // "999"

// Format thời lượng (giây -> mm:ss hoặc h:mm:ss)
formatDuration(125)    // "2:05"
formatDuration(3661)   // "1:01:01"

// Format timestamp
formatTimestamp(new Date('2024-01-01')) // "2h" hoặc "3d" hoặc "1w"
```

### Device utilities

```typescript
import {
  isMobile,
  isIOS,
  isAndroid,
  isSafari,
  supportsHLS,
  getDevicePixelRatio,
} from '@vortex/core'

// Kiểm tra thiết bị
if (isMobile()) {
  // Mobile-specific behavior
}

// Kiểm tra HLS support
if (!supportsHLS()) {
  // Use hls.js
}
```

### Haptic feedback

```typescript
import { haptic } from '@vortex/core'

// Trigger haptic feedback
haptic.light()    // Nhẹ - cho tap
haptic.medium()   // Vừa - cho action
haptic.heavy()    // Mạnh - cho error
haptic.success()  // Success pattern
haptic.error()    // Error pattern
```

## Storage

### Watch History

```typescript
import {
  saveWatchProgress,
  getWatchProgress,
  getWatchHistory,
  clearWatchHistory,
} from '@vortex/core/storage'

// Lưu tiến độ xem
await saveWatchProgress('video123', 30, 120) // position: 30s, duration: 120s

// Lấy tiến độ
const progress = await getWatchProgress('video123')
// { position: 30, duration: 120, percentage: 25, completed: false }

// Lấy lịch sử xem
const history = await getWatchHistory(20) // limit: 20
// [{ videoId, watchedAt, progress, completed }]

// Xóa lịch sử
await clearWatchHistory()
```

### Video Cache

```typescript
import {
  cacheVideo,
  getCachedVideo,
  getCachedVideos,
  getStorageUsage,
  clearOldCache,
} from '@vortex/core/storage'

// Cache video metadata
await cacheVideo(video)

// Lấy cached video
const cached = await getCachedVideo('video123')

// Lấy tất cả cached videos
const cachedVideos = await getCachedVideos()

// Kiểm tra cache size
const usage = await getStorageUsage()
const size = usage.total // bytes

// Xóa cache
await clearOldCache(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
```

## Constants

```typescript
import {
  ANIMATION,
  TIMING,
  COLORS,
  GESTURE,
  PLAYER,
  STORAGE,
} from '@vortex/core/constants'

// Animation
ANIMATION.SPRING.STIFFNESS  // 400
ANIMATION.SPRING.DAMPING    // 30
ANIMATION.EASING.VORTEX     // [0.32, 0.72, 0, 1]
ANIMATION.DURATION.FAST     // 150
ANIMATION.DURATION.NORMAL   // 300
ANIMATION.DURATION.SLOW     // 500

// Timing
TIMING.DOUBLE_TAP_DELAY     // 300
TIMING.LONG_PRESS_DELAY     // 500
TIMING.DEBOUNCE_DELAY       // 300

// Colors
COLORS.VIOLET               // '#8B5CF6'
COLORS.LIKE                 // '#FF2D55'
COLORS.BLACK                // '#000000'

// Gesture
GESTURE.TAP.DOUBLE_TAP_DELAY       // 300
GESTURE.LONG_PRESS.THRESHOLD       // 500
GESTURE.SWIPE.THRESHOLD            // 50
GESTURE.SWIPE.VELOCITY             // 0.5

// Player
PLAYER.HLS.MAX_BUFFER_LENGTH       // 30
PLAYER.HLS.MAX_MAX_BUFFER_LENGTH   // 60
PLAYER.ACTIVATION.VISIBLE_THRESHOLD // 0.5
PLAYER.PRELOAD.COUNT               // 2
```

## API Reference

Xem [API Reference](/docs/api/types) để biết đầy đủ type definitions.

