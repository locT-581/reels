---
description: "Video player implementation rules - HLS, controls, states, and playback behavior"
globs: ["**/player/**", "**/video/**", "**/*Player*", "**/*Video*"]
alwaysApply: false
---

# Video Player Rules

## Core Technology

- Dùng native `<video>` element làm base
- hls.js cho HLS streaming (web)
- Native HLS cho iOS Safari (không load hls.js)

## Player Architecture

```typescript
// Detect platform và chọn engine phù hợp
const useNativeHLS = () => {
  const video = document.createElement('video')
  return video.canPlayType('application/vnd.apple.mpegurl') !== ''
}

// iOS Safari: dùng native
// Còn lại: dùng hls.js
```

## HLS.js Configuration (Mobile Optimized)

```typescript
import Hls from 'hls.js'

const hlsConfig: Partial<HlsConfig> = {
  // Buffer management - tiết kiệm memory
  maxBufferLength: 30,
  maxMaxBufferLength: 60,
  maxBufferSize: 30 * 1000 * 1000, // 30MB
  
  // Aggressive ABR cho mobile
  abrEwmaDefaultEstimate: 500000,
  abrBandWidthUpFactor: 0.7,
  abrBandWidthFactor: 0.9,
  
  // Startup nhanh
  startLevel: -1,
  autoStartLoad: true,
  
  // Error recovery
  fragLoadingMaxRetry: 3,
  manifestLoadingMaxRetry: 3,
}
```

## Video States

Implement state machine với các states sau:

```typescript
type VideoState = 
  | 'idle'      // Chưa load
  | 'loading'   // Đang load
  | 'ready'     // Sẵn sàng phát
  | 'playing'   // Đang phát
  | 'paused'    // Tạm dừng
  | 'buffering' // Đang buffer
  | 'stalled'   // Mạng yếu > 5s
  | 'error'     // Lỗi
  | 'ended'     // Kết thúc
```

## Loading States Visual

| Duration | Visual |
|----------|--------|
| 0-500ms | Blur placeholder từ thumbnail |
| 500ms-2s | Skeleton shimmer |
| > 2s | Spinner + "Đang tải..." |

## Timeline Component

```tsx
import { Timeline, type TimelineRef } from '@vortex/player'

// Basic usage
<Timeline
  videoRef={videoRef}
  expanded={isExpanded}
  onSeekEnd={(time) => { video.currentTime = time }}
  onExpandedChange={setIsExpanded}
/>
```

### Timeline Performance Guidelines

```typescript
// ✅ ĐÚNG: requestAnimationFrame + 30 FPS throttling
const TARGET_FPS = 30
const FRAME_INTERVAL = 1000 / TARGET_FPS // ~33.3ms

const animationLoop = (timestamp: number) => {
  if (timestamp - lastUpdate >= FRAME_INTERVAL) {
    lastUpdate = timestamp
    // Direct DOM manipulation via refs
    progressRef.current.style.width = `${percent}%`
  }
  requestAnimationFrame(animationLoop)
}

// ❌ SAI: Không dùng useState cho progress
const [progress, setProgress] = useState(0) // Causes re-renders!
useEffect(() => {
  const interval = setInterval(() => {
    setProgress(video.currentTime / video.duration)
  }, 100)
}, [])
```

### Timeline Modes

| Mode | Visual |
|------|--------|
| **Collapsed** | 2px bar, tap to expand |
| **Expanded** | 4px bar + scrubber + time display |

## Player Controls UI

```tsx
// Play/Pause icon: Giữa màn hình, fade out sau 1s
<motion.div
  initial={{ opacity: 0, scale: 0.8 }}
  animate={{ opacity: 1, scale: 1 }}
  exit={{ opacity: 0 }}
  transition={{ duration: 0.15 }}
>
  {isPlaying ? <PauseIcon /> : <PlayIcon />}
</motion.div>
```

## Playback Speed Options

```typescript
const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const
```

## Quality Levels

```typescript
const QUALITY_LEVELS = ['auto', '1080p', '720p', '480p', '360p'] as const
```

## Error Messages (Human-friendly)

```typescript
const ERROR_MESSAGES = {
  network: 'Mạng đang nghỉ ngơi, thử lại nhé!',
  notFound: 'Video này đã bay màu rồi',
  restricted: 'Video không khả dụng ở khu vực bạn',
  server: 'Có lỗi từ phía chúng tôi, xin lỗi!',
} as const
```

## Video Activation Rules

```typescript
// Video phải chiếm > 50% viewport để auto-play
const ACTIVATION_THRESHOLD = 0.5

// Deactivate khi < 30% viewport
const DEACTIVATION_THRESHOLD = 0.3

// Không activate khi scroll nhanh > 2000px/s
const SCROLL_VELOCITY_THRESHOLD = 2000
```

## Memory Management

```typescript
// Chỉ giữ tối đa 5 video elements trong DOM
const MAX_VIDEOS_IN_DOM = 5

// Dispose video khi ra khỏi viewport ± 4 videos
const DISPOSE_THRESHOLD = 4
```

## Graceful Degradation

Khi mạng yếu:
1. Ưu tiên audio phát trước
2. Hiển thị blur placeholder cho video
3. Auto switch xuống quality thấp hơn

```typescript
// Audio priority loading
video.preload = 'metadata'
// Sau khi có audio, mới load video segments
```

## Performance Targets

| Metric | Target |
|--------|--------|
| Time to First Frame | < 500ms |
| Buffering Ratio | < 1% |
| Startup Failures | < 0.5% |
| Seek Latency | < 200ms |

