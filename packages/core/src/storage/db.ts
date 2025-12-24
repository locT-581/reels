/**
 * XHubReelDB - IndexedDB database for offline storage
 */

import { openDB, type DBSchema, type IDBPDatabase } from 'idb'
import type { Video } from '../types'

// ============================================
// Database Schema
// ============================================

export interface XHubReelDBSchema extends DBSchema {
  // Video metadata cache
  videos: {
    key: string
    value: {
      id: string
      data: Video
      cachedAt: number
      expiresAt: number
    }
    indexes: {
      'by-cachedAt': number
      'by-expiresAt': number
    }
  }

  // Video segments cache (for HLS)
  segments: {
    key: string
    value: {
      url: string
      videoId: string
      data: ArrayBuffer
      size: number
      cachedAt: number
    }
    indexes: {
      'by-videoId': string
      'by-cachedAt': number
    }
  }

  // Watch history
  watchHistory: {
    key: string
    value: {
      videoId: string
      progress: number // seconds watched
      duration: number
      percentage: number
      watchedAt: number
      completed: boolean
    }
    indexes: {
      'by-watchedAt': number
    }
  }

  // Saved videos (bookmarks)
  savedVideos: {
    key: string
    value: {
      videoId: string
      savedAt: number
      video?: Video
    }
    indexes: {
      'by-savedAt': number
    }
  }

  // User preferences
  preferences: {
    key: string
    value: unknown
  }

  // Offline action queue
  actionQueue: {
    key: string
    value: {
      id: string
      type: 'like' | 'unlike' | 'save' | 'unsave' | 'comment' | 'report'
      payload: Record<string, unknown>
      createdAt: number
      retries: number
      lastError?: string
    }
    indexes: {
      'by-createdAt': number
    }
  }
}

// ============================================
// Database Instance
// ============================================

const DB_NAME = 'xhub-reel-db'
const DB_VERSION = 1

let dbPromise: Promise<IDBPDatabase<XHubReelDBSchema>> | null = null

/**
 * Get or create database instance
 */
export function getDB(): Promise<IDBPDatabase<XHubReelDBSchema>> {
  if (typeof window === 'undefined') {
    return Promise.reject(new Error('IndexedDB not available on server'))
  }

  if (!dbPromise) {
    dbPromise = openDB<XHubReelDBSchema>(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Videos store
        if (!db.objectStoreNames.contains('videos')) {
          const videosStore = db.createObjectStore('videos', { keyPath: 'id' })
          videosStore.createIndex('by-cachedAt', 'cachedAt')
          videosStore.createIndex('by-expiresAt', 'expiresAt')
        }

        // Segments store
        if (!db.objectStoreNames.contains('segments')) {
          const segmentsStore = db.createObjectStore('segments', { keyPath: 'url' })
          segmentsStore.createIndex('by-videoId', 'videoId')
          segmentsStore.createIndex('by-cachedAt', 'cachedAt')
        }

        // Watch history store
        if (!db.objectStoreNames.contains('watchHistory')) {
          const historyStore = db.createObjectStore('watchHistory', {
            keyPath: 'videoId',
          })
          historyStore.createIndex('by-watchedAt', 'watchedAt')
        }

        // Saved videos store
        if (!db.objectStoreNames.contains('savedVideos')) {
          const savedStore = db.createObjectStore('savedVideos', {
            keyPath: 'videoId',
          })
          savedStore.createIndex('by-savedAt', 'savedAt')
        }

        // Preferences store
        if (!db.objectStoreNames.contains('preferences')) {
          db.createObjectStore('preferences')
        }

        // Action queue store
        if (!db.objectStoreNames.contains('actionQueue')) {
          const queueStore = db.createObjectStore('actionQueue', { keyPath: 'id' })
          queueStore.createIndex('by-createdAt', 'createdAt')
        }
      },
    })
  }

  return dbPromise
}

/**
 * Close database connection
 */
export async function closeDB(): Promise<void> {
  if (dbPromise) {
    const db = await dbPromise
    db.close()
    dbPromise = null
  }
}

/**
 * Delete the entire database
 */
export async function deleteDB(): Promise<void> {
  if (typeof window === 'undefined') return

  await closeDB()

  return new Promise((resolve, reject) => {
    const request = indexedDB.deleteDatabase(DB_NAME)
    request.onerror = () => reject(request.error)
    request.onsuccess = () => resolve()
  })
}

/**
 * Get database storage usage
 */
export async function getStorageUsage(): Promise<{
  used: number
  quota: number
  percentage: number
}> {
  if (typeof navigator === 'undefined' || !navigator.storage?.estimate) {
    return { used: 0, quota: 0, percentage: 0 }
  }

  const estimate = await navigator.storage.estimate()
  const used = estimate.usage || 0
  const quota = estimate.quota || 0
  const percentage = quota > 0 ? (used / quota) * 100 : 0

  return { used, quota, percentage }
}

