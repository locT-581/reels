/**
 * LikeButton - Animated like button with heart icon
 */

'use client'

import { useCallback, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Heart } from 'lucide-react'
import { ICON_SIZE } from '../../constants'
import { lightHaptic, formatCount } from '../../utils'

export interface LikeButtonProps {
  /** Whether the item is liked */
  isLiked: boolean
  /** Like count */
  count?: number
  /** Called when like state changes */
  onLike?: (isLiked: boolean) => void
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

export function LikeButton({
  isLiked,
  count = 0,
  onLike,
  size = 'md',
  showCount = true,
  disabled = false,
  className = '',
}: LikeButtonProps) {
  const [isAnimating, setIsAnimating] = useState(false)
  const config = sizeConfig[size]

  const handleClick = useCallback(() => {
    if (disabled) return

    lightHaptic()
    setIsAnimating(true)
    onLike?.(!isLiked)

    // Reset animation state
    setTimeout(() => setIsAnimating(false), 300)
  }, [disabled, isLiked, onLike])

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
        aria-label={isLiked ? 'Unlike' : 'Like'}
        aria-pressed={isLiked}
      >
        {/* Main heart icon */}
        <motion.div
          animate={
            isAnimating && isLiked
              ? {
                  scale: [1, 1.3, 1],
                }
              : {}
          }
          transition={{
            duration: 0.3,
            ease: [0.32, 0.72, 0, 1],
          }}
        >
          <Heart
            size={config.icon}
            className={`transition-colors duration-200 ${
              isLiked
                ? 'fill-xhub-reel-red text-xhub-reel-red'
                : 'text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]'
            }`}
          />
        </motion.div>

        {/* Burst particles on like */}
        <AnimatePresence>
          {isAnimating && isLiked && (
            <>
              {[...Array(6)].map((_, i) => (
                <motion.div
                  key={i}
                  className="absolute w-1.5 h-1.5 rounded-full bg-xhub-reel-red"
                  initial={{
                    scale: 0,
                    x: 0,
                    y: 0,
                    opacity: 1,
                  }}
                  animate={{
                    scale: [0, 1, 0.5],
                    x: Math.cos((i * Math.PI * 2) / 6) * 24,
                    y: Math.sin((i * Math.PI * 2) / 6) * 24,
                    opacity: [1, 1, 0],
                  }}
                  exit={{ opacity: 0 }}
                  transition={{
                    duration: 0.4,
                    ease: 'easeOut',
                  }}
                />
              ))}
            </>
          )}
        </AnimatePresence>
      </motion.button>

      {/* Count label */}
      {showCount && (
        <motion.span
          className="mt-0.5 text-xs font-medium text-white drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]"
          animate={isAnimating ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 0.2 }}
        >
          {formatCount(count)}
        </motion.span>
      )}
    </div>
  )
}

