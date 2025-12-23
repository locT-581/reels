/**
 * QualitySelector - Video quality selection popup
 */

'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Settings2 } from 'lucide-react'
import { SPRING } from '@vortex/core'
import type { QualityLevel } from '@vortex/core'

export interface QualitySelectorProps {
  currentLevel: number // -1 for auto
  levels: QualityLevel[]
  onLevelChange: (level: number) => void
  size?: number
  className?: string
}

export function QualitySelector({
  currentLevel,
  levels,
  onLevelChange,
  size = 24,
  className = '',
}: QualitySelectorProps) {
  const [isOpen, setIsOpen] = useState(false)

  const currentLabel =
    currentLevel === -1
      ? 'Auto'
      : levels[currentLevel]?.label ?? `${levels[currentLevel]?.height}p`

  const handleSelect = (level: number) => {
    onLevelChange(level)
    setIsOpen(false)
  }

  // Don't render if no quality options
  if (levels.length === 0) return null

  return (
    <div className={`relative ${className}`}>
      {/* Trigger button */}
      <motion.button
        className="flex items-center justify-center gap-1 px-2 py-1 rounded-full text-white text-sm font-medium"
        onClick={() => setIsOpen(!isOpen)}
        whileTap={{ scale: 0.95 }}
        transition={{
          type: 'spring',
          stiffness: SPRING.DEFAULT.stiffness,
          damping: SPRING.DEFAULT.damping,
        }}
        aria-label="Video quality"
      >
        <Settings2 size={size} className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
        <span className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {currentLabel}
        </span>
      </motion.button>

      {/* Quality menu */}
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
              className="absolute bottom-full right-0 mb-2 z-50 bg-black/90 backdrop-blur-xl rounded-2xl overflow-hidden min-w-[140px]"
              initial={{ opacity: 0, y: 10, scale: 0.95 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.95 }}
              transition={{
                type: 'spring',
                stiffness: SPRING.DEFAULT.stiffness,
                damping: SPRING.DEFAULT.damping,
              }}
            >
              <div className="py-2">
                {/* Auto option */}
                <button
                  className={`
                    w-full px-4 py-2 text-left text-sm font-medium
                    transition-colors flex items-center justify-between
                    ${currentLevel === -1
                      ? 'text-vortex-violet bg-vortex-violet/10'
                      : 'text-white hover:bg-white/10'
                    }
                  `}
                  onClick={() => handleSelect(-1)}
                >
                  <span>Auto</span>
                  <span className="text-xs text-white/50">Tự động</span>
                </button>

                {/* Quality levels */}
                {levels.map((level, index) => (
                  <button
                    key={index}
                    className={`
                      w-full px-4 py-2 text-left text-sm font-medium
                      transition-colors flex items-center justify-between
                      ${index === currentLevel
                        ? 'text-vortex-violet bg-vortex-violet/10'
                        : 'text-white hover:bg-white/10'
                      }
                    `}
                    onClick={() => handleSelect(index)}
                  >
                    <span>{level.label || `${level.height}p`}</span>
                    <span className="text-xs text-white/50">
                      {formatBitrate(level.bitrate)}
                    </span>
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

function formatBitrate(bitrate: number): string {
  if (bitrate >= 1000000) {
    return `${(bitrate / 1000000).toFixed(1)} Mbps`
  }
  if (bitrate >= 1000) {
    return `${Math.round(bitrate / 1000)} Kbps`
  }
  return `${bitrate} bps`
}

