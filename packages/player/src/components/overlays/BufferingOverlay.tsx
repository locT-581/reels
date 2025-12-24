/**
 * BufferingOverlay - Small spinner during buffering
 * Only shows after 1s of continuous buffering
 */

'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { Loader2 } from 'lucide-react'
import { SPRING } from '@xhub-reel/core'

export interface BufferingOverlayProps {
  isBuffering: boolean
  /** Delay before showing (ms) */
  showDelay?: number
  /** Position on screen */
  position?: 'center' | 'corner'
}

export function BufferingOverlay({
  isBuffering,
  showDelay = 1000,
  position = 'corner',
}: BufferingOverlayProps) {
  const [shouldShow, setShouldShow] = useState(false)

  useEffect(() => {
    if (isBuffering) {
      const timer = setTimeout(() => {
        setShouldShow(true)
      }, showDelay)

      return () => clearTimeout(timer)
    } else {
      setShouldShow(false)
    }
  }, [isBuffering, showDelay])

  const positionClasses =
    position === 'center'
      ? 'inset-0 flex items-center justify-center'
      : 'top-4 right-4'

  return (
    <AnimatePresence>
      {shouldShow && (
        <motion.div
          className={`absolute z-30 ${positionClasses}`}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.8 }}
          transition={{
            type: 'spring',
            stiffness: SPRING.DEFAULT.stiffness,
            damping: SPRING.DEFAULT.damping,
          }}
        >
          <div
            className={`
              flex items-center justify-center
              ${position === 'corner' ? 'w-10 h-10 rounded-full bg-black/50 backdrop-blur-sm' : ''}
            `}
          >
            <motion.div
              animate={{ rotate: 360 }}
              transition={{
                duration: 1,
                repeat: Infinity,
                ease: 'linear',
              }}
            >
              <Loader2
                className={`text-white ${position === 'corner' ? 'w-5 h-5' : 'w-8 h-8'}`}
              />
            </motion.div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

