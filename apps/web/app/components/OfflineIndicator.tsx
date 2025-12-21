/**
 * OfflineIndicator - Shows when user loses network connection
 */

'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { WifiOff } from 'lucide-react'
import { useNetworkStatus } from '@vortex/core'

export function OfflineIndicator() {
  const { isOnline, isSlowConnection } = useNetworkStatus()
  const [showIndicator, setShowIndicator] = useState(false)
  const [dismissed, setDismissed] = useState(false)

  useEffect(() => {
    if (!isOnline && !dismissed) {
      setShowIndicator(true)
    } else if (isOnline) {
      setShowIndicator(false)
      setDismissed(false)
    }
  }, [isOnline, dismissed])

  const handleDismiss = () => {
    setDismissed(true)
    setShowIndicator(false)
  }

  return (
    <AnimatePresence>
      {showIndicator && (
        <motion.div
          initial={{ y: -100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed top-0 left-0 right-0 z-50 pt-safe"
        >
          <div className="mx-4 mt-4 p-4 bg-zinc-900 rounded-2xl border border-zinc-800 shadow-lg flex items-center gap-3">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-red-500/20 flex items-center justify-center flex-shrink-0">
              <WifiOff className="w-5 h-5 text-red-500" />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">
                Không có kết nối mạng
              </p>
              <p className="text-zinc-400 text-xs truncate">
                Bạn vẫn có thể xem video đã lưu
              </p>
            </div>

            {/* Dismiss button */}
            <button
              onClick={handleDismiss}
              className="text-zinc-400 text-xs px-3 py-1.5 rounded-lg hover:bg-zinc-800 transition-colors"
            >
              Đóng
            </button>
          </div>
        </motion.div>
      )}

      {/* Slow connection indicator */}
      {isOnline && isSlowConnection && (
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: -50, opacity: 0 }}
          className="fixed top-0 left-0 right-0 z-50 pt-safe"
        >
          <div className="mx-4 mt-4 px-4 py-2 bg-amber-500/10 border border-amber-500/20 rounded-xl flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
            <p className="text-amber-500 text-xs">
              Kết nối chậm - Video có thể tải lâu hơn
            </p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

