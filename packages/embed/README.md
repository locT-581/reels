# @vortex/embed

> Embeddable video widget for VortexStream

## Installation

```bash
npm install @vortex/embed
# or
pnpm add @vortex/embed
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
import { VortexEmbed } from '@vortex/embed'

function App() {
  return (
    <VortexEmbed
      videos={videos}
      width={375}
      height={667}
    />
  )
}
```

### With Configuration

```tsx
<VortexEmbed
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
import { VortexPlayer } from '@vortex/embed'

<VortexPlayer
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
  src="https://vortex.stream/embed?v=VIDEO_ID"
  width="375"
  height="667"
  frameborder="0"
  allow="autoplay; fullscreen"
  allowfullscreen
></iframe>
```

## Props

### VortexEmbed

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

<!-- Include Vortex Embed -->
<script src="https://unpkg.com/@vortex/embed"></script>

<div id="vortex-player"></div>

<script>
  VortexEmbed.render('#vortex-player', {
    videos: [...],
    config: {
      autoPlay: true,
      muted: true,
    }
  })
</script>
```

## Re-exports

For convenience, this package re-exports from other @vortex packages:

```typescript
// Components
export { VortexEmbed, VortexPlayer } from '@vortex/embed'
export { VideoFeed, VideoFeedItem } from '@vortex/feed'
export { VideoPlayer } from '@vortex/player'

// Types
export type { Video, Author, Comment } from '@vortex/core'
export type { EmbedConfig, EmbedProps } from '@vortex/embed'
```

## Bundle Size

| Bundle | Size (gzip) |
|--------|-------------|
| @vortex/embed | ~12KB |
| + peer dependencies | ~150KB |

Note: Peer dependencies are externalized. If already using React, HLS.js, etc., the actual bundle added is only ~12KB.

## License

MIT

