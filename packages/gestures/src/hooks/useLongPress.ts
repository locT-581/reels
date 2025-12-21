/**
 * useLongPress - Long press detection hook
 */

'use client'

import { useRef, useCallback } from 'react'
import { GESTURE, mediumHaptic } from '@vortex/core'

export interface LongPressOptions {
  onLongPress: (position: { x: number; y: number }) => void
  onPressStart?: () => void
  onPressEnd?: () => void
  threshold?: number
}

export function useLongPress({
  onLongPress,
  onPressStart,
  onPressEnd,
  threshold = GESTURE.LONG_PRESS_THRESHOLD,
}: LongPressOptions) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const isLongPressRef = useRef(false)
  const positionRef = useRef({ x: 0, y: 0 })

  const start = useCallback(
    (event: React.PointerEvent) => {
      isLongPressRef.current = false
      positionRef.current = {
        x: event.clientX,
        y: event.clientY,
      }

      onPressStart?.()

      timerRef.current = setTimeout(() => {
        isLongPressRef.current = true
        mediumHaptic()
        onLongPress(positionRef.current)
      }, threshold)
    },
    [onLongPress, onPressStart, threshold]
  )

  const end = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
    }

    if (isLongPressRef.current) {
      onPressEnd?.()
    }
  }, [onPressEnd])

  const move = useCallback((event: React.PointerEvent) => {
    const dx = Math.abs(event.clientX - positionRef.current.x)
    const dy = Math.abs(event.clientY - positionRef.current.y)

    // Cancel if moved too much
    if (dx > 10 || dy > 10) {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
        timerRef.current = null
      }
    }
  }, [])

  return {
    onPointerDown: start,
    onPointerUp: end,
    onPointerLeave: end,
    onPointerCancel: end,
    onPointerMove: move,
  }
}

