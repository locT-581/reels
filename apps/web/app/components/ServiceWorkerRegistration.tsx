/**
 * ServiceWorkerRegistration - Registers and manages Service Worker
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { RefreshCw, X } from 'lucide-react'

export function ServiceWorkerRegistration() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [updateAvailable, setUpdateAvailable] = useState(false)
  const [isUpdating, setIsUpdating] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined' || !('serviceWorker' in navigator)) {
      return
    }

    async function registerSW() {
      try {
        const reg = await navigator.serviceWorker.register('/sw.js', {
          scope: '/',
        })
        
        console.log('[App] Service Worker registered:', reg.scope)
        setRegistration(reg)

        // Check for updates
        reg.addEventListener('updatefound', () => {
          const newWorker = reg.installing
          if (!newWorker) return

          newWorker.addEventListener('statechange', () => {
            if (newWorker.state === 'installed' && navigator.serviceWorker.controller) {
              console.log('[App] New Service Worker available')
              setUpdateAvailable(true)
            }
          })
        })

        // Listen for messages from SW
        navigator.serviceWorker.addEventListener('message', (event) => {
          console.log('[App] Message from SW:', event.data)
          
          if (event.data.type === 'SYNC_OFFLINE_ACTIONS') {
            // Trigger sync in app
            window.dispatchEvent(new CustomEvent('sync-offline-actions'))
          }
        })
      } catch (error) {
        console.error('[App] Service Worker registration failed:', error)
      }
    }

    registerSW()
  }, [])

  const handleUpdate = useCallback(async () => {
    if (!registration?.waiting) return

    setIsUpdating(true)

    // Tell the waiting SW to take over
    registration.waiting.postMessage({ type: 'SKIP_WAITING' })

    // Reload page when new SW takes over
    navigator.serviceWorker.addEventListener('controllerchange', () => {
      window.location.reload()
    })
  }, [registration])

  const handleDismiss = useCallback(() => {
    setUpdateAvailable(false)
  }, [])

  return (
    <AnimatePresence>
      {updateAvailable && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: 'spring', stiffness: 400, damping: 30 }}
          className="fixed bottom-20 left-4 right-4 z-50 pb-safe"
        >
          <div className="p-4 bg-vortex-violet rounded-2xl shadow-lg flex items-center gap-3">
            {/* Icon */}
            <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0">
              <RefreshCw className={`w-5 h-5 text-white ${isUpdating ? 'animate-spin' : ''}`} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0">
              <p className="text-white font-medium text-sm">
                Phiên bản mới có sẵn
              </p>
              <p className="text-white/70 text-xs">
                Cập nhật để có trải nghiệm tốt hơn
              </p>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={handleUpdate}
                disabled={isUpdating}
                className="px-4 py-2 bg-white text-vortex-violet rounded-xl font-medium text-sm hover:bg-white/90 transition-colors disabled:opacity-50"
              >
                {isUpdating ? 'Đang cập nhật...' : 'Cập nhật'}
              </button>
              <button
                onClick={handleDismiss}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-white/70" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}

