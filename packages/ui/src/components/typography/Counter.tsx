/**
 * Counter - Auto-formatting number display
 */

'use client'

import { useMemo } from 'react'
import { motion, AnimatePresence } from 'motion/react'

export interface CounterProps {
  /** Number to display */
  value: number
  /** Show animated transitions */
  animated?: boolean
  /** Format style */
  format?: 'compact' | 'full'
  /** Show plus sign for positive numbers */
  showPlus?: boolean
  /** Add shadow for video */
  videoSafe?: boolean
  /** Size variant */
  size?: 'sm' | 'md' | 'lg'
  /** Custom className */
  className?: string
}

const sizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base',
}

/**
 * Format number to compact notation (1K, 1.2M, etc.)
 */
function formatCompact(num: number): string {
  const absNum = Math.abs(num)
  
  if (absNum < 1000) return num.toString()
  if (absNum < 10000) return `${(num / 1000).toFixed(1)}K`
  if (absNum < 1000000) return `${Math.floor(num / 1000)}K`
  if (absNum < 10000000) return `${(num / 1000000).toFixed(1)}M`
  if (absNum < 1000000000) return `${Math.floor(num / 1000000)}M`
  return `${(num / 1000000000).toFixed(1)}B`
}

/**
 * Format number with thousand separators
 */
function formatFull(num: number): string {
  return num.toLocaleString()
}

export function Counter({
  value,
  animated = true,
  format = 'compact',
  showPlus = false,
  videoSafe = false,
  size = 'md',
  className = '',
}: CounterProps) {
  const formattedValue = useMemo(() => {
    const formatted = format === 'compact' ? formatCompact(value) : formatFull(value)
    if (showPlus && value > 0) {
      return `+${formatted}`
    }
    return formatted
  }, [value, format, showPlus])

  if (!animated) {
    return (
      <span
        className={`
          font-medium text-white
          ${sizeClasses[size]}
          ${videoSafe ? 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : ''}
          ${className}
        `}
      >
        {formattedValue}
      </span>
    )
  }

  return (
    <AnimatePresence mode="wait">
      <motion.span
        key={formattedValue}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.2 }}
        className={`
          font-medium text-white inline-block
          ${sizeClasses[size]}
          ${videoSafe ? 'drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]' : ''}
          ${className}
        `}
      >
        {formattedValue}
      </motion.span>
    </AnimatePresence>
  )
}

