/**
 * VideoFeedItem - Shadcn-style Compound Components
 *
 * @example Basic usage (auto-composed)
 * ```tsx
 * import { VideoFeedItem } from '@vortex/feed'
 *
 * <VideoFeedItem
 *   video={video}
 *   isActive={isActive}
 *   onLike={handleLike}
 * />
 * ```
 *
 * @example Compound components (custom composition)
 * ```tsx
 * import {
 *   VideoFeedItem,
 *   VideoFeedItemPlayer,
 *   VideoFeedItemOverlay,
 *   VideoFeedItemActions,
 *   VideoFeedItemTimeline,
 * } from '@vortex/feed'
 *
 * <VideoFeedItem video={video} isActive={isActive}>
 *   <VideoFeedItemPlayer />
 *   <VideoFeedItemOverlay showVideoInfo={false} />
 *   <VideoFeedItemActions onLike={handleLike} />
 *   <VideoFeedItemTimeline />
 * </VideoFeedItem>
 * ```
 */

// Root component
export { VideoFeedItem, type VideoFeedItemProps } from './VideoFeedItem'

// Sub-components (Shadcn-style separate exports)
export { VideoFeedItemPlayer, type VideoFeedItemPlayerProps } from './VideoFeedItemPlayer'
export { VideoFeedItemActions, type VideoFeedItemActionsProps } from './VideoFeedItemActions'
export { VideoFeedItemTimeline, type VideoFeedItemTimelineProps } from './VideoFeedItemTimeline'
export { VideoFeedItemOverlay, type VideoFeedItemOverlayProps } from './VideoFeedItemOverlay'

// Context hook (for building custom sub-components)
export { useVideoFeedItemContext, type VideoFeedItemContextValue } from './context'

// State hook (for advanced customization)
export { useVideoFeedItemState, type UseVideoFeedItemStateOptions } from './useVideoFeedItemState'
