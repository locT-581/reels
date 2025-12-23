/**
 * useSwipeAnimation - High-performance swipe animation hook
 *
 * Features:
 * - Direct DOM manipulation (bypasses React re-renders)
 * - RAF batching (max 1 update per frame)
 * - Cached viewport height (no layout thrashing)
 * - transitionend event (no setTimeout race conditions)
 * - Design system easing curve
 *
 * @example
 * ```tsx
 * const { setTranslateY, animateTo, snapBack, viewportHeight } = useSwipeAnimation({
 *   trackRef,
 *   transitionDuration: 300,
 * })
 *
 * // During swipe (hot path - no React re-render)
 * setTranslateY(movement)
 *
 * // Complete swipe with animation
 * await animateTo(-viewportHeight)
 * ```
 */

'use client'

import { useRef, useCallback, useEffect } from 'react'

// =============================================================================
// TYPES
// =============================================================================

export interface UseSwipeAnimationOptions {
  /** Ref to the track element that will be animated */
  trackRef: React.RefObject<HTMLDivElement | null>
  /** Transition duration in ms. Default: 300 */
  transitionDuration?: number
  /** CSS easing function. Default: design system spring */
  easing?: string
  /** Called when any transition completes */
  onTransitionEnd?: () => void
}

export interface UseSwipeAnimationReturn {
  /** Set translateY directly (no React, RAF batched) - use during swipe */
  setTranslateY: (y: number) => void
  /** Animate to target Y with CSS transition - returns Promise */
  animateTo: (y: number) => Promise<void>
  /** Snap back to 0 with transition */
  snapBack: () => Promise<void>
  /** Get current translateY value (sync, no DOM read) */
  getCurrentY: () => number
  /** Cached viewport height - use this instead of window.innerHeight */
  viewportHeight: number
  /** Whether currently animating */
  isAnimating: boolean
}

// =============================================================================
// CONSTANTS
// =============================================================================

/** Design system easing - spring-like feel matching TikTok/Reels */
const SPRING_EASING = 'cubic-bezier(0.32, 0.72, 0, 1)'

const DEFAULT_DURATION = 300
const DEFAULT_VIEWPORT_HEIGHT = 800 // SSR fallback
const TRANSITION_END_BUFFER = 50 // Fallback timeout buffer

export function useSwipeAnimation({
  trackRef,
  transitionDuration = DEFAULT_DURATION,
  easing = SPRING_EASING,
  onTransitionEnd,
}: UseSwipeAnimationOptions): UseSwipeAnimationReturn {
  // ===========================================================================
  // REFS (Mutable state that doesn't trigger re-renders)
  // ===========================================================================

  // Cached viewport height - only updated on resize
  const viewportHeightRef = useRef<number>(
    typeof window !== 'undefined' ? window.innerHeight : DEFAULT_VIEWPORT_HEIGHT
  )

  // Current Y position (no DOM reads needed)
  const currentYRef = useRef(0)

  // RAF request ID for batching
  const rafIdRef = useRef<number | null>(null)

  // Animation state
  const isAnimatingRef = useRef(false)

  // Cleanup flag
  const isMountedRef = useRef(true)

  useEffect(() => {
    const handleResize = () => {
      viewportHeightRef.current = window.innerHeight
    }

    // Also update on orientation change (mobile)
    const handleOrientationChange = () => {
      // Small delay to get accurate height after rotation
      setTimeout(() => {
        viewportHeightRef.current = window.innerHeight
      }, 100)
    }

    window.addEventListener('resize', handleResize, { passive: true })
    window.addEventListener('orientationchange', handleOrientationChange, { passive: true })

    return () => {
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('orientationchange', handleOrientationChange)
    }
  }, [])

  /**
   * Set translateY directly via DOM - RAF batched
   *
   * This is the HOT PATH called 60-120 times/second during swipe.
   * It bypasses React completely for maximum performance.
   */
  const setTranslateY = useCallback((y: number) => {
    currentYRef.current = y

    // Cancel previous frame request to batch multiple calls
    if (rafIdRef.current !== null) {
      cancelAnimationFrame(rafIdRef.current)
    }

    // Schedule update for next frame
    rafIdRef.current = requestAnimationFrame(() => {
      const track = trackRef.current
      if (track) {
        // Direct style manipulation - 0 React overhead
        track.style.transition = 'none'
        track.style.transform = `translateY(${y}px)`
      }
      rafIdRef.current = null
    })
  }, [trackRef])

  /**
   * Animate to target Y with CSS transition
   *
   * Returns a Promise that resolves when the animation completes.
   * Uses transitionend event (not setTimeout) for accurate timing.
   */
  const animateTo = useCallback((targetY: number): Promise<void> => {
    return new Promise((resolve) => {
      const track = trackRef.current

      if (!track || !isMountedRef.current) {
        resolve()
        return
      }

      // Prevent overlapping animations
      if (isAnimatingRef.current) {
        resolve()
        return
      }

      isAnimatingRef.current = true
      currentYRef.current = targetY

      // Cleanup function for removing listener
      let cleanup: (() => void) | null = null
      let fallbackTimeout: ReturnType<typeof setTimeout> | null = null

      const handleTransitionEnd = (e: TransitionEvent) => {
        // Only handle transform transitions
        if (e.propertyName !== 'transform') return

        cleanup?.()

        if (isMountedRef.current) {
          isAnimatingRef.current = false
          onTransitionEnd?.()
        }
        resolve()
      }

      cleanup = () => {
        track.removeEventListener('transitionend', handleTransitionEnd)
        if (fallbackTimeout) {
          clearTimeout(fallbackTimeout)
          fallbackTimeout = null
        }
      }

      // Add transitionend listener
      track.addEventListener('transitionend', handleTransitionEnd)

      // Fallback timeout in case transitionend doesn't fire
      // (can happen if element is hidden or transition is interrupted)
      fallbackTimeout = setTimeout(() => {
        cleanup?.()

        if (isMountedRef.current && isAnimatingRef.current) {
          isAnimatingRef.current = false
          onTransitionEnd?.()
        }
        resolve()
      }, transitionDuration + TRANSITION_END_BUFFER)

      // Apply transition + transform
      // Force reflow to ensure transition applies
      // eslint-disable-next-line @typescript-eslint/no-unused-expressions
      track.offsetHeight

      track.style.transition = `transform ${transitionDuration}ms ${easing}`
      track.style.transform = `translateY(${targetY}px)`
    })
  }, [trackRef, transitionDuration, easing, onTransitionEnd])

  /**
   * Snap back to Y=0 with transition
   */
  const snapBack = useCallback((): Promise<void> => {
    return animateTo(0)
  }, [animateTo])

  /**
   * Get current Y value synchronously (no DOM read)
   */
  const getCurrentY = useCallback(() => {
    return currentYRef.current
  }, [])

  // ===========================================================================
  // CLEANUP
  // ===========================================================================

  useEffect(() => {
    isMountedRef.current = true

    return () => {
      isMountedRef.current = false

      // Cancel any pending RAF
      if (rafIdRef.current !== null) {
        cancelAnimationFrame(rafIdRef.current)
        rafIdRef.current = null
      }
    }
  }, [])

  return {
    setTranslateY,
    animateTo,
    snapBack,
    getCurrentY,
    viewportHeight: viewportHeightRef.current,
    isAnimating: isAnimatingRef.current,
  }
}

