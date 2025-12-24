/**
 * @xhub-reel/embed
 *
 * Embeddable video feed widget for XHubReel
 * Can be integrated into any website
 */

// Re-export core types
export type { Video, VideoStats, Author, Comment, Reply } from '@xhub-reel/core'

// Re-export useful components
export { VideoPlayer, type VideoPlayerProps } from '@xhub-reel/player'
export { VideoFeed, VideoFeedItem, type VideoFeedProps, type VideoFeedItemProps } from '@xhub-reel/feed'
export {
  ActionBar,
  BottomSheet,
  IconButton,
  PlayPauseOverlay,
  Spinner,
  Toast,
} from '@xhub-reel/ui'
export { useVideoGestures, type VideoGestureHandlers } from '@xhub-reel/gestures'

// Embed-specific exports
export { XHubReelEmbed, type XHubReelEmbedProps } from './XHubReelEmbed'
export { createXHubReelEmbed, type XHubReelEmbedOptions } from './createEmbed'

