/**
 * useSwipe - Swipe gesture detection hook
 */

'use client'

import { useCallback } from 'react'
import { useDrag } from '@use-gesture/react'
import { GESTURE } from '@vortex/core'

export type SwipeDirection = 'up' | 'down' | 'left' | 'right'

export interface SwipeOptions {
  onSwipe: (direction: SwipeDirection) => void
  verticalThreshold?: number
  horizontalThreshold?: number
  velocityThreshold?: number
}

export function useSwipe({
  onSwipe,
  verticalThreshold = GESTURE.SWIPE_VERTICAL_THRESHOLD,
  horizontalThreshold = GESTURE.SWIPE_HORIZONTAL_THRESHOLD,
  velocityThreshold = 0.5,
}: SwipeOptions) {
  const handleSwipe = useCallback(
    (direction: SwipeDirection) => {
      onSwipe(direction)
    },
    [onSwipe]
  )

  const bind = useDrag(
    ({ movement: [mx, my], velocity: [vx, vy], direction: [dx, dy], last }) => {
      if (!last) return

      const viewportWidth = window.innerWidth
      const viewportHeight = window.innerHeight

      // Check velocity threshold
      const velocity = Math.sqrt(vx * vx + vy * vy)
      if (velocity < velocityThreshold) return

      // Determine if vertical or horizontal
      const isVertical = Math.abs(my) > Math.abs(mx)

      if (isVertical) {
        if (Math.abs(my) > viewportHeight * verticalThreshold) {
          handleSwipe(dy > 0 ? 'down' : 'up')
        }
      } else {
        if (Math.abs(mx) > viewportWidth * horizontalThreshold) {
          handleSwipe(dx > 0 ? 'right' : 'left')
        }
      }
    },
    {
      threshold: GESTURE.DRAG_THRESHOLD,
      filterTaps: true,
    }
  )

  return bind
}

