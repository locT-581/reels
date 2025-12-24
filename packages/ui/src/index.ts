/**
 * @xhub-reel/ui
 *
 * UI components for XHubReel
 * XHubReel design System implementation
 */

// ============================================
// Base Components
// ============================================
export { ActionBar, type ActionBarProps } from './components/ActionBar'
export { IconButton, type IconButtonProps } from './components/IconButton'
export { PlayPauseOverlay, type PlayPauseOverlayProps } from './components/PlayPauseOverlay'
export { ContextMenu, type ContextMenuProps, type ContextMenuOption } from './components/ContextMenu'

// Base
export {
  Button,
  type ButtonProps,
  Avatar,
  type AvatarProps,
} from './components/base'

// ============================================
// Typography
// ============================================
export {
  Text,
  type TextProps,
  Counter,
  type CounterProps,
  Marquee,
  type MarqueeProps,
} from './components/typography'

// ============================================
// Overlays & Sheets
// ============================================
export { BottomSheet, type BottomSheetProps } from './components/BottomSheet'
export { Modal, type ModalProps } from './components/overlays'

// ============================================
// Loading States
// ============================================
export { Spinner, type SpinnerProps } from './components/Spinner'
export { Toast, type ToastProps } from './components/Toast'
export {
  Skeleton,
  AvatarSkeleton,
  ThumbnailSkeleton,
  type SkeletonProps,
  BlurPlaceholder,
  generateBlurDataUrl,
  type BlurPlaceholderProps,
} from './components/loading'

// ============================================
// Interaction Components
// ============================================
export {
  LikeButton,
  type LikeButtonProps,
  SaveButton,
  type SaveButtonProps,
} from './components/interactions'

// ============================================
// Utility Components
// ============================================
export { PullToRefresh, type PullToRefreshProps } from './components/PullToRefresh'

// Animation Components
export {
  DoubleTapHeart,
  useDoubleTapHeart,
  type DoubleTapHeartProps,
  type UseDoubleTapHeartReturn,
} from './components/animations'

// ============================================
// Comment Components
// ============================================
export {
  CommentSheet,
  type CommentSheetProps,
  CommentItem,
  type CommentItemProps,
  CommentInput,
  type CommentInputProps,
  ReplyThread,
  type ReplyThreadProps,
} from './components/comments'

// ============================================
// Share Components
// ============================================
export {
  ShareSheet,
  type ShareSheetProps,
  ShareButton,
  type ShareButtonProps,
  ShareOption,
  type ShareOptionProps,
} from './components/share'

// ============================================
// Utilities
// ============================================
export {
  formatCount,
  formatDuration,
  formatTimestamp,
  truncateText,
  lightHaptic,
  mediumHaptic,
  heavyHaptic,
  selectionHaptic,
  successHaptic,
  errorHaptic,
  supportsHaptic,
} from './utils'

// ============================================
// Feed State Components
// ============================================
export {
  FeedLoadingState,
  FeedErrorState,
  FeedEmptyState,
  FeedNoConfigState,
  feedStateStyles,
  type FeedLoadingStateProps,
  type FeedErrorStateProps,
  type FeedEmptyStateProps,
  type FeedNoConfigStateProps,
} from './components/feed-states'

// ============================================
// Constants
// ============================================
export { ICON_SIZE } from './constants'

// Note: lucide-react icons removed, use project-specific icons
