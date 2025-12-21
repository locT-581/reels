/**
 * Cache Manager - Multi-layer caching strategy
 * 
 * L1: Memory (Map) - fastest, limited size
 * L2: IndexedDB - larger, persistent
 */

import { getDB } from './db'
import type { Video } from '../types'

// ============================================
// Types
// ============================================

export interface CacheConfig {
  /** Maximum L1 cache size */
  maxL1Size: number
  /** Maximum L2 cache size (bytes) */
  maxL2Size: number
  /** Default TTL in ms */
  defaultTTL: number
  /** Enable L2 (IndexedDB) caching */
  enableL2: boolean
}

export interface CacheEntry<T> {
  data: T
  cachedAt: number
  expiresAt: number
  size?: number
}

export interface CacheStats {
  l1Hits: number
  l1Misses: number
  l2Hits: number
  l2Misses: number
  l1Size: number
  l2Size: number
}

// ============================================
// Default Config
// ============================================

const DEFAULT_CONFIG: CacheConfig = {
  maxL1Size: 100,
  maxL2Size: 50 * 1024 * 1024, // 50MB
  defaultTTL: 1000 * 60 * 60, // 1 hour
  enableL2: true,
}

// ============================================
// Cache Manager Class
// ============================================

export class CacheManager {
  private l1Cache: Map<string, CacheEntry<unknown>> = new Map()
  private config: CacheConfig
  private stats: CacheStats = {
    l1Hits: 0,
    l1Misses: 0,
    l2Hits: 0,
    l2Misses: 0,
    l1Size: 0,
    l2Size: 0,
  }

  constructor(config: Partial<CacheConfig> = {}) {
    this.config = { ...DEFAULT_CONFIG, ...config }
  }

  /**
   * Get from cache (L1 then L2)
   */
  async get<T>(key: string): Promise<T | null> {
    // Try L1 first
    const l1Entry = this.l1Cache.get(key) as CacheEntry<T> | undefined
    if (l1Entry) {
      if (l1Entry.expiresAt > Date.now()) {
        this.stats.l1Hits++
        return l1Entry.data
      }
      // Expired, remove it
      this.l1Cache.delete(key)
    }
    this.stats.l1Misses++

    // Try L2 if enabled
    if (this.config.enableL2) {
      try {
        const db = await getDB()
        const l2Entry = await db.get('videos', key)
        if (l2Entry && l2Entry.expiresAt > Date.now()) {
          this.stats.l2Hits++
          // Promote to L1
          this.setL1(key, l2Entry.data as T, l2Entry.expiresAt - Date.now())
          return l2Entry.data as T
        }
        this.stats.l2Misses++
      } catch {
        // IndexedDB error, continue without L2
      }
    }

    return null
  }

  /**
   * Set in cache (both L1 and L2)
   */
  async set<T>(key: string, data: T, ttl?: number): Promise<void> {
    const actualTTL = ttl ?? this.config.defaultTTL

    // Set in L1
    this.setL1(key, data, actualTTL)

    // Set in L2 if enabled
    if (this.config.enableL2) {
      try {
        const db = await getDB()
        const now = Date.now()
        await db.put('videos', {
          id: key,
          data: data as Video,
          cachedAt: now,
          expiresAt: now + actualTTL,
        })
      } catch {
        // IndexedDB error, L1 only
      }
    }
  }

  /**
   * Delete from cache
   */
  async delete(key: string): Promise<void> {
    this.l1Cache.delete(key)

    if (this.config.enableL2) {
      try {
        const db = await getDB()
        await db.delete('videos', key)
      } catch {
        // Ignore errors
      }
    }
  }

  /**
   * Check if key exists in cache
   */
  async has(key: string): Promise<boolean> {
    const value = await this.get(key)
    return value !== null
  }

  /**
   * Clear all cache
   */
  async clear(): Promise<void> {
    this.l1Cache.clear()
    this.stats.l1Size = 0

    if (this.config.enableL2) {
      try {
        const db = await getDB()
        const tx = db.transaction('videos', 'readwrite')
        await tx.store.clear()
        await tx.done
      } catch {
        // Ignore errors
      }
    }
  }

  /**
   * Get cache statistics
   */
  getStats(): CacheStats {
    return {
      ...this.stats,
      l1Size: this.l1Cache.size,
    }
  }

  /**
   * Cleanup expired entries
   */
  async cleanup(): Promise<number> {
    let cleaned = 0
    const now = Date.now()

    // Cleanup L1
    for (const [key, entry] of this.l1Cache.entries()) {
      if (entry.expiresAt < now) {
        this.l1Cache.delete(key)
        cleaned++
      }
    }

    // Cleanup L2
    if (this.config.enableL2) {
      try {
        const db = await getDB()
        const tx = db.transaction('videos', 'readwrite')
        const index = tx.store.index('by-expiresAt')

        let cursor = await index.openCursor(IDBKeyRange.upperBound(now))
        while (cursor) {
          await cursor.delete()
          cleaned++
          cursor = await cursor.continue()
        }

        await tx.done
      } catch {
        // Ignore errors
      }
    }

    return cleaned
  }

  /**
   * Set in L1 cache with LRU eviction
   */
  private setL1<T>(key: string, data: T, ttl: number): void {
    // Evict if at capacity
    if (this.l1Cache.size >= this.config.maxL1Size) {
      // Remove oldest entry (first in map)
      const firstKey = this.l1Cache.keys().next().value
      if (firstKey) {
        this.l1Cache.delete(firstKey)
      }
    }

    const now = Date.now()
    this.l1Cache.set(key, {
      data,
      cachedAt: now,
      expiresAt: now + ttl,
    })

    this.stats.l1Size = this.l1Cache.size
  }
}

/**
 * Create a new cache manager instance
 */
export function createCacheManager(config?: Partial<CacheConfig>): CacheManager {
  return new CacheManager(config)
}

// Default global instance
let defaultCacheManager: CacheManager | null = null

/**
 * Get the default cache manager instance
 */
export function getDefaultCacheManager(): CacheManager {
  if (!defaultCacheManager) {
    defaultCacheManager = new CacheManager()
  }
  return defaultCacheManager
}

