---
sidebar_position: 1
slug: /
---

# XHubReel

> High-performance short-form video SDK cho React - Xây dựng trải nghiệm video như TikTok/Reels

## 🎯 Tổng quan

XHubReel là một bộ SDK modular giúp bạn tích hợp tính năng video ngắn (short-form video) vào ứng dụng React/Next.js của mình. Được thiết kế với triết lý **video-centric** và **mobile-first**, XHubReel mang đến trải nghiệm mượt mà, hiệu suất cao với bundle size tối thiểu.

## ✨ Tính năng chính

### 🎬 Video-Centric Design
- Video chiếm 100% viewport
- UI chỉ xuất hiện khi cần tương tác
- Nền OLED Black (#000000) tối ưu pin

### ⚡ Physics-First Animation
- Spring animations với Motion library
- Mọi chuyển động đều tự nhiên
- Easing: `cubic-bezier(0.32, 0.72, 0, 1)`

### 📱 Mobile-First
- Touch gesture đầy đủ
- Minimum tap area 48x48px
- Safe area support

### 🚀 High Performance
- Total bundle < 150KB gzip
- Time to First Frame < 500ms
- 60fps scrolling
- Lighthouse > 90

## 📦 Packages

| Package | Mô tả | Size |
|---------|-------|------|
| `@xhub-reel/core` | Types, stores, hooks, utilities | < 5KB |
| `@xhub-reel/player` | HLS video player | < 70KB |
| `@xhub-reel/feed` | Virtualized video feed | < 8KB |
| `@xhub-reel/gestures` | Gesture system | < 15KB |
| `@xhub-reel/ui` | UI components | < 15KB |
| `@xhub-reel/embed` | All-in-one embed | < 100KB |

## 🚀 Quick Start

### Cài đặt

```bash
# All-in-one package
npm install @xhub-reel/embed

# Hoặc các package riêng lẻ
npm install @xhub-reel/core @xhub-reel/player @xhub-reel/feed
```

### Sử dụng cơ bản

```tsx
import { XHubReelEmbed } from '@xhub-reel/embed'

function App() {
  const videos = [
    {
      id: '1',
      url: 'https://example.com/video.mp4',
      hlsUrl: 'https://example.com/video.m3u8',
      thumbnail: 'https://example.com/thumb.jpg',
      author: {
        id: 'user1',
        username: 'creator',
        displayName: 'Creator',
        avatar: 'https://example.com/avatar.jpg',
      },
      caption: 'Amazing video! 🎉',
      stats: { views: 10000, likes: 500, comments: 50 },
      duration: 30,
    },
    // ... more videos
  ]

  return (
    <div className="h-screen w-screen bg-black">
      <XHubReelEmbed
        videos={videos}
        config={{
          autoPlay: true,
          muted: true,
        }}
        onVideoChange={(video) => console.log('Playing:', video.id)}
        onLike={(videoId) => handleLike(videoId)}
      />
    </div>
  )
}
```

## 🎯 Use Cases

- **Social Media Apps**: Tính năng Reels/Stories
- **E-commerce**: Product video showcase
- **Education**: Short-form video lessons
- **Entertainment**: Video content platform
- **Marketing**: Promotional video feeds

## 📋 Yêu cầu hệ thống

- **React**: 18.0+
- **Node.js**: 18.0+
- **TypeScript**: 5.x (recommended)
- **Browsers**: Chrome 90+, Safari 15+, Firefox 90+

## 🔗 Links

- [GitHub Repository](https://github.com/xhubreel/xhubreel)
- [npm Packages](https://www.npmjs.com/org/xhub-reel)
- [Examples](https://github.com/xhubreel/xhubreel/tree/main/apps/example)

## 📄 License

MIT License - Tự do sử dụng trong dự án cá nhân và thương mại.

