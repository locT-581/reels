/**
 * usePreloader - Pre-loading strategy for video feed
 * 
 * Strategy:
 * - Current - 1: Keep in memory, paused
 * - Current: Playing
 * - Current + 1: Pre-load first 3 segments
 * - Current + 2: Pre-load first segment
 * - Current + 3: Fetch metadata only
 * - Current ± 4+: Dispose
 */

'use client'

import { useEffect, useCallback, useRef } from 'react'
import type { Video } from '@vortex/core'

export type PreloadPriority = 'high' | 'medium' | 'low' | 'metadata' | 'none'

export interface PreloadState {
  videoId: string
  priority: PreloadPriority
  loaded: boolean
  error?: Error
}

export interface UsePreloaderOptions {
  /** All videos in feed */
  videos: Video[]
  /** Current video index */
  currentIndex: number
  /** Callback when a video should be preloaded */
  onPreload?: (videoId: string, priority: PreloadPriority) => void
  /** Callback when a video should be disposed */
  onDispose?: (videoId: string) => void
  /** Maximum videos to keep in memory */
  maxInMemory?: number
}

export interface UsePreloaderReturn {
  preloadStates: Map<string, PreloadState>
  getPreloadPriority: (index: number) => PreloadPriority
  preloadVideo: (videoId: string, priority: PreloadPriority) => void
  disposeVideo: (videoId: string) => void
}

export function usePreloader({
  videos,
  currentIndex,
  onPreload,
  onDispose,
  maxInMemory = 5,
}: UsePreloaderOptions): UsePreloaderReturn {
  const preloadStatesRef = useRef<Map<string, PreloadState>>(new Map())
  const preloadQueueRef = useRef<Set<string>>(new Set())

  // Get priority based on distance from current
  const getPreloadPriority = useCallback(
    (index: number): PreloadPriority => {
      const distance = index - currentIndex

      if (distance === 0) return 'high' // Current
      if (distance === -1) return 'high' // Previous
      if (distance === 1) return 'high' // Next (preload 3 segments)
      if (distance === 2) return 'medium' // +2 (preload 1 segment)
      if (distance === 3) return 'low' // +3 (metadata only)
      if (Math.abs(distance) <= maxInMemory / 2) return 'metadata'

      return 'none' // Dispose
    },
    [currentIndex, maxInMemory]
  )

  // Preload a video
  const preloadVideo = useCallback(
    (videoId: string, priority: PreloadPriority) => {
      const existingState = preloadStatesRef.current.get(videoId)

      // Skip if already loaded with same or higher priority
      if (existingState?.loaded && existingState.priority === priority) {
        return
      }

      preloadStatesRef.current.set(videoId, {
        videoId,
        priority,
        loaded: false,
      })

      preloadQueueRef.current.add(videoId)
      onPreload?.(videoId, priority)
    },
    [onPreload]
  )

  // Dispose a video
  const disposeVideo = useCallback(
    (videoId: string) => {
      preloadStatesRef.current.delete(videoId)
      preloadQueueRef.current.delete(videoId)
      onDispose?.(videoId)
    },
    [onDispose]
  )

  // Update preload states when current index changes
  useEffect(() => {
    if (videos.length === 0) return

    // Calculate which videos to keep/preload/dispose
    const videoIdsToKeep = new Set<string>()

    videos.forEach((video, index) => {
      const priority = getPreloadPriority(index)

      if (priority !== 'none') {
        videoIdsToKeep.add(video.id)
        preloadVideo(video.id, priority)
      }
    })

    // Dispose videos no longer needed
    preloadStatesRef.current.forEach((_state, videoId) => {
      if (!videoIdsToKeep.has(videoId)) {
        disposeVideo(videoId)
      }
    })
  }, [videos, currentIndex, getPreloadPriority, preloadVideo, disposeVideo])

  return {
    preloadStates: preloadStatesRef.current,
    getPreloadPriority,
    preloadVideo,
    disposeVideo,
  }
}

/**
 * Create link preload for video metadata
 */
export function preloadVideoMetadata(url: string): void {
  if (typeof document === 'undefined') return

  const link = document.createElement('link')
  link.rel = 'preload'
  link.as = 'fetch'
  link.href = url
  link.crossOrigin = 'anonymous'
  document.head.appendChild(link)

  // Remove after a timeout
  setTimeout(() => {
    link.remove()
  }, 30000)
}

/**
 * Preload video thumbnail
 */
export function preloadThumbnail(url: string): void {
  if (typeof document === 'undefined') return

  const img = new Image()
  img.src = url
}

