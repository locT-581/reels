/**
 * useHorizontalSwipe - Horizontal swipe gesture for profile/back navigation
 * 
 * Swipe left: Go to profile/details
 * Swipe right: Go back
 */

'use client'

import { useRef } from 'react'
import { useDrag } from '@use-gesture/react'
import { SWIPE, DRAG, lightHaptic } from '@vortex/core'

export interface HorizontalSwipeOptions {
  /** Called on swipe left (go to profile) */
  onSwipeLeft?: () => void
  /** Called on swipe right (go back) */
  onSwipeRight?: () => void
  /** Called during swipe with progress (0-1) */
  onSwipeProgress?: (progress: number, direction: 'left' | 'right') => void
  /** Called when swipe is cancelled */
  onSwipeCancel?: () => void
  /** Threshold as percentage of viewport width (0-1) */
  threshold?: number
  /** Minimum velocity to trigger swipe (px/ms) */
  velocityThreshold?: number
  /** Enable haptic feedback */
  hapticEnabled?: boolean
  /** Disabled state */
  disabled?: boolean
}

export interface HorizontalSwipeReturn {
  /** Bind props from use-gesture */
  bind: ReturnType<typeof useDrag>
  /** Current swipe progress (0-1) */
  progress: number
  /** Current swipe direction */
  direction: 'left' | 'right' | null
  /** Whether currently swiping */
  isSwiping: boolean
}

export function useHorizontalSwipe({
  onSwipeLeft,
  onSwipeRight,
  onSwipeProgress,
  onSwipeCancel,
  threshold = SWIPE.HORIZONTAL_THRESHOLD,
  velocityThreshold = SWIPE.MIN_VELOCITY,
  hapticEnabled = true,
  disabled = false,
}: HorizontalSwipeOptions = {}) {
  const progressRef = useRef(0)
  const directionRef = useRef<'left' | 'right' | null>(null)
  const isSwipingRef = useRef(false)

  const bind = useDrag(
    ({ movement: [mx, _my], velocity: [vx, _vy], direction: [_dx, _dy], active, cancel }) => {
      if (disabled) {
        cancel?.()
        return
      }

      const viewportWidth = window.innerWidth
      const thresholdPx = viewportWidth * threshold
      const progress = Math.min(1, Math.abs(mx) / thresholdPx)
      const direction = mx < 0 ? 'left' : 'right'

      progressRef.current = progress
      directionRef.current = direction
      isSwipingRef.current = active

      if (active) {
        // During swipe
        onSwipeProgress?.(progress, direction)
      } else {
        // Swipe ended
        const hasReachedThreshold = Math.abs(mx) >= thresholdPx
        const hasVelocity = Math.abs(vx) >= velocityThreshold

        if (hasReachedThreshold || hasVelocity) {
          // Swipe completed
          if (hapticEnabled) {
            lightHaptic()
          }

          if (direction === 'left') {
            onSwipeLeft?.()
          } else {
            onSwipeRight?.()
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
      axis: 'x',
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

