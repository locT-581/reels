/**
 * VideoFeedItemTimeline - Timeline/seek bar component
 *
 * Renders the video progress timeline.
 * Must be used within VideoFeedItem.
 */

'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { Timeline } from '@vortex/player'
import { useVideoFeedItemContext } from './context'

export interface VideoFeedItemTimelineProps extends HTMLAttributes<HTMLDivElement> {
  /** Override expanded state */
  expanded?: boolean
}

const VideoFeedItemTimeline = forwardRef<HTMLDivElement, VideoFeedItemTimelineProps>(
  ({ expanded: expandedProp, ...props }, ref) => {
    const {
      videoRef,
      shouldRenderVideo,
      timelineExpanded,
      setTimelineExpanded,
      handleSeekStart,
      handleSeekEnd,
    } = useVideoFeedItemContext()

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
        />
      </div>
    )
  }
)

VideoFeedItemTimeline.displayName = 'VideoFeedItemTimeline'

export { VideoFeedItemTimeline }
