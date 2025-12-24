/**
 * DoubleTapHeart - Heart animation for double-tap like gesture
 *
 * Features:
 * - Big heart explosion with scale animation
 * - Optional particle burst effect
 * - Float-up animation
 * - Customizable size and color
 * - Both CSS-in-JS and className support
 */

'use client'

import { useState, useCallback, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { colors, zIndices } from '@xhub-reel/design-tokens'

export interface DoubleTapHeartProps {
  /** Whether to show the heart */
  show: boolean
  /** Position of the heart */
  position?: { x: number; y: number }
  /** Heart size */
  size?: number
  /** Heart color */
  color?: string
  /** Show particle burst effect (default: true) */
  showParticles?: boolean
  /** Number of particles (default: 8) */
  particleCount?: number
  /** Callback when animation completes */
  onComplete?: () => void
  /** Custom styles override */
  style?: CSSProperties
  /** Custom className (for external CSS if needed) */
  className?: string
}

export interface UseDoubleTapHeartReturn {
  /** Whether heart is showing */
  isShowing: boolean
  /** Heart position */
  position: { x: number; y: number }
  /** Trigger the heart animation */
  showHeart: (x?: number, y?: number) => void
  /** Hide the heart */
  hideHeart: () => void
}

// =============================================================================
// STYLES
// =============================================================================

const containerStyles: CSSProperties = {
  position: 'absolute',
  pointerEvents: 'none',
  zIndex: zIndices.overlay,
}

const heartStyles: CSSProperties = {
  filter: 'drop-shadow(0 4px 8px rgba(255, 45, 85, 0.5))',
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * useDoubleTapHeart - Hook for managing double-tap heart animation state
 */
export function useDoubleTapHeart(): UseDoubleTapHeartReturn {
  const [isShowing, setIsShowing] = useState(false)
  const [position, setPosition] = useState({ x: 0, y: 0 })

  const showHeart = useCallback((x?: number, y?: number) => {
    // Default to center of viewport if no position provided
    const centerX = x ?? (typeof window !== 'undefined' ? window.innerWidth / 2 : 200)
    const centerY = y ?? (typeof window !== 'undefined' ? window.innerHeight / 2 : 400)

    setPosition({ x: centerX, y: centerY })
    setIsShowing(true)

    // Auto-hide after animation
    setTimeout(() => {
      setIsShowing(false)
    }, 800)
  }, [])

  const hideHeart = useCallback(() => {
    setIsShowing(false)
  }, [])

  return {
    isShowing,
    position,
    showHeart,
    hideHeart,
  }
}

// =============================================================================
// HEART ICON (Inline SVG)
// =============================================================================

const HeartSVG = ({ size, color }: { size: number; color: string }) => (
  <svg style={heartStyles} xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 28 28" fill={color}>
    <path fillRule="evenodd" clipRule="evenodd" d="M1.74988 11.0538C1.74988 6.75595 4.69822 2.91699 9.20877 2.91699C11.4347 2.91699 12.9986 3.9593 13.9999 4.96978C15.0011 3.95929 16.565 2.91699 18.791 2.91699C23.3015 2.91699 26.2499 6.75595 26.2499 11.0538C26.2499 15.3962 23.6265 18.9036 20.8781 21.3587C18.1288 23.8145 15.1442 25.3171 14.1843 25.6371L13.9999 25.6985L13.8154 25.6371C12.8555 25.3171 9.87093 23.8145 7.12168 21.3587C4.37329 18.9036 1.74988 15.3962 1.74988 11.0538ZM17.7449 6.41699C17.2617 6.41699 16.8699 6.80874 16.8699 7.29199C16.8699 7.77524 17.2617 8.16699 17.7449 8.16699C19.6221 8.16699 20.9952 9.75855 20.9952 11.8241C20.9952 12.3073 21.387 12.6991 21.8702 12.6991C22.3535 12.6991 22.7452 12.3073 22.7452 11.8241C22.7452 9.02543 20.8066 6.41699 17.7449 6.41699Z" fill={color}/>
  </svg>
)

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function DoubleTapHeart({
  show,
  position = { x: 0, y: 0 },
  size = 100,
  color = colors.like,
  showParticles = true,
  particleCount = 8,
  onComplete,
  style,
  className = '',
}: DoubleTapHeartProps) {
  return (
    <AnimatePresence onExitComplete={onComplete}>
      {show && (
        <motion.div
          initial={{ opacity: 0, scale: 0 }}
          animate={{
            opacity: [0, 1, 1, 0],
            scale: [0, 1.3, 1, 0.8],
            y: [0, -20, -20, -40],
          }}
          exit={{
            scale: 0,
            opacity: 0,
          }}
          transition={{
            duration: 0.8,
            times: [0, 0.2, 0.6, 1],
            ease: 'easeOut',
          }}
          style={{
            ...containerStyles,
            left: position.x - size / 2,
            top: position.y - size / 2,
            width: size,
            height: size,
            ...style,
          }}
          className={className}
        >
          <HeartSVG size={size} color={color} />

          {/* Particle burst */}
          {showParticles &&
            [...Array(particleCount)].map((_, i) => (
              <motion.div
                key={i}
                style={{
                  position: 'absolute',
                  width: 12,
                  height: 12,
                  borderRadius: '50%',
                  backgroundColor: color,
                  left: size / 2 - 6,
                  top: size / 2 - 6,
                }}
                initial={{ opacity: 1, scale: 1 }}
                animate={{
                  opacity: 0,
                  scale: 0.5,
                  x: Math.cos((i * Math.PI * 2) / particleCount) * 60,
                  y: Math.sin((i * Math.PI * 2) / particleCount) * 60,
                }}
                transition={{
                  duration: 0.5,
                  delay: 0.1,
                  ease: 'easeOut',
                }}
              />
            ))}
        </motion.div>
      )}
    </AnimatePresence>
  )
}
