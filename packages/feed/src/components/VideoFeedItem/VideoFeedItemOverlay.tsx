/**
 * VideoFeedItemOverlay - Video overlay components
 *
 * Renders play/pause, heart animation, and video info overlays.
 * Must be used within VideoFeedItem.
 */

'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { PlayPauseOverlay, DoubleTapHeart } from '@vortex/player'
import { VideoOverlay } from '../VideoOverlay'
import { useVideoFeedItemContext } from './context'

export interface VideoFeedItemOverlayProps extends HTMLAttributes<HTMLDivElement> {
  /** Show play/pause overlay. Default: true */
  showPlayPause?: boolean
  /** Show heart animation on double tap. Default: true */
  showDoubleTapHeart?: boolean
  /** Show video info overlay (author, description). Default: true */
  showVideoInfo?: boolean
}

const VideoFeedItemOverlay = forwardRef<HTMLDivElement, VideoFeedItemOverlayProps>(
  (
    {
      showPlayPause = true,
      showDoubleTapHeart = true,
      showVideoInfo = true,
      ...props
    },
    ref
  ) => {
    const {
      video,
      isPlaying,
      showPauseOverlay,
      timelineExpanded,
      showHeart,
      heartPosition,
      onAuthorClick,
    } = useVideoFeedItemContext()

    return (
      <div ref={ref} {...props}>
        {showPlayPause && (
          <PlayPauseOverlay
            isPlaying={isPlaying}
            show={showPauseOverlay}
            size={64}
            autoHideDelay={800}
            showOnStateChange={false}
          />
        )}

        {showDoubleTapHeart && (
          <DoubleTapHeart
            show={showHeart}
            position={heartPosition}
            size={100}
            showParticles={true}
            particleCount={8}
          />
        )}

        {showVideoInfo && (
          <VideoOverlay
            video={video}
            onAuthorClick={onAuthorClick}
            timelineExpanded={timelineExpanded}
          />
        )}
      </div>
    )
  }
)

VideoFeedItemOverlay.displayName = 'VideoFeedItemOverlay'

export { VideoFeedItemOverlay }
