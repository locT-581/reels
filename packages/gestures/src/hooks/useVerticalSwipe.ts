/**
 * useVerticalSwipe - High-performance vertical swipe gesture for video navigation
 *
 * Performance optimizations:
 * - NO setState during active gesture (hot path)
 * - Cached viewport height (no layout thrashing)
 * - Passive event listeners
 * - State updates only on gesture END
 *
 * @example
 * ```tsx
 * const { bind, progress, direction, isSwiping } = useVerticalSwipe({
 *   onSwipeUp: () => goToNextVideo(),
 *   onSwipeDown: () => goToPreviousVideo(),
 *   onSwipeProgress: (progress, direction, movement) => {
 *     // movement is raw pixel delta - use for 1:1 finger tracking
 *     // This callback is called 60-120 times/sec - keep it fast!
 *     setTranslateY(movement)
 *   },
 * })
 *
 * return <div {...bind()}>...</div>
 * ```
 */

'use client'

import { useState, useRef, useEffect } from 'react'
import { useDrag } from '@use-gesture/react'
import { SWIPE, DRAG } from '../constants'
import { lightHaptic } from '../utils/haptics'

// =============================================================================
// TYPES
// =============================================================================

export interface VerticalSwipeOptions {
  /** Called on swipe up (next video) */
  onSwipeUp?: () => void
  /** Called on swipe down (previous video) */
  onSwipeDown?: () => void
  /**
   * Called during swipe with progress and movement (HOT PATH)
   * This is called 60-120 times/second - avoid heavy operations!
   *
   * @param progress - Normalized progress (0-1) relative to threshold
   * @param direction - Swipe direction ('up' or 'down')
   * @param movement - Raw pixel movement (positive = down, negative = up)
   */
  onSwipeProgress?: (progress: number, direction: 'up' | 'down', movement: number) => void
  /** Called when swipe is cancelled (didn't reach threshold) */
  onSwipeCancel?: () => void
  /** Threshold as percentage of viewport height (0-1). Default: 0.3 */
  threshold?: number
  /** Minimum velocity to trigger swipe (px/ms). Default: 0.5 */
  velocityThreshold?: number
  /** Enable haptic feedback. Default: true */
  hapticEnabled?: boolean
  /** Disabled state. Default: false */
  disabled?: boolean
  /**
   * Enable state updates during swipe (for UI indicators)
   * Set to false for maximum performance if you don't need reactive state
   * Default: false
   */
  enableProgressState?: boolean
}

export type VerticalSwipeState = {
  /** Current swipe progress (0-1) */
  progress: number
  /** Current swipe direction */
  direction: 'up' | 'down' | null
  /** Whether currently swiping */
  isSwiping: boolean
}

export interface VerticalSwipeReturn extends VerticalSwipeState {
  /** Bind props from use-gesture - spread onto target element */
  bind: ReturnType<typeof useDrag>
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_VIEWPORT_HEIGHT = 800 // Fallback for SSR
const MIN_THRESHOLD = 0.05
const MAX_THRESHOLD = 0.95

// =============================================================================
// HOOK
// =============================================================================

export function useVerticalSwipe({
  onSwipeUp,
  onSwipeDown,
  onSwipeProgress,
  onSwipeCancel,
  threshold = SWIPE.VERTICAL_THRESHOLD as number,
  velocityThreshold = SWIPE.MIN_VELOCITY as number,
  hapticEnabled = true,
  disabled = false,
  enableProgressState = false, // Default OFF for performance
}: VerticalSwipeOptions = {}): VerticalSwipeReturn {
  // Validate and clamp threshold to safe range
  const safeThreshold = Math.max(MIN_THRESHOLD, Math.min(MAX_THRESHOLD, threshold))

  const [swipeState, setSwipeState] = useState<VerticalSwipeState>({
    progress: 0,
    direction: null,
    isSwiping: false,
  })


  // Store callbacks in ref to avoid stale closures
  const callbacksRef = useRef({
    onSwipeUp,
    onSwipeDown,
    onSwipeProgress,
    onSwipeCancel,
  })

  // PERFORMANCE: Cache viewport height - only update on resize
  const viewportHeightRef = useRef<number>(
    typeof window !== 'undefined' ? window.innerHeight : DEFAULT_VIEWPORT_HEIGHT
  )

  // Update callbacks ref on each render (lightweight, no deps needed)
  callbacksRef.current = {
    onSwipeUp,
    onSwipeDown,
    onSwipeProgress,
    onSwipeCancel,
  }

  useEffect(() => {
    const handleResize = () => {
      viewportHeightRef.current = window.innerHeight
    }

    // Also handle orientation change for mobile
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

  const bind = useDrag(
    ({ movement: [, my], velocity: [, vy], active, cancel }) => {
      // Early exit if disabled
      if (disabled) {
        cancel?.()
        return
      }

      // Use cached viewport height - NO window.innerHeight call (layout thrashing)
      const viewportHeight = viewportHeightRef.current
      const thresholdPx = viewportHeight * safeThreshold
      const progress = Math.min(1, Math.abs(my) / thresholdPx)
      const direction: 'up' | 'down' = my < 0 ? 'up' : 'down'

      if (active) {
        // =======================================================================
        // HOT PATH: Called 60-120 times/second
        // CRITICAL: No setState here unless enableProgressState is true
        // =======================================================================

        // Call progress callback (consumer handles animation via direct DOM)
        callbacksRef.current.onSwipeProgress?.(progress, direction, my)

        // OPTIONAL: Update state for UI indicators (progress bars, etc.)
        // Only if explicitly enabled - has performance cost
        if (enableProgressState) {
          setSwipeState({ progress, direction, isSwiping: true })
        }
      } else {
        const hasReachedThreshold = Math.abs(my) >= thresholdPx
        const hasVelocity = Math.abs(vy) >= velocityThreshold

        if (hasReachedThreshold || hasVelocity) {
          // Swipe completed successfully
          if (hapticEnabled) {
            lightHaptic()
          }

          if (direction === 'up') {
            callbacksRef.current.onSwipeUp?.()
          } else {
            callbacksRef.current.onSwipeDown?.()
          }
        } else {
          // Swipe cancelled - didn't reach threshold
          callbacksRef.current.onSwipeCancel?.()
        }

        // Reset state (single setState on end)
        setSwipeState({ progress: 0, direction: null, isSwiping: false })
      }
    },
    {
      // Gesture configuration
      axis: 'y',
      threshold: DRAG.THRESHOLD,
      filterTaps: true,
      pointer: { touch: true },
      // PERFORMANCE: Passive event listeners for better scroll performance
      eventOptions: { passive: true },
    }
  )

  return {
    bind,
    ...swipeState,
  }
}
