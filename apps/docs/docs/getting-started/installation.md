---
sidebar_position: 1
---

# Cài đặt

Hướng dẫn cài đặt VortexStream vào dự án của bạn.

## Yêu cầu

- **Node.js** 18.0 trở lên
- **React** 18.0 trở lên
- **Package manager**: npm, pnpm, hoặc yarn

## Phương pháp cài đặt

### Option 1: All-in-One (Khuyến nghị)

Cách đơn giản nhất để bắt đầu là cài đặt `@vortex/embed` - package bao gồm mọi thứ bạn cần:

```bash npm2yarn
npm install @vortex/embed
```

Package này bao gồm:
- `@vortex/core` - Types, stores, utilities
- `@vortex/player` - Video player
- `@vortex/feed` - Video feed
- `@vortex/gestures` - Gesture system
- `@vortex/ui` - UI components

### Peer Dependencies

Bạn cũng cần cài đặt các peer dependencies:

```bash npm2yarn
npm install react react-dom hls.js motion lucide-react @tanstack/react-virtual @use-gesture/react zustand
```

### Option 2: Cài đặt riêng lẻ

Nếu bạn chỉ cần một số tính năng, bạn có thể cài đặt từng package:

```bash npm2yarn
# Core (bắt buộc)
npm install @vortex/core

# Video player
npm install @vortex/player hls.js

# UI components
npm install @vortex/ui motion lucide-react

# Gesture system
npm install @vortex/gestures @use-gesture/react

# Video feed
npm install @vortex/feed @tanstack/react-virtual
```

## Cấu hình TypeScript

VortexStream được viết bằng TypeScript và cung cấp đầy đủ type definitions. Thêm vào `tsconfig.json`:

```json title="tsconfig.json"
{
  "compilerOptions": {
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "moduleResolution": "bundler"
  }
}
```

## Cấu hình Tailwind CSS

Nếu bạn sử dụng Tailwind CSS, thêm preset của Vortex:

```js title="tailwind.config.js"
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@vortex/ui/tailwind.preset')],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@vortex/**/*.js',
  ],
}
```

Preset này bao gồm:
- Vortex colors (`vortex-violet`, `vortex-like`, `vortex-black`)
- 8pt spacing system
- Custom animations
- Safe area utilities

## Cấu hình Next.js

### next.config.js

```js title="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@vortex/core',
    '@vortex/player',
    '@vortex/ui',
    '@vortex/gestures',
    '@vortex/feed',
    '@vortex/embed',
  ],
}

module.exports = nextConfig
```

### App Router

Với Next.js App Router, hãy đảm bảo sử dụng `'use client'` directive cho components sử dụng VortexStream:

```tsx title="app/feed/page.tsx"
'use client'

import { VortexEmbed } from '@vortex/embed'

export default function FeedPage() {
  return <VortexEmbed videos={videos} />
}
```

## Xác minh cài đặt

Tạo một component đơn giản để kiểm tra:

```tsx title="TestVortex.tsx"
import { VideoPlayer } from '@vortex/player'

export function TestVortex() {
  return (
    <div className="h-screen w-screen bg-black">
      <VideoPlayer
        src="https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8"
        autoPlay
        muted
      />
    </div>
  )
}
```

## Xử lý lỗi thường gặp

### "Cannot find module '@vortex/xxx'"

Đảm bảo bạn đã cài đặt tất cả peer dependencies và restart development server.

### "Hydration mismatch" (Next.js)

Video player cần chạy client-side. Thêm `'use client'` vào đầu file hoặc sử dụng dynamic import:

```tsx
import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(
  () => import('@vortex/player').then((mod) => mod.VideoPlayer),
  { ssr: false }
)
```

### HLS không hoạt động trên Safari

Safari hỗ trợ native HLS, nhưng cần đảm bảo video source là file `.m3u8` hợp lệ.

## Bước tiếp theo

- [Quick Start](/docs/getting-started/quick-start) - Tạo video feed đầu tiên
- [Project Structure](/docs/getting-started/project-structure) - Hiểu cấu trúc packages

