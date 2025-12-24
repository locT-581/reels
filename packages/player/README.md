# @xhub-reel/player

> HLS video player optimized for short-form content

## Installation

```bash
npm install @xhub-reel/player @xhub-reel/core hls.js
# or
pnpm add @xhub-reel/player @xhub-reel/core hls.js
```

## Features

- 🎬 **HLS Streaming** - Adaptive bitrate with hls.js
- ⚡ **Fast Start** - Time to first frame < 500ms
- 🎯 **Quality Selection** - Auto or manual quality
- 🖼️ **Seek Preview** - Thumbnail preview on seek
- ⌨️ **Keyboard Support** - Space, arrows, M for mute
- 📱 **Mobile Optimized** - Touch-friendly controls
- 🔊 **Volume Control** - Mute toggle, volume slider
- 🎚️ **Playback Speed** - 0.5x to 2x speed

## Usage

### Basic Usage

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

### With Video Object

```tsx
import { VideoPlayer } from '@xhub-reel/player'
import type { Video } from '@xhub-reel/core'

function VideoPage({ video }: { video: Video }) {
  return (
    <VideoPlayer
      video={video}
      autoPlay
      onEnded={() => console.log('Video ended')}
      onProgress={(time, duration) => {
        console.log(`Progress: ${time}/${duration}`)
      }}
    />
  )
}
```

### With Controls

```tsx
import { VideoPlayer, usePlayer } from '@xhub-reel/player'

function CustomPlayer() {
  const { play, pause, seek, setQuality } = usePlayer()

  return (
    <div>
      <VideoPlayer src="..." />
      <button onClick={play}>Play</button>
      <button onClick={pause}>Pause</button>
      <button onClick={() => seek(30)}>Skip to 30s</button>
      <button onClick={() => setQuality('720p')}>720p</button>
    </div>
  )
}
```

### HLS Engine Direct Access

```tsx
import { HLSEngine } from '@xhub-reel/player'

const engine = new HLSEngine(videoElement, {
  maxBufferLength: 30,
  startLevel: -1, // Auto
})

engine.load('https://example.com/video.m3u8')
engine.on('levelSwitched', (level) => {
  console.log('Quality changed to', level)
})
```

## Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `src` | `string` | - | Video URL (MP4 or HLS) |
| `video` | `Video` | - | Video object from @xhub-reel/core |
| `poster` | `string` | - | Poster image URL |
| `autoPlay` | `boolean` | `false` | Auto-play on mount |
| `muted` | `boolean` | `true` | Start muted |
| `loop` | `boolean` | `false` | Loop playback |
| `controls` | `boolean` | `true` | Show controls |
| `preload` | `string` | `'metadata'` | Preload strategy |
| `onPlay` | `() => void` | - | Play callback |
| `onPause` | `() => void` | - | Pause callback |
| `onEnded` | `() => void` | - | Ended callback |
| `onProgress` | `(time, duration) => void` | - | Progress callback |
| `onError` | `(error) => void` | - | Error callback |
| `onQualityChange` | `(quality) => void` | - | Quality change callback |

## Hooks

### usePlayer

Access player controls programmatically:

```tsx
const {
  play,
  pause,
  togglePlay,
  toggleMute,
  seek,
  setVolume,
  setQuality,
  setPlaybackRate,
  isPlaying,
  isMuted,
  currentTime,
  duration,
  quality,
} = usePlayer()
```

### useVideoProgress

Track video progress:

```tsx
const { currentTime, duration, buffered, percentage } = useVideoProgress()
```

## Keyboard Shortcuts

| Key | Action |
|-----|--------|
| `Space` | Play/Pause |
| `←` | Seek -10s |
| `→` | Seek +10s |
| `↑` | Volume up |
| `↓` | Volume down |
| `M` | Toggle mute |
| `F` | Fullscreen |
| `<` | Slower |
| `>` | Faster |

## HLS Configuration

Default HLS.js config optimized for short-form:

```typescript
{
  maxBufferLength: 30,
  maxMaxBufferLength: 60,
  maxBufferSize: 30 * 1000 * 1000, // 30MB
  startLevel: -1, // Auto
  abrEwmaDefaultEstimate: 500000,
  abrBandWidthUpFactor: 0.7,
  abrBandWidthFactor: 0.9,
}
```

## License

MIT

