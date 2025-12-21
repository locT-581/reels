/**
 * DoubleTapHeart - Big heart animation for double tap to like
 * 
 * Shows a 120px heart at center of screen with scale animation
 */

'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heart } from 'lucide-react'
import { EASING } from '@vortex/core'

export interface DoubleTapHeartProps {
  /** Whether to show the heart */
  show: boolean
  /** Position to show the heart (defaults to center) */
  position?: { x: number; y: number }
  /** Size of the heart in pixels */
  size?: number
  /** Duration of the animation in ms */
  duration?: number
  /** Color of the heart */
  color?: string
  /** Callback when animation completes */
  onAnimationComplete?: () => void
}

export function DoubleTapHeart({
  show,
  position,
  size = 120,
  duration = 800,
  color = '#FF2D55', // vortex-red
  onAnimationComplete,
}: DoubleTapHeartProps) {
  return (
    <AnimatePresence onExitComplete={onAnimationComplete}>
      {show && (
        <motion.div
          className="fixed pointer-events-none z-50"
          style={{
            left: position?.x ?? '50%',
            top: position?.y ?? '50%',
            transform: position ? 'translate(-50%, -50%)' : undefined,
            marginLeft: position ? 0 : `-${size / 2}px`,
            marginTop: position ? 0 : `-${size / 2}px`,
          }}
          initial={{ scale: 0, opacity: 1 }}
          animate={{
            scale: [0, 1.2, 1],
            opacity: [1, 1, 0],
          }}
          exit={{ scale: 0.8, opacity: 0 }}
          transition={{
            duration: duration / 1000,
            times: [0, 0.2, 1],
            ease: EASING.VORTEX,
          }}
        >
          <Heart
            size={size}
            fill={color}
            color={color}
            className="drop-shadow-2xl"
          />
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * Hook to control DoubleTapHeart animation
 */
export interface UseDoubleTapHeartReturn {
  /** Whether heart is showing */
  isShowing: boolean
  /** Show heart at position */
  showHeart: (x?: number, y?: number) => void
  /** Hide heart */
  hideHeart: () => void
  /** Current position */
  position: { x: number; y: number } | undefined
}

export function useDoubleTapHeart(duration = 800): UseDoubleTapHeartReturn {
  const [isShowing, setIsShowing] = useState(false)
  const [position, setPosition] = useState<{ x: number; y: number } | undefined>()
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showHeart = useCallback(
    (x?: number, y?: number) => {
      // Clear any existing timer
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }

      // Set position if provided
      if (x !== undefined && y !== undefined) {
        setPosition({ x, y })
      } else {
        setPosition(undefined)
      }

      setIsShowing(true)

      // Auto-hide after duration
      timerRef.current = setTimeout(() => {
        setIsShowing(false)
      }, duration)
    },
    [duration]
  )

  const hideHeart = useCallback(() => {
    if (timerRef.current) {
      clearTimeout(timerRef.current)
    }
    setIsShowing(false)
  }, [])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current)
      }
    }
  }, [])

  return {
    isShowing,
    showHeart,
    hideHeart,
    position,
  }
}

