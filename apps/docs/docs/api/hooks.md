---
sidebar_position: 3
---

# Hooks

Custom React hooks từ VortexStream.

## Core Hooks

### useDebounce

Debounce một giá trị.

```tsx
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

**Parameters:**
- `value: T` - Giá trị cần debounce
- `delay: number` - Delay in milliseconds

**Returns:** `T` - Debounced value

---

### useThrottle

Throttle một giá trị.

```tsx
import { useThrottle } from '@vortex/core'

function ScrollTracker() {
  const [scrollY, setScrollY] = useState(0)
  const throttledScrollY = useThrottle(scrollY, 100)

  useEffect(() => {
    const handler = () => setScrollY(window.scrollY)
    window.addEventListener('scroll', handler)
    return () => window.removeEventListener('scroll', handler)
  }, [])

  return <p>Scroll: {throttledScrollY}</p>
}
```

**Parameters:**
- `value: T` - Giá trị cần throttle
- `limit: number` - Minimum interval in milliseconds

**Returns:** `T` - Throttled value

---

### useNetworkStatus

Theo dõi network status.

```tsx
import { useNetworkStatus } from '@vortex/core'

function NetworkIndicator() {
  const {
    isOnline,
    isSlowConnection,
    effectiveType,
    downlink,
    rtt,
  } = useNetworkStatus()

  if (!isOnline) return <div>Offline</div>
  if (isSlowConnection) return <div>Slow connection</div>
  return null
}
```

**Returns:**
```typescript
{
  isOnline: boolean
  isSlowConnection: boolean
  effectiveType: '4g' | '3g' | '2g' | 'slow-2g' | null
  downlink: number | null   // Mbps
  rtt: number | null        // ms
}
```

---

### usePrevious

Lưu giá trị trước đó.

```tsx
import { usePrevious } from '@vortex/core'

function VideoTracker({ videoId }) {
  const previousVideoId = usePrevious(videoId)

  useEffect(() => {
    if (previousVideoId && previousVideoId !== videoId) {
      trackVideoExit(previousVideoId)
    }
  }, [videoId, previousVideoId])
}
```

---

## Player Hooks

### usePlayer

Access player controls.

```tsx
import { usePlayer } from '@vortex/player'

function CustomControls() {
  const {
    isPlaying,
    isMuted,
    currentTime,
    duration,
    quality,
    play,
    pause,
    togglePlay,
    toggleMute,
    seek,
    setQuality,
    setPlaybackRate,
  } = usePlayer()

  return (
    <div>
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <span>{currentTime} / {duration}</span>
    </div>
  )
}
```

---

### useVideoProgress

Track video progress.

```tsx
import { useVideoProgress } from '@vortex/player'

function ProgressBar() {
  const { currentTime, duration, buffered, percentage } = useVideoProgress()

  return (
    <div className="progress-bar">
      <div 
        className="buffered" 
        style={{ width: `${(buffered / duration) * 100}%` }} 
      />
      <div 
        className="progress" 
        style={{ width: `${percentage}%` }} 
      />
    </div>
  )
}
```

---

### useBuffering

Track buffering state.

```tsx
import { useBuffering } from '@vortex/player'

function BufferingIndicator() {
  const { isBuffering, bufferProgress } = useBuffering()

  if (!isBuffering) return null

  return (
    <div className="buffering">
      <Spinner />
      <span>Buffering... {bufferProgress}%</span>
    </div>
  )
}
```

---

## Feed Hooks

### useFeed

Access feed state.

```tsx
import { useFeed } from '@vortex/feed'

function FeedControls() {
  const {
    videos,
    currentIndex,
    currentVideo,
    goToNext,
    goToPrevious,
    goToIndex,
    isFirstVideo,
    isLastVideo,
  } = useFeed()

  return (
    <div>
      <button onClick={goToPrevious} disabled={isFirstVideo}>
        Previous
      </button>
      <span>{currentIndex + 1} / {videos.length}</span>
      <button onClick={goToNext} disabled={isLastVideo}>
        Next
      </button>
    </div>
  )
}
```

---

### useVideoActivation

Control video activation.

```tsx
import { useVideoActivation } from '@vortex/feed'

function VideoItem({ video }) {
  const { isActive, activate, deactivate, visibilityPercentage } = useVideoActivation(video.id)

  return (
    <div className={isActive ? 'active' : ''}>
      <VideoPlayer autoPlay={isActive} />
      <span>Visibility: {visibilityPercentage}%</span>
    </div>
  )
}
```

---

### useVideoVisibility

Track element visibility.

```tsx
import { useVideoVisibility } from '@vortex/feed'
import { useRef } from 'react'

function VideoItem({ video }) {
  const ref = useRef<HTMLDivElement>(null)
  const { isVisible, percentage } = useVideoVisibility(ref, {
    threshold: 0.5,
    rootMargin: '0px',
  })

  return (
    <div ref={ref}>
      {isVisible && <VideoPlayer video={video} />}
    </div>
  )
}
```

---

## Gesture Hooks

### useVideoGestures

Complete gesture handling.

```tsx
import { useVideoGestures } from '@vortex/gestures'

function VideoWithGestures() {
  const bind = useVideoGestures({
    onSingleTap: (zone) => {
      if (zone === 'center') togglePlay()
    },
    onDoubleTap: (zone) => {
      if (zone === 'center') like()
      if (zone === 'left') seek(-10)
      if (zone === 'right') seek(10)
    },
    onLongPress: () => openMenu(),
    onSwipeUp: () => nextVideo(),
    onSwipeDown: () => previousVideo(),
  })

  return <div {...bind()} />
}
```

---

### useTapGestures

Tap detection only.

```tsx
import { useTapGestures } from '@vortex/gestures'

const bind = useTapGestures({
  onSingleTap: (zone) => handleTap(zone),
  onDoubleTap: (zone) => handleDoubleTap(zone),
  doubleTapDelay: 300,
  enableHaptic: true,
})
```

---

### useLongPress

Long press detection.

```tsx
import { useLongPress } from '@vortex/gestures'

const bind = useLongPress({
  onLongPress: (event) => {
    showContextMenu(event.clientX, event.clientY)
  },
  threshold: 500,
  enableHaptic: true,
})
```

---

### useSwipe

Swipe detection.

```tsx
import { useSwipe } from '@vortex/gestures'

const bind = useSwipe({
  onSwipeUp: () => next(),
  onSwipeDown: () => previous(),
  onSwipeLeft: () => openProfile(),
  onSwipeRight: () => goBack(),
  threshold: 50,
  velocity: 0.5,
})
```

---

### useSeekDrag

Drag to seek.

```tsx
import { useSeekDrag } from '@vortex/gestures'

const bind = useSeekDrag({
  onSeekStart: () => setIsSeeking(true),
  onSeek: (amount) => seek(currentTime + amount),
  onSeekEnd: () => setIsSeeking(false),
  ratio: 0.5,  // 1px = 0.5s
  duration,
  currentTime,
})
```

---

## UI Hooks

### useToast

Toast notifications.

```tsx
import { useToast } from '@vortex/ui'

function LikeButton({ videoId }) {
  const toast = useToast()

  const handleLike = async () => {
    await likeVideo(videoId)
    toast.success('Đã thích video!')
  }

  return <button onClick={handleLike}>Like</button>
}
```

**Methods:**
- `toast.success(message, options?)`
- `toast.error(message, options?)`
- `toast.info(message, options?)`
- `toast.warning(message, options?)`

---

### useModal

Modal state management.

```tsx
import { useModal } from '@vortex/ui'

function App() {
  const { isOpen, open, close, data } = useModal()

  return (
    <>
      <button onClick={() => open({ videoId: '123' })}>
        Open Modal
      </button>
      <Modal isOpen={isOpen} onClose={close}>
        Video ID: {data?.videoId}
      </Modal>
    </>
  )
}
```

---

### useBottomSheet

Bottom sheet state.

```tsx
import { useBottomSheet } from '@vortex/ui'

function App() {
  const sheet = useBottomSheet()

  return (
    <>
      <button onClick={() => sheet.open('comments')}>
        Comments
      </button>
      <BottomSheet
        isOpen={sheet.isOpen && sheet.type === 'comments'}
        onClose={sheet.close}
      >
        <CommentList />
      </BottomSheet>
    </>
  )
}
```

