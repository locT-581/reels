/**
 * Toast - Notification toast component
 */

'use client'

import { useEffect } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { CheckCircle, XCircle, Info, AlertTriangle, X } from 'lucide-react'
import { ANIMATION } from '@vortex/core'
import type { ToastOptions } from '@vortex/core'

export interface ToastProps extends ToastOptions {
  isVisible: boolean
  onDismiss: () => void
}

const icons = {
  success: CheckCircle,
  error: XCircle,
  info: Info,
  warning: AlertTriangle,
}

const bgColors = {
  success: 'bg-green-500/90',
  error: 'bg-red-500/90',
  info: 'bg-vortex-violet/90',
  warning: 'bg-orange-500/90',
}

export function Toast({
  message,
  type = 'info',
  duration = 3000,
  action,
  isVisible,
  onDismiss,
}: ToastProps) {
  const Icon = icons[type]

  // Auto dismiss
  useEffect(() => {
    if (!isVisible || duration === 0) return

    const timer = setTimeout(onDismiss, duration)
    return () => clearTimeout(timer)
  }, [isVisible, duration, onDismiss])

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          className="fixed bottom-20 left-4 right-4 z-50 flex justify-center pb-safe"
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{
            type: 'spring',
            stiffness: ANIMATION.SPRING_STIFFNESS,
            damping: ANIMATION.SPRING_DAMPING,
          }}
        >
          <div
            className={`
              flex items-center gap-3 rounded-2xl px-4 py-3
              backdrop-blur-xl
              ${bgColors[type]}
            `}
          >
            <Icon className="h-5 w-5 flex-shrink-0 text-white" />
            <span className="flex-1 text-sm font-medium text-white">
              {message}
            </span>
            {action && (
              <button
                className="text-sm font-semibold text-white underline"
                onClick={action.onClick}
              >
                {action.label}
              </button>
            )}
            <button
              className="flex-shrink-0 p-1"
              onClick={onDismiss}
              aria-label="Dismiss"
            >
              <X className="h-4 w-4 text-white/70" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

