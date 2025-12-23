# @vortex/feed

> Virtualized video feed for VortexStream - TikTok-style infinite scroll

## Installation

```bash
npm install @vortex/feed @vortex/core @vortex/player @vortex/ui
# or
pnpm add @vortex/feed @vortex/core @vortex/player @vortex/ui
```

## Features

- 📜 **3-Node Carousel** - Only renders prev/current/next videos (minimal DOM)
- ♾️ **Infinite Scroll** - Automatic loading of more content
- 🎯 **Video Activation** - Smart play/pause based on viewport
- ⚡ **Preloading** - Preloads next videos for instant playback via @vortex/player-core
- 🔄 **Pull to Refresh** - Native-feeling refresh gesture
- 💾 **Memory Efficient** - Max 5 videos in DOM at once
- 🔌 **Two Modes** - Manual (pass videos) or API (automatic fetching)
- 🎨 **Design System** - Uses tokens from @vortex/core
- 🧩 **Composable** - VideoOverlay and ActionBar from @vortex/ui

## Breaking Changes in v0.0.1

### usePreloader Hook

`usePreloader` now re-exports `usePreload` from @vortex/player-core:

```tsx
// Before (v0.0.0)
const { preloadStates, preloadVideo } = usePreloader({ videos, currentIndex })

// After (v0.0.1)
import { usePreload, getPreloadPriorityForFeed } from '@vortex/feed'

const { preload, statuses, isPreloaded } = usePreload({ enabled: true })
const priority = getPreloadPriorityForFeed(index, currentIndex)
preload(video.url, priority, 'segment')
```

### ActionBar Integration

VideoFeedItem now uses ActionBar from @vortex/ui internally. No API changes, but custom styling may behave differently.

## Usage

### Manual Mode (Pass Videos Directly)

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
      onLike={() => console.log('Liked!')}
      onComment={() => console.log('Comment!')}
      onShare={() => console.log('Share!')}
    />
  )
}
```

### API Mode (Automatic Fetching)

Use `ConnectedVideoFeed` for automatic data fetching from your backend:

```tsx
import { VortexProvider } from '@vortex/core/api'
import { ConnectedVideoFeed } from '@vortex/feed'

function App() {
  return (
    <VortexProvider
      config={{
        baseUrl: 'https://api.yoursite.com/v1',
        auth: {
          accessToken: userToken,
          onTokenExpired: async () => {
            const newToken = await refreshToken()
            return { accessToken: newToken }
          },
        },
      }}
    >
      <ConnectedVideoFeed
        userId="user123"
        tag="funny"
        onLike={handleLike}
        onComment={handleComment}
        onShare={handleShare}
      />
    </VortexProvider>
  )
}
```

### Using Individual Components

VideoFeedItem now exports VideoOverlay separately for custom layouts:

```tsx
import { VideoFeedItem, VideoOverlay } from '@vortex/feed'
import { ActionBar } from '@vortex/ui'

function CustomVideoItem({ video }) {
  return (
    <div className="custom-container">
      <video src={video.url} />
      
      {/* Use VideoOverlay */}
      <VideoOverlay
        video={video}
        onAuthorClick={() => navigate(`/user/${video.author.id}`)}
        timelineExpanded={false}
      />
      
      {/* Or use ActionBar directly */}
      <ActionBar
        likeCount={video.stats.likes}
        commentCount={video.stats.comments}
        shareCount={video.stats.shares}
        isLiked={video.isLiked}
        onLike={() => likeVideo(video.id)}
        onComment={() => openComments(video.id)}
        onShare={() => shareVideo(video.id)}
      />
    </div>
  )
}
```

### Using useVideoFeed Hook

For custom implementations, use the `useVideoFeed` hook:

```tsx
import { useVideoFeed } from '@vortex/feed'
import { VideoFeed } from '@vortex/feed'

function CustomFeedPage() {
  const {
    videos,
    isLoading,
    hasMore,
    fetchNextPage,
    error,
    refetch,
  } = useVideoFeed({
    config: {
      baseUrl: 'https://api.yoursite.com',
      auth: { accessToken: token },
    },
    userId: 'user123',
    limit: 10,
    onSuccess: (videos) => console.log('Fetched', videos.length),
    onError: (error) => console.error('Error:', error),
  })

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorMessage error={error} onRetry={refetch} />

  return (
    <VideoFeed
      videos={videos}
      isLoading={isLoading}
      hasMore={hasMore}
      onLoadMore={fetchNextPage}
    />
  )
}
```

### With Actions

```tsx
<VideoFeed
  videos={videos}
  onLike={() => likeVideo()}
  onComment={() => openComments()}
  onShare={() => shareVideo()}
  onAuthorClick={() => viewProfile()}
/>
```

## Components

### VideoFeed

Main feed component with swipe gestures and virtualization.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `videos` | `Video[]` | `[]` | Array of video objects |
| `initialIndex` | `number` | `0` | Starting video index |
| `onVideoChange` | `(video, index) => void` | - | Called when active video changes |
| `onLoadMore` | `() => void \| Promise<void>` | - | Called when scrolling near end |
| `onLike` | `(video) => void` | - | Called when like button pressed |
| `onComment` | `(video) => void` | - | Called when comment button pressed |
| `onShare` | `(video) => void` | - | Called when share button pressed |
| `onAuthorClick` | `(video) => void` | - | Called when author clicked |
| `loadMoreThreshold` | `number` | `3` | Videos from end to trigger load |
| `transitionDuration` | `number` | `300` | Swipe animation duration (ms) |
| `swipeThreshold` | `number` | `50` | Swipe threshold (px) |
| `velocityThreshold` | `number` | `0.3` | Velocity threshold (px/ms) |
| `gesturesDisabled` | `boolean` | `false` | Disable swipe gestures |
| `hapticEnabled` | `boolean` | `true` | Enable haptic feedback |

### VideoFeedItem

Individual video item with built-in controls.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `video` | `Video` | **required** | Video object |
| `isActive` | `boolean` | `false` | Whether currently active |
| `priority` | `PreloadPriority` | `'none'` | Preload priority |
| `showTimeline` | `boolean` | `true` | Show timeline/seekbar |
| `onLike` | `() => void` | - | Like handler |
| `onComment` | `() => void` | - | Comment handler |
| `onShare` | `() => void` | - | Share handler |
| `onAuthorClick` | `() => void` | - | Author click handler |

### VideoOverlay

Info overlay component (author, caption, hashtags).

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `video` | `Video` | **required** | Video object |
| `onAuthorClick` | `() => void` | - | Author click handler |
| `timelineExpanded` | `boolean` | `false` | Adjust padding for timeline |

### ConnectedVideoFeed (API Mode)

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `config` | `VortexConfig` | - | API configuration (optional if using VortexProvider) |
| `userId` | `string` | - | User ID for user-specific feed |
| `tag` | `string` | - | Tag/hashtag filter |
| `searchQuery` | `string` | - | Search query |
| `pageSize` | `number` | `10` | Videos per page |
| `initialVideos` | `Video[]` | - | Initial videos while loading |
| `onFetchSuccess` | `(videos) => void` | - | Success callback |
| `onFetchError` | `(error) => void` | - | Error callback |
| `renderLoading` | `() => ReactNode` | - | Custom loading UI |
| `renderError` | `(error, retry) => ReactNode` | - | Custom error UI |
| `renderEmpty` | `() => ReactNode` | - | Custom empty UI |

> **Note:** `PullToRefresh` component đã được chuyển sang `@vortex/ui` package. Import từ `@vortex/ui` thay vì `@vortex/feed`.

## Hooks

### useVideoFeed

Fetch videos with infinite scroll support.

```tsx
const {
  videos,           // Flattened videos array
  isLoading,        // Initial loading state
  isFetchingMore,   // Loading more state
  hasMore,          // Has more to load
  fetchNextPage,    // Load next page
  refetch,          // Refetch all
  error,            // Error if any
  isApiMode,        // Whether API mode active
  totalCount,       // Total count (if provided by API)
} = useVideoFeed({
  config,           // VortexConfig (required for API mode)
  userId,           // User ID filter
  tag,              // Tag filter
  searchQuery,      // Search query
  limit,            // Page size
  enabled,          // Enable/disable
  initialVideos,    // Initial data
  staleTime,        // Cache time
  onSuccess,        // Success callback
  onError,          // Error callback
})
```

### useVideoActivation

Control video activation based on visibility.

```tsx
const {
  isActive,         // Whether video is active
  isVisible,        // Whether video is visible
  visibilityRatio,  // Visibility ratio (0-1)
  activate,         // Manual activate
  deactivate,       // Manual deactivate
} = useVideoActivation({
  containerRef,     // Container element ref
  videoRef,         // Video element ref
  isCurrentVideo,   // Whether current in feed
  onActivate,       // Activate callback
  onDeactivate,     // Deactivate callback
  autoActivate,     // Enable auto-activation
})
```

### usePreload (from @vortex/player-core)

Preload videos with priority queue.

```tsx
import { usePreload, getPreloadPriorityForFeed } from '@vortex/feed'

const {
  preload,          // Enqueue preload
  preloadMany,      // Enqueue multiple
  cancel,           // Cancel preload
  cancelAll,        // Cancel all
  setPaused,        // Pause/resume
  handleScrollVelocity, // Handle scroll
  isPreloaded,      // Check if preloaded
  getStatus,        // Get status
  preloadedUrls,    // Preloaded URLs
  statuses,         // All statuses
  isPaused,         // Paused state
  manager,          // PreloadManager instance
} = usePreload({
  enabled: true,
  maxConcurrent: 2,
  maxPreloaded: 5,
})

// Get priority for feed
const priority = getPreloadPriorityForFeed(index, currentIndex)
preload(video.url, priority, 'segment')
```

### Helper Functions

```tsx
import {
  getPreloadPriorityForFeed,  // Get numeric priority
  mapPriorityToNumeric,        // Map enum to number
  getPreloadPriority,          // Get PreloadPriority enum
  preloadThumbnail,            // Preload thumbnail
} from '@vortex/feed'

// Get priority based on distance from current
const priority = getPreloadPriorityForFeed(videoIndex, currentIndex)
// Returns: 1 (current), 3 (adjacent), 5 (near), 7 (far), 10 (dispose)

// Map priority enum to number
const numPriority = mapPriorityToNumeric('high') // 1

// Get enum priority
const enumPriority = getPreloadPriority(videoIndex, currentIndex)
// Returns: 'high' | 'medium' | 'low' | 'metadata' | 'none'

// Preload thumbnail
preloadThumbnail('https://example.com/thumbnail.jpg')
```

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

## Performance Tips

1. **Use video.id as key** - Ensures proper virtualization
2. **Preload thumbnails** - Use blur placeholders
3. **Let the system handle preloading** - usePreload manages queue automatically
4. **Dispose properly** - Memory manager handles cleanup
5. **Use design tokens** - All components use @vortex/core tokens

## Design System Integration

All components use design tokens from @vortex/core:

```tsx
import { 
  colors,      // colors.background, colors.accent, etc.
  spacing,     // spacing[1] - spacing[8]
  fontSizes,   // fontSizes.xs, sm, md, lg
  fontWeights, // fontWeights.medium, semibold, bold
  radii,       // radii.sm, md, lg, full
  zIndices,    // zIndices.base, sticky, overlay
  durations,   // durations.fast, normal, slow
  easings,     // easings.vortex (cubic-bezier)
} from '@vortex/core'
```

This ensures consistent styling across all packages.

## Migration Guide

### From v0.0.0 to v0.0.1

#### 1. Update usePreloader

```tsx
// Before
import { usePreloader } from '@vortex/feed'
const { preloadStates } = usePreloader({ videos, currentIndex })

// After  
import { usePreload, getPreloadPriorityForFeed } from '@vortex/feed'
const { statuses } = usePreload()
const priority = getPreloadPriorityForFeed(index, currentIndex)
```

#### 2. ActionBar Styling

If you were overriding ActionBar styles, they may not work anymore since VideoFeedItem now uses @vortex/ui ActionBar component. Use ActionBar directly for custom styling:

```tsx
import { ActionBar } from '@vortex/ui'

<ActionBar
  likeCount={video.stats.likes}
  // ... props with custom styling
  style={{ right: 24 }}
/>
```

#### 3. VideoOverlay

If you were accessing internal overlay elements, use the new VideoOverlay component:

```tsx
import { VideoOverlay } from '@vortex/feed'

<VideoOverlay
  video={video}
  onAuthorClick={handleAuthorClick}
  timelineExpanded={timelineExpanded}
/>
```

## License

MIT
