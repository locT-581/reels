---
sidebar_position: 1
---

# Basic Integration

Hướng dẫn tích hợp XHubReel vào dự án React cơ bản.

## Bước 1: Cài đặt

```bash npm2yarn
npm install @xhub-reel/embed
npm install react react-dom hls.js motion lucide-react @tanstack/react-virtual @use-gesture/react zustand
```

## Bước 2: Chuẩn bị Video Data

Tạo file chứa video data:

```tsx title="src/data/videos.ts"
import type { Video } from '@xhub-reel/core'

export const mockVideos: Video[] = [
  {
    id: '1',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868',
    author: {
      id: 'user1',
      username: 'bunny_studios',
      displayName: 'Bunny Studios',
      avatar: 'https://i.pravatar.cc/150?u=user1',
      verified: true,
      followers: 125000,
      following: 234,
    },
    caption: 'Big Buck Bunny - A classic open source animation 🐰 #animation #opensource',
    hashtags: ['animation', 'opensource'],
    stats: {
      views: 1500000,
      likes: 89000,
      comments: 3400,
      shares: 12000,
      saves: 5600,
    },
    duration: 596,
    createdAt: '2024-01-15T10:30:00Z',
  },
  // Thêm videos khác...
]
```

## Bước 3: Tạo Video Feed Component

```tsx title="src/components/VideoFeed.tsx"
'use client' // Nếu dùng Next.js

import { XHubReelEmbed } from '@xhub-reel/embed'
import { mockVideos } from '../data/videos'
import { useState } from 'react'

export function VideoFeed() {
  const [videos, setVideos] = useState(mockVideos)

  const handleLike = async (videoId: string) => {
    console.log('Liked video:', videoId)
    // Call API để like video
    // await api.likeVideo(videoId)
    
    // Update local state (optimistic update)
    setVideos(prev =>
      prev.map(v =>
        v.id === videoId
          ? { ...v, stats: { ...v.stats, likes: v.stats.likes + 1 } }
          : v
      )
    )
  }

  const handleComment = (videoId: string) => {
    console.log('Open comments for:', videoId)
    // XHubReelEmbed sẽ tự mở comment sheet
  }

  const handleShare = (videoId: string) => {
    console.log('Share video:', videoId)
    // XHubReelEmbed sẽ tự mở share sheet
  }

  const handleVideoChange = (video: Video) => {
    console.log('Now playing:', video.id, video.caption)
    // Track video view
    // analytics.trackVideoView(video.id)
  }

  return (
    <div className="h-screen w-screen bg-black">
      <XHubReelEmbed
        videos={videos}
        config={{
          autoPlay: true,
          muted: true,
          showControls: true,
          showActions: true,
          showOverlay: true,
        }}
        onVideoChange={handleVideoChange}
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
      />
    </div>
  )
}
```

## Bước 4: Sử dụng trong App

### React (Vite/CRA)

```tsx title="src/App.tsx"
import { VideoFeed } from './components/VideoFeed'
import './App.css'

function App() {
  return <VideoFeed />
}

export default App
```

```css title="src/App.css"
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

html, body, #root {
  height: 100%;
  background: #000;
}
```

### Next.js

```tsx title="app/page.tsx"
import { VideoFeed } from '@/components/VideoFeed'

export default function Home() {
  return <VideoFeed />
}
```

```css title="app/globals.css"
@tailwind base;
@tailwind components;
@tailwind utilities;

html, body {
  height: 100%;
  background: #000;
}
```

## Bước 5: Thêm API Integration

### Fetch videos từ API

```tsx title="src/hooks/useVideos.ts"
import { useState, useEffect, useCallback } from 'react'
import type { Video } from '@xhub-reel/core'

export function useVideos() {
  const [videos, setVideos] = useState<Video[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [cursor, setCursor] = useState<string | null>(null)
  const [hasMore, setHasMore] = useState(true)

  // Initial fetch
  useEffect(() => {
    fetchVideos()
  }, [])

  const fetchVideos = async () => {
    setIsLoading(true)
    try {
      const response = await fetch(`/api/videos${cursor ? `?cursor=${cursor}` : ''}`)
      const data = await response.json()
      
      setVideos(prev => [...prev, ...data.videos])
      setCursor(data.nextCursor)
      setHasMore(data.nextCursor !== null)
    } catch (error) {
      console.error('Failed to fetch videos:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const loadMore = useCallback(() => {
    if (!isLoading && hasMore) {
      fetchVideos()
    }
  }, [isLoading, hasMore])

  const likeVideo = async (videoId: string) => {
    // Optimistic update
    setVideos(prev =>
      prev.map(v =>
        v.id === videoId
          ? { ...v, stats: { ...v.stats, likes: v.stats.likes + 1 } }
          : v
      )
    )

    try {
      await fetch(`/api/videos/${videoId}/like`, { method: 'POST' })
    } catch (error) {
      // Rollback on error
      setVideos(prev =>
        prev.map(v =>
          v.id === videoId
            ? { ...v, stats: { ...v.stats, likes: v.stats.likes - 1 } }
            : v
        )
      )
    }
  }

  return {
    videos,
    isLoading,
    hasMore,
    loadMore,
    likeVideo,
  }
}
```

### Sử dụng hook

```tsx title="src/components/VideoFeed.tsx"
import { XHubReelEmbed } from '@xhub-reel/embed'
import { useVideos } from '../hooks/useVideos'

export function VideoFeed() {
  const { videos, isLoading, loadMore, likeVideo } = useVideos()

  if (isLoading && videos.length === 0) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  return (
    <div className="h-screen w-screen bg-black">
      <XHubReelEmbed
        videos={videos}
        config={{
          autoPlay: true,
          muted: true,
        }}
        onLike={likeVideo}
        onEndReached={loadMore}
      />
    </div>
  )
}
```

## Bước 6: Styling (Optional)

### Tailwind CSS

```js title="tailwind.config.js"
module.exports = {
  presets: [require('@xhub-reel/ui/tailwind.preset')],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@xhub-reel/**/*.js',
  ],
}
```

### CSS Variables

```css title="src/styles/xhub-reel.css"
:root {
  --xhub-reel-violet: #8B5CF6;
  --xhub-reel-like: #FF2D55;
  --xhub-reel-black: #000000;
}
```

## Kết quả

Sau khi hoàn thành, bạn sẽ có:

- ✅ Video feed với scroll dọc
- ✅ Video tự động phát khi scroll đến
- ✅ Gesture support (tap, double-tap, swipe)
- ✅ Like, comment, share buttons
- ✅ Video info overlay
- ✅ Infinite scroll với load more

## Tiếp theo

- [Next.js Integration](/docs/guides/nextjs-integration) - Tích hợp chi tiết với Next.js
- [Custom UI](/docs/guides/custom-ui) - Tùy biến giao diện
- [Gestures](/docs/guides/gestures) - Cấu hình gesture

