---
sidebar_position: 5
---

# @xhub-reel/ui

UI components với XHubReel Design System.

## Cài đặt

```bash npm2yarn
npm install @xhub-reel/ui @xhub-reel/core motion lucide-react
```

## Tổng quan

`@xhub-reel/ui` cung cấp:

- 🎨 **XHubReel Design System** - Dark-first, video-centric
- ✨ **Motion Animations** - Spring physics, smooth transitions
- 📱 **Mobile-First** - Touch-optimized, 48px tap targets
- 🌙 **OLED Black** - #000000 backgrounds
- 💜 **Electric Violet** - #8B5CF6 accent color

## Design System

### Colors

| Color | Value | Usage |
|-------|-------|-------|
| `xhub-reel-black` | `#000000` | Background |
| `xhub-reel-violet` | `#8B5CF6` | Primary accent |
| `xhub-reel-violet-light` | `#A78BFA` | Hover states |
| `xhub-reel-like` | `#FF2D55` | Like button active |
| `xhub-reel-gray-*` | `#18181B` - `#F4F4F5` | Text, borders |

### Animation

```typescript
// Spring physics
const SPRING = {
  stiffness: 400,
  damping: 30,
}

// Default easing
const EASING = [0.32, 0.72, 0, 1]

// Durations
const DURATION = {
  fast: 150,
  normal: 300,
  slow: 500,
}
```

## Base Components

### Button

```tsx
import { Button } from '@xhub-reel/ui'

// Variants
<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>

// Sizes
<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>

// States
<Button loading>Loading...</Button>
<Button disabled>Disabled</Button>

// With icon
<Button icon={<PlayIcon />}>Play</Button>
```

### IconButton

```tsx
import { IconButton } from '@xhub-reel/ui'
import { Heart, Share2, MessageCircle } from 'lucide-react'

// Basic
<IconButton icon={Heart} aria-label="Like" />

// With counter
<IconButton icon={Heart} count={1234} aria-label="Like" />

// Active state
<IconButton 
  icon={Heart} 
  active 
  activeColor="#FF2D55"
  aria-label="Like"
/>

// Variants
<IconButton icon={Heart} variant="outline" />
<IconButton icon={Heart} variant="filled" />
<IconButton icon={Heart} variant="ghost" />
```

### Avatar

```tsx
import { Avatar } from '@xhub-reel/ui'

// With image
<Avatar 
  src="https://example.com/avatar.jpg" 
  alt="Username" 
/>

// With fallback
<Avatar fallback="John Doe" />
<Avatar fallback="JD" />

// Sizes
<Avatar size="sm" />  // 24px
<Avatar size="md" />  // 32px
<Avatar size="lg" />  // 48px
<Avatar size="xl" />  // 64px

// With follow ring
<Avatar showFollowRing followRingColor="#8B5CF6" />

// Live indicator
<Avatar isLive />

// Verified badge
<Avatar showVerified />
```

## Typography

### Text

```tsx
import { Text } from '@xhub-reel/ui'

// Variants
<Text variant="display">Display Text</Text>
<Text variant="title">Title Text</Text>
<Text variant="heading">Heading Text</Text>
<Text variant="body">Body text</Text>
<Text variant="caption">Caption text</Text>
<Text variant="small">Small text</Text>

// Video safe (with drop shadow)
<Text videoSafe>Text overlay on video</Text>

// Truncate
<Text truncate lines={2}>Long text that will be truncated...</Text>

// Colors
<Text color="primary">Primary colored</Text>
<Text color="secondary">Secondary colored</Text>
<Text color="muted">Muted text</Text>
```

### Counter

```tsx
import { Counter } from '@xhub-reel/ui'

// Auto format
<Counter value={1234} />    // "1.2K"
<Counter value={1000000} /> // "1M"
<Counter value={999} />     // "999"

// Sizes
<Counter value={1234} size="sm" />
<Counter value={1234} size="md" />
<Counter value={1234} size="lg" />

// Animated
<Counter value={likes} animated />
```

### Marquee

```tsx
import { Marquee } from '@xhub-reel/ui'

<Marquee speed={50} pauseOnHover>
  This text will scroll if it overflows the container
</Marquee>

// Music track display
<Marquee speed={30} gap={20}>
  <MusicIcon /> Original sound - Artist name
</Marquee>
```

## Interaction Components

### LikeButton

```tsx
import { LikeButton } from '@xhub-reel/ui'

function VideoActions({ video }) {
  const [isLiked, setIsLiked] = useState(false)
  const [likeCount, setLikeCount] = useState(video.stats.likes)

  const handleLike = async () => {
    setIsLiked(!isLiked)
    setLikeCount(prev => isLiked ? prev - 1 : prev + 1)
    await likeVideo(video.id)
  }

  return (
    <LikeButton
      count={likeCount}
      isLiked={isLiked}
      onLike={handleLike}
      size="lg"
      showAnimation
    />
  )
}
```

### CommentButton

```tsx
import { CommentButton } from '@xhub-reel/ui'

<CommentButton
  count={video.stats.comments}
  onClick={() => openCommentSheet(video.id)}
/>
```

### ShareButton

```tsx
import { ShareButton } from '@xhub-reel/ui'

<ShareButton
  count={video.stats.shares}
  onShare={() => openShareSheet(video.id)}
/>
```

### SaveButton

```tsx
import { SaveButton } from '@xhub-reel/ui'

<SaveButton
  isSaved={isSaved}
  onSave={() => toggleSave(video.id)}
/>
```

### FollowButton

```tsx
import { FollowButton } from '@xhub-reel/ui'

<FollowButton
  isFollowing={isFollowing}
  onFollow={() => toggleFollow(userId)}
  size="sm"
/>
```

## Overlay Components

### Modal

```tsx
import { Modal } from '@xhub-reel/ui'

<Modal
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  title="Modal Title"
  size="md"  // 'sm' | 'md' | 'lg' | 'full'
>
  <p>Modal content goes here</p>
  <Button onClick={() => setIsOpen(false)}>Close</Button>
</Modal>
```

### BottomSheet

```tsx
import { BottomSheet } from '@xhub-reel/ui'

<BottomSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  height="60%"        // or pixels
  maxHeight="90%"
  showDragHandle
  enableSwipeToClose
>
  <div className="p-4">
    <h2>Sheet Content</h2>
  </div>
</BottomSheet>
```

### CommentSheet

```tsx
import { CommentSheet } from '@xhub-reel/ui'

<CommentSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  videoId={video.id}
  comments={comments}
  totalCount={video.stats.comments}
  onPostComment={async (content) => {
    await postComment(video.id, content)
  }}
  onLikeComment={async (commentId) => {
    await likeComment(commentId)
  }}
  onLoadMore={async () => {
    await loadMoreComments()
  }}
  isLoading={isLoading}
/>
```

### ShareSheet

```tsx
import { ShareSheet } from '@xhub-reel/ui'

<ShareSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  video={video}
  shareUrl={`https://xhubreel.app/v/${video.id}`}
  onShare={(platform) => {
    trackShare(video.id, platform)
  }}
  onCopyLink={() => {
    showToast('Đã sao chép link!')
  }}
/>
```

### ContextMenu

```tsx
import { ContextMenu } from '@xhub-reel/ui'

<ContextMenu
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  position={{ x: 100, y: 200 }}
  items={[
    { icon: Bookmark, label: 'Lưu video', onClick: saveVideo },
    { icon: XCircle, label: 'Không quan tâm', onClick: hideVideo },
    { icon: UserX, label: 'Ẩn tác giả này', onClick: hideAuthor },
    { icon: Flag, label: 'Báo cáo', onClick: reportVideo, danger: true },
    { icon: Link, label: 'Sao chép link', onClick: copyLink },
  ]}
/>
```

## Loading Components

### Skeleton

```tsx
import { Skeleton } from '@xhub-reel/ui'

// Variants
<Skeleton variant="text" className="w-48" />
<Skeleton variant="circular" className="w-12 h-12" />
<Skeleton variant="rectangular" className="w-full h-32" />

// Animated
<Skeleton animate />

// Video skeleton
<Skeleton variant="video" className="aspect-[9/16]" />
```

### BlurPlaceholder

```tsx
import { BlurPlaceholder } from '@xhub-reel/ui'

<BlurPlaceholder
  src={video.thumbnail}
  blurDataUrl={video.blurHash}  // Base64 blur image
  alt="Video thumbnail"
/>
```

### Spinner

```tsx
import { Spinner } from '@xhub-reel/ui'

<Spinner size="sm" />
<Spinner size="md" />
<Spinner size="lg" />

<Spinner color="violet" />
<Spinner color="white" />
```

## Animation Components

### DoubleTapHeart

```tsx
import { DoubleTapHeart } from '@xhub-reel/ui'

function VideoPlayer() {
  const [showHeart, setShowHeart] = useState(false)

  const handleDoubleTap = () => {
    setShowHeart(true)
    likeVideo()
  }

  return (
    <div>
      <Video />
      {showHeart && (
        <DoubleTapHeart
          onComplete={() => setShowHeart(false)}
          size={120}
          color="#FF2D55"
        />
      )}
    </div>
  )
}
```

### PlayPauseOverlay

```tsx
import { PlayPauseOverlay } from '@xhub-reel/ui'

<PlayPauseOverlay
  isPlaying={isPlaying}
  show={showOverlay}
  onComplete={() => setShowOverlay(false)}
/>
```

## Toast

```tsx
import { useToast, ToastProvider } from '@xhub-reel/ui'

// Wrap app
<ToastProvider>
  <App />
</ToastProvider>

// Use in component
function MyComponent() {
  const toast = useToast()

  const handleSave = () => {
    saveVideo()
    toast.success('Đã lưu video!')
  }

  const handleError = () => {
    toast.error('Có lỗi xảy ra')
  }

  return (
    <Button onClick={handleSave}>Save</Button>
  )
}

// Toast types
toast.success('Success message')
toast.error('Error message')
toast.info('Info message')
toast.warning('Warning message')

// With options
toast.success('Message', {
  duration: 3000,
  action: {
    label: 'Undo',
    onClick: () => undoAction(),
  },
})
```

## Icons

Re-exports từ lucide-react:

```tsx
import {
  // Media
  Play, Pause, Volume2, VolumeX, Maximize, Minimize,
  
  // Actions
  Heart, MessageCircle, Share2, Bookmark, MoreHorizontal,
  
  // Navigation
  ChevronUp, ChevronDown, ChevronLeft, ChevronRight, X,
  
  // User
  User, UserPlus, UserMinus, UserCheck, Users,
  
  // Status
  Check, AlertCircle, Info, AlertTriangle,
  
  // Other
  Search, Settings, Home, TrendingUp, Music,
} from '@xhub-reel/ui'
```

## Tailwind Preset

```js title="tailwind.config.js"
module.exports = {
  presets: [require('@xhub-reel/ui/tailwind.preset')],
  content: [
    './src/**/*.{js,ts,jsx,tsx}',
    './node_modules/@xhub-reel/ui/dist/**/*.js',
  ],
}
```

### Preset includes

```css
/* Colors */
.bg-xhub-reel-black      /* #000000 */
.bg-xhub-reel-violet     /* #8B5CF6 */
.text-xhub-reel-like     /* #FF2D55 */

/* Safe areas */
.pt-safe              /* padding-top: env(safe-area-inset-top) */
.pb-safe              /* padding-bottom: env(safe-area-inset-bottom) */

/* Animations */
.animate-xhub-reel-bounce
.animate-shimmer
.animate-heart-pop

/* Transitions */
.transition-xhub-reel    /* 300ms cubic-bezier(0.32, 0.72, 0, 1) */
```

## Theming

### CSS Variables

```css
:root {
  --xhub-reel-violet: #8B5CF6;
  --xhub-reel-violet-light: #A78BFA;
  --xhub-reel-violet-dark: #7C3AED;
  --xhub-reel-like: #FF2D55;
  --xhub-reel-black: #000000;
  --xhub-reel-easing: cubic-bezier(0.32, 0.72, 0, 1);
}
```

### Custom theme

```tsx
import { ThemeProvider } from '@xhub-reel/ui'

<ThemeProvider
  theme={{
    colors: {
      primary: '#FF6B00',  // Custom accent color
      like: '#FF2D55',
    },
    animation: {
      spring: { stiffness: 500, damping: 35 },
    },
  }}
>
  <App />
</ThemeProvider>
```

## Accessibility

All components include:
- ARIA labels
- Keyboard navigation
- Focus indicators
- Screen reader support

```tsx
<IconButton
  icon={Heart}
  aria-label="Like this video"
  aria-pressed={isLiked}
/>
```

## API Reference

Xem [Components API](/docs/api/components) để biết đầy đủ props.

