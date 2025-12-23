---
sidebar_position: 2
---

# Single Player

Ví dụ embed single video player.

## Basic Player

```tsx
import { VideoPlayer } from '@vortex/player'

export default function SinglePlayer() {
  return (
    <div className="h-screen w-screen bg-black">
      <VideoPlayer
        src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        poster="https://images.unsplash.com/photo-1611162616475-46b635cb6868"
        autoPlay
        muted
        controls
        onEnded={() => console.log('Video ended')}
      />
    </div>
  )
}
```

## With Video Object

```tsx
import { VideoPlayer } from '@vortex/player'
import type { Video } from '@vortex/core'

const video: Video = {
  id: '1',
  url: 'https://example.com/video.mp4',
  hlsUrl: 'https://example.com/video.m3u8',
  thumbnail: 'https://example.com/thumb.jpg',
  author: {
    id: 'user1',
    username: 'creator',
    displayName: 'Creator',
    avatar: 'https://example.com/avatar.jpg',
  },
  caption: 'Amazing video!',
  stats: { views: 1000, likes: 100, comments: 10, shares: 5 },
  duration: 60,
  createdAt: new Date().toISOString(),
}

export default function VideoPage() {
  return (
    <div className="h-screen w-screen bg-black">
      <VideoPlayer
        video={video}
        autoPlay
        muted
        controls
        onProgress={(time, duration) => {
          console.log(`Progress: ${time}/${duration}`)
        }}
      />
    </div>
  )
}
```

## Custom Controls

```tsx
import { VideoPlayer, usePlayer } from '@vortex/player'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'

export default function CustomControlsPlayer() {
  const {
    isPlaying,
    isMuted,
    currentTime,
    duration,
    togglePlay,
    toggleMute,
    seek,
  } = usePlayer()

  return (
    <div className="relative h-screen w-screen bg-black">
      <VideoPlayer
        src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        autoPlay
        muted
        controls={false}  // Hide default controls
      />
      
      {/* Custom controls overlay */}
      <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80">
        <div className="flex items-center gap-4">
          <button onClick={togglePlay}>
            {isPlaying ? <Pause /> : <Play />}
          </button>
          
          <button onClick={toggleMute}>
            {isMuted ? <VolumeX /> : <Volume2 />}
          </button>
          
          <input
            type="range"
            min={0}
            max={duration}
            value={currentTime}
            onChange={(e) => seek(Number(e.target.value))}
            className="flex-1"
          />
          
          <span className="text-white text-sm">
            {formatTime(currentTime)} / {formatTime(duration)}
          </span>
        </div>
      </div>
    </div>
  )
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
```

## Responsive Player

```tsx
export default function ResponsivePlayer() {
  return (
    <div className="max-w-lg mx-auto">
      <div className="aspect-[9/16] bg-black">
        <VideoPlayer
          src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
          autoPlay
          muted
          controls
        />
      </div>
    </div>
  )
}
```

