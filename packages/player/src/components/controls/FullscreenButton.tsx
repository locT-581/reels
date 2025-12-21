/**
 * FullscreenButton - Toggle fullscreen mode
 */

'use client'

import { motion } from 'motion/react'
import { Maximize, Minimize } from 'lucide-react'
import { ANIMATION } from '@vortex/core'

export interface FullscreenButtonProps {
  isFullscreen: boolean
  onToggle: () => void
  size?: number
  className?: string
}

export function FullscreenButton({
  isFullscreen,
  onToggle,
  size = 24,
  className = '',
}: FullscreenButtonProps) {
  return (
    <motion.button
      className={`flex items-center justify-center p-2 rounded-full text-white ${className}`}
      onClick={onToggle}
      whileTap={{ scale: 0.9 }}
      transition={{
        type: 'spring',
        stiffness: ANIMATION.SPRING_STIFFNESS,
        damping: ANIMATION.SPRING_DAMPING,
      }}
      aria-label={isFullscreen ? 'Exit fullscreen' : 'Enter fullscreen'}
    >
      {isFullscreen ? (
        <Minimize size={size} className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
      ) : (
        <Maximize size={size} className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
      )}
    </motion.button>
  )
}

