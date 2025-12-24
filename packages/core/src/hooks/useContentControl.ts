/**
 * useContentControl - Hook for content control actions
 * 
 * Handles "Not interested", "Hide author", and "Report" actions
 */

'use client'

import { useState, useCallback } from 'react'
import { mediumHaptic } from '../utils/haptic'

const HIDDEN_VIDEOS_KEY = 'xhub_reel_hidden_videos'
const HIDDEN_AUTHORS_KEY = 'xhub_reel_hidden_authors'

export type ReportReason =
  | 'spam'
  | 'harassment'
  | 'violence'
  | 'hate_speech'
  | 'nudity'
  | 'misinformation'
  | 'copyright'
  | 'other'

export interface ContentControlOptions {
  /** Video ID */
  videoId: string
  /** Author ID */
  authorId: string
  /** Called when "Not interested" is triggered */
  onNotInterested?: (videoId: string) => Promise<void>
  /** Called when "Hide author" is triggered */
  onHideAuthor?: (authorId: string) => Promise<void>
  /** Called when "Report" is triggered */
  onReport?: (videoId: string, reason: ReportReason, details?: string) => Promise<void>
}

export interface ContentControlReturn {
  /** Mark video as "not interested" */
  markNotInterested: () => Promise<void>
  /** Hide all content from this author */
  hideAuthor: () => Promise<void>
  /** Report content */
  reportContent: (reason: ReportReason, details?: string) => Promise<void>
  /** Whether any action is in progress */
  isPending: boolean
  /** Whether video is hidden */
  isVideoHidden: boolean
  /** Whether author is hidden */
  isAuthorHidden: boolean
  /** Last error if any */
  error: Error | null
}

// Storage helpers
function getHiddenSet(key: string): Set<string> {
  if (typeof window === 'undefined') return new Set()
  try {
    const data = localStorage.getItem(key)
    return data ? new Set(JSON.parse(data)) : new Set()
  } catch {
    return new Set()
  }
}

function saveHiddenSet(key: string, set: Set<string>) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(key, JSON.stringify([...set]))
  } catch {
    // Storage error
  }
}

export function useContentControl({
  videoId,
  authorId,
  onNotInterested,
  onHideAuthor,
  onReport,
}: ContentControlOptions): ContentControlReturn {
  const [isPending, setIsPending] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const [isVideoHidden, setIsVideoHidden] = useState(() =>
    getHiddenSet(HIDDEN_VIDEOS_KEY).has(videoId)
  )
  const [isAuthorHidden, setIsAuthorHidden] = useState(() =>
    getHiddenSet(HIDDEN_AUTHORS_KEY).has(authorId)
  )

  const markNotInterested = useCallback(async () => {
    setIsPending(true)
    setError(null)
    mediumHaptic()

    try {
      // Save locally first
      const hiddenVideos = getHiddenSet(HIDDEN_VIDEOS_KEY)
      hiddenVideos.add(videoId)
      saveHiddenSet(HIDDEN_VIDEOS_KEY, hiddenVideos)
      setIsVideoHidden(true)

      // API call
      await onNotInterested?.(videoId)
    } catch (err) {
      // Rollback on error
      const hiddenVideos = getHiddenSet(HIDDEN_VIDEOS_KEY)
      hiddenVideos.delete(videoId)
      saveHiddenSet(HIDDEN_VIDEOS_KEY, hiddenVideos)
      setIsVideoHidden(false)

      setError(err instanceof Error ? err : new Error('Failed to mark as not interested'))
    } finally {
      setIsPending(false)
    }
  }, [videoId, onNotInterested])

  const hideAuthor = useCallback(async () => {
    setIsPending(true)
    setError(null)
    mediumHaptic()

    try {
      // Save locally first
      const hiddenAuthors = getHiddenSet(HIDDEN_AUTHORS_KEY)
      hiddenAuthors.add(authorId)
      saveHiddenSet(HIDDEN_AUTHORS_KEY, hiddenAuthors)
      setIsAuthorHidden(true)

      // API call
      await onHideAuthor?.(authorId)
    } catch (err) {
      // Rollback on error
      const hiddenAuthors = getHiddenSet(HIDDEN_AUTHORS_KEY)
      hiddenAuthors.delete(authorId)
      saveHiddenSet(HIDDEN_AUTHORS_KEY, hiddenAuthors)
      setIsAuthorHidden(false)

      setError(err instanceof Error ? err : new Error('Failed to hide author'))
    } finally {
      setIsPending(false)
    }
  }, [authorId, onHideAuthor])

  const reportContent = useCallback(
    async (reason: ReportReason, details?: string) => {
      setIsPending(true)
      setError(null)
      mediumHaptic()

      try {
        await onReport?.(videoId, reason, details)
      } catch (err) {
        setError(err instanceof Error ? err : new Error('Failed to report content'))
        throw err
      } finally {
        setIsPending(false)
      }
    },
    [videoId, onReport]
  )

  return {
    markNotInterested,
    hideAuthor,
    reportContent,
    isPending,
    isVideoHidden,
    isAuthorHidden,
    error,
  }
}

/**
 * Check if a video is hidden
 */
export function isVideoHidden(videoId: string): boolean {
  return getHiddenSet(HIDDEN_VIDEOS_KEY).has(videoId)
}

/**
 * Check if an author is hidden
 */
export function isAuthorHidden(authorId: string): boolean {
  return getHiddenSet(HIDDEN_AUTHORS_KEY).has(authorId)
}

/**
 * Get all hidden video IDs
 */
export function getHiddenVideoIds(): string[] {
  return [...getHiddenSet(HIDDEN_VIDEOS_KEY)]
}

/**
 * Get all hidden author IDs
 */
export function getHiddenAuthorIds(): string[] {
  return [...getHiddenSet(HIDDEN_AUTHORS_KEY)]
}

/**
 * Clear all hidden content
 */
export function clearHiddenContent() {
  if (typeof window === 'undefined') return
  localStorage.removeItem(HIDDEN_VIDEOS_KEY)
  localStorage.removeItem(HIDDEN_AUTHORS_KEY)
}

