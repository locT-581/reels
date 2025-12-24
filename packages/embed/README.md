# @xhub-reel/embed

> Embeddable video widget for XHubReel

## Installation

```bash
npm install @xhub-reel/embed
# or
pnpm add @xhub-reel/embed
```

### Peer Dependencies

```bash
npm install react react-dom hls.js motion lucide-react @tanstack/react-virtual @use-gesture/react zustand
```

## Features

- 📦 **All-in-One** - Complete video player and feed
- 🎨 **Customizable** - Theme, colors, features
- 📱 **Responsive** - Works on any screen size
- ⚡ **Lightweight** - ~12KB gzipped (excluding peers)
- 🔌 **Easy Integration** - Single component

## Usage

### Basic Embed

```tsx
import { XHubReelEmbed } from '@xhub-reel/embed'

function App() {
  return (
    <XHubReelEmbed
      videos={videos}
      width={375}
      height={667}
    />
  )
}
```

### With Configuration

```tsx
<XHubReelEmbed
  videos={videos}
  config={{
    autoPlay: true,
    muted: true,
    loop: true,
    showControls: true,
    showActions: true,
    showOverlay: true,
    theme: 'dark',
    accentColor: '#8B5CF6',
  }}
  onVideoChange={(video) => trackVideo(video.id)}
  onLike={(videoId) => handleLike(videoId)}
  onShare={(videoId) => handleShare(videoId)}
/>
```

### Single Video

```tsx
import { XHubReelPlayer } from '@xhub-reel/embed'

<XHubReelPlayer
  video={video}
  autoPlay
  muted
  controls
/>
```

### Iframe Embed

For cross-origin embedding:

```html
<iframe
  src="https://xhubreel.stream/embed?v=VIDEO_ID"
  width="375"
  height="667"
  frameborder="0"
  allow="autoplay; fullscreen"
  allowfullscreen
></iframe>
```

## Props

### XHubReelEmbed

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `videos` | `Video[]` | `[]` | Videos to display |
| `width` | `number \| string` | `'100%'` | Container width |
| `height` | `number \| string` | `'100%'` | Container height |
| `config` | `EmbedConfig` | `{}` | Configuration |
| `onVideoChange` | `(video) => void` | - | Video change callback |
| `onLike` | `(videoId) => void` | - | Like callback |
| `onComment` | `(videoId) => void` | - | Comment callback |
| `onShare` | `(videoId) => void` | - | Share callback |
| `onSave` | `(videoId) => void` | - | Save callback |
| `className` | `string` | - | Container class |

### EmbedConfig

```typescript
interface EmbedConfig {
  autoPlay?: boolean      // Auto-play videos (default: true)
  muted?: boolean         // Start muted (default: true)
  loop?: boolean          // Loop single video (default: false)
  showControls?: boolean  // Show player controls (default: true)
  showActions?: boolean   // Show like/comment/share (default: true)
  showOverlay?: boolean   // Show video info overlay (default: true)
  theme?: 'dark' | 'light' // Theme (default: 'dark')
  accentColor?: string    // Accent color (default: '#8B5CF6')
  preloadCount?: number   // Videos to preload (default: 2)
}
```

## CDN Usage

```html
<!-- Include dependencies -->
<script src="https://unpkg.com/react@18/umd/react.production.min.js"></script>
<script src="https://unpkg.com/react-dom@18/umd/react-dom.production.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/hls.js@latest"></script>

<!-- Include XHubReel Embed -->
<script src="https://unpkg.com/@xhub-reel/embed"></script>

<div id="xhub-reel-player"></div>

<script>
  XHubReelEmbed.render('#xhub-reel-player', {
    videos: [...],
    config: {
      autoPlay: true,
      muted: true,
    }
  })
</script>
```

## Re-exports

For convenience, this package re-exports from other @xhub-reel packages:

```typescript
// Components
export { XHubReelEmbed, XHubReelPlayer } from '@xhub-reel/embed'
export { VideoFeed, VideoFeedItem } from '@xhub-reel/feed'
export { VideoPlayer } from '@xhub-reel/player'

// Types
export type { Video, Author, Comment } from '@xhub-reel/core'
export type { EmbedConfig, EmbedProps } from '@xhub-reel/embed'
```

## Bundle Size

| Bundle | Size (gzip) |
|--------|-------------|
| @xhub-reel/embed | ~12KB |
| + peer dependencies | ~150KB |

Note: Peer dependencies are externalized. If already using React, HLS.js, etc., the actual bundle added is only ~12KB.

## License

MIT

