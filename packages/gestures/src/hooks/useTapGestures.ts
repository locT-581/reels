/**
 * useTapGestures - Unified tap gesture handling with zone detection
 */

'use client'

import { useRef, useCallback } from 'react'
import { TAP } from '../constants'
import { lightHaptic } from '../utils/haptics'
import { getGestureZone, type GestureZone } from '../utils/getGestureZone'

export interface TapGestureHandlers {
  /** Called on single tap */
  onSingleTap?: (zone: GestureZone) => void
  /** Called on double tap with zone and position */
  onDoubleTap?: (zone: GestureZone, position: { x: number; y: number }) => void
  /** Double tap delay in ms */
  delay?: number
  /** Enable haptic feedback */
  hapticEnabled?: boolean
}

export interface TapGesturesReturn {
  /** Handle tap event */
  handleTap: (event: React.PointerEvent | PointerEvent) => void
  /** Whether a tap is pending (waiting for potential double tap) */
  isTapPending: () => boolean
  /** Cancel pending single tap */
  cancelPendingTap: () => void
}

export function useTapGestures({
  onSingleTap,
  onDoubleTap,
  delay = TAP.DOUBLE_TAP_DELAY,
  hapticEnabled = true,
}: TapGestureHandlers): TapGesturesReturn {
  const lastTapRef = useRef<number>(0)
  const lastTapZoneRef = useRef<GestureZone>('center')
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isPendingRef = useRef(false)

  const cancelPendingTap = useCallback(() => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
      isPendingRef.current = false
    }
  }, [])

  const handleTap = useCallback(
    (event: React.PointerEvent | PointerEvent) => {
      const pointerEvent = event as PointerEvent
      const zone = getGestureZone(pointerEvent)
      const now = Date.now()
      const timeSinceLastTap = now - lastTapRef.current

      // Capture tap position (absolute viewport coordinates)
      const position = {
        x: pointerEvent.clientX,
        y: pointerEvent.clientY,
      }

      if (
        timeSinceLastTap < delay &&
        lastTapZoneRef.current === zone &&
        onDoubleTap
      ) {
        // Double tap detected in same zone
        cancelPendingTap()

        if (hapticEnabled) {
          lightHaptic()
        }

        onDoubleTap(zone, position)
      } else if (onSingleTap) {
        // Potential single tap - wait to see if double tap follows
        cancelPendingTap()
        isPendingRef.current = true

        timeoutRef.current = setTimeout(() => {
          onSingleTap(zone)
          isPendingRef.current = false
          timeoutRef.current = null
        }, delay)
      }

      lastTapRef.current = now
      lastTapZoneRef.current = zone
    },
    [delay, onSingleTap, onDoubleTap, hapticEnabled, cancelPendingTap]
  )

  const isTapPending = useCallback(() => isPendingRef.current, [])

  return {
    handleTap,
    isTapPending,
    cancelPendingTap,
  }
}

