# VortexStream Tech Stack

> **Nguyên tắc chọn stack:** Mobile-first, Ultra-lightweight, Cross-platform video stability, Easy integration

---

## 📦 Kiến trúc Monorepo

```
vortex-stream/
├── apps/
│   ├── web/                    # Next.js demo app
│   └── docs/                   # Documentation site (Nextra)
├── packages/
│   ├── @vortex/core/           # Core logic, state, types
│   ├── @vortex/player/         # HLS Video player
│   ├── @vortex/ui/             # UI Components (React)
│   ├── @vortex/gestures/       # Touch gesture system
│   ├── @vortex/feed/           # Virtualized video feed
│   └── @vortex/embed/          # Embeddable widget (standalone)
├── turbo.json
├── package.json
└── pnpm-workspace.yaml
```

### Lợi ích kiến trúc này:

| Benefit | Mô tả |
|---------|-------|
| **Plug & Play** | Người dùng có thể `npm install @vortex/embed` và nhúng vào bất kỳ website nào |
| **Tree-shakable** | Chỉ import những gì cần, bundle size tối thiểu |
| **Framework Agnostic** | `@vortex/core` không phụ thuộc React, có thể dùng với Vue/Svelte |
| **Versioning độc lập** | Mỗi package version riêng, dễ maintain |

---

## 🛠 Core Tech Stack

### Framework & Runtime

| Layer | Choice | Bundle Size | Lý do |
|-------|--------|-------------|-------|
| **Framework** | Next.js 15 (App Router) | ~85KB | Bắt buộc. Dùng `use client` cho toàn bộ feed vì không cần SEO |
| **Runtime** | React 19 | ~6KB | Concurrent features, Suspense for data fetching |
| **Build Tool** | Turbopack | - | 10x faster than Webpack |
| **Monorepo** | Turborepo | - | Caching, parallel builds |
| **Package Manager** | pnpm | - | Faster, disk efficient |
| **Language** | TypeScript 5.x | - | Type safety, better DX |

### Rendering Strategy

```typescript
// next.config.js
const nextConfig = {
  // Không cần SSR/SSG cho feed video
  // Chỉ render client-side để tối ưu performance
  reactStrictMode: true,
  
  // Disable server components cho video feed pages
  experimental: {
    ppr: false, // Không cần Partial Prerendering
  },
}
```

**Lý do không dùng SSR:**
- Video content là dynamic, personalized
- Không cần SEO
- Client-side rendering = faster interactions
- Giảm server cost

---

## 🎨 UI & Styling

| Layer | Choice | Size | Lý do |
|-------|--------|------|-------|
| **Styling** | CSS Variables + Inline Styles | 0KB | Zero runtime, maximum customizability |
| **Design Tokens** | `@vortex/core/styles` | ~2KB | Type-safe, customizable |
| **Icons** | Inline SVG | 0KB dependency | No external icon library needed |
| **Animation** | Motion (motion.dev) | ~18KB | Nhẹ hơn Framer Motion 50% |
| **Spring Physics** | Motion | Included | `spring()` cho physics-based animation |

### Tại sao không dùng Tailwind CSS?

| Vấn đề với Tailwind trong packages | Giải pháp CSS Variables |
|-----------------------------------|-------------------------|
| Cần cấu hình content scanning cho mỗi app | Hoạt động ngay khi import |
| Class names có thể bị purged sai | Inline styles không bị purged |
| Khó customize từ bên ngoài package | CSS variables dễ override |
| Cần PostCSS build step | Zero build step |

### CSS Variables System

```css
/* Users can override in their CSS */
:root {
  --vortex-color-accent: #8B5CF6;
  --vortex-color-like: #FF2D55;
  --vortex-radius-lg: 16px;
  --vortex-duration-normal: 300ms;
}
```

### Type-safe Style Utilities

```typescript
import { colors, spacing, mergeStyles, layout, typography } from '@vortex/core'

// Build styles with full type safety
const buttonStyles = mergeStyles(
  layout.flexCenter,
  typography.text({ size: 'md', weight: 'semibold' }),
  { backgroundColor: colors.accent }
)

// Override via CSS variables
<div style={buttonStyles} />
```

---

## 📹 Video Player Stack

### Core Video Technology

| Component | Choice | Lý do |
|-----------|--------|-------|
| **Base** | Native `<video>` element | Tối ưu nhất cho mobile |
| **HLS Support** | hls.js | ~60KB, best HLS support cho web |
| **Fallback (iOS)** | Native HLS | Safari hỗ trợ native, không cần hls.js |
| **ABR Algorithm** | hls.js built-in | Adaptive bitrate tự động |

### Tại sao KHÔNG dùng:

| Option | Lý do loại |
|--------|------------|
| **Video.js** | ~300KB, quá nặng |
| **Plyr** | Không tốt cho vertical video |
| **Shaka Player** | ~150KB, overkill cho HLS-only |
| **ReactPlayer** | Wrapper không cần thiết, thêm overhead |

### Video Player Architecture

```typescript
// @vortex/player structure
packages/player/
├── src/
│   ├── core/
│   │   ├── hls-engine.ts      # HLS.js wrapper
│   │   ├── native-hls.ts      # iOS native fallback
│   │   └── player-core.ts     # Unified API
│   ├── components/
│   │   ├── VideoPlayer.tsx    # Main component
│   │   ├── Controls.tsx       # Play/Pause/Seek
│   │   ├── SeekBar.tsx        # Progress bar
│   │   └── Overlay.tsx        # Info overlay
│   ├── hooks/
│   │   ├── usePlayer.ts       # Player state
│   │   ├── usePlayback.ts     # Play/pause/seek
│   │   └── useBuffering.ts    # Buffer state
│   └── index.ts
```

### HLS.js Config (Mobile Optimized)

```typescript
const hlsConfig: Partial<HlsConfig> = {
  // Giảm buffer để tiết kiệm memory
  maxBufferLength: 30,              // 30s thay vì 60s default
  maxMaxBufferLength: 60,           // Max 60s
  maxBufferSize: 30 * 1000 * 1000,  // 30MB max buffer
  
  // Aggressive ABR cho mobile
  abrEwmaDefaultEstimate: 500000,   // Start với 500kbps estimate
  abrBandWidthUpFactor: 0.7,        // Thận trọng khi tăng quality
  abrBandWidthFactor: 0.9,          // Nhanh giảm quality khi mạng yếu
  
  // Startup nhanh
  startLevel: -1,                   // Auto select
  autoStartLoad: true,
  
  // Low latency
  lowLatencyMode: false,            // Không cần live streaming
  
  // Error recovery
  fragLoadingMaxRetry: 3,
  manifestLoadingMaxRetry: 3,
}
```

---

## 👆 Gesture & Interaction

| Feature | Choice | Size | Lý do |
|---------|--------|------|-------|
| **Gesture Detection** | @use-gesture/react | ~12KB | Hỗ trợ tất cả gesture cần thiết |
| **Haptic Feedback** | Native Vibration API | 0KB | Browser built-in |
| **Pull-to-Refresh** | Custom (use-gesture) | - | Không dùng library riêng |

### Gesture Implementation

```typescript
// @vortex/gestures
import { useGesture } from '@use-gesture/react'

export function useVideoGestures(videoRef: RefObject<HTMLVideoElement>) {
  const bind = useGesture({
    onTap: ({ event }) => {
      // Single tap - play/pause
    },
    onDoubleTap: ({ event }) => {
      // Double tap - like hoặc seek
    },
    onLongPress: () => {
      // Context menu
      navigator.vibrate?.(10) // Haptic
    },
    onDrag: ({ movement: [mx, my], direction: [dx, dy] }) => {
      // Horizontal: seek
      // Vertical: scroll
    },
  }, {
    eventOptions: { passive: false },
    drag: { threshold: 10 },
    longPress: { threshold: 500 },
  })
  
  return bind
}
```

---

## 📜 Virtualization & Feed

| Feature | Choice | Lý do |
|---------|--------|-------|
| **Virtual List** | @tanstack/react-virtual | ~3KB, hiệu quả nhất |
| **Scroll Snap** | CSS `scroll-snap-type` | Native, 0 JS |
| **Intersection Observer** | Native API | Detect video in viewport |

### Feed Architecture

```typescript
// @vortex/feed
packages/feed/
├── src/
│   ├── components/
│   │   ├── VideoFeed.tsx       # Main feed container
│   │   └── VideoItem.tsx       # Single video wrapper
│   ├── hooks/
│   │   ├── useFeed.ts          # Feed data & pagination
│   │   ├── useVirtualFeed.ts   # Virtualization logic
│   │   └── useVideoVisibility.ts # IntersectionObserver
│   └── index.ts
```

### Virtualization Strategy

```typescript
import { useVirtualizer } from '@tanstack/react-virtual'

export function VideoFeed({ videos }: { videos: Video[] }) {
  const parentRef = useRef<HTMLDivElement>(null)
  
  const virtualizer = useVirtualizer({
    count: videos.length,
    getScrollElement: () => parentRef.current,
    estimateSize: () => window.innerHeight, // Full viewport height per video
    overscan: 2, // Render 2 extra videos above/below
  })
  
  return (
    <div 
      ref={parentRef}
      className="h-screen overflow-y-scroll snap-y snap-mandatory"
    >
      <div style={{ height: virtualizer.getTotalSize() }}>
        {virtualizer.getVirtualItems().map((virtualItem) => (
          <VideoItem 
            key={virtualItem.key}
            video={videos[virtualItem.index]}
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              transform: `translateY(${virtualItem.start}px)`,
              height: '100vh',
            }}
          />
        ))}
      </div>
    </div>
  )
}
```

---

## 🗃 State Management

| Layer | Choice | Size | Lý do |
|-------|--------|------|-------|
| **Client State** | Zustand | ~1.2KB | Siêu nhẹ, simple API |
| **Server State** | TanStack Query | ~13KB | Caching, deduplication |
| **Form State** | Native | 0KB | Ít form, không cần library |

### Store Structure

```typescript
// @vortex/core/stores

// Player store
interface PlayerStore {
  currentVideo: Video | null
  isPlaying: boolean
  isMuted: boolean
  volume: number
  playbackSpeed: number
  quality: 'auto' | '1080p' | '720p' | '480p'
  
  // Actions
  play: () => void
  pause: () => void
  toggleMute: () => void
  setVolume: (v: number) => void
  setSpeed: (s: number) => void
}

// Feed store
interface FeedStore {
  videos: Video[]
  currentIndex: number
  feedType: 'foryou' | 'following'
  
  // Actions
  setCurrentIndex: (i: number) => void
  loadMore: () => Promise<void>
}
```

---

## 💾 Storage & Caching

| Layer | Technology | Purpose |
|-------|------------|---------|
| **L1 Memory** | Map/WeakMap | Decoded frames, active players |
| **L2 IndexedDB** | idb (~1KB wrapper) | Video segments, metadata |
| **L3 Service Worker** | Workbox | Static assets, API cache |
| **User Preferences** | localStorage | Mute state, volume, playback speed |

### IndexedDB Schema

```typescript
// @vortex/core/storage

interface VortexDB {
  videos: {
    key: string          // video_id
    value: {
      metadata: VideoMetadata
      thumbnailBlob: Blob
      watchProgress: number
      cachedAt: number
    }
  }
  segments: {
    key: string          // video_id:segment_index
    value: {
      blob: Blob
      quality: string
      cachedAt: number
    }
  }
  watchHistory: {
    key: string          // video_id
    value: {
      watchedAt: number
      progress: number
      completed: boolean
    }
  }
}
```

---

## 📱 PWA & Mobile Optimization

| Feature | Implementation |
|---------|----------------|
| **PWA** | next-pwa (Workbox under the hood) |
| **Manifest** | Auto-generated |
| **Service Worker** | Workbox strategies |
| **Offline** | Cache-first for assets, Network-first for API |

### PWA Config

```typescript
// next.config.js
const withPWA = require('next-pwa')({
  dest: 'public',
  disable: process.env.NODE_ENV === 'development',
  runtimeCaching: [
    {
      urlPattern: /^https:\/\/.*\.m3u8$/,
      handler: 'NetworkFirst',
      options: {
        cacheName: 'hls-manifests',
        expiration: { maxEntries: 50, maxAgeSeconds: 60 * 60 }, // 1 hour
      },
    },
    {
      urlPattern: /^https:\/\/.*\.ts$/, // HLS segments
      handler: 'CacheFirst',
      options: {
        cacheName: 'hls-segments',
        expiration: { maxEntries: 100, maxAgeSeconds: 60 * 60 * 24 }, // 24 hours
      },
    },
  ],
})
```

### Mobile Meta Tags

```html
<!-- Viewport tối ưu cho video fullscreen -->
<meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no, viewport-fit=cover">

<!-- iOS specific -->
<meta name="apple-mobile-web-app-capable" content="yes">
<meta name="apple-mobile-web-app-status-bar-style" content="black-translucent">

<!-- Android specific -->
<meta name="theme-color" content="#000000">
<meta name="mobile-web-app-capable" content="yes">
```

---

## 📊 Analytics & Monitoring

| Purpose | Choice | Lý do |
|---------|--------|-------|
| **Performance** | web-vitals | ~1.5KB, Core Web Vitals tracking |
| **Error Tracking** | Sentry (optional) | Production error monitoring |
| **Analytics** | Custom events → Backend | Không dùng GA để giảm bundle |

### Performance Monitoring

```typescript
// @vortex/core/analytics

import { onLCP, onFID, onCLS, onINP } from 'web-vitals'

export function initPerformanceMonitoring() {
  onLCP(sendToAnalytics)
  onFID(sendToAnalytics)
  onCLS(sendToAnalytics)
  onINP(sendToAnalytics)
}

// Video-specific metrics
export function trackVideoMetrics(videoId: string) {
  return {
    trackTimeToFirstFrame: (ms: number) => { /* ... */ },
    trackBuffering: (duration: number) => { /* ... */ },
    trackQualitySwitch: (from: string, to: string) => { /* ... */ },
    trackError: (error: Error) => { /* ... */ },
  }
}
```

---

## 📦 Package Exports (cho Integration)

### @vortex/embed - Standalone Widget

```typescript
// Dễ dàng nhúng vào bất kỳ website nào

// Option 1: Script tag
<script src="https://cdn.vortex.dev/embed.min.js"></script>
<div id="vortex-feed" data-api-key="xxx" data-feed-type="foryou"></div>
<script>
  VortexEmbed.init('#vortex-feed', {
    apiEndpoint: 'https://api.your-site.com/videos',
    theme: 'dark',
  })
</script>

// Option 2: React component
import { VortexFeed } from '@vortex/embed/react'

function App() {
  return (
    <VortexFeed 
      apiEndpoint="/api/videos"
      onVideoView={(video) => console.log('Viewed:', video.id)}
      onLike={(video) => handleLike(video.id)}
    />
  )
}

// Option 3: Web Component
<vortex-feed 
  api-endpoint="/api/videos"
  theme="dark"
></vortex-feed>
```

---

## 🎯 Bundle Size Budget

| Package | Target Size (gzip) |
|---------|-------------------|
| `@vortex/core` | < 5KB |
| `@vortex/player` | < 70KB (including hls.js) |
| `@vortex/ui` | < 15KB |
| `@vortex/gestures` | < 15KB |
| `@vortex/feed` | < 8KB |
| `@vortex/embed` | < 100KB (all-in-one) |
| **Total (full app)** | < 150KB |

### Bundle Analysis

```bash
# Analyze bundle
pnpm build:analyze

# Check bundle size
pnpm size-limit
```

---

## 🔧 Development Tools

| Tool | Purpose |
|------|---------|
| **ESLint** | Code linting |
| **Prettier** | Code formatting |
| **TypeScript** | Type checking |
| **Vitest** | Unit testing |
| **Playwright** | E2E testing |
| **Storybook** | Component development |
| **Changesets** | Version management |

---

## 📋 Checklist trước khi Production

- [ ] Bundle size < 150KB (gzip)
- [ ] LCP < 1.5s trên 4G
- [ ] TTI < 2s
- [ ] Video play trong 500ms
- [ ] Smooth 60fps scroll
- [ ] Hoạt động offline (cached content)
- [ ] No memory leak sau 50+ videos scroll
- [ ] Test trên Safari iOS 15+
- [ ] Test trên Chrome Android 90+
- [ ] Lighthouse Performance > 90

---

## 🚀 Quick Start (cho Integration)

```bash
# Install
npm install @vortex/embed

# hoặc
pnpm add @vortex/embed
```

```tsx
// React
import { VortexFeed } from '@vortex/embed/react'

export default function VideoPage() {
  return (
    <VortexFeed
      videos={videos}
      onVideoEnd={(video) => loadMore()}
    />
  )
}
```

```html
<!-- Vanilla JS -->
<script type="module">
  import { createVortexFeed } from 'https://cdn.vortex.dev/embed.esm.js'
  
  createVortexFeed(document.getElementById('feed'), {
    videos: await fetchVideos(),
  })
</script>
```

