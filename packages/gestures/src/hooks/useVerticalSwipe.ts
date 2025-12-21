/**
 * useVerticalSwipe - Vertical swipe gesture for video navigation
 * 
 * Swipe up: Next video
 * Swipe down: Previous video
 */

'use client'

import { useRef } from 'react'
import { useDrag } from '@use-gesture/react'
import { SWIPE, DRAG, lightHaptic } from '@vortex/core'

export interface VerticalSwipeOptions {
  /** Called on swipe up (next video) */
  onSwipeUp?: () => void
  /** Called on swipe down (previous video) */
  onSwipeDown?: () => void
  /** Called during swipe with progress (0-1) */
  onSwipeProgress?: (progress: number, direction: 'up' | 'down') => void
  /** Called when swipe is cancelled (didn't reach threshold) */
  onSwipeCancel?: () => void
  /** Threshold as percentage of viewport height (0-1) */
  threshold?: number
  /** Minimum velocity to trigger swipe (px/ms) */
  velocityThreshold?: number
  /** Enable haptic feedback */
  hapticEnabled?: boolean
  /** Disabled state */
  disabled?: boolean
}

export interface VerticalSwipeReturn {
  /** Bind props from use-gesture */
  bind: ReturnType<typeof useDrag>
  /** Current swipe progress (0-1) */
  progress: number
  /** Current swipe direction */
  direction: 'up' | 'down' | null
  /** Whether currently swiping */
  isSwiping: boolean
}

export function useVerticalSwipe({
  onSwipeUp,
  onSwipeDown,
  onSwipeProgress,
  onSwipeCancel,
  threshold = SWIPE.VERTICAL_THRESHOLD,
  velocityThreshold = SWIPE.MIN_VELOCITY,
  hapticEnabled = true,
  disabled = false,
}: VerticalSwipeOptions = {}) {
  const progressRef = useRef(0)
  const directionRef = useRef<'up' | 'down' | null>(null)
  const isSwipingRef = useRef(false)

  const bind = useDrag(
    ({ movement: [_mx, my], velocity: [_vx, vy], direction: [_dx, _dy], active, cancel }) => {
      if (disabled) {
        cancel?.()
        return
      }

      const viewportHeight = window.innerHeight
      const thresholdPx = viewportHeight * threshold
      const progress = Math.min(1, Math.abs(my) / thresholdPx)
      const direction = my < 0 ? 'up' : 'down'

      progressRef.current = progress
      directionRef.current = direction
      isSwipingRef.current = active

      if (active) {
        // During swipe
        onSwipeProgress?.(progress, direction)
      } else {
        // Swipe ended
        const hasReachedThreshold = Math.abs(my) >= thresholdPx
        const hasVelocity = Math.abs(vy) >= velocityThreshold

        if (hasReachedThreshold || hasVelocity) {
          // Swipe completed
          if (hapticEnabled) {
            lightHaptic()
          }

          if (direction === 'up') {
            onSwipeUp?.()
          } else {
            onSwipeDown?.()
          }
        } else {
          // Swipe cancelled
          onSwipeCancel?.()
        }

        // Reset state
        progressRef.current = 0
        directionRef.current = null
        isSwipingRef.current = false
      }
    },
    {
      axis: 'y',
      threshold: DRAG.THRESHOLD,
      filterTaps: true,
      pointer: { touch: true },
    }
  )

  return {
    bind,
    progress: progressRef.current,
    direction: directionRef.current,
    isSwiping: isSwipingRef.current,
  }
}

