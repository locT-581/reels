# @xhub-reel/ui

## 0.1.0

### Minor Changes

- 858048f: 🎉 Initial release of XHubReel packages

  ## @xhub-reel/core
  - Types, constants, and utilities
  - Zustand stores (player, feed, UI, user)
  - TanStack Query setup
  - IndexedDB storage (video cache, watch history, preferences)
  - Offline action queue

  ## @xhub-reel/player
  - HLS video player with hls.js
  - Adaptive quality streaming
  - Seek preview thumbnails
  - Picture-in-Picture support
  - Keyboard shortcuts

  ## @xhub-reel/ui
  - Base components (Button, IconButton, Avatar)
  - Typography (Text, Counter, Marquee)
  - Overlays (Modal, BottomSheet)
  - Loading states (Spinner, Skeleton, BlurPlaceholder)
  - Interaction components (LikeButton, SaveButton, ShareSheet, CommentSheet)
  - Tailwind CSS preset with XHubReel design system

  ## @xhub-reel/gestures
  - Tap detection (single, double)
  - Long press and hold
  - Swipe gestures (up, down, left, right)
  - Seek drag
  - Visual feedback (TapRipple, GestureIndicator)

  ## @xhub-reel/feed
  - Virtualized video feed with @tanstack/react-virtual
  - Video activation rules
  - Preloading strategy
  - Infinite scroll
  - Pull-to-refresh

  ## @xhub-reel/embed
  - Embeddable video widget
  - Configurable options
  - External dependency support

### Patch Changes

- First release package
- Updated dependencies
  - @xhub-reel/design-tokens@0.0.2
  - @xhub-reel/types@0.0.2
