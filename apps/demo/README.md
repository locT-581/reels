# XHubReel Demo App

> Final demo showcasing all XHubReel packages and features.

## 🎯 Purpose

This demo app serves as:
1. **Internal Demo** - Final presentation of all features for the team
2. **Integration Guide** - Reference implementation for developers
3. **Feature Showcase** - Interactive examples of all components

## 🚀 Quick Start

```bash
# From monorepo root
pnpm install
pnpm --filter xhub-reel-demo dev

# Or start all packages in dev mode
pnpm dev
```

Open [http://localhost:3001](http://localhost:3001) in your browser.

## 📱 Demo Pages

| Page | Path | Description |
|------|------|-------------|
| **Home** | `/` | Landing page with overview |
| **Feed** | `/feed` | Full video feed with gestures |
| **Player** | `/player` | Single video player demo |
| **Components** | `/components` | UI components showcase |
| **Gestures** | `/gestures` | Interactive gesture demos |
| **Design** | `/design` | Design system reference |
| **Docs** | `/docs` | Quick start documentation |

## 📦 Packages Used

```tsx
import { VideoFeed, VideoFeedItem, ConnectedVideoFeed } from '@xhub-reel/feed'
import { VideoPlayer, Timeline, usePlayer } from '@xhub-reel/player'
import { ActionBar, BottomSheet, Toast, CommentSheet } from '@xhub-reel/ui'
import { useVideoGestures, useLongPress, useSwipe } from '@xhub-reel/gestures'
import { type Video, colors, spacing } from '@xhub-reel/core'
```

## 🎨 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Styling**: Tailwind CSS 4
- **Animation**: Motion (motion.dev)
- **Icons**: Lucide React
- **State**: Zustand (via @xhub-reel/core)

## 📂 Project Structure

```
apps/demo/
├── src/
│   ├── app/
│   │   ├── page.tsx           # Landing page
│   │   ├── feed/page.tsx      # Video feed demo
│   │   ├── player/page.tsx    # Single player demo
│   │   ├── components/page.tsx # UI components
│   │   ├── gestures/page.tsx  # Gesture demos
│   │   ├── design/page.tsx    # Design system
│   │   ├── docs/page.tsx      # Documentation
│   │   ├── layout.tsx         # Root layout
│   │   └── globals.css        # Global styles + XHubReel theme
│   ├── components/
│   │   └── Navigation.tsx     # Nav component
│   └── lib/
│       └── mock-data.ts       # Sample videos & data
├── package.json
├── next.config.ts
├── postcss.config.mjs
├── tailwind.config.ts
└── tsconfig.json
```

## 🎬 Features Demonstrated

### Video Feed
- ✅ Swipe navigation (up/down)
- ✅ Single tap to play/pause
- ✅ Double tap to like (with heart animation)
- ✅ Long press for context menu
- ✅ Action bar (like, comment, share)
- ✅ Video info overlay
- ✅ Timeline with seek

### Video Player
- ✅ HLS + native video support
- ✅ Quality selection
- ✅ Playback controls
- ✅ Seek preview
- ✅ Gesture controls

### UI Components
- ✅ Buttons (primary, secondary, ghost)
- ✅ Action bar
- ✅ Bottom sheet
- ✅ Modal
- ✅ Toast notifications
- ✅ Comment sheet
- ✅ Share sheet
- ✅ Loading states (skeleton, spinner)
- ✅ Avatar
- ✅ Typography (counter, marquee)

### Gesture System
- ✅ Single/double tap with zones
- ✅ Long press with progress
- ✅ Vertical swipe
- ✅ Horizontal swipe
- ✅ Seek drag
- ✅ Tap ripple effect

### Design System
- ✅ Color palette (OLED optimized)
- ✅ Typography scale
- ✅ Spacing (8pt grid)
- ✅ Border radius
- ✅ Shadows
- ✅ Glassmorphism
- ✅ Animation presets

## 🔧 Development

```bash
# Start dev server
pnpm --filter xhub-reel-demo dev

# Build
pnpm --filter xhub-reel-demo build

# Type check
pnpm --filter xhub-reel-demo typecheck

# Lint
pnpm --filter xhub-reel-demo lint
```

## 📝 For Developers

This demo serves as a reference implementation. Key patterns to note:

1. **State Management** - Using Zustand stores from `@xhub-reel/core`
2. **Gesture Handling** - Using hooks from `@xhub-reel/gestures`
3. **Component Composition** - Layering video, overlays, and controls
4. **Styling** - CSS variables for theming, Tailwind for utilities

## 📱 Mobile Testing

For the best experience, test on mobile devices or use Chrome DevTools mobile emulation:
- iPhone 14 Pro (390 × 844)
- Pixel 7 (412 × 915)
- Samsung Galaxy S21 (360 × 800)

## 🚧 Known Limitations

- Demo uses sample videos from Google's test video library
- Some features require touch devices (swipe, long press)
- Audio is muted by default (browser autoplay policy)

---

Built with ❤️ using XHubReel packages

