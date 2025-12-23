---
sidebar_position: 3
---

# Custom UI

Tùy biến giao diện VortexStream theo thiết kế của bạn.

## Tổng quan

VortexStream cho phép bạn tùy biến:

- 🎨 Colors và theme
- 📐 Layout và positioning
- 🔘 Action buttons
- 📝 Video info overlay
- 🎬 Player controls
- 📜 Comment và share sheets

## Sử dụng các packages riêng lẻ

Thay vì dùng `VortexEmbed`, bạn có thể compose UI từ các components nhỏ hơn:

```tsx
import { VideoFeed, VideoFeedItem } from '@vortex/feed'
import { VideoPlayer } from '@vortex/player'
import { useVideoGestures } from '@vortex/gestures'
import { LikeButton, Avatar, Text } from '@vortex/ui'

function CustomVideoFeed({ videos }) {
  return (
    <VideoFeed videos={videos}>
      {(video, index, isActive) => (
        <CustomVideoItem 
          video={video} 
          isActive={isActive} 
        />
      )}
    </VideoFeed>
  )
}

function CustomVideoItem({ video, isActive }) {
  const bind = useVideoGestures({
    onDoubleTap: (zone) => {
      if (zone === 'center') handleLike()
    },
  })

  return (
    <div {...bind()} className="relative h-full w-full">
      <VideoPlayer
        video={video}
        autoPlay={isActive}
        muted
      />
      
      {/* Custom overlay */}
      <CustomOverlay video={video} />
      
      {/* Custom actions */}
      <CustomActions video={video} />
    </div>
  )
}
```

## Custom Video Overlay

```tsx
import { Avatar, Text, Counter } from '@vortex/ui'
import { Music } from 'lucide-react'

function CustomOverlay({ video }) {
  return (
    <div className="absolute inset-0 pointer-events-none">
      {/* Author info - bottom left */}
      <div className="absolute bottom-20 left-4 pointer-events-auto">
        <div className="flex items-center gap-3 mb-3">
          <Avatar
            src={video.author.avatar}
            alt={video.author.displayName}
            size="md"
            showVerified={video.author.verified}
          />
          <div>
            <Text variant="body" videoSafe className="font-bold">
              @{video.author.username}
            </Text>
          </div>
          <button className="px-3 py-1 bg-red-500 rounded-lg text-sm">
            Follow
          </button>
        </div>
        
        {/* Caption */}
        <Text 
          variant="body" 
          videoSafe 
          truncate 
          lines={2}
          className="max-w-[70%]"
        >
          {video.caption}
        </Text>
        
        {/* Hashtags */}
        <div className="flex gap-2 mt-2">
          {video.hashtags?.map(tag => (
            <span 
              key={tag}
              className="text-vortex-violet text-sm"
            >
              #{tag}
            </span>
          ))}
        </div>
        
        {/* Music */}
        {video.music && (
          <div className="flex items-center gap-2 mt-3">
            <Music className="w-4 h-4 text-white animate-spin-slow" />
            <marquee className="text-sm text-white max-w-[200px]">
              {video.music.name} - {video.music.artist}
            </marquee>
          </div>
        )}
      </div>
    </div>
  )
}
```

## Custom Action Buttons

```tsx
import { Heart, MessageCircle, Share2, Bookmark } from 'lucide-react'
import { Counter } from '@vortex/ui'
import { motion } from 'motion/react'

function CustomActions({ video, onLike, onComment, onShare, onSave }) {
  const [isLiked, setIsLiked] = useState(false)
  const [isSaved, setIsSaved] = useState(false)

  return (
    <div className="absolute right-4 bottom-32 flex flex-col gap-5">
      {/* Like */}
      <motion.button
        whileTap={{ scale: 0.9 }}
        onClick={() => {
          setIsLiked(!isLiked)
          onLike(video.id)
        }}
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
        <Counter 
          value={video.stats.likes + (isLiked ? 1 : 0)} 
          className="text-white text-xs mt-1"
        />
      </motion.button>

      {/* Comment */}
      <button
        onClick={() => onComment(video.id)}
        className="flex flex-col items-center"
      >
        <MessageCircle className="w-8 h-8 text-white" />
        <Counter 
          value={video.stats.comments} 
          className="text-white text-xs mt-1"
        />
      </button>

      {/* Share */}
      <button
        onClick={() => onShare(video.id)}
        className="flex flex-col items-center"
      >
        <Share2 className="w-8 h-8 text-white" />
        <Counter 
          value={video.stats.shares} 
          className="text-white text-xs mt-1"
        />
      </button>

      {/* Save */}
      <button
        onClick={() => {
          setIsSaved(!isSaved)
          onSave(video.id)
        }}
        className="flex flex-col items-center"
      >
        <Bookmark
          className={`w-8 h-8 ${
            isSaved 
              ? 'fill-vortex-violet text-vortex-violet' 
              : 'text-white'
          }`}
        />
      </button>
    </div>
  )
}
```

## Custom Player Controls

```tsx
import { VideoPlayer, usePlayer } from '@vortex/player'
import { Play, Pause, Volume2, VolumeX } from 'lucide-react'
import { motion, AnimatePresence } from 'motion/react'

function CustomPlayerControls() {
  const {
    isPlaying,
    isMuted,
    currentTime,
    duration,
    togglePlay,
    toggleMute,
    seek,
  } = usePlayer()

  const [showControls, setShowControls] = useState(false)

  return (
    <div 
      className="absolute inset-0"
      onClick={() => setShowControls(!showControls)}
    >
      <AnimatePresence>
        {showControls && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/30 flex items-center justify-center"
          >
            {/* Center play/pause */}
            <button
              onClick={(e) => {
                e.stopPropagation()
                togglePlay()
              }}
              className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center backdrop-blur-sm"
            >
              {isPlaying ? (
                <Pause className="w-8 h-8 text-white" />
              ) : (
                <Play className="w-8 h-8 text-white ml-1" />
              )}
            </button>

            {/* Bottom controls */}
            <div className="absolute bottom-0 left-0 right-0 p-4">
              {/* Progress bar */}
              <div className="relative h-1 bg-white/30 rounded-full mb-4">
                <div
                  className="absolute h-full bg-white rounded-full"
                  style={{ width: `${(currentTime / duration) * 100}%` }}
                />
                <input
                  type="range"
                  min={0}
                  max={duration}
                  value={currentTime}
                  onChange={(e) => seek(Number(e.target.value))}
                  className="absolute inset-0 w-full opacity-0 cursor-pointer"
                />
              </div>

              <div className="flex items-center justify-between">
                {/* Time */}
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>

                {/* Volume */}
                <button onClick={toggleMute}>
                  {isMuted ? (
                    <VolumeX className="w-6 h-6 text-white" />
                  ) : (
                    <Volume2 className="w-6 h-6 text-white" />
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

function formatTime(seconds: number) {
  const m = Math.floor(seconds / 60)
  const s = Math.floor(seconds % 60)
  return `${m}:${s.toString().padStart(2, '0')}`
}
```

## Custom Theme

### CSS Variables

```css
:root {
  /* Override Vortex colors */
  --vortex-violet: #FF6B00;      /* Orange instead of violet */
  --vortex-violet-light: #FF8533;
  --vortex-violet-dark: #CC5500;
  --vortex-like: #FF0000;
  
  /* Custom colors */
  --app-background: #0A0A0A;
  --app-surface: #1A1A1A;
  --app-border: #2A2A2A;
}

/* Dark mode specific */
[data-theme='dark'] {
  --vortex-violet: #FF6B00;
}
```

### ThemeProvider

```tsx
import { ThemeProvider } from '@vortex/ui'

function App() {
  return (
    <ThemeProvider
      theme={{
        colors: {
          primary: '#FF6B00',
          like: '#FF0000',
          background: '#0A0A0A',
        },
        animation: {
          spring: { stiffness: 500, damping: 35 },
          duration: { fast: 100, normal: 200, slow: 400 },
        },
        borderRadius: {
          sm: '8px',
          md: '12px',
          lg: '16px',
        },
      }}
    >
      <VideoFeed />
    </ThemeProvider>
  )
}
```

## Custom Comment Sheet

```tsx
import { BottomSheet } from '@vortex/ui'
import { useState } from 'react'

function CustomCommentSheet({ isOpen, onClose, videoId, comments }) {
  const [newComment, setNewComment] = useState('')

  return (
    <BottomSheet
      isOpen={isOpen}
      onClose={onClose}
      height="60%"
      maxHeight="90%"
    >
      <div className="flex flex-col h-full">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-gray-800">
          <h2 className="text-white font-semibold">
            {comments.length} bình luận
          </h2>
          <button onClick={onClose} className="text-gray-400">
            ✕
          </button>
        </div>

        {/* Comments list */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {comments.map((comment) => (
            <div key={comment.id} className="flex gap-3">
              <img
                src={comment.author.avatar}
                className="w-8 h-8 rounded-full"
              />
              <div>
                <p className="text-white text-sm font-medium">
                  @{comment.author.username}
                </p>
                <p className="text-gray-300 text-sm">{comment.content}</p>
                <div className="flex gap-4 mt-1 text-xs text-gray-500">
                  <span>{comment.timeAgo}</span>
                  <button>Trả lời</button>
                  <button>❤️ {comment.likes}</button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Input */}
        <div className="p-4 border-t border-gray-800">
          <div className="flex gap-2">
            <input
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              placeholder="Thêm bình luận..."
              className="flex-1 bg-gray-800 text-white px-4 py-2 rounded-full text-sm"
            />
            <button
              disabled={!newComment.trim()}
              className="px-4 py-2 bg-vortex-violet text-white rounded-full text-sm disabled:opacity-50"
            >
              Gửi
            </button>
          </div>
        </div>
      </div>
    </BottomSheet>
  )
}
```

## Layout Variants

### Full screen (default)

```tsx
<div className="h-screen w-screen">
  <VortexEmbed videos={videos} />
</div>
```

### With navigation bar

```tsx
<div className="h-screen flex flex-col">
  {/* Custom nav */}
  <nav className="h-14 bg-black border-b border-gray-800 flex items-center px-4">
    <h1 className="text-white font-bold">My App</h1>
  </nav>
  
  {/* Video feed */}
  <div className="flex-1">
    <VortexEmbed videos={videos} />
  </div>
</div>
```

### Split view (tablet/desktop)

```tsx
<div className="h-screen flex">
  {/* Sidebar */}
  <aside className="w-64 bg-gray-900 border-r border-gray-800 hidden md:block">
    <nav>{/* Navigation items */}</nav>
  </aside>
  
  {/* Main content */}
  <main className="flex-1 max-w-[500px] mx-auto">
    <VortexEmbed videos={videos} />
  </main>
  
  {/* Right panel */}
  <aside className="w-80 bg-gray-900 border-l border-gray-800 hidden lg:block">
    {/* Suggestions, trending, etc */}
  </aside>
</div>
```

