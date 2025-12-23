/**
 * useVideoActivation - Control video play/pause based on isCurrentVideo prop
 *
 * For carousel/swipe feeds: Uses index-based activation from VideoFeed (no IntersectionObserver)
 * For scroll feeds: Enable `trackVisibility` to get viewport-based analytics
 *
 * Note: For infinite scroll loading, use `useInfiniteScroll` instead.
 * For standalone visibility tracking, use `useVideoVisibility` directly.
 */

'use client'

import { useEffect, useRef, useCallback, type RefObject } from 'react'
import { useVideoVisibility } from './useVideoVisibility'

export interface UseVideoActivationOptions {
  /** Video container element ref (required if trackVisibility is true) */
  containerRef?: RefObject<HTMLElement | null>
  /** Video element ref */
  videoRef: RefObject<HTMLVideoElement | null>
  /** Whether this video is the current active one (from parent feed) */
  isCurrentVideo?: boolean
  /** Callback when video should activate */
  onActivate?: () => void
  /** Callback when video should deactivate */
  onDeactivate?: () => void
  /** Whether auto-activation is enabled */
  autoActivate?: boolean
  /**
   * Enable visibility tracking via IntersectionObserver
   * Use this for:
   * - Analytics (track how much of video is visible)
   * - Scroll-based feeds (non-carousel)
   * - Lazy loading based on viewport
   * Default: false (carousel mode)
   */
  trackVisibility?: boolean
  /** Callback for visibility changes (requires trackVisibility: true) */
  onVisibilityChange?: (isVisible: boolean, ratio: number) => void
}

export interface UseVideoActivationReturn {
  /** Whether this video is currently active */
  isActive: boolean
  /** Whether video is visible in viewport (only when trackVisibility: true) */
  isVisible: boolean
  /** Visibility ratio 0-1 (only when trackVisibility: true) */
  visibilityRatio: number
  /** Manually activate the video */
  activate: () => void
  /** Manually deactivate the video */
  deactivate: () => void
}

export function useVideoActivation({
  containerRef,
  videoRef,
  isCurrentVideo = false,
  onActivate,
  onDeactivate,
  autoActivate = true,
  trackVisibility = false,
  onVisibilityChange,
}: UseVideoActivationOptions): UseVideoActivationReturn {
  const wasActiveRef = useRef(false)

  // Optional visibility tracking via IntersectionObserver
  // Only creates observer when trackVisibility is true
  const {
    isVisible: observerIsVisible,
    isActive: observerIsActive,
    visibilityRatio: observerRatio,
  } = useVideoVisibility({
    elementRef: containerRef ?? { current: null },
    onVisibilityChange: trackVisibility ? onVisibilityChange : undefined,
  })

  // Use observer-based activation if trackVisibility is enabled,
  // otherwise use index-based activation from parent
  const effectiveIsActive = trackVisibility ? observerIsActive : isCurrentVideo

  // Activate/deactivate video based on effective active state
  useEffect(() => {
    if (!autoActivate) return

    if (effectiveIsActive && !wasActiveRef.current) {
      // Becoming active
      wasActiveRef.current = true
      onActivate?.()
    } else if (!effectiveIsActive && wasActiveRef.current) {
      // Becoming inactive
      wasActiveRef.current = false
      onDeactivate?.()
    }
  }, [effectiveIsActive, onActivate, onDeactivate, autoActivate])

  const activate = useCallback(() => {
    const video = videoRef.current
    if (video) {
      video.play().catch(() => {
        video.muted = true
        video.play().catch(() => {})
      })
    }
    onActivate?.()
  }, [videoRef, onActivate])

  const deactivate = useCallback(() => {
    const video = videoRef.current
    if (video) {
      video.pause()
      video.currentTime = 0
    }
    onDeactivate?.()
  }, [videoRef, onDeactivate])

  return {
    isActive: effectiveIsActive,
    // Only meaningful when trackVisibility is enabled
    isVisible: trackVisibility ? observerIsVisible : isCurrentVideo,
    visibilityRatio: trackVisibility ? observerRatio : (isCurrentVideo ? 1 : 0),
    activate,
    deactivate,
  }
}
