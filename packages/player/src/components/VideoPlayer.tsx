/**
 * VideoPlayer - Main video player component
 *
 * Uses the usePlayer hook for all player logic.
 * CSS Variables + Inline Styles for maximum customizability.
 */

'use client'

import {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  type ReactNode,
  type CSSProperties,
} from 'react'
import { colors, mergeStyles } from '@xhub-reel/core'
import type { Video, PlayerState, PlaybackSpeed, QualityLevel } from '@xhub-reel/core'
import { usePlayer } from '../hooks/usePlayer'

export interface VideoPlayerProps {
  /** Video object or source URL */
  video: Video | string
  /** Auto play on mount */
  autoPlay?: boolean
  /** Start muted */
  muted?: boolean
  /** Loop video */
  loop?: boolean
  /** Poster image URL */
  poster?: string
  /** Children to render over video (overlays) */
  children?: ReactNode
  /** Custom styles override */
  style?: CSSProperties
  /** Custom className (for external CSS if needed) */
  className?: string

  // Callbacks
  onPlay?: () => void
  onPause?: () => void
  onEnded?: () => void
  onError?: (error: Error) => void
  onStateChange?: (state: PlayerState) => void
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onQualityLevelsLoaded?: (levels: QualityLevel[]) => void
  onReady?: () => void
}

export interface VideoPlayerRef {
  // Playback
  play: () => Promise<void>
  pause: () => void
  togglePlay: () => Promise<void>
  seek: (time: number) => void
  seekForward: (seconds?: number) => void
  seekBackward: (seconds?: number) => void
  restart: () => void

  // Volume
  setVolume: (volume: number) => void
  toggleMute: () => void

  // Speed
  setPlaybackSpeed: (speed: PlaybackSpeed) => void

  // Quality
  setQuality: (level: number) => void
  getQualityLevels: () => QualityLevel[]

  // State
  getVideoElement: () => HTMLVideoElement | null
  getCurrentTime: () => number
  getDuration: () => number
  isPaused: () => boolean
}

// =============================================================================
// STYLES
// =============================================================================

const containerStyles: CSSProperties = {
  position: 'relative',
  width: '100%',
  height: '100%',
  backgroundColor: colors.background,
}

const videoStyles: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'contain',
}

// =============================================================================
// COMPONENT
// =============================================================================

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  (
    {
      video,
      autoPlay = true,
      muted = true,
      loop = true,
      poster,
      children,
      style,
      className = '',
      onPlay,
      onPause,
      onEnded,
      onError,
      onStateChange,
      onTimeUpdate,
      onQualityLevelsLoaded,
      onReady,
    },
    ref
  ) => {
    const videoRef = useRef<HTMLVideoElement>(null)
    const containerRef = useRef<HTMLDivElement>(null)

    // Get video URL and poster
    const videoUrl = typeof video === 'string' ? video : video.url
    const videoPoster = poster ?? (typeof video === 'object' ? video.thumbnail : undefined)

    // Use the unified player hook
    const player = usePlayer(videoRef, containerRef, {
      onStateChange,
      onError: (error) => onError?.(error),
      onTimeUpdate,
      onQualityLevelsLoaded,
      onPlay,
      onPause,
      onEnded,
      onReady,
    })

    // Attach player when URL changes
    useEffect(() => {
      if (videoUrl) {
        player.attach(videoUrl)
      }

      return () => {
        player.destroy()
      }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [videoUrl]) // player.attach and player.destroy are stable

    // Handle video element attributes
    useEffect(() => {
      const videoEl = videoRef.current
      if (!videoEl) return

      videoEl.muted = muted
      videoEl.loop = loop
    }, [muted, loop])

    // Handle auto-play when ready
    useEffect(() => {
      const videoEl = videoRef.current
      if (!videoEl || !player.isReady || !autoPlay) return

      videoEl.play().catch((e) => {
        // Autoplay blocked, try muted
        if (e.name === 'NotAllowedError') {
          videoEl.muted = true
          videoEl.play().catch(() => {})
        }
      })
    }, [autoPlay, player.isReady])

    // Expose player controls via ref
    useImperativeHandle(
      ref,
      () => ({
        play: player.play,
        pause: player.pause,
        togglePlay: player.togglePlay,
        seek: player.seek,
        seekForward: player.seekForward,
        seekBackward: player.seekBackward,
        restart: player.restart,
        setVolume: player.volume.setVolume,
        toggleMute: player.volume.toggleMute,
        setPlaybackSpeed: player.setPlaybackSpeed,
        setQuality: player.quality.setQuality,
        getQualityLevels: () => player.quality.availableLevels,
        getVideoElement: () => videoRef.current,
        getCurrentTime: () => player.progress.currentTime,
        getDuration: () => player.progress.duration,
        isPaused: () => videoRef.current?.paused ?? true,
      }),
      [player]
    )

    return (
      <div
        ref={containerRef}
        style={mergeStyles(containerStyles, style)}
        className={className}
      >
        <video
          ref={videoRef}
          poster={videoPoster}
          playsInline
          preload="auto"
          style={videoStyles}
        />
        {children}
      </div>
    )
  }
)

VideoPlayer.displayName = 'VideoPlayer'
