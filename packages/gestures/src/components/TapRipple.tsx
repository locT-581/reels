/**
 * TapRipple - Ripple effect on tap
 * 
 * Shows expanding circle animation at tap position
 */

'use client'

import { useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { DURATION, EASING } from '@vortex/core'

export interface RippleItem {
  id: number
  x: number
  y: number
}

export interface TapRippleProps {
  /** Color of the ripple */
  color?: string
  /** Duration of the ripple animation in ms */
  duration?: number
  /** Maximum size of the ripple */
  maxSize?: number
  /** Custom className */
  className?: string
}

export interface TapRippleReturn {
  /** Ripple elements to render */
  Ripples: React.FC
  /** Function to trigger ripple at position */
  triggerRipple: (x: number, y: number) => void
  /** Clear all ripples */
  clearRipples: () => void
}

export function useTapRipple({
  color = 'rgba(255, 255, 255, 0.3)',
  duration = DURATION.SLOW,
  maxSize = 200,
  className = '',
}: TapRippleProps = {}): TapRippleReturn {
  const [ripples, setRipples] = useState<RippleItem[]>([])
  let nextId = 0

  const triggerRipple = useCallback(
    (x: number, y: number) => {
      const id = nextId++
      setRipples((prev) => [...prev, { id, x, y }])

      // Remove ripple after animation
      setTimeout(() => {
        setRipples((prev) => prev.filter((r) => r.id !== id))
      }, duration)
    },
    [duration]
  )

  const clearRipples = useCallback(() => {
    setRipples([])
  }, [])

  const Ripples = useCallback(
    () => (
      <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
        <AnimatePresence>
          {ripples.map((ripple) => (
            <motion.div
              key={ripple.id}
              initial={{
                scale: 0,
                opacity: 1,
                x: ripple.x - maxSize / 2,
                y: ripple.y - maxSize / 2,
              }}
              animate={{
                scale: 1,
                opacity: 0,
              }}
              exit={{
                opacity: 0,
              }}
              transition={{
                duration: duration / 1000,
                ease: EASING.VORTEX,
              }}
              style={{
                position: 'absolute',
                width: maxSize,
                height: maxSize,
                borderRadius: '50%',
                backgroundColor: color,
              }}
            />
          ))}
        </AnimatePresence>
      </div>
    ),
    [ripples, color, duration, maxSize, className]
  )

  return {
    Ripples,
    triggerRipple,
    clearRipples,
  }
}

/**
 * Standalone TapRipple component with controlled ripples
 */
export interface TapRippleContainerProps extends TapRippleProps {
  /** Array of active ripples */
  ripples: RippleItem[]
}

export function TapRippleContainer({
  ripples,
  color = 'rgba(255, 255, 255, 0.3)',
  duration = DURATION.SLOW,
  maxSize = 200,
  className = '',
}: TapRippleContainerProps) {
  return (
    <div className={`absolute inset-0 pointer-events-none overflow-hidden ${className}`}>
      <AnimatePresence>
        {ripples.map((ripple) => (
          <motion.div
            key={ripple.id}
            initial={{
              scale: 0,
              opacity: 1,
              x: ripple.x - maxSize / 2,
              y: ripple.y - maxSize / 2,
            }}
            animate={{
              scale: 1,
              opacity: 0,
            }}
            exit={{
              opacity: 0,
            }}
            transition={{
              duration: duration / 1000,
              ease: EASING.VORTEX,
            }}
            style={{
              position: 'absolute',
              width: maxSize,
              height: maxSize,
              borderRadius: '50%',
              backgroundColor: color,
            }}
          />
        ))}
      </AnimatePresence>
    </div>
  )
}

