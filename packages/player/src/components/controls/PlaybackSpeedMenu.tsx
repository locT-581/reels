/**
 * PlaybackSpeedMenu - Speed selection popup
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Gauge } from 'lucide-react'
import { ANIMATION, PLAYBACK_SPEEDS } from '@vortex/core'
import type { PlaybackSpeed } from '@vortex/core'

export interface PlaybackSpeedMenuProps {
  currentSpeed: PlaybackSpeed
  onSpeedChange: (speed: PlaybackSpeed) => void
  size?: number
  className?: string
}

export function PlaybackSpeedMenu({
  currentSpeed,
  onSpeedChange,
  size = 24,
  className = '',
}: PlaybackSpeedMenuProps) {
  const [isOpen, setIsOpen] = useState(false)

  const handleSpeedSelect = (speed: PlaybackSpeed) => {
    onSpeedChange(speed)
    setIsOpen(false)
  }

  return (
    <div className={`relative ${className}`}>
      {/* Trigger button */}
      <motion.button
        className="flex items-center justify-center gap-1 px-2 py-1 rounded-full text-white text-sm font-medium"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: 'spring',
          stiffness: ANIMATION.SPRING_STIFFNESS,
          damping: ANIMATION.SPRING_DAMPING,
        }}
        aria-label="Playback speed"
      >
        <Gauge size={size} className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
        <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {currentSpeed}x
        </span>
      </motion.button>

      {/* Speed menu */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop */}
            <div
              className="fixed inset-0 z-40"
              onClick={() => setIsOpen(false)}
            />

            {/* Menu */}
            <motion.div
              className="absolute bottom-full right-0 mb-2 z-50 bg-black/90 backdrop-blur-xl rounded-2xl overflow-hidden min-w-[120px]"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: ANIMATION.SPRING_STIFFNESS,
                damping: ANIMATION.SPRING_DAMPING,
              }}
            >
              <div className="py-2">
                {PLAYBACK_SPEEDS.map((speed) => (
                  <button
                    key={speed}
                    className={`
                      w-full px-4 py-2 text-left text-sm font-medium
                      transition-colors
                      ${speed === currentSpeed
                        ? 'text-vortex-violet bg-vortex-violet/10'
                        : 'text-white hover:bg-white/10'
                      }
                    `}
                    onClick={() => handleSpeedSelect(speed)}
                  >
                    {speed === 1 ? 'Normal' : `${speed}x`}
                  </button>
                ))}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}

