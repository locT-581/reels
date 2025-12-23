/**
 * VideoFeedItem - Re-export from compound component structure
 *
 * For new code, import directly from '@vortex/feed'
 */

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
  // Context
  useVideoFeedItemContext,
  type VideoFeedItemContextValue,
  // State hook
  useVideoFeedItemState,
  type UseVideoFeedItemStateOptions,
} from './VideoFeedItem/index'
