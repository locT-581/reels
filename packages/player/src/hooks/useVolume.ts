/**
 * useVolume - Hook for video volume control
 */

'use client'

import { useState, useCallback, useEffect, type RefObject } from 'react'
import { usePlayerStore } from '@vortex/core'

export interface UseVolumeReturn {
  volume: number
  isMuted: boolean
  setVolume: (volume: number) => void
  toggleMute: () => void
  mute: () => void
  unmute: () => void
}

export function useVolume(
  videoRef: RefObject<HTMLVideoElement | null>
): UseVolumeReturn {
  const { volume: storedVolume, isMuted: storedMuted, setVolume: storeVolume, toggleMute: storeToggleMute } = usePlayerStore()
  
  const [volume, setVolumeState] = useState(storedVolume)
  const [isMuted, setIsMuted] = useState(storedMuted)

  // Sync with store
  useEffect(() => {
    setVolumeState(storedVolume)
    setIsMuted(storedMuted)
  }, [storedVolume, storedMuted])

  // Apply volume to video element
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    video.volume = volume
    video.muted = isMuted
  }, [videoRef, volume, isMuted])

  // Listen to video volume changes
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleVolumeChange = () => {
      setVolumeState(video.volume)
      setIsMuted(video.muted)
      storeVolume(video.volume)
      if (video.muted !== storedMuted) {
        storeToggleMute()
      }
    }

    video.addEventListener('volumechange', handleVolumeChange)
    return () => video.removeEventListener('volumechange', handleVolumeChange)
  }, [videoRef, storedMuted, storeVolume, storeToggleMute])

  const setVolume = useCallback(
    (newVolume: number) => {
      const clampedVolume = Math.max(0, Math.min(1, newVolume))
      setVolumeState(clampedVolume)
      storeVolume(clampedVolume)

      if (videoRef.current) {
        videoRef.current.volume = clampedVolume
      }

      // Unmute if setting volume > 0
      if (clampedVolume > 0 && isMuted) {
        setIsMuted(false)
        if (videoRef.current) {
          videoRef.current.muted = false
        }
        storeToggleMute()
      }
    },
    [videoRef, isMuted, storeVolume, storeToggleMute]
  )

  const toggleMute = useCallback(() => {
    const newMuted = !isMuted
    setIsMuted(newMuted)
    storeToggleMute()

    if (videoRef.current) {
      videoRef.current.muted = newMuted
    }
  }, [videoRef, isMuted, storeToggleMute])

  const mute = useCallback(() => {
    if (!isMuted) {
      setIsMuted(true)
      storeToggleMute()
      if (videoRef.current) {
        videoRef.current.muted = true
      }
    }
  }, [videoRef, isMuted, storeToggleMute])

  const unmute = useCallback(() => {
    if (isMuted) {
      setIsMuted(false)
      storeToggleMute()
      if (videoRef.current) {
        videoRef.current.muted = false
      }
    }
  }, [videoRef, isMuted, storeToggleMute])

  return {
    volume,
    isMuted,
    setVolume,
    toggleMute,
    mute,
    unmute,
  }
}

