---
sidebar_position: 4
---

# @vortex/gestures

Gesture system cho VortexStream - Tap, swipe, long press, và more.

## Cài đặt

```bash npm2yarn
npm install @vortex/gestures @vortex/core @use-gesture/react
```

## Tổng quan

`@vortex/gestures` cung cấp:

- 👆 **Tap Detection** - Single và double tap với zone detection
- 👆👆 **Long Press** - Configurable threshold với haptic
- ✋ **Hold** - Continuous hold detection
- 👈👉 **Swipe** - Horizontal và vertical swipe
- 🎚️ **Drag** - Seek bar dragging
- 💫 **Visual Feedback** - Ripple effects

## Gesture Zones

Video player được chia thành 3 zones:

```
┌─────────┬─────────┬─────────┐
│         │         │         │
│  LEFT   │ CENTER  │  RIGHT  │
│  (33%)  │  (33%)  │  (33%)  │
│         │         │         │
└─────────┴─────────┴─────────┘
```

| Zone | Single Tap | Double Tap |
|------|------------|------------|
| Left | - | Seek -10s |
| Center | Play/Pause | Like |
| Right | - | Seek +10s |

## useVideoGestures

Hook chính để xử lý tất cả gestures:

```tsx
import { useVideoGestures } from '@vortex/gestures'

function VideoPlayer({ video }) {
  const [isPlaying, setIsPlaying] = useState(true)
  const [isLiked, setIsLiked] = useState(false)
  const playerRef = useRef(null)

  const bind = useVideoGestures({
    // Single tap
    onSingleTap: (zone) => {
      if (zone === 'center') {
        setIsPlaying(!isPlaying)
      }
    },
    
    // Double tap
    onDoubleTap: (zone) => {
      if (zone === 'center') {
        setIsLiked(true)
        showHeartAnimation()
      } else if (zone === 'left') {
        playerRef.current?.seek(-10)
        showSeekIndicator('-10s')
      } else if (zone === 'right') {
        playerRef.current?.seek(10)
        showSeekIndicator('+10s')
      }
    },
    
    // Long press
    onLongPress: () => {
      showContextMenu()
      haptic.medium()
    },
    
    // Hold
    onHoldStart: () => {
      pauseVideo()
    },
    onHoldEnd: () => {
      resumeVideo()
    },
    
    // Swipe
    onSwipeUp: () => {
      goToNextVideo()
    },
    onSwipeDown: () => {
      goToPreviousVideo()
    },
  })

  return (
    <div {...bind()} className="relative h-full w-full">
      <Video ref={playerRef} playing={isPlaying} />
    </div>
  )
}
```

## Individual Hooks

### useTapGestures

Single và double tap detection:

```tsx
import { useTapGestures } from '@vortex/gestures'

function TappableArea() {
  const bind = useTapGestures({
    onSingleTap: (zone) => {
      console.log('Single tap on', zone)
    },
    onDoubleTap: (zone) => {
      console.log('Double tap on', zone)
    },
    
    // Options
    doubleTapDelay: 300,    // ms
    enableHaptic: true,     // Haptic feedback
    enableZoneDetection: true,
  })

  return <div {...bind()} />
}
```

### useLongPress

Long press detection:

```tsx
import { useLongPress } from '@vortex/gestures'

function LongPressable() {
  const bind = useLongPress({
    onLongPress: (event) => {
      console.log('Long press at', event.clientX, event.clientY)
      showMenu()
    },
    
    // Options
    threshold: 500,       // ms
    enableHaptic: true,
    cancelOnMove: true,   // Cancel nếu move > 10px
  })

  return <div {...bind()} />
}
```

### useHold

Continuous hold detection:

```tsx
import { useHold } from '@vortex/gestures'

function Holdable() {
  const bind = useHold({
    onHoldStart: () => {
      console.log('Hold started')
      startFastForward()
    },
    onHoldEnd: () => {
      console.log('Hold ended')
      stopFastForward()
    },
    onHoldProgress: (duration) => {
      // Called every 100ms with total hold duration
      console.log('Holding for', duration, 'ms')
    },
    
    // Options
    threshold: 300,  // ms trước khi trigger
  })

  return <div {...bind()} />
}
```

### useSwipe

Swipe detection:

```tsx
import { useSwipe } from '@vortex/gestures'

function Swipeable() {
  const bind = useSwipe({
    onSwipeUp: () => nextVideo(),
    onSwipeDown: () => previousVideo(),
    onSwipeLeft: () => openProfile(),
    onSwipeRight: () => goBack(),
    
    // Options
    threshold: 50,        // px
    velocity: 0.5,        // px/ms
    enableHaptic: true,
  })

  return <div {...bind()} />
}
```

### useVerticalSwipe

Chỉ vertical swipe:

```tsx
import { useVerticalSwipe } from '@vortex/gestures'

function VerticalSwipeable() {
  const bind = useVerticalSwipe({
    onSwipeUp: () => next(),
    onSwipeDown: () => previous(),
    
    threshold: 100,
    lockHorizontal: true,  // Block horizontal scroll
  })

  return <div {...bind()} />
}
```

### useHorizontalSwipe

Chỉ horizontal swipe:

```tsx
import { useHorizontalSwipe } from '@vortex/gestures'

function HorizontalSwipeable() {
  const bind = useHorizontalSwipe({
    onSwipeLeft: () => forward(),
    onSwipeRight: () => back(),
    
    threshold: 100,
    lockVertical: true,
  })

  return <div {...bind()} />
}
```

### useSeekDrag

Drag to seek:

```tsx
import { useSeekDrag } from '@vortex/gestures'

function VideoWithSeek({ duration, currentTime }) {
  const bind = useSeekDrag({
    onSeekStart: () => {
      showSeekPreview()
    },
    onSeek: (amount) => {
      // amount: số giây seek (+/-)
      const newTime = Math.max(0, Math.min(duration, currentTime + amount))
      seekTo(newTime)
    },
    onSeekEnd: () => {
      hideSeekPreview()
    },
    
    // Options
    ratio: 0.5,      // 1px = 0.5s
    duration: duration,
    currentTime: currentTime,
  })

  return <div {...bind()} />
}
```

## Visual Components

### TapRipple

Ripple effect khi tap:

```tsx
import { TapRipple } from '@vortex/gestures'
import { useState } from 'react'

function VideoWithRipple() {
  const [ripple, setRipple] = useState<{ x: number; y: number } | null>(null)

  const handleTap = (event) => {
    setRipple({ x: event.clientX, y: event.clientY })
  }

  return (
    <div onClick={handleTap}>
      {ripple && (
        <TapRipple
          x={ripple.x}
          y={ripple.y}
          color="rgba(255, 255, 255, 0.3)"
          duration={400}
          onComplete={() => setRipple(null)}
        />
      )}
    </div>
  )
}
```

### GestureIndicator

Swipe direction indicator:

```tsx
import { GestureIndicator } from '@vortex/gestures'

function SwipeableWithIndicator() {
  const [swipeState, setSwipeState] = useState({
    direction: null,
    progress: 0,
    visible: false,
  })

  const bind = useSwipe({
    onSwipeProgress: (direction, progress) => {
      setSwipeState({ direction, progress, visible: true })
    },
    onSwipeEnd: () => {
      setSwipeState(prev => ({ ...prev, visible: false }))
    },
  })

  return (
    <div {...bind()}>
      <GestureIndicator
        direction={swipeState.direction}  // 'up' | 'down' | 'left' | 'right'
        progress={swipeState.progress}    // 0-1
        visible={swipeState.visible}
      />
    </div>
  )
}
```

### SeekIndicator

Seek amount indicator:

```tsx
import { SeekIndicator } from '@vortex/gestures'

function VideoWithSeekIndicator() {
  const [seekAmount, setSeekAmount] = useState<number | null>(null)

  const handleDoubleTap = (zone) => {
    if (zone === 'left') {
      setSeekAmount(-10)
      setTimeout(() => setSeekAmount(null), 500)
    } else if (zone === 'right') {
      setSeekAmount(10)
      setTimeout(() => setSeekAmount(null), 500)
    }
  }

  return (
    <div>
      {seekAmount && (
        <SeekIndicator
          amount={seekAmount}  // +10 hoặc -10
          side={seekAmount > 0 ? 'right' : 'left'}
        />
      )}
    </div>
  )
}
```

## Utilities

### getGestureZone

Xác định zone từ tap position:

```tsx
import { getGestureZone } from '@vortex/gestures'

function handleTap(event) {
  const zone = getGestureZone(event, containerRef.current)
  // Returns: 'left' | 'center' | 'right'
  
  if (zone === 'center') {
    togglePlay()
  }
}
```

### calculateSeekAmount

Tính seek amount từ drag:

```tsx
import { calculateSeekAmount } from '@vortex/gestures'

function handleDrag(movement) {
  const seekAmount = calculateSeekAmount(movement[0], {
    ratio: 0.5,           // 1px = 0.5s
    duration: 120,        // Video duration
    currentTime: 30,      // Current position
    clamp: true,          // Clamp to 0-duration
  })
  
  // seekAmount: seconds to seek
}
```

## Configuration

### Default thresholds

```typescript
import { GESTURE } from '@vortex/core/constants'

// Tap
GESTURE.TAP.DOUBLE_TAP_DELAY       // 300ms

// Long press
GESTURE.LONG_PRESS.THRESHOLD       // 500ms

// Swipe
GESTURE.SWIPE.THRESHOLD            // 50px
GESTURE.SWIPE.VELOCITY             // 0.5 px/ms

// Seek
GESTURE.SEEK.RATIO                 // 0.5 (1px = 0.5s)
```

### Custom configuration

```tsx
<VideoGestureProvider
  config={{
    tap: {
      doubleTapDelay: 250,
      enableHaptic: true,
    },
    longPress: {
      threshold: 400,
      enableHaptic: true,
    },
    swipe: {
      threshold: 60,
      velocity: 0.6,
    },
    seek: {
      ratio: 0.3,
    },
  }}
>
  <VideoFeed />
</VideoGestureProvider>
```

## Combining Gestures

### Multiple gestures on same element

```tsx
import { useGesture } from '@vortex/gestures'

function ComplexGesture() {
  const bind = useGesture({
    onTap: handleTap,
    onDoubleTap: handleDoubleTap,
    onLongPress: handleLongPress,
    onSwipe: handleSwipe,
    onDrag: handleDrag,
  }, {
    // Gesture priorities
    doubleTapCancelsLongPress: true,
    swipeCancelsTap: true,
  })

  return <div {...bind()} />
}
```

## Haptic Feedback

```tsx
import { haptic } from '@vortex/core'

// Light - cho tap
haptic.light()

// Medium - cho action complete
haptic.medium()

// Heavy - cho error
haptic.heavy()

// Custom patterns
haptic.pattern([10, 50, 10])  // [vibrate, pause, vibrate] ms
```

## Accessibility

```tsx
<div
  {...bind()}
  role="button"
  tabIndex={0}
  aria-label="Video player. Tap to play/pause, double tap center to like"
  onKeyDown={(e) => {
    if (e.key === ' ') togglePlay()
    if (e.key === 'Enter') like()
  }}
/>
```

## Performance Tips

### 1. Passive event listeners

```tsx
const bind = useVideoGestures({
  // ...handlers
}, {
  eventOptions: { passive: true }  // Better scroll performance
})
```

### 2. Debounce handlers

```tsx
import { useDebounce } from '@vortex/core'

const debouncedSeek = useDebounce((amount) => {
  player.seek(amount)
}, 100)

const bind = useSeekDrag({
  onSeek: debouncedSeek,
})
```

### 3. Threshold tuning

```tsx
// Tăng threshold nếu có nhiều misdetection
const bind = useSwipe({
  threshold: 80,  // Tăng từ 50 lên 80px
  velocity: 0.7,  // Tăng velocity requirement
})
```

## API Reference

Xem [Hooks API](/docs/api/hooks#gesture-hooks) để biết đầy đủ parameters.

