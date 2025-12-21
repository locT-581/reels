/**
 * @vortex/embed
 *
 * Embeddable video feed widget for VortexStream
 * Can be integrated into any website
 */

// Re-export core types
export type { Video, VideoStats, Author, Comment, Reply } from '@vortex/core'

// Re-export useful components
export { VideoPlayer, type VideoPlayerProps } from '@vortex/player'
export { VideoFeed, VideoFeedItem, type VideoFeedProps, type VideoFeedItemProps } from '@vortex/feed'
export {
  ActionBar,
  BottomSheet,
  IconButton,
  PlayPauseOverlay,
  SeekBar,
  Spinner,
  Toast,
} from '@vortex/ui'
export { useVideoGestures, type VideoGestureHandlers } from '@vortex/gestures'

// Embed-specific exports
export { VortexEmbed, type VortexEmbedProps } from './VortexEmbed'
export { createVortexEmbed, type VortexEmbedOptions } from './createEmbed'

