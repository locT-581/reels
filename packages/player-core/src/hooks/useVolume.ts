/**
 * useVolume - Hook for video volume control
 *
 * This hook bridges the preferences store with the video element.
 * It does NOT duplicate state - uses store as single source of truth.
 */

'use client'

import { useCallback, useEffect, type RefObject } from 'react'
import { usePlayerPreferencesStore } from '@vortex/core'

/**
 * useVolume - Hook for video volume control
 *
 * This hook bridges the preferences store with the video element.
 * It does NOT duplicate state - uses store as single source of truth.
 *
 * @param videoRef - Ref to the video element
 * @returns Object containing volume state and controls
 */
export interface UseVolumeReturn {
  /** Current volume level */
  volume: number
  /** Whether the video is muted */
  isMuted: boolean
  setVolume: (volume: number) => void
  toggleMute: () => void
  mute: () => void
  unmute: () => void
}

/**
 * useVolume - Hook for video volume control
 *
 * This hook bridges the preferences store with the video element.
 * It does NOT duplicate state - uses store as single source of truth.
 *
 * @param videoRef - Ref to the video element
 * @returns Object containing volume state and controls
 */
export function useVolume(
  videoRef: RefObject<HTMLVideoElement | null>
): UseVolumeReturn {
  // Single source of truth - directly from store
  const {
    volume,
    isMuted,
    setVolume: storeSetVolume,
    toggleMute: storeToggleMute,
    setMuted,
  } = usePlayerPreferencesStore()

  // Side effect: Apply volume/muted to video element when store changes
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.volume = volume
    video.muted = isMuted
  }, [videoRef, volume, isMuted])

  // Side effect: Listen to video volume changes (e.g., user uses native controls)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVolumeChange = () => {
      // Only update store if different (avoid infinite loop)
      if (video.volume !== volume) {
        storeSetVolume(video.volume)
      }
      if (video.muted !== isMuted) {
        setMuted(video.muted)
      }
    }

    video.addEventListener('volumechange', handleVolumeChange)
    return () => video.removeEventListener('volumechange', handleVolumeChange)
  }, [videoRef, volume, isMuted, storeSetVolume, setMuted])

  // Action: Set volume with auto-unmute logic
  const setVolume = useCallback(
    (newVolume: number) => {
      const clampedVolume = Math.max(0, Math.min(1, newVolume))
      storeSetVolume(clampedVolume)

      // Apply immediately to video for responsiveness
      if (videoRef.current) {
        videoRef.current.volume = clampedVolume
      }

      // Auto-unmute if setting volume > 0
      if (clampedVolume > 0 && isMuted) {
        setMuted(false)
        if (videoRef.current) {
          videoRef.current.muted = false
        }
      }
    },
    [videoRef, isMuted, storeSetVolume, setMuted]
  )

  // Action: Toggle mute
  const toggleMute = useCallback(() => {
    storeToggleMute()
    // Apply immediately
    if (videoRef.current) {
      videoRef.current.muted = !isMuted
    }
  }, [videoRef, isMuted, storeToggleMute])

  // Action: Mute
  const mute = useCallback(() => {
    if (!isMuted) {
      setMuted(true)
      if (videoRef.current) {
        videoRef.current.muted = true
      }
    }
  }, [videoRef, isMuted, setMuted])

  // Action: Unmute
  const unmute = useCallback(() => {
    if (isMuted) {
      setMuted(false)
      if (videoRef.current) {
        videoRef.current.muted = false
      }
    }
  }, [videoRef, isMuted, setMuted])

  return {
    volume,
    isMuted,
    setVolume,
    toggleMute,
    mute,
    unmute,
  }
}
