---
sidebar_position: 3
---

# @xhub-reel/feed

Virtualized video feed - TikTok-style infinite scroll.

## Cài đặt

```bash npm2yarn
npm install @xhub-reel/feed @xhub-reel/core @xhub-reel/player @tanstack/react-virtual
```

## Tổng quan

`@xhub-reel/feed` cung cấp:

- 📜 **Virtualization** - Chỉ render video visible + buffer
- ♾️ **Infinite Scroll** - Tự động load thêm content
- 🎯 **Video Activation** - Smart play/pause dựa trên viewport
- ⚡ **Preloading** - Preload video tiếp theo
- 🔄 **Pull to Refresh** - Native-feeling refresh
- 💾 **Memory Efficient** - Max 5 video trong DOM

## Basic Usage

```tsx
import { VideoFeed } from '@xhub-reel/feed'
import type { Video } from '@xhub-reel/core'

function App() {
  const videos: Video[] = [/* ... */]

  return (
    <div className="h-screen w-screen bg-black">
      <VideoFeed
        videos={videos}
        onVideoChange={(video, index) => {
          console.log('Now playing:', video.id, 'at index', index)
        }}
      />
    </div>
  )
}
```

## Props

### VideoFeed

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `videos` | `Video[]` | `[]` | Danh sách video |
| `initialIndex` | `number` | `0` | Index bắt đầu |
| `onVideoChange` | `(video, index) => void` | - | Callback khi video thay đổi |
| `onEndReached` | `() => void` | - | Callback khi scroll gần cuối |
| `endReachedThreshold` | `number` | `3` | Số video còn lại để trigger |
| `onRefresh` | `() => Promise<void>` | - | Pull-to-refresh handler |
| `preloadCount` | `number` | `2` | Số video preload trước |
| `className` | `string` | - | Container class |

### Event Callbacks

```tsx
<VideoFeed
  videos={videos}
  
  // Khi active video thay đổi
  onVideoChange={(video, index) => {
    analytics.trackVideoView(video.id)
  }}
  
  // Khi scroll gần cuối
  onEndReached={() => {
    loadMoreVideos()
  }}
  
  // Pull to refresh
  onRefresh={async () => {
    await refreshFeed()
  }}
  
  // Khi user like video
  onLike={(videoId) => {
    likeVideo(videoId)
  }}
  
  // Khi user comment
  onComment={(videoId) => {
    openCommentSheet(videoId)
  }}
  
  // Khi user share
  onShare={(videoId) => {
    openShareSheet(videoId)
  }}
/>
```

## Infinite Scroll

### Với TanStack Query

```tsx
import { VideoFeed } from '@xhub-reel/feed'
import { useInfiniteQuery } from '@tanstack/react-query'

function FeedPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    refetch,
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`/api/videos?cursor=${pageParam}`)
      return response.json()
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  })

  const videos = data?.pages.flatMap(page => page.videos) ?? []

  if (isLoading) {
    return <FeedSkeleton />
  }

  return (
    <VideoFeed
      videos={videos}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }}
      endReachedThreshold={3}
      onRefresh={async () => {
        await refetch()
      }}
    />
  )
}
```

### Manual pagination

```tsx
import { VideoFeed } from '@xhub-reel/feed'
import { useState, useCallback } from 'react'

function FeedPage() {
  const [videos, setVideos] = useState<Video[]>([])
  const [cursor, setCursor] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  const loadMore = useCallback(async () => {
    if (isLoading) return
    
    setIsLoading(true)
    const { videos: newVideos, nextCursor } = await fetchVideos(cursor)
    setVideos(prev => [...prev, ...newVideos])
    setCursor(nextCursor)
    setIsLoading(false)
  }, [cursor, isLoading])

  return (
    <VideoFeed
      videos={videos}
      onEndReached={loadMore}
    />
  )
}
```

## Custom Video Item

```tsx
import { VideoFeed, VideoFeedItem } from '@xhub-reel/feed'

<VideoFeed videos={videos}>
  {(video, index, isActive) => (
    <VideoFeedItem
      video={video}
      isActive={isActive}
      showOverlay
      showActions
      
      // Custom overlay
      renderOverlay={() => (
        <div className="absolute bottom-20 left-4">
          <CustomVideoInfo video={video} />
        </div>
      )}
      
      // Custom actions
      renderActions={() => (
        <div className="absolute right-4 bottom-20">
          <CustomActions video={video} />
        </div>
      )}
    />
  )}
</VideoFeed>
```

### VideoFeedItem Props

| Prop | Type | Default | Mô tả |
|------|------|---------|-------|
| `video` | `Video` | - | Video object |
| `isActive` | `boolean` | `false` | Đang active |
| `showOverlay` | `boolean` | `true` | Hiển thị info overlay |
| `showActions` | `boolean` | `true` | Hiển thị action buttons |
| `renderOverlay` | `() => ReactNode` | - | Custom overlay |
| `renderActions` | `() => ReactNode` | - | Custom actions |

## Video Activation Rules

Videos được activate dựa trên viewport visibility:

| Điều kiện | Action |
|-----------|--------|
| > 50% visible | Play |
| < 30% visible | Pause + Reset |
| Scroll velocity > 2000px/s | Skip activation |
| Scroll dừng > 300ms | Activate nearest |

```tsx
// Custom activation rules
<VideoFeed
  videos={videos}
  activationConfig={{
    playThreshold: 0.5,      // 50% visible để play
    pauseThreshold: 0.3,     // 30% visible để pause
    velocityThreshold: 2000, // px/s
    settleDelay: 300,        // ms
  }}
/>
```

## Memory Management

Feed tự động quản lý memory:

- **Max 5 videos** trong DOM cùng lúc
- **Max 3 decoded** video frames
- **< 150MB** total memory
- **Aggressive cleanup** khi scroll

```tsx
// Custom memory config
<VideoFeed
  videos={videos}
  memoryConfig={{
    maxVideosInDOM: 5,
    maxDecodedFrames: 3,
    maxMemoryMB: 150,
    cleanupOnLowMemory: true,
  }}
/>
```

## Hooks

### useFeed

Access feed state:

```tsx
import { useFeed } from '@xhub-reel/feed'

function FeedControls() {
  const {
    videos,
    currentIndex,
    currentVideo,
    goToNext,
    goToPrevious,
    goToIndex,
    isFirstVideo,
    isLastVideo,
  } = useFeed()

  return (
    <div className="controls">
      <button 
        onClick={goToPrevious} 
        disabled={isFirstVideo}
      >
        Previous
      </button>
      <span>{currentIndex + 1} / {videos.length}</span>
      <button 
        onClick={goToNext}
        disabled={isLastVideo}
      >
        Next
      </button>
    </div>
  )
}
```

### useVideoActivation

Control video activation:

```tsx
import { useVideoActivation } from '@xhub-reel/feed'

function VideoItem({ video }) {
  const {
    isActive,
    activate,
    deactivate,
    visibilityPercentage,
  } = useVideoActivation(video.id)

  return (
    <div className={isActive ? 'active' : ''}>
      <VideoPlayer
        video={video}
        autoPlay={isActive}
      />
      <span>Visibility: {visibilityPercentage}%</span>
    </div>
  )
}
```

### useVideoVisibility

Track video visibility:

```tsx
import { useVideoVisibility } from '@xhub-reel/feed'
import { useRef } from 'react'

function VideoItem({ video }) {
  const ref = useRef<HTMLDivElement>(null)
  
  const { isVisible, percentage } = useVideoVisibility(ref, {
    threshold: 0.5,
    rootMargin: '0px',
  })

  return (
    <div ref={ref}>
      {isVisible && <VideoPlayer video={video} autoPlay />}
    </div>
  )
}
```

### usePreload

Preload upcoming videos:

```tsx
import { usePreload } from '@xhub-reel/feed'

function Feed({ videos, currentIndex }) {
  // Preload next 2 videos
  usePreload(videos, currentIndex, { count: 2 })
  
  return <VideoFeed videos={videos} />
}
```

## Preloading Strategy

| Position | Action | Priority |
|----------|--------|----------|
| Current - 1 | Giữ trong memory, pause | High |
| Current | Playing | Highest |
| Current + 1 | Preload 3 segments đầu | High |
| Current + 2 | Preload 1 segment | Medium |
| Current + 3 | Chỉ fetch metadata | Low |
| Current ± 4+ | Dispose | - |

```tsx
// Custom preload strategy
<VideoFeed
  videos={videos}
  preloadConfig={{
    ahead: 2,          // Preload 2 video phía trước
    behind: 1,         // Giữ 1 video phía sau
    segmentsAhead: 3,  // Số segments preload
  }}
/>
```

## Pull to Refresh

```tsx
<VideoFeed
  videos={videos}
  onRefresh={async () => {
    // Fetch new content
    const newVideos = await fetchLatestVideos()
    setVideos(newVideos)
  }}
  refreshConfig={{
    pullThreshold: 80,    // px kéo để trigger
    resistance: 2.5,      // Độ nặng khi kéo
    showIndicator: true,  // Hiển thị refresh indicator
  }}
/>
```

## Scroll Behavior

```tsx
<VideoFeed
  videos={videos}
  scrollConfig={{
    snapType: 'mandatory',     // 'mandatory' | 'proximity'
    snapAlign: 'center',       // 'start' | 'center' | 'end'
    behavior: 'smooth',        // 'smooth' | 'instant'
    decelerationRate: 0.998,
  }}
/>
```

## Loading States

```tsx
<VideoFeed
  videos={videos}
  isLoading={isLoading}
  
  // Custom loading component
  renderLoading={() => (
    <div className="h-screen flex items-center justify-center">
      <Spinner />
    </div>
  )}
  
  // Custom empty state
  renderEmpty={() => (
    <div className="h-screen flex items-center justify-center">
      <p>Không có video nào</p>
    </div>
  )}
  
  // Loading more indicator
  renderLoadingMore={() => (
    <div className="p-4">
      <Spinner size="sm" />
    </div>
  )}
/>
```

## Performance Tips

### 1. Use stable keys

```tsx
// ✅ Good - stable video.id
<VideoFeed videos={videos} keyExtractor={(video) => video.id} />

// ❌ Bad - unstable index
<VideoFeed videos={videos} keyExtractor={(_, index) => index} />
```

### 2. Memoize callbacks

```tsx
const handleVideoChange = useCallback((video, index) => {
  console.log(video.id)
}, [])

const handleEndReached = useCallback(() => {
  loadMore()
}, [loadMore])

<VideoFeed
  videos={videos}
  onVideoChange={handleVideoChange}
  onEndReached={handleEndReached}
/>
```

### 3. Virtualization overscan

```tsx
<VideoFeed
  videos={videos}
  overscan={2}  // Render 2 video ngoài viewport
/>
```

## API Reference

Xem [Components API](/docs/api/components#videofeed) để biết đầy đủ props.

