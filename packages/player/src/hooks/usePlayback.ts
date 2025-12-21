/**
 * usePlayback - Hook for basic playback controls
 */

'use client'

import { useState, useCallback, useEffect, type RefObject } from 'react'
import { usePlayerStore } from '@vortex/core'
import type { PlaybackSpeed } from '@vortex/core'

export interface UsePlaybackReturn {
  isPlaying: boolean
  playbackSpeed: PlaybackSpeed
  play: () => Promise<void>
  pause: () => void
  togglePlay: () => Promise<void>
  seek: (time: number) => void
  seekForward: (seconds?: number) => void
  seekBackward: (seconds?: number) => void
  setPlaybackSpeed: (speed: PlaybackSpeed) => void
  restart: () => void
}

export function usePlayback(
  videoRef: RefObject<HTMLVideoElement | null>
): UsePlaybackReturn {
  const { playbackSpeed: storedSpeed, setPlaybackSpeed: storeSetSpeed, play: storePlay, pause: storePause } = usePlayerStore()
  
  const [isPlaying, setIsPlaying] = useState(false)
  const [playbackSpeed, setPlaybackSpeedState] = useState<PlaybackSpeed>(storedSpeed)

  // Sync with video element
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handlePlay = () => {
      setIsPlaying(true)
      storePlay()
    }

    const handlePause = () => {
      setIsPlaying(false)
      storePause()
    }

    const handleRateChange = () => {
      setPlaybackSpeedState(video.playbackRate as PlaybackSpeed)
    }

    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ratechange', handleRateChange)

    // Initial state
    setIsPlaying(!video.paused)
    setPlaybackSpeedState(video.playbackRate as PlaybackSpeed)

    return () => {
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ratechange', handleRateChange)
    }
  }, [videoRef, storePlay, storePause])

  // Apply stored playback speed
  useEffect(() => {
    const video = videoRef.current
    if (video) {
      video.playbackRate = storedSpeed
    }
  }, [videoRef, storedSpeed])

  const play = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    try {
      await video.play()
    } catch (error) {
      // Autoplay might be blocked, try muted
      if ((error as Error).name === 'NotAllowedError') {
        video.muted = true
        await video.play()
      }
    }
  }, [videoRef])

  const pause = useCallback(() => {
    videoRef.current?.pause()
  }, [videoRef])

  const togglePlay = useCallback(async () => {
    const video = videoRef.current
    if (!video) return

    if (video.paused) {
      await play()
    } else {
      pause()
    }
  }, [play, pause])

  const seek = useCallback(
    (time: number) => {
      const video = videoRef.current
      if (!video || !isFinite(video.duration)) return

      video.currentTime = Math.max(0, Math.min(time, video.duration))
    },
    [videoRef]
  )

  const seekForward = useCallback(
    (seconds: number = 10) => {
      const video = videoRef.current
      if (!video) return

      seek(video.currentTime + seconds)
    },
    [videoRef, seek]
  )

  const seekBackward = useCallback(
    (seconds: number = 10) => {
      const video = videoRef.current
      if (!video) return

      seek(video.currentTime - seconds)
    },
    [videoRef, seek]
  )

  const setPlaybackSpeed = useCallback(
    (newSpeed: PlaybackSpeed) => {
      const video = videoRef.current
      if (video) {
        video.playbackRate = newSpeed
      }
      setPlaybackSpeedState(newSpeed)
      storeSetSpeed(newSpeed)
    },
    [videoRef, storeSetSpeed]
  )

  const restart = useCallback(() => {
    const video = videoRef.current
    if (video) {
      video.currentTime = 0
      video.play()
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
