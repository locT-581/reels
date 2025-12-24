---
sidebar_position: 1
---

# Cài đặt

Hướng dẫn cài đặt XHubReel vào dự án của bạn.

## Yêu cầu

- **Node.js** 18.0 trở lên
- **React** 18.0 trở lên
- **Package manager**: npm, pnpm, hoặc yarn

## Phương pháp cài đặt

### Option 1: All-in-One (Khuyến nghị)

Cách đơn giản nhất để bắt đầu là cài đặt `@xhub-reel/embed` - package bao gồm mọi thứ bạn cần:

```bash npm2yarn
npm install @xhub-reel/embed
```

Package này bao gồm:
- `@xhub-reel/core` - Types, stores, utilities
- `@xhub-reel/player` - Video player
- `@xhub-reel/feed` - Video feed
- `@xhub-reel/gestures` - Gesture system
- `@xhub-reel/ui` - UI components

### Peer Dependencies

Bạn cũng cần cài đặt các peer dependencies:

```bash npm2yarn
npm install react react-dom hls.js motion lucide-react @tanstack/react-virtual @use-gesture/react zustand
```

### Option 2: Cài đặt riêng lẻ

Nếu bạn chỉ cần một số tính năng, bạn có thể cài đặt từng package:

```bash npm2yarn
# Core (bắt buộc)
npm install @xhub-reel/core

# Video player
npm install @xhub-reel/player hls.js

# UI components
npm install @xhub-reel/ui motion lucide-react

# Gesture system
npm install @xhub-reel/gestures @use-gesture/react

# Video feed
npm install @xhub-reel/feed @tanstack/react-virtual
```

## Cấu hình TypeScript

XHubReel được viết bằng TypeScript và cung cấp đầy đủ type definitions. Thêm vào `tsconfig.json`:

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

Nếu bạn sử dụng Tailwind CSS, thêm preset của XHubReel:

```js title="tailwind.config.js"
/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [require('@xhub-reel/ui/tailwind.preset')],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@xhub-reel/**/*.js',
  ],
}
```

Preset này bao gồm:
- XHubReel colors (`xhub-reel-violet`, `xhub-reel-like`, `xhub-reel-black`)
- 8pt spacing system
- Custom animations
- Safe area utilities

## Cấu hình Next.js

### next.config.js

```js title="next.config.js"
/** @type {import('next').NextConfig} */
const nextConfig = {
  transpilePackages: [
    '@xhub-reel/core',
    '@xhub-reel/player',
    '@xhub-reel/ui',
    '@xhub-reel/gestures',
    '@xhub-reel/feed',
    '@xhub-reel/embed',
  ],
}

module.exports = nextConfig
```

### App Router

Với Next.js App Router, hãy đảm bảo sử dụng `'use client'` directive cho components sử dụng XHubReel:

```tsx title="app/feed/page.tsx"
'use client'

import { XHubReelEmbed } from '@xhub-reel/embed'

export default function FeedPage() {
  return <XHubReelEmbed videos={videos} />
}
```

## Xác minh cài đặt

Tạo một component đơn giản để kiểm tra:

```tsx title="TestXHubReel.tsx"
import { VideoPlayer } from '@xhub-reel/player'

export function TestXHubReel() {
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

### "Cannot find module '@xhub-reel/xxx'"

Đảm bảo bạn đã cài đặt tất cả peer dependencies và restart development server.

### "Hydration mismatch" (Next.js)

Video player cần chạy client-side. Thêm `'use client'` vào đầu file hoặc sử dụng dynamic import:

```tsx
import dynamic from 'next/dynamic'

const VideoPlayer = dynamic(
  () => import('@xhub-reel/player').then((mod) => mod.VideoPlayer),
  { ssr: false }
)
```

### HLS không hoạt động trên Safari

Safari hỗ trợ native HLS, nhưng cần đảm bảo video source là file `.m3u8` hợp lệ.

## Bước tiếp theo

- [Quick Start](/docs/getting-started/quick-start) - Tạo video feed đầu tiên
- [Project Structure](/docs/getting-started/project-structure) - Hiểu cấu trúc packages

