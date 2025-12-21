/**
 * useVideoActivation - Control video play/pause based on visibility
 */

'use client'

import { useEffect, useRef, useCallback, type RefObject } from 'react'
import { VIDEO_ACTIVATION } from '@vortex/core'
import { useVideoVisibility } from './useVideoVisibility'

export interface UseVideoActivationOptions {
  /** Video container element ref */
  containerRef: RefObject<HTMLElement | null>
  /** Video element ref */
  videoRef: RefObject<HTMLVideoElement | null>
  /** Whether this video is the current active one */
  isCurrentVideo?: boolean
  /** Callback when video should activate */
  onActivate?: () => void
  /** Callback when video should deactivate */
  onDeactivate?: () => void
  /** Whether auto-activation is enabled */
  autoActivate?: boolean
}

export interface UseVideoActivationReturn {
  isActive: boolean
  isVisible: boolean
  visibilityRatio: number
  activate: () => void
  deactivate: () => void
}

export function useVideoActivation({
  containerRef,
  videoRef,
  isCurrentVideo: _isCurrentVideo = false,
  onActivate,
  onDeactivate,
  autoActivate = true,
}: UseVideoActivationOptions): UseVideoActivationReturn {
  const wasActiveRef = useRef(false)
  const scrollVelocityRef = useRef(0)
  const lastScrollTimeRef = useRef(Date.now())
  const lastScrollPosRef = useRef(0)
  const scrollStopTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const { isActive, isVisible, visibilityRatio } = useVideoVisibility({
    elementRef: containerRef,
  })

  // Track scroll velocity
  useEffect(() => {
    const handleScroll = () => {
      const now = Date.now()
      const currentPos = window.scrollY
      const timeDelta = now - lastScrollTimeRef.current
      const posDelta = Math.abs(currentPos - lastScrollPosRef.current)

      if (timeDelta > 0) {
        scrollVelocityRef.current = (posDelta / timeDelta) * 1000 // px/s
      }

      lastScrollTimeRef.current = now
      lastScrollPosRef.current = currentPos

      // Clear and reset scroll stop timeout
      if (scrollStopTimeoutRef.current) {
        clearTimeout(scrollStopTimeoutRef.current)
      }

      scrollStopTimeoutRef.current = setTimeout(() => {
        scrollVelocityRef.current = 0
      }, VIDEO_ACTIVATION.SCROLL_SETTLE_DELAY)
    }

    window.addEventListener('scroll', handleScroll, { passive: true })
    return () => {
      window.removeEventListener('scroll', handleScroll)
      if (scrollStopTimeoutRef.current) {
        clearTimeout(scrollStopTimeoutRef.current)
      }
    }
  }, [])

  // Activate/deactivate video based on visibility
  useEffect(() => {
    if (!autoActivate) return

    const video = videoRef.current
    if (!video) return

    // Skip activation if scrolling too fast
    if (scrollVelocityRef.current > VIDEO_ACTIVATION.SCROLL_VELOCITY_THRESHOLD) {
      return
    }

    if (isActive && !wasActiveRef.current) {
      // Becoming active
      wasActiveRef.current = true
      onActivate?.()

      // Auto-play
      video.play().catch((e) => {
        // Autoplay blocked, try muted
        if (e.name === 'NotAllowedError') {
          video.muted = true
          video.play().catch(() => {})
        }
      })
    } else if (!isActive && wasActiveRef.current) {
      // Becoming inactive
      wasActiveRef.current = false
      onDeactivate?.()

      // Pause and reset
      video.pause()
      video.currentTime = 0
    }
  }, [isActive, videoRef, onActivate, onDeactivate, autoActivate])

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
    isActive,
    isVisible,
    visibilityRatio,
    activate,
    deactivate,
  }
}
