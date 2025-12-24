/**
 * useSave - Hook for managing save/bookmark state
 */

'use client'

import { useState, useCallback, useEffect } from 'react'
import { lightHaptic } from '../utils/haptic'

const STORAGE_KEY = 'xhub_reel_saved_videos'

export interface UseSaveOptions {
  /** Video ID */
  videoId: string
  /** Initial saved state */
  initialSaved?: boolean
  /** Called when save state changes (for API calls) */
  onSaveChange?: (isSaved: boolean, videoId: string) => Promise<void>
  /** Persist to local storage */
  persistLocal?: boolean
}

export interface UseSaveReturn {
  /** Current saved state */
  isSaved: boolean
  /** Toggle save state */
  toggleSave: () => void
  /** Set save state directly */
  setSaved: (saved: boolean) => void
  /** Whether an API call is pending */
  isPending: boolean
  /** Last error if any */
  error: Error | null
}

// Helper to get saved videos from local storage
function getSavedFromStorage(): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const saved = localStorage.getItem(STORAGE_KEY)
    return saved ? new Set(JSON.parse(saved)) : new Set()
  } catch {
    return new Set()
  }
}

// Helper to save to local storage
function saveToStorage(savedIds: Set<string>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify([...savedIds]))
  } catch {
    // Storage might be full or disabled
  }
}

export function useSave({
  videoId,
  initialSaved,
  onSaveChange,
  persistLocal = true,
}: UseSaveOptions): UseSaveReturn {
  const [isSaved, setIsSaved] = useState(() => {
    if (initialSaved !== undefined) return initialSaved
    if (persistLocal) {
      return getSavedFromStorage().has(videoId)
    }
    return false
  })
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Sync with local storage on mount
  useEffect(() => {
    if (persistLocal && initialSaved === undefined) {
      const savedVideos = getSavedFromStorage()
      setIsSaved(savedVideos.has(videoId))
    }
  }, [videoId, initialSaved, persistLocal])

  const toggleSave = useCallback(async () => {
    const newSaved = !isSaved

    // Optimistic update
    setIsSaved(newSaved)
    setError(null)
    lightHaptic()

    // Update local storage
    if (persistLocal) {
      const savedVideos = getSavedFromStorage()
      if (newSaved) {
        savedVideos.add(videoId)
      } else {
        savedVideos.delete(videoId)
      }
      saveToStorage(savedVideos)
    }

    // API call
    if (onSaveChange) {
      setIsPending(true)
      try {
        await onSaveChange(newSaved, videoId)
      } catch (err) {
        // Rollback on error
        setIsSaved(!newSaved)

        // Rollback local storage
        if (persistLocal) {
          const savedVideos = getSavedFromStorage()
          if (!newSaved) {
            savedVideos.add(videoId)
          } else {
            savedVideos.delete(videoId)
          }
          saveToStorage(savedVideos)
        }

        setError(err instanceof Error ? err : new Error('Failed to update save'))
      } finally {
        setIsPending(false)
      }
    }
  }, [isSaved, videoId, onSaveChange, persistLocal])

  const setSaved = useCallback(
    (saved: boolean) => {
      setIsSaved(saved)

      if (persistLocal) {
        const savedVideos = getSavedFromStorage()
        if (saved) {
          savedVideos.add(videoId)
        } else {
          savedVideos.delete(videoId)
        }
        saveToStorage(savedVideos)
      }
    },
    [videoId, persistLocal]
  )

  return {
    isSaved,
    toggleSave,
    setSaved,
    isPending,
    error,
  }
}

/**
 * Get all saved video IDs from local storage
 */
export function getSavedVideoIds(): string[] {
  return [...getSavedFromStorage()]
}

/**
 * Check if a video is saved
 */
export function isVideoSaved(videoId: string): boolean {
  return getSavedFromStorage().has(videoId)
}

