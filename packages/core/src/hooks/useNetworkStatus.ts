/**
 * useNetworkStatus hook - Monitor network connectivity
 */

import { useState, useEffect } from 'react'

export interface NetworkStatus {
  isOnline: boolean
  isSlowConnection: boolean
  effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | 'unknown'
  downlink: number | undefined
  rtt: number | undefined
  saveData: boolean
}

function isSlowEffectiveType(type: string): boolean {
  return type === 'slow-2g' || type === '2g' || type === '3g'
}

export function useNetworkStatus(): NetworkStatus {
  const [status, setStatus] = useState<NetworkStatus>(() => {
    if (typeof navigator === 'undefined') {
      return {
        isOnline: true,
        isSlowConnection: false,
        effectiveType: 'unknown',
        downlink: undefined,
        rtt: undefined,
        saveData: false,
      }
    }

    // @ts-expect-error - connection is not in the standard navigator type
    const connection = navigator.connection
    const effectiveType = connection?.effectiveType || 'unknown'

    return {
      isOnline: navigator.onLine,
      isSlowConnection: isSlowEffectiveType(effectiveType),
      effectiveType,
      downlink: connection?.downlink,
      rtt: connection?.rtt,
      saveData: connection?.saveData || false,
    }
  })

  useEffect(() => {
    const handleOnline = () => setStatus((prev) => ({ ...prev, isOnline: true }))
    const handleOffline = () => setStatus((prev) => ({ ...prev, isOnline: false }))

    const handleConnectionChange = () => {
      // @ts-expect-error - connection is not in the standard navigator type
      const connection = navigator.connection

      if (connection) {
        const effectiveType = connection.effectiveType || 'unknown'
        setStatus((prev) => ({
          ...prev,
          effectiveType,
          isSlowConnection: isSlowEffectiveType(effectiveType),
          downlink: connection.downlink,
          rtt: connection.rtt,
          saveData: connection.saveData || false,
        }))
      }
    }

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // @ts-expect-error - connection is not in the standard navigator type
    const connection = navigator.connection
    if (connection) {
      connection.addEventListener('change', handleConnectionChange)
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)

      if (connection) {
        connection.removeEventListener('change', handleConnectionChange)
      }
    }
  }, [])

  return status
}

