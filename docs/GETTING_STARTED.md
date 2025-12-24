# Getting Started with XHubReel

This guide will help you integrate XHubReel into your project.

## Installation

### Option 1: All-in-One (Recommended)

Install the embed package which includes everything:

```bash
npm install @xhub-reel/embed
```

Required peer dependencies:

```bash
npm install react react-dom hls.js motion lucide-react @tanstack/react-virtual @use-gesture/react zustand
```

### Option 2: Individual Packages

Install only what you need:

```bash
# Core (required)
npm install @xhub-reel/core

# Video player
npm install @xhub-reel/player hls.js

# UI components
npm install @xhub-reel/ui motion lucide-react

# Gesture system
npm install @xhub-reel/gestures @use-gesture/react

# Video feed
npm install @xhub-reel/feed @tanstack/react-virtual
```

## Basic Usage

### Full Feed Experience

```tsx
import { XHubReelEmbed } from '@xhub-reel/embed'
import type { Video } from '@xhub-reel/core'

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
      verified: true,
      followers: 10000,
      following: 100,
    },
    caption: 'Check out this awesome video! 🎉 #trending',
    hashtags: ['trending', 'viral'],
    stats: {
      views: 50000,
      likes: 5000,
      comments: 500,
      shares: 100,
      saves: 50,
    },
    duration: 30,
    createdAt: new Date().toISOString(),
  },
  // ... more videos
]

function App() {
  return (
    <div className="h-screen w-screen bg-black">
      <XHubReelEmbed
        videos={videos}
        config={{
          autoPlay: true,
          muted: true,
          showControls: true,
          showActions: true,
        }}
        onVideoChange={(video) => {
          console.log('Now playing:', video.id)
        }}
        onLike={(videoId) => {
          // Handle like
        }}
      />
    </div>
  )
}
```

### Single Video Player

```tsx
import { VideoPlayer } from '@xhub-reel/player'

function VideoPage() {
  return (
    <VideoPlayer
      src="https://example.com/video.m3u8"
      poster="https://example.com/poster.jpg"
      autoPlay
      muted
      onEnded={() => console.log('Video ended')}
      onProgress={(time, duration) => {
        console.log(`${time}/${duration}`)
      }}
    />
  )
}
```

## React Integration

### With React Query

```tsx
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { VideoFeed } from '@xhub-reel/feed'
import { useVideosQuery } from './hooks/useVideos'

const queryClient = new QueryClient()

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Feed />
    </QueryClientProvider>
  )
}

function Feed() {
  const { data, fetchNextPage, hasNextPage } = useVideosQuery()

  return (
    <VideoFeed
      videos={data?.pages.flatMap(p => p.videos) ?? []}
      onEndReached={() => hasNextPage && fetchNextPage()}
    />
  )
}
```

### With Zustand Stores

```tsx
import { usePlayerStore, useFeedStore } from '@xhub-reel/core'

function Controls() {
  const { isPlaying, togglePlay, toggleMute } = usePlayerStore()
  const { currentIndex, goToNext, goToPrevious } = useFeedStore()

  return (
    <div>
      <button onClick={togglePlay}>
        {isPlaying ? 'Pause' : 'Play'}
      </button>
      <button onClick={toggleMute}>Mute</button>
      <button onClick={goToPrevious}>Previous</button>
      <button onClick={goToNext}>Next</button>
    </div>
  )
}
```

## Next.js Integration

### App Router

```tsx
// app/layout.tsx
import { Inter } from 'next/font/google'
import './globals.css'

const inter = Inter({ subsets: ['latin'] })

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-black`}>
        {children}
      </body>
    </html>
  )
}

// app/page.tsx
import { XHubReelEmbed } from '@xhub-reel/embed'
import { getVideos } from '@/lib/api'

export default async function Home() {
  const videos = await getVideos()

  return (
    <main className="h-screen">
      <XHubReelEmbed videos={videos} />
    </main>
  )
}
```

### next.config.js

```js
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@xhub-reel/core',
    '@xhub-reel/player',
    '@xhub-reel/ui',
    '@xhub-reel/gestures',
    '@xhub-reel/feed',
    '@xhub-reel/embed',
  ],
}

module.exports = nextConfig
```

## Styling

### Tailwind CSS

Include the XHubReel preset:

```js
// tailwind.config.js
module.exports = {
  presets: [require('@xhub-reel/ui/tailwind.preset')],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@xhub-reel/ui/dist/**/*.js',
  ],
}
```

### CSS Variables

```css
:root {
  --xhub-reel-violet: #8B5CF6;
  --xhub-reel-like: #FF2D55;
  --xhub-reel-black: #000000;
}
```

## TypeScript

All packages include TypeScript definitions:

```tsx
import type {
  Video,
  Author,
  Comment,
  VideoStats,
  PlayerState,
  Quality,
} from '@xhub-reel/core'
```

## Next Steps

- [API Reference](./API.md) - Full API documentation
- [Customization](./CUSTOMIZATION.md) - Theming and styling
- [Examples](./EXAMPLES.md) - More code examples
- [Performance](./PERFORMANCE.md) - Optimization tips

