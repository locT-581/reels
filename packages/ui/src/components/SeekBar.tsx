/**
 * SeekBar - Minimal seek bar with drag support
 */

'use client'

import { useState, useRef, useCallback } from 'react'
import { motion } from 'motion/react'
import { UI } from '@vortex/core'

export interface SeekBarProps {
  currentTime: number
  duration: number
  buffered?: number
  onSeek?: (time: number) => void
  className?: string
}

export function SeekBar({
  currentTime,
  duration,
  buffered = 0,
  onSeek,
  className = '',
}: SeekBarProps) {
  const [isActive, setIsActive] = useState(false)
  const [isDragging, setIsDragging] = useState(false)
  const barRef = useRef<HTMLDivElement>(null)

  const progress = duration > 0 ? (currentTime / duration) * 100 : 0
  const bufferedProgress = duration > 0 ? (buffered / duration) * 100 : 0

  const handleSeek = useCallback(
    (clientX: number) => {
      if (!barRef.current || !duration) return

      const rect = barRef.current.getBoundingClientRect()
      const x = clientX - rect.left
      const percentage = Math.max(0, Math.min(1, x / rect.width))
      const time = percentage * duration

      onSeek?.(time)
    },
    [duration, onSeek]
  )

  const handlePointerDown = (e: React.PointerEvent) => {
    setIsDragging(true)
    handleSeek(e.clientX)
    ;(e.target as HTMLElement).setPointerCapture(e.pointerId)
  }

  const handlePointerMove = (e: React.PointerEvent) => {
    if (!isDragging) return
    handleSeek(e.clientX)
  }

  const handlePointerUp = () => {
    setIsDragging(false)
  }

  return (
    <div
      ref={barRef}
      className={`
        relative w-full cursor-pointer
        ${className}
      `}
      style={{
        height: isActive || isDragging ? UI.SEEK_BAR_HEIGHT_ACTIVE : UI.SEEK_BAR_HEIGHT_DEFAULT,
      }}
      onPointerEnter={() => setIsActive(true)}
      onPointerLeave={() => !isDragging && setIsActive(false)}
      onPointerDown={handlePointerDown}
      onPointerMove={handlePointerMove}
      onPointerUp={handlePointerUp}
      onPointerCancel={handlePointerUp}
      role="slider"
      aria-label="Video progress"
      aria-valuemin={0}
      aria-valuemax={duration}
      aria-valuenow={currentTime}
    >
      {/* Background track */}
      <div className="absolute inset-0 rounded-full bg-white/30" />

      {/* Buffered track */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-white/50"
        style={{ width: `${bufferedProgress}%` }}
      />

      {/* Progress track */}
      <motion.div
        className="absolute inset-y-0 left-0 rounded-full bg-white"
        style={{ width: `${progress}%` }}
      />

      {/* Thumb */}
      {(isActive || isDragging) && (
        <motion.div
          className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full bg-white shadow-lg"
          style={{ left: `${progress}%` }}
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          exit={{ scale: 0 }}
        />
      )}
    </div>
  )
}

