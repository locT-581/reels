/**
 * useVideoEngine - Headless hook for pure video engine control
 *
 * This is a low-level hook that provides direct access to PlayerCore
 * without any UI opinions or automatic behaviors. Use this when you need
 * full control over the video engine.
 *
 * For most use cases, prefer usePlayer from @vortex/player which provides
 * a higher-level API with smart defaults.
 */

'use client'

import { useRef, useState, useEffect, useCallback, useMemo } from 'react'
import { PlayerCore, type PlayerCoreOptions, type PlayerCoreCallbacks } from '../core/player-core'
import { createPlayerStateMachine } from '../state/player-state-machine'
import type { PlayerState, QualityLevel } from '@vortex/core'
import type { PlayResult } from '../types/playback'

export interface UseVideoEngineOptions {
  /** Initial video URL to load */
  url?: string
  /** Video ID for analytics */
  videoId?: string
  /** Prefer native HLS over HLS.js */
  preferNative?: boolean
  /** Enable HLS.js (when not using native). Default: true */
  enableHls?: boolean
  /** Custom HLS.js configuration */
  hlsConfig?: Record<string, unknown>
  /** State change callback */
  onStateChange?: (state: PlayerState) => void
  /** Error callback */
  onError?: (error: Error, recoverable: boolean) => void
  /** Quality levels loaded callback */
  onQualityLevelsLoaded?: (levels: QualityLevel[]) => void
}

export interface UseVideoEngineReturn {
  /** Ref to attach to video element */
  videoRef: React.RefObject<HTMLVideoElement | null>
  /** PlayerCore instance (null until attached) */
  engine: PlayerCore | null
  /** Current player state */
  state: PlayerState
  /** Whether player is ready */
  isReady: boolean
  /** Available quality levels */
  levels: QualityLevel[]
  /** Current quality level index (-1 for auto) */
  currentLevel: number

  // Lifecycle
  /** Attach to a video element and load URL */
  attach: (url: string, videoId?: string) => void
  /** Detach and cleanup */
  detach: () => void

  // Playback controls
  /** Play video */
  play: () => Promise<PlayResult>
  /** Pause video */
  pause: () => void
  /** Seek to time in seconds */
  seek: (time: number) => void
  /** Seek forward by seconds */
  seekForward: (seconds?: number) => void
  /** Seek backward by seconds */
  seekBackward: (seconds?: number) => void

  // Quality control
  /** Set quality level (-1 for auto) */
  setLevel: (level: number) => void
}

export function useVideoEngine(options: UseVideoEngineOptions = {}): UseVideoEngineReturn {
  const {
    url,
    videoId,
    preferNative,
    onStateChange,
    onError,
    onQualityLevelsLoaded,
  } = options

  // Refs
  const videoRef = useRef<HTMLVideoElement | null>(null)
  const engineRef = useRef<PlayerCore | null>(null)

  // State machine for player state
  const stateMachine = useMemo(() => createPlayerStateMachine(), [])
  const [state, setState] = useState<PlayerState>(stateMachine.state)
  const [isReady, setIsReady] = useState(false)
  const [levels, setLevels] = useState<QualityLevel[]>([])
  const [currentLevel, setCurrentLevel] = useState(-1)

  // Subscribe to state machine changes
  useEffect(() => {
    const unsubscribe = stateMachine.subscribe((newState) => {
      setState(newState)
      onStateChange?.(newState)

      if (newState === 'ready' && !isReady) {
        setIsReady(true)
      }
    })
    return unsubscribe
  }, [stateMachine, onStateChange, isReady])

  // Create callbacks
  const callbacks: PlayerCoreCallbacks = useMemo(
    () => ({
      onStateChange: (playerState) => {
        stateMachine.transition(playerState)
      },
      onError: (error, recoverable) => {
        onError?.(error, recoverable)
      },
      onQualityLevelsLoaded: (loadedLevels) => {
        setLevels(loadedLevels)
        onQualityLevelsLoaded?.(loadedLevels)
      },
      onQualityChange: (level) => {
        setCurrentLevel(level)
      },
    }),
    [stateMachine, onError, onQualityLevelsLoaded]
  )

  // Create engine options
  const engineOptions: PlayerCoreOptions = useMemo(
    () => ({
      preferNative,
      callbacks,
      // Disable automatic behaviors - this is a headless hook
      enableNetworkAdaptation: false,
      enablePowerAdaptation: false,
      enableAnalytics: false,
    }),
    [preferNative, callbacks]
  )

  // Attach to video element
  const attach = useCallback(
    (attachUrl: string, attachVideoId?: string) => {
      const video = videoRef.current
      if (!video) {
        console.error('[useVideoEngine] No video element attached')
        return
      }

      // Cleanup existing engine
      if (engineRef.current) {
        engineRef.current.destroy()
      }

      // Reset state
      setIsReady(false)
      setLevels([])
      setCurrentLevel(-1)
      stateMachine.reset()

      // Create new engine
      engineRef.current = new PlayerCore(engineOptions)
      engineRef.current.attach(video, attachUrl, attachVideoId)
    },
    [engineOptions, stateMachine]
  )

  // Detach and cleanup
  const detach = useCallback(() => {
    if (engineRef.current) {
      engineRef.current.destroy()
      engineRef.current = null
    }
    setIsReady(false)
    setLevels([])
    setCurrentLevel(-1)
    stateMachine.reset()
    setState('idle')
  }, [stateMachine])

  // Auto-attach if URL provided
  useEffect(() => {
    if (url && videoRef.current) {
      attach(url, videoId)
    }
  }, [url, videoId, attach])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (engineRef.current) {
        engineRef.current.destroy()
        engineRef.current = null
      }
    }
  }, [])

  // Playback controls
  const play = useCallback(async (): Promise<PlayResult> => {
    if (!engineRef.current) {
      return { success: false, reason: 'unknown' }
    }
    return engineRef.current.play()
  }, [])

  const pause = useCallback(() => {
    engineRef.current?.pause()
  }, [])

  const seek = useCallback((time: number) => {
    engineRef.current?.seek(time)
  }, [])

  const seekForward = useCallback((seconds: number = 10) => {
    engineRef.current?.seekForward(seconds)
  }, [])

  const seekBackward = useCallback((seconds: number = 10) => {
    engineRef.current?.seekBackward(seconds)
  }, [])

  // Quality control
  const setLevel = useCallback((level: number) => {
    engineRef.current?.setQuality(level)
  }, [])

  return {
    videoRef,
    engine: engineRef.current,
    state,
    isReady,
    levels,
    currentLevel,
    attach,
    detach,
    play,
    pause,
    seek,
    seekForward,
    seekBackward,
    setLevel,
  }
}

