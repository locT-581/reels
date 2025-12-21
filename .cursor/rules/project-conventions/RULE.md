---
description: "VortexStream project conventions - coding standards, file structure, and naming conventions"
globs: 
alwaysApply: true
---

# VortexStream Project Conventions

## Project Overview

VortexStream là ứng dụng xem video dạng short-form (như TikTok), focus 100% vào mobile experience. Không cần SEO, chỉ client-side rendering.

## Tech Stack (Bắt buộc)

- **Framework**: Next.js 15 (App Router) với `"use client"` cho video feed
- **Language**: TypeScript 5.x (strict mode)
- **Package Manager**: pnpm
- **Monorepo**: Turborepo
- **State**: Zustand (client), TanStack Query (server)
- **Styling**: Tailwind CSS 4 + shadcn/ui
- **Animation**: Motion (motion.dev) - KHÔNG dùng Framer Motion
- **Video**: Native `<video>` + hls.js

## Monorepo Structure

```
packages/
├── @vortex/core/      # Core logic, types, stores (< 5KB)
├── @vortex/player/    # HLS video player (< 70KB)
├── @vortex/ui/        # UI components (< 15KB)
├── @vortex/gestures/  # Touch gestures (< 15KB)
├── @vortex/feed/      # Virtualized feed (< 8KB)
└── @vortex/embed/     # Standalone widget (< 100KB)
```

## Naming Conventions

| Type | Convention | Example |
|------|------------|---------|
| Components | PascalCase | `VideoPlayer.tsx`, `SeekBar.tsx` |
| Hooks | camelCase với `use` prefix | `usePlayer.ts`, `useGestures.ts` |
| Stores | camelCase với `Store` suffix | `playerStore.ts`, `feedStore.ts` |
| Types | PascalCase | `Video`, `PlayerState` |
| Constants | UPPER_SNAKE_CASE | `MAX_BUFFER_SIZE` |
| CSS classes | kebab-case (Tailwind) | `video-container` |

## File Organization

```typescript
// Component file structure
// 1. Imports (external → internal → types)
// 2. Types/Interfaces
// 3. Constants
// 4. Component
// 5. Exports

import { useRef, useState } from 'react'
import { motion } from 'motion/react'
import { usePlayer } from '@vortex/core'
import type { Video } from '@vortex/core/types'

const ANIMATION_DURATION = 300

interface VideoPlayerProps {
  video: Video
  autoPlay?: boolean
}

export function VideoPlayer({ video, autoPlay = true }: VideoPlayerProps) {
  // Implementation
}
```

## Import Rules

1. Dùng absolute imports với `@vortex/*` prefix
2. Không import từ `index.ts` nếu có thể import trực tiếp
3. Type imports dùng `import type`

```typescript
// ✅ Good
import { usePlayer } from '@vortex/core/hooks/usePlayer'
import type { Video } from '@vortex/core/types'

// ❌ Bad
import { usePlayer, Video } from '@vortex/core'
```

## Comments & Documentation

- Viết JSDoc cho public APIs
- Comments bằng tiếng Anh
- Không comment code hiển nhiên

```typescript
/**
 * Custom hook for video playback control
 * @param videoRef - Reference to the video element
 * @returns Player state and control functions
 */
export function usePlayer(videoRef: RefObject<HTMLVideoElement>) {
  // Implementation
}
```

## Error Handling

- Dùng try-catch cho async operations
- Log errors với context
- Hiển thị user-friendly messages

```typescript
try {
  await loadVideo(url)
} catch (error) {
  console.error('[VideoPlayer] Failed to load:', { url, error })
  setError('Mạng đang nghỉ ngơi, thử lại nhé!')
}
```

## Performance Rules

- Bundle size mỗi package phải trong budget
- Lazy load components không critical
- Memoize expensive computations
- Avoid re-renders với proper dependency arrays

