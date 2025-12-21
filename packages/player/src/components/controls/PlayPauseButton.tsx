/**
 * PlayPauseButton - Center screen play/pause toggle
 */

'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Play, Pause } from 'lucide-react'
import { ANIMATION } from '@vortex/core'

export interface PlayPauseButtonProps {
  isPlaying: boolean
  onToggle: () => void
  /** Auto hide after delay (ms). Set to 0 to always show */
  autoHideDelay?: number
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg'
  /** Show immediately on state change */
  showOnStateChange?: boolean
}

const sizeMap = {
  sm: { container: 'w-12 h-12', icon: 20 },
  md: { container: 'w-16 h-16', icon: 28 },
  lg: { container: 'w-20 h-20', icon: 36 },
}

export function PlayPauseButton({
  isPlaying,
  onToggle,
  autoHideDelay = 1000,
  size = 'lg',
  showOnStateChange = true,
}: PlayPauseButtonProps) {
  const [isVisible, setIsVisible] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  const { container, icon } = sizeMap[size]

  // Show on state change
  useEffect(() => {
    if (!showOnStateChange || !hasInteracted) return

    setIsVisible(true)

    if (autoHideDelay > 0) {
      const timer = setTimeout(() => {
        setIsVisible(false)
      }, autoHideDelay)

      return () => clearTimeout(timer)
    }
  }, [isPlaying, showOnStateChange, autoHideDelay, hasInteracted])

  const handleClick = () => {
    setHasInteracted(true)
    setIsVisible(true)
    onToggle()
  }

  return (
    <div
      className="absolute inset-0 flex items-center justify-center z-20 pointer-events-none"
      onClick={handleClick}
      style={{ pointerEvents: 'auto' }}
    >
      <AnimatePresence>
        {isVisible && (
          <motion.div
            className={`
              ${container}
              flex items-center justify-center
              rounded-full
              bg-black/40 backdrop-blur-sm
              cursor-pointer
            `}
            initial={{ opacity: 0, scale: 0.5 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.5 }}
            transition={{
              type: 'spring',
              stiffness: ANIMATION.SPRING_STIFFNESS,
              damping: ANIMATION.SPRING_DAMPING,
            }}
            whileTap={{ scale: 0.9 }}
          >
            {isPlaying ? (
              <Pause className="text-white fill-white" size={icon} />
            ) : (
              <Play className="text-white fill-white ml-1" size={icon} />
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

