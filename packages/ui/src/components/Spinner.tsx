/**
 * Spinner - Loading spinner
 */

'use client'

import { motion } from 'motion/react'

export interface SpinnerProps {
  size?: 'sm' | 'md' | 'lg'
  className?: string
}

const sizeClasses = {
  sm: 'w-4 h-4',
  md: 'w-8 h-8',
  lg: 'w-12 h-12',
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
  return (
    <motion.div
      className={`
        rounded-full border-2 border-white/30 border-t-white
        ${sizeClasses[size]}
        ${className}
      `}
      animate={{ rotate: 360 }}
      transition={{
        duration: 0.8,
        repeat: Infinity,
        ease: 'linear',
      }}
      role="status"
      aria-label="Loading"
    />
  )
}

