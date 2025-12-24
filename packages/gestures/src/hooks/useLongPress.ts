/**
 * useLongPress - Unified long press/hold gesture hook
 *
 * Supports two modes:
 * 1. One-time action: Trigger callback after threshold (e.g., context menu)
 * 2. Continuous hold: Track hold state with progress (e.g., temporary pause)
 *
 * Features:
 * - Position tracking for context-aware actions
 * - Movement cancellation (configurable)
 * - Hold progress callback
 * - Haptic feedback
 * - Cleanup on unmount
 */

'use client'

import { useRef, useCallback, useEffect, useState } from 'react'
import { GESTURE } from '../constants'
import { lightHaptic, mediumHaptic } from '../utils/haptics'

export interface LongPressOptions {
  /**
   * Called once when long press threshold is reached
   * For one-time actions like showing context menu
   */
  onLongPress?: (position: { x: number; y: number }) => void

  /**
   * Called when press/hold starts (before threshold)
   */
  onPressStart?: () => void

  /**
   * Called when press/hold ends
   */
  onPressEnd?: () => void

  /**
   * Called continuously during hold with duration
   * Enables "hold" mode for temporary states
   */
  onHoldProgress?: (durationMs: number) => void

  /**
   * Time in ms before long press is recognized
   * Default: GESTURE.LONG_PRESS_THRESHOLD (500ms)
   */
  threshold?: number

  /**
   * Enable movement cancellation
   * If true, moving more than moveTolerance pixels cancels the long press
   * Default: true
   */
  cancelOnMove?: boolean

  /**
   * Maximum pixels to move before canceling
   * Only applies if cancelOnMove is true
   * Default: 10
   */
  moveTolerance?: number

  /**
   * Enable haptic feedback
   * Default: true
   */
  hapticEnabled?: boolean

  /**
   * Type of haptic feedback: 'light' or 'medium'
   * Default: 'medium'
   */
  hapticType?: 'light' | 'medium'

  /**
   * Progress update interval in ms
   * Only applies if onHoldProgress is provided
   * Default: 100
   */
  progressInterval?: number
}

export interface LongPressReturn {
  /** Individual event handlers */
  onPointerDown: (event: React.PointerEvent) => void
  onPointerUp: (event: React.PointerEvent) => void
  onPointerLeave: (event: React.PointerEvent) => void
  onPointerCancel: (event: React.PointerEvent) => void
  onPointerMove: (event: React.PointerEvent) => void

  /** Bundled props to spread on element */
  longPressProps: {
    onPointerDown: (event: React.PointerEvent) => void
    onPointerUp: (event: React.PointerEvent) => void
    onPointerLeave: (event: React.PointerEvent) => void
    onPointerCancel: (event: React.PointerEvent) => void
    onPointerMove: (event: React.PointerEvent) => void
  }

  /** Whether currently in long press/hold state */
  isHolding: boolean

  /** Whether press has started (but may not have reached threshold) */
  isPressing: boolean
}

export function useLongPress({
  onLongPress,
  onPressStart,
  onPressEnd,
  onHoldProgress,
  threshold = GESTURE.LONG_PRESS_THRESHOLD,
  cancelOnMove = true,
  moveTolerance = 10,
  hapticEnabled = true,
  hapticType = 'medium',
  progressInterval = 100,
}: LongPressOptions = {}): LongPressReturn {
  const [isPressing, setIsPressing] = useState(false)
  const [isHolding, setIsHolding] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const progressTimerRef = useRef<ReturnType<typeof setInterval> | null>(null)
  const holdStartTimeRef = useRef<number>(0)
  const positionRef = useRef({ x: 0, y: 0 })
  const isHoldingRef = useRef(false)

  const cleanup = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
      timerRef.current = null
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

  const start = useCallback(
    (event: React.PointerEvent) => {
      cleanup()
      isHoldingRef.current = false
      setIsPressing(true)

      positionRef.current = {
        x: event.clientX,
        y: event.clientY,
      }

      onPressStart?.()

      timerRef.current = setTimeout(() => {
        isHoldingRef.current = true
        setIsHolding(true)
        holdStartTimeRef.current = Date.now()

        if (hapticEnabled) {
          if (hapticType === 'medium') {
            mediumHaptic()
          } else {
            lightHaptic()
          }
        }

        // Call one-time long press handler
        onLongPress?.(positionRef.current)

        // Start progress updates if handler is provided
        if (onHoldProgress) {
          progressTimerRef.current = setInterval(() => {
            if (isHoldingRef.current) {
              const duration = Date.now() - holdStartTimeRef.current
              onHoldProgress(duration)
            }
          }, progressInterval)
        }
      }, threshold)
    },
    [
      cleanup,
      onLongPress,
      onPressStart,
      onHoldProgress,
      threshold,
      hapticEnabled,
      hapticType,
      progressInterval,
    ]
  )

  const end = useCallback(() => {
    cleanup()
    setIsPressing(false)

    if (isHoldingRef.current) {
      isHoldingRef.current = false
      setIsHolding(false)
      onPressEnd?.()
    }
  }, [cleanup, onPressEnd])

  const move = useCallback(
    (event: React.PointerEvent) => {
      if (!cancelOnMove) return

      const dx = Math.abs(event.clientX - positionRef.current.x)
      const dy = Math.abs(event.clientY - positionRef.current.y)

      // Cancel if moved too much
      if (dx > moveTolerance || dy > moveTolerance) {
        cleanup()
        setIsPressing(false)
      }
    },
    [cancelOnMove, moveTolerance, cleanup]
  )

  const handlers = {
    onPointerDown: start,
    onPointerUp: end,
    onPointerLeave: end,
    onPointerCancel: end,
    onPointerMove: move,
  }

  return {
    ...handlers,
    longPressProps: handlers,
    isHolding,
    isPressing,
  }
}

// =============================================================================
// BACKWARDS COMPATIBILITY: useHold
// =============================================================================

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

/**
 * @deprecated Use `useLongPress` with onHoldProgress instead.
 *
 * Migration example:
 * ```tsx
 * // Before:
 * const { holdProps, isHolding } = useHold({
 *   onHoldStart: () => pauseVideo(),
 *   onHoldEnd: () => resumeVideo(),
 * })
 *
 * // After:
 * const { longPressProps, isHolding } = useLongPress({
 *   onPressStart: () => {}, // optional
 *   onPressEnd: () => resumeVideo(),
 *   threshold: 150, // same as holdDelay
 *   cancelOnMove: false, // hold doesn't cancel on move
 * })
 * // Note: For hold-to-pause, you may want to handle pause in the component
 * // based on isHolding state instead
 * ```
 */
export function useHold({
  onHoldStart,
  onHoldEnd,
  onHoldProgress,
  holdDelay = 150,
  hapticEnabled = true,
  progressInterval = 100,
}: HoldOptions = {}): HoldReturn {
  // Emit deprecation warning in development
  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
      console.warn(
        '[XHubReel] useHold is deprecated. Use useLongPress with onHoldProgress instead.'
      )
    }
  }, [])

  const { longPressProps, isHolding } = useLongPress({
    onPressStart: onHoldStart,
    onPressEnd: onHoldEnd,
    onHoldProgress,
    threshold: holdDelay,
    hapticEnabled,
    hapticType: 'light',
    progressInterval,
    cancelOnMove: false, // Hold doesn't cancel on move
  })

  // Return without onPointerMove for backwards compatibility
  return {
    holdProps: {
      onPointerDown: longPressProps.onPointerDown,
      onPointerUp: longPressProps.onPointerUp,
      onPointerLeave: longPressProps.onPointerLeave,
      onPointerCancel: longPressProps.onPointerCancel,
    },
    isHolding,
  }
}
