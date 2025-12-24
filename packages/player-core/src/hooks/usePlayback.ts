/**
 * usePlayback - Hook for basic playback controls
 *
 * This hook bridges the runtime store and preferences store with the video element.
 * It does NOT duplicate state - uses stores as single source of truth.
 */

'use client'

import { useCallback, useEffect, type RefObject } from 'react'
import { usePlayerRuntimeStore, usePlayerPreferencesStore } from '@xhub-reel/core'
import type { PlaybackSpeed } from '@xhub-reel/core'
import { safePlay } from '../utils/safePlay'

export interface UsePlaybackReturn {
  /** Whether the video is playing */
  isPlaying: boolean
  /** Current playback speed */
  playbackSpeed: PlaybackSpeed
  /** Play the video */
  play: () => Promise<void>
  /** Pause the video */
  pause: () => void
  /** Toggle play/pause */
  togglePlay: () => Promise<void>
  /** Seek to a specific time */
  seek: (time: number) => void
  /** Seek forward by a specific number of seconds */
  seekForward: (seconds?: number) => void
  /** Seek backward by a specific number of seconds */
  seekBackward: (seconds?: number) => void
  /** Set the playback speed */
  setPlaybackSpeed: (speed: PlaybackSpeed) => void
  /** Restart the video */
  restart: () => void
}

/**
 * usePlayback - Hook for basic playback controls
 *
 * This hook bridges the runtime store and preferences store with the video element.
 * It does NOT duplicate state - uses stores as single source of truth.
 *
 * @param videoRef - Ref to the video element
 * @returns Object containing playback state and controls
 */
export function usePlayback(
  videoRef: RefObject<HTMLVideoElement | null>
): UsePlaybackReturn {
  // Single source of truth - directly from stores
  const {
    isPlaying,
    play: storePlay,
    pause: storePause,
  } = usePlayerRuntimeStore()

  const {
    playbackSpeed,
    setPlaybackSpeed: storeSetSpeed,
  } = usePlayerPreferencesStore()

  // Side effect: Sync video element state → store
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => storePlay()
    const handlePause = () => storePause()

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)

    // Initialize store from video state
    if (!video.paused && !isPlaying) {
      storePlay()
    } else if (video.paused && isPlaying) {
      storePause()
    }

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
    }
  }, [videoRef, isPlaying, storePlay, storePause])

  // Side effect: Apply playback speed to video element
  useEffect(() => {
    const video = videoRef.current
    if (video && video.playbackRate !== playbackSpeed) {
      video.playbackRate = playbackSpeed
    }
  }, [videoRef, playbackSpeed])

  // Side effect: Listen to playback rate changes from video
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleRateChange = () => {
      if (video.playbackRate !== playbackSpeed) {
        storeSetSpeed(video.playbackRate as PlaybackSpeed)
      }
    }

    video.addEventListener('ratechange', handleRateChange)
    return () => video.removeEventListener('ratechange', handleRateChange)
  }, [videoRef, playbackSpeed, storeSetSpeed])

  // Action: Play
  const play = useCallback(async () => {
    const video = videoRef.current
    if (!video) return
    await safePlay(video)
  }, [videoRef])

  // Action: Pause
  const pause = useCallback(() => {
    videoRef.current?.pause()
  }, [videoRef])

  // Action: Toggle play/pause
  const togglePlay = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      await play()
    } else {
      pause()
    }
  }, [play, pause, videoRef])

  // Action: Seek to specific time
  const seek = useCallback(
    (time: number) => {
      const video = videoRef.current
      if (!video || !isFinite(video.duration)) return

      video.currentTime = Math.max(0, Math.min(time, video.duration))
    },
    [videoRef]
  )

  // Action: Seek forward
  const seekForward = useCallback(
    (seconds: number = 10) => {
      const video = videoRef.current
      if (!video) return

      seek(video.currentTime + seconds)
    },
    [videoRef, seek]
  )

  // Action: Seek backward
  const seekBackward = useCallback(
    (seconds: number = 10) => {
      const video = videoRef.current
      if (!video) return

      seek(video.currentTime - seconds)
    },
    [videoRef, seek]
  )

  // Action: Set playback speed
  const setPlaybackSpeed = useCallback(
    (newSpeed: PlaybackSpeed) => {
      storeSetSpeed(newSpeed)
      // Apply immediately
      if (videoRef.current) {
        videoRef.current.playbackRate = newSpeed
      }
    },
    [videoRef, storeSetSpeed]
  )

  // Action: Restart video
  const restart = useCallback(() => {
    const video = videoRef.current
    if (video) {
      video.currentTime = 0
      void safePlay(video)
    }
  }, [videoRef])

  return {
    isPlaying,
    playbackSpeed,
    play,
    pause,
    togglePlay,
    seek,
    seekForward,
    seekBackward,
    setPlaybackSpeed,
    restart,
  }
}
