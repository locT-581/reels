/**
 * useVideoFeedItemState - State management for VideoFeedItem compound component
 */

'use client'

import { useRef, useMemo, useState, useCallback, useEffect } from 'react'
import type { Video } from '@xhub-reel/core'
import {
  useDoubleTapHeart,
  usePlayer,
  type NetworkInfo,
  type PowerInfo,
  type PlaybackMetrics,
  type PreloadManagerOptions,
} from '@xhub-reel/player'
import { useVideoGestures } from '@xhub-reel/gestures'
import { useVideoActivation } from '../../hooks/useVideoActivation'
import { useMemoryManager } from '../../hooks/useMemoryManager'
import type { PreloadPriority } from '../../hooks/usePreloader'
import type { VideoFeedItemContextValue } from './context'

export interface UseVideoFeedItemStateOptions {
  video: Video
  isActive: boolean
  priority: PreloadPriority
  /** Whether video should start muted (default: true for browser autoplay policy) */
  initialMuted?: boolean
  onLike?: () => void
  onComment?: () => void
  onShare?: () => void
  onAuthorClick?: () => void
}

export function useVideoFeedItemState({
  video,
  isActive,
  priority,
  initialMuted = true,
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
  const [isPreloaded, setIsPreloaded] = useState(false)

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

  // Player hook - lấy state để track trạng thái
  const { state } = usePlayer(videoRef, containerRef, {
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

  // ✅ Native video controls - không dùng PlayerCore vì không cần HLS trong feed context
  const play = useCallback(async (): Promise<void> => {
    const videoEl = videoRef.current
    if (videoEl) {
      videoEl.muted = initialMuted // Use initialMuted prop (default: true for browser autoplay policy)
      try {
        await videoEl.play()
      } catch (err) {
        // If autoplay fails (browser policy), try with muted
        if ((err as Error).name === 'NotAllowedError' && !initialMuted) {
          console.warn('[VideoFeedItem] Autoplay blocked, falling back to muted')
          videoEl.muted = true
          try {
            await videoEl.play()
          } catch (mutedErr) {
            console.warn('[VideoFeedItem] Play failed even muted:', (mutedErr as Error).message)
          }
        } else {
          console.warn('[VideoFeedItem] Play failed:', (err as Error).message)
        }
      }
    }
  }, [initialMuted])

  const pause = useCallback(() => {
    const videoEl = videoRef.current
    if (videoEl) {
      videoEl.pause()
    }
  }, [])

  const seek = useCallback((time: number) => {
    const videoEl = videoRef.current
    if (videoEl) {
      videoEl.currentTime = time
    }
  }, [])

  // Theo dõi trạng thái playing từ video element trực tiếp
  const [isPlaying, setIsPlaying] = useState(false)

  // Sync isPlaying state với video element
  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    const handlePlay = () => setIsPlaying(true)
    const handlePause = () => setIsPlaying(false)
    const handleEnded = () => setIsPlaying(false)

    videoEl.addEventListener('play', handlePlay)
    videoEl.addEventListener('pause', handlePause)
    videoEl.addEventListener('ended', handleEnded)

    // Sync initial state
    setIsPlaying(!videoEl.paused)

    return () => {
      videoEl.removeEventListener('play', handlePlay)
      videoEl.removeEventListener('pause', handlePause)
      videoEl.removeEventListener('ended', handleEnded)
    }
  }, [video.id]) // Re-run when video changes

  // Fallback: sync từ state nếu có
  const effectiveIsPlaying = isPlaying || state.state === 'playing'

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

  // ✅ Derived state - ĐỊNH NGHĨA SỚM để các useEffect có thể sử dụng
  const shouldRenderVideo = !shouldDispose && priority !== 'none'

  // ✅ Track pending play request - dùng khi video element chưa available
  const pendingPlayRef = useRef(false)

  // Video activation - autoActivate: true để video tự động play khi isActive thay đổi
  useVideoActivation({
    videoRef,
    isCurrentVideo: isActive,
    onActivate: () => {
      console.log('[VideoFeedItem] onActivate called, videoRef:', videoRef.current?.src)
      setHasDecodedFrames(true)
      // Nếu video element chưa mount, đánh dấu pending
      if (!videoRef.current) {
        console.log('[VideoFeedItem] Video element not ready, marking pending play')
        pendingPlayRef.current = true
      } else {
        play()
      }
    },
    onDeactivate: () => {
      console.log('[VideoFeedItem] onDeactivate called')
      pendingPlayRef.current = false
      setHasDecodedFrames(false)
      pause()
      seek(0)
    },
    autoActivate: true,
  })

  // ✅ Effect để trigger pending play khi video element mount
  useEffect(() => {
    const videoEl = videoRef.current
    if (videoEl && pendingPlayRef.current && isActive) {
      console.log('[VideoFeedItem] Video element now available, executing pending play')
      pendingPlayRef.current = false
      play()
    }
  }) // Run on every render to catch when videoRef.current becomes available

  // Mark as in DOM
  useEffect(() => {
    setInDom(true)
    return () => setInDom(false)
  }, [setInDom])

  useEffect(() => {
    const videoEl = videoRef.current
    if (!videoEl) return

    // Reset preloaded state khi video thay đổi
    setIsPreloaded(false)

    const handleLoadedData = () => {
      console.log('[VideoFeedItem] Video loadeddata:', video.id, { isActive, priority })

      // Nếu là video adjacent (priority = 'high' nhưng không active)
      // Decode first frame bằng cách play() -> pause() ngay
      if (priority === 'high' && !isActive) {
        // Dùng requestAnimationFrame để đảm bảo video đã sẵn sàng
        requestAnimationFrame(() => {
          if (videoEl.readyState >= 2) { // HAVE_CURRENT_DATA
            videoEl.currentTime = 0.01 // Seek nhẹ để trigger decode
            setIsPreloaded(true)
            console.log('[VideoFeedItem] First frame decoded (preloaded):', video.id)
          }
        })
      } else if (isActive) {
        // Video active cũng được coi là preloaded
        setIsPreloaded(true)
      }
    }

    const handleCanPlay = () => {
      // Backup: nếu loadeddata không fire, canplay sẽ đảm bảo
      if (priority === 'high' && !isPreloaded) {
        setIsPreloaded(true)
      }
    }

    videoEl.addEventListener('loadeddata', handleLoadedData)
    videoEl.addEventListener('canplay', handleCanPlay)

    // Nếu video đã có data, check ngay
    if (videoEl.readyState >= 2) {
      handleLoadedData()
    }

    return () => {
      videoEl.removeEventListener('loadeddata', handleLoadedData)
      videoEl.removeEventListener('canplay', handleCanPlay)
    }
  }, [video.id, isActive, priority, isPreloaded])

  // Debug log
  useEffect(() => {
    console.log('[VideoFeedItem] State:', {
      videoId: video.id,
      isActive,
      priority,
      shouldRenderVideo,
      hasVideoElement: !!videoRef.current,
      videoSrc: videoRef.current?.src,
    })
  }, [video.id, isActive, priority, shouldRenderVideo])

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
    wasPlayingBeforeSeekRef.current = effectiveIsPlaying
    setTimelineExpanded(true)
    setShowPauseOverlay(false)
    pause()
  }, [effectiveIsPlaying, pause])

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
    if (effectiveIsPlaying) {
      pause()
    } else {
      play()
    }
  }, [effectiveIsPlaying, play, pause])

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
    isPreloaded,
    initialMuted,
    containerRef,
    videoRef,
    isPlaying: effectiveIsPlaying,
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

