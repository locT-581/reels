/**
 * Video Cache - IndexedDB video caching utilities
 */

import { getDB } from './db'
import type { Video } from '../types'

// Default TTL: 24 hours
const DEFAULT_TTL = 1000 * 60 * 60 * 24

// ============================================
// Video Metadata Cache
// ============================================

/**
 * Cache video metadata
 */
export async function cacheVideo(
  video: Video,
  ttl: number = DEFAULT_TTL
): Promise<void> {
  const db = await getDB()
  const now = Date.now()

  await db.put('videos', {
    id: video.id,
    data: video,
    cachedAt: now,
    expiresAt: now + ttl,
  })
}

/**
 * Cache multiple videos
 */
export async function cacheVideos(
  videos: Video[],
  ttl: number = DEFAULT_TTL
): Promise<void> {
  const db = await getDB()
  const now = Date.now()
  const tx = db.transaction('videos', 'readwrite')

  await Promise.all([
    ...videos.map((video) =>
      tx.store.put({
        id: video.id,
        data: video,
        cachedAt: now,
        expiresAt: now + ttl,
      })
    ),
    tx.done,
  ])
}

/**
 * Get cached video by ID
 */
export async function getCachedVideo(videoId: string): Promise<Video | null> {
  const db = await getDB()
  const entry = await db.get('videos', videoId)

  if (!entry) return null

  // Check if expired
  if (entry.expiresAt < Date.now()) {
    await db.delete('videos', videoId)
    return null
  }

  return entry.data
}

/**
 * Get multiple cached videos
 */
export async function getCachedVideos(videoIds: string[]): Promise<Map<string, Video>> {
  const db = await getDB()
  const now = Date.now()
  const result = new Map<string, Video>()
  const expiredIds: string[] = []

  const tx = db.transaction('videos', 'readonly')

  await Promise.all(
    videoIds.map(async (id) => {
      const entry = await tx.store.get(id)
      if (entry) {
        if (entry.expiresAt < now) {
          expiredIds.push(id)
        } else {
          result.set(id, entry.data)
        }
      }
    })
  )

  // Clean up expired entries
  if (expiredIds.length > 0) {
    const deleteTx = db.transaction('videos', 'readwrite')
    await Promise.all([
      ...expiredIds.map((id) => deleteTx.store.delete(id)),
      deleteTx.done,
    ])
  }

  return result
}

/**
 * Check if video is cached
 */
export async function isVideoCached(videoId: string): Promise<boolean> {
  const video = await getCachedVideo(videoId)
  return video !== null
}

/**
 * Delete cached video
 */
export async function deleteCachedVideo(videoId: string): Promise<void> {
  const db = await getDB()
  await db.delete('videos', videoId)
}

/**
 * Clear expired cache entries
 */
export async function clearExpiredCache(): Promise<number> {
  const db = await getDB()
  const now = Date.now()
  let deletedCount = 0

  const tx = db.transaction('videos', 'readwrite')
  const index = tx.store.index('by-expiresAt')

  let cursor = await index.openCursor(IDBKeyRange.upperBound(now))

  while (cursor) {
    await cursor.delete()
    deletedCount++
    cursor = await cursor.continue()
  }

  await tx.done
  return deletedCount
}

/**
 * Clear old cache entries by date
 */
export async function clearOldCache(olderThan: Date): Promise<number> {
  const db = await getDB()
  const timestamp = olderThan.getTime()
  let deletedCount = 0

  const tx = db.transaction('videos', 'readwrite')
  const index = tx.store.index('by-cachedAt')

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
 * Get cache statistics
 */
export async function getCacheStats(): Promise<{
  count: number
  oldestEntry: Date | null
  newestEntry: Date | null
}> {
  const db = await getDB()
  const tx = db.transaction('videos', 'readonly')
  const index = tx.store.index('by-cachedAt')

  const count = await tx.store.count()

  let oldest: Date | null = null
  let newest: Date | null = null

  const oldestCursor = await index.openCursor()
  if (oldestCursor) {
    oldest = new Date(oldestCursor.value.cachedAt)
  }

  const newestCursor = await index.openCursor(null, 'prev')
  if (newestCursor) {
    newest = new Date(newestCursor.value.cachedAt)
  }

  return { count, oldestEntry: oldest, newestEntry: newest }
}

