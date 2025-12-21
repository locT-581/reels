/**
 * useVideoGestures - Combined gesture handler for video player
 */

'use client'

import { useRef, useCallback } from 'react'
import { useGesture } from '@use-gesture/react'
import { GESTURE, lightHaptic, mediumHaptic } from '@vortex/core'
import { getGestureZone, type GestureZone } from '../utils/getGestureZone'

export interface VideoGestureHandlers {
  onSingleTap?: (zone: GestureZone) => void
  onDoubleTap?: (zone: GestureZone) => void
  onLongPress?: (position: { x: number; y: number }) => void
  onSwipeUp?: () => void
  onSwipeDown?: () => void
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  onSeekDrag?: (deltaX: number) => void
  onHoldStart?: () => void
  onHoldEnd?: () => void
}

export function useVideoGestures(handlers: VideoGestureHandlers) {
  const lastTapRef = useRef<number>(0)
  const lastTapZoneRef = useRef<GestureZone>('center')
  const doubleTapTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const longPressTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isHoldingRef = useRef(false)
  const isLongPressRef = useRef(false)
  const pointerPositionRef = useRef({ x: 0, y: 0 })

  const handleTap = useCallback(
    (event: PointerEvent) => {
      // Don't process tap if it was a long press
      if (isLongPressRef.current) {
        isLongPressRef.current = false
        return
      }

      const zone = getGestureZone(event)
      const now = Date.now()
      const timeSinceLastTap = now - lastTapRef.current

      if (timeSinceLastTap < GESTURE.TAP_DELAY && lastTapZoneRef.current === zone) {
        // Double tap
        if (doubleTapTimeoutRef.current) {
          clearTimeout(doubleTapTimeoutRef.current)
          doubleTapTimeoutRef.current = null
        }
        lightHaptic()
        handlers.onDoubleTap?.(zone)
      } else {
        // Potential single tap - wait to see if it's a double tap
        doubleTapTimeoutRef.current = setTimeout(() => {
          handlers.onSingleTap?.(zone)
          doubleTapTimeoutRef.current = null
        }, GESTURE.TAP_DELAY)
      }

      lastTapRef.current = now
      lastTapZoneRef.current = zone
    },
    [handlers]
  )

  const bind = useGesture(
    {
      onPointerDown: ({ event }) => {
        const pointerEvent = event as PointerEvent
        pointerPositionRef.current = {
          x: pointerEvent.clientX,
          y: pointerEvent.clientY,
        }
        isLongPressRef.current = false

        // Start hold detection
        const holdTimeout = setTimeout(() => {
          isHoldingRef.current = true
          handlers.onHoldStart?.()
        }, 150)

        // Start long press detection
        longPressTimeoutRef.current = setTimeout(() => {
          isLongPressRef.current = true
          mediumHaptic()
          const target = pointerEvent.target as HTMLElement
          const rect = target.getBoundingClientRect()
          handlers.onLongPress?.({
            x: pointerEvent.clientX - rect.left,
            y: pointerEvent.clientY - rect.top,
          })
        }, GESTURE.LONG_PRESS_THRESHOLD)

        // Store for cleanup
        ;(event.target as HTMLElement).dataset.holdTimeout = String(holdTimeout)
      },
      onPointerUp: ({ event }) => {
        const holdTimeout = (event.target as HTMLElement).dataset.holdTimeout
        if (holdTimeout) {
          clearTimeout(Number(holdTimeout))
        }

        if (longPressTimeoutRef.current) {
          clearTimeout(longPressTimeoutRef.current)
          longPressTimeoutRef.current = null
        }

        if (isHoldingRef.current) {
          isHoldingRef.current = false
          handlers.onHoldEnd?.()
        }
      },
      onPointerMove: ({ event }) => {
        const pointerEvent = event as PointerEvent
        const dx = Math.abs(pointerEvent.clientX - pointerPositionRef.current.x)
        const dy = Math.abs(pointerEvent.clientY - pointerPositionRef.current.y)

        // Cancel long press if moved too much
        if ((dx > 10 || dy > 10) && longPressTimeoutRef.current) {
          clearTimeout(longPressTimeoutRef.current)
          longPressTimeoutRef.current = null
        }
      },
      onClick: ({ event }) => {
        handleTap(event as unknown as PointerEvent)
      },
      onDrag: ({ movement: [mx, my], direction: [dx, dy], velocity: [vx, vy], last, event }) => {
        // Prevent default to avoid scroll conflicts
        event.preventDefault()

        if (!last) return

        const viewportWidth = window.innerWidth
        const viewportHeight = window.innerHeight

        // Vertical swipe
        if (Math.abs(my) > viewportHeight * GESTURE.SWIPE_VERTICAL_THRESHOLD) {
          if (dy > 0) {
            handlers.onSwipeDown?.()
          } else {
            handlers.onSwipeUp?.()
          }
          return
        }

        // Horizontal swipe
        if (Math.abs(mx) > viewportWidth * GESTURE.SWIPE_HORIZONTAL_THRESHOLD) {
          if (dx > 0) {
            handlers.onSwipeRight?.()
          } else {
            handlers.onSwipeLeft?.()
          }
          return
        }

        // Seek drag (horizontal, shorter distance)
        if (Math.abs(mx) > GESTURE.DRAG_THRESHOLD && Math.abs(vx) > Math.abs(vy)) {
          handlers.onSeekDrag?.(mx)
        }
      },
    },
    {
      drag: {
        threshold: GESTURE.DRAG_THRESHOLD,
        filterTaps: true,
      },
      eventOptions: {
        passive: false,
      },
    }
  )

  return bind
}
