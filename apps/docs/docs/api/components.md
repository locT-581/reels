---
sidebar_position: 4
---

# Components

React components từ XHubReel.

## Video Components

### VideoPlayer

```tsx
import { VideoPlayer } from '@xhub-reel/player'

<VideoPlayer
  // Source
  src="https://example.com/video.m3u8"
  video={videoObject}
  poster="https://example.com/poster.jpg"
  
  // Playback
  autoPlay={true}
  muted={true}
  loop={false}
  playsInline={true}
  preload="metadata"
  
  // UI
  controls={true}
  
  // HLS Config
  hlsConfig={{
    maxBufferLength: 30,
    startLevel: -1,
  }}
  
  // Events
  onPlay={() => {}}
  onPause={() => {}}
  onEnded={() => {}}
  onProgress={(time, duration) => {}}
  onBuffering={(isBuffering) => {}}
  onError={(error) => {}}
  onQualityChange={(quality) => {}}
  onTimeUpdate={(time) => {}}
  onLoadedMetadata={(duration) => {}}
  onFirstFrame={() => {}}
/>
```

---

### VideoFeed

```tsx
import { VideoFeed } from '@xhub-reel/feed'

<VideoFeed
  // Data
  videos={videos}
  initialIndex={0}
  
  // Events
  onVideoChange={(video, index) => {}}
  onEndReached={() => {}}
  onRefresh={async () => {}}
  onLike={(videoId) => {}}
  onComment={(videoId) => {}}
  onShare={(videoId) => {}}
  
  // Config
  endReachedThreshold={3}
  preloadCount={2}
  
  // Styling
  className="h-screen"
/>
```

---

### XHubReelEmbed

```tsx
import { XHubReelEmbed } from '@xhub-reel/embed'

<XHubReelEmbed
  // Data
  videos={videos}
  
  // Sizing
  width="100%"
  height="100vh"
  
  // Config
  config={{
    autoPlay: true,
    muted: true,
    loop: false,
    showControls: true,
    showActions: true,
    showOverlay: true,
    theme: 'dark',
    accentColor: '#8B5CF6',
    preloadCount: 2,
  }}
  
  // Events
  onVideoChange={(video) => {}}
  onLike={(videoId) => {}}
  onComment={(videoId) => {}}
  onShare={(videoId) => {}}
  onSave={(videoId) => {}}
  onEndReached={() => {}}
  onError={(error) => {}}
  
  // Styling
  className=""
/>
```

---

## UI Components

### Button

```tsx
import { Button } from '@xhub-reel/ui'

<Button
  variant="primary"  // 'primary' | 'secondary' | 'ghost' | 'danger'
  size="md"         // 'sm' | 'md' | 'lg'
  loading={false}
  disabled={false}
  icon={<Icon />}
  onClick={() => {}}
>
  Button Text
</Button>
```

---

### IconButton

```tsx
import { IconButton } from '@xhub-reel/ui'
import { Heart } from 'lucide-react'

<IconButton
  icon={Heart}
  variant="ghost"      // 'ghost' | 'outline' | 'filled'
  size="md"            // 'sm' | 'md' | 'lg'
  count={1234}
  active={false}
  activeColor="#FF2D55"
  aria-label="Like"
  onClick={() => {}}
/>
```

---

### Avatar

```tsx
import { Avatar } from '@xhub-reel/ui'

<Avatar
  src="https://example.com/avatar.jpg"
  alt="Username"
  fallback="JD"
  size="md"             // 'sm' | 'md' | 'lg' | 'xl'
  showFollowRing={false}
  followRingColor="#8B5CF6"
  isLive={false}
  showVerified={false}
/>
```

---

### LikeButton

```tsx
import { LikeButton } from '@xhub-reel/ui'

<LikeButton
  count={5000}
  isLiked={false}
  onLike={() => {}}
  size="md"
  showAnimation={true}
/>
```

---

### CommentButton

```tsx
import { CommentButton } from '@xhub-reel/ui'

<CommentButton
  count={500}
  onClick={() => {}}
  size="md"
/>
```

---

### ShareButton

```tsx
import { ShareButton } from '@xhub-reel/ui'

<ShareButton
  count={100}
  onShare={() => {}}
  size="md"
/>
```

---

### SaveButton

```tsx
import { SaveButton } from '@xhub-reel/ui'

<SaveButton
  isSaved={false}
  onSave={() => {}}
  size="md"
/>
```

---

### Text

```tsx
import { Text } from '@xhub-reel/ui'

<Text
  variant="body"  // 'display' | 'title' | 'heading' | 'body' | 'caption' | 'small'
  videoSafe={true}
  truncate={true}
  lines={2}
  color="primary"
  className=""
>
  Text content
</Text>
```

---

### Counter

```tsx
import { Counter } from '@xhub-reel/ui'

<Counter
  value={1234}
  size="md"
  animated={true}
/>
// Renders: "1.2K"
```

---

### Modal

```tsx
import { Modal } from '@xhub-reel/ui'

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"  // 'sm' | 'md' | 'lg' | 'full'
>
  Modal content
</Modal>
```

---

### BottomSheet

```tsx
import { BottomSheet } from '@xhub-reel/ui'

<BottomSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  height="60%"
  maxHeight="90%"
  showDragHandle={true}
  enableSwipeToClose={true}
>
  Sheet content
</BottomSheet>
```

---

### CommentSheet

```tsx
import { CommentSheet } from '@xhub-reel/ui'

<CommentSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  videoId="video123"
  comments={comments}
  totalCount={500}
  onPostComment={async (content) => {}}
  onLikeComment={async (commentId) => {}}
  onLoadMore={async () => {}}
  isLoading={false}
/>
```

---

### ShareSheet

```tsx
import { ShareSheet } from '@xhub-reel/ui'

<ShareSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  video={video}
  shareUrl="https://xhubreel.app/v/123"
  onShare={(platform) => {}}
  onCopyLink={() => {}}
/>
```

---

### Skeleton

```tsx
import { Skeleton } from '@xhub-reel/ui'

<Skeleton
  variant="text"        // 'text' | 'circular' | 'rectangular' | 'video'
  className="w-48 h-4"
  animate={true}
/>
```

---

### DoubleTapHeart

```tsx
import { DoubleTapHeart } from '@xhub-reel/ui'

{showHeart && (
  <DoubleTapHeart
    x={tapPosition.x}
    y={tapPosition.y}
    size={120}
    color="#FF2D55"
    onComplete={() => setShowHeart(false)}
  />
)}
```

---

### PlayPauseOverlay

```tsx
import { PlayPauseOverlay } from '@xhub-reel/ui'

<PlayPauseOverlay
  isPlaying={isPlaying}
  show={showOverlay}
  onComplete={() => setShowOverlay(false)}
/>
```

---

## Gesture Components

### TapRipple

```tsx
import { TapRipple } from '@xhub-reel/gestures'

{showRipple && (
  <TapRipple
    x={tapX}
    y={tapY}
    color="rgba(255, 255, 255, 0.3)"
    duration={400}
    onComplete={() => setShowRipple(false)}
  />
)}
```

---

### GestureIndicator

```tsx
import { GestureIndicator } from '@xhub-reel/gestures'

<GestureIndicator
  direction="up"  // 'up' | 'down' | 'left' | 'right'
  progress={0.5}  // 0-1
  visible={isSwiping}
/>
```

---

### SeekIndicator

```tsx
import { SeekIndicator } from '@xhub-reel/gestures'

<SeekIndicator
  amount={10}       // +10 or -10 seconds
  side="right"      // 'left' | 'right'
/>
```

