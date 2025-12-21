/**
 * ShareButton - Share button with icon and count
 */

'use client'

import { useCallback } from 'react'
import { motion } from 'motion/react'
import { Share2 } from 'lucide-react'
import { ICON_SIZE, lightHaptic } from '@vortex/core'

export interface ShareButtonProps {
  /** Share count */
  count?: number
  /** Called when button is clicked */
  onShare?: () => void
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg'
  /** Show count label */
  showCount?: boolean
  /** Disabled state */
  disabled?: boolean
  /** Custom className */
  className?: string
}

const sizeConfig = {
  sm: { icon: ICON_SIZE.MD, tap: 40 },
  md: { icon: ICON_SIZE.LG, tap: 48 },
  lg: { icon: ICON_SIZE.XL, tap: 56 },
}

export function ShareButton({
  count = 0,
  onShare,
  size = 'md',
  showCount = true,
  disabled = false,
  className = '',
}: ShareButtonProps) {
  const config = sizeConfig[size]

  const handleClick = useCallback(() => {
    if (disabled) return
    lightHaptic()
    onShare?.()
  }, [disabled, onShare])

  const formatCount = (num: number): string => {
    if (num < 1000) return num.toString()
    if (num < 10000) return `${(num / 1000).toFixed(1)}K`
    if (num < 1000000) return `${Math.floor(num / 1000)}K`
    return `${(num / 1000000).toFixed(1)}M`
  }

  return (
    <div className={`flex flex-col items-center ${className}`}>
      <motion.button
        type="button"
        onClick={handleClick}
        disabled={disabled}
        className="relative flex items-center justify-center rounded-full bg-transparent transition-colors hover:bg-white/10 disabled:opacity-50"
        style={{
          width: config.tap,
          height: config.tap,
        }}
        whileTap={{ scale: 0.9 }}
        aria-label="Share"
      >
        <Share2
          size={config.icon}
          className="text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
        />
      </motion.button>

      {showCount && count > 0 && (
        <span className="mt-0.5 text-xs font-medium text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]">
          {formatCount(count)}
        </span>
      )}
    </div>
  )
}

