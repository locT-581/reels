/**
 * Memory Manager - Control memory usage for video feed
 * 
 * Limits:
 * - Max 5 videos in DOM
 * - Max 3 videos with decoded frames
 * - Total memory cap 150MB
 */

import { MEMORY_CONFIG } from '@vortex/core'

export interface MemoryState {
  videosInDom: number
  decodedVideos: number
  estimatedMemoryMB: number
  isLowMemory: boolean
}

export interface VideoMemoryEntry {
  videoId: string
  inDom: boolean
  hasDecodedFrames: boolean
  estimatedSizeMB: number
  lastAccessed: number
}

class MemoryManager {
  private entries: Map<string, VideoMemoryEntry> = new Map()
  private listeners: Set<(state: MemoryState) => void> = new Set()
  private memoryWarningThreshold: number

  constructor() {
    // Convert bytes to MB for threshold (150MB default)
    this.memoryWarningThreshold = MEMORY_CONFIG?.MAX_TOTAL_MEMORY ? MEMORY_CONFIG.MAX_TOTAL_MEMORY / (1024 * 1024) : 150
    this.setupMemoryPressureListener()
  }

  /**
   * Register a video
   */
  register(videoId: string, estimatedSizeMB: number = 10): void {
    this.entries.set(videoId, {
      videoId,
      inDom: false,
      hasDecodedFrames: false,
      estimatedSizeMB,
      lastAccessed: Date.now(),
    })
    this.notifyListeners()
  }

  /**
   * Unregister a video
   */
  unregister(videoId: string): void {
    this.entries.delete(videoId)
    this.notifyListeners()
  }

  /**
   * Mark video as in DOM
   */
  setInDom(videoId: string, inDom: boolean): void {
    const entry = this.entries.get(videoId)
    if (entry) {
      entry.inDom = inDom
      entry.lastAccessed = Date.now()
      this.notifyListeners()
    }
  }

  /**
   * Mark video as having decoded frames
   */
  setHasDecodedFrames(videoId: string, hasFrames: boolean): void {
    const entry = this.entries.get(videoId)
    if (entry) {
      entry.hasDecodedFrames = hasFrames
      entry.lastAccessed = Date.now()
      this.notifyListeners()
    }
  }

  /**
   * Get current memory state
   */
  getState(): MemoryState {
    let videosInDom = 0
    let decodedVideos = 0
    let estimatedMemoryMB = 0

    this.entries.forEach((entry) => {
      if (entry.inDom) videosInDom++
      if (entry.hasDecodedFrames) decodedVideos++
      estimatedMemoryMB += entry.estimatedSizeMB
    })

    return {
      videosInDom,
      decodedVideos,
      estimatedMemoryMB,
      isLowMemory: estimatedMemoryMB > this.memoryWarningThreshold,
    }
  }

  /**
   * Get videos that should be disposed (LRU)
   */
  getVideosToDispose(): string[] {
    const state = this.getState()
    const toDispose: string[] = []
    const maxInDom = MEMORY_CONFIG?.MAX_VIDEOS_IN_DOM ?? 5
    const maxDecoded = MEMORY_CONFIG?.MAX_DECODED_FRAMES ?? 3

    // Sort by last accessed (oldest first)
    const sortedEntries = Array.from(this.entries.values()).sort(
      (a, b) => a.lastAccessed - b.lastAccessed
    )

    // Check if we need to dispose videos in DOM
    if (state.videosInDom > maxInDom) {
      const toRemove = state.videosInDom - maxInDom
      let removed = 0

      for (const entry of sortedEntries) {
        if (removed >= toRemove) break
        if (entry.inDom) {
          toDispose.push(entry.videoId)
          removed++
        }
      }
    }

    // Check if we need to dispose decoded videos
    if (state.decodedVideos > maxDecoded) {
      const toRemove = state.decodedVideos - maxDecoded
      let removed = 0

      for (const entry of sortedEntries) {
        if (removed >= toRemove) break
        if (entry.hasDecodedFrames && !toDispose.includes(entry.videoId)) {
          toDispose.push(entry.videoId)
          removed++
        }
      }
    }

    return toDispose
  }

  /**
   * Subscribe to memory state changes
   */
  subscribe(listener: (state: MemoryState) => void): () => void {
    this.listeners.add(listener)
    return () => this.listeners.delete(listener)
  }

  /**
   * Force cleanup
   */
  forceCleanup(): string[] {
    const toDispose = this.getVideosToDispose()
    toDispose.forEach((id) => this.unregister(id))
    return toDispose
  }

  private notifyListeners(): void {
    const state = this.getState()
    this.listeners.forEach((listener) => listener(state))
  }

  private setupMemoryPressureListener(): void {
    if (typeof window === 'undefined') return

    // Listen for memory pressure events (if available)
    if ('memory' in performance) {
      // Periodic memory check
      setInterval(() => {
        const state = this.getState()
        if (state.isLowMemory) {
          console.warn('[MemoryManager] Low memory warning, forcing cleanup')
          this.forceCleanup()
        }
      }, 5000)
    }
  }
}

// Singleton instance
export const memoryManager = new MemoryManager()

export default memoryManager

