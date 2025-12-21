/**
 * Watch History - Track video watch progress
 */

import { getDB } from './db'

export interface WatchProgress {
  videoId: string
  progress: number // seconds watched
  duration: number
  percentage: number
  watchedAt: number
  completed: boolean
}

// Threshold for "completed" (watched 90%)
const COMPLETION_THRESHOLD = 0.9

// ============================================
// Watch Progress Functions
// ============================================

/**
 * Save watch progress for a video
 */
export async function saveWatchProgress(
  videoId: string,
  progress: number,
  duration: number
): Promise<void> {
  const db = await getDB()
  const percentage = duration > 0 ? progress / duration : 0
  const completed = percentage >= COMPLETION_THRESHOLD

  await db.put('watchHistory', {
    videoId,
    progress,
    duration,
    percentage,
    watchedAt: Date.now(),
    completed,
  })
}

/**
 * Get watch progress for a video
 */
export async function getWatchProgress(videoId: string): Promise<WatchProgress | null> {
  const db = await getDB()
  const result = await db.get('watchHistory', videoId)
  return result ?? null
}

/**
 * Get all watch history
 */
export async function getWatchHistory(
  limit = 50,
  offset = 0
): Promise<WatchProgress[]> {
  const db = await getDB()
  const tx = db.transaction('watchHistory', 'readonly')
  const index = tx.store.index('by-watchedAt')

  const results: WatchProgress[] = []
  let cursor = await index.openCursor(null, 'prev')
  let skipped = 0

  while (cursor && results.length < limit) {
    if (skipped >= offset) {
      results.push(cursor.value)
    } else {
      skipped++
    }
    cursor = await cursor.continue()
  }

  return results
}

/**
 * Get recently watched videos
 */
export async function getRecentlyWatched(
  limit = 10,
  minPercentage = 0.1
): Promise<WatchProgress[]> {
  const db = await getDB()
  const tx = db.transaction('watchHistory', 'readonly')
  const index = tx.store.index('by-watchedAt')

  const results: WatchProgress[] = []
  let cursor = await index.openCursor(null, 'prev')

  while (cursor && results.length < limit) {
    if (cursor.value.percentage >= minPercentage) {
      results.push(cursor.value)
    }
    cursor = await cursor.continue()
  }

  return results
}

/**
 * Get completed videos
 */
export async function getCompletedVideos(limit = 50): Promise<WatchProgress[]> {
  const all = await getWatchHistory(1000) // Get more to filter
  return all.filter((p) => p.completed).slice(0, limit)
}

/**
 * Delete watch progress for a video
 */
export async function deleteWatchProgress(videoId: string): Promise<void> {
  const db = await getDB()
  await db.delete('watchHistory', videoId)
}

/**
 * Clear all watch history
 */
export async function clearWatchHistory(): Promise<void> {
  const db = await getDB()
  const tx = db.transaction('watchHistory', 'readwrite')
  await tx.store.clear()
  await tx.done
}

/**
 * Clear watch history older than a date
 */
export async function clearOldWatchHistory(olderThan: Date): Promise<number> {
  const db = await getDB()
  const timestamp = olderThan.getTime()
  let deletedCount = 0

  const tx = db.transaction('watchHistory', 'readwrite')
  const index = tx.store.index('by-watchedAt')

  let cursor = await index.openCursor(IDBKeyRange.upperBound(timestamp))

  while (cursor) {
    await cursor.delete()
    deletedCount++
    cursor = await cursor.continue()
  }

  await tx.done
  return deletedCount
}

/**
 * Get watch history statistics
 */
export async function getWatchStats(): Promise<{
  totalVideos: number
  completedVideos: number
  totalWatchTime: number // seconds
}> {
  const db = await getDB()
  const all = await db.getAll('watchHistory')

  return {
    totalVideos: all.length,
    completedVideos: all.filter((p) => p.completed).length,
    totalWatchTime: all.reduce((sum, p) => sum + p.progress, 0),
  }
}

