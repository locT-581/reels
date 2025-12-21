/**
 * usePlayer - Main hook for video player control
 */

'use client'

import { useRef, useCallback, useMemo, type RefObject } from 'react'
import { PlayerCore, type PlayerCoreCallbacks, type PlayerCoreOptions } from '../core/player-core'
import { usePlayerState, type UsePlayerStateReturn } from '../state/use-player-state'
import { useVolume, type UseVolumeReturn } from './useVolume'
import { useProgress, type UseProgressReturn } from './useProgress'
import { useQuality, type UseQualityReturn } from './useQuality'
import { useFullscreen, type UseFullscreenReturn } from './useFullscreen'
import type { PlaybackSpeed } from '@vortex/core'

export interface UsePlayerReturn {
  // Core player
  playerCore: PlayerCore | null
  videoRef: RefObject<HTMLVideoElement | null>
  containerRef: RefObject<HTMLDivElement | null>
  
  // State
  state: UsePlayerStateReturn
  
  // Playback controls
  play: () => Promise<void>
  pause: () => void
  togglePlay: () => Promise<void>
  seek: (time: number) => void
  seekForward: (seconds?: number) => void
  seekBackward: (seconds?: number) => void
  setPlaybackSpeed: (speed: PlaybackSpeed) => void
  
  // Volume (from useVolume)
  volume: UseVolumeReturn
  
  // Progress (from useProgress)
  progress: UseProgressReturn
  
  // Quality (from useQuality)
  quality: UseQualityReturn
  
  // Fullscreen (from useFullscreen)
  fullscreen: UseFullscreenReturn
  
  // Actions
  attach: (url: string) => void
  destroy: () => void
}

export interface UsePlayerOptions extends Omit<PlayerCoreOptions, 'callbacks'> {
  onStateChange?: PlayerCoreCallbacks['onStateChange']
  onError?: PlayerCoreCallbacks['onError']
  onTimeUpdate?: PlayerCoreCallbacks['onTimeUpdate']
}

export function usePlayer(
  videoRef: RefObject<HTMLVideoElement | null>,
  containerRef?: RefObject<HTMLDivElement | null>,
  options: UsePlayerOptions = {}
): UsePlayerReturn {
  const playerCoreRef = useRef<PlayerCore | null>(null)
  const internalContainerRef = useRef<HTMLDivElement | null>(null)
  const effectiveContainerRef = containerRef ?? internalContainerRef

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

  // Create callbacks
  const callbacks: PlayerCoreCallbacks = useMemo(
    () => ({
      onStateChange: (playerState) => {
        state.transition(playerState)
        options.onStateChange?.(playerState)
      },
      onError: options.onError,
      onTimeUpdate: options.onTimeUpdate,
    }),
    [state, options]
  )

  // Attach player to video element
  const attach = useCallback(
    (url: string) => {
      const video = videoRef.current
      if (!video) {
        console.error('[usePlayer] No video element')
        return
      }

      // Destroy existing player
      if (playerCoreRef.current) {
        playerCoreRef.current.destroy()
      }

      // Create new player
      playerCoreRef.current = new PlayerCore({
        preferNative: options.preferNative,
        callbacks,
      })

      playerCoreRef.current.attach(video, url)
    },
    [videoRef, callbacks, options.preferNative]
  )

  // Destroy player
  const destroy = useCallback(() => {
    if (playerCoreRef.current) {
      playerCoreRef.current.destroy()
      playerCoreRef.current = null
    }
    state.reset()
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

  return {
    playerCore: playerCoreRef.current,
    videoRef,
    containerRef: effectiveContainerRef,
    state,
    play,
    pause,
    togglePlay,
    seek,
    seekForward,
    seekBackward,
    setPlaybackSpeed,
    volume: volumeControl,
    progress: progressControl,
    quality: qualityControl,
    fullscreen: fullscreenControl,
    attach,
    destroy,
  }
}
