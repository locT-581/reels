# @xhub-reel/feed

## 0.2.3

### Patch Changes

- Integrate player-engine and enhance video feed with pooling support for improved performance
- Updated dependencies
  - @xhub-reel/player-engine@0.0.3
  - @xhub-reel/player@0.2.3
  - @xhub-reel/core@0.2.3
  - @xhub-reel/ui@0.2.3

## 0.2.2

### Patch Changes

- Set default value for initialMuted prop in ConnectedVideoFeed for improved autoplay handling

## 0.2.1

### Patch Changes

- Add initialMuted prop to VideoFeed and VideoFeedItem components for better autoplay control

## 0.2.0

### Minor Changes

- 98a7616: 🎉 Initial release of XHubReel packages

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

- Change objectFit property to 'cover' for VideoFeedItem component
- Updated dependencies [98a7616]
  - @xhub-reel/core@0.2.0
  - @xhub-reel/player@0.2.0
  - @xhub-reel/gestures@0.2.0

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
- Updated dependencies [858048f]
  - @xhub-reel/core@0.1.0
  - @xhub-reel/gestures@0.1.0
  - @xhub-reel/player@0.1.0
