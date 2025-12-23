/**
 * @vortex/feed - Components
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

// API mode - automatic data fetching
export { ConnectedVideoFeed, type ConnectedVideoFeedProps } from './ConnectedVideoFeed'

