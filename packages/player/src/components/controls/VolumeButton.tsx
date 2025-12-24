/**
 * VolumeButton - Volume/mute toggle with 4 states
 */

'use client'

import { motion } from 'motion/react'
import { Volume2, Volume1, VolumeX, Volume } from 'lucide-react'
import { SPRING } from '@xhub-reel/core'

export interface VolumeButtonProps {
  volume: number // 0-1
  isMuted: boolean
  onToggleMute: () => void
  onVolumeChange?: (volume: number) => void
  size?: number
  className?: string
  /** Show volume slider on hover */
  showSlider?: boolean
}

function getVolumeIcon(volume: number, isMuted: boolean) {
  if (isMuted || volume === 0) return VolumeX
  if (volume < 0.3) return Volume
  if (volume < 0.7) return Volume1
  return Volume2
}

export function VolumeButton({
  volume,
  isMuted,
  onToggleMute,
  onVolumeChange,
  size = 24,
  className = '',
  showSlider = false,
}: VolumeButtonProps) {
  const Icon = getVolumeIcon(volume, isMuted)

  return (
    <div className={`relative group ${className}`}>
      <motion.button
        className="flex items-center justify-center p-2 rounded-full text-white"
        onClick={onToggleMute}
        whileTap={{ scale: 0.9 }}
        transition={{
          type: 'spring',
          stiffness: SPRING.DEFAULT.stiffness,
          damping: SPRING.DEFAULT.damping,
        }}
        aria-label={isMuted ? 'Unmute' : 'Mute'}
      >
        <Icon size={size} className="drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]" />
      </motion.button>

      {/* Volume slider (shown on hover) */}
      {showSlider && onVolumeChange && (
        <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 opacity-0 group-hover:opacity-100 transition-opacity">
          <div className="bg-black/80 backdrop-blur-sm rounded-lg p-2 pb-3">
            <input
              type="range"
              min={0}
              max={1}
              step={0.01}
              value={isMuted ? 0 : volume}
              onChange={(e) => onVolumeChange(parseFloat(e.target.value))}
              className="w-20 h-1 appearance-none bg-white/30 rounded-full outline-none
                [&::-webkit-slider-thumb]:appearance-none
                [&::-webkit-slider-thumb]:w-3
                [&::-webkit-slider-thumb]:h-3
                [&::-webkit-slider-thumb]:rounded-full
                [&::-webkit-slider-thumb]:bg-white
                [&::-webkit-slider-thumb]:cursor-pointer
              "
              style={{
                writingMode: 'vertical-lr' as const,
                direction: 'rtl',
                height: '80px',
                width: '4px',
              }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

