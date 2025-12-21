---
description: "Touch gesture implementation - tap, swipe, long press, and haptic feedback"
globs: ["**/gestures/**", "**/hooks/use*Gesture*", "**/hooks/use*Touch*"]
alwaysApply: false
---

# Gesture System Rules

## Library

Dùng `@use-gesture/react` (~12KB) cho tất cả gesture detection.

```typescript
import { useGesture } from '@use-gesture/react'
```

## Tap Gestures

### Single Tap (Giữa màn hình)

```typescript
// Action: Play/Pause toggle
onTap: ({ event }) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - rect.left
  const centerZone = rect.width * 0.3 // 30% giữa
  
  if (x > rect.width * 0.35 && x < rect.width * 0.65) {
    togglePlayPause()
  }
}
```

### Double Tap

```typescript
// Nửa trái: Tua lùi 10s
// Nửa phải: Tua tiến 10s
// Giữa: Like video

onDoubleTap: ({ event }) => {
  const rect = event.currentTarget.getBoundingClientRect()
  const x = event.clientX - rect.left
  const relativeX = x / rect.width
  
  if (relativeX < 0.35) {
    seekBackward(10)
    showSeekAnimation('-10s', 'left')
  } else if (relativeX > 0.65) {
    seekForward(10)
    showSeekAnimation('+10s', 'right')
  } else {
    likeVideo()
    showHeartAnimation()
  }
}
```

### Long Press

```typescript
// Action: Hiện context menu
// Threshold: 500ms
// Feedback: Haptic + blur background

onLongPress: () => {
  navigator.vibrate?.(10) // Haptic feedback
  showContextMenu()
}

// Config
{ longPress: { threshold: 500 } }
```

### Hold (Press & Hold)

```typescript
// Action: Pause tạm thời, thả ra tiếp tục
onPointerDown: () => {
  pauseTemporarily()
}

onPointerUp: () => {
  resumePlayback()
}
```

## Swipe Gestures

### Vertical Swipe (Chuyển video)

```typescript
// Threshold: > 30% viewport height
const SWIPE_THRESHOLD = window.innerHeight * 0.3

onDrag: ({ movement: [, my], direction: [, dy], velocity: [, vy] }) => {
  if (Math.abs(my) > SWIPE_THRESHOLD || vy > 0.5) {
    if (dy < 0) {
      goToNextVideo()
    } else {
      goToPreviousVideo()
    }
  }
}
```

### Horizontal Swipe (Profile / Navigation)

```typescript
// Threshold: > 40% viewport width
const HORIZONTAL_THRESHOLD = window.innerWidth * 0.4

onDrag: ({ movement: [mx], direction: [dx] }) => {
  if (Math.abs(mx) > HORIZONTAL_THRESHOLD) {
    if (dx < 0) {
      navigateToProfile()
    } else {
      navigateBack()
    }
  }
}
```

### Horizontal Drag on Seek Bar

```typescript
// 1px = 0.5s
const SEEK_RATIO = 0.5

onDrag: ({ movement: [mx], active }) => {
  if (active && isOnSeekBar) {
    const seekAmount = mx * SEEK_RATIO
    seekTo(currentTime + seekAmount)
    showSeekPreview()
  }
}
```

## Gesture Hook Implementation

```typescript
import { useGesture } from '@use-gesture/react'

export function useVideoGestures(videoRef: RefObject<HTMLVideoElement>) {
  const bind = useGesture(
    {
      onTap: handleTap,
      onDoubleTap: handleDoubleTap,
      onLongPress: handleLongPress,
      onDrag: handleDrag,
      onPinch: handlePinch,
    },
    {
      eventOptions: { passive: false },
      drag: {
        threshold: 10,
        filterTaps: true,
      },
      longPress: {
        threshold: 500,
      },
      pinch: {
        scaleBounds: { min: 1, max: 2 },
      },
    }
  )

  return bind
}
```

## Haptic Feedback

```typescript
// Dùng Vibration API
const haptic = {
  light: () => navigator.vibrate?.(10),
  medium: () => navigator.vibrate?.(20),
  heavy: () => navigator.vibrate?.(30),
  selection: () => navigator.vibrate?.([5, 5, 5]),
}

// Sử dụng khi:
// - Like video: haptic.light()
// - Long press: haptic.medium()
// - Speed change: haptic.selection()
// - Pull-to-refresh triggered: haptic.heavy()
```

## Context Menu Options

```typescript
const CONTEXT_MENU_OPTIONS = [
  { id: 'save', icon: 'Bookmark', label: 'Lưu video' },
  { id: 'not-interested', icon: 'XCircle', label: 'Không quan tâm' },
  { id: 'hide-author', icon: 'UserX', label: 'Ẩn tác giả này' },
  { id: 'report', icon: 'Flag', label: 'Báo cáo' },
  { id: 'copy-link', icon: 'Link', label: 'Sao chép link' },
] as const
```

## Double Tap Animation

```typescript
// Heart animation cho double tap like
const HeartAnimation = () => (
  <motion.div
    initial={{ scale: 0, opacity: 0 }}
    animate={{ scale: 1.2, opacity: 1 }}
    exit={{ scale: 1, opacity: 0 }}
    transition={{
      scale: { type: 'spring', stiffness: 500, damping: 15 },
      opacity: { delay: 0.3, duration: 0.2 }
    }}
    className="absolute inset-0 flex items-center justify-center pointer-events-none"
  >
    <Heart className="w-32 h-32 fill-vortex-red stroke-none" />
  </motion.div>
)
```

## Seek Animation

```typescript
// +10s / -10s animation
const SeekAnimation = ({ direction, amount }: Props) => (
  <motion.div
    initial={{ opacity: 0, x: direction === 'left' ? 20 : -20 }}
    animate={{ opacity: 1, x: 0 }}
    exit={{ opacity: 0 }}
    className={cn(
      'absolute top-1/2 -translate-y-1/2',
      direction === 'left' ? 'left-1/4' : 'right-1/4'
    )}
  >
    <span className="text-2xl font-bold text-white drop-shadow-lg">
      {amount}
    </span>
  </motion.div>
)
```

## Gesture Priorities

Khi có conflict giữa các gestures:

1. Long press có priority cao nhất (cancel other gestures)
2. Double tap cancel single tap
3. Drag/Swipe có threshold để phân biệt với tap
4. Pinch có priority khi 2 fingers detected

```typescript
// Debounce single tap để chờ double tap
const TAP_DELAY = 200 // ms

let tapTimeout: NodeJS.Timeout

onTap: () => {
  tapTimeout = setTimeout(() => {
    handleSingleTap()
  }, TAP_DELAY)
}

onDoubleTap: () => {
  clearTimeout(tapTimeout)
  handleDoubleTap()
}
```

