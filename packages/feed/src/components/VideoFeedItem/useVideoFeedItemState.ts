/**
 * useVideoFeedItemState - State management for VideoFeedItem compound component
 */

'use client'

import { useRef, useMemo, useState, useCallback } from 'react'
import type { Video } from '@vortex/core'
import {
  useDoubleTapHeart,
  usePlayer,
  type NetworkInfo,
  type PowerInfo,
  type PlaybackMetrics,
  type PreloadManagerOptions,
} from '@vortex/player'
import { useVideoGestures } from '@vortex/gestures'
import { useVideoActivation } from '../../hooks/useVideoActivation'
import { useMemoryManager } from '../../hooks/useMemoryManager'
import type { PreloadPriority } from '../../hooks/usePreloader'
import type { VideoFeedItemContextValue } from './context'

export interface UseVideoFeedItemStateOptions {
  video: Video
  isActive: boolean
  priority: PreloadPriority
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
  onAuthorClick?: () => void
}

export function useVideoFeedItemState({
  video,
  isActive,
  priority,
  onLike,
  onComment,
  onShare,
  onAuthorClick,
}: UseVideoFeedItemStateOptions): VideoFeedItemContextValue {
  // Refs
  const containerRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const wasPlayingBeforeSeekRef = useRef(false)

  // UI State
  const [showPauseOverlay, setShowPauseOverlay] = useState(false)
  const [timelineExpanded, setTimelineExpanded] = useState(false)

  // Heart animation
  const {
    isShowing: showHeart,
    position: heartPosition,
    showHeart: triggerHeart,
  } = useDoubleTapHeart()

  // Preload config
  const preloadConfig: PreloadManagerOptions = useMemo(
    () => ({
      maxConcurrent: 2,
      maxBufferSize: 10 * 1024 * 1024,
      priorityLevels: 10,
    }),
    []
  )

  // Service callbacks
  const handleNetworkChange = useCallback((_info: NetworkInfo) => {
    // UI-only callbacks for toasts/warnings
  }, [])

  const handlePowerChange = useCallback((_info: PowerInfo) => {
    // UI-only callbacks for toasts/warnings
  }, [])

  const handleAnalyticsUpdate = useCallback(
    (metrics: PlaybackMetrics) => {
      if (metrics.startupTime && metrics.startupTime > 1000) {
        console.warn('[VideoFeedItem] Slow startup:', metrics.startupTime, 'ms', video.id)
      }
    },
    [video.id]
  )

  // Player hook
  const { play, pause, seek, state } = usePlayer(videoRef, containerRef, {
    preferNative: true,
    enableSmoothTimeUpdates: true,
    networkBehavior: 'feed',
    powerBehavior: 'moderate',
    preloadConfig,
    enableAnalytics: true,
    onPlay: () => {
      setShowPauseOverlay(false)
      setTimelineExpanded(false)
    },
    onPause: () => {
      if (!videoRef.current?.seeking) {
        setShowPauseOverlay(true)
        setTimelineExpanded(true)
      }
    },
    onNetworkChange: handleNetworkChange,
    onPowerChange: handlePowerChange,
    onAnalyticsUpdate: handleAnalyticsUpdate,
  })

  const isPlaying = state.state === 'playing'

  // Memory management
  const { setInDom, setHasDecodedFrames, shouldDispose } = useMemoryManager({
    videoId: video.id,
    onShouldDispose: () => {
      pause()
      if (videoRef.current) {
        videoRef.current.src = ''
        videoRef.current.load()
      }
    },
  })

  // Video activation
  useVideoActivation({
    videoRef,
    isCurrentVideo: isActive,
    onActivate: () => {
      setHasDecodedFrames(true)
      play()
    },
    onDeactivate: () => {
      setHasDecodedFrames(false)
      pause()
      seek(0)
    },
    autoActivate: false,
  })

  // Mark as in DOM
  void useMemo(() => {
    setInDom(true)
    return () => setInDom(false)
  }, [setInDom])

  // Derived state
  const shouldRenderVideo = !shouldDispose && priority !== 'none'

  const preload = useMemo(() => {
    switch (priority) {
      case 'high':
        return 'auto' as const
      case 'medium':
        return 'metadata' as const
      case 'low':
      case 'metadata':
        return 'none' as const
      default:
        return 'none' as const
    }
  }, [priority])

  // Seek handlers
  const handleSeekStart = useCallback(() => {
    wasPlayingBeforeSeekRef.current = isPlaying
    setTimelineExpanded(true)
    setShowPauseOverlay(false)
    pause()
  }, [isPlaying, pause])

  const handleSeekEnd = useCallback(
    (time: number) => {
      seek(time)
      if (wasPlayingBeforeSeekRef.current) {
        play()
        setTimelineExpanded(false)
      } else {
        setShowPauseOverlay(true)
      }
    },
    [seek, play]
  )

  // Gesture handlers
  const handleSingleTap = useCallback(() => {
    if (isPlaying) {
      pause()
    } else {
      play()
    }
  }, [isPlaying, play, pause])

  const handleDoubleTap = useCallback(
    (_zone: string, position: { x: number; y: number }) => {
      triggerHeart(position.x, position.y)
      onLike?.()
    },
    [triggerHeart, onLike]
  )

  const handleLongPress = useCallback(() => {
    // Future: context menu
  }, [])

  const gestureBindings = useVideoGestures({
    onSingleTap: handleSingleTap,
    onDoubleTap: handleDoubleTap,
    onLongPress: handleLongPress,
  })

  return {
    video,
    isActive,
    shouldRenderVideo,
    preload,
    containerRef,
    videoRef,
    isPlaying,
    showPauseOverlay,
    timelineExpanded,
    play,
    pause,
    seek,
    setShowPauseOverlay,
    setTimelineExpanded,
    gestureBindings,
    showHeart,
    heartPosition,
    triggerHeart,
    onLike,
    onComment,
    onShare,
    onAuthorClick,
    handleSeekStart,
    handleSeekEnd,
  }
}

