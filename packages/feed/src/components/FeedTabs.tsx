/**
 * FeedTabs - For You / Following tab switcher
 */

'use client'

import { motion } from 'motion/react'
import { ANIMATION } from '@vortex/core'
import type { FeedType } from '@vortex/core'

export interface FeedTabsProps {
  /** Current active tab */
  activeTab: FeedType
  /** Called when tab changes */
  onTabChange: (tab: FeedType) => void
  /** Custom className */
  className?: string
}

const TABS: Array<{ id: FeedType; label: string }> = [
  { id: 'following', label: 'Đang Follow' },
  { id: 'foryou', label: 'Dành cho bạn' },
]

export function FeedTabs({
  activeTab,
  onTabChange,
  className = '',
}: FeedTabsProps) {
  return (
    <div
      className={`
        flex items-center justify-center gap-6
        ${className}
      `}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.id

        return (
          <button
            key={tab.id}
            onClick={() => onTabChange(tab.id)}
            className="relative py-2"
          >
            <span
              className={`
                text-base font-semibold
                transition-colors duration-200
                drop-shadow-[0_2px_2px_rgba(0,0,0,0.8)]
                ${isActive ? 'text-white' : 'text-white/60'}
              `}
            >
              {tab.label}
            </span>

            {/* Active indicator */}
            {isActive && (
              <motion.div
                layoutId="feedTabIndicator"
                className="absolute bottom-0 left-1/2 -translate-x-1/2 w-8 h-0.5 bg-white rounded-full"
                transition={{
                  type: 'spring',
                  stiffness: ANIMATION.SPRING_STIFFNESS,
                  damping: ANIMATION.SPRING_DAMPING,
                }}
              />
            )}
          </button>
        )
      })}
    </div>
  )
}

