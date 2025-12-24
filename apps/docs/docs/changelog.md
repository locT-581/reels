---
sidebar_position: 11
---

# Changelog

Lịch sử thay đổi của XHubReel.

## [0.1.0] - 2024-01-01

### 🎉 Initial Release

#### @xhub-reel/core
- ✨ TypeScript types cho Video, Author, Comment
- ✨ Zustand stores (player, feed, UI)
- ✨ Custom hooks (useDebounce, useThrottle, useNetworkStatus)
- ✨ Utility functions (formatCount, formatDuration)
- ✨ IndexedDB storage (cache, watch history)
- ✨ Offline action queue

#### @xhub-reel/player
- ✨ HLS video player với hls.js
- ✨ Native HLS support cho Safari
- ✨ Quality selection (auto, 1080p, 720p, 480p, 360p)
- ✨ Playback speed control (0.5x - 2x)
- ✨ Keyboard shortcuts
- ✨ Seek bar với buffer indicator

#### @xhub-reel/feed
- ✨ Virtualized video feed
- ✨ Video activation based on visibility
- ✨ Infinite scroll support
- ✨ Pull to refresh
- ✨ Memory management (max 5 videos in DOM)

#### @xhub-reel/gestures
- ✨ Tap gestures (single, double tap)
- ✨ Long press detection
- ✨ Swipe gestures (vertical, horizontal)
- ✨ Seek by drag
- ✨ Haptic feedback
- ✨ Visual indicators (ripple, seek)

#### @xhub-reel/ui
- ✨ XHubReel Design System
- ✨ Button, IconButton, Avatar
- ✨ LikeButton, CommentButton, ShareButton
- ✨ Modal, BottomSheet
- ✨ CommentSheet, ShareSheet
- ✨ Skeleton loading
- ✨ DoubleTapHeart animation
- ✨ Tailwind CSS preset

#### @xhub-reel/embed
- ✨ All-in-one XHubReelEmbed component
- ✨ XHubReelPlayer for single video
- ✨ Configurable theme và features
- ✨ CDN build support

---

## Upcoming

### [0.2.0] - Planned

- 🔄 Picture-in-Picture support
- 🔄 Fullscreen mode
- 🔄 Caption/subtitle support
- 🔄 Improved accessibility
- 🔄 React Native support

### [0.3.0] - Planned

- 🔄 Video upload component
- 🔄 Comment threading UI
- 🔄 Live streaming support
- 🔄 Analytics integration

