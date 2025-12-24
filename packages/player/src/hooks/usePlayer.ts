/**
 * usePlayer - Main hook for video player control
 * High-level hook combining core playback with UI-specific features
 *
 * This hook is the recommended way to integrate player functionality.
 * It composes multiple lower-level hooks into a single, easy-to-use API.
 */

'use client'

import { useRef, useCallback, useMemo, useEffect, useState, type RefObject } from 'react'
import {
  PlayerCore,
  usePlayerState,
  useVolume,
  useProgress,
  useQuality,
  type PlayerCoreCallbacks,
  type PlayerCoreOptions,
  type UsePlayerStateReturn,
  type UseVolumeReturn,
  type UseProgressReturn,
  type UseQualityReturn,
  type NetworkInfo,
  type PowerInfo,
  type PlaybackMetrics,
} from '@xhub-reel/player-core'
import { useFullscreen, type UseFullscreenReturn } from './useFullscreen'
import type { PlaybackSpeed, QualityLevel, PlayerState } from '@xhub-reel/core'

/**
 * Network adaptation strategy
 */
export interface NetworkBehavior {
  /** Automatically switch quality based on network speed. Default: false */
  autoQualitySwitch?: boolean
  /** Automatically pause when going offline. Default: false */
  pauseOnOffline?: boolean
  /** Automatically resume when coming back online. Default: false */
  resumeOnOnline?: boolean
  /** Network speed threshold to trigger low quality. Default: '2g' */
  lowQualityOn?: 'slow-2g' | '2g' | '3g'
  /** Custom callback for additional UI/logging */
  onNetworkChange?: (info: NetworkInfo) => void
}

/**
 * Power adaptation strategy
 */
export interface PowerBehavior {
  /** Automatically pause on low battery. Default: false */
  autoPauseOnLowBattery?: boolean
  /** Battery level threshold to trigger pause (0-1). Default: 0.15 */
  pauseThreshold?: number
  /** Custom callback for additional UI/logging */
  onPowerChange?: (info: PowerInfo) => void
}

/**
 * Predefined network behavior presets
 */
export const NETWORK_BEHAVIORS = {
  /** Aggressive optimization for feed context */
  feed: {
    autoQualitySwitch: true,
    pauseOnOffline: false, // Feed handles this per-video
    resumeOnOnline: false,
    lowQualityOn: '2g',
  } as NetworkBehavior,

  /** Maintain playback for watch page */
  watch: {
    autoQualitySwitch: true,
    pauseOnOffline: false, // Let user decide
    resumeOnOnline: false,
    lowQualityOn: '2g',
  } as NetworkBehavior,

  /** Automatic behavior for single video */
  auto: {
    autoQualitySwitch: true,
    pauseOnOffline: true,
    resumeOnOnline: true,
    lowQualityOn: '2g',
  } as NetworkBehavior,

  /** No automatic behavior - manual control */
  manual: {
    autoQualitySwitch: false,
    pauseOnOffline: false,
    resumeOnOnline: false,
  } as NetworkBehavior,
} as const

/**
 * Predefined power behavior presets
 */
export const POWER_BEHAVIORS = {
  /** Aggressive power saving */
  aggressive: {
    autoPauseOnLowBattery: true,
    pauseThreshold: 0.20, // 20%
  } as PowerBehavior,

  /** Moderate power saving */
  moderate: {
    autoPauseOnLowBattery: true,
    pauseThreshold: 0.15, // 15%
  } as PowerBehavior,

  /** Conservative - only pause on critical battery */
  conservative: {
    autoPauseOnLowBattery: true,
    pauseThreshold: 0.10, // 10%
  } as PowerBehavior,

  /** No automatic power behavior */
  manual: {
    autoPauseOnLowBattery: false,
  } as PowerBehavior,
} as const

export interface UsePlayerReturn {
  // Core player
  playerCore: PlayerCore | null
  videoRef: RefObject<HTMLVideoElement | null>
  containerRef: RefObject<HTMLDivElement | null>

  // State
  state: UsePlayerStateReturn
  isReady: boolean
  // Playback controls
  play: () => Promise<void>
  pause: () => void
  togglePlay: () => Promise<void>
  seek: (time: number) => void
  seekForward: (seconds?: number) => void
  seekBackward: (seconds?: number) => void
  setPlaybackSpeed: (speed: PlaybackSpeed) => void
  restart: () => void
  // Volume (from useVolume)
  volume: UseVolumeReturn
  // Progress (from useProgress)
  progress: UseProgressReturn
  // Quality (from useQuality)
  quality: UseQualityReturn
  // Fullscreen (from useFullscreen)
  fullscreen: UseFullscreenReturn
  // Actions
  attach: (url: string, videoId?: string) => void
  destroy: () => void
}

export interface UsePlayerOptions extends Omit<PlayerCoreOptions, 'callbacks'> {
  /** Called when player state changes */
  onStateChange?: (state: PlayerState) => void
  /** Called on error */
  onError?: (error: Error, recoverable: boolean) => void
  /** Called on time update */
  onTimeUpdate?: (currentTime: number, duration: number) => void
  /** Called when quality levels are loaded */
  onQualityLevelsLoaded?: (levels: QualityLevel[]) => void
  /** Called when video starts playing */
  onPlay?: () => void
  /** Called when video is paused */
  onPause?: () => void
  /** Called when video ends */
  onEnded?: () => void
  /** Called when player is ready */
  onReady?: () => void
  /** Called when network conditions change */
  onNetworkChange?: (info: NetworkInfo) => void
  /** Called when power state changes */
  onPowerChange?: (info: PowerInfo) => void
  /** Called when analytics metrics are updated */
  onAnalyticsUpdate?: (metrics: PlaybackMetrics) => void
  /**
   * Network adaptation behavior strategy
   * - Can be a preset string ('feed', 'watch', 'auto', 'manual')
   * - Or a custom NetworkBehavior object
   * - Default: undefined (no automatic behavior)
   */
  networkBehavior?: 'feed' | 'watch' | 'auto' | 'manual' | NetworkBehavior

  /**
   * Power adaptation behavior strategy
   * - Can be a preset string ('aggressive', 'moderate', 'conservative', 'manual')
   * - Or a custom PowerBehavior object
   * - Default: undefined (no automatic behavior)
   */
  powerBehavior?: 'aggressive' | 'moderate' | 'conservative' | 'manual' | PowerBehavior
}

export function usePlayer(
  videoRef: RefObject<HTMLVideoElement | null>,
  containerRef?: RefObject<HTMLDivElement | null>,
  options: UsePlayerOptions = {}
): UsePlayerReturn {
  const playerCoreRef = useRef<PlayerCore | null>(null)
  const internalContainerRef = useRef<HTMLDivElement | null>(null)
  const effectiveContainerRef = containerRef ?? internalContainerRef

  const [isReady, setIsReady] = useState(false)

  // State management
  const state = usePlayerState()

  // Volume control
  const volumeControl = useVolume(videoRef)

  // Progress tracking
  const progressControl = useProgress(videoRef)

  // Quality control
  const qualityControl = useQuality(playerCoreRef.current)

  // Fullscreen control
  const fullscreenControl = useFullscreen(effectiveContainerRef)

  // Store options in ref to avoid recreating callbacks
  const optionsRef = useRef(options)
  optionsRef.current = options

  // Destructure to avoid dependency warnings
  const { networkBehavior, powerBehavior } = options

  // Resolve network behavior
  const resolvedNetworkBehavior: NetworkBehavior | undefined = useMemo(() => {
    if (!networkBehavior) return undefined

    // If string preset, resolve to object
    if (typeof networkBehavior === 'string') {
      return NETWORK_BEHAVIORS[networkBehavior]
    }

    // If object, use directly
    return networkBehavior
  }, [networkBehavior])

  // Resolve power behavior
  const resolvedPowerBehavior: PowerBehavior | undefined = useMemo(() => {
    if (!powerBehavior) return undefined

    // If string preset, resolve to object
    if (typeof powerBehavior === 'string') {
      return POWER_BEHAVIORS[powerBehavior]
    }

    // If object, use directly
    return powerBehavior
  }, [powerBehavior])

  // Create callbacks
  const callbacks: PlayerCoreCallbacks = useMemo(
    () => ({
      onStateChange: (playerState) => {
        state.transition(playerState)
        optionsRef.current.onStateChange?.(playerState)

        // Track ready state
        if (playerState === 'ready' && !isReady) {
          setIsReady(true)
          optionsRef.current.onReady?.()
        }
      },
      onError: (error, recoverable) => {
        optionsRef.current.onError?.(error, recoverable)
      },
      onTimeUpdate: (currentTime, duration) => {
        optionsRef.current.onTimeUpdate?.(currentTime, duration)
      },
      onQualityLevelsLoaded: (levels) => {
        optionsRef.current.onQualityLevelsLoaded?.(levels)
      },
      // Forward service callbacks (with smart defaults integration)
      onNetworkChange: (info) => {
        // Call strategy-specific callback first
        resolvedNetworkBehavior?.onNetworkChange?.(info)
        // Then call user's custom callback
        optionsRef.current.onNetworkChange?.(info)
      },
      onPowerChange: (info) => {
        // Call strategy-specific callback first
        resolvedPowerBehavior?.onPowerChange?.(info)
        // Then call user's custom callback
        optionsRef.current.onPowerChange?.(info)
      },
      onAnalyticsUpdate: (metrics) => {
        optionsRef.current.onAnalyticsUpdate?.(metrics)
      },
    }),
    [state, isReady, resolvedNetworkBehavior, resolvedPowerBehavior]
  )

  // Video element event handlers
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => optionsRef.current.onPlay?.()
    const handlePause = () => optionsRef.current.onPause?.()
    const handleEnded = () => optionsRef.current.onEnded?.()

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
    }
  }, [videoRef])

  // Attach player to video element
  const attach = useCallback(
    (url: string, videoId?: string) => {
      const video = videoRef.current
      if (!video) {
        console.error('[usePlayer] No video element')
        return
      }

      // Reset ready state
      setIsReady(false)

      // Destroy existing player
      if (playerCoreRef.current) {
        playerCoreRef.current.destroy()
      }

      // Create new player with service options
      playerCoreRef.current = new PlayerCore({
        preferNative: optionsRef.current.preferNative,
        enableSmoothTimeUpdates: optionsRef.current.enableSmoothTimeUpdates,
        enableNetworkAdaptation: optionsRef.current.enableNetworkAdaptation,
        enablePowerAdaptation: optionsRef.current.enablePowerAdaptation,
        enableAnalytics: optionsRef.current.enableAnalytics,
        preloadConfig: optionsRef.current.preloadConfig,
        callbacks,

        // Network behavior options
        autoQualityOnNetworkChange: resolvedNetworkBehavior?.autoQualitySwitch,
        autoPauseOnOffline: resolvedNetworkBehavior?.pauseOnOffline,
        autoResumeOnOnline: resolvedNetworkBehavior?.resumeOnOnline,
        lowQualityThreshold: resolvedNetworkBehavior?.lowQualityOn,

        // Power behavior options
        autoPauseOnLowBattery: resolvedPowerBehavior?.autoPauseOnLowBattery,
        lowBatteryThreshold: resolvedPowerBehavior?.pauseThreshold,
      })

      playerCoreRef.current.attach(video, url, videoId)
    },
    [videoRef, callbacks, resolvedNetworkBehavior, resolvedPowerBehavior]
  )

  // Destroy player
  const destroy = useCallback(() => {
    if (playerCoreRef.current) {
      playerCoreRef.current.destroy()
      playerCoreRef.current = null
    }
    state.reset()
    setIsReady(false)
  }, [state])

  // Playback controls
  const play = useCallback(async () => {
    await playerCoreRef.current?.play()
  }, [])

  const pause = useCallback(() => {
    playerCoreRef.current?.pause()
  }, [])

  const togglePlay = useCallback(async () => {
    await playerCoreRef.current?.togglePlay()
  }, [])

  const seek = useCallback((time: number) => {
    playerCoreRef.current?.seek(time)
  }, [])

  const seekForward = useCallback((seconds: number = 10) => {
    playerCoreRef.current?.seekForward(seconds)
  }, [])

  const seekBackward = useCallback((seconds: number = 10) => {
    playerCoreRef.current?.seekBackward(seconds)
  }, [])

  const setPlaybackSpeed = useCallback((speed: PlaybackSpeed) => {
    playerCoreRef.current?.setPlaybackRate(speed)
  }, [])

  const restart = useCallback(() => {
    const video = videoRef.current
    if (video) {
      video.currentTime = 0
      video.play().catch(() => {})
    }
  }, [videoRef])

  return {
    playerCore: playerCoreRef.current,
    videoRef,
    containerRef: effectiveContainerRef,
    state,
    isReady,
    play,
    pause,
    togglePlay,
    seek,
    seekForward,
    seekBackward,
    setPlaybackSpeed,
    restart,
    volume: volumeControl,
    progress: progressControl,
    quality: qualityControl,
    fullscreen: fullscreenControl,
    attach,
    destroy,
  }
}
