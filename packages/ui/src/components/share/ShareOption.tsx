/**
 * ShareOption - Individual share option item
 */

'use client'

import { motion } from 'motion/react'
import { lightHaptic } from '../../utils'
import type { ReactNode } from 'react'

export interface ShareOptionProps {
  /** Icon component */
  icon: ReactNode
  /** Label text */
  label: string
  /** Background color */
  bgColor?: string
  /** Called when option is clicked */
  onClick?: () => void
  /** Disabled state */
  disabled?: boolean
}

export function ShareOption({
  icon,
  label,
  bgColor = '#333',
  onClick,
  disabled = false,
}: ShareOptionProps) {
  const handleClick = () => {
    if (disabled) return
    lightHaptic()
    onClick?.()
  }

  return (
    <motion.button
      type="button"
      onClick={handleClick}
      disabled={disabled}
      className="flex flex-col items-center gap-2 min-w-[72px] disabled:opacity-50"
      whileTap={{ scale: 0.95 }}
    >
      <div
        className="w-14 h-14 rounded-full flex items-center justify-center"
        style={{ backgroundColor: bgColor }}
      >
        {icon}
      </div>
      <span className="text-xs text-white/90 text-center line-clamp-1">
        {label}
      </span>
    </motion.button>
  )
}

