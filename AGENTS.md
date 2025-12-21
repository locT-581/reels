# VortexStream - AI Agent Instructions

> Short-form video platform focused on mobile viewing experience. No SEO needed, 100% client-side.

## Quick Reference

### Tech Stack
- **Framework**: Next.js 15 (App Router) + React 19
- **Language**: TypeScript 5.x (strict)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Animation**: Motion (motion.dev) - NOT Framer Motion
- **State**: Zustand (client) + TanStack Query (server)
- **Video**: Native `<video>` + hls.js
- **Gestures**: @use-gesture/react
- **Virtualization**: @tanstack/react-virtual

### Design System (Vortex)
- **Background**: Always `#000000` (OLED optimized)
- **Accent**: `#8B5CF6` (Electric Violet)
- **Like Color**: `#FF2D55`
- **Spacing**: 8pt grid (8, 16, 24, 32...)
- **Border Radius**: 16-24px
- **Animation**: 300ms, `cubic-bezier(0.32, 0.72, 0, 1)`

### Bundle Budget
- Total app: < 150KB gzip
- Core: < 5KB | Player: < 70KB | UI: < 15KB

### Performance Targets
- LCP: < 1.5s | TTI: < 2s | Video first frame: < 500ms
- Scroll: 60fps | Lighthouse: > 90

---

## Core Principles

1. **Video-centric**: Video chiếm 100% viewport, UI là "bóng ma"
2. **Mobile-first**: Không quan tâm desktop
3. **Physics-First**: Spring animations, không linear
4. **Reachability First**: Actions ở bottom 1/3 màn hình

---

## Code Patterns

### Components
```tsx
// File structure: imports → types → constants → component → exports
import { useRef } from 'react'
import { motion } from 'motion/react'
import { usePlayer } from '@vortex/core'
import type { Video } from '@vortex/core/types'

interface VideoPlayerProps {
  video: Video
}

export function VideoPlayer({ video }: VideoPlayerProps) {
  // Implementation
}
```

### Zustand Store
```typescript
export const usePlayerStore = create<PlayerState>()((set) => ({
  isPlaying: false,
  isMuted: true,
  play: () => set({ isPlaying: true }),
  pause: () => set({ isPlaying: false }),
}))
```

### Animation (Motion)
```tsx
<motion.div
  animate={{ scale: liked ? [1, 1.3, 1] : 1 }}
  transition={{ type: 'spring', stiffness: 400, damping: 30 }}
/>
```

---

## UI Rules

1. **Icons**: Lucide React, 32px, Outline default → Solid when active
2. **Text on video**: Always add `drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]`
3. **Bottom sheets**: Glassmorphism `bg-black/80 backdrop-blur-xl`
4. **Buttons**: Min tap area 48x48px
5. **Never use**: `bg-white` on video pages

---

## Gestures

| Gesture | Action |
|---------|--------|
| Single tap (center) | Play/Pause |
| Double tap (left) | Seek -10s |
| Double tap (right) | Seek +10s |
| Double tap (center) | Like |
| Long press | Context menu |
| Swipe up/down | Next/Previous video |

---

## Error Messages

```typescript
const messages = {
  network: 'Mạng đang nghỉ ngơi, thử lại nhé!',
  notFound: 'Video này đã bay màu rồi',
  server: 'Có lỗi từ phía chúng tôi, xin lỗi!',
}
```

---

## File Naming

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `VideoPlayer.tsx` |
| Hooks | camelCase + use | `usePlayer.ts` |
| Stores | camelCase + Store | `playerStore.ts` |
| Types | PascalCase | `Video`, `PlayerState` |

---

## Don'ts

❌ SSR cho video feed (không cần SEO)
❌ Framer Motion (dùng Motion)
❌ Redux/MobX (dùng Zustand)
❌ Video.js/Plyr (dùng native + hls.js)
❌ bg-white trên video pages
❌ Linear animations (dùng spring)
❌ Import toàn bộ icon library

