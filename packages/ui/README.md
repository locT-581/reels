# @xhub-reel/ui

> UI components for XHubReel - XHubReel Design System

## Installation

```bash
npm install @xhub-reel/ui @xhub-reel/core motion lucide-react
# or
pnpm add @xhub-reel/ui @xhub-reel/core motion lucide-react
```

## Features

- 🎨 **XHubReel Design System** - Dark-first, video-centric
- ✨ **Motion Animations** - Spring physics, smooth transitions
- 📱 **Mobile-First** - Touch-optimized, 48px tap targets
- 🌙 **OLED Black** - #000000 backgrounds
- 💜 **Electric Violet** - #8B5CF6 accent color

## Components

### Base Components

#### Button

```tsx
import { Button } from '@xhub-reel/ui'

<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="ghost">Ghost</Button>
<Button variant="danger">Danger</Button>
<Button size="sm">Small</Button>
<Button size="lg">Large</Button>
<Button loading>Loading...</Button>
```

#### IconButton

```tsx
import { IconButton } from '@xhub-reel/ui'
import { Heart, Share2 } from 'lucide-react'

<IconButton icon={Heart} count={1234} aria-label="Like" />
<IconButton icon={Share2} variant="filled" aria-label="Share" />
<IconButton icon={Heart} active activeColor="#FF2D55" />
```

#### Avatar

```tsx
import { Avatar } from '@xhub-reel/ui'

<Avatar src="https://..." alt="User" />
<Avatar fallback="John Doe" />
<Avatar size="lg" showFollowRing />
<Avatar isLive />
```

### Typography

#### Text

```tsx
import { Text } from '@xhub-reel/ui'

<Text variant="display">Display</Text>
<Text variant="title">Title</Text>
<Text variant="body">Body text</Text>
<Text variant="caption">Caption</Text>
<Text videoSafe>Text with drop shadow for video overlay</Text>
```

#### Counter

```tsx
import { Counter } from '@xhub-reel/ui'

<Counter value={1234} />    // "1.2K"
<Counter value={1000000} /> // "1M"
<Counter size="lg" />
```

#### Marquee

```tsx
import { Marquee } from '@xhub-reel/ui'

<Marquee>This text will scroll if it overflows the container</Marquee>
```

### Interactions

#### LikeButton

```tsx
import { LikeButton } from '@xhub-reel/ui'

<LikeButton
  count={1234}
  isLiked={false}
  onLike={() => handleLike()}
/>
```

#### SaveButton

```tsx
import { SaveButton } from '@xhub-reel/ui'

<SaveButton
  isSaved={false}
  onSave={() => handleSave()}
/>
```

#### ShareButton

```tsx
import { ShareButton } from '@xhub-reel/ui'

<ShareButton
  count={156}
  onShare={() => handleShare()}
/>
```

### Overlays

#### Modal

```tsx
import { Modal } from '@xhub-reel/ui'

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <h2>Modal Title</h2>
  <p>Modal content</p>
</Modal>
```

#### CommentSheet

```tsx
import { CommentSheet } from '@xhub-reel/ui'

<CommentSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  videoId="video-id"
  comments={comments}
  onPostComment={handlePost}
/>
```

#### ShareSheet

```tsx
import { ShareSheet } from '@xhub-reel/ui'

<ShareSheet
  isOpen={isOpen}
  onClose={() => setIsOpen(false)}
  video={video}
  onShare={handleShare}
/>
```

### Loading

#### Skeleton

```tsx
import { Skeleton } from '@xhub-reel/ui'

<Skeleton variant="text" className="w-48" />
<Skeleton variant="circular" className="w-12 h-12" />
<Skeleton variant="rectangular" className="w-full h-32" />
```

#### BlurPlaceholder

```tsx
import { BlurPlaceholder } from '@xhub-reel/ui'

<BlurPlaceholder
  src="https://..."
  blurHash="LEHV6nWB2yk8pyo0adR*.7kCMdnj"
/>
```

### Animations

#### DoubleTapHeart

```tsx
import { DoubleTapHeart } from '@xhub-reel/ui'

{showHeart && <DoubleTapHeart onComplete={() => setShowHeart(false)} />}
```

## Icons

Re-exports from lucide-react:

```tsx
import {
  Heart, MessageCircle, Share2, Bookmark,
  Play, Pause, Volume2, VolumeX,
  // ... 70+ icons
} from '@xhub-reel/ui'
```

## Tailwind CSS Preset

Include the XHubReel design system in your Tailwind config:

```js
// tailwind.config.js
module.exports = {
  presets: [require('@xhub-reel/ui/tailwind.preset')],
}
```

This adds:
- XHubReel colors (`xhub-reel-violet`, `xhub-reel-like`, `xhub-reel-black`)
- 8pt spacing system
- Custom animations (`xhub-reel-bounce`, `shimmer`)
- Safe area utilities (`pt-safe`, `pb-safe`)

## Design Tokens

```css
--xhub-reel-violet: #8B5CF6;
--xhub-reel-like: #FF2D55;
--xhub-reel-black: #000000;
--xhub-reel-easing: cubic-bezier(0.32, 0.72, 0, 1);
```

## License

MIT

