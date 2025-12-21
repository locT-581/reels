/**
 * SeekBar - Video progress and seek bar
 * Thin by default (2px), expands on touch (4px)
 */

'use client'

import { useState, useCallback, useRef, useMemo } from 'react'
import { motion } from 'motion/react'
import { formatDuration } from '@vortex/core'
import type { BufferedRange } from '@vortex/core'

export interface SeekBarProps {
  currentTime: number
  duration: number
  bufferedRanges?: BufferedRange[]
  onSeek: (time: number) => void
  onSeekStart?: () => void
  onSeekEnd?: () => void
  /** Show time tooltip while seeking */
  showTooltip?: boolean
  /** Height when inactive */
  height?: number
  /** Height when active/hovering */
  activeHeight?: number
  /** Custom className */
  className?: string
}

export function SeekBar({
  currentTime,
  duration,
  bufferedRanges = [],
  onSeek,
  onSeekStart,
  onSeekEnd,
  showTooltip = true,
  height = 2,
  activeHeight = 4,
  className = '',
}: SeekBarProps) {
  const [isActive, setIsActive] = useState(false)
  const [isSeeking, setIsSeeking] = useState(false)
  const [seekPosition, setSeekPosition] = useState(0)
  const barRef = useRef<HTMLDivElement>(null)

  // Calculate progress percentages
  const progress = useMemo(() => {
    if (duration <= 0) return 0
    return (currentTime / duration) * 100
  }, [currentTime, duration])

  // Calculate buffered segments
  const bufferedSegments = useMemo(() => {
    if (duration <= 0) return []
    return bufferedRanges.map((range) => ({
      start: (range.start / duration) * 100,
      width: ((range.end - range.start) / duration) * 100,
    }))
  }, [bufferedRanges, duration])

  // Get time from position
  const getTimeFromPosition = useCallback(
    (clientX: number) => {
      if (!barRef.current || duration <= 0) return 0

      const rect = barRef.current.getBoundingClientRect()
      const position = Math.max(0, Math.min(1, (clientX - rect.left) / rect.width))
      return position * duration
    },
    [duration]
  )

  // Handle mouse/touch events
  const handlePointerDown = useCallback(
    (e: React.PointerEvent) => {
      e.preventDefault()
      setIsSeeking(true)
      setIsActive(true)
      onSeekStart?.()

      const time = getTimeFromPosition(e.clientX)
      setSeekPosition(time)
    },
    [getTimeFromPosition, onSeekStart]
  )

  const handlePointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isSeeking) return

      const time = getTimeFromPosition(e.clientX)
      setSeekPosition(time)
    },
    [isSeeking, getTimeFromPosition]
  )

  const handlePointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isSeeking) return

      setIsSeeking(false)
      const time = getTimeFromPosition(e.clientX)
      onSeek(time)
      onSeekEnd?.()

      // Keep active state briefly for visual feedback
      setTimeout(() => setIsActive(false), 150)
    },
    [isSeeking, getTimeFromPosition, onSeek, onSeekEnd]
  )

  const handleMouseEnter = () => setIsActive(true)
  const handleMouseLeave = () => {
    if (!isSeeking) setIsActive(false)
  }

  const currentHeight = isActive ? activeHeight : height
  const displayProgress = isSeeking ? (seekPosition / duration) * 100 : progress
  const displayTime = isSeeking ? seekPosition : currentTime

  return (
    <div
      ref={barRef}
      className={`relative w-full cursor-pointer touch-none select-none ${className}`}
      style={{ height: activeHeight + 16 }} // Extra padding for touch
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {/* Time tooltip */}
      {showTooltip && isActive && (
        <motion.div
          className="absolute -top-8 px-2 py-1 rounded bg-black/80 text-white text-xs font-medium"
          style={{
            left: `${displayProgress}%`,
            transform: 'translateX(-50%)',
          }}
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {formatDuration(displayTime)}
        </motion.div>
      )}

      {/* Bar container */}
      <div
        className="absolute left-0 right-0 top-1/2 -translate-y-1/2 rounded-full overflow-hidden bg-white/20"
        style={{ height: currentHeight }}
      >
        {/* Buffered segments */}
        {bufferedSegments.map((segment, i) => (
          <div
            key={i}
            className="absolute top-0 h-full bg-white/30"
            style={{
              left: `${segment.start}%`,
              width: `${segment.width}%`,
            }}
          />
        ))}

        {/* Progress */}
        <motion.div
          className="absolute top-0 left-0 h-full bg-white"
          style={{ width: `${displayProgress}%` }}
          layout
        />
      </div>

      {/* Seek handle */}
      {isActive && (
        <motion.div
          className="absolute top-1/2 -translate-y-1/2 w-3 h-3 rounded-full bg-white shadow-lg"
          style={{
            left: `${displayProgress}%`,
            transform: 'translate(-50%, -50%)',
          }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: 'spring', stiffness: 400, damping: 20 }}
        />
      )}
    </div>
  )
}

