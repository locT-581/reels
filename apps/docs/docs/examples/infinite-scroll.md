---
sidebar_position: 4
---

# Infinite Scroll

Ví dụ infinite scroll với TanStack Query.

## Setup

```bash npm2yarn
npm install @tanstack/react-query
```

## Implementation

```tsx
'use client'

import { XHubReelEmbed } from '@xhub-reel/embed'
import { useInfiniteQuery, QueryClient, QueryClientProvider } from '@tanstack/react-query'
import type { Video } from '@xhub-reel/core'

// Create query client
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      refetchOnWindowFocus: false,
    },
  },
})

// Fetch function
interface FeedResponse {
  videos: Video[]
  nextCursor: string | null
}

async function fetchFeed(cursor?: string): Promise<FeedResponse> {
  const url = cursor ? `/api/feed?cursor=${cursor}` : '/api/feed'
  const response = await fetch(url)
  if (!response.ok) throw new Error('Failed to fetch')
  return response.json()
}

// Main component
export default function InfiniteScrollFeed() {
  return (
    <QueryClientProvider client={queryClient}>
      <Feed />
    </QueryClientProvider>
  )
}

function Feed() {
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
          <p>Error loading feed</p>
          <button
            onClick={() => refetch()}
            className="mt-4 px-4 py-2 bg-[#8B5CF6] rounded-lg"
          >
            Retry
          </button>
        </div>
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
        onEndReached={() => {
          if (hasNextPage && !isFetchingNextPage) {
            fetchNextPage()
          }
        }}
        onRefresh={async () => {
          await refetch()
        }}
      />
      
      {/* Loading indicator */}
      {isFetchingNextPage && (
        <div className="fixed bottom-4 left-1/2 -translate-x-1/2 bg-white/10 backdrop-blur px-4 py-2 rounded-full">
          <span className="text-white text-sm">Loading more...</span>
        </div>
      )}
    </div>
  )
}
```

## Mock API Route (Next.js)

```tsx title="app/api/feed/route.ts"
import { NextRequest, NextResponse } from 'next/server'

// Mock data
const allVideos = Array.from({ length: 50 }, (_, i) => ({
  id: `video-${i + 1}`,
  url: `https://example.com/video-${i + 1}.mp4`,
  hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
  thumbnail: `https://picsum.photos/seed/${i}/400/600`,
  author: {
    id: `user-${(i % 5) + 1}`,
    username: `creator_${(i % 5) + 1}`,
    displayName: `Creator ${(i % 5) + 1}`,
    avatar: `https://i.pravatar.cc/150?u=user${(i % 5) + 1}`,
  },
  caption: `Video #${i + 1} - Amazing content! 🎬`,
  stats: {
    views: Math.floor(Math.random() * 1000000),
    likes: Math.floor(Math.random() * 50000),
    comments: Math.floor(Math.random() * 5000),
    shares: Math.floor(Math.random() * 1000),
  },
  duration: Math.floor(Math.random() * 60) + 15,
  createdAt: new Date(Date.now() - i * 3600000).toISOString(),
}))

const PAGE_SIZE = 10

export async function GET(request: NextRequest) {
  const cursor = request.nextUrl.searchParams.get('cursor')
  
  // Simulate network delay
  await new Promise((resolve) => setTimeout(resolve, 500))
  
  const startIndex = cursor ? parseInt(cursor) : 0
  const videos = allVideos.slice(startIndex, startIndex + PAGE_SIZE)
  const nextCursor = startIndex + PAGE_SIZE < allVideos.length 
    ? String(startIndex + PAGE_SIZE) 
    : null

  return NextResponse.json({
    videos,
    nextCursor,
  })
}
```

## With Pull to Refresh

```tsx
function FeedWithRefresh() {
  const { refetch } = useInfiniteQuery({
    queryKey: ['feed'],
    // ...
  })

  return (
    <XHubReelEmbed
      videos={videos}
      onRefresh={async () => {
        // Reset to first page
        await refetch()
      }}
    />
  )
}
```

## With Prefetching

```tsx
function FeedWithPrefetch() {
  const queryClient = useQueryClient()
  const { data } = useInfiniteQuery({
    queryKey: ['feed'],
    // ...
  })

  // Prefetch next page when near end
  useEffect(() => {
    const lastPage = data?.pages[data.pages.length - 1]
    if (lastPage?.nextCursor) {
      queryClient.prefetchQuery({
        queryKey: ['feed', lastPage.nextCursor],
        queryFn: () => fetchFeed(lastPage.nextCursor),
      })
    }
  }, [data, queryClient])

  return <XHubReelEmbed videos={videos} />
}
```

