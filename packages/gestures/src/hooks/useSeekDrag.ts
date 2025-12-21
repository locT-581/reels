/**
 * useSeekDrag - Drag gesture for seeking video
 * 
 * Horizontal drag to seek through video
 * 1px = configurable seconds
 */

'use client'

import { useRef, useCallback, useState } from 'react'
import { useDrag } from '@use-gesture/react'
import { DRAG, GESTURE } from '@vortex/core'

export interface SeekDragOptions {
  /** Current video time in seconds */
  currentTime: number
  /** Total video duration in seconds */
  duration: number
  /** Called when seeking (during drag) */
  onSeek?: (time: number) => void
  /** Called when seeking starts */
  onSeekStart?: () => void
  /** Called when seeking ends */
  onSeekEnd?: (finalTime: number) => void
  /** Called with preview time during drag */
  onPreview?: (time: number, position: { x: number; y: number }) => void
  /** Seconds per pixel dragged */
  sensitivity?: number
  /** Whether to show preview during drag */
  showPreview?: boolean
  /** Disabled state */
  disabled?: boolean
}

export interface SeekDragReturn {
  /** Bind props from use-gesture */
  bind: ReturnType<typeof useDrag>
  /** Whether currently seeking */
  isSeeking: boolean
  /** Preview time while dragging */
  previewTime: number | null
  /** Preview position */
  previewPosition: { x: number; y: number } | null
}

export function useSeekDrag({
  currentTime,
  duration,
  onSeek,
  onSeekStart,
  onSeekEnd,
  onPreview,
  sensitivity = GESTURE.SEEK_DRAG_RATIO,
  showPreview = true,
  disabled = false,
}: SeekDragOptions) {
  const [isSeeking, setIsSeeking] = useState(false)
  const [previewTime, setPreviewTime] = useState<number | null>(null)
  const [previewPosition, setPreviewPosition] = useState<{ x: number; y: number } | null>(null)
  
  const startTimeRef = useRef(currentTime)
  const seekingRef = useRef(false)

  const clampTime = useCallback(
    (time: number) => Math.max(0, Math.min(duration, time)),
    [duration]
  )

  const bind = useDrag(
    ({ movement: [mx], xy: [x, y], first, last, cancel }) => {
      if (disabled) {
        cancel?.()
        return
      }

      if (first) {
        // Drag started
        startTimeRef.current = currentTime
        seekingRef.current = true
        setIsSeeking(true)
        onSeekStart?.()
      }

      // Calculate new time based on drag distance
      const deltaTime = mx * sensitivity
      const newTime = clampTime(startTimeRef.current + deltaTime)

      // Update preview
      if (showPreview) {
        setPreviewTime(newTime)
        setPreviewPosition({ x, y })
        onPreview?.(newTime, { x, y })
      }

      // Call seek callback
      onSeek?.(newTime)

      if (last) {
        // Drag ended
        seekingRef.current = false
        setIsSeeking(false)
        setPreviewTime(null)
        setPreviewPosition(null)
        onSeekEnd?.(newTime)
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
    isSeeking,
    previewTime,
    previewPosition,
  }
}

