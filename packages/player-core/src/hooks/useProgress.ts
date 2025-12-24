/**
 * useProgress - High-performance hook for video progress tracking
 *
 * Performance optimizations:
 * - Uses timeupdate event (4-10 updates/sec) for basic tracking
 * - RAF only when video is playing AND smooth tracking is needed
 * - Stops RAF when video is paused/ended
 * - Battery-efficient on mobile devices
 */

'use client'

import { useState, useEffect, useCallback, useRef, type RefObject } from 'react'
import type { PlayerProgress, BufferedRange } from '@xhub-reel/core'

export type UseProgressOptions = {
  /** Enable smooth RAF tracking when playing. Default: false */
  enableSmoothTracking?: boolean
}

export type UseProgressReturn = PlayerProgress & {
  /** Seek to a specific time */
  seek: (time: number) => void
  /** Seek to a specific progress percentage */
  seekToProgress: (progress: number) => void
  /** Buffered ranges */
  bufferedRanges: BufferedRange[]
  /** Whether the video is seekable */
  isSeekable: boolean
  /** Start smooth RAF tracking (for seek preview) */
  startSmoothTracking: () => void
  /** Stop smooth RAF tracking */
  stopSmoothTracking: () => void
}

/**
 * useProgress - Hook for video progress tracking
 *
 * This hook tracks the progress of the video element.
 * It calculates the current time, duration, buffered progress, and buffered ranges.
 *
 * @param videoRef - Ref to the video element
 * @param options - Options for the hook
 * @returns Object containing progress state and controls
 */
export function useProgress(
  videoRef: RefObject<HTMLVideoElement | null>,
  options: UseProgressOptions = {}
): UseProgressReturn {
  const { enableSmoothTracking = false } = options

  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [bufferedRanges, setBufferedRanges] = useState<BufferedRange[]>([])

  const rafRef = useRef<number | null>(null)
  const isTrackingRef = useRef(false)

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  // Update buffered ranges helper
  const updateBufferedRanges = useCallback((video: HTMLVideoElement) => {
    const ranges: BufferedRange[] = []
    const videoBuffered = video.buffered

    for (let i = 0; i < videoBuffered.length; i++) {
      ranges.push({
        start: videoBuffered.start(i),
        end: videoBuffered.end(i),
      })
    }

    setBufferedRanges(ranges)

    // Calculate buffered amount from current position
    let bufferedFromCurrent = 0
    for (const range of ranges) {
      if (video.currentTime >= range.start && video.currentTime <= range.end) {
        bufferedFromCurrent = range.end - video.currentTime
        break
      }
    }
    setBuffered(bufferedFromCurrent)
  }, [])

  // Stop RAF tracking
  const stopSmoothTracking = useCallback(() => {
    if (rafRef.current !== null) {
      cancelAnimationFrame(rafRef.current)
      rafRef.current = null
    }
    isTrackingRef.current = false
  }, [])

  // Start smooth RAF tracking (only when video is playing)
  const startSmoothTracking = useCallback(() => {
    const video = videoRef.current
    if (!video || isTrackingRef.current) return

    isTrackingRef.current = true

    const track = () => {
      if (!video || video.paused || video.ended) {
        // Stop tracking when video is not playing
        isTrackingRef.current = false
        rafRef.current = null
        return
      }

      setCurrentTime(video.currentTime)
      rafRef.current = requestAnimationFrame(track)
    }

    rafRef.current = requestAnimationFrame(track)
  }, [videoRef])

  // Main effect - event-based tracking (battery efficient)
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    // timeupdate event - browser manages frequency (4-10 updates/sec)
    const handleTimeUpdate = () => {
      setCurrentTime(video.currentTime)
    }

    // Duration and metadata
    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0)
    }

    const handleDurationChange = () => {
      setDuration(video.duration || 0)
    }

    // Buffered progress - only update on progress event
    const handleProgress = () => {
      updateBufferedRanges(video)
    }

    // Play/pause for smooth tracking
    const handlePlay = () => {
      if (enableSmoothTracking) {
        startSmoothTracking()
      }
    }

    const handlePause = () => {
      stopSmoothTracking()
    }

    const handleEnded = () => {
      stopSmoothTracking()
    }

    // Seeking events
    const handleSeeking = () => {
      setCurrentTime(video.currentTime)
    }

    const handleSeeked = () => {
      setCurrentTime(video.currentTime)
      updateBufferedRanges(video)
    }

    // Add event listeners
    video.addEventListener('timeupdate', handleTimeUpdate)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)
    video.addEventListener('durationchange', handleDurationChange)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('play', handlePlay)
    video.addEventListener('pause', handlePause)
    video.addEventListener('ended', handleEnded)
    video.addEventListener('seeking', handleSeeking)
    video.addEventListener('seeked', handleSeeked)

    // Initialize state if video already has data
    if (video.readyState >= 1) {
      setDuration(video.duration || 0)
      setCurrentTime(video.currentTime)
    }
    if (video.readyState >= 3) {
      updateBufferedRanges(video)
    }

    // Start smooth tracking if already playing
    if (!video.paused && enableSmoothTracking) {
      startSmoothTracking()
    }

    return () => {
      // Remove event listeners
      video.removeEventListener('timeupdate', handleTimeUpdate)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)
      video.removeEventListener('durationchange', handleDurationChange)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('play', handlePlay)
      video.removeEventListener('pause', handlePause)
      video.removeEventListener('ended', handleEnded)
      video.removeEventListener('seeking', handleSeeking)
      video.removeEventListener('seeked', handleSeeked)

      // Stop RAF
      stopSmoothTracking()
    }
  }, [videoRef, enableSmoothTracking, updateBufferedRanges, startSmoothTracking, stopSmoothTracking])

  const seek = useCallback(
    (time: number) => {
      const video = videoRef.current
      if (!video || !isFinite(video.duration)) return

      const clampedTime = Math.max(0, Math.min(time, video.duration))
      video.currentTime = clampedTime
      setCurrentTime(clampedTime)
    },
    [videoRef]
  )

  const seekToProgress = useCallback(
    (progressPercent: number) => {
      const video = videoRef.current
      if (!video || !isFinite(video.duration)) return

      const clampedProgress = Math.max(0, Math.min(100, progressPercent))
      const time = (clampedProgress / 100) * video.duration
      video.currentTime = time
      setCurrentTime(time)
    },
    [videoRef]
  )

  const isSeekable = duration > 0 && isFinite(duration)

  return {
    currentTime,
    duration,
    buffered,
    progress,
    bufferedRanges,
    seek,
    seekToProgress,
    isSeekable,
    startSmoothTracking,
    stopSmoothTracking,
  }
}
