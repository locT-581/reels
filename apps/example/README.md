# VortexStream Example App

Ứng dụng example đơn giản showcase các tính năng cốt lõi của VortexStream - nền tảng video ngắn mobile-first.

## 🚀 Quick Start

```bash
# Từ thư mục root của monorepo
pnpm install
pnpm build

# Chạy example app
cd apps/example
pnpm dev
```

Mở [http://localhost:3001](http://localhost:3001) trên trình duyệt.

## 📱 Demo Features

### Video Feed

| Gesture | Hành động |
|---------|-----------|
| **Tap** | Play/Pause video |
| **Double Tap (Center/Right)** | Like với animation trái tim |
| **Swipe Up** | Chuyển sang video tiếp theo |
| **Swipe Down** | Quay lại video trước |

### UI Components
- ❤️ **Like Button** - Toggle like với animation
- 💬 **Comment Button** - Placeholder cho comment sheet  
- 🔖 **Save Button** - Lưu video yêu thích
- 📤 **Share Button** - Placeholder cho share sheet
- 🎵 **Sound Info** - Thông tin nhạc/âm thanh
- 🔇 **Mute Toggle** - Bật/tắt âm thanh

## 🎨 Design System

### Colors
```css
--color-accent: #8B5CF6    /* Electric Violet */
--color-like: #FF2D55      /* Like Red */
--color-background: #000   /* OLED Black */
```

## 📦 Packages Sử dụng

| Package | Mô tả |
|---------|-------|
| `@vortex/core` | Types, stores, hooks, utils |
| `@vortex/player` | HLS video player |
| `@vortex/ui` | UI components |
| `@vortex/gestures` | Touch gesture handlers |

## 🔧 Tech Stack

- **Framework**: Next.js 15 (App Router)
- **Language**: TypeScript 5.x  
- **Styling**: Tailwind CSS 4
- **Animation**: Motion (motion.dev)
- **State**: Zustand + TanStack Query
- **Video**: Native + HLS.js
- **Gestures**: @use-gesture/react

## 📁 Cấu trúc

```
apps/example/
├── app/
│   ├── data/
│   │   ├── mock-videos.ts     # Mock video data
│   │   └── mock-comments.ts   # Mock comment data  
│   ├── globals.css            # Global styles
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Main video feed
│   └── providers.tsx          # React Query provider
├── package.json
├── tailwind.config.ts
└── tsconfig.json
```

## 📱 Test trên Mobile

1. Chạy `pnpm dev`
2. Tìm Local IP (ví dụ: 192.168.1.100)
3. Mở `http://192.168.1.100:3001` trên điện thoại
4. Hoặc sử dụng Chrome DevTools → Device Mode

## 🐛 Troubleshooting

### Video không load
- Kiểm tra network connection
- HLS streams cần CORS headers
- Xem console log để debug

### Gestures không hoạt động
- Đảm bảo `touch-none` class trên container
- Check gesture handlers được spread đúng
