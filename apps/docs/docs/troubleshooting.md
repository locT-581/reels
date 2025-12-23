---
sidebar_position: 10
---

# Troubleshooting

Các vấn đề thường gặp và cách giải quyết.

## Video không tự động phát

### Nguyên nhân
Browsers modern yêu cầu video phải muted để autoplay.

### Giải pháp
```tsx
<VortexEmbed
  videos={videos}
  config={{
    autoPlay: true,
    muted: true,  // Bắt buộc cho autoplay
  }}
/>
```

---

## HLS không hoạt động

### Nguyên nhân
- URL không phải HLS manifest hợp lệ
- CORS issues
- Safari sử dụng native HLS

### Giải pháp

1. **Kiểm tra URL:**
```tsx
// URL phải kết thúc bằng .m3u8
const video = {
  hlsUrl: 'https://example.com/video.m3u8',  // ✅
  // NOT: 'https://example.com/video'        // ❌
}
```

2. **CORS:**
```
# Server cần set headers
Access-Control-Allow-Origin: *
Access-Control-Allow-Methods: GET
```

3. **Debug HLS:**
```tsx
<VideoPlayer
  src="..."
  hlsConfig={{
    debug: true,  // Enable HLS.js debug logs
  }}
/>
```

---

## Hydration mismatch (Next.js)

### Nguyên nhân
Video player cần render client-side only.

### Giải pháp

1. **Thêm 'use client':**
```tsx
'use client'

import { VortexEmbed } from '@vortex/embed'
```

2. **Dynamic import:**
```tsx
import dynamic from 'next/dynamic'

const VortexEmbed = dynamic(
  () => import('@vortex/embed').then((m) => m.VortexEmbed),
  { ssr: false }
)
```

---

## Cannot find module '@vortex/xxx'

### Nguyên nhân
- Chưa cài đặt đầy đủ packages
- Transpile config sai

### Giải pháp

1. **Cài đặt packages:**
```bash
npm install @vortex/embed
npm install react react-dom hls.js motion lucide-react @tanstack/react-virtual @use-gesture/react zustand
```

2. **next.config.js:**
```js
module.exports = {
  transpilePackages: [
    '@vortex/core',
    '@vortex/player',
    '@vortex/ui',
    '@vortex/gestures',
    '@vortex/feed',
    '@vortex/embed',
  ],
}
```

---

## Video bị giật khi scroll

### Nguyên nhân
- Quá nhiều video trong DOM
- Memory leak
- Animation không optimized

### Giải pháp

1. **Giảm videos in DOM:**
```tsx
<VortexEmbed
  videos={videos}
  config={{
    maxVideosInDOM: 3,  // Giảm từ 5 xuống 3
  }}
/>
```

2. **Disable animations nếu cần:**
```tsx
// Check prefers-reduced-motion
const prefersReducedMotion = window.matchMedia(
  '(prefers-reduced-motion: reduce)'
).matches
```

---

## Memory leak

### Triệu chứng
- App chậm dần sau khi scroll nhiều
- Browser tab crash

### Giải pháp

1. **Monitor memory:**
```tsx
useEffect(() => {
  const interval = setInterval(() => {
    if (performance.memory) {
      console.log('Memory:', performance.memory.usedJSHeapSize / 1024 / 1024, 'MB')
    }
  }, 5000)
  return () => clearInterval(interval)
}, [])
```

2. **Force cleanup:**
```tsx
import { cleanupMemory } from '@vortex/core'

// Cleanup periodically
useEffect(() => {
  const interval = setInterval(() => {
    cleanupMemory({ keepCurrent: true, keepNext: 1 })
  }, 30000)
  return () => clearInterval(interval)
}, [])
```

---

## Gestures không hoạt động

### Nguyên nhân
- Touch events bị block
- Conflicting event handlers

### Giải pháp

1. **Kiểm tra CSS:**
```css
/* Remove touch-action restrictions */
.video-container {
  touch-action: pan-y;  /* Allow vertical scroll */
}
```

2. **Spread bind props đúng:**
```tsx
const bind = useVideoGestures({...})

// ✅ Correct
<div {...bind()}>

// ❌ Wrong
<div {...bind}>
```

---

## Double tap không nhận

### Nguyên nhân
- Double tap delay quá ngắn
- Single tap handler đang block

### Giải pháp
```tsx
const bind = useTapGestures({
  onSingleTap: handleTap,
  onDoubleTap: handleDoubleTap,
  doubleTapDelay: 300,  // Tăng nếu cần
})
```

---

## Video chất lượng kém

### Nguyên nhân
- ABR chọn quality thấp
- Mạng chậm

### Giải pháp

1. **Force quality:**
```tsx
<VideoPlayer
  src="..."
  hlsConfig={{
    startLevel: 2,  // Start with higher quality
    abrBandWidthUpFactor: 0.9,  // More aggressive quality up
  }}
/>
```

2. **Manual quality selection:**
```tsx
const { setQuality } = usePlayer()

<button onClick={() => setQuality('720p')}>
  720p
</button>
```

---

## Safari-specific issues

### Video không phát

Safari yêu cầu user interaction trước khi phát video với audio.

```tsx
// Trigger play on first interaction
document.addEventListener('click', () => {
  videoElement.play()
}, { once: true })
```

### HLS issues

Safari dùng native HLS, có thể có behavior khác:

```tsx
import { isSafari, supportsHLS } from '@vortex/core'

if (isSafari() && supportsHLS()) {
  // Safari handles HLS natively
  // No need for hls.js
}
```

---

## TypeScript errors

### Type không match

```tsx
// Import types explicitly
import type { Video, Author, EmbedConfig } from '@vortex/core'

const video: Video = {
  // All required fields
}

const config: EmbedConfig = {
  autoPlay: true,
}
```

---

## Debug mode

Enable debug logging:

```tsx
// In development
if (process.env.NODE_ENV === 'development') {
  localStorage.setItem('vortex:debug', 'true')
}
```

Check console for `[Vortex]` prefixed logs.

