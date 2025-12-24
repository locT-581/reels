/**
 * SaveButton - Animated save/bookmark button
 */

'use client'

import { useCallback, useState } from 'react'
import { motion } from 'motion/react'
import { Bookmark } from 'lucide-react'
import { ICON_SIZE } from '../../constants'
import { lightHaptic } from '../../utils'

export interface SaveButtonProps {
  /** Whether the item is saved */
  isSaved: boolean
  /** Called when save state changes */
  onSave?: (isSaved: boolean) => void
  /** Size of the button */
  size?: 'sm' | 'md' | 'lg'
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

export function SaveButton({
  isSaved,
  onSave,
  size = 'md',
  disabled = false,
  className = '',
}: SaveButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const config = sizeConfig[size]

  const handleClick = useCallback(() => {
    if (disabled) return

    lightHaptic()
    setIsAnimating(true)
    onSave?.(!isSaved)

    // Reset animation state
    setTimeout(() => setIsAnimating(false), 300)
  }, [disabled, isSaved, onSave])

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
        aria-label={isSaved ? 'Unsave' : 'Save'}
        aria-pressed={isSaved}
      >
        <motion.div
          animate={
            isAnimating && isSaved
              ? {
                  scale: [1, 1.2, 1],
                  rotate: [0, -10, 10, 0],
                }
              : {}
          }
          transition={{
            duration: 0.4,
            ease: [0.32, 0.72, 0, 1],
          }}
        >
          <Bookmark
            size={config.icon}
            className={`transition-colors duration-200 ${
              isSaved
                ? 'fill-xhub-reel-violet text-xhub-reel-violet'
                : 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'
            }`}
          />
        </motion.div>
      </motion.button>
    </div>
  )
}

