/**
 * VideoPlayer - Main video player component
 */

'use client'

import {
  forwardRef,
  useRef,
  useEffect,
  useImperativeHandle,
  useCallback,
  useState,
  type ReactNode,
} from 'react'
import { PlayerCore } from '../core/player-core'
import { usePlayback } from '../hooks/usePlayback'
import { useVolume } from '../hooks/useVolume'
import type { Video, PlayerState, PlaybackSpeed, QualityLevel } from '@vortex/core'

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
  /** Custom className */
  className?: string
  /** Children to render over video (overlays) */
  children?: ReactNode
  
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

export const VideoPlayer = forwardRef<VideoPlayerRef, VideoPlayerProps>(
  (
    {
      video,
      autoPlay = true,
      muted = true,
      loop = true,
      poster,
      className = '',
      children,
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
    const playerCoreRef = useRef<PlayerCore | null>(null)
    const [isReady, setIsReady] = useState(false)

    // Get video URL
    const videoUrl = typeof video === 'string' ? video : video.url
    const videoPoster = poster ?? (typeof video === 'object' ? video.thumbnail : undefined)

    // Hooks
    const playback = usePlayback(videoRef)
    const volume = useVolume(videoRef)

    // Initialize player core
    useEffect(() => {
      if (!videoRef.current || !videoUrl) return

      // Destroy existing
      if (playerCoreRef.current) {
        playerCoreRef.current.destroy()
      }

      // Create new player core
      playerCoreRef.current = new PlayerCore({
        callbacks: {
          onStateChange: (state) => {
            onStateChange?.(state)
            if (state === 'ready' && !isReady) {
              setIsReady(true)
              onReady?.()
            }
          },
          onError: (error, recoverable) => {
            if (!recoverable) {
              onError?.(error)
            }
          },
          onQualityLevelsLoaded: (levels) => {
            onQualityLevelsLoaded?.(levels)
          },
          onTimeUpdate: (currentTime, duration) => {
            onTimeUpdate?.(currentTime, duration)
          },
        },
      })

      playerCoreRef.current.attach(videoRef.current, videoUrl)

      return () => {
        playerCoreRef.current?.destroy()
        playerCoreRef.current = null
      }
    }, [videoUrl])

    // Handle auto-play and mute
    useEffect(() => {
      const videoEl = videoRef.current
      if (!videoEl) return

      videoEl.muted = muted
      videoEl.loop = loop

      if (autoPlay && isReady) {
        videoEl.play().catch((e) => {
          // Autoplay blocked, try muted
          if (e.name === 'NotAllowedError') {
            videoEl.muted = true
            videoEl.play().catch(() => {})
          }
        })
      }
    }, [autoPlay, muted, loop, isReady])

    // Video event handlers
    const handlePlay = useCallback(() => {
      onPlay?.()
    }, [onPlay])

    const handlePause = useCallback(() => {
      onPause?.()
    }, [onPause])

    const handleEnded = useCallback(() => {
      onEnded?.()
    }, [onEnded])

    // Expose player controls via ref
    useImperativeHandle(
      ref,
      () => ({
        play: playback.play,
        pause: playback.pause,
        togglePlay: playback.togglePlay,
        seek: playback.seek,
        seekForward: playback.seekForward,
        seekBackward: playback.seekBackward,
        restart: playback.restart,
        setVolume: volume.setVolume,
        toggleMute: volume.toggleMute,
        setPlaybackSpeed: playback.setPlaybackSpeed,
        setQuality: (level: number) => {
          playerCoreRef.current?.setQuality(level)
        },
        getQualityLevels: () => {
          return playerCoreRef.current?.getQualityLevels() ?? []
        },
        getVideoElement: () => videoRef.current,
        getCurrentTime: () => videoRef.current?.currentTime ?? 0,
        getDuration: () => videoRef.current?.duration ?? 0,
        isPaused: () => videoRef.current?.paused ?? true,
      }),
      [playback, volume]
    )

    return (
      <div className={`relative w-full h-full bg-black ${className}`}>
        <video
          ref={videoRef}
          poster={videoPoster}
          playsInline
          preload="auto"
          className="w-full h-full object-cover"
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
        />
        {children}
      </div>
    )
  }
)

VideoPlayer.displayName = 'VideoPlayer'
