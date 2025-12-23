---
sidebar_position: 1
---

# Basic Feed

Ví dụ tạo video feed cơ bản.

## Code

```tsx
import { VortexEmbed } from '@vortex/embed'
import type { Video } from '@vortex/core'

const videos: Video[] = [
  {
    id: '1',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    hlsUrl: 'https://test-streams.mux.dev/x36xhzz/x36xhzz.m3u8',
    thumbnail: 'https://images.unsplash.com/photo-1611162616475-46b635cb6868',
    author: {
      id: 'user1',
      username: 'bunny_studios',
      displayName: 'Bunny Studios',
      avatar: 'https://i.pravatar.cc/150?u=user1',
      verified: true,
    },
    caption: 'Big Buck Bunny 🐰 #animation #opensource',
    hashtags: ['animation', 'opensource'],
    stats: {
      views: 1500000,
      likes: 89000,
      comments: 3400,
      shares: 12000,
    },
    duration: 596,
    createdAt: '2024-01-15T10:30:00Z',
  },
  {
    id: '2',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4',
    thumbnail: 'https://images.unsplash.com/photo-1574375927938-d5a98e8ffe85',
    author: {
      id: 'user2',
      username: 'orange_studios',
      displayName: 'Orange Studios',
      avatar: 'https://i.pravatar.cc/150?u=user2',
    },
    caption: 'Elephants Dream - Blender Foundation 🎬',
    stats: {
      views: 800000,
      likes: 45000,
      comments: 1200,
      shares: 5000,
    },
    duration: 653,
    createdAt: '2024-01-10T08:00:00Z',
  },
]

export default function BasicFeed() {
  return (
    <div className="h-screen w-screen bg-black">
      <VortexEmbed
        videos={videos}
        config={{
          autoPlay: true,
          muted: true,
          showControls: true,
          showActions: true,
          showOverlay: true,
        }}
        onVideoChange={(video) => {
          console.log('Now playing:', video.id)
        }}
        onLike={(videoId) => {
          console.log('Liked:', videoId)
        }}
      />
    </div>
  )
}
```

## Kết quả

- Video feed với scroll dọc
- Video tự động phát khi visible > 50%
- UI overlay với author info và caption
- Action buttons (like, comment, share)
- Gesture support

## Tùy chỉnh

### Ẩn controls

```tsx
<VortexEmbed
  videos={videos}
  config={{
    showControls: false,  // Ẩn seek bar, volume
    showActions: true,    // Giữ action buttons
  }}
/>
```

### Ẩn overlay

```tsx
<VortexEmbed
  videos={videos}
  config={{
    showOverlay: false,  // Ẩn author info, caption
  }}
/>
```

### Custom accent color

```tsx
<VortexEmbed
  videos={videos}
  config={{
    accentColor: '#FF6B00',  // Orange thay vì violet
  }}
/>
```

