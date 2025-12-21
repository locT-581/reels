/**
 * HeartAnimation - Big heart explosion for double-tap like
 */

'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Heart } from 'lucide-react'

export interface HeartAnimationProps {
  /** Whether to show the animation */
  isVisible: boolean
  /** Position of the animation */
  x?: number
  y?: number
  /** Size of the heart */
  size?: number
  /** Callback when animation completes */
  onComplete?: () => void
}

export function HeartAnimation({
  isVisible,
  x = 0,
  y = 0,
  size = 120,
  onComplete,
}: HeartAnimationProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {isVisible && (
        <motion.div
          className="absolute pointer-events-none z-50"
          style={{
            left: x - size / 2,
            top: y - size / 2,
            width: size,
            height: size,
          }}
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.2, 1, 0.8],
            y: [0, -20, -20, -40],
          }}
          transition={{
            duration: 0.8,
            times: [0, 0.2, 0.6, 1],
            ease: 'easeOut',
          }}
        >
          <Heart
            className="w-full h-full text-vortex-red fill-vortex-red drop-shadow-[0_4px_8px_rgba(255,45,85,0.5)]"
          />

          {/* Particle burst */}
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="absolute w-3 h-3 rounded-full bg-vortex-red"
              style={{
                left: size / 2 - 6,
                top: size / 2 - 6,
              }}
              initial={{ opacity: 1, scale: 1 }}
              animate={{
                opacity: 0,
                scale: 0.5,
                x: Math.cos((i * Math.PI * 2) / 8) * 60,
                y: Math.sin((i * Math.PI * 2) / 8) * 60,
              }}
              transition={{
                duration: 0.5,
                delay: 0.1,
                ease: 'easeOut',
              }}
            />
          ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}

/**
 * useHeartAnimation - Hook to trigger heart animations
 */
import { useState, useCallback, useRef } from 'react'

export interface HeartAnimationState {
  isVisible: boolean
  x: number
  y: number
}

export interface UseHeartAnimationReturn {
  show: (x: number, y: number) => void
  props: HeartAnimationProps
}

export function useHeartAnimation(): UseHeartAnimationReturn {
  const [state, setState] = useState<HeartAnimationState>({
    isVisible: false,
    x: 0,
    y: 0,
  })
  const timeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const show = useCallback((x: number, y: number) => {
    if (timeoutRef.current) clearTimeout(timeoutRef.current)

    setState({ isVisible: true, x, y })

    timeoutRef.current = setTimeout(() => {
      setState((s) => ({ ...s, isVisible: false }))
    }, 600)
  }, [])

  return {
    show,
    props: {
      isVisible: state.isVisible,
      x: state.x,
      y: state.y,
    },
  }
}

