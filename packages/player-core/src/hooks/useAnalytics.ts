/**
 * useAnalytics - Hook for video playback analytics
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  AnalyticsCollector,
  type PlaybackMetrics,
  type AnalyticsCollectorCallbacks,
} from '../services'

export interface UseAnalyticsOptions {
  /** Auto-start session when videoId changes */
  autoStart?: boolean
  /** Callbacks for analytics events */
  callbacks?: AnalyticsCollectorCallbacks
}

export interface UseAnalyticsReturn {
  /** Current playback metrics */
  metrics: PlaybackMetrics | null
  /** Start a new analytics session */
  startSession: (videoId: string, video?: HTMLVideoElement) => void
  /** End current session and get final metrics */
  endSession: () => PlaybackMetrics | null
  /** Track buffering event */
  trackBuffering: (isBuffering: boolean) => void
  /** Track quality switch */
  trackQualitySwitch: (fromLevel: number, toLevel: number, auto?: boolean) => void
  /** Track bitrate */
  trackBitrate: (bitrate: number) => void
  /** Track error */
  trackError: (error: Error, recovered: boolean, recoveryTime?: number) => void
  /** Track replay */
  trackReplay: () => void
  /** Check if session is active */
  hasActiveSession: boolean
  /** Analytics collector instance */
  collector: AnalyticsCollector
}

/**
 * useAnalytics - Hook for video playback analytics
 * @param options - Options for the useAnalytics hook
 * @returns UseAnalyticsReturn - The return value of the useAnalytics hook
 */
export function useAnalytics(options: UseAnalyticsOptions = {}): UseAnalyticsReturn {
  const { callbacks } = options

  const collectorRef = useRef<AnalyticsCollector | null>(null)
  const [metrics, setMetrics] = useState<PlaybackMetrics | null>(null)
  const [hasActiveSession, setHasActiveSession] = useState(false)

  // Initialize collector
  useEffect(() => {
    collectorRef.current = new AnalyticsCollector()

    // Subscribe to updates
    const unsubscribe = collectorRef.current.subscribe({
      ...callbacks,
      onMetricsUpdate: (newMetrics) => {
        setMetrics(newMetrics)
        callbacks?.onMetricsUpdate?.(newMetrics)
      },
      onSessionEnd: (finalMetrics) => {
        setHasActiveSession(false)
        callbacks?.onSessionEnd?.(finalMetrics)
      },
    })

    return () => {
      unsubscribe()
      collectorRef.current?.destroy()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []) // callbacks intentionally excluded to avoid re-init

  const startSession = useCallback((videoId: string, video?: HTMLVideoElement) => {
    collectorRef.current?.startSession(videoId, video)
    setHasActiveSession(true)
    setMetrics(null)
  }, [])

  const endSession = useCallback((): PlaybackMetrics | null => {
    const finalMetrics = collectorRef.current?.endSession() ?? null
    setHasActiveSession(false)
    return finalMetrics
  }, [])

  const trackBuffering = useCallback((isBuffering: boolean) => {
    collectorRef.current?.trackBuffering(isBuffering)
  }, [])

  const trackQualitySwitch = useCallback((fromLevel: number, toLevel: number, auto = true) => {
    collectorRef.current?.trackQualitySwitch(fromLevel, toLevel, auto)
  }, [])

  const trackBitrate = useCallback((bitrate: number) => {
    collectorRef.current?.trackBitrate(bitrate)
  }, [])

  const trackError = useCallback((error: Error, recovered: boolean, recoveryTime?: number) => {
    collectorRef.current?.trackError(error, recovered, recoveryTime)
  }, [])

  const trackReplay = useCallback(() => {
    collectorRef.current?.trackReplay()
  }, [])

  return {
    metrics,
    startSession,
    endSession,
    trackBuffering,
    trackQualitySwitch,
    trackBitrate,
    trackError,
    trackReplay,
    hasActiveSession,
    collector: collectorRef.current!,
  }
}

