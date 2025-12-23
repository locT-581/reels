/**
 * useNetwork - Hook for network condition monitoring
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import { NetworkDetector, type NetworkInfo } from '../services'

export interface UseNetworkReturn {
  /** Current network info */
  networkInfo: NetworkInfo
  /** Whether device is offline */
  isOffline: boolean
  /** Current effective connection type */
  effectiveType: string
  /** Whether network is considered slow (2G/3G or data saver) */
  isSlowNetwork: boolean
  /** Estimated download time for a given size in bytes (returns seconds) */
  estimateDownloadTime: (bytes: number) => number
  /** Network detector instance */
  detector: NetworkDetector
}

const DEFAULT_NETWORK_INFO: NetworkInfo = {
  effectiveType: 'unknown',
  downlink: 0,
  rtt: 0,
  saveData: false,
  type: 'unknown',
  online: true,
}

/**
 * useNetwork - Hook for network condition monitoring
 * @returns UseNetworkReturn - The return value of the useNetwork hook
 */
export function useNetwork(): UseNetworkReturn {
  const detectorRef = useRef<NetworkDetector | null>(null)
  const [networkInfo, setNetworkInfo] = useState<NetworkInfo>(DEFAULT_NETWORK_INFO)

  // Initialize detector
  useEffect(() => {
    detectorRef.current = new NetworkDetector()

    // Get initial state
    setNetworkInfo(detectorRef.current.getInfo())

    // Subscribe to changes
    const unsubscribe = detectorRef.current.subscribe({
      onNetworkChange: (info) => {
        setNetworkInfo(info)
      },
      onOffline: () => {
        setNetworkInfo((prev) => ({ ...prev, online: false }))
      },
      onOnline: () => {
        setNetworkInfo((prev) => ({ ...prev, online: true }))
      },
    })

    return () => {
      unsubscribe()
    }
  }, [])

  const estimateDownloadTime = useCallback(
    (bytes: number): number => {
      return detectorRef.current?.estimateDownloadTime(bytes) ?? Infinity
    },
    []
  )

  const isOffline = !networkInfo.online
  const effectiveType = networkInfo.effectiveType
  const isSlowNetwork = detectorRef.current?.isSlowNetwork() ?? false

  return {
    networkInfo,
    isOffline,
    effectiveType,
    isSlowNetwork,
    estimateDownloadTime,
    detector: detectorRef.current!,
  }
}

