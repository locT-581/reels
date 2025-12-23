/**
 * useBuffering - Hook for video buffering state
 */

'use client'

import { useState, useEffect, useCallback, useRef, type RefObject } from 'react'
import type { BufferedRange } from '@vortex/core'

/**
 * useBuffering - Hook for video buffering state
 *
 * This hook tracks the buffering state of the video element.
 * It calculates the buffer progress, buffered ranges, and buffer health.
 *
 * @param videoRef - Ref to the video element
 * @returns Object containing buffering state and information
 */
export interface UseBufferingReturn {
  /** Whether the video is buffering */
  isBuffering: boolean
  /** Whether the video is stalled */
  isStalled: boolean
  /** Current buffer progress percentage */
  bufferProgress: number
  /** Buffered ranges */
  bufferedRanges: BufferedRange[]
  /** Amount of buffered ahead of current position */
  bufferedAhead: number;
  /** Buffer health */
  bufferHealth: 'good' | 'low' | 'critical'
}

const STALLED_THRESHOLD_MS = 3000 // Consider stalled after 3s of buffering
const BUFFER_LOW_THRESHOLD_S = 2 // Low buffer if < 2s ahead
const BUFFER_CRITICAL_THRESHOLD_S = 0.5 // Critical if < 0.5s ahead

/**
 * useBuffering - Hook for video buffering state
 *
 * This hook tracks the buffering state of the video element.
 * It calculates the buffer progress, buffered ranges, and buffer health.
 *
 * @param videoRef - Ref to the video element
 * @returns Object containing buffering state and information
 */
export function useBuffering(
  videoRef: RefObject<HTMLVideoElement | null>
): UseBufferingReturn {
  const [isBuffering, setIsBuffering] = useState(false)
  const [isStalled, setIsStalled] = useState(false)
  const [bufferProgress, setBufferProgress] = useState(0)
  const [bufferedRanges, setBufferedRanges] = useState<BufferedRange[]>([])
  const [bufferedAhead, setBufferedAhead] = useState(0)

  const bufferingStartTimeRef = useRef<number | null>(null)
  const stalledTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  // Calculate buffer health
  const bufferHealth: 'good' | 'low' | 'critical' =
    bufferedAhead < BUFFER_CRITICAL_THRESHOLD_S
      ? 'critical'
      : bufferedAhead < BUFFER_LOW_THRESHOLD_S
        ? 'low'
        : 'good'

  // Start stalled timer
  const startStalledTimer = useCallback(() => {
    if (stalledTimeoutRef.current) return

    bufferingStartTimeRef.current = Date.now()

    stalledTimeoutRef.current = setTimeout(() => {
      setIsStalled(true)
    }, STALLED_THRESHOLD_MS)
  }, [])

  // Clear stalled timer
  const clearStalledTimer = useCallback(() => {
    if (stalledTimeoutRef.current) {
      clearTimeout(stalledTimeoutRef.current)
      stalledTimeoutRef.current = null
    }
    bufferingStartTimeRef.current = null
    setIsStalled(false)
  }, [])

  // Update buffered ranges and progress
  const updateBufferInfo = useCallback(() => {
    const video = videoRef.current
    if (!video) return

    const buffered = video.buffered
    const duration = video.duration || 0
    const currentTime = video.currentTime

    // Build ranges array
    const ranges: BufferedRange[] = []
    for (let i = 0; i < buffered.length; i++) {
      ranges.push({
        start: buffered.start(i),
        end: buffered.end(i),
      })
    }
    setBufferedRanges(ranges)

    // Calculate total buffer progress (percentage of video buffered)
    let totalBuffered = 0
    for (const range of ranges) {
      totalBuffered += range.end - range.start
    }
    const progress = duration > 0 ? (totalBuffered / duration) * 100 : 0
    setBufferProgress(progress)

    // Calculate how much is buffered ahead of current position
    let ahead = 0
    for (const range of ranges) {
      if (currentTime >= range.start && currentTime <= range.end) {
        ahead = range.end - currentTime
        break
      }
    }
    setBufferedAhead(ahead)
  }, [videoRef])

  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const handleWaiting = () => {
      setIsBuffering(true)
      startStalledTimer()
    }

    const handlePlaying = () => {
      setIsBuffering(false)
      clearStalledTimer()
    }

    const handleCanPlay = () => {
      setIsBuffering(false)
      clearStalledTimer()
    }

    const handleProgress = () => {
      updateBufferInfo()
    }

    const handleTimeUpdate = () => {
      updateBufferInfo()
    }

    video.addEventListener('waiting', handleWaiting)
    video.addEventListener('playing', handlePlaying)
    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('progress', handleProgress)
    video.addEventListener('timeupdate', handleTimeUpdate)

    // Initial update
    updateBufferInfo()

    return () => {
      video.removeEventListener('waiting', handleWaiting)
      video.removeEventListener('playing', handlePlaying)
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('progress', handleProgress)
      video.removeEventListener('timeupdate', handleTimeUpdate)
      clearStalledTimer()
    }
  }, [videoRef, startStalledTimer, clearStalledTimer, updateBufferInfo])

  return {
    isBuffering,
    isStalled,
    bufferProgress,
    bufferedRanges,
    bufferedAhead,
    bufferHealth,
  }
}

