---
sidebar_position: 2
---

# Next.js Integration

Hướng dẫn tích hợp XHubReel với Next.js 14+ (App Router).

## Setup

### 1. Cài đặt packages

```bash npm2yarn
npm install @xhub-reel/embed
npm install react react-dom hls.js motion lucide-react @tanstack/react-virtual @use-gesture/react zustand @tanstack/react-query
```

### 2. Cấu hình next.config.js

```js title="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  // Transpile @xhub-reel packages
  transpilePackages: [
    '@xhub-reel/core',
    '@xhub-reel/player',
    '@xhub-reel/ui',
    '@xhub-reel/gestures',
    '@xhub-reel/feed',
    '@xhub-reel/embed',
  ],
  
  // Image domains (nếu dùng next/image)
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '**',
      },
    ],
  },
}

module.exports = nextConfig
```

### 3. Cấu hình Tailwind

```js title="tailwind.config.js"
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@xhub-reel/ui/tailwind.preset')],
  content: [
    './app/**/*.{js,ts,jsx,tsx,mdx}',
    './components/**/*.{js,ts,jsx,tsx,mdx}',
    './node_modules/@xhub-reel/**/*.js',
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

### 4. Global CSS

```css title="app/globals.css"
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  --xhub-reel-violet: #8B5CF6;
  --xhub-reel-like: #FF2D55;
  --xhub-reel-black: #000000;
}

html, body {
  height: 100%;
  background: var(--xhub-reel-black);
}

/* Safe area padding cho mobile */
.pb-safe {
  padding-bottom: env(safe-area-inset-bottom);
}

.pt-safe {
  padding-top: env(safe-area-inset-top);
}
```

## App Structure

```
app/
├── layout.tsx           # Root layout
├── page.tsx             # Home page (redirect hoặc landing)
├── (feed)/
│   ├── layout.tsx       # Feed layout
│   ├── page.tsx         # Main feed
│   └── following/
│       └── page.tsx     # Following feed
├── video/
│   └── [id]/
│       └── page.tsx     # Single video page
├── profile/
│   └── [username]/
│       └── page.tsx     # User profile
├── providers.tsx        # Context providers
└── globals.css
```

## Implementation

### Root Layout

```tsx title="app/layout.tsx"
import type { Metadata, Viewport } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Providers } from './providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'XHubReel',
  description: 'Short-form video platform',
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
  viewportFit: 'cover',
  themeColor: '#000000',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="vi">
      <body className={`${inter.className} bg-black`}>
        <Providers>
          {children}
        </Providers>
      </body>
    </html>
  )
}
```

### Providers

```tsx title="app/providers.tsx"
'use client'

import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { useState, type ReactNode } from 'react'

export function Providers({ children }: { children: ReactNode }) {
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 60 * 1000,
            refetchOnWindowFocus: false,
          },
        },
      })
  )

  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  )
}
```

### Feed Page

```tsx title="app/(feed)/page.tsx"
'use client'

import { XHubReelEmbed } from '@xhub-reel/embed'
import { useInfiniteQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import type { Video } from '@xhub-reel/core'

interface FeedResponse {
  videos: Video[]
  nextCursor: string | null
}

async function fetchFeed(cursor?: string): Promise<FeedResponse> {
  const url = cursor ? `/api/feed?cursor=${cursor}` : '/api/feed'
  const res = await fetch(url)
  if (!res.ok) throw new Error('Failed to fetch feed')
  return res.json()
}

async function likeVideo(videoId: string) {
  const res = await fetch(`/api/videos/${videoId}/like`, {
    method: 'POST',
  })
  if (!res.ok) throw new Error('Failed to like video')
  return res.json()
}

export default function FeedPage() {
  const queryClient = useQueryClient()

  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: ({ pageParam }) => fetchFeed(pageParam),
    initialPageParam: undefined as string | undefined,
    getNextPageParam: (lastPage) => lastPage.nextCursor ?? undefined,
  })

  const likeMutation = useMutation({
    mutationFn: likeVideo,
    onMutate: async (videoId) => {
      // Cancel outgoing refetches
      await queryClient.cancelQueries({ queryKey: ['feed'] })

      // Snapshot previous value
      const previousData = queryClient.getQueryData(['feed'])

      // Optimistic update
      queryClient.setQueryData(['feed'], (old: any) => {
        if (!old) return old
        return {
          ...old,
          pages: old.pages.map((page: FeedResponse) => ({
            ...page,
            videos: page.videos.map((v: Video) =>
              v.id === videoId
                ? { ...v, stats: { ...v.stats, likes: v.stats.likes + 1 } }
                : v
            ),
          })),
        }
      })

      return { previousData }
    },
    onError: (err, videoId, context) => {
      // Rollback on error
      queryClient.setQueryData(['feed'], context?.previousData)
    },
  })

  const videos = data?.pages.flatMap((page) => page.videos) ?? []

  if (isLoading) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </div>
    )
  }

  if (isError) {
    return (
      <div className="h-screen w-screen bg-black flex items-center justify-center">
        <div className="text-white text-center">
          <p>Có lỗi xảy ra</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-xhub-reel-violet rounded-lg"
          >
            Thử lại
          </button>
        </div>
      </div>
    )
  }

  return (
    <main className="h-screen w-screen">
      <XHubReelEmbed
        videos={videos}
        config={{
          autoPlay: true,
          muted: true,
          showControls: true,
          showActions: true,
          showOverlay: true,
        }}
        onVideoChange={(video) => {
          // Track video view
          console.log('Viewing:', video.id)
        }}
        onLike={(videoId) => {
          likeMutation.mutate(videoId)
        }}
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
      />
    </main>
  )
}
```

### Single Video Page

```tsx title="app/video/[id]/page.tsx"
import { notFound } from 'next/navigation'
import { VideoPlayerPage } from './VideoPlayerPage'
import type { Video } from '@xhub-reel/core'

interface Props {
  params: { id: string }
}

async function getVideo(id: string): Promise<Video | null> {
  try {
    const res = await fetch(`${process.env.API_URL}/videos/${id}`, {
      next: { revalidate: 60 },
    })
    if (!res.ok) return null
    return res.json()
  } catch {
    return null
  }
}

// Generate metadata
export async function generateMetadata({ params }: Props) {
  const video = await getVideo(params.id)
  if (!video) return { title: 'Video not found' }

  return {
    title: video.caption || 'Video',
    description: `${video.author.displayName} - ${video.caption}`,
    openGraph: {
      title: video.caption,
      description: `${video.author.displayName} - ${video.stats.likes} likes`,
      images: [video.thumbnail],
      type: 'video.other',
    },
  }
}

export default async function VideoPage({ params }: Props) {
  const video = await getVideo(params.id)
  if (!video) notFound()

  return <VideoPlayerPage video={video} />
}
```

```tsx title="app/video/[id]/VideoPlayerPage.tsx"
'use client'

import { XHubReelPlayer } from '@xhub-reel/embed'
import type { Video } from '@xhub-reel/core'

export function VideoPlayerPage({ video }: { video: Video }) {
  return (
    <div className="h-screen w-screen bg-black">
      <XHubReelPlayer
        video={video}
        autoPlay
        muted
        controls
        showOverlay
        showActions
      />
    </div>
  )
}
```

### API Routes

```tsx title="app/api/feed/route.ts"
import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get('cursor')
  
  // Fetch from your backend
  const response = await fetch(
    `${process.env.BACKEND_URL}/feed${cursor ? `?cursor=${cursor}` : ''}`
  )
  const data = await response.json()
  
  return NextResponse.json(data)
}
```

```tsx title="app/api/videos/[id]/like/route.ts"
import { NextRequest, NextResponse } from 'next/server'

export async function POST(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  // Call your backend
  const response = await fetch(
    `${process.env.BACKEND_URL}/videos/${params.id}/like`,
    {
      method: 'POST',
      headers: {
        Authorization: request.headers.get('Authorization') || '',
      },
    }
  )
  
  const data = await response.json()
  return NextResponse.json(data)
}
```

## PWA Support

### next-pwa

```bash npm2yarn
npm install next-pwa
```

```js title="next.config.js"
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  register: true,
  skipWaiting: true,
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.m3u8$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'hls-manifests',
        expiration: { maxEntries: 50, maxAgeSeconds: 3600 },
      },
    },
    {
      urlPattern: /^https:\/\/.*\.ts$/,
      handler: 'CacheFirst',
      options: {
        cacheName: 'hls-segments',
        expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
      },
    },
  ],
})

module.exports = withPWA(nextConfig)
```

### manifest.json

```json title="public/manifest.json"
{
  "name": "XHubReel",
  "short_name": "XHubReel",
  "description": "Short-form video platform",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#000000",
  "theme_color": "#8B5CF6",
  "icons": [
    {
      "src": "/icons/icon-192.png",
      "sizes": "192x192",
      "type": "image/png"
    },
    {
      "src": "/icons/icon-512.png",
      "sizes": "512x512",
      "type": "image/png"
    }
  ]
}
```

## Performance Optimization

### Dynamic imports

```tsx
import dynamic from 'next/dynamic'

// Lazy load XHubReelEmbed
const XHubReelEmbed = dynamic(
  () => import('@xhub-reel/embed').then((mod) => mod.XHubReelEmbed),
  { 
    ssr: false,
    loading: () => <FeedSkeleton />,
  }
)
```

### Prefetching

```tsx
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'

function VideoFeed({ videos }) {
  const router = useRouter()

  // Prefetch video pages
  useEffect(() => {
    videos.slice(0, 5).forEach((video) => {
      router.prefetch(`/video/${video.id}`)
    })
  }, [videos, router])

  return <XHubReelEmbed videos={videos} />
}
```

## Troubleshooting

### Hydration mismatch

```tsx
// ❌ Sẽ gây hydration error
<XHubReelEmbed videos={videos} />

// ✅ Sử dụng 'use client' và dynamic import
'use client'
import dynamic from 'next/dynamic'

const XHubReelEmbed = dynamic(
  () => import('@xhub-reel/embed').then((m) => m.XHubReelEmbed),
  { ssr: false }
)
```

### Video không autoplay

Browsers require user interaction or muted video for autoplay:

```tsx
<XHubReelEmbed
  videos={videos}
  config={{
    autoPlay: true,
    muted: true,  // Bắt buộc cho autoplay
  }}
/>
```

