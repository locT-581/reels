---
sidebar_position: 2
---

# @xhub-reel/player

HLS video player tối ưu cho short-form content.

## Cài đặt

```bash npm2yarn
npm install @xhub-reel/player @xhub-reel/core hls.js
```

## Tổng quan

`@xhub-reel/player` cung cấp video player với:

- 🎬 **HLS Streaming** - Adaptive bitrate với hls.js
- ⚡ **Fast Start** - Time to first frame < 500ms
- 🎯 **Quality Selection** - Auto hoặc manual quality
- 🖼️ **Seek Preview** - Thumbnail preview khi seek
- ⌨️ **Keyboard Support** - Space, arrows, M for mute
- 📱 **Mobile Optimized** - Touch-friendly controls

## Basic Usage

### Đơn giản nhất

```tsx
import { VideoPlayer } from '@xhub-reel/player'

function App() {
  return (
    <VideoPlayer
      src="https://example.com/video.m3u8"
      poster="https://example.com/poster.jpg"
      autoPlay
      muted
    />
  )
}
```

### Với Video object

```tsx
import { VideoPlayer } from '@xhub-reel/player'
import type { Video } from '@xhub-reel/core'

function VideoPage({ video }: { video: Video }) {
  return (
    <VideoPlayer
      video={video}
      autoPlay
      muted
      controls
      onEnded={() => console.log('Video ended')}
      onProgress={(time, duration) => {
        console.log(`Progress: ${time}/${duration}`)
      }}
      onError={(error) => {
        console.error('Playback error:', error)
      }}
    />
  )
}
```

## Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `src` | `string` | - | Video URL (MP4 hoặc HLS) |
| `video` | `Video` | - | Video object từ @xhub-reel/core |
| `poster` | `string` | - | Poster image URL |
| `autoPlay` | `boolean` | `false` | Auto-play khi mount |
| `muted` | `boolean` | `true` | Bắt đầu muted |
| `loop` | `boolean` | `false` | Loop playback |
| `controls` | `boolean` | `true` | Hiển thị controls |
| `preload` | `'auto' \| 'metadata' \| 'none'` | `'metadata'` | Preload strategy |
| `playsInline` | `boolean` | `true` | Plays inline trên mobile |

### Event callbacks

| Prop | Type | Mô tả |
|------|------|-------|
| `onPlay` | `() => void` | Khi video bắt đầu phát |
| `onPause` | `() => void` | Khi video pause |
| `onEnded` | `() => void` | Khi video kết thúc |
| `onProgress` | `(time: number, duration: number) => void` | Progress update |
| `onBuffering` | `(isBuffering: boolean) => void` | Buffering state change |
| `onError` | `(error: Error) => void` | Playback error |
| `onQualityChange` | `(quality: Quality) => void` | Quality level change |
| `onTimeUpdate` | `(time: number) => void` | Time update mỗi frame |
| `onLoadedMetadata` | `(duration: number) => void` | Metadata loaded |
| `onFirstFrame` | `() => void` | First frame rendered |

## Hooks

### usePlayer

Truy cập player controls programmatically:

```tsx
import { VideoPlayer, usePlayer } from '@xhub-reel/player'

function CustomPlayer() {
  const {
    // State
    isPlaying,
    isMuted,
    currentTime,
    duration,
    buffered,
    quality,
    playbackRate,
    
    // Actions
    play,
    pause,
    togglePlay,
    toggleMute,
    seek,
    setVolume,
    setQuality,
    setPlaybackRate,
  } = usePlayer()

  return (
    <div>
      <VideoPlayer src="..." />
      
      <div className="custom-controls">
        <button onClick={togglePlay}>
          {isPlaying ? '⏸️' : '▶️'}
        </button>
        <button onClick={toggleMute}>
          {isMuted ? '🔇' : '🔊'}
        </button>
        <button onClick={() => seek(currentTime - 10)}>
          -10s
        </button>
        <button onClick={() => seek(currentTime + 10)}>
          +10s
        </button>
        <select
          value={quality}
          onChange={(e) => setQuality(e.target.value)}
        >
          <option value="auto">Auto</option>
          <option value="1080p">1080p</option>
          <option value="720p">720p</option>
          <option value="480p">480p</option>
        </select>
      </div>
    </div>
  )
}
```

### useVideoProgress

Theo dõi video progress:

```tsx
import { useVideoProgress } from '@xhub-reel/player'

function ProgressBar() {
  const {
    currentTime,
    duration,
    buffered,
    percentage,
  } = useVideoProgress()

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
      <span>{formatDuration(currentTime)} / {formatDuration(duration)}</span>
    </div>
  )
}
```

### useBuffering

Theo dõi buffering state:

```tsx
import { useBuffering } from '@xhub-reel/player'

function BufferingIndicator() {
  const { isBuffering, bufferProgress } = useBuffering()

  if (!isBuffering) return null

  return (
    <div className="buffering-overlay">
      <Spinner />
      <span>Buffering... {bufferProgress}%</span>
    </div>
  )
}
```

## HLS Engine

### Direct access

```tsx
import { HLSEngine } from '@xhub-reel/player'

// Tạo engine instance
const engine = new HLSEngine(videoElement, {
  maxBufferLength: 30,
  maxMaxBufferLength: 60,
  startLevel: -1, // Auto
  abrEwmaDefaultEstimate: 500000, // 500kbps
})

// Load video
engine.load('https://example.com/video.m3u8')

// Events
engine.on('levelSwitched', (level) => {
  console.log('Quality changed:', level)
})

engine.on('error', (error) => {
  console.error('HLS error:', error)
})

// Cleanup
engine.destroy()
```

### Custom HLS config

```tsx
import { VideoPlayer } from '@xhub-reel/player'

<VideoPlayer
  src="https://example.com/video.m3u8"
  hlsConfig={{
    maxBufferLength: 20,
    maxMaxBufferLength: 40,
    maxBufferSize: 20 * 1000 * 1000, // 20MB
    startLevel: 2, // Start with quality index 2
    abrBandWidthUpFactor: 0.8,
    abrBandWidthFactor: 0.95,
  }}
/>
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` / `K` | Play/Pause |
| `←` | Seek -5s |
| `→` | Seek +5s |
| `J` | Seek -10s |
| `L` | Seek +10s |
| `↑` | Volume up |
| `↓` | Volume down |
| `M` | Toggle mute |
| `F` | Fullscreen |
| `<` | Slower playback |
| `>` | Faster playback |
| `0-9` | Seek to 0%-90% |

```tsx
// Disable keyboard shortcuts
<VideoPlayer
  src="..."
  enableKeyboardShortcuts={false}
/>
```

## Components

### Timeline

High-performance video progress bar với RAF-based updates (zero re-renders).

```tsx
import { Timeline } from '@xhub-reel/player'
import { useRef } from 'react'

function VideoWithTimeline() {
  const videoRef = useRef<HTMLVideoElement>(null)
  
  return (
    <div className="relative">
      <video ref={videoRef} src="video.mp4" />
      
      <Timeline
        videoRef={videoRef}
        expanded={false}
        onSeekStart={() => console.log('Seeking...')}
        onSeekEnd={(time) => console.log('Seeked to:', time)}
        onExpandedChange={(expanded) => console.log('Expanded:', expanded)}
      />
    </div>
  )
}
```

**Props:**

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `videoRef` | `RefObject<HTMLVideoElement>` | required | Reference đến video element |
| `expanded` | `boolean` | `false` | Hiển thị full controls |
| `onSeekStart` | `() => void` | - | Khi bắt đầu seek |
| `onSeek` | `(time: number) => void` | - | Trong khi seek |
| `onSeekEnd` | `(time: number) => void` | - | Khi kết thúc seek |
| `onExpandedChange` | `(expanded: boolean) => void` | - | Khi toggle expanded |

**Features:**
- 🎯 RAF-based updates at 30 FPS (zero React re-renders)
- ♿ Full accessibility: ARIA attributes, keyboard navigation
- 📱 Touch-friendly: Large tap area, smooth scrubbing
- 🔋 Performance-optimized for mobile feeds

### QualitySelector

```tsx
import { QualitySelector } from '@xhub-reel/player'

<QualitySelector
  currentQuality="auto"
  availableQualities={['auto', '1080p', '720p', '480p']}
  onSelect={(quality) => player.setQuality(quality)}
/>
```

### SpeedSelector

```tsx
import { SpeedSelector } from '@xhub-reel/player'

<SpeedSelector
  currentSpeed={1}
  speeds={[0.5, 0.75, 1, 1.25, 1.5, 2]}
  onSelect={(speed) => player.setPlaybackRate(speed)}
/>
```

## HLS Configuration

Default configuration tối ưu cho short-form video:

```typescript
const defaultHLSConfig = {
  // Buffer settings (giảm để tiết kiệm memory)
  maxBufferLength: 30,              // 30s
  maxMaxBufferLength: 60,           // Max 60s
  maxBufferSize: 30 * 1000 * 1000,  // 30MB
  
  // ABR settings (aggressive cho mobile)
  abrEwmaDefaultEstimate: 500000,   // Start 500kbps
  abrBandWidthUpFactor: 0.7,        // Thận trọng khi tăng
  abrBandWidthFactor: 0.9,          // Nhanh giảm khi mạng yếu
  
  // Startup
  startLevel: -1,                   // Auto select
  autoStartLoad: true,
  
  // Error recovery
  fragLoadingMaxRetry: 3,
  manifestLoadingMaxRetry: 3,
  levelLoadingMaxRetry: 3,
}
```

## Performance Tips

### 1. Preload metadata only

```tsx
<VideoPlayer
  src="..."
  preload="metadata"  // Không load video cho đến khi play
/>
```

### 2. Lazy load HLS.js

```tsx
import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(
  () => import('@xhub-reel/player').then(mod => mod.VideoPlayer),
  { ssr: false }
)
```

### 3. Dispose khi không dùng

```tsx
import { usePlayer } from '@xhub-reel/player'

useEffect(() => {
  return () => {
    player.dispose() // Cleanup khi unmount
  }
}, [])
```

### 4. Giới hạn concurrent players

```tsx
// Chỉ giữ 3 player active cùng lúc
const MAX_ACTIVE_PLAYERS = 3
```

## Native HLS (Safari)

Safari hỗ trợ native HLS, không cần hls.js:

```tsx
import { VideoPlayer } from '@xhub-reel/player'

// Tự động detect và sử dụng native HLS trên Safari
<VideoPlayer
  src="https://example.com/video.m3u8"
  preferNativeHLS={true}  // Default: true
/>
```

## Error Handling

```tsx
import { VideoPlayer, PlayerError } from '@xhub-reel/player'

<VideoPlayer
  src="..."
  onError={(error) => {
    if (error.code === 'NETWORK_ERROR') {
      showToast('Mạng đang nghỉ ngơi, thử lại nhé!')
    } else if (error.code === 'MEDIA_ERROR') {
      showToast('Video không thể phát')
    }
  }}
  renderError={(error, retry) => (
    <div className="error-overlay">
      <p>{error.message}</p>
      <button onClick={retry}>Thử lại</button>
    </div>
  )}
/>
```

## API Reference

Xem [Components API](/docs/api/components#videoplayer) để biết đầy đủ props và methods.

