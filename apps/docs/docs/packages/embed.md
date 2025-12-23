---
sidebar_position: 6
---

# @vortex/embed

All-in-one embeddable video widget.

## Cài đặt

```bash npm2yarn
npm install @vortex/embed
```

### Peer Dependencies

```bash npm2yarn
npm install react react-dom hls.js motion lucide-react @tanstack/react-virtual @use-gesture/react zustand
```

## Tổng quan

`@vortex/embed` là package all-in-one bao gồm:

- 📦 **All packages bundled** - core, player, feed, gestures, ui
- 🎨 **Customizable** - Theme, colors, features
- 📱 **Responsive** - Works on any screen size
- ⚡ **Lightweight** - ~12KB gzipped (excluding peers)
- 🔌 **Easy Integration** - Single component

## Basic Usage

### VortexEmbed

```tsx
import { VortexEmbed } from '@vortex/embed'
import type { Video } from '@vortex/core'

const videos: Video[] = [
  {
    id: '1',
    url: 'https://example.com/video1.mp4',
    hlsUrl: 'https://example.com/video1.m3u8',
    thumbnail: 'https://example.com/thumb1.jpg',
    author: {
      id: 'user1',
      username: 'creator1',
      displayName: 'Creator One',
      avatar: 'https://example.com/avatar1.jpg',
    },
    caption: 'Amazing video! 🎉',
    stats: {
      views: 50000,
      likes: 5000,
      comments: 500,
      shares: 100,
    },
    duration: 30,
    createdAt: new Date().toISOString(),
  },
  // ... more videos
]

function App() {
  return (
    <div className="h-screen w-screen bg-black">
      <VortexEmbed
        videos={videos}
        config={{
          autoPlay: true,
          muted: true,
        }}
        onVideoChange={(video) => console.log('Playing:', video.id)}
        onLike={(videoId) => handleLike(videoId)}
      />
    </div>
  )
}
```

## Props

### VortexEmbed

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `videos` | `Video[]` | `[]` | Danh sách video |
| `width` | `number \| string` | `'100%'` | Chiều rộng container |
| `height` | `number \| string` | `'100%'` | Chiều cao container |
| `config` | `EmbedConfig` | `{}` | Cấu hình |
| `className` | `string` | - | Container class |

### Event Callbacks

| Prop | Type | Mô tả |
|------|------|-------|
| `onVideoChange` | `(video: Video) => void` | Video active thay đổi |
| `onLike` | `(videoId: string) => void` | User like video |
| `onComment` | `(videoId: string) => void` | User mở comments |
| `onShare` | `(videoId: string) => void` | User share video |
| `onSave` | `(videoId: string) => void` | User save video |
| `onEndReached` | `() => void` | Scroll gần cuối |
| `onError` | `(error: Error) => void` | Playback error |

### EmbedConfig

```typescript
interface EmbedConfig {
  // Playback
  autoPlay?: boolean        // Auto-play videos (default: true)
  muted?: boolean           // Start muted (default: true)
  loop?: boolean            // Loop single video (default: false)
  
  // UI
  showControls?: boolean    // Show player controls (default: true)
  showActions?: boolean     // Show like/comment/share (default: true)
  showOverlay?: boolean     // Show video info overlay (default: true)
  
  // Theme
  theme?: 'dark' | 'light'  // Theme (default: 'dark')
  accentColor?: string      // Accent color (default: '#8B5CF6')
  
  // Performance
  preloadCount?: number     // Videos to preload (default: 2)
  maxVideosInDOM?: number   // Max videos in DOM (default: 5)
}
```

## Full Configuration Example

```tsx
<VortexEmbed
  videos={videos}
  width="100%"
  height="100vh"
  
  config={{
    // Playback
    autoPlay: true,
    muted: true,
    loop: false,
    
    // UI
    showControls: true,
    showActions: true,
    showOverlay: true,
    
    // Theme
    theme: 'dark',
    accentColor: '#8B5CF6',
    
    // Performance
    preloadCount: 2,
    maxVideosInDOM: 5,
  }}
  
  // Events
  onVideoChange={(video) => {
    analytics.trackVideoView(video.id)
  }}
  onLike={async (videoId) => {
    await api.likeVideo(videoId)
  }}
  onComment={(videoId) => {
    // VortexEmbed sẽ mở comment sheet
    // Bạn có thể override behavior ở đây
  }}
  onShare={(videoId) => {
    // Custom share handling
  }}
  onSave={async (videoId) => {
    await api.saveVideo(videoId)
  }}
  onEndReached={() => {
    loadMoreVideos()
  }}
  onError={(error) => {
    console.error('Playback error:', error)
  }}
/>
```

## Single Video Player

Để embed single video:

```tsx
import { VortexPlayer } from '@vortex/embed'

<VortexPlayer
  video={video}
  autoPlay
  muted
  controls
  showOverlay
  showActions
  onLike={(videoId) => handleLike(videoId)}
/>
```

## Responsive Sizing

### Fixed size

```tsx
<VortexEmbed
  videos={videos}
  width={375}    // px
  height={667}   // px
/>
```

### Percentage

```tsx
<VortexEmbed
  videos={videos}
  width="100%"
  height="100vh"
/>
```

### Aspect ratio

```tsx
<div className="aspect-[9/16] max-w-[400px] mx-auto">
  <VortexEmbed
    videos={videos}
    width="100%"
    height="100%"
  />
</div>
```

## CDN Usage

### Script tag

```html
<!DOCTYPE html>
<html>
<head>
  <!-- Dependencies -->
  <script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
  <script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>
  
  <!-- VortexStream -->
  <script src="https://unpkg.com/@vortex/embed"></script>
</head>
<body>
  <div id="vortex-container" style="width: 100%; height: 100vh;"></div>
  
  <script>
    const videos = [
      {
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
        stats: { views: 1000, likes: 100, comments: 10 },
        duration: 30,
      }
    ];

    VortexEmbed.render('#vortex-container', {
      videos: videos,
      config: {
        autoPlay: true,
        muted: true,
      },
      onVideoChange: (video) => console.log('Playing:', video.id),
      onLike: (videoId) => console.log('Liked:', videoId),
    });
  </script>
</body>
</html>
```

### ES Module

```html
<script type="module">
  import { createVortexFeed } from 'https://cdn.jsdelivr.net/npm/@vortex/embed/+esm'
  
  const videos = await fetchVideos()
  
  createVortexFeed(document.getElementById('container'), {
    videos,
    config: { autoPlay: true, muted: true },
  })
</script>
```

## Iframe Embed

Cho cross-origin embedding:

```html
<iframe
  src="https://vortex.stream/embed?v=VIDEO_ID"
  width="375"
  height="667"
  frameborder="0"
  allow="autoplay; fullscreen; encrypted-media"
  allowfullscreen
></iframe>
```

### Iframe với nhiều videos

```html
<iframe
  src="https://vortex.stream/embed?feed=FEED_ID"
  width="100%"
  height="100vh"
  frameborder="0"
  allow="autoplay; fullscreen"
></iframe>
```

## Re-exports

Package này re-export từ các packages khác:

```typescript
// Components
export { VortexEmbed, VortexPlayer } from '@vortex/embed'
export { VideoFeed, VideoFeedItem } from '@vortex/feed'
export { VideoPlayer } from '@vortex/player'
export { LikeButton, Avatar, Button, /* ... */ } from '@vortex/ui'

// Hooks
export { usePlayer, useVideoProgress } from '@vortex/player'
export { useFeed, useVideoActivation } from '@vortex/feed'
export { useVideoGestures, useTapGestures } from '@vortex/gestures'
export { usePlayerStore, useFeedStore, useUIStore } from '@vortex/core'

// Types
export type { Video, Author, Comment } from '@vortex/core'
export type { EmbedConfig, EmbedProps } from '@vortex/embed'
```

## Custom Styling

### Override CSS variables

```css
/* Trong CSS của bạn */
:root {
  --vortex-violet: #FF6B00;  /* Custom accent */
  --vortex-like: #FF0000;    /* Custom like color */
}
```

### Tailwind classes

```tsx
<VortexEmbed
  videos={videos}
  className="rounded-2xl overflow-hidden shadow-2xl"
/>
```

## Integration Examples

### Next.js App Router

```tsx title="app/feed/page.tsx"
'use client'

import { VortexEmbed } from '@vortex/embed'
import { useVideos } from '@/hooks/useVideos'

export default function FeedPage() {
  const { videos, loadMore } = useVideos()

  return (
    <main className="h-screen">
      <VortexEmbed
        videos={videos}
        onEndReached={loadMore}
      />
    </main>
  )
}
```

### React with API

```tsx
import { VortexEmbed } from '@vortex/embed'
import { useQuery, useMutation } from '@tanstack/react-query'

function VideoFeed() {
  const { data: videos } = useQuery({
    queryKey: ['videos'],
    queryFn: fetchVideos,
  })

  const likeMutation = useMutation({
    mutationFn: likeVideo,
    onSuccess: () => queryClient.invalidateQueries(['videos']),
  })

  return (
    <VortexEmbed
      videos={videos ?? []}
      onLike={(videoId) => likeMutation.mutate(videoId)}
    />
  )
}
```

### Vue.js

```vue
<template>
  <div ref="container" class="h-screen"></div>
</template>

<script setup>
import { onMounted, ref } from 'vue'
import { createVortexFeed } from '@vortex/embed'

const container = ref(null)

onMounted(() => {
  createVortexFeed(container.value, {
    videos: videos.value,
    config: { autoPlay: true, muted: true },
  })
})
</script>
```

## Bundle Size

| Bundle | Size (gzip) |
|--------|-------------|
| @vortex/embed (code only) | ~12KB |
| + peer dependencies | ~150KB total |

:::tip
Nếu đã sử dụng React, HLS.js, etc. trong app, actual bundle added chỉ ~12KB.
:::

## Troubleshooting

### Video không tự phát

```tsx
// Browsers require muted for autoplay
<VortexEmbed
  videos={videos}
  config={{ autoPlay: true, muted: true }}
/>
```

### HLS không hoạt động

```tsx
// Đảm bảo hlsUrl là valid .m3u8
const videos = [
  {
    id: '1',
    hlsUrl: 'https://example.com/video.m3u8',  // Must be valid HLS manifest
    // ...
  }
]
```

### TypeScript errors

```tsx
// Import types
import { VortexEmbed } from '@vortex/embed'
import type { Video, EmbedConfig } from '@vortex/embed'

const config: EmbedConfig = {
  autoPlay: true,
  muted: true,
}

const videos: Video[] = [/* ... */]
```

## API Reference

Xem [Components API](/docs/api/components#vortexembed) để biết đầy đủ props và methods.

