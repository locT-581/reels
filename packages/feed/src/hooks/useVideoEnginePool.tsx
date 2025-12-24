/**
 * useVideoEnginePool - React hook and provider for VideoEnginePool
 *
 * Provides a pool of pre-initialized video engines for instant playback.
 * The pool pre-loads and pre-decodes adjacent videos so that swipes
 * result in instant video display without black screens.
 *
 * @example
 * ```tsx
 * // Wrap your app or feed with the provider
 * <VideoEnginePoolProvider>
 *   <VideoFeed videos={videos} />
 * </VideoEnginePoolProvider>
 *
 * // In your video component
 * function VideoItem({ video, isActive }) {
 *   const pool = useVideoEnginePool()
 *
 *   // Pool automatically handles preloading via orchestration
 *   const element = pool.getElement(video.id)
 *
 *   return <div ref={containerRef} />  // Element attached by pool
 * }
 * ```
 */

'use client'

import {
  createContext,
  useContext,
  useRef,
  useState,
  useEffect,
  useMemo,
  useCallback,
  type ReactNode,
} from 'react'
import {
  type VideoEnginePool,
  createVideoEnginePool,
  type VideoEnginePoolOptions,
  type EngineSlot,
  type SlotState,
  type PlatformConfig,
} from '@xhub-reel/player-engine'
import type { Video } from '@xhub-reel/core'

// =============================================================================
// CONTEXT
// =============================================================================

interface VideoEnginePoolContextValue {
  /** The pool instance (may be null during SSR or before mount) */
  pool: VideoEnginePool | null
  /** Whether the pool is ready */
  isReady: boolean
  /** Get pool instance safely */
  getPool: () => VideoEnginePool | null
}

const VideoEnginePoolContext = createContext<VideoEnginePoolContextValue | null>(null)

// =============================================================================
// PROVIDER
// =============================================================================

export interface VideoEnginePoolProviderProps {
  children: ReactNode
  /** Pool configuration options */
  options?: VideoEnginePoolOptions
  /** Platform config overrides */
  config?: Partial<PlatformConfig>
  /** Force HLS.js over native (recommended for WebViews) */
  forceHLSJS?: boolean
  /** Callback when slot state changes */
  onSlotStateChange?: (slot: EngineSlot, prevState: SlotState) => void
  /** Callback when error occurs */
  onError?: (slot: EngineSlot, error: Error) => void
  /** Callback when first frame is ready */
  onFirstFrameReady?: (slot: EngineSlot) => void
}

/**
 * Provider component that creates and manages a VideoEnginePool instance.
 * Wrap your feed or app with this provider to enable pooled video playback.
 */
export function VideoEnginePoolProvider({
  children,
  options,
  config,
  forceHLSJS,
  onSlotStateChange,
  onError,
  onFirstFrameReady,
}: VideoEnginePoolProviderProps) {
  const poolRef = useRef<VideoEnginePool | null>(null)
  const [isReady, setIsReady] = useState(false)
  const isClient = typeof window !== 'undefined'

  // Create pool instance on client only (after mount)
  // Using useEffect to ensure SSR-safety
  useEffect(() => {
    if (!poolRef.current && isClient) {
      poolRef.current = createVideoEnginePool({
        ...options,
        config,
        forceHLSJS,
        onSlotStateChange,
        onError,
        onFirstFrameReady,
      })
      setIsReady(true)
      console.log('[VideoEnginePoolProvider] Pool created and ready')
    }

    return () => {
      poolRef.current?.destroy()
      poolRef.current = null
      setIsReady(false)
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  // Create a lazy pool accessor that handles SSR
  const getPool = useCallback((): VideoEnginePool | null => {
    return poolRef.current
  }, [])

  const contextValue = useMemo(
    () => ({
      pool: poolRef.current,
      isReady,
      getPool,
    }),
    [isReady, getPool]
  )

  return (
    <VideoEnginePoolContext.Provider value={contextValue}>
      {children}
    </VideoEnginePoolContext.Provider>
  )
}

// =============================================================================
// HOOKS
// =============================================================================

/**
 * Hook to access the VideoEnginePool instance.
 * Must be used within a VideoEnginePoolProvider.
 * Returns null during SSR or before hydration.
 */
export function useVideoEnginePool(): VideoEnginePool | null {
  const context = useContext(VideoEnginePoolContext)

  if (!context) {
    throw new Error(
      '[useVideoEnginePool] Must be used within a VideoEnginePoolProvider. ' +
      'Wrap your feed component with <VideoEnginePoolProvider>.'
    )
  }

  return context.pool
}

/**
 * Hook to check if pool is available (for conditional rendering).
 * Returns null if not in provider context (doesn't throw).
 */
export function useVideoEnginePoolOptional(): VideoEnginePool | null {
  const context = useContext(VideoEnginePoolContext)
  return context?.pool ?? null
}

/**
 * Hook to check if pool is ready for use.
 */
export function useVideoEnginePoolReady(): boolean {
  const context = useContext(VideoEnginePoolContext)
  return context?.isReady ?? false
}

// =============================================================================
// ORCHESTRATION HOOKS
// =============================================================================

/**
 * Hook to orchestrate the pool based on current feed position.
 * Call this in your VideoFeed component to automatically manage preloading.
 *
 * @param currentIndex - Current video index in feed
 * @param videos - Array of video data
 * @param enabled - Whether orchestration is enabled (default: true)
 */
export function usePoolOrchestration(
  currentIndex: number,
  videos: Video[],
  enabled: boolean = true
): void {
  const pool = useVideoEnginePoolOptional()

  useEffect(() => {
    if (!pool || !enabled || videos.length === 0) return

    // Convert to minimal format needed by pool
    const videoList = videos.map(v => ({
      id: v.id,
      url: v.url,
    }))

    pool.orchestrate(currentIndex, videoList)
  }, [pool, currentIndex, videos, enabled])
}

/**
 * Hook for a single video slot management.
 * Use this in individual video item components.
 *
 * @param video - Video data
 * @param isActive - Whether this video is currently active
 */
export function usePooledVideo(
  video: Video,
  isActive: boolean
): {
  element: HTMLVideoElement | null
  isReady: boolean
  state: SlotState | null
  containerRef: (node: HTMLDivElement | null) => void
} {
  const pool = useVideoEnginePoolOptional()
  const containerRef = useRef<HTMLDivElement | null>(null)
  const attachedRef = useRef(false)

  // Get current state
  const state = pool?.getState(video.id) ?? null
  const isReady = pool?.isReady(video.id) ?? false
  const element = pool?.getElement(video.id) ?? null

  // Attach element to container
  const setContainerRef = useCallback((node: HTMLDivElement | null) => {
    containerRef.current = node

    if (!pool || !element) return

    if (node && !attachedRef.current) {
      // Attach element to DOM
      node.appendChild(element)
      attachedRef.current = true
    } else if (!node && attachedRef.current) {
      // Detach element from DOM (but don't destroy - pool manages lifecycle)
      if (element.parentNode) {
        element.parentNode.removeChild(element)
      }
      attachedRef.current = false
    }
  }, [pool, element])

  // Handle activation changes
  useEffect(() => {
    if (!pool) return

    if (isActive) {
      pool.activate(video.id).catch((err: unknown) => {
        console.warn('[usePooledVideo] Activation failed', video.id, err)
      })
    } else {
      pool.deactivate(video.id)
    }
  }, [pool, video.id, isActive])

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (attachedRef.current && element?.parentNode && element.parentNode === containerRef.current) {
        element.parentNode.removeChild(element)
        attachedRef.current = false
      }
    }
  }, [element])

  return {
    element,
    isReady,
    state,
    containerRef: setContainerRef,
  }
}

// =============================================================================
// UTILITY HOOKS
// =============================================================================

/**
 * Hook to get pool statistics for debugging/monitoring.
 */
export function usePoolStats(): {
  totalSlots: number
  activeSlots: number
  preloadedSlots: number
  loadingSlots: number
  elementPoolSize: number
} | null {
  const pool = useVideoEnginePoolOptional()
  return pool?.getStats() ?? null
}

/**
 * Hook to manually trigger memory reduction.
 * Useful when you detect memory pressure.
 */
export function usePoolMemoryControl(): {
  reduceMemory: () => void
  pauseAll: () => void
} {
  const pool = useVideoEnginePoolOptional()

  const reduceMemory = useCallback(() => {
    pool?.reduceMemory()
  }, [pool])

  const pauseAll = useCallback(() => {
    pool?.pauseAll()
  }, [pool])

  return { reduceMemory, pauseAll }
}

// =============================================================================
// RE-EXPORTS
// =============================================================================

export type {
  VideoEnginePoolOptions,
  EngineSlot,
  SlotState,
  PlatformConfig,
}

