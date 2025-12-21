/**
 * PullToRefresh - Pull down to refresh feed
 */

'use client'

import { useState, useRef, useCallback, type ReactNode } from 'react'
import { motion, useMotionValue, useTransform, animate } from 'motion/react'
import { Loader2, ArrowDown } from 'lucide-react'

export interface PullToRefreshProps {
  /** Called when refresh is triggered */
  onRefresh: () => Promise<void>
  /** Children (feed content) */
  children: ReactNode
  /** Pull threshold to trigger refresh (px) */
  threshold?: number
  /** Max pull distance */
  maxPull?: number
  /** Refresh indicator text */
  refreshText?: string
  /** Custom className */
  className?: string
}

type RefreshState = 'idle' | 'pulling' | 'triggered' | 'refreshing'

export function PullToRefresh({
  onRefresh,
  children,
  threshold = 80,
  maxPull = 120,
  refreshText = 'Đang làm mới...',
  className = '',
}: PullToRefreshProps) {
  const [state, setState] = useState<RefreshState>('idle')
  const containerRef = useRef<HTMLDivElement>(null)
  const startYRef = useRef(0)
  const pullDistance = useMotionValue(0)

  // Progress (0-1 based on threshold)
  const progress = useTransform(pullDistance, [0, threshold], [0, 1])

  // Indicator rotation
  const rotation = useTransform(pullDistance, [0, threshold], [0, 180])

  // Handle touch start
  const handleTouchStart = useCallback(
    (e: React.TouchEvent) => {
      if (state !== 'idle') return

      const container = containerRef.current
      if (!container || container.scrollTop > 0) return

      startYRef.current = e.touches[0]?.clientY ?? 0
      setState('pulling')
    },
    [state]
  )

  // Handle touch move
  const handleTouchMove = useCallback(
    (e: React.TouchEvent) => {
      if (state !== 'pulling') return

      const currentY = e.touches[0]?.clientY ?? 0
      const delta = currentY - startYRef.current

      if (delta > 0) {
        // Apply resistance
        const resistance = 0.5
        const pull = Math.min(delta * resistance, maxPull)
        pullDistance.set(pull)

        // Check if threshold reached
        if (pull >= threshold) {
          setState('triggered')
        }
      }
    },
    [state, threshold, maxPull, pullDistance]
  )

  // Handle touch end
  const handleTouchEnd = useCallback(async () => {
    if (state === 'triggered') {
      setState('refreshing')

      // Snap to threshold
      animate(pullDistance, threshold, { duration: 0.2 })

      try {
        await onRefresh()
      } finally {
        // Animate back
        animate(pullDistance, 0, { duration: 0.3 })
        setState('idle')
      }
    } else {
      // Snap back
      animate(pullDistance, 0, { duration: 0.2 })
      setState('idle')
    }
  }, [state, threshold, onRefresh, pullDistance])

  return (
    <div
      ref={containerRef}
      className={`relative overflow-hidden ${className}`}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Pull indicator */}
      <motion.div
        className="absolute top-0 left-0 right-0 flex items-center justify-center z-50"
        style={{ height: pullDistance }}
      >
        <motion.div
          className="flex flex-col items-center gap-2 text-white"
          style={{ opacity: progress }}
        >
          {state === 'refreshing' ? (
            <>
              <Loader2 className="w-6 h-6 animate-spin" />
              <span className="text-sm font-medium">{refreshText}</span>
            </>
          ) : (
            <>
              <motion.div style={{ rotate: rotation }}>
                <ArrowDown className="w-6 h-6" />
              </motion.div>
              <span className="text-sm font-medium">
                {state === 'triggered' ? 'Thả để làm mới' : 'Kéo để làm mới'}
              </span>
            </>
          )}
        </motion.div>
      </motion.div>

      {/* Content */}
      <motion.div style={{ y: pullDistance }}>{children}</motion.div>
    </div>
  )
}

