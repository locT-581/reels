/**
 * useLike - Hook for managing like state with optimistic updates
 */

'use client'

import { useState, useCallback, useRef } from 'react'
import { lightHaptic } from '../utils/haptic'

export interface UseLikeOptions {
  /** Initial liked state */
  initialLiked?: boolean
  /** Initial like count */
  initialCount?: number
  /** Called when like state changes (for API calls) */
  onLikeChange?: (isLiked: boolean) => Promise<void>
  /** Debounce time in ms */
  debounceMs?: number
}

export interface UseLikeReturn {
  /** Current liked state */
  isLiked: boolean
  /** Current like count */
  likeCount: number
  /** Toggle like state */
  toggleLike: () => void
  /** Set like state directly */
  setLiked: (liked: boolean) => void
  /** Whether an API call is pending */
  isPending: boolean
  /** Last error if any */
  error: Error | null
}

export function useLike({
  initialLiked = false,
  initialCount = 0,
  onLikeChange,
  debounceMs = 300,
}: UseLikeOptions = {}): UseLikeReturn {
  const [isLiked, setIsLiked] = useState(initialLiked)
  const [likeCount, setLikeCount] = useState(initialCount)
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)

  // Track the "true" state for rollback
  const confirmedStateRef = useRef({ isLiked: initialLiked, count: initialCount })
  const debounceTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const toggleLike = useCallback(() => {
    // Clear any pending debounce
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current)
    }

    // Optimistic update
    const newLiked = !isLiked
    const newCount = newLiked ? likeCount + 1 : Math.max(0, likeCount - 1)

    setIsLiked(newLiked)
    setLikeCount(newCount)
    setError(null)
    lightHaptic()

    // Debounce the API call
    debounceTimerRef.current = setTimeout(async () => {
      if (onLikeChange) {
        setIsPending(true)
        try {
          await onLikeChange(newLiked)
          // Update confirmed state on success
          confirmedStateRef.current = { isLiked: newLiked, count: newCount }
        } catch (err) {
          // Rollback on error
          setIsLiked(confirmedStateRef.current.isLiked)
          setLikeCount(confirmedStateRef.current.count)
          setError(err instanceof Error ? err : new Error('Failed to update like'))
        } finally {
          setIsPending(false)
        }
      } else {
        // No API call, just update confirmed state
        confirmedStateRef.current = { isLiked: newLiked, count: newCount }
      }
    }, debounceMs)
  }, [isLiked, likeCount, onLikeChange, debounceMs])

  const setLiked = useCallback(
    (liked: boolean) => {
      const newCount = liked
        ? confirmedStateRef.current.count + 1
        : Math.max(0, confirmedStateRef.current.count - 1)

      setIsLiked(liked)
      setLikeCount(newCount)
      confirmedStateRef.current = { isLiked: liked, count: newCount }
    },
    []
  )

  return {
    isLiked,
    likeCount,
    toggleLike,
    setLiked,
    isPending,
    error,
  }
}

