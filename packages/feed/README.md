# @vortex/feed

> Virtualized video feed for VortexStream - TikTok-style infinite scroll

## Installation

```bash
npm install @vortex/feed @vortex/core @vortex/player @tanstack/react-virtual
# or
pnpm add @vortex/feed @vortex/core @vortex/player @tanstack/react-virtual
```

## Features

- 📜 **Virtualization** - Only renders visible videos + buffer
- ♾️ **Infinite Scroll** - Automatic loading of more content
- 🎯 **Video Activation** - Smart play/pause based on viewport
- ⚡ **Preloading** - Preloads next videos for instant playback
- 🔄 **Pull to Refresh** - Native-feeling refresh gesture
- 💾 **Memory Efficient** - Max 5 videos in DOM at once

## Usage

### Basic Feed

```tsx
import { VideoFeed } from '@vortex/feed'
import type { Video } from '@vortex/core'

function App() {
  const videos: Video[] = [...]

  return (
    <VideoFeed
      videos={videos}
      onVideoChange={(video, index) => {
        console.log('Now playing:', video.id)
      }}
    />
  )
}
```

### With Infinite Loading

```tsx
import { VideoFeed } from '@vortex/feed'
import { useInfiniteQuery } from '@tanstack/react-query'

function FeedPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
  } = useInfiniteQuery({
    queryKey: ['feed'],
    queryFn: fetchVideos,
    getNextPageParam: (lastPage) => lastPage.nextCursor,
  })

  const videos = data?.pages.flatMap(page => page.videos) ?? []

  return (
    <VideoFeed
      videos={videos}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }}
      endReachedThreshold={3}
    />
  )
}
```

### With Custom Video Item

```tsx
import { VideoFeed, VideoFeedItem } from '@vortex/feed'

<VideoFeed videos={videos}>
  {(video, index, isActive) => (
    <VideoFeedItem
      video={video}
      isActive={isActive}
      showOverlay
      renderOverlay={() => (
        <CustomOverlay video={video} />
      )}
    />
  )}
</VideoFeed>
```

### With Actions

```tsx
<VideoFeed
  videos={videos}
  onLike={(videoId) => likeVideo(videoId)}
  onComment={(videoId) => openComments(videoId)}
  onShare={(videoId) => shareVideo(videoId)}
  onSave={(videoId) => saveVideo(videoId)}
/>
```

## Props

### VideoFeed

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `videos` | `Video[]` | `[]` | Array of video objects |
| `initialIndex` | `number` | `0` | Starting video index |
| `onVideoChange` | `(video, index) => void` | - | Called when active video changes |
| `onEndReached` | `() => void` | - | Called when scrolling near end |
| `endReachedThreshold` | `number` | `3` | Videos from end to trigger |
| `onRefresh` | `() => Promise<void>` | - | Pull-to-refresh handler |
| `preloadCount` | `number` | `2` | Videos to preload ahead |
| `className` | `string` | - | Container class |

### VideoFeedItem

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `video` | `Video` | - | Video object |
| `isActive` | `boolean` | `false` | Whether currently active |
| `showOverlay` | `boolean` | `true` | Show info overlay |
| `showActions` | `boolean` | `true` | Show action buttons |
| `renderOverlay` | `() => ReactNode` | - | Custom overlay |

## Video Activation Rules

Videos are activated based on viewport visibility:

| Condition | Action |
|-----------|--------|
| > 50% visible | Play |
| < 30% visible | Pause + Reset |
| Scroll velocity > 2000px/s | Skip activation |
| Scroll stopped > 300ms | Activate nearest |

## Memory Management

The feed automatically manages memory:

- **Max 5 videos** in DOM at once
- **Max 3 decoded** video frames
- **Aggressive cleanup** on scroll
- **< 150MB** total memory usage

## Hooks

### useFeed

Access feed state:

```tsx
import { useFeed } from '@vortex/feed'

const {
  videos,
  currentIndex,
  currentVideo,
  goToNext,
  goToPrevious,
  goToIndex,
} = useFeed()
```

### useVideoActivation

Control video activation:

```tsx
import { useVideoActivation } from '@vortex/feed'

const { isActive, activate, deactivate } = useVideoActivation(videoId)
```

## Performance Tips

1. **Use video.id as key** - Ensures proper virtualization
2. **Preload thumbnails** - Use blur placeholders
3. **Lazy load HLS** - Only load manifest when active
4. **Dispose properly** - Call cleanup on unmount

## License

MIT

