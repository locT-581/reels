/**
 * useHold - Hold gesture for temporary pause
 * 
 * Hold anywhere on video to pause temporarily
 * Release to continue playing
 */

'use client'

import { useRef, useCallback, useEffect } from 'react'
import { lightHaptic } from '@vortex/core'

export interface HoldOptions {
  /** Called when hold starts */
  onHoldStart?: () => void
  /** Called when hold ends */
  onHoldEnd?: () => void
  /** Called continuously during hold with duration */
  onHoldProgress?: (durationMs: number) => void
  /** Delay before hold is recognized (ms) */
  holdDelay?: number
  /** Enable haptic feedback */
  hapticEnabled?: boolean
  /** Progress update interval (ms) */
  progressInterval?: number
}

export interface HoldReturn {
  /** Props to spread on target element */
  holdProps: {
    onPointerDown: (event: React.PointerEvent) => void
    onPointerUp: (event: React.PointerEvent) => void
    onPointerLeave: (event: React.PointerEvent) => void
    onPointerCancel: (event: React.PointerEvent) => void
  }
  /** Whether currently holding */
  isHolding: boolean
}

export function useHold({
  onHoldStart,
  onHoldEnd,
  onHoldProgress,
  holdDelay = 150,
  hapticEnabled = true,
  progressInterval = 100,
}: HoldOptions = {}): HoldReturn {
  const isHoldingRef = useRef(false)
  const holdTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const holdStartTimeRef = useRef<number>(0)

  const cleanup = useCallback(() => {
    if (holdTimerRef.current) {
      clearTimeout(holdTimerRef.current)
      holdTimerRef.current = null
    }
    if (progressTimerRef.current) {
      clearInterval(progressTimerRef.current)
      progressTimerRef.current = null
    }
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => cleanup()
  }, [cleanup])

  const handlePointerDown = useCallback(
    (_event: React.PointerEvent) => {
      cleanup()

      holdTimerRef.current = setTimeout(() => {
        isHoldingRef.current = true
        holdStartTimeRef.current = Date.now()

        if (hapticEnabled) {
          lightHaptic()
        }

        onHoldStart?.()

        // Start progress updates if handler is provided
        if (onHoldProgress) {
          progressTimerRef.current = setInterval(() => {
            if (isHoldingRef.current) {
              const duration = Date.now() - holdStartTimeRef.current
              onHoldProgress(duration)
            }
          }, progressInterval)
        }
      }, holdDelay)
    },
    [cleanup, holdDelay, hapticEnabled, onHoldStart, onHoldProgress, progressInterval]
  )

  const handlePointerUp = useCallback(() => {
    cleanup()

    if (isHoldingRef.current) {
      isHoldingRef.current = false
      onHoldEnd?.()
    }
  }, [cleanup, onHoldEnd])

  return {
    holdProps: {
      onPointerDown: handlePointerDown,
      onPointerUp: handlePointerUp,
      onPointerLeave: handlePointerUp,
      onPointerCancel: handlePointerUp,
    },
    isHolding: isHoldingRef.current,
  }
}

