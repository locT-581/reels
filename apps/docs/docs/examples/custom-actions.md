---
sidebar_position: 3
---

# Custom Actions

Ví dụ tùy biến action buttons.

## Custom Action Bar

```tsx
import { VideoFeed, VideoFeedItem } from '@vortex/feed'
import { Heart, MessageCircle, Share2, Bookmark, MoreHorizontal } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

export default function CustomActionsFeed({ videos }) {
  return (
    <VideoFeed videos={videos}>
      {(video, index, isActive) => (
        <VideoFeedItem video={video} isActive={isActive}>
          <CustomActionBar video={video} />
        </VideoFeedItem>
      )}
    </VideoFeed>
  )
}

function CustomActionBar({ video }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)
  const [likeCount, setLikeCount] = useState(video.stats.likes)

  const handleLike = async () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    // await api.likeVideo(video.id)
  }

  return (
    <div className="absolute right-4 bottom-32 flex flex-col gap-5">
      {/* Like */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={handleLike}
        className="flex flex-col items-center"
      >
        <motion.div
          animate={{
            scale: isLiked ? [1, 1.3, 1] : 1,
          }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
        >
          <Heart
            className={`w-8 h-8 ${
              isLiked 
                ? 'fill-[#FF2D55] text-[#FF2D55]' 
                : 'text-white'
            }`}
          />
        </motion.div>
        <span className="text-white text-xs mt-1">
          {formatCount(likeCount)}
        </span>
      </motion.button>

      {/* Comment */}
      <button className="flex flex-col items-center">
        <MessageCircle className="w-8 h-8 text-white" />
        <span className="text-white text-xs mt-1">
          {formatCount(video.stats.comments)}
        </span>
      </button>

      {/* Share */}
      <button className="flex flex-col items-center">
        <Share2 className="w-8 h-8 text-white" />
        <span className="text-white text-xs mt-1">
          {formatCount(video.stats.shares)}
        </span>
      </button>

      {/* Save */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => setIsSaved(!isSaved)}
        className="flex flex-col items-center"
      >
        <Bookmark
          className={`w-8 h-8 ${
            isSaved 
              ? 'fill-[#8B5CF6] text-[#8B5CF6]' 
              : 'text-white'
          }`}
        />
      </motion.button>

      {/* More */}
      <button className="flex flex-col items-center">
        <MoreHorizontal className="w-8 h-8 text-white" />
      </button>
    </div>
  )
}

function formatCount(num: number) {
  if (num >= 1000000) return (num / 1000000).toFixed(1) + 'M'
  if (num >= 1000) return (num / 1000).toFixed(1) + 'K'
  return num.toString()
}
```

## With Follow Button

```tsx
function ActionBarWithFollow({ video, author }) {
  const [isFollowing, setIsFollowing] = useState(false)

  return (
    <div className="absolute right-4 bottom-32 flex flex-col gap-5">
      {/* Author avatar with follow */}
      <div className="relative">
        <img
          src={author.avatar}
          className="w-12 h-12 rounded-full border-2 border-white"
        />
        {!isFollowing && (
          <button
            onClick={() => setIsFollowing(true)}
            className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-6 h-6 bg-[#FF2D55] rounded-full flex items-center justify-center"
          >
            <span className="text-white text-lg font-bold">+</span>
          </button>
        )}
      </div>

      {/* Other actions */}
      {/* ... */}
    </div>
  )
}
```

## Horizontal Actions

```tsx
function HorizontalActions({ video }) {
  return (
    <div className="absolute bottom-4 left-0 right-0 px-4">
      <div className="flex items-center justify-around bg-black/50 backdrop-blur-sm rounded-full py-3">
        <button className="flex items-center gap-2">
          <Heart className="w-6 h-6" />
          <span>{formatCount(video.stats.likes)}</span>
        </button>
        
        <button className="flex items-center gap-2">
          <MessageCircle className="w-6 h-6" />
          <span>{formatCount(video.stats.comments)}</span>
        </button>
        
        <button className="flex items-center gap-2">
          <Share2 className="w-6 h-6" />
          <span>Share</span>
        </button>
      </div>
    </div>
  )
}
```

