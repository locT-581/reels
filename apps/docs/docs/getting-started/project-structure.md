---
sidebar_position: 3
---

# Cấu trúc dự án

Hiểu cách VortexStream được tổ chức và cách các packages tương tác với nhau.

## Kiến trúc Monorepo

```
vortex-stream/
├── apps/
│   ├── web/                    # Demo app
│   ├── docs/                   # Documentation (bạn đang đọc)
│   └── example/                # Example implementations
├── packages/
│   ├── core/                   # @vortex/core
│   ├── player/                 # @vortex/player
│   ├── feed/                   # @vortex/feed
│   ├── gestures/               # @vortex/gestures
│   ├── ui/                     # @vortex/ui
│   └── embed/                  # @vortex/embed
├── package.json
├── pnpm-workspace.yaml
└── turbo.json
```

## Package Dependencies

```mermaid
graph TD
    A[@vortex/embed] --> B[@vortex/feed]
    A --> C[@vortex/player]
    A --> D[@vortex/ui]
    A --> E[@vortex/gestures]
    A --> F[@vortex/core]
    B --> C
    B --> F
    C --> F
    D --> F
    E --> F
```

### Dependency Flow

| Package | Dependencies | Mô tả |
|---------|-------------|-------|
| `@vortex/core` | zustand | Không phụ thuộc package khác |
| `@vortex/player` | core, hls.js | Player cần core types |
| `@vortex/feed` | core, player, react-virtual | Feed cần player |
| `@vortex/gestures` | core, use-gesture | Gestures độc lập |
| `@vortex/ui` | core, motion, lucide-react | UI độc lập |
| `@vortex/embed` | Tất cả | All-in-one package |

## Chi tiết từng Package

### @vortex/core

Nền tảng của toàn bộ SDK.

```
packages/core/
├── src/
│   ├── types/
│   │   ├── video.ts          # Video, Author, Comment types
│   │   ├── player.ts         # PlayerState, Quality types
│   │   ├── ui.ts             # UI-related types
│   │   └── index.ts
│   ├── stores/
│   │   ├── player-store.ts   # Zustand player store
│   │   ├── feed-store.ts     # Feed state
│   │   ├── ui-store.ts       # UI modals, sheets
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useDebounce.ts
│   │   ├── useThrottle.ts
│   │   ├── useNetworkStatus.ts
│   │   └── index.ts
│   ├── utils/
│   │   ├── format.ts         # formatCount, formatDuration
│   │   ├── device.ts         # Device detection
│   │   ├── haptic.ts         # Haptic feedback
│   │   └── index.ts
│   ├── constants/
│   │   ├── animation.ts
│   │   ├── colors.ts
│   │   ├── gesture.ts
│   │   └── index.ts
│   ├── storage/
│   │   ├── db.ts             # IndexedDB setup
│   │   ├── video-cache.ts
│   │   ├── watch-history.ts
│   │   └── index.ts
│   └── index.ts              # Barrel export
```

### @vortex/player

Video player với HLS support.

```
packages/player/
├── src/
│   ├── core/
│   │   ├── hls-engine.ts     # HLS.js wrapper
│   │   ├── native-hls.ts     # Safari native HLS
│   │   └── player-core.ts    # Unified API
│   ├── components/
│   │   ├── VideoPlayer.tsx   # Main component
│   │   ├── Controls.tsx      # Play/Pause controls
│   │   ├── SeekBar.tsx       # Progress bar
│   │   ├── QualitySelector.tsx
│   │   ├── SpeedSelector.tsx
│   │   └── index.ts
│   ├── hooks/
│   │   ├── usePlayer.ts
│   │   ├── usePlayback.ts
│   │   ├── useBuffering.ts
│   │   └── index.ts
│   └── index.ts
```

### @vortex/feed

Virtualized video feed.

```
packages/feed/
├── src/
│   ├── components/
│   │   ├── VideoFeed.tsx     # Main feed container
│   │   ├── VideoFeedItem.tsx # Single video wrapper
│   │   └── index.ts
│   ├── hooks/
│   │   ├── useFeed.ts
│   │   ├── useVirtualFeed.ts
│   │   ├── useVideoActivation.ts
│   │   ├── useVideoVisibility.ts
│   │   └── index.ts
│   └── index.ts
```

### @vortex/gestures

Hệ thống gesture.

```
packages/gestures/
├── src/
│   ├── hooks/
│   │   ├── useVideoGestures.ts  # Complete gesture handling
│   │   ├── useTapGestures.ts    # Single/double tap
│   │   ├── useLongPress.ts
│   │   ├── useHold.ts
│   │   ├── useSwipe.ts
│   │   ├── useSeekDrag.ts
│   │   └── index.ts
│   ├── components/
│   │   ├── TapRipple.tsx
│   │   ├── GestureIndicator.tsx
│   │   └── index.ts
│   ├── utils/
│   │   ├── gesture-zones.ts
│   │   └── index.ts
│   └── index.ts
```

### @vortex/ui

UI components với Vortex Design System.

```
packages/ui/
├── src/
│   ├── components/
│   │   ├── Button.tsx
│   │   ├── IconButton.tsx
│   │   ├── Avatar.tsx
│   │   ├── Text.tsx
│   │   ├── Counter.tsx
│   │   ├── LikeButton.tsx
│   │   ├── CommentButton.tsx
│   │   ├── ShareButton.tsx
│   │   ├── SaveButton.tsx
│   │   ├── Modal.tsx
│   │   ├── CommentSheet.tsx
│   │   ├── ShareSheet.tsx
│   │   ├── Skeleton.tsx
│   │   ├── DoubleTapHeart.tsx
│   │   └── index.ts
│   └── index.ts
├── tailwind.preset.js        # Tailwind preset
```

### @vortex/embed

All-in-one embeddable widget.

```
packages/embed/
├── src/
│   ├── VortexEmbed.tsx       # Main embed component
│   ├── VortexPlayer.tsx      # Single player embed
│   ├── createEmbed.ts        # Vanilla JS API
│   └── index.ts
```

## Bundle Sizes

| Package | Size (gzip) | Dependencies |
|---------|-------------|--------------|
| `@vortex/core` | < 5KB | zustand |
| `@vortex/player` | < 70KB | core + hls.js |
| `@vortex/feed` | < 8KB | core + player + react-virtual |
| `@vortex/gestures` | < 15KB | core + use-gesture |
| `@vortex/ui` | < 15KB | core + motion + lucide-react |
| `@vortex/embed` | < 100KB | Tất cả (bundled) |

## Import Patterns

### Selective imports (Recommended)

```tsx
// Chỉ import những gì cần
import { Video, Author } from '@vortex/core/types'
import { usePlayerStore } from '@vortex/core/stores'
import { formatCount } from '@vortex/core/utils'
```

### Barrel imports

```tsx
// Import từ entry point
import { Video, usePlayerStore, formatCount } from '@vortex/core'
```

### Package-level imports

```tsx
// Import từ package entry
import { VideoPlayer } from '@vortex/player'
import { VideoFeed } from '@vortex/feed'
import { useVideoGestures } from '@vortex/gestures'
import { LikeButton, Avatar } from '@vortex/ui'
```

## Build System

### Turborepo

```json title="turbo.json"
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**"]
    },
    "dev": {
      "cache": false
    }
  }
}
```

### tsup (Bundle)

Mỗi package sử dụng `tsup` để build:

```typescript title="packages/*/tsup.config.ts"
import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm', 'cjs'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  external: ['react', 'react-dom'],
})
```

## Recommended Project Structure

Khi tích hợp VortexStream vào dự án của bạn:

```
your-app/
├── app/
│   ├── (feed)/
│   │   ├── page.tsx          # Video feed page
│   │   └── layout.tsx
│   ├── video/
│   │   └── [id]/
│   │       └── page.tsx      # Single video page
│   ├── layout.tsx
│   └── globals.css
├── components/
│   ├── video/
│   │   ├── VideoWithOverlay.tsx
│   │   ├── VideoActions.tsx
│   │   └── VideoInfo.tsx
│   └── ui/
│       └── ...               # Your custom UI components
├── hooks/
│   ├── useVideos.ts          # Video data fetching
│   └── useLike.ts            # Like mutation
├── lib/
│   ├── api.ts                # API client
│   └── utils.ts
└── types/
    └── index.ts              # Extended types if needed
```

