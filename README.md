# XHubReel 🌀

> Short-form video platform SDK - Build TikTok-like experiences

[![npm version](https://img.shields.io/npm/v/@xhub-reel/core.svg)](https://www.npmjs.com/package/@xhub-reel/core)
[![Bundle Size](https://img.shields.io/badge/bundle-<150KB-green.svg)](https://bundlephobia.com/package/@xhub-reel/core)
[![License: MIT](https://img.shields.io/badge/License-MIT-blue.svg)](https://opensource.org/licenses/MIT)

## Features

- 🎬 **HLS Video Player** - Adaptive streaming with hls.js
- 📜 **Virtualized Feed** - Smooth infinite scroll with @tanstack/react-virtual
- 👆 **Gesture System** - Tap, swipe, long press with haptic feedback
- 🎨 **UI Components** - Dark-first design system
- 💾 **Offline Support** - IndexedDB caching, offline actions queue
- 📱 **PWA Ready** - Service worker, installable
- ⚡ **Performance** - < 150KB gzip, 60fps scroll, < 500ms first frame

## Quick Start

```bash
# Install the embed package (all-in-one)
npm install @xhub-reel/embed react react-dom hls.js motion lucide-react

# Or install individual packages
npm install @xhub-reel/core @xhub-reel/player @xhub-reel/feed @xhub-reel/ui @xhub-reel/gestures
```

```tsx
import { XHubReelEmbed } from '@xhub-reel/embed'

function App() {
  const videos = [
    {
      id: '1',
      url: 'https://example.com/video1.m3u8',
      thumbnail: 'https://example.com/thumb1.jpg',
      author: { id: '1', username: 'user1', displayName: 'User 1' },
      caption: 'My first video!',
      stats: { views: 1000, likes: 100, comments: 10, shares: 5 },
      duration: 30,
    },
    // ... more videos
  ]

  return (
    <XHubReelEmbed
      videos={videos}
      width={375}
      height={667}
      config={{
        autoPlay: true,
        muted: true,
      }}
    />
  )
}
```

## Packages

| Package | Description | Size |
|---------|-------------|------|
| [@xhub-reel/core](./packages/core) | Types, stores, utilities | ~21KB |
| [@xhub-reel/player](./packages/player) | HLS video player | ~15KB |
| [@xhub-reel/ui](./packages/ui) | UI components | ~14KB |
| [@xhub-reel/gestures](./packages/gestures) | Gesture system | ~3KB |
| [@xhub-reel/feed](./packages/feed) | Virtualized feed | ~8KB |
| [@xhub-reel/embed](./packages/embed) | All-in-one widget | ~12KB |

**Total: ~73KB gzip** (budget: < 150KB) ✅

## Documentation

- [Getting Started](./docs/GETTING_STARTED.md)
- [API Reference](./docs/API.md)
- [Integration Guide](./docs/INTEGRATION.md)
- [Customization](./docs/CUSTOMIZATION.md)

## Examples

### React

```tsx
import { VideoFeed } from '@xhub-reel/feed'
import { useInfiniteQuery } from '@tanstack/react-query'

function Feed() {
  const { data, fetchNextPage } = useInfiniteQuery({...})
  
  return (
    <VideoFeed
      videos={data?.pages.flat() ?? []}
      onEndReached={() => fetchNextPage()}
      onLike={(id) => likeMutation.mutate(id)}
    />
  )
}
```

### Next.js

```tsx
// app/page.tsx
import { XHubReelEmbed } from '@xhub-reel/embed'

export default function Home() {
  return (
    <main className="h-screen">
      <XHubReelEmbed videos={videos} />
    </main>
  )
}
```

### Single Video

```tsx
import { VideoPlayer } from '@xhub-reel/player'

<VideoPlayer
  src="https://example.com/video.m3u8"
  poster="https://example.com/poster.jpg"
  autoPlay
  muted
/>
```

## Design System

XHubReel uses the **XHubReel Design System**:

- **Background**: #000000 (OLED black)
- **Accent**: #8B5CF6 (Electric Violet)
- **Like**: #FF2D55
- **Spacing**: 8pt grid
- **Animation**: Spring physics (stiffness: 400, damping: 30)

## Performance Targets

| Metric | Target | Status |
|--------|--------|--------|
| Bundle Size | < 150KB | ✅ 73KB |
| LCP | < 1.5s | ✅ |
| TTI | < 2s | ✅ |
| INP | < 150ms | ✅ |
| CLS | < 0.05 | ✅ |
| First Frame | < 500ms | ✅ |
| Scroll FPS | 60fps | ✅ |

## Browser Support

- Safari iOS 15+
- Chrome Android 90+
- Chrome Desktop 90+
- Firefox 90+
- Edge 90+

## Development

```bash
# Install dependencies
pnpm install

# Start development
pnpm dev

# Build all packages
pnpm build

# Run tests
pnpm test

# Run Storybook
pnpm storybook
```

## Contributing

See [CONTRIBUTING.md](./CONTRIBUTING.md) for guidelines.

## License

MIT © XHubReel Team

---

Built with ❤️ using React, TypeScript, and hls.js

