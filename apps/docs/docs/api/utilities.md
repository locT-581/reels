---
sidebar_position: 5
---

# Utilities

Utility functions từ VortexStream.

## Format Functions

### formatCount

Format số lượng với suffix K/M/B.

```tsx
import { formatCount } from '@vortex/core'

formatCount(500)       // "500"
formatCount(1500)      // "1.5K"
formatCount(15000)     // "15K"
formatCount(1500000)   // "1.5M"
formatCount(1500000000) // "1.5B"
```

---

### formatDuration

Format seconds thành mm:ss hoặc h:mm:ss.

```tsx
import { formatDuration } from '@vortex/core'

formatDuration(45)      // "0:45"
formatDuration(125)     // "2:05"
formatDuration(3661)    // "1:01:01"
```

---

### formatTimestamp

Format timestamp thành relative time.

```tsx
import { formatTimestamp } from '@vortex/core'

formatTimestamp(new Date())                    // "now"
formatTimestamp(new Date(Date.now() - 60000))  // "1m"
formatTimestamp(new Date(Date.now() - 3600000)) // "1h"
formatTimestamp(new Date(Date.now() - 86400000)) // "1d"
formatTimestamp(new Date(Date.now() - 604800000)) // "1w"
```

---

## Device Utilities

### isMobile

Check if device is mobile.

```tsx
import { isMobile } from '@vortex/core'

if (isMobile()) {
  // Mobile-specific behavior
}
```

---

### isIOS / isAndroid

Check platform.

```tsx
import { isIOS, isAndroid } from '@vortex/core'

if (isIOS()) {
  // iOS-specific
}

if (isAndroid()) {
  // Android-specific
}
```

---

### isSafari

Check if browser is Safari.

```tsx
import { isSafari } from '@vortex/core'

if (isSafari()) {
  // Safari handles native HLS
}
```

---

### supportsHLS

Check if browser supports native HLS.

```tsx
import { supportsHLS } from '@vortex/core'

if (supportsHLS()) {
  // Use native video element
} else {
  // Use hls.js
}
```

---

### getDevicePixelRatio

Get device pixel ratio.

```tsx
import { getDevicePixelRatio } from '@vortex/core'

const ratio = getDevicePixelRatio()  // 2 on retina, 1 on standard
```

---

## Haptic Utilities

### haptic

Trigger haptic feedback.

```tsx
import { haptic } from '@vortex/core'

// Predefined patterns
haptic.light()    // Light tap feedback
haptic.medium()   // Medium feedback (actions)
haptic.heavy()    // Heavy feedback (errors)
haptic.success()  // Success pattern
haptic.error()    // Error pattern

// Custom pattern [vibrate, pause, vibrate] ms
haptic.pattern([10, 50, 10])
```

---

## Video Utilities

### isHLSSource

Check if URL is HLS manifest.

```tsx
import { isHLSSource } from '@vortex/core'

isHLSSource('https://example.com/video.m3u8')  // true
isHLSSource('https://example.com/video.mp4')   // false
```

---

### getVideoMimeType

Get MIME type from URL.

```tsx
import { getVideoMimeType } from '@vortex/core'

getVideoMimeType('video.mp4')   // 'video/mp4'
getVideoMimeType('video.webm')  // 'video/webm'
getVideoMimeType('video.m3u8')  // 'application/x-mpegURL'
```

---

### canPlaySource

Check if browser can play source.

```tsx
import { canPlaySource } from '@vortex/core'

const canPlay = canPlaySource('video/mp4')  // 'probably' | 'maybe' | ''
```

---

## Gesture Utilities

### getGestureZone

Determine tap zone from event.

```tsx
import { getGestureZone } from '@vortex/gestures'

const zone = getGestureZone(event, containerElement)
// Returns: 'left' | 'center' | 'right'
```

---

### calculateSeekAmount

Calculate seek amount from drag distance.

```tsx
import { calculateSeekAmount } from '@vortex/gestures'

const seekAmount = calculateSeekAmount(dragDistance, {
  ratio: 0.5,        // 1px = 0.5s
  duration: 120,
  currentTime: 30,
  clamp: true,
})
// Returns: number (seconds to seek)
```

---

## Storage Utilities

### saveWatchProgress

Save video watch progress.

```tsx
import { saveWatchProgress } from '@vortex/core/storage'

await saveWatchProgress(videoId, currentTime, duration)
```

---

### getWatchProgress

Get saved watch progress.

```tsx
import { getWatchProgress } from '@vortex/core/storage'

const progress = await getWatchProgress(videoId)
// { position: 30, duration: 120, percentage: 25, completed: false }
```

---

### getWatchHistory

Get watch history.

```tsx
import { getWatchHistory } from '@vortex/core/storage'

const history = await getWatchHistory(limit)
// [{ videoId, watchedAt, progress, completed }]
```

---

### clearWatchHistory

Clear all watch history.

```tsx
import { clearWatchHistory } from '@vortex/core/storage'

await clearWatchHistory()
```

---

### cacheVideo

Cache video metadata.

```tsx
import { cacheVideo } from '@vortex/core/storage'

await cacheVideo(video)
```

---

### getCachedVideo

Get cached video.

```tsx
import { getCachedVideo } from '@vortex/core/storage'

const video = await getCachedVideo(videoId)
```

---

### getCachedVideos

Get all cached videos.

```tsx
import { getCachedVideos } from '@vortex/core/storage'

const videos = await getCachedVideos()
```

---

### getStorageUsage

Get total storage usage (including cache).

```tsx
import { getStorageUsage } from '@vortex/core/storage'

const usage = await getStorageUsage()
const sizeInBytes = usage.total
```

---

### clearOldCache

Clear old cached videos (example policy).

```tsx
import { clearOldCache } from '@vortex/core/storage'

await clearOldCache(new Date(Date.now() - 7 * 24 * 60 * 60 * 1000))
```

---

## Action Queue

### queueAction

Queue action for offline sync.

```tsx
import { queueAction } from '@vortex/core/offline'

await queueAction('like', { videoId })
```

---

### syncAllActions

Process queued actions.

```tsx
import { registerActionHandler, syncAllActions } from '@vortex/core/offline'

registerActionHandler('like', async (action) => {
  await api.likeVideo(action.payload.videoId as string)
})

registerActionHandler('comment', async (action) => {
  await api.postComment(
    action.payload.videoId as string,
    action.payload.content as string
  )
})

await syncAllActions()
```

---

### getPendingActions

Get all queued actions.

```tsx
import { getPendingActions } from '@vortex/core/offline'

const actions = await getPendingActions()
```

---

## Constants

### ANIMATION

Animation constants.

```tsx
import { ANIMATION } from '@vortex/core/constants'

ANIMATION.SPRING.STIFFNESS  // 400
ANIMATION.SPRING.DAMPING    // 30
ANIMATION.EASING.VORTEX     // [0.32, 0.72, 0, 1]
ANIMATION.DURATION.FAST     // 150
ANIMATION.DURATION.NORMAL   // 300
ANIMATION.DURATION.SLOW     // 500
```

---

### COLORS

Color constants.

```tsx
import { COLORS } from '@vortex/core/constants'

COLORS.VIOLET   // '#8B5CF6'
COLORS.LIKE     // '#FF2D55'
COLORS.BLACK    // '#000000'
```

---

### GESTURE

Gesture constants.

```tsx
import { GESTURE } from '@vortex/core/constants'

GESTURE.TAP.DOUBLE_TAP_DELAY       // 300
GESTURE.LONG_PRESS.THRESHOLD       // 500
GESTURE.SWIPE.THRESHOLD            // 50
GESTURE.SWIPE.VELOCITY             // 0.5
```

---

### PLAYER

Player constants.

```tsx
import { PLAYER } from '@vortex/core/constants'

PLAYER.HLS.MAX_BUFFER_LENGTH       // 30
PLAYER.HLS.MAX_MAX_BUFFER_LENGTH   // 60
PLAYER.ACTIVATION.VISIBLE_THRESHOLD // 0.5
PLAYER.PRELOAD.COUNT               // 2
```

