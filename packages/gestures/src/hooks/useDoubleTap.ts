/**
 * useDoubleTap - Double tap detection hook
 */

'use client'

import { useRef, useCallback } from 'react'
import { GESTURE } from '@vortex/core'

export interface DoubleTapOptions {
  onDoubleTap: () => void
  onSingleTap?: () => void
  delay?: number
}

export function useDoubleTap({
  onDoubleTap,
  onSingleTap,
  delay = GESTURE.TAP_DELAY,
}: DoubleTapOptions) {
  const lastTapRef = useRef<number>(0)
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const handleTap = useCallback(() => {
    const now = Date.now()
    const timeSinceLastTap = now - lastTapRef.current

    if (timeSinceLastTap < delay) {
      // Double tap detected
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null
      }
      onDoubleTap()
    } else {
      // Potential single tap
      if (onSingleTap) {
        timeoutRef.current = setTimeout(() => {
          onSingleTap()
          timeoutRef.current = null
        }, delay)
      }
    }

    lastTapRef.current = now
  }, [delay, onDoubleTap, onSingleTap])

  return handleTap
}

