/**
 * useMemoryManager - Hook for memory management in feed
 */

'use client'

import { useEffect, useState, useCallback } from 'react'
import { memoryManager, type MemoryState } from '../utils/memory-manager'

export interface UseMemoryManagerOptions {
  /** Video ID to track */
  videoId: string
  /** Estimated video size in MB */
  estimatedSizeMB?: number
  /** Callback when video should be disposed due to memory pressure */
  onShouldDispose?: () => void
}

export interface UseMemoryManagerReturn {
  memoryState: MemoryState
  setInDom: (inDom: boolean) => void
  setHasDecodedFrames: (hasFrames: boolean) => void
  shouldDispose: boolean
}

export function useMemoryManager({
  videoId,
  estimatedSizeMB = 10,
  onShouldDispose,
}: UseMemoryManagerOptions): UseMemoryManagerReturn {
  const [memoryState, setMemoryState] = useState<MemoryState>(() =>
    memoryManager.getState()
  )
  const [shouldDispose, setShouldDispose] = useState(false)

  // Register video on mount
  useEffect(() => {
    memoryManager.register(videoId, estimatedSizeMB)

    return () => {
      memoryManager.unregister(videoId)
    }
  }, [videoId, estimatedSizeMB])

  // Subscribe to memory state changes
  useEffect(() => {
    const unsubscribe = memoryManager.subscribe((state) => {
      setMemoryState(state)

      // Check if this video should be disposed
      const toDispose = memoryManager.getVideosToDispose()
      const shouldDisposeThis = toDispose.includes(videoId)

      if (shouldDisposeThis && !shouldDispose) {
        setShouldDispose(true)
        onShouldDispose?.()
      } else if (!shouldDisposeThis && shouldDispose) {
        setShouldDispose(false)
      }
    })

    return unsubscribe
  }, [videoId, shouldDispose, onShouldDispose])

  const setInDom = useCallback(
    (inDom: boolean) => {
      memoryManager.setInDom(videoId, inDom)
    },
    [videoId]
  )

  const setHasDecodedFrames = useCallback(
    (hasFrames: boolean) => {
      memoryManager.setHasDecodedFrames(videoId, hasFrames)
    },
    [videoId]
  )

  return {
    memoryState,
    setInDom,
    setHasDecodedFrames,
    shouldDispose,
  }
}

/**
 * useGlobalMemoryState - Get global memory state without tracking a specific video
 */
export function useGlobalMemoryState(): MemoryState {
  const [state, setState] = useState<MemoryState>(() => memoryManager.getState())

  useEffect(() => {
    const unsubscribe = memoryManager.subscribe(setState)
    return unsubscribe
  }, [])

  return state
}

