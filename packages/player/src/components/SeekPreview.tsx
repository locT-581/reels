/**
 * SeekPreview - Thumbnail preview while seeking
 */

'use client'

import { motion, AnimatePresence } from 'motion/react'
import { formatDuration, SPRING } from '@xhub-reel/core'

export interface SeekPreviewProps {
  /** Whether preview is visible */
  isVisible: boolean
  /** Current seek time */
  time: number
  /** Total duration */
  duration: number
  /** Preview thumbnail URL (if available) */
  thumbnailUrl?: string
  /** Horizontal position (percentage 0-100) */
  positionX: number
  /** Custom className */
  className?: string
}

export function SeekPreview({
  isVisible,
  time,
  duration,
  thumbnailUrl,
  positionX,
  className = '',
}: SeekPreviewProps) {
  // Clamp position to keep preview on screen
  const clampedPosition = Math.max(10, Math.min(90, positionX))

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className={`absolute bottom-20 z-40 ${className}`}
          style={{
            left: `${clampedPosition}%`,
            transform: 'translateX(-50%)',
          }}
          initial={{ opacity: 0, y: 10, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.9 }}
          transition={{
            type: 'spring',
            stiffness: SPRING.DEFAULT.stiffness,
            damping: SPRING.DEFAULT.damping,
          }}
        >
          <div className="flex flex-col items-center gap-2">
            {/* Thumbnail preview */}
            {thumbnailUrl && (
              <div className="w-32 h-24 rounded-lg overflow-hidden bg-zinc-800 shadow-lg">
                <img
                  src={thumbnailUrl}
                  alt="Preview"
                  className="w-full h-full object-cover"
                />
              </div>
            )}

            {/* Time indicator */}
            <div className="px-3 py-1.5 rounded-full bg-black/80 backdrop-blur-sm">
              <span className="text-white text-sm font-medium tabular-nums">
                {formatDuration(time)}
              </span>
              <span className="text-white/50 text-sm">
                {' / '}
                {formatDuration(duration)}
              </span>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * useSeekPreview - Hook to manage seek preview state
 */
import { useState, useCallback, useRef } from 'react'

export interface UseSeekPreviewReturn {
  isVisible: boolean
  time: number
  positionX: number
  showPreview: (time: number, positionX: number) => void
  hidePreview: () => void
  updatePosition: (time: number, positionX: number) => void
}

export function useSeekPreview(): UseSeekPreviewReturn {
  const [isVisible, setIsVisible] = useState(false)
  const [time, setTime] = useState(0)
  const [positionX, setPositionX] = useState(50)
  const hideTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showPreview = useCallback((newTime: number, newPositionX: number) => {
    if (hideTimeoutRef.current) clearTimeout(hideTimeoutRef.current)
    setIsVisible(true)
    setTime(newTime)
    setPositionX(newPositionX)
  }, [])

  const hidePreview = useCallback(() => {
    // Small delay before hiding for smoother UX
    hideTimeoutRef.current = setTimeout(() => {
      setIsVisible(false)
    }, 200)
  }, [])

  const updatePosition = useCallback((newTime: number, newPositionX: number) => {
    setTime(newTime)
    setPositionX(newPositionX)
  }, [])

  return {
    isVisible,
    time,
    positionX,
    showPreview,
    hidePreview,
    updatePosition,
  }
}

