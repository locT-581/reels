---
description: "Feed virtualization and scroll behavior - performance optimization for infinite video lists"
globs: ["**/feed/**", "**/components/*Feed*", "**/hooks/useFeed*", "**/hooks/useVirtual*"]
alwaysApply: false
---

# Feed & Virtualization Rules

## Library

Dùng `@tanstack/react-virtual` (~3KB) cho virtualization.

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'
```

## Feed Component Structure

```typescript
export function VideoFeed({ videos }: { videos: Video[] }) {
  const parentRef = useRef<HTMLDivElement>(null)

  const virtualizer = useVirtualizer({
    count: videos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => window.innerHeight,
    overscan: 2, // Render 2 video trên/dưới viewport
  })

  return (
    <div
      ref={parentRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory overscroll-contain"
    >
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((item) => (
          <VideoItem
            key={item.key}
            video={videos[item.index]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `translateY(${item.start}px)`,
              height: '100vh',
              width: '100%',
            }}
          />
        ))}
      </div>
    </div>
  )
}
```

## Scroll Snap CSS

```css
/* Container */
.feed-container {
  scroll-snap-type: y mandatory;
  scroll-behavior: smooth;
  overscroll-behavior: contain;
  -webkit-overflow-scrolling: touch;
}

/* Items */
.feed-item {
  scroll-snap-align: center;
  scroll-snap-stop: always;
}
```

```typescript
// Tailwind classes
const feedContainer = 'snap-y snap-mandatory overscroll-contain'
const feedItem = 'snap-center snap-always'
```

## Video Activation Rules

```typescript
// Sử dụng IntersectionObserver
const useVideoVisibility = (videoRef: RefObject<HTMLElement>) => {
  const [isVisible, setIsVisible] = useState(false)
  const [visibilityRatio, setVisibilityRatio] = useState(0)

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setVisibilityRatio(entry.intersectionRatio)
        
        // Activate khi > 50% visible
        if (entry.intersectionRatio > 0.5) {
          setIsVisible(true)
        }
        // Deactivate khi < 30% visible
        else if (entry.intersectionRatio < 0.3) {
          setIsVisible(false)
        }
      },
      { threshold: [0, 0.3, 0.5, 0.7, 1] }
    )

    if (videoRef.current) {
      observer.observe(videoRef.current)
    }

    return () => observer.disconnect()
  }, [])

  return { isVisible, visibilityRatio }
}
```

## Scroll Velocity Detection

```typescript
// Không activate video khi scroll nhanh
const VELOCITY_THRESHOLD = 2000 // px/s

const useScrollVelocity = () => {
  const [velocity, setVelocity] = useState(0)
  const lastScrollY = useRef(0)
  const lastTime = useRef(Date.now())

  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now()
      const deltaY = Math.abs(window.scrollY - lastScrollY.current)
      const deltaTime = now - lastTime.current

      if (deltaTime > 0) {
        setVelocity((deltaY / deltaTime) * 1000)
      }

      lastScrollY.current = window.scrollY
      lastTime.current = now
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  return velocity
}

// Usage
const shouldActivateVideo = isVisible && scrollVelocity < VELOCITY_THRESHOLD
```

## Pre-loading Strategy

```typescript
const PRE_LOAD_CONFIG = {
  // Video hiện tại
  current: { segments: 'all', priority: 'highest' },
  // Video trước
  'current-1': { segments: 'none', priority: 'high', keepInMemory: true },
  // Video tiếp theo
  'current+1': { segments: 3, priority: 'high' },
  // Video +2
  'current+2': { segments: 1, priority: 'medium' },
  // Video +3
  'current+3': { segments: 0, priority: 'low', metadataOnly: true },
} as const

// Implementation
const usePreloader = (currentIndex: number, videos: Video[]) => {
  useEffect(() => {
    // Preload next 3 videos
    for (let i = 1; i <= 3; i++) {
      const video = videos[currentIndex + i]
      if (video) {
        preloadVideo(video, PRE_LOAD_CONFIG[`current+${i}`])
      }
    }
  }, [currentIndex, videos])
}
```

## Memory Management

```typescript
const MEMORY_CONFIG = {
  maxVideosInDOM: 5,
  maxDecodedFrames: 3,
  maxTotalMemory: 150 * 1024 * 1024, // 150MB
}

const useMemoryManager = (currentIndex: number) => {
  useEffect(() => {
    // Dispose videos xa viewport
    const disposeThreshold = 4
    
    videos.forEach((video, index) => {
      const distance = Math.abs(index - currentIndex)
      if (distance > disposeThreshold) {
        disposeVideo(video.id)
      }
    })

    // Check total memory
    if (performance.memory?.usedJSHeapSize > MEMORY_CONFIG.maxTotalMemory) {
      aggressiveCleanup()
    }
  }, [currentIndex])
}
```

## Pull-to-Refresh

```typescript
const usePullToRefresh = (onRefresh: () => Promise<void>) => {
  const [isPulling, setIsPulling] = useState(false)
  const [pullDistance, setPullDistance] = useState(0)
  const TRIGGER_THRESHOLD = 80

  const bind = useGesture({
    onDrag: ({ movement: [, my], direction: [, dy], cancel }) => {
      // Chỉ khi ở đầu feed
      if (window.scrollY > 0) return

      if (dy > 0 && my > 0) {
        setPullDistance(Math.min(my, 120))
        setIsPulling(true)
      }

      if (my > TRIGGER_THRESHOLD) {
        cancel()
        triggerRefresh()
      }
    },
    onDragEnd: () => {
      setPullDistance(0)
      setIsPulling(false)
    }
  })

  const triggerRefresh = async () => {
    await onRefresh()
    setPullDistance(0)
  }

  return { bind, isPulling, pullDistance }
}
```

## Infinite Scroll / Pagination

```typescript
const useFeedPagination = (
  fetchMore: () => Promise<Video[]>,
  threshold = 3
) => {
  const [isLoading, setIsLoading] = useState(false)

  // Load more khi còn n videos
  const checkAndLoadMore = useCallback(
    async (currentIndex: number, totalVideos: number) => {
      const remaining = totalVideos - currentIndex
      
      if (remaining <= threshold && !isLoading) {
        setIsLoading(true)
        await fetchMore()
        setIsLoading(false)
      }
    },
    [fetchMore, isLoading, threshold]
  )

  return { checkAndLoadMore, isLoading }
}
```

## Scroll Restoration

```typescript
// Lưu vị trí scroll khi navigate away
const useScrollRestoration = (feedId: string) => {
  useEffect(() => {
    // Restore on mount
    const savedIndex = sessionStorage.getItem(`feed-${feedId}-index`)
    if (savedIndex) {
      scrollToIndex(parseInt(savedIndex))
    }

    // Save on unmount
    return () => {
      sessionStorage.setItem(`feed-${feedId}-index`, currentIndex.toString())
    }
  }, [feedId])
}
```

## Performance Targets

| Metric | Target |
|--------|--------|
| Scroll FPS | 60fps |
| Videos in DOM | Max 5 |
| Memory usage | < 150MB |
| Load more latency | < 500ms |

