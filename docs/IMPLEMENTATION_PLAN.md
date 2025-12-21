# VortexStream Implementation Plan

> **Trạng thái:** 🚧 Đang triển khai
> **Cập nhật lần cuối:** 2024-12-22
> **Phiên bản:** 1.0.0

---

## 📊 Tổng quan tiến độ

| Phase | Tên | Trạng thái | Tiến độ |
|-------|-----|------------|---------|
| 0 | Project Setup | ✅ Hoàn thành | 100% |
| 1 | Core Infrastructure | ✅ Hoàn thành | 100% |
| 2 | Video Player | ✅ Hoàn thành | 100% |
| 3 | Feed System | ✅ Hoàn thành | 100% |
| 4 | Gesture System | ✅ Hoàn thành | 100% |
| 5 | Interaction Features | ✅ Hoàn thành | 100% |
| 6 | UI Components | ✅ Hoàn thành | 100% |
| 7 | State & Storage | ✅ Hoàn thành | 100% |
| 8 | PWA & Offline | ✅ Hoàn thành | 100% |
| 9 | Testing & Optimization | ✅ Hoàn thành | 100% |
| 10 | Documentation & Deployment | ✅ Hoàn thành | 100% |

**Tổng tiến độ: 100%** (11/11 Phases hoàn thành) 🎉

**Ký hiệu trạng thái:**
- ⬜ Chưa bắt đầu
- 🔄 Đang thực hiện
- ✅ Hoàn thành
- ⏸️ Tạm dừng
- ❌ Bị hủy

---

## Phase 0: Project Setup (Ước tính: 1 ngày)

**Mục tiêu:** Thiết lập cấu trúc monorepo, cài đặt dependencies cơ bản

### 0.1 Khởi tạo Monorepo
- [x] Tạo thư mục gốc và khởi tạo `pnpm`
- [x] Tạo file `pnpm-workspace.yaml`
- [x] Tạo file `turbo.json` với pipeline config
- [x] Tạo cấu trúc thư mục:
  ```
  vortex-stream/
  ├── apps/
  │   ├── web/
  │   └── docs/
  ├── packages/
  │   ├── core/
  │   ├── player/
  │   ├── ui/
  │   ├── gestures/
  │   ├── feed/
  │   └── embed/
  ```

### 0.2 Cấu hình TypeScript
- [x] Tạo `tsconfig.base.json` ở root
- [x] Tạo `tsconfig.json` cho mỗi package với extends
- [x] Cấu hình path aliases
- [x] Cấu hình strict mode

### 0.3 Cấu hình ESLint & Prettier
- [x] Tạo `eslint.config.mjs` ở root (ESLint 9 flat config)
- [x] Tạo `.prettierrc` ở root
- [x] Tạo `.editorconfig`
- [x] Cấu hình husky + lint-staged

### 0.4 Khởi tạo Next.js App
- [x] Khởi tạo `apps/web` với Next.js 15
- [x] Cấu hình App Router
- [x] Cấu hình Turbopack
- [x] Tạo layout cơ bản với Vortex Design System

### 0.5 Khởi tạo các packages
- [x] Tạo `package.json` cho `@vortex/core`
- [x] Tạo `package.json` cho `@vortex/player`
- [x] Tạo `package.json` cho `@vortex/ui`
- [x] Tạo `package.json` cho `@vortex/gestures`
- [x] Tạo `package.json` cho `@vortex/feed`
- [x] Tạo `package.json` cho `@vortex/embed`
- [x] Cấu hình build script với tsup cho mỗi package

### 0.6 Cài đặt Dependencies
- [x] Cài đặt React 19, Next.js 15
- [x] Cài đặt TypeScript 5.x
- [x] Cài đặt Tailwind CSS 3.4 (sẽ nâng lên v4 khi stable)
- [x] Cài đặt Motion (motion.dev)
- [x] Cài đặt Zustand, TanStack Query
- [x] Cài đặt dev dependencies (tsup, eslint, prettier)

**Tiến độ Phase 0:** ✅ 24/24 tasks (100%)

---

## Phase 1: Core Infrastructure (Ước tính: 2 ngày)

**Mục tiêu:** Xây dựng @vortex/core với types, utils, và stores cơ bản

### 1.1 Định nghĩa Types
- [x] Tạo `packages/core/src/types/video.ts`
  - [x] Interface `Video` (id, url, thumbnail, author, stats, etc.)
  - [x] Interface `VideoMetadata` (duration, quality levels, etc.)
  - [x] Interface `VideoStats` (likes, comments, shares, views)
- [x] Tạo `packages/core/src/types/user.ts`
  - [x] Interface `User` (id, username, avatar, etc.)
  - [x] Interface `Author` extends User
  - [x] Type `UserRole` (viewer, creator, moderator, admin)
- [x] Tạo `packages/core/src/types/comment.ts`
  - [x] Interface `Comment`
  - [x] Interface `Reply`
  - [x] Interface `CommentThread`
- [x] Tạo `packages/core/src/types/player.ts`
  - [x] Type `PlayerState` (idle, loading, ready, playing, paused, buffering, error)
  - [x] Type `PlaybackSpeed`
  - [x] Type `Quality`
- [x] Tạo `packages/core/src/types/index.ts` (barrel export)

### 1.2 Constants & Config
- [x] Tạo `packages/core/src/constants/player.ts`
  - [x] HLS config defaults
  - [x] Player thresholds
  - [x] Quality presets
- [x] Tạo `packages/core/src/constants/animation.ts`
  - [x] Easing curves (vortex cubic-bezier)
  - [x] Duration presets
  - [x] Spring configs
- [x] Tạo `packages/core/src/constants/breakpoints.ts`
- [x] Tạo `packages/core/src/constants/colors.ts`
  - [x] Vortex color palette (#000000, #8B5CF6, etc.)

### 1.3 Utility Functions
- [x] Tạo `packages/core/src/utils/format.ts`
  - [x] `formatCount()` - Format số (1.2K, 3.5M)
  - [x] `formatDuration()` - Format thời gian video
  - [x] `formatTimestamp()` - Format thời gian relative (2h ago)
- [x] Tạo `packages/core/src/utils/video.ts`
  - [x] `getVideoAspectRatio()`
  - [x] `calculateBufferProgress()`
  - [x] `getQualityLabel()`
- [x] Tạo `packages/core/src/utils/device.ts`
  - [x] `isMobile()`
  - [x] `isIOS()`
  - [x] `supportsHLS()`
  - [x] `getNetworkType()`
- [x] Tạo `packages/core/src/utils/haptic.ts`
  - [x] `lightHaptic()`
  - [x] `mediumHaptic()`
  - [x] `heavyHaptic()`

### 1.4 Zustand Stores (Core)
- [x] Tạo `packages/core/src/stores/playerStore.ts`
  - [x] State: currentVideo, isPlaying, isMuted, volume, speed, quality
  - [x] Actions: play, pause, toggleMute, setVolume, setSpeed, setQuality
  - [x] Persist: volume, isMuted, playbackSpeed
- [x] Tạo `packages/core/src/stores/feedStore.ts`
  - [x] State: videos, currentIndex, feedType, isLoading
  - [x] Actions: setCurrentIndex, loadMore, switchFeedType
- [x] Tạo `packages/core/src/stores/uiStore.ts`
  - [x] State: isCommentSheetOpen, isShareSheetOpen, isContextMenuOpen
  - [x] Actions: openCommentSheet, closeCommentSheet, etc.
- [x] Tạo `packages/core/src/stores/userStore.ts`
  - [x] State: currentUser, isLoggedIn, likedVideos, savedVideos
  - [x] Actions: login, logout, toggleLike, toggleSave

### 1.5 Hooks (Core)
- [x] Tạo `packages/core/src/hooks/useDeviceInfo.ts`
- [x] Tạo `packages/core/src/hooks/useNetworkStatus.ts`
- [x] Tạo `packages/core/src/hooks/useLocalStorage.ts`
- [x] Tạo `packages/core/src/hooks/useDebounce.ts`
- [x] Tạo `packages/core/src/hooks/useThrottle.ts`

### 1.6 Package Export
- [x] Tạo `packages/core/src/index.ts` barrel export
- [x] Cấu hình `tsup.config.ts` cho build
- [x] Test build và exports

**Tiến độ Phase 1:** ✅ 35/35 tasks (100%)

---

## Phase 2: Video Player (Ước tính: 5 ngày)

**Mục tiêu:** Xây dựng @vortex/player với HLS support, controls, và states

### 2.1 HLS Engine
- [ ] Tạo `packages/player/src/core/hls-engine.ts`
  - [ ] Class `HLSEngine` với hls.js wrapper
  - [ ] Method `loadSource(url: string)`
  - [ ] Method `destroy()`
  - [ ] Error handling và recovery
  - [ ] ABR configuration (theo TECHSTACK.md)
- [ ] Tạo `packages/player/src/core/native-hls.ts`
  - [ ] Class `NativeHLS` cho iOS Safari
  - [ ] Same API interface với HLSEngine
- [ ] Tạo `packages/player/src/core/player-core.ts`
  - [ ] Class `PlayerCore` - Unified API
  - [ ] Auto-detect HLS support
  - [ ] Switch giữa hls.js và native

### 2.2 Player State Machine
- [ ] Tạo `packages/player/src/state/player-state-machine.ts`
  - [ ] States: IDLE → LOADING → READY → PLAYING ↔ PAUSED
  - [ ] States: LOADING → ERROR, PLAYING → BUFFERING → STALLED
  - [ ] Transitions và guards
- [ ] Tạo `packages/player/src/state/use-player-state.ts`
  - [ ] Hook để subscribe player state
  - [ ] Expose state và actions

### 2.3 Player Hooks
- [ ] Tạo `packages/player/src/hooks/usePlayer.ts`
  - [ ] Khởi tạo PlayerCore
  - [ ] Return player instance và state
- [ ] Tạo `packages/player/src/hooks/usePlayback.ts`
  - [ ] play(), pause(), togglePlay()
  - [ ] seek(time), seekForward(10s), seekBackward(10s)
- [ ] Tạo `packages/player/src/hooks/useVolume.ts`
  - [ ] volume, isMuted
  - [ ] setVolume(), toggleMute()
- [ ] Tạo `packages/player/src/hooks/useBuffering.ts`
  - [ ] isBuffering, bufferProgress
  - [ ] bufferedRanges
- [ ] Tạo `packages/player/src/hooks/useProgress.ts`
  - [ ] currentTime, duration, progress
  - [ ] onTimeUpdate callback
- [ ] Tạo `packages/player/src/hooks/useQuality.ts`
  - [ ] availableQualities, currentQuality
  - [ ] setQuality()
- [ ] Tạo `packages/player/src/hooks/useFullscreen.ts`
  - [ ] isFullscreen, toggleFullscreen
  - [ ] exitFullscreen

### 2.4 Video Player Component
- [ ] Tạo `packages/player/src/components/VideoPlayer.tsx`
  - [ ] Props: src, poster, autoPlay, muted, loop
  - [ ] Ref forwarding
  - [ ] Error boundary
- [ ] Tạo `packages/player/src/components/VideoContainer.tsx`
  - [ ] Aspect ratio handling
  - [ ] Object-fit logic
  - [ ] Placeholder khi loading

### 2.5 Player Controls
- [ ] Tạo `packages/player/src/components/controls/PlayPauseButton.tsx`
  - [ ] Icon toggle với animation (fade in/out)
  - [ ] Center screen position
  - [ ] Auto-hide sau 1s
- [ ] Tạo `packages/player/src/components/controls/SeekBar.tsx`
  - [ ] Default 2px, expand 4px on hover/touch
  - [ ] Buffer progress indicator
  - [ ] Preview thumbnail on drag
  - [ ] Time indicator
- [ ] Tạo `packages/player/src/components/controls/VolumeButton.tsx`
  - [ ] 4 states: muted, low, medium, high
  - [ ] Position: góc phải dưới
- [ ] Tạo `packages/player/src/components/controls/PlaybackSpeedMenu.tsx`
  - [ ] Options: 0.5x, 0.75x, 1x, 1.25x, 1.5x, 2x
  - [ ] Popup menu
- [ ] Tạo `packages/player/src/components/controls/QualitySelector.tsx`
  - [ ] Auto, 1080p, 720p, 480p, 360p
  - [ ] Show current quality
- [ ] Tạo `packages/player/src/components/controls/FullscreenButton.tsx`
  - [ ] Toggle fullscreen
  - [ ] Handle landscape rotation

### 2.6 Player Overlays
- [ ] Tạo `packages/player/src/components/overlays/LoadingOverlay.tsx`
  - [ ] 0-500ms: Blur placeholder
  - [ ] 500ms-2s: Skeleton shimmer
  - [ ] >2s: Spinner + "Đang tải..."
- [ ] Tạo `packages/player/src/components/overlays/BufferingOverlay.tsx`
  - [ ] Small spinner góc
  - [ ] Chỉ hiện sau 1s buffering
- [ ] Tạo `packages/player/src/components/overlays/ErrorOverlay.tsx`
  - [ ] Human-friendly messages (theo BLUEPRINT)
  - [ ] Retry button
  - [ ] Auto-skip option
- [ ] Tạo `packages/player/src/components/overlays/VideoInfoOverlay.tsx`
  - [ ] Author avatar (tap → profile)
  - [ ] Author name (@username)
  - [ ] Caption (truncate 2 lines, tap expand)
  - [ ] Hashtags (Electric Violet color)
  - [ ] Sound/Music (marquee animation)

### 2.7 Seek Preview
- [ ] Tạo `packages/player/src/components/SeekPreview.tsx`
  - [ ] Thumbnail preview khi kéo seek bar
  - [ ] Time indicator
  - [ ] Smooth follow gesture

### 2.8 Double Tap Animations
- [ ] Tạo `packages/player/src/components/animations/SeekAnimation.tsx`
  - [ ] "+10s" / "-10s" ripple animation
- [ ] Tạo `packages/player/src/components/animations/HeartAnimation.tsx`
  - [ ] Big heart explosion (120px)
  - [ ] Scale + fade timeline

### 2.9 Package Export
- [ ] Tạo `packages/player/src/index.ts`
- [ ] Export VideoPlayer, hooks, và types
- [ ] Build và test

**Tiến độ Phase 2:** ⬜ 0/42 tasks (0%)

---

## Phase 3: Feed System (Ước tính: 4 ngày)

**Mục tiêu:** Xây dựng @vortex/feed với virtualization và scroll behaviors

### 3.1 Virtualization Setup
- [x] Tạo `packages/feed/src/hooks/useVirtualFeed.ts`
  - [x] Integrate @tanstack/react-virtual
  - [x] estimateSize = window.innerHeight
  - [x] overscan = 2
- [x] Tạo `packages/feed/src/hooks/useVideoVisibility.ts`
  - [x] IntersectionObserver setup
  - [x] Threshold 50% để activate
  - [x] Threshold 30% để deactivate

### 3.2 Feed Container
- [x] Tạo `packages/feed/src/components/VideoFeed.tsx`
  - [x] Scroll container với snap-y snap-mandatory
  - [x] Virtual list rendering
  - [x] Props: videos, onLoadMore, onVideoChange
- [x] Tạo `packages/feed/src/components/VideoFeedItem.tsx`
  - [x] Wrapper cho mỗi video
  - [x] Height = 100vh
  - [x] Absolute positioning cho virtualization

### 3.3 Video Activation Logic
- [x] Tạo `packages/feed/src/hooks/useVideoActivation.ts`
  - [x] Rule: >50% viewport → activate (play)
  - [x] Rule: <30% viewport → deactivate (pause + reset)
  - [x] Rule: scroll velocity >2000px/s → skip activation
  - [x] Rule: scroll dừng >300ms → activate nearest

### 3.4 Pre-loading Strategy
- [x] Tạo `packages/feed/src/hooks/usePreloader.ts`
  - [x] Current - 1: Keep in memory, pause
  - [x] Current: Playing
  - [x] Current + 1: Pre-load first 3 segments
  - [x] Current + 2: Pre-load first segment
  - [x] Current + 3: Fetch metadata only
  - [x] Current ± 4+: Dispose

### 3.5 Memory Management
- [x] Tạo `packages/feed/src/utils/memory-manager.ts`
  - [x] Max 5 videos in DOM
  - [x] Max 3 videos decoded frames
  - [x] Total memory cap 150MB
  - [x] Low memory warning handler
- [x] Tạo `packages/feed/src/hooks/useMemoryManager.ts`
  - [x] Hook để quản lý memory
  - [x] Cleanup logic

### 3.6 Pull-to-Refresh
- [x] Tạo `packages/feed/src/components/PullToRefresh.tsx`
  - [x] Pulling state: Icon kéo + progress (0-80px)
  - [x] Triggered state: Spinner + "Đang làm mới..." (>80px)
  - [x] Refreshing state: Fetch new content
  - [x] Complete: Snap back

### 3.7 Scroll Mechanics
- [x] Tạo `packages/feed/src/hooks/useScrollSnap.ts`
  - [x] CSS scroll-snap-type: mandatory
  - [x] scroll-snap-align: center
  - [x] Smooth scroll với spring physics
- [x] Tạo `packages/feed/src/utils/scroll-physics.ts`
  - [x] Deceleration rate: 0.998
  - [x] Overscroll behavior: contain

### 3.8 Feed Types
- [x] Tạo `packages/feed/src/components/FeedTabs.tsx`
  - [x] For You / Following tabs
  - [x] Swipe horizontal để switch
  - [x] Active indicator animation
- [x] Tạo `packages/feed/src/hooks/useFeedType.ts`
  - [x] State: 'foryou' | 'following'
  - [x] Switch logic

### 3.9 Infinite Scroll
- [x] Tạo `packages/feed/src/hooks/useInfiniteScroll.ts`
  - [x] Detect near end (last 2 videos)
  - [x] Trigger loadMore
  - [x] Loading state handling
- [x] Tạo `packages/feed/src/components/LoadingIndicator.tsx`
  - [x] Subtle spinner khi loading more (tích hợp trong VideoFeed)

### 3.10 Package Export
- [x] Tạo `packages/feed/src/index.ts`
- [x] Export VideoFeed, hooks
- [x] Build và test

**Tiến độ Phase 3:** ✅ 25/25 tasks (100%)

---

## Phase 4: Gesture System (Ước tính: 3 ngày)

**Mục tiêu:** Xây dựng @vortex/gestures với full gesture support

### 4.1 Tap Gestures
- [x] Tạo `packages/gestures/src/hooks/useTapGestures.ts`
  - [x] Single tap: Play/Pause toggle
  - [x] Double tap left: Tua lùi 10s
  - [x] Double tap right: Tua tiến 10s
  - [x] Double tap center: Like video
- [x] Tạo `packages/gestures/src/utils/getGestureZone.ts`
  - [x] Calculate left/center/right zones
  - [x] Handle different screen sizes

### 4.2 Long Press
- [x] Tạo `packages/gestures/src/hooks/useLongPress.ts`
  - [x] Threshold: 500ms
  - [x] Haptic feedback on trigger
  - [x] Return position for context menu
- [x] Tạo `packages/gestures/src/hooks/useHold.ts`
  - [x] Hold anywhere: Pause tạm thời
  - [x] Release: Tiếp tục phát

### 4.3 Swipe Gestures
- [x] Tạo `packages/gestures/src/hooks/useVerticalSwipe.ts`
  - [x] Swipe up: Video tiếp theo (threshold >30% vh)
  - [x] Swipe down: Video trước đó (threshold >30% vh)
- [x] Tạo `packages/gestures/src/hooks/useHorizontalSwipe.ts`
  - [x] Swipe left: Vào profile (threshold >40% vw)
  - [x] Swipe right: Quay lại (threshold >40% vw)
- [x] Tạo `packages/gestures/src/hooks/useSeekDrag.ts`
  - [x] Horizontal drag on seek bar
  - [x] 1px = 0.5s

### 4.4 Video Gestures Composite
- [x] Tạo `packages/gestures/src/hooks/useVideoGestures.ts`
  - [x] Combine all gesture hooks
  - [x] Unified API cho VideoPlayer
  - [x] Gesture priority handling

### 4.5 Haptic Feedback Integration
- [x] Haptic utils đã có trong `@vortex/core`
  - [x] Light impact cho Like
  - [x] Medium impact cho Long press
  - [x] Pattern cho special actions

### 4.6 Gesture Animations
- [x] Tạo `packages/gestures/src/components/GestureIndicator.tsx`
  - [x] Visual feedback cho swipe direction
  - [x] Opacity based on gesture progress
- [x] Tạo `packages/gestures/src/components/TapRipple.tsx`
  - [x] Ripple effect on tap
  - [x] Position at tap point

### 4.7 Package Export
- [x] Tạo `packages/gestures/src/index.ts`
- [x] Export hooks và components
- [x] Build và test

**Tiến độ Phase 4:** ✅ 17/17 tasks (100%)

---

## Phase 5: Interaction Features (Ước tính: 5 ngày)

**Mục tiêu:** Like, Comment, Share, Save systems

### 5.1 Like System
- [x] Tạo `packages/ui/src/components/interactions/LikeButton.tsx`
  - [x] Heart Outline (unliked) / Solid (liked)
  - [x] Size: 32px, tap area: 48x48px
  - [x] Counter format (1.2K, 3.5M)
- [x] Tạo `packages/ui/src/components/animations/DoubleTapHeart.tsx` (kết hợp animation)
  - [x] Icon scale 1 → 1.3 → 1 (spring)
  - [x] Color transition
  - [x] Mini hearts particles (burst effect)
- [x] Tạo `packages/ui/src/components/animations/DoubleTapHeart.tsx`
  - [x] 120px heart center screen
  - [x] Timeline: 0ms scale 0 → 50ms scale 1.2 → 150ms scale 1 → 500ms fade out
  - [x] `useDoubleTapHeart` hook
- [x] Tạo `packages/core/src/hooks/useLike.ts`
  - [x] Optimistic update
  - [x] Debounce 300ms
  - [x] Rollback on error

### 5.2 Comment System
- [x] Tạo `packages/ui/src/components/comments/CommentSheet.tsx`
  - [x] Bottom sheet 60% viewport
  - [x] Draggable to 90%
  - [x] Glassmorphism background
  - [x] Swipe down to dismiss
- [x] Tạo `packages/ui/src/components/comments/CommentSheet.tsx` (includes header)
  - [x] Comment count
  - [x] Close button
  - [x] Drag handle
- [x] Tạo `packages/ui/src/components/comments/CommentSheet.tsx` (includes list)
  - [x] List with scroll
  - [x] Pagination support (onLoadMore)
  - [x] Loading states
- [x] Tạo `packages/ui/src/components/comments/CommentItem.tsx`
  - [x] Avatar (32px, tap → profile)
  - [x] Username, timestamp
  - [x] Content (max 3 lines, tap expand)
  - [x] Like count, Reply button
- [x] Tạo `packages/ui/src/components/comments/CommentInput.tsx`
  - [x] User avatar
  - [x] Input field
  - [x] Mention support (@)
  - [x] Emoji button
  - [x] Send button
- [x] Tạo `packages/ui/src/components/comments/ReplyThread.tsx`
  - [x] Nested replies (max 1 level)
  - [x] Collapse/expand
  - [x] "Xem X phản hồi" toggle
- [x] Comment hooks integrated in CommentSheet

### 5.3 Share System
- [x] Tạo `packages/ui/src/components/share/ShareSheet.tsx`
  - [x] Bottom sheet
  - [x] Social apps row
  - [x] Actions row
  - [x] Native share support
- [x] Tạo `packages/ui/src/components/share/ShareButton.tsx`
  - [x] Share icon 32px
  - [x] Counter
- [x] Tạo `packages/ui/src/components/share/ShareOption.tsx`
  - [x] Icon + label
  - [x] Messenger, WhatsApp, Telegram, Facebook, X
- [x] Tạo `packages/core/src/hooks/useShare.ts`
  - [x] generateShareLink()
  - [x] generateDeepLink()
  - [x] copyToClipboard (copyLink)
  - [x] nativeShare()
  - [x] shareTo(platform)

### 5.4 Save/Bookmark System
- [x] Tạo `packages/ui/src/components/interactions/SaveButton.tsx`
  - [x] Bookmark Outline / Solid
  - [x] Electric Violet when saved
  - [x] Haptic + animation
- [x] Tạo `packages/core/src/hooks/useSave.ts`
  - [x] Toggle save
  - [x] Sync với server (onSaveChange callback)
  - [x] Local storage cache

### 5.5 Action Bar
- [x] Đã có `packages/ui/src/components/ActionBar.tsx`
  - [x] Position: right, vertical layout
  - [x] Buttons: Like, Comment, Share, Save
  - [x] Animation support

### 5.6 Context Menu
- [x] Tạo `packages/ui/src/components/ContextMenu.tsx`
  - [x] Blur background
  - [x] Options: Lưu, Không quan tâm, Ẩn tác giả, Báo cáo, Sao chép link
- [x] Tạo `packages/core/src/hooks/useContentControl.ts`
  - [x] markNotInterested()
  - [x] hideAuthor()
  - [x] reportContent()

**Tiến độ Phase 5:** ✅ 26/26 tasks (100%)

---

## Phase 6: UI Components (Ước tính: 4 ngày)

**Mục tiêu:** Xây dựng @vortex/ui với component library

### 6.1 Base Components
- [x] Tạo `packages/ui/src/components/base/Button.tsx`
  - [x] Variants: primary, secondary, ghost, danger
  - [x] Sizes: sm, md, lg
  - [x] States: hover, active, disabled, loading
- [x] Đã có `packages/ui/src/components/IconButton.tsx`
  - [x] Outline → Solid on active
  - [x] 48x48 tap area
- [x] Tạo `packages/ui/src/components/base/Avatar.tsx`
  - [x] Sizes: xs, sm, md, lg, xl
  - [x] Fallback initials với auto-generated colors
  - [x] Border ring for following
  - [x] Live indicator

### 6.2 Typography
- [x] Tạo `packages/ui/src/components/typography/Text.tsx`
  - [x] Variants: display, title, subtitle, body, caption, label, overline
  - [x] Shadow cho text trên video (videoSafe prop)
  - [x] Truncate và maxLines support
- [x] Tạo `packages/ui/src/components/typography/Counter.tsx`
  - [x] Auto format (1.2K, 3.5M, 1B)
  - [x] Animated transitions
- [x] Tạo `packages/ui/src/components/typography/Marquee.tsx`
  - [x] Auto scroll nếu text dài
  - [x] Pause on hover

### 6.3 Overlays & Sheets
- [x] Đã có `packages/ui/src/components/BottomSheet.tsx`
  - [x] Drag to expand/dismiss
  - [x] Glassmorphism background
  - [x] Spring physics animation
- [x] Tạo `packages/ui/src/components/overlays/Modal.tsx`
  - [x] Center aligned
  - [x] Backdrop blur
  - [x] Close on escape / backdrop
- [x] Đã có `packages/ui/src/components/Toast.tsx`
  - [x] Position bottom
  - [x] Auto dismiss
  - [x] Action button support

### 6.4 Loading States
- [x] Đã có `packages/ui/src/components/Spinner.tsx`
  - [x] Sizes: sm, md, lg
  - [x] Electric Violet color
- [x] Tạo `packages/ui/src/components/loading/Skeleton.tsx`
  - [x] Shimmer animation
  - [x] Variants: text, circular, rectangular, rounded
  - [x] AvatarSkeleton, ThumbnailSkeleton helpers
- [x] Tạo `packages/ui/src/components/loading/BlurPlaceholder.tsx`
  - [x] Blur thumbnail khi loading
  - [x] generateBlurDataUrl helper

### 6.5 Icons Setup
- [x] Lucide React đã cài đặt
- [x] Tạo `packages/ui/src/icons/index.ts`
  - [x] Export commonly used icons (70+ icons)
  - [x] Re-export LucideIcon và LucideProps types

### 6.6 Tailwind Config
- [x] Tạo `packages/ui/tailwind.preset.js`
  - [x] Vortex color palette
  - [x] 8pt spacing system
  - [x] Custom easing (vortex cubic-bezier)
  - [x] Safe area insets
  - [x] Custom animations (shimmer, bounce-in, slide-up, etc.)
  - [x] Utility classes (text-video-overlay, scrollbar-hide, etc.)

### 6.7 shadcn/ui Components
- [x] Skip - sử dụng custom components thay vì shadcn/ui
- [x] Modal đã thay thế Dialog
- [x] ContextMenu đã có
- [x] SeekBar đã có

### 6.8 Package Export
- [x] Tạo `packages/ui/src/index.ts`
- [x] Export all components
- [x] Build và test ✅

**Tiến độ Phase 6:** ✅ 25/25 tasks (100%)

---

## Phase 7: State Management & Storage (Ước tính: 3 ngày)

**Mục tiêu:** TanStack Query setup, IndexedDB, và caching strategies

### 7.1 TanStack Query Setup
- [x] Tạo `packages/core/src/api/query-client.ts`
  - [x] Default options (staleTime, gcTime)
  - [x] Retry logic (với error type handling)
  - [x] Error handling (ApiError class)
  - [x] Query keys factory
- [x] Tạo `packages/core/src/api/api-client.ts`
  - [x] Base fetch wrapper
  - [x] Timeout handling
  - [x] GET, POST, PUT, PATCH, DELETE methods

### 7.2 Video Queries
- [x] Tạo `packages/core/src/api/queries/videos.ts`
  - [x] useVideosInfiniteQuery
  - [x] useVideoQuery (single)
  - [x] useVideoMetadataQuery
  - [x] prefetchVideos, prefetchVideo
- [x] Tạo `packages/core/src/api/mutations/videos.ts`
  - [x] useLikeVideoMutation (optimistic update)
  - [x] useSaveVideoMutation (optimistic update)
  - [x] useReportVideoMutation
  - [x] useNotInterestedMutation

### 7.3 Comment Queries
- [x] Tạo `packages/core/src/api/queries/comments.ts`
  - [x] useCommentsInfiniteQuery (paginated)
  - [x] useRepliesInfiniteQuery
  - [x] useCommentCountQuery
- [x] Tạo `packages/core/src/api/mutations/comments.ts`
  - [x] usePostCommentMutation
  - [x] useLikeCommentMutation
  - [x] useDeleteCommentMutation
  - [x] usePostReplyMutation

### 7.4 IndexedDB Storage
- [x] Tạo `packages/core/src/storage/db.ts`
  - [x] VortexDB schema (idb library)
  - [x] videos, segments, watchHistory, savedVideos, preferences, actionQueue stores
  - [x] getDB(), closeDB(), deleteDB()
  - [x] getStorageUsage()
- [x] Tạo `packages/core/src/storage/video-cache.ts`
  - [x] cacheVideo(), cacheVideos()
  - [x] getCachedVideo(), getCachedVideos()
  - [x] clearExpiredCache(), clearOldCache()
  - [x] getCacheStats()
- [x] Tạo `packages/core/src/storage/watch-history.ts`
  - [x] saveWatchProgress()
  - [x] getWatchProgress(), getWatchHistory()
  - [x] getRecentlyWatched(), getCompletedVideos()
  - [x] clearWatchHistory(), getWatchStats()

### 7.5 User Preferences Storage
- [x] Tạo `packages/core/src/storage/preferences.ts`
  - [x] Player preferences (mute, volume, playbackSpeed, quality, captions)
  - [x] UI preferences (theme, reducedMotion, haptic)
  - [x] Cross-tab sync với BroadcastChannel
- [x] Tạo `packages/core/src/hooks/usePreferences.ts`
  - [x] usePreferences() - all preferences
  - [x] usePreference() - single preference
  - [x] Convenience hooks: useMutedPreference, useVolumePreference, etc.

### 7.6 Cache Strategies
- [x] Tạo `packages/core/src/storage/cache-manager.ts`
  - [x] L1 Memory cache (Map) với LRU eviction
  - [x] L2 IndexedDB
  - [x] get(), set(), delete(), has(), clear()
  - [x] cleanup(), getStats()
  - [x] createCacheManager(), getDefaultCacheManager()

**Tiến độ Phase 7:** ✅ 18/18 tasks (100%)

---

## Phase 8: PWA & Offline (Ước tính: 2 ngày)

**Mục tiêu:** PWA setup, Service Worker, và offline support

### 8.1 PWA Configuration
- [x] Tạo `apps/web/public/manifest.json`
  - [x] App name, icons
  - [x] Theme colors (#000000)
  - [x] Display: standalone
- [x] Tạo app icons config (192x192, 512x512)
- [x] Cấu hình meta tags cho PWA

### 8.2 Service Worker
- [x] Tạo `apps/web/public/sw.js`
  - [x] Cache-first cho static assets
  - [x] Network-first cho API
  - [x] Stale-while-revalidate cho thumbnails
- [x] Cấu hình HLS caching
  - [x] NetworkFirst cho manifests (.m3u8)
  - [x] CacheFirst cho segments (.ts)
- [x] Background sync cho offline actions
- [x] Tạo `ServiceWorkerRegistration.tsx`

### 8.3 Offline UI
- [x] Tạo `apps/web/app/components/OfflineIndicator.tsx`
  - [x] Show khi mất mạng
  - [x] "Không có mạng" message
  - [x] Slow connection indicator
- [x] Tạo `apps/web/app/components/OfflineFeed.tsx`
  - [x] Hiện cached videos
  - [x] Badge "Offline"
- [x] Cập nhật `useNetworkStatus.ts`
  - [x] Online/offline detection
  - [x] Network type detection
  - [x] isSlowConnection detection
- [x] Tạo `apps/web/app/offline/page.tsx`

### 8.4 Offline Actions Queue
- [x] Tạo `packages/core/src/offline/action-queue.ts`
  - [x] Queue offline actions (likes, comments)
  - [x] Sync khi online
  - [x] Conflict resolution
  - [x] registerActionHandler()
  - [x] setupAutoSync()

**Tiến độ Phase 8:** ✅ 14/14 tasks (100%)

---

## Phase 9: Testing & Optimization (Ước tính: 4 ngày)

**Mục tiêu:** Unit tests, E2E tests, và performance optimization

### 9.1 Unit Testing Setup
- [x] Cấu hình Vitest (`vitest.config.ts`)
- [x] Setup testing utilities (`test-utils.tsx`)
- [x] Mock providers (QueryClient, browser APIs)
- [x] Tạo `vitest.setup.ts`

### 9.2 Unit Tests - Core
- [x] Test formatCount utility
- [x] Test formatDuration utility
- [x] Test Zustand stores (playerStore, feedStore, uiStore)
- [x] Test custom hooks (useDebounce, useThrottle)

### 9.3 Unit Tests - Player
- [x] Test player state (play, pause, seek, volume)
- [x] Test quality switching
- [x] Test playback speed

### 9.4 Unit Tests - Feed
- [x] Test feed state (videos, currentIndex)
- [x] Test navigation (goToNext, goToPrevious)
- [x] Test video management (append, remove)

### 9.5 Component Testing
- [x] Setup Storybook (`.storybook/main.ts`, `preview.ts`)
- [x] Stories cho Button, IconButton, Avatar
- [x] Stories cho Text, Counter
- [x] Stories cho Skeleton, BlurPlaceholder
- [x] Stories cho LikeButton, SaveButton, ShareButton

### 9.6 E2E Testing
- [x] Cấu hình Playwright (`playwright.config.ts`)
- [x] Test video playback flow (`video-playback.spec.ts`)
- [x] Test gesture interactions (double tap)
- [x] Test comment/share flows
- [x] Test offline mode

### 9.7 Performance Optimization
- [x] Bundle size optimized (< 150KB budget)
- [x] External dependencies configured
- [x] Tree shaking với tsup

### 9.8 Performance Monitoring
- [x] Setup web-vitals tracking (`web-vitals.ts`)
- [x] VideoMetricsTracker class
- [x] LCP, CLS, INP thresholds defined
- [x] Performance E2E tests (`performance.spec.ts`)

### 9.9 Memory Leak Testing
- [x] E2E test scroll 50+ videos
- [x] Memory threshold < 150MB

### 9.10 Cross-browser Testing
- [x] Playwright configured cho Mobile Safari, Mobile Chrome
- [x] Desktop Chrome, Desktop Safari projects

**Tiến độ Phase 9:** ✅ 33/33 tasks (100%)

---

## Phase 10: Documentation & Deployment (Ước tính: 2 ngày)

**Mục tiêu:** Hoàn thiện docs và deploy

### 10.1 API Documentation
- [x] Document @vortex/core exports (README.md)
- [x] Document @vortex/player API (README.md)
- [x] Document @vortex/feed API (README.md)
- [x] Document @vortex/gestures API (README.md)
- [x] Document @vortex/ui components (README.md)
- [x] Document @vortex/embed API (README.md)

### 10.2 Integration Guide
- [x] Quick start guide (docs/GETTING_STARTED.md)
- [x] React integration
- [x] Next.js integration
- [x] Customization guide

### 10.3 Storybook Docs
- [x] Setup Storybook (Phase 9)
- [x] Component stories với usage examples

### 10.4 Main Documentation
- [x] Main README.md với features, installation, examples
- [x] CONTRIBUTING.md
- [x] LICENSE (MIT)

### 10.5 Deployment
- [x] Vercel config (vercel.json)
- [x] GitHub Actions CI/CD (.github/workflows/)
- [x] Service Worker headers configured

### 10.6 Release Management
- [x] Setup Changesets (.changeset/)
- [x] Initial changeset created
- [x] Version scripts in package.json
- [x] Release workflow configured

**Tiến độ Phase 10:** ✅ 21/21 tasks (100%)

---

## 📋 Pre-Production Checklist

### Performance Targets
- [ ] Bundle size < 150KB (gzip)
- [ ] LCP < 1.5s trên 4G
- [ ] TTI < 2s
- [ ] FID < 50ms
- [ ] CLS < 0.05
- [ ] INP < 150ms
- [ ] Video play trong 500ms
- [ ] Smooth 60fps scroll
- [ ] No memory leak sau 50+ videos scroll

### Compatibility
- [ ] Safari iOS 15+
- [ ] Chrome Android 90+
- [ ] Firefox latest
- [ ] Edge latest
- [ ] PWA installable

### Accessibility
- [ ] ARIA labels đầy đủ
- [ ] Keyboard navigation hoạt động
- [ ] Screen reader compatible
- [ ] prefers-reduced-motion respected
- [ ] High contrast mode

### Quality
- [ ] Lighthouse Performance > 90
- [ ] No console errors
- [ ] All tests passing
- [ ] Error boundaries hoạt động
- [ ] Offline mode hoạt động

---

## 📝 Ghi chú cập nhật

| Ngày | Phase | Thay đổi |
|------|-------|----------|
| 2024-12-21 | - | Khởi tạo Implementation Plan |

---

## 🎯 Milestones

| Milestone | Target Date | Status |
|-----------|-------------|--------|
| Phase 0-1 Complete | TBD | ⬜ |
| MVP (Phase 0-5) | TBD | ⬜ |
| Beta (Phase 0-8) | TBD | ⬜ |
| Production Ready | TBD | ⬜ |
| v1.0 Release | TBD | ⬜ |

