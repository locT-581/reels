/**
 * VideoFeedItemPlayer - Video player component
 *
 * Renders the video element or placeholder based on context state.
 * Must be used within VideoFeedItem.
 */

'use client'

import { forwardRef, type HTMLAttributes } from 'react'
import { useVideoFeedItemContext } from './context'
import { videoFeedItemStyles } from '../styles'

export interface VideoFeedItemPlayerProps extends HTMLAttributes<HTMLDivElement> {
  /** Custom placeholder element */
  placeholder?: React.ReactNode
}

const VideoFeedItemPlayer = forwardRef<HTMLVideoElement, VideoFeedItemPlayerProps>(
  ({ placeholder, ...props }, ref) => {
    const { video, videoRef, shouldRenderVideo, preload } = useVideoFeedItemContext()

    if (!shouldRenderVideo) {
      return (
        placeholder ?? (
          <div
            {...props}
            style={{
              ...videoFeedItemStyles.placeholder,
              backgroundImage: `url(${video.thumbnail})`,
              ...props.style,
            }}
          />
        )
      )
    }

    return (
      <video
        ref={(node) => {
          // Handle both forwarded ref and internal ref
          if (typeof ref === 'function') {
            ref(node)
          } else if (ref) {
            ref.current = node
          }
          ;(videoRef as React.MutableRefObject<HTMLVideoElement | null>).current = node
        }}
        src={video.url}
        poster={video.thumbnail}
        preload={preload}
        loop
        playsInline
        muted
        style={videoFeedItemStyles.video}
      />
    )
  }
)

VideoFeedItemPlayer.displayName = 'VideoFeedItemPlayer'

export { VideoFeedItemPlayer }
