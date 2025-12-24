# @xhub-reel/gestures

> Gesture system for XHubReel - Tap, swipe, long press, and more

## Installation

```bash
npm install @xhub-reel/gestures @xhub-reel/core @use-gesture/react
# or
pnpm add @xhub-reel/gestures @xhub-reel/core @use-gesture/react
```

## Features

- 👆 **Tap Detection** - Single and double tap with zone detection
- 👆👆 **Long Press** - Configurable threshold with haptic feedback
- ✋ **Hold** - Continuous hold detection
- 👈👉 **Swipe** - Horizontal and vertical swipe gestures
- 🎚️ **Drag** - Seek bar dragging
- 💫 **Visual Feedback** - Ripple effects and indicators

## Usage

### useVideoGestures

Complete gesture handling for video players:

```tsx
import { useVideoGestures } from '@xhub-reel/gestures'

function VideoPlayer() {
  const bind = useVideoGestures({
    onSingleTap: (zone) => {
      if (zone === 'center') togglePlay()
    },
    onDoubleTap: (zone) => {
      if (zone === 'left') seek(-10)
      if (zone === 'center') like()
      if (zone === 'right') seek(10)
    },
    onLongPress: () => openContextMenu(),
    onSwipeUp: () => nextVideo(),
    onSwipeDown: () => previousVideo(),
  })

  return <div {...bind()} className="video-container">...</div>
}
```

### useTapGestures

Single and double tap detection:

```tsx
import { useTapGestures } from '@xhub-reel/gestures'

const bind = useTapGestures({
  onSingleTap: () => console.log('Single tap'),
  onDoubleTap: () => console.log('Double tap'),
  doubleTapDelay: 300,
  enableHaptic: true,
})
```

### useLongPress

Long press detection:

```tsx
import { useLongPress } from '@xhub-reel/gestures'

const bind = useLongPress({
  onLongPress: () => openMenu(),
  threshold: 500, // ms
  enableHaptic: true,
})
```

### useHold

Continuous hold detection:

```tsx
import { useHold } from '@xhub-reel/gestures'

const bind = useHold({
  onHoldStart: () => startFastForward(),
  onHoldEnd: () => stopFastForward(),
  threshold: 300,
})
```

### useSwipe

Swipe in any direction:

```tsx
import { useSwipe } from '@xhub-reel/gestures'

const bind = useSwipe({
  onSwipeUp: () => nextVideo(),
  onSwipeDown: () => previousVideo(),
  onSwipeLeft: () => nextPage(),
  onSwipeRight: () => goBack(),
  threshold: 50,
  velocity: 0.5,
})
```

### useVerticalSwipe

Vertical swipe only:

```tsx
import { useVerticalSwipe } from '@xhub-reel/gestures'

const bind = useVerticalSwipe({
  onSwipeUp: () => next(),
  onSwipeDown: () => previous(),
  threshold: 100,
})
```

### useHorizontalSwipe

Horizontal swipe only:

```tsx
import { useHorizontalSwipe } from '@xhub-reel/gestures'

const bind = useHorizontalSwipe({
  onSwipeLeft: () => forward(),
  onSwipeRight: () => back(),
  threshold: 100,
})
```

### useSeekDrag

Drag to seek:

```tsx
import { useSeekDrag } from '@xhub-reel/gestures'

const bind = useSeekDrag({
  onSeek: (amount) => seek(currentTime + amount),
  ratio: 0.5, // 1px = 0.5s
  duration: 120,
})
```

## Visual Components

### TapRipple

Ripple effect on tap:

```tsx
import { TapRipple } from '@xhub-reel/gestures'

{showRipple && (
  <TapRipple
    x={tapX}
    y={tapY}
    onComplete={() => setShowRipple(false)}
  />
)}
```

### GestureIndicator

Swipe direction indicator:

```tsx
import { GestureIndicator } from '@xhub-reel/gestures'

<GestureIndicator
  direction="up"
  progress={0.5}
  visible={isSwiping}
/>
```

## Utilities

### getGestureZone

Determine tap zone:

```tsx
import { getGestureZone } from '@xhub-reel/gestures'

const zone = getGestureZone(event, element)
// Returns: 'left' | 'center' | 'right'
```

### calculateSeekAmount

Calculate seek amount from drag:

```tsx
import { calculateSeekAmount } from '@xhub-reel/gestures'

const seekAmount = calculateSeekAmount(dragDistance, {
  ratio: 0.5,
  duration: 120,
  currentTime: 30,
})
```

## Gesture Zones

The video player is divided into 3 zones:

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

## Configuration

Default thresholds (from `@xhub-reel/core/constants`):

```typescript
GESTURE.TAP.DOUBLE_TAP_DELAY    // 300ms
GESTURE.LONG_PRESS.THRESHOLD    // 500ms
GESTURE.SWIPE.THRESHOLD         // 50px
GESTURE.SWIPE.VELOCITY          // 0.5
```

## License

MIT

