---
"@vortex/core": minor
"@vortex/player": minor
"@vortex/ui": minor
"@vortex/gestures": minor
"@vortex/feed": minor
"@vortex/embed": minor
---

🎉 Initial release of VortexStream packages

## @vortex/core
- Types, constants, and utilities
- Zustand stores (player, feed, UI, user)
- TanStack Query setup
- IndexedDB storage (video cache, watch history, preferences)
- Offline action queue

## @vortex/player
- HLS video player with hls.js
- Adaptive quality streaming
- Seek preview thumbnails
- Picture-in-Picture support
- Keyboard shortcuts

## @vortex/ui
- Base components (Button, IconButton, Avatar)
- Typography (Text, Counter, Marquee)
- Overlays (Modal, BottomSheet)
- Loading states (Spinner, Skeleton, BlurPlaceholder)
- Interaction components (LikeButton, SaveButton, ShareSheet, CommentSheet)
- Tailwind CSS preset with Vortex design system

## @vortex/gestures
- Tap detection (single, double)
- Long press and hold
- Swipe gestures (up, down, left, right)
- Seek drag
- Visual feedback (TapRipple, GestureIndicator)

## @vortex/feed
- Virtualized video feed with @tanstack/react-virtual
- Video activation rules
- Preloading strategy
- Infinite scroll
- Pull-to-refresh

## @vortex/embed
- Embeddable video widget
- Configurable options
- External dependency support

