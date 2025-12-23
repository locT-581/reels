/**
 * useHorizontalSwipe - Horizontal swipe gesture for profile/back navigation
 *
 * Swipe left: Go to profile/details
 * Swipe right: Go back
 *
 * @example
 * ```tsx
 * const { bind, progress, direction, isSwiping } = useHorizontalSwipe({
 *   onSwipeLeft: () => goToProfile(),
 *   onSwipeRight: () => goBack(),
 *   onSwipeProgress: (progress, dir) => setTranslateX(progress * dir),
 * })
 *
 * return <div {...bind()}>...</div>
 * ```
 */

'use client'

import { useState, useRef, useCallback } from 'react'
import { useDrag } from '@use-gesture/react'
import { SWIPE, DRAG } from '../constants'
import { lightHaptic } from '../utils/haptics'

// =============================================================================
// TYPES
// =============================================================================

export interface HorizontalSwipeOptions {
  /** Called on swipe left (go to profile) */
  onSwipeLeft?: () => void
  /** Called on swipe right (go back) */
  onSwipeRight?: () => void
  /** Called during swipe with progress (0-1) */
  onSwipeProgress?: (progress: number, direction: 'left' | 'right') => void
  /** Called when swipe is cancelled (didn't reach threshold) */
  onSwipeCancel?: () => void
  /** Threshold as percentage of viewport width (0-1). Default: 0.4 */
  threshold?: number
  /** Minimum velocity to trigger swipe (px/ms). Default: 0.5 */
  velocityThreshold?: number
  /** Enable haptic feedback. Default: true */
  hapticEnabled?: boolean
  /** Disabled state. Default: false */
  disabled?: boolean
}

export interface HorizontalSwipeState {
  /** Current swipe progress (0-1) */
  progress: number
  /** Current swipe direction */
  direction: 'left' | 'right' | null
  /** Whether currently swiping */
  isSwiping: boolean
}

export interface HorizontalSwipeReturn extends HorizontalSwipeState {
  /** Bind props from use-gesture - spread onto target element */
  bind: ReturnType<typeof useDrag>
}

// =============================================================================
// CONSTANTS
// =============================================================================

const DEFAULT_VIEWPORT_WIDTH = 390 // iPhone 14 width as fallback for SSR
const MIN_THRESHOLD = 0.05
const MAX_THRESHOLD = 0.95

// =============================================================================
// HOOK
// =============================================================================

export function useHorizontalSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeProgress,
  onSwipeCancel,
  threshold = SWIPE.HORIZONTAL_THRESHOLD,
  velocityThreshold = SWIPE.MIN_VELOCITY,
  hapticEnabled = true,
  disabled = false,
}: HorizontalSwipeOptions = {}): HorizontalSwipeReturn {
  // Validate and clamp threshold to safe range
  const safeThreshold = Math.max(MIN_THRESHOLD, Math.min(MAX_THRESHOLD, threshold))

  // Reactive state for UI updates
  const [swipeState, setSwipeState] = useState<HorizontalSwipeState>({
    progress: 0,
    direction: null,
    isSwiping: false,
  })

  // Store callbacks in ref to avoid stale closures and unnecessary re-binds
  const callbacksRef = useRef({
    onSwipeLeft,
    onSwipeRight,
    onSwipeProgress,
    onSwipeCancel,
  })

  // Update callbacks ref on each render (no deps needed, just sync)
  callbacksRef.current = {
    onSwipeLeft,
    onSwipeRight,
    onSwipeProgress,
    onSwipeCancel,
  }

  // Get viewport width with SSR safety
  const getViewportWidth = useCallback(() => {
    return typeof window !== 'undefined' ? window.innerWidth : DEFAULT_VIEWPORT_WIDTH
  }, [])

  const bind = useDrag(
    ({ movement: [mx], velocity: [vx], active, cancel }) => {
      // Early exit if disabled
      if (disabled) {
        cancel?.()
        return
      }

      const viewportWidth = getViewportWidth()
      const thresholdPx = viewportWidth * safeThreshold
      const progress = Math.min(1, Math.abs(mx) / thresholdPx)
      const direction: 'left' | 'right' = mx < 0 ? 'left' : 'right'

      if (active) {
        // During swipe - update state and notify
        setSwipeState({ progress, direction, isSwiping: true })
        callbacksRef.current.onSwipeProgress?.(progress, direction)
      } else {
        // Swipe ended - determine outcome
        const hasReachedThreshold = Math.abs(mx) >= thresholdPx
        const hasVelocity = Math.abs(vx) >= velocityThreshold

        if (hasReachedThreshold || hasVelocity) {
          // Swipe completed successfully
          if (hapticEnabled) {
            lightHaptic()
          }

          if (direction === 'left') {
            callbacksRef.current.onSwipeLeft?.()
          } else {
            callbacksRef.current.onSwipeRight?.()
          }
        } else {
          // Swipe cancelled - didn't reach threshold
          callbacksRef.current.onSwipeCancel?.()
        }

        // Reset state
        setSwipeState({ progress: 0, direction: null, isSwiping: false })
      }
    },
    {
      axis: 'x',
      threshold: DRAG.THRESHOLD,
      filterTaps: true,
      pointer: { touch: true },
    }
  )

  return {
    bind,
    ...swipeState,
  }
}
