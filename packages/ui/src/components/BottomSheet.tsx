/**
 * BottomSheet - Draggable bottom sheet with glassmorphism
 */

'use client'

import { useEffect, type ReactNode } from 'react'
import { motion, AnimatePresence, useDragControls, type PanInfo } from 'motion/react'
import { X } from 'lucide-react'
import { ANIMATION, UI } from '@vortex/core'
import { IconButton } from './IconButton'

export interface BottomSheetProps {
  isOpen: boolean
  onClose: () => void
  title?: string
  children: ReactNode
  initialHeight?: number
  maxHeight?: number
  className?: string
}

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  initialHeight = UI.BOTTOM_SHEET_HEIGHT,
  maxHeight = UI.BOTTOM_SHEET_HEIGHT_MAX,
  className = '',
}: BottomSheetProps) {
  const controls = useDragControls()

  // Prevent body scroll when sheet is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }

    return () => {
      document.body.style.overflow = ''
    }
  }, [isOpen])

  // Handle drag end
  const handleDragEnd = (_: never, info: PanInfo) => {
    const velocity = info.velocity.y
    const offset = info.offset.y

    // Close if dragged down fast or far enough
    if (velocity > 500 || offset > 100) {
      onClose()
    }
  }

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            className="fixed inset-0 z-40 bg-black/60"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            className={`
              fixed bottom-0 left-0 right-0 z-50
              glass rounded-t-3xl
              ${className}
            `}
            style={{
              height: `${initialHeight * 100}vh`,
              maxHeight: `${maxHeight * 100}vh`,
            }}
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{
              type: 'spring',
              stiffness: ANIMATION.SPRING_STIFFNESS,
              damping: ANIMATION.SPRING_DAMPING,
            }}
            drag="y"
            dragControls={controls}
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={handleDragEnd}
          >
            {/* Drag handle */}
            <div
              className="flex justify-center py-3"
              onPointerDown={(e) => controls.start(e)}
            >
              <div className="h-1 w-10 rounded-full bg-white/30" />
            </div>

            {/* Header */}
            {title && (
              <div className="flex items-center justify-between border-b border-white/10 px-4 pb-3">
                <h2 className="text-lg font-semibold text-white">{title}</h2>
                <IconButton
                  icon={<X className="h-5 w-5" />}
                  label="Close"
                  size="sm"
                  variant="ghost"
                  onClick={onClose}
                />
              </div>
            )}

            {/* Content */}
            <div className="h-full overflow-y-auto pb-safe scrollbar-hide">
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}

