---
sidebar_position: 2
---

# Quick Start

Tạo video feed đầu tiên của bạn trong 5 phút.

## Bước 1: Chuẩn bị dữ liệu video

VortexStream sử dụng kiểu `Video` được định nghĩa trong `@vortex/core`:

```tsx title="data/videos.ts"
import type { Video } from '@vortex/core'

export const videos: Video[] = [
  {
    id: '1',
    url: 'https://example.com/video1.mp4',
    hlsUrl: 'https://example.com/video1.m3u8', // HLS stream (khuyến nghị)
    thumbnail: 'https://example.com/thumb1.jpg',
    author: {
      id: 'user1',
      username: 'creator1',
      displayName: 'Creator One',
      avatar: 'https://example.com/avatar1.jpg',
      verified: true,
      followers: 10000,
      following: 100,
    },
    caption: 'Video đầu tiên của tôi! 🎉 #trending #viral',
    hashtags: ['trending', 'viral'],
    stats: {
      views: 50000,
      likes: 5000,
      comments: 500,
      shares: 100,
      saves: 50,
    },
    duration: 30,
    createdAt: new Date().toISOString(),
  },
  {
    id: '2',
    url: 'https://example.com/video2.mp4',
    hlsUrl: 'https://example.com/video2.m3u8',
    thumbnail: 'https://example.com/thumb2.jpg',
    author: {
      id: 'user2',
      username: 'creator2',
      displayName: 'Creator Two',
      avatar: 'https://example.com/avatar2.jpg',
    },
    caption: 'Tutorial hay nè! 📚',
    stats: {
      views: 25000,
      likes: 2500,
      comments: 200,
      shares: 50,
      saves: 100,
    },
    duration: 45,
    createdAt: new Date().toISOString(),
  },
  // Thêm videos khác...
]
```

## Bước 2: Tạo Video Feed

### Cách 1: Sử dụng VortexEmbed (Đơn giản nhất)

```tsx title="app/page.tsx"
'use client'

import { VortexEmbed } from '@vortex/embed'
import { videos } from './data/videos'

export default function HomePage() {
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
          // Call API để like video
        }}
        onComment={(videoId) => {
          console.log('Open comments:', videoId)
          // Mở comment sheet
        }}
        onShare={(videoId) => {
          console.log('Share:', videoId)
          // Mở share options
        }}
      />
    </div>
  )
}
```

### Cách 2: Sử dụng VideoFeed (Tùy biến cao hơn)

```tsx title="app/feed/page.tsx"
'use client'

import { VideoFeed } from '@vortex/feed'
import { videos } from '../data/videos'

export default function FeedPage() {
  const handleEndReached = () => {
    console.log('Load more videos')
    // Fetch thêm videos
  }

  const handleRefresh = async () => {
    console.log('Refreshing feed')
    // Refresh data
  }

  return (
    <div className="h-screen w-screen bg-black">
      <VideoFeed
        videos={videos}
        onVideoChange={(video, index) => {
          console.log(`Playing video ${index}: ${video.id}`)
        }}
        onEndReached={handleEndReached}
        endReachedThreshold={3}
        onRefresh={handleRefresh}
        preloadCount={2}
      />
    </div>
  )
}
```

### Cách 3: Sử dụng VideoPlayer đơn lẻ

```tsx title="app/video/[id]/page.tsx"
'use client'

import { VideoPlayer } from '@vortex/player'
import { videos } from '../../data/videos'

export default function VideoPage({ params }: { params: { id: string } }) {
  const video = videos.find(v => v.id === params.id)

  if (!video) {
    return <div>Video not found</div>
  }

  return (
    <div className="h-screen w-screen bg-black">
      <VideoPlayer
        video={video}
        autoPlay
        muted
        controls
        onEnded={() => console.log('Video ended')}
        onProgress={(time, duration) => {
          console.log(`Progress: ${time}/${duration}`)
        }}
      />
    </div>
  )
}
```

## Bước 3: Thêm Gestures

Kích hoạt gesture để có trải nghiệm như TikTok:

```tsx title="components/VideoWithGestures.tsx"
'use client'

import { VideoPlayer } from '@vortex/player'
import { useVideoGestures } from '@vortex/gestures'
import { DoubleTapHeart } from '@vortex/ui'
import { useState, useRef } from 'react'

export function VideoWithGestures({ video }) {
  const [showHeart, setShowHeart] = useState(false)
  const [isPlaying, setIsPlaying] = useState(true)
  const playerRef = useRef(null)

  const bind = useVideoGestures({
    onSingleTap: (zone) => {
      if (zone === 'center') {
        setIsPlaying(!isPlaying)
      }
    },
    onDoubleTap: (zone) => {
      if (zone === 'center') {
        // Like video
        setShowHeart(true)
        handleLike(video.id)
      } else if (zone === 'left') {
        // Seek backward
        playerRef.current?.seek(-10)
      } else if (zone === 'right') {
        // Seek forward
        playerRef.current?.seek(10)
      }
    },
    onLongPress: () => {
      // Show context menu
      console.log('Long press - show menu')
    },
  })

  return (
    <div {...bind()} className="relative h-full w-full">
      <VideoPlayer
        ref={playerRef}
        video={video}
        autoPlay={isPlaying}
        muted
      />
      
      {showHeart && (
        <DoubleTapHeart onComplete={() => setShowHeart(false)} />
      )}
    </div>
  )
}
```

## Bước 4: Thêm UI Components

```tsx title="components/VideoOverlay.tsx"
'use client'

import {
  LikeButton,
  CommentButton,
  ShareButton,
  SaveButton,
  Avatar,
  Text,
} from '@vortex/ui'

export function VideoOverlay({ video, onLike, onComment, onShare, onSave }) {
  return (
    <>
      {/* Author info - bottom left */}
      <div className="absolute bottom-20 left-4 z-10">
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            src={video.author.avatar}
            alt={video.author.displayName}
            size="md"
          />
          <div>
            <Text variant="body" videoSafe className="font-semibold">
              @{video.author.username}
            </Text>
            {video.author.verified && (
              <span className="text-vortex-violet">✓</span>
            )}
          </div>
        </div>
        <Text variant="body" videoSafe className="max-w-[70%]">
          {video.caption}
        </Text>
      </div>

      {/* Action buttons - right side */}
      <div className="absolute right-4 bottom-32 flex flex-col gap-6 z-10">
        <LikeButton
          count={video.stats.likes}
          isLiked={false}
          onLike={() => onLike(video.id)}
        />
        <CommentButton
          count={video.stats.comments}
          onClick={() => onComment(video.id)}
        />
        <ShareButton
          count={video.stats.shares}
          onShare={() => onShare(video.id)}
        />
        <SaveButton
          isSaved={false}
          onSave={() => onSave(video.id)}
        />
      </div>
    </>
  )
}
```

## Bước 5: Tích hợp với API

### Sử dụng TanStack Query

```tsx title="hooks/useVideos.ts"
import { useInfiniteQuery } from '@tanstack/react-query'

export function useVideos() {
  return useInfiniteQuery({
    queryKey: ['videos'],
    queryFn: async ({ pageParam = 0 }) => {
      const response = await fetch(`/api/videos?cursor=${pageParam}`)
      return response.json()
    },
    getNextPageParam: (lastPage) => lastPage.nextCursor,
    initialPageParam: 0,
  })
}
```

```tsx title="app/feed/page.tsx"
'use client'

import { VideoFeed } from '@vortex/feed'
import { useVideos } from '../hooks/useVideos'

export default function FeedPage() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
  } = useVideos()

  const videos = data?.pages.flatMap(page => page.videos) ?? []

  if (isLoading) {
    return <div className="h-screen bg-black" />
  }

  return (
    <VideoFeed
      videos={videos}
      onEndReached={() => {
        if (hasNextPage && !isFetchingNextPage) {
          fetchNextPage()
        }
      }}
    />
  )
}
```

## Kết quả

Bây giờ bạn đã có một video feed hoạt động với:
- ✅ Video player với HLS streaming
- ✅ Infinite scroll virtualized
- ✅ Gesture support (tap, double-tap, swipe)
- ✅ UI components (like, comment, share)
- ✅ Integration với API

## Bước tiếp theo

- [Custom UI](/docs/guides/custom-ui) - Tùy biến giao diện
- [Gestures](/docs/guides/gestures) - Cấu hình gesture
- [Performance](/docs/guides/performance) - Tối ưu hiệu suất
- [Offline Support](/docs/guides/offline-support) - Hỗ trợ offline

