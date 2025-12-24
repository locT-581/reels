/**
 * SeekAnimation - Ripple animation for seek gestures
 * Shows "+10s" / "-10s" with ripple effect
 */

'use client'

import { motion, AnimatePresence } from 'motion/react'
import { FastForward, Rewind } from 'lucide-react'
import { SPRING } from '@xhub-reel/core'

export interface SeekAnimationProps {
  /** Direction of seek */
  direction: 'forward' | 'backward'
  /** Seconds seeked */
  seconds?: number
  /** Position on screen */
  position: 'left' | 'right'
  /** Whether to show */
  isVisible: boolean
  /** Callback when animation completes */
  onComplete?: () => void
}

export function SeekAnimation({
  direction,
  seconds = 10,
  position,
  isVisible,
  onComplete,
}: SeekAnimationProps) {
  const Icon = direction === 'forward' ? FastForward : Rewind
  const label = direction === 'forward' ? `+${seconds}s` : `-${seconds}s`

  const positionClass = position === 'left' ? 'left-1/4' : 'right-1/4'

  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className={`absolute top-1/2 ${positionClass} -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-none`}
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 1.2 }}
          transition={{
            type: 'spring',
            stiffness: SPRING.DEFAULT.stiffness * 1.5,
            damping: SPRING.DEFAULT.damping,
          }}
        >
          {/* Ripple circles */}
          {[0, 1, 2].map((i) => (
            <motion.div
              key={i}
              className="absolute inset-0 rounded-full border-2 border-white/30"
              initial={{ scale: 0.8, opacity: 0.5 }}
              animate={{
                scale: [0.8, 1.5 + i * 0.3],
                opacity: [0.5, 0],
              }}
              transition={{
                duration: 0.6,
                delay: i * 0.1,
                ease: 'easeOut',
              }}
              style={{
                width: 80,
                height: 80,
                left: -40,
                top: -40,
              }}
            />
          ))}

          {/* Icon and label */}
          <motion.div
            className="flex flex-col items-center gap-1"
            initial={{ y: 10 }}
            animate={{ y: 0 }}
          >
            <div className="w-14 h-14 rounded-full bg-black/40 backdrop-blur-sm flex items-center justify-center">
              <Icon className="w-7 h-7 text-white" />
            </div>
            <span className="text-white text-sm font-semibold drop-shadow-[0_2px_4px_rgba(0,0,0,0.8)]">
              {label}
            </span>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * useSeekAnimation - Hook to trigger seek animations
 */
import { useState, useCallback, useRef } from 'react'

export interface UseSeekAnimationReturn {
  showForward: () => void
  showBackward: () => void
  forwardProps: SeekAnimationProps
  backwardProps: SeekAnimationProps
}

export function useSeekAnimation(seconds: number = 10): UseSeekAnimationReturn {
  const [showForwardAnim, setShowForwardAnim] = useState(false)
  const [showBackwardAnim, setShowBackwardAnim] = useState(false)
  const forwardTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const backwardTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showForward = useCallback(() => {
    if (forwardTimeoutRef.current) clearTimeout(forwardTimeoutRef.current)
    setShowForwardAnim(true)
    forwardTimeoutRef.current = setTimeout(() => setShowForwardAnim(false), 400)
  }, [])

  const showBackward = useCallback(() => {
    if (backwardTimeoutRef.current) clearTimeout(backwardTimeoutRef.current)
    setShowBackwardAnim(true)
    backwardTimeoutRef.current = setTimeout(() => setShowBackwardAnim(false), 400)
  }, [])

  return {
    showForward,
    showBackward,
    forwardProps: {
      direction: 'forward',
      seconds,
      position: 'right',
      isVisible: showForwardAnim,
    },
    backwardProps: {
      direction: 'backward',
      seconds,
      position: 'left',
      isVisible: showBackwardAnim,
    },
  }
}

