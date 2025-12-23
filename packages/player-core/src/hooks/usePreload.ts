/* eslint-disable react-hooks/exhaustive-deps */
/**
 * usePreload - Hook for video preloading with priority queue
 */

'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import {
  PreloadManager,
  type PreloadItem,
  type PreloadStatus,
  type PreloadManagerOptions,
} from '../services'

export interface UsePreloadOptions extends PreloadManagerOptions {
  /** Whether preloading is enabled. Default: true */
  enabled?: boolean
}

export interface UsePreloadReturn {
  /** Enqueue a video for preloading */
  preload: (url: string, priority?: number, type?: PreloadItem['type']) => void
  /** Enqueue multiple videos */
  preloadMany: (items: PreloadItem[]) => void
  /** Cancel a specific preload */
  cancel: (url: string) => void
  /** Cancel all preloads */
  cancelAll: () => void
  /** Pause/resume preloading */
  setPaused: (paused: boolean) => void
  /** Handle scroll velocity (cancels on fast scroll) */
  handleScrollVelocity: (velocity: number) => void
  /** Check if URL is preloaded */
  isPreloaded: (url: string) => boolean
  /** Get preload status for a URL */
  getStatus: (url: string) => PreloadStatus | null
  /** List of preloaded URLs */
  preloadedUrls: string[]
  /** All preload statuses */
  statuses: PreloadStatus[]
  /** Whether preloading is paused */
  isPaused: boolean
  /** Preload manager instance */
  manager: PreloadManager
}

/**
 * usePreload - Hook for video preloading with priority queue
 * @param options - Options for the usePreload hook
 * @returns UsePreloadReturn - The return value of the usePreload hook
 */
export function usePreload(options: UsePreloadOptions = {}): UsePreloadReturn {
  const { enabled = true, ...managerOptions } = options

  const managerRef = useRef<PreloadManager | null>(null)
  const [preloadedUrls, setPreloadedUrls] = useState<string[]>([])
  const [statuses, setStatuses] = useState<PreloadStatus[]>([])
  const [isPaused, setIsPaused] = useState(false)

  // Initialize manager
  useEffect(() => {
    if (!enabled) return

    managerRef.current = new PreloadManager(managerOptions)

    // Subscribe to events
    const unsubscribe = managerRef.current.subscribe({
      onPreloadStart: () => {
        setStatuses(managerRef.current?.getAllStatuses() ?? [])
      },
      onPreloadComplete: () => {
        setPreloadedUrls(managerRef.current?.getPreloadedUrls() ?? [])
        setStatuses(managerRef.current?.getAllStatuses() ?? [])
      },
      onPreloadError: () => {
        setStatuses(managerRef.current?.getAllStatuses() ?? [])
      },
      onPreloadCancel: () => {
        setStatuses(managerRef.current?.getAllStatuses() ?? [])
      },
    })

    return () => {
      unsubscribe()
      managerRef.current?.destroy()
    }
  }, [enabled]) // managerOptions intentionally excluded

  const preload = useCallback(
    (url: string, priority = 5, type: PreloadItem['type'] = 'metadata') => {
      if (!enabled || !managerRef.current) return
      managerRef.current.enqueue({ url, priority, type })
    },
    [enabled]
  )

  const preloadMany = useCallback(
    (items: PreloadItem[]) => {
      if (!enabled || !managerRef.current) return
      managerRef.current.enqueueMany(items)
    },
    [enabled]
  )

  const cancel = useCallback((url: string) => {
    managerRef.current?.cancel(url)
  }, [])

  const cancelAll = useCallback(() => {
    managerRef.current?.cancelAll()
    setStatuses([])
  }, [])

  const setPaused = useCallback((paused: boolean) => {
    managerRef.current?.setPaused(paused)
    setIsPaused(paused)
  }, [])

  const handleScrollVelocity = useCallback((velocity: number) => {
    managerRef.current?.handleScrollVelocity(velocity)
  }, [])

  const isPreloaded = useCallback((url: string): boolean => {
    return managerRef.current?.isPreloaded(url) ?? false
  }, [])

  const getStatus = useCallback((url: string): PreloadStatus | null => {
    return managerRef.current?.getStatus(url) ?? null
  }, [])

  return {
    preload,
    preloadMany,
    cancel,
    cancelAll,
    setPaused,
    handleScrollVelocity,
    isPreloaded,
    getStatus,
    preloadedUrls,
    statuses,
    isPaused,
    manager: managerRef.current!,
  }
}

