/**
 * IconButton - Touch-optimized icon button
 */

'use client'

import { forwardRef, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { ANIMATION, UI } from '@vortex/core'

export interface IconButtonProps {
  icon: ReactNode
  label: string
  size?: 'sm' | 'md' | 'lg'
  variant?: 'default' | 'ghost' | 'accent'
  count?: number
  isActive?: boolean
  disabled?: boolean
  className?: string
  onClick?: () => void
}

const sizeClasses = {
  sm: 'w-10 h-10',
  md: 'w-12 h-12',
  lg: 'w-14 h-14',
}

const iconSizeClasses = {
  sm: '[&_svg]:w-5 [&_svg]:h-5',
  md: '[&_svg]:w-7 [&_svg]:h-7',
  lg: '[&_svg]:w-8 [&_svg]:h-8',
}

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      label,
      size = 'md',
      variant = 'default',
      count,
      isActive = false,
      disabled = false,
      className = '',
      onClick,
    },
    ref
  ) => {
    return (
      <motion.button
        ref={ref}
        type="button"
        disabled={disabled}
        className={`
          flex flex-col items-center justify-center gap-1
          ${sizeClasses[size]}
          ${iconSizeClasses[size]}
          min-h-[${UI.MIN_TAP_AREA}px] min-w-[${UI.MIN_TAP_AREA}px]
          rounded-full
          text-white
          transition-colors duration-300 ease-vortex
          ${variant === 'ghost' ? 'bg-transparent' : ''}
          ${variant === 'accent' && isActive ? 'text-vortex-violet' : ''}
          ${isActive ? 'text-vortex-red' : ''}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        whileTap={disabled ? undefined : { scale: 0.9 }}
        transition={{
          type: 'spring',
          stiffness: ANIMATION.SPRING_STIFFNESS,
          damping: ANIMATION.SPRING_DAMPING,
        }}
        aria-label={label}
        onClick={onClick}
      >
        {icon}
        {count !== undefined && (
          <span className="text-xs font-medium text-video-overlay">
            {formatCount(count)}
          </span>
        )}
      </motion.button>
    )
  }
)

IconButton.displayName = 'IconButton'

// Helper to format count
function formatCount(count: number): string {
  if (count < 1000) return count.toString()
  if (count < 10000) return `${(count / 1000).toFixed(1)}K`
  if (count < 1000000) return `${Math.floor(count / 1000)}K`
  return `${(count / 1000000).toFixed(1)}M`
}
