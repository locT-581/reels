/**
 * @xhub-reel/feed - Components
 */

// Manual mode - pass videos directly
export { VideoFeed, type VideoFeedProps, type VideoFeedRef } from './VideoFeed'
export {
  // Root component
  VideoFeedItem,
  type VideoFeedItemProps,
  // Sub-components (Shadcn-style)
  VideoFeedItemPlayer,
  type VideoFeedItemPlayerProps,
  VideoFeedItemActions,
  type VideoFeedItemActionsProps,
  VideoFeedItemTimeline,
  type VideoFeedItemTimelineProps,
  VideoFeedItemOverlay,
  type VideoFeedItemOverlayProps,
  // Context (for custom sub-components)
  useVideoFeedItemContext,
  type VideoFeedItemContextValue,
} from './VideoFeedItem'
export { VideoOverlay, type VideoOverlayProps } from './VideoOverlay'

// API mode - automatic data fetching (with optional pooling)
export { ConnectedVideoFeed, type ConnectedVideoFeedProps } from './ConnectedVideoFeed'

// Manual mode with pooling (without API integration)
export { PooledVideoFeed, type PooledVideoFeedProps } from './PooledVideoFeed'

