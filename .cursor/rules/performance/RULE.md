---
description: "Performance optimization rules - bundle size, Core Web Vitals, and mobile performance"
globs: 
alwaysApply: true
---

# Performance Rules

## Bundle Size Budget

| Package | Target (gzip) | Hard Limit |
|---------|---------------|------------|
| `@vortex/core` | < 5KB | 7KB |
| `@vortex/player` | < 70KB | 80KB |
| `@vortex/ui` | < 15KB | 20KB |
| `@vortex/gestures` | < 15KB | 18KB |
| `@vortex/feed` | < 8KB | 10KB |
| `@vortex/embed` | < 100KB | 120KB |
| **Total App** | < 150KB | 200KB |

## Core Web Vitals Targets

| Metric | Target | Measurement |
|--------|--------|-------------|
| **LCP** | < 1.5s | First video frame |
| **FID** | < 50ms | First interaction |
| **CLS** | < 0.05 | Layout stability |
| **INP** | < 150ms | Interaction latency |
| **TTI** | < 2s | Time to Interactive |

## Video Performance Targets

| Metric | Target |
|--------|--------|
| Time to First Frame | < 500ms |
| Buffering Ratio | < 1% |
| Startup Failures | < 0.5% |
| Seek Latency | < 200ms |
| Scroll FPS | 60fps |

## Code Splitting Rules

### Dynamic Imports

```typescript
// Lazy load non-critical components
const CommentSheet = dynamic(() => import('./CommentSheet'), {
  loading: () => <CommentSheetSkeleton />,
  ssr: false,
})

const ShareSheet = dynamic(() => import('./ShareSheet'), {
  ssr: false,
})

// Lazy load heavy dependencies
const loadHls = () => import('hls.js')
```

### Route-based Splitting

```typescript
// Next.js app router tự động split theo route
// Đảm bảo mỗi page có size hợp lý

// Không import toàn bộ package
// ❌ Bad
import * as Icons from 'lucide-react'

// ✅ Good
import { Heart, MessageCircle, Share } from 'lucide-react'
```

## Image Optimization

```typescript
// Dùng Next.js Image với priority cho critical images
import Image from 'next/image'

// Thumbnails
<Image
  src={video.thumbnail}
  alt=""
  fill
  sizes="100vw"
  placeholder="blur"
  blurDataURL={video.blurHash}
  priority={isVisible}
/>

// Avatars - nhỏ, không cần priority
<Image
  src={user.avatar}
  alt={user.name}
  width={32}
  height={32}
  loading="lazy"
/>
```

## Memoization Rules

```typescript
// Memo expensive components
export const VideoItem = memo(function VideoItem({ video }: Props) {
  // Component implementation
})

// useMemo for expensive computations
const formattedComments = useMemo(
  () => comments.map(formatComment),
  [comments]
)

// useCallback for handlers passed to children
const handleLike = useCallback(() => {
  likeMutation.mutate(videoId)
}, [likeMutation, videoId])
```

## Avoid Re-renders

```typescript
// ❌ Bad - creates new object every render
<VideoPlayer config={{ autoPlay: true, muted: false }} />

// ✅ Good - stable reference
const playerConfig = useMemo(() => ({ autoPlay: true, muted: false }), [])
<VideoPlayer config={playerConfig} />

// ❌ Bad - inline function creates new reference
<button onClick={() => handleClick(id)}>Click</button>

// ✅ Good - stable callback
const handleButtonClick = useCallback(() => handleClick(id), [id])
<button onClick={handleButtonClick}>Click</button>
```

## CSS Performance

```css
/* Use GPU-accelerated properties */
.animate {
  transform: translateY(0);
  opacity: 1;
  /* NOT top, left, width, height */
}

/* Avoid layout thrashing */
.video-container {
  contain: layout style paint;
  content-visibility: auto;
}

/* Will-change for animations (use sparingly) */
.animated-element {
  will-change: transform, opacity;
}
```

## Memory Management

```typescript
// Clean up on unmount
useEffect(() => {
  const video = videoRef.current
  
  return () => {
    // Dispose HLS instance
    if (hlsRef.current) {
      hlsRef.current.destroy()
      hlsRef.current = null
    }
    
    // Clear video src
    if (video) {
      video.src = ''
      video.load()
    }
  }
}, [])

// WeakMap for caching
const videoCache = new WeakMap<HTMLVideoElement, HlsInstance>()
```

## Network Optimization

```typescript
// Preconnect to video CDN
<link rel="preconnect" href="https://cdn.vortex.dev" />
<link rel="dns-prefetch" href="https://cdn.vortex.dev" />

// Use appropriate cache headers
// HLS manifests: Cache-Control: max-age=5
// HLS segments: Cache-Control: max-age=86400
// Static assets: Cache-Control: max-age=31536000, immutable
```

## Service Worker Caching

```typescript
// Workbox config
const runtimeCaching = [
  // API responses - network first
  {
    urlPattern: /\/api\//,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'api-cache',
      expiration: { maxEntries: 50, maxAgeSeconds: 300 },
    },
  },
  // HLS manifests - network first (needs fresh data)
  {
    urlPattern: /\.m3u8$/,
    handler: 'NetworkFirst',
    options: {
      cacheName: 'hls-manifests',
      expiration: { maxEntries: 50, maxAgeSeconds: 60 },
    },
  },
  // HLS segments - cache first (immutable)
  {
    urlPattern: /\.ts$/,
    handler: 'CacheFirst',
    options: {
      cacheName: 'hls-segments',
      expiration: { maxEntries: 100, maxAgeSeconds: 86400 },
    },
  },
]
```

## Monitoring & Analytics

```typescript
import { onLCP, onFID, onCLS, onINP } from 'web-vitals'

export function initPerformanceMonitoring() {
  onLCP(sendToAnalytics)
  onFID(sendToAnalytics)
  onCLS(sendToAnalytics)
  onINP(sendToAnalytics)
}

// Video-specific metrics
export function trackVideoMetrics(videoId: string) {
  const startTime = performance.now()
  
  return {
    trackFirstFrame: () => {
      const ttff = performance.now() - startTime
      sendMetric('time_to_first_frame', ttff, { videoId })
    },
    trackBuffering: (duration: number) => {
      sendMetric('buffering_duration', duration, { videoId })
    },
  }
}
```

## Testing Performance

```bash
# Bundle analysis
pnpm build:analyze

# Size limit check
pnpm size-limit

# Lighthouse CI
pnpm lighthouse
```

## Checklist trước Production

- [ ] Bundle size < 150KB (gzip)
- [ ] LCP < 1.5s trên 4G
- [ ] TTI < 2s
- [ ] Video play trong 500ms
- [ ] Smooth 60fps scroll
- [ ] No memory leak sau 50+ videos
- [ ] Hoạt động offline (cached)
- [ ] Test Safari iOS 15+
- [ ] Test Chrome Android 90+
- [ ] Lighthouse Performance > 90

