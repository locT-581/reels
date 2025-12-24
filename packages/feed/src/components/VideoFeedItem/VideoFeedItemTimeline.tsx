/**
 * VideoFeedItemTimeline - Timeline/seek bar with seek preview
 *
 * Renders the video progress timeline with optional thumbnail preview.
 * Must be used within VideoFeedItem.
 *
 * @example
 * ```tsx
 * // Basic usage
 * <VideoFeedItemTimeline />
 *
 * // With seek preview (time indicator only)
 * <VideoFeedItemTimeline showPreview />
 *
 * // With thumbnail preview
 * <VideoFeedItemTimeline
 *   showPreview
 *   getThumbnailUrl={(time) => `/api/thumbnails/${videoId}?t=${Math.floor(time)}`}
 * />
 * ```
 */

'use client'

import { forwardRef, useCallback, type HTMLAttributes } from 'react'
import { Timeline } from '@xhub-reel/player'
import { useVideoFeedItemContext } from './context'

export interface VideoFeedItemTimelineProps extends HTMLAttributes<HTMLDivElement> {
  /** Override expanded state */
  expanded?: boolean
  /** Enable seek preview popup while dragging (default: false) */
  showPreview?: boolean
  /**
   * Get thumbnail URL for a specific time (seconds)
   * If not provided, only time indicator will be shown during seek
   * @example (time) => `/api/thumbnails/${videoId}?t=${Math.floor(time)}`
   */
  getThumbnailUrl?: (time: number) => string | undefined
  /** Preview thumbnail width (default: 120) */
  previewWidth?: number
  /** Preview thumbnail height (default: 68) */
  previewHeight?: number
}

const VideoFeedItemTimeline = forwardRef<HTMLDivElement, VideoFeedItemTimelineProps>(
  (
    {
      expanded: expandedProp,
      showPreview = false,
      getThumbnailUrl,
      previewWidth,
      previewHeight,
      ...props
    },
    ref
  ) => {
    const {
      video,
      videoRef,
      shouldRenderVideo,
      timelineExpanded,
      setTimelineExpanded,
      handleSeekStart,
      handleSeekEnd,
    } = useVideoFeedItemContext()

    // Default thumbnail URL generator using video thumbnail as fallback
    // Real implementation would use sprite sheets or frame extraction
    const defaultGetThumbnailUrl = useCallback(
      (_time: number): string | undefined => {
        // For now, return the video thumbnail as a fallback
        // In production, this would return a specific frame thumbnail
        return video.thumbnail || undefined
      },
      [video.thumbnail]
    )

    if (!shouldRenderVideo) {
      return null
    }

    return (
      <div ref={ref} {...props}>
        <Timeline
          videoRef={videoRef}
          expanded={expandedProp ?? timelineExpanded}
          onSeekStart={handleSeekStart}
          onSeekEnd={handleSeekEnd}
          onExpandedChange={setTimelineExpanded}
          // Preview options
          showPreview={showPreview}
          getThumbnailUrl={getThumbnailUrl ?? (showPreview ? defaultGetThumbnailUrl : undefined)}
          previewWidth={previewWidth}
          previewHeight={previewHeight}
        />
      </div>
    )
  }
)

VideoFeedItemTimeline.displayName = 'VideoFeedItemTimeline'

export { VideoFeedItemTimeline }
