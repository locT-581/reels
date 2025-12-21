/**
 * LoadingOverlay - Progressive loading states
 * 0-500ms: Blur placeholder
 * 500ms-2s: Skeleton shimmer
 * >2s: Spinner with text
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { ANIMATION } from '@vortex/core'

export interface LoadingOverlayProps {
  isLoading: boolean
  /** Blur hash or thumbnail for placeholder */
  placeholder?: string
  /** Custom loading text */
  loadingText?: string
  /** Stage thresholds in ms */
  thresholds?: {
    blur: number
    skeleton: number
  }
}

type LoadingStage = 'blur' | 'skeleton' | 'spinner'

export function LoadingOverlay({
  isLoading,
  placeholder,
  loadingText = 'Đang tải...',
  thresholds = { blur: 500, skeleton: 2000 },
}: LoadingOverlayProps) {
  const [stage, setStage] = useState<LoadingStage>('blur')

  // Track loading duration and transition stages
  useEffect(() => {
    if (isLoading) {
      setStage('blur')

      // Schedule stage transitions
      const skeletonTimer = setTimeout(() => {
        setStage('skeleton')
      }, thresholds.blur)

      const spinnerTimer = setTimeout(() => {
        setStage('spinner')
      }, thresholds.skeleton)

      return () => {
        clearTimeout(skeletonTimer)
        clearTimeout(spinnerTimer)
      }
    } else {
      setStage('blur')
    }
  }, [isLoading, thresholds.blur, thresholds.skeleton])

  if (!isLoading) return null

  return (
    <AnimatePresence mode="wait">
      <motion.div
        className="absolute inset-0 z-30 flex items-center justify-center bg-black"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
      >
        {/* Stage: Blur placeholder */}
        {stage === 'blur' && placeholder && (
          <motion.div
            className="absolute inset-0 bg-cover bg-center"
            style={{
              backgroundImage: `url(${placeholder})`,
              filter: 'blur(20px)',
              transform: 'scale(1.1)',
            }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          />
        )}

        {/* Stage: Skeleton shimmer */}
        {stage === 'skeleton' && (
          <motion.div
            className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-zinc-800 to-zinc-900"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <motion.div
              className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent"
              animate={{
                x: ['-100%', '100%'],
              }}
              transition={{
                duration: 1.5,
                repeat: Infinity,
                ease: 'linear',
              }}
            />
          </motion.div>
        )}

        {/* Stage: Spinner with text */}
        {stage === 'spinner' && (
          <motion.div
            className="flex flex-col items-center gap-3"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              type: 'spring',
              stiffness: ANIMATION.SPRING_STIFFNESS,
              damping: ANIMATION.SPRING_DAMPING,
            }}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Loader2 className="w-8 h-8 text-white" />
            </motion.div>
            <span className="text-sm text-white/70 font-medium">
              {loadingText}
            </span>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  )
}

