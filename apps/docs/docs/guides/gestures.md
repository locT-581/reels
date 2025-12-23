---
sidebar_position: 4
---

# Gestures

Hướng dẫn cấu hình và tùy biến gesture system.

## Gesture Map

| Gesture | Zone | Action | Feedback |
|---------|------|--------|----------|
| Single Tap | Center | Play/Pause | Icon overlay |
| Double Tap | Left | Seek -10s | "-10s" animation |
| Double Tap | Center | Like | Heart animation |
| Double Tap | Right | Seek +10s | "+10s" animation |
| Long Press | Any | Context menu | Haptic + blur |
| Hold | Any | Temporary pause | Video freeze |
| Swipe Up | Full | Next video | Scroll snap |
| Swipe Down | Full | Previous video | Scroll snap |

## Basic Setup

```tsx
import { useVideoGestures } from '@vortex/gestures'

function VideoWithGestures({ video, onLike }) {
  const [isPlaying, setIsPlaying] = useState(true)

  const bind = useVideoGestures({
    onSingleTap: (zone) => {
      if (zone === 'center') {
        setIsPlaying(!isPlaying)
      }
    },
    onDoubleTap: (zone) => {
      if (zone === 'center') {
        onLike()
      }
    },
  })

  return (
    <div {...bind()} className="h-full w-full">
      <VideoPlayer autoPlay={isPlaying} />
    </div>
  )
}
```

## Zone Detection

Video được chia thành 3 zones:

```tsx
import { getGestureZone } from '@vortex/gestures'

function handleTap(event, containerRef) {
  const zone = getGestureZone(event, containerRef.current)
  // zone: 'left' | 'center' | 'right'
  
  switch (zone) {
    case 'left':
      seekBackward()
      break
    case 'center':
      togglePlay()
      break
    case 'right':
      seekForward()
      break
  }
}
```

### Custom zone ratios

```tsx
const bind = useVideoGestures({
  // Custom zone widths (default: 33% mỗi zone)
  zoneRatios: {
    left: 0.25,    // 25%
    center: 0.5,   // 50%
    right: 0.25,   // 25%
  },
  onDoubleTap: (zone) => {
    // ...
  },
})
```

## Double Tap Like

```tsx
import { DoubleTapHeart } from '@vortex/ui'
import { useState } from 'react'

function VideoWithDoubleTapLike({ video }) {
  const [showHeart, setShowHeart] = useState(false)
  const [heartPosition, setHeartPosition] = useState({ x: 0, y: 0 })

  const bind = useVideoGestures({
    onDoubleTap: (zone, event) => {
      if (zone === 'center') {
        // Show heart at tap position
        setHeartPosition({
          x: event.clientX,
          y: event.clientY,
        })
        setShowHeart(true)
        
        // Trigger like
        likeVideo(video.id)
      }
    },
  })

  return (
    <div {...bind()} className="relative h-full w-full">
      <VideoPlayer video={video} />
      
      {showHeart && (
        <DoubleTapHeart
          x={heartPosition.x}
          y={heartPosition.y}
          onComplete={() => setShowHeart(false)}
        />
      )}
    </div>
  )
}
```

## Seek Gestures

### Double tap to seek

```tsx
import { SeekIndicator } from '@vortex/gestures'

function VideoWithSeek() {
  const [seekIndicator, setSeekIndicator] = useState<{
    amount: number
    side: 'left' | 'right'
  } | null>(null)
  
  const playerRef = useRef(null)

  const bind = useVideoGestures({
    onDoubleTap: (zone) => {
      if (zone === 'left') {
        playerRef.current?.seek(-10)
        setSeekIndicator({ amount: -10, side: 'left' })
      } else if (zone === 'right') {
        playerRef.current?.seek(10)
        setSeekIndicator({ amount: 10, side: 'right' })
      }
      
      // Auto hide
      setTimeout(() => setSeekIndicator(null), 500)
    },
  })

  return (
    <div {...bind()}>
      <VideoPlayer ref={playerRef} />
      
      {seekIndicator && (
        <SeekIndicator
          amount={seekIndicator.amount}
          side={seekIndicator.side}
        />
      )}
    </div>
  )
}
```

### Drag to seek

```tsx
import { useSeekDrag } from '@vortex/gestures'

function SeekableVideo({ duration, currentTime, onSeek }) {
  const bind = useSeekDrag({
    onSeekStart: () => {
      // Show seek preview
      setShowPreview(true)
    },
    onSeek: (amount) => {
      // amount: giây cần seek (+/-)
      const newTime = clamp(currentTime + amount, 0, duration)
      onSeek(newTime)
    },
    onSeekEnd: () => {
      setShowPreview(false)
    },
    
    ratio: 0.5,  // 1px drag = 0.5s seek
    duration,
    currentTime,
  })

  return <div {...bind()} />
}
```

## Long Press Menu

```tsx
import { ContextMenu } from '@vortex/ui'
import { useLongPress } from '@vortex/gestures'

function VideoWithContextMenu({ video }) {
  const [menuOpen, setMenuOpen] = useState(false)
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 })

  const bind = useLongPress({
    onLongPress: (event) => {
      setMenuPosition({ x: event.clientX, y: event.clientY })
      setMenuOpen(true)
    },
    threshold: 500,      // 500ms
    enableHaptic: true,  // Vibrate on trigger
  })

  return (
    <div {...bind()}>
      <VideoPlayer video={video} />
      
      <ContextMenu
        isOpen={menuOpen}
        onClose={() => setMenuOpen(false)}
        position={menuPosition}
        items={[
          { icon: Bookmark, label: 'Lưu video', onClick: () => saveVideo(video.id) },
          { icon: XCircle, label: 'Không quan tâm', onClick: () => hideVideo(video.id) },
          { icon: Flag, label: 'Báo cáo', onClick: () => reportVideo(video.id) },
          { icon: Link, label: 'Sao chép link', onClick: () => copyLink(video.id) },
        ]}
      />
    </div>
  )
}
```

## Hold to Pause

```tsx
import { useHold } from '@vortex/gestures'

function VideoWithHoldToPause() {
  const [isPlaying, setIsPlaying] = useState(true)
  const wasPlayingRef = useRef(true)

  const bind = useHold({
    onHoldStart: () => {
      wasPlayingRef.current = isPlaying
      if (isPlaying) {
        setIsPlaying(false)
      }
    },
    onHoldEnd: () => {
      if (wasPlayingRef.current) {
        setIsPlaying(true)
      }
    },
    threshold: 200,
  })

  return (
    <div {...bind()}>
      <VideoPlayer autoPlay={isPlaying} />
    </div>
  )
}
```

## Swipe Navigation

```tsx
import { useVerticalSwipe } from '@vortex/gestures'

function SwipeableFeed({ videos, currentIndex, onIndexChange }) {
  const bind = useVerticalSwipe({
    onSwipeUp: () => {
      if (currentIndex < videos.length - 1) {
        onIndexChange(currentIndex + 1)
      }
    },
    onSwipeDown: () => {
      if (currentIndex > 0) {
        onIndexChange(currentIndex - 1)
      }
    },
    threshold: 100,  // px
    velocity: 0.5,   // px/ms
  })

  return (
    <div {...bind()}>
      <VideoPlayer video={videos[currentIndex]} />
    </div>
  )
}
```

## Haptic Feedback

```tsx
import { haptic } from '@vortex/core'

// Single tap feedback
haptic.light()

// Like feedback
haptic.medium()

// Error feedback
haptic.heavy()

// Custom pattern
haptic.pattern([10, 50, 10])  // [vibrate, pause, vibrate] ms
```

### Disable haptics

```tsx
const bind = useVideoGestures({
  onDoubleTap: (zone) => {
    // ...
  },
  enableHaptic: false,  // Disable all haptic feedback
})
```

## Custom Gesture Configuration

```tsx
import { GestureProvider } from '@vortex/gestures'

function App() {
  return (
    <GestureProvider
      config={{
        tap: {
          doubleTapDelay: 250,  // ms between taps
          enableHaptic: true,
        },
        longPress: {
          threshold: 400,       // ms
          cancelOnMove: true,   // Cancel if moved > 10px
        },
        swipe: {
          threshold: 60,        // px
          velocity: 0.6,        // px/ms
          lockDirection: true,  // Lock to initial direction
        },
        seek: {
          ratio: 0.3,           // 1px = 0.3s
        },
      }}
    >
      <VideoFeed />
    </GestureProvider>
  )
}
```

## Gesture Conflicts

### Prioritizing gestures

```tsx
const bind = useVideoGestures({
  onSingleTap: handleTap,
  onDoubleTap: handleDoubleTap,
  onLongPress: handleLongPress,
}, {
  // Double tap cancels single tap
  doubleTapCancelsSingleTap: true,  // default: true
  
  // Long press cancels taps
  longPressCancelsTap: true,  // default: true
  
  // Swipe cancels all taps
  swipeCancelsTap: true,  // default: true
})
```

### Disabling specific gestures

```tsx
const bind = useVideoGestures({
  // Only enable what you need
  onDoubleTap: handleDoubleTap,
  
  // Disable others
  onSingleTap: undefined,
  onLongPress: undefined,
})
```

## Accessibility

```tsx
<div
  {...bind()}
  role="button"
  tabIndex={0}
  aria-label="Video player. Double tap center to like, left to rewind, right to fast forward"
  onKeyDown={(e) => {
    switch (e.key) {
      case ' ':
        togglePlay()
        break
      case 'Enter':
        handleLike()
        break
      case 'ArrowLeft':
        seekBackward()
        break
      case 'ArrowRight':
        seekForward()
        break
    }
  }}
/>
```

## Performance Tips

### Passive listeners

```tsx
const bind = useVideoGestures({
  // ...handlers
}, {
  eventOptions: { passive: true }
})
```

### Debounce/throttle

```tsx
import { useMemo } from 'react'
import { debounce, throttle } from 'lodash-es'

function VideoWithOptimizedGestures() {
  const debouncedSeek = useMemo(
    () => debounce((time) => player.seek(time), 100),
    []
  )

  const bind = useSeekDrag({
    onSeek: debouncedSeek,
  })
}
```

