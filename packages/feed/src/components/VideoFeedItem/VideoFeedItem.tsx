/**
 * VideoFeedItem - Root component for compound pattern
 *
 * Shadcn-style Usage:
 * ```tsx
 * import {
 *   VideoFeedItem,
 *   VideoFeedItemPlayer,
 *   VideoFeedItemOverlay,
 *   VideoFeedItemActions,
 *   VideoFeedItemTimeline,
 * } from '@xhub-reel/feed'
 *
 * <VideoFeedItem video={video} isActive={isActive}>
 *   <VideoFeedItemPlayer />
 *   <VideoFeedItemOverlay />
 *   <VideoFeedItemActions onLike={handleLike} />
 *   <VideoFeedItemTimeline />
 * </VideoFeedItem>
 * ```
 *
 * Or use the default composition:
 * ```tsx
 * <VideoFeedItem video={video} isActive={isActive} />
 * ```
 */

'use client'

import { forwardRef, type ReactNode, type CSSProperties } from 'react'
import { mergeStyles, type Video } from '@xhub-reel/core'
import type { PreloadPriority } from '../../hooks/usePreloader'
import { videoFeedItemStyles } from '../styles'
import { VideoFeedItemContext } from './context'
import { useVideoFeedItemState } from './useVideoFeedItemState'
import { VideoFeedItemPlayer } from './VideoFeedItemPlayer'
import { VideoFeedItemActions } from './VideoFeedItemActions'
import { VideoFeedItemTimeline } from './VideoFeedItemTimeline'
import { VideoFeedItemOverlay } from './VideoFeedItemOverlay'

export interface VideoFeedItemProps {
  /** Video data */
  video: Video
  /** Whether this is the currently active video */
  isActive?: boolean
  /** Preload priority */
  priority?: PreloadPriority
  /** Show timeline (default: true, only used with default children) */
  showTimeline?: boolean
  /** Called when video is liked */
  onLike?: () => void
  /** Called when comments button is pressed */
  onComment?: () => void
  /** Called when share button is pressed */
  onShare?: () => void
  /** Called when author is clicked */
  onAuthorClick?: () => void
  /** Custom styles override */
  style?: CSSProperties
  /** Custom className (for external CSS if needed) */
  className?: string
  /** Custom children for compound component pattern */
  children?: ReactNode
}

/**
 * VideoFeedItem - Root container for video feed items
 *
 * Provides context for all child components.
 * Use with VideoFeedItemPlayer, VideoFeedItemActions, etc.
 */
const VideoFeedItem = forwardRef<HTMLDivElement, VideoFeedItemProps>(
  (
    {
      video,
      isActive = false,
      priority = 'none',
      showTimeline = true,
      onLike,
      onComment,
      onShare,
      onAuthorClick,
      style,
      className = '',
      children,
    },
    ref
  ) => {
    const state = useVideoFeedItemState({
      video,
      isActive,
      priority,
      onLike,
      onComment,
      onShare,
      onAuthorClick,
    })

    // Default children if none provided (backward compatibility)
    const content = children ?? (
      <>
        <VideoFeedItemPlayer />
        <VideoFeedItemOverlay />
        <VideoFeedItemActions />
        {showTimeline && <VideoFeedItemTimeline />}
      </>
    )

    return (
      <VideoFeedItemContext.Provider value={state}>
        <div
          ref={(node) => {
            // Handle both internal ref and forwarded ref
            if (typeof ref === 'function') {
              ref(node)
            } else if (ref) {
              ref.current = node
            }
            // Update internal containerRef
            ;(state.containerRef as React.MutableRefObject<HTMLDivElement | null>).current = node
          }}
          style={mergeStyles(videoFeedItemStyles.container, style)}
          className={className}
          {...state.gestureBindings()}
        >
          {content}
        </div>
      </VideoFeedItemContext.Provider>
    )
  }
)

VideoFeedItem.displayName = 'VideoFeedItem'

export { VideoFeedItem }
