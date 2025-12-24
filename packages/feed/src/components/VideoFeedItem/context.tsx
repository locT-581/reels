/**
 * VideoFeedItem Context - Shared state for compound components
 */

'use client'

import { createContext, useContext, type RefObject } from 'react'
import type { Video } from '@vortex/core'

export interface VideoFeedItemContextValue {
  // Video data
  video: Video
  isActive: boolean
  shouldRenderVideo: boolean
  preload: '' | 'none' | 'metadata' | 'auto'
  /** Video has been preloaded and first frame is ready */
  isPreloaded: boolean

  // Refs
  containerRef: RefObject<HTMLDivElement | null>
  videoRef: RefObject<HTMLVideoElement | null>

  // Player state
  isPlaying: boolean
  showPauseOverlay: boolean
  timelineExpanded: boolean

  // Player controls
  play: () => Promise<void>
  pause: () => void
  seek: (time: number) => void

  // UI controls
  setShowPauseOverlay: (show: boolean) => void
  setTimelineExpanded: (expanded: boolean) => void

  // Gesture bindings
  gestureBindings: () => Record<string, unknown>

  // Heart animation
  showHeart: boolean
  heartPosition: { x: number; y: number }
  triggerHeart: (x: number, y: number) => void

  // Callbacks
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
  onAuthorClick?: () => void

  // Seek handlers
  handleSeekStart: () => void
  handleSeekEnd: (time: number) => void
}

export const VideoFeedItemContext = createContext<VideoFeedItemContextValue | null>(null)

export function useVideoFeedItemContext(): VideoFeedItemContextValue {
  const context = useContext(VideoFeedItemContext)
  if (!context) {
    throw new Error(
      'VideoFeedItem compound components must be used within a VideoFeedItem'
    )
  }
  return context
}

