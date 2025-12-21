/**
 * GestureIndicator - Visual feedback for swipe gestures
 * 
 * Shows directional indicator based on swipe progress
 */

'use client'

import { motion, AnimatePresence } from 'motion/react'
import { ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { SPRING, ICON_SIZE } from '@vortex/core'

// Use default spring config values
const springConfig = SPRING.DEFAULT

export type SwipeDirection = 'up' | 'down' | 'left' | 'right'

export interface GestureIndicatorProps {
  /** Current swipe direction */
  direction: SwipeDirection | null
  /** Swipe progress (0-1) */
  progress: number
  /** Whether to show the indicator */
  visible: boolean
  /** Size of the indicator icon */
  size?: number
  /** Color of the indicator */
  color?: string
  /** Custom className */
  className?: string
}

const directionConfig = {
  up: {
    Icon: ChevronUp,
    position: 'bottom-20 left-1/2 -translate-x-1/2',
    transform: { y: 20 },
    animate: { y: 0 },
  },
  down: {
    Icon: ChevronDown,
    position: 'top-20 left-1/2 -translate-x-1/2',
    transform: { y: -20 },
    animate: { y: 0 },
  },
  left: {
    Icon: ChevronLeft,
    position: 'right-4 top-1/2 -translate-y-1/2',
    transform: { x: 20 },
    animate: { x: 0 },
  },
  right: {
    Icon: ChevronRight,
    position: 'left-4 top-1/2 -translate-y-1/2',
    transform: { x: -20 },
    animate: { x: 0 },
  },
}

export function GestureIndicator({
  direction,
  progress,
  visible,
  size = ICON_SIZE.XL,
  color = 'white',
  className = '',
}: GestureIndicatorProps) {
  if (!direction) return null

  const config = directionConfig[direction]
  const Icon = config.Icon

  return (
    <AnimatePresence>
      {visible && progress > 0.1 && (
        <motion.div
          key={direction}
          initial={{ opacity: 0, ...config.transform }}
          animate={{
            opacity: Math.min(1, progress * 2),
            ...config.animate,
          }}
          exit={{ opacity: 0, ...config.transform }}
          transition={{
            type: 'spring',
            stiffness: springConfig.stiffness,
            damping: springConfig.damping,
          }}
          className={`
            absolute pointer-events-none z-50
            ${config.position}
            ${className}
          `}
          style={{
            filter: `drop-shadow(0 2px 4px rgba(0,0,0,0.5))`,
          }}
        >
          <div
            className="p-3 rounded-full bg-black/30 backdrop-blur-sm"
            style={{
              transform: `scale(${0.8 + progress * 0.4})`,
            }}
          >
            <Icon
              size={size}
              color={color}
              strokeWidth={2.5}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

