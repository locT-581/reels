/**
 * useProgress - Hook for video progress tracking
 */

'use client'

import { useState, useEffect, useCallback, useRef, type RefObject } from 'react'
import type { PlayerProgress, BufferedRange } from '@vortex/core'

export interface UseProgressReturn extends PlayerProgress {
  seek: (time: number) => void
  seekToProgress: (progress: number) => void
  bufferedRanges: BufferedRange[]
  isSeekable: boolean
}

export function useProgress(
  videoRef: RefObject<HTMLVideoElement | null>
): UseProgressReturn {
  const [currentTime, setCurrentTime] = useState(0)
  const [duration, setDuration] = useState(0)
  const [buffered, setBuffered] = useState(0)
  const [bufferedRanges, setBufferedRanges] = useState<BufferedRange[]>([])
  const animationFrameRef = useRef<number | null>(null)

  // Calculate progress percentage
  const progress = duration > 0 ? (currentTime / duration) * 100 : 0

  // Update progress via requestAnimationFrame for smooth updates
  useEffect(() => {
    const video = videoRef.current
    if (!video) return

    const updateProgress = () => {
      setCurrentTime(video.currentTime)
      setDuration(video.duration || 0)

      // Update buffered ranges
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

      animationFrameRef.current = requestAnimationFrame(updateProgress)
    }

    // Start tracking when video can play
    const handleCanPlay = () => {
      setDuration(video.duration || 0)
      animationFrameRef.current = requestAnimationFrame(updateProgress)
    }

    const handleLoadedMetadata = () => {
      setDuration(video.duration || 0)
    }

    video.addEventListener('canplay', handleCanPlay)
    video.addEventListener('loadedmetadata', handleLoadedMetadata)

    // Start immediately if video is already loaded
    if (video.readyState >= 2) {
      handleCanPlay()
    }

    return () => {
      video.removeEventListener('canplay', handleCanPlay)
      video.removeEventListener('loadedmetadata', handleLoadedMetadata)

      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current)
      }
    }
  }, [videoRef])

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
  }
}

