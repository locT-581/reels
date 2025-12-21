/**
 * PlayPauseOverlay - Visual feedback for play/pause
 */

'use client'

import { motion, AnimatePresence } from 'motion/react'
import { Play, Pause } from 'lucide-react'
import { ANIMATION } from '@vortex/core'

export interface PlayPauseOverlayProps {
  isPlaying: boolean
  show: boolean
}

export function PlayPauseOverlay({ isPlaying, show }: PlayPauseOverlayProps) {
  return (
    <AnimatePresence>
      {show && (
        <motion.div
          className="pointer-events-none absolute inset-0 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
        >
          <motion.div
            className="flex h-20 w-20 items-center justify-center rounded-full bg-black/40"
            initial={{ scale: 0.5, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 1.5, opacity: 0 }}
            transition={{
              type: 'spring',
              stiffness: ANIMATION.SPRING_STIFFNESS,
              damping: ANIMATION.SPRING_DAMPING,
            }}
          >
            {isPlaying ? (
              <Play className="ml-1 h-10 w-10 fill-white text-white" />
            ) : (
              <Pause className="h-10 w-10 fill-white text-white" />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

