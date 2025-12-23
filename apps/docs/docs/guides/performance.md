---
sidebar_position: 6
---

# Performance

Hướng dẫn tối ưu hiệu suất VortexStream.

## Performance Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** | < 1.5s | Largest Contentful Paint |
| **FID** | < 50ms | First Input Delay |
| **CLS** | < 0.05 | Cumulative Layout Shift |
| **INP** | < 150ms | Interaction to Next Paint |
| **TTI** | < 2s | Time to Interactive |
| **TTFF** | < 500ms | Time to First Frame |

## Bundle Size Budget

| Package | Target |
|---------|--------|
| `@vortex/core` | < 5KB |
| `@vortex/player` | < 70KB |
| `@vortex/ui` | < 15KB |
| `@vortex/gestures` | < 15KB |
| `@vortex/feed` | < 8KB |
| `@vortex/embed` | < 100KB |
| **Total** | < 150KB |

## Video Optimization

### HLS Configuration

```tsx
const optimizedHLSConfig = {
  // Buffer nhỏ để tiết kiệm memory
  maxBufferLength: 20,
  maxMaxBufferLength: 40,
  maxBufferSize: 20 * 1000 * 1000,  // 20MB
  
  // ABR aggressive cho mobile
  abrEwmaDefaultEstimate: 500000,   // Start 500kbps
  abrBandWidthUpFactor: 0.7,
  abrBandWidthFactor: 0.9,
  
  // Fast startup
  startLevel: -1,  // Auto
  startFragPrefetch: true,
  
  // Retry config
  fragLoadingMaxRetry: 2,
  manifestLoadingMaxRetry: 2,
}
```

### Preloading Strategy

```tsx
import { usePreload } from '@vortex/feed'

function OptimizedFeed({ videos, currentIndex }) {
  // Preload 2 videos ahead
  usePreload(videos, currentIndex, {
    ahead: 2,
    segmentsPerVideo: 3,  // Only 3 segments
    quality: 'lowest',     // Preload lowest quality
  })
  
  return <VideoFeed videos={videos} />
}
```

### Memory Management

```tsx
import { useEffect } from 'react'
import { cleanupMemory, getMemoryUsage } from '@vortex/core'

function MemoryOptimizedFeed() {
  // Monitor memory
  useEffect(() => {
    const interval = setInterval(async () => {
      const usage = await getMemoryUsage()
      
      if (usage.percent > 80) {
        // Aggressive cleanup
        cleanupMemory({ keepCurrent: true, keepNext: 1 })
      }
    }, 10000)
    
    return () => clearInterval(interval)
  }, [])
}
```

## Virtualization

### Feed Virtualization

```tsx
import { VideoFeed } from '@vortex/feed'

<VideoFeed
  videos={videos}
  overscan={1}              // Chỉ render 1 video ngoài viewport
  maxVideosInDOM={5}        // Max 5 video trong DOM
  recycleEnabled={true}     // Reuse video elements
/>
```

### Comment Virtualization

```tsx
import { useVirtualizer } from '@tanstack/react-virtual'

function VirtualizedComments({ comments, containerRef }) {
  const virtualizer = useVirtualizer({
    count: comments.length,
    getScrollElement: () => containerRef.current,
    estimateSize: () => 80,  // Estimated comment height
    overscan: 3,
  })

  return (
    <div style={{ height: virtualizer.getTotalSize() }}>
      {virtualizer.getVirtualItems().map((item) => (
        <Comment
          key={comments[item.index].id}
          comment={comments[item.index]}
          style={{
            position: 'absolute',
            top: item.start,
            height: item.size,
          }}
        />
      ))}
    </div>
  )
}
```

## Lazy Loading

### Dynamic imports

```tsx
import dynamic from 'next/dynamic'

// Lazy load heavy components
const CommentSheet = dynamic(
  () => import('@vortex/ui').then((m) => m.CommentSheet),
  { ssr: false }
)

const ShareSheet = dynamic(
  () => import('@vortex/ui').then((m) => m.ShareSheet),
  { ssr: false }
)

// Lazy load VortexEmbed
const VortexEmbed = dynamic(
  () => import('@vortex/embed').then((m) => m.VortexEmbed),
  {
    ssr: false,
    loading: () => <FeedSkeleton />,
  }
)
```

### Code splitting

```tsx
// Split gestures
const { useVideoGestures } = await import('@vortex/gestures')

// Split UI components
const { LikeButton, CommentButton } = await import('@vortex/ui')
```

## Image Optimization

### Blur placeholder

```tsx
import { BlurPlaceholder } from '@vortex/ui'

<BlurPlaceholder
  src={thumbnail}
  blurDataUrl={blurHash}  // Base64 blur
  alt="Thumbnail"
/>
```

### Responsive images

```tsx
// next/image
import Image from 'next/image'

<Image
  src={thumbnail}
  alt="Thumbnail"
  fill
  sizes="(max-width: 768px) 100vw, 375px"
  priority={index < 2}  // Priority load first 2
/>
```

## Animation Optimization

### GPU acceleration

```tsx
// ✅ Good - triggers GPU
<motion.div
  animate={{ transform: 'translateX(100px)' }}
/>

// ❌ Bad - triggers layout
<motion.div
  animate={{ left: '100px' }}
/>
```

### Reduce motion

```tsx
import { useReducedMotion } from 'motion/react'

function AnimatedComponent() {
  const shouldReduceMotion = useReducedMotion()

  return (
    <motion.div
      animate={shouldReduceMotion ? {} : { scale: 1.2 }}
    />
  )
}
```

### Animation budget

```tsx
// Limit concurrent animations
const [canAnimate, setCanAnimate] = useState(true)

const handleLike = () => {
  if (!canAnimate) return
  
  setCanAnimate(false)
  playAnimation()
  
  setTimeout(() => setCanAnimate(true), 500)
}
```

## Event Optimization

### Passive listeners

```tsx
const bind = useVideoGestures({
  onTap: handleTap,
}, {
  eventOptions: { passive: true }
})
```

### Throttle/Debounce

```tsx
import { useThrottle, useDebounce } from '@vortex/core'

// Throttle scroll handler
const throttledScroll = useThrottle(handleScroll, 100)

// Debounce search
const debouncedSearch = useDebounce(searchQuery, 300)
```

### Event delegation

```tsx
// ✅ Good - single handler
function Feed({ videos }) {
  const handleAction = (e) => {
    const action = e.target.closest('[data-action]')?.dataset.action
    const videoId = e.target.closest('[data-video-id]')?.dataset.videoId
    
    if (action === 'like') likeVideo(videoId)
    if (action === 'comment') openComments(videoId)
  }

  return (
    <div onClick={handleAction}>
      {videos.map(video => <VideoItem key={video.id} video={video} />)}
    </div>
  )
}

// ❌ Bad - handler per video
function Feed({ videos }) {
  return videos.map(video => (
    <VideoItem
      key={video.id}
      onLike={() => likeVideo(video.id)}
      onComment={() => openComments(video.id)}
    />
  ))
}
```

## Network Optimization

### Request batching

```tsx
import { batchRequests } from '@vortex/core'

// Batch multiple like requests
const batchedLike = batchRequests(likeVideo, {
  maxBatchSize: 10,
  maxWaitTime: 500,  // ms
})
```

### Prefetching

```tsx
// Prefetch API data
const prefetchNextVideos = () => {
  if (currentIndex > videos.length - 5) {
    queryClient.prefetchQuery({
      queryKey: ['videos', nextCursor],
      queryFn: () => fetchVideos(nextCursor),
    })
  }
}
```

## Monitoring

### Performance tracking

```tsx
import { onLCP, onFID, onCLS, onINP, onTTFB } from 'web-vitals'

function reportWebVitals(metric) {
  // Send to analytics
  analytics.track('web_vital', {
    name: metric.name,
    value: metric.value,
    rating: metric.rating,
  })
}

onLCP(reportWebVitals)
onFID(reportWebVitals)
onCLS(reportWebVitals)
onINP(reportWebVitals)
onTTFB(reportWebVitals)
```

### Video metrics

```tsx
import { trackVideoMetrics } from '@vortex/core'

function TrackedVideoPlayer({ video }) {
  const metrics = trackVideoMetrics(video.id)

  return (
    <VideoPlayer
      video={video}
      onFirstFrame={() => metrics.trackTimeToFirstFrame()}
      onBuffering={(duration) => metrics.trackBuffering(duration)}
      onQualityChange={(from, to) => metrics.trackQualitySwitch(from, to)}
      onError={(error) => metrics.trackError(error)}
    />
  )
}
```

## Checklist

### Before Production

- [ ] Bundle size < 150KB gzip
- [ ] LCP < 1.5s on 4G
- [ ] TTI < 2s
- [ ] Video plays within 500ms
- [ ] 60fps scrolling
- [ ] No memory leak after 50+ videos
- [ ] Test on Safari iOS 15+
- [ ] Test on Chrome Android 90+
- [ ] Lighthouse Performance > 90

