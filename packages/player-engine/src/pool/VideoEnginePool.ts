/**
 * VideoEnginePool - High-performance video preloading and playback pool
 *
 * Core concept: Pre-initialize HLS engine instances for adjacent videos
 * so that when user swipes, the next video is ALREADY ready with first frame decoded.
 *
 * This eliminates the "thumbnail → black screen → first frame → playing" sequence
 * by ensuring videos are pre-buffered and decoded before they become visible.
 *
 * Architecture:
 * ┌─────────────────────────────────────────────────────────────────────────────┐
 * │                        VIDEO ENGINE POOL MANAGER                            │
 * │  ┌─────────────┐   ┌─────────────┐   ┌─────────────┐   ┌─────────────┐     │
 * │  │ Slot: N-1   │   │ Slot: N     │   │ Slot: N+1   │   │ Slot: N+2   │     │
 * │  │ PAUSED      │   │ PLAYING     │   │ PRELOADED   │   │ PRELOADING  │     │
 * │  │ decoded ✓   │   │ playing ✓   │   │ decoded ✓   │   │ loading...  │     │
 * │  └─────────────┘   └─────────────┘   └─────────────┘   └─────────────┘     │
 * └─────────────────────────────────────────────────────────────────────────────┘
 */

import Hls, { Events, ErrorTypes } from 'hls.js'
import { HLS_CONFIG } from '../config'
import { detectPlatform, getPlatformConfig, type PlatformInfo, type PlatformConfig } from '../utils/platform'

// =============================================================================
// TYPES
// =============================================================================

export type SlotState =
  | 'idle'           // Slot created, no video loaded
  | 'initializing'   // Video element created, starting to load
  | 'loading'        // HLS manifest loading, segments fetching
  | 'preloaded'      // First frame decoded, ready for instant playback
  | 'active'         // Currently playing
  | 'paused'         // Paused but ready to resume instantly
  | 'error'          // Error occurred
  | 'disposed'       // Cleaned up

export interface EngineSlot {
  /** Unique slot ID */
  id: string
  /** Video ID from your data */
  videoId: string
  /** Video URL (HLS manifest) */
  videoUrl: string
  /** Video element (reused from pool) */
  element: HTMLVideoElement
  /** HLS.js instance (null for native HLS) */
  hls: Hls | null
  /** Current state */
  state: SlotState
  /** Promise that resolves when first frame is decoded */
  readyPromise: Promise<void>
  /** Resolve function for readyPromise */
  resolveReady: () => void
  /** Reject function for readyPromise */
  rejectReady: (error: Error) => void
  /** Timestamp when slot was created */
  createdAt: number
  /** Timestamp when last active */
  lastActiveAt: number
  /** Whether using native HLS (Safari) */
  isNative: boolean
  /** Error if any */
  error?: Error
}

export interface VideoEnginePoolOptions {
  /** Platform-specific config override */
  config?: Partial<PlatformConfig>
  /** Force HLS.js even when native is available */
  forceHLSJS?: boolean
  /** Callback when slot state changes */
  onSlotStateChange?: (slot: EngineSlot, prevState: SlotState) => void
  /** Callback when error occurs */
  onError?: (slot: EngineSlot, error: Error) => void
  /** Callback when first frame is ready */
  onFirstFrameReady?: (slot: EngineSlot) => void
}

export interface PrepareOptions {
  /** Priority level affects buffer target */
  priority?: 'high' | 'medium' | 'low'
  /** Override initial quality level */
  startLevel?: number
  /** Timeout for first frame decode (ms) */
  timeout?: number
}

// =============================================================================
// VIDEO ENGINE POOL
// =============================================================================

export class VideoEnginePool {
  private slots = new Map<string, EngineSlot>()
  private elementPool: HTMLVideoElement[] = []
  private platform: PlatformInfo
  private config: PlatformConfig
  private options: VideoEnginePoolOptions
  private isDestroyed = false
  private visibilityHandler: (() => void) | null = null
  private isSSR = false

  constructor(options: VideoEnginePoolOptions = {}) {
    this.options = options

    // Check for SSR environment
    this.isSSR = typeof document === 'undefined' || typeof window === 'undefined'

    if (this.isSSR) {
      // SSR-safe defaults
      this.platform = {
        os: 'unknown',
        browser: 'unknown',
        isWebView: false,
        hasNativeHLS: false,
        shouldUseHLSJS: true,
        deviceMemory: null,
        hardwareConcurrency: 4,
        isLowEndDevice: false,
        browserVersion: null,
      }
      this.config = {
        maxSlots: 5,
        preloadBufferTarget: 5,
        activeBufferTarget: 30,
        maxBufferSize: 30 * 1000 * 1000,
        enableWorker: true,
        startLevel: -1,
        abrBandwidthEstimate: 500000,
      }
      console.log('[VideoEnginePool] SSR mode - skipping initialization')
      return
    }

    this.platform = detectPlatform()
    this.config = {
      ...getPlatformConfig(this.platform),
      ...options.config,
    }

    // Override shouldUseHLSJS if forced
    if (options.forceHLSJS) {
      this.platform.shouldUseHLSJS = true
    }

    // Initialize element pool
    this.initializeElementPool()

    // Setup visibility change handler for memory management
    this.setupVisibilityHandler()

    console.log('[VideoEnginePool] Initialized', {
      platform: `${this.platform.os} ${this.platform.browser}${this.platform.isWebView ? ' WebView' : ''}`,
      useHLSJS: this.platform.shouldUseHLSJS,
      config: this.config,
    })
  }

  // ===========================================================================
  // PUBLIC API
  // ===========================================================================

  /**
   * Prepare a video for playback
   * This is the KEY method - call it BEFORE the video becomes visible
   *
   * @param videoId - Unique video identifier
   * @param url - HLS manifest URL
   * @param options - Preparation options
   * @returns Promise that resolves when first frame is ready
   */
  async prepare(
    videoId: string,
    url: string,
    options: PrepareOptions = {}
  ): Promise<EngineSlot> {
    if (this.isSSR) {
      throw new Error('[VideoEnginePool] Cannot prepare in SSR environment')
    }
    if (this.isDestroyed) {
      throw new Error('[VideoEnginePool] Pool is destroyed')
    }

    // Check if already exists
    const existing = this.slots.get(videoId)
    if (existing && existing.state !== 'disposed' && existing.state !== 'error') {
      // If already ready or loading, just return
      if (existing.state === 'preloaded' || existing.state === 'active' || existing.state === 'paused') {
        return existing
      }
      // Wait for it to be ready
      await existing.readyPromise
      return existing
    }

    // Evict oldest if at capacity
    this.evictIfNeeded()

    // Create new slot
    const slot = this.createSlot(videoId, url)
    this.slots.set(videoId, slot)

    // Start loading
    await this.loadSlot(slot, options)

    return slot
  }

  /**
   * Activate a video for playback
   * Call when video becomes the current visible video
   */
  async activate(videoId: string): Promise<void> {
    if (this.isSSR) return

    const slot = this.slots.get(videoId)
    if (!slot) {
      console.warn('[VideoEnginePool] Cannot activate: slot not found', videoId)
      return
    }

    if (slot.state === 'disposed' || slot.state === 'error') {
      console.warn('[VideoEnginePool] Cannot activate: slot in bad state', videoId, slot.state)
      return
    }

    // Wait for ready if still loading
    if (slot.state === 'initializing' || slot.state === 'loading') {
      try {
        await slot.readyPromise
      } catch (err) {
        console.error('[VideoEnginePool] Slot failed to become ready', videoId, err)
        return
      }
    }

    // Play
    try {
      this.setSlotState(slot, 'active')
      slot.element.muted = true // Ensure muted for autoplay
      await slot.element.play()
      slot.lastActiveAt = Date.now()
    } catch (err) {
      console.warn('[VideoEnginePool] Play failed', videoId, err)
      // Autoplay blocked - this is expected, user needs to interact
    }
  }

  /**
   * Deactivate a video (pause but keep ready)
   */
  deactivate(videoId: string): void {
    if (this.isSSR) return

    const slot = this.slots.get(videoId)
    if (!slot || slot.state === 'disposed') return

    if (slot.state === 'active') {
      slot.element.pause()
      this.setSlotState(slot, 'paused')
    }
  }

  /**
   * Get video element for a slot
   * Used to attach to DOM for rendering
   */
  getElement(videoId: string): HTMLVideoElement | null {
    return this.slots.get(videoId)?.element ?? null
  }

  /**
   * Check if video is ready for instant playback
   */
  isReady(videoId: string): boolean {
    const slot = this.slots.get(videoId)
    if (!slot) return false
    return slot.state === 'preloaded' || slot.state === 'active' || slot.state === 'paused'
  }

  /**
   * Get current state of a slot
   */
  getState(videoId: string): SlotState | null {
    return this.slots.get(videoId)?.state ?? null
  }

  /**
   * Dispose a specific video
   */
  dispose(videoId: string): void {
    const slot = this.slots.get(videoId)
    if (!slot) return

    this.disposeSlot(slot)
    this.slots.delete(videoId)
  }

  /**
   * Orchestrate pool based on current feed position
   * Call this whenever the current video index changes
   *
   * @param currentIndex - Current video index in feed
   * @param videos - Array of video data (id, url, thumbnail)
   */
  orchestrate(
    currentIndex: number,
    videos: Array<{ id: string; url: string }>
  ): void {
    if (this.isSSR || this.isDestroyed || videos.length === 0) return

    const current = videos[currentIndex]
    const prev = videos[currentIndex - 1]
    const next = videos[currentIndex + 1]
    const nextNext = videos[currentIndex + 2]

    // Priority order for preparation:
    // 1. Current (must be ready NOW)
    // 2. Next (high priority - user likely to swipe)
    // 3. Prev (medium priority - for swipe back)
    // 4. Next+1 (low priority - prefetch)

    type VideoItem = { id: string; url: string }
    const preparationQueue: Array<{ video: VideoItem; priority: PrepareOptions['priority'] }> = []

    if (current) {
      preparationQueue.push({ video: current, priority: 'high' })
    }
    if (next) {
      preparationQueue.push({ video: next, priority: 'high' })
    }
    if (prev) {
      preparationQueue.push({ video: prev, priority: 'medium' })
    }
    if (nextNext) {
      preparationQueue.push({ video: nextNext, priority: 'low' })
    }

    // Prepare all in parallel
    for (const item of preparationQueue) {
      this.prepare(item.video.id, item.video.url, { priority: item.priority }).catch((err) => {
        console.warn('[VideoEnginePool] Orchestration prepare failed', item.video.id, err)
      })
    }

    // Activate current
    if (current) {
      this.activate(current.id)
    }

    // Deactivate all except current
    for (const [id, slot] of this.slots) {
      if (id !== current?.id && slot.state === 'active') {
        this.deactivate(id)
      }
    }

    // Dispose videos outside the window
    for (const [id, slot] of this.slots) {
      const idx = videos.findIndex(v => v.id === id)
      const distance = idx === -1 ? Infinity : Math.abs(idx - currentIndex)

      if (distance > 3 && slot.state !== 'active') {
        this.dispose(id)
      }
    }
  }

  /**
   * Pause all videos (for background/memory pressure)
   */
  pauseAll(): void {
    for (const slot of this.slots.values()) {
      if (slot.state === 'active') {
        slot.element.pause()
        this.setSlotState(slot, 'paused')
      }
    }
  }

  /**
   * Reduce memory usage (dispose non-active slots)
   */
  reduceMemory(): void {
    const now = Date.now()
    const staleThreshold = 30000 // 30 seconds

    for (const [id, slot] of this.slots) {
      // Keep active and recently active slots
      if (slot.state === 'active') continue
      if (now - slot.lastActiveAt < staleThreshold) continue

      this.dispose(id)
    }
  }

  /**
   * Get pool statistics
   */
  getStats(): {
    totalSlots: number
    activeSlots: number
    preloadedSlots: number
    loadingSlots: number
    elementPoolSize: number
  } {
    let activeSlots = 0
    let preloadedSlots = 0
    let loadingSlots = 0

    for (const slot of this.slots.values()) {
      if (slot.state === 'active') activeSlots++
      if (slot.state === 'preloaded' || slot.state === 'paused') preloadedSlots++
      if (slot.state === 'loading' || slot.state === 'initializing') loadingSlots++
    }

    return {
      totalSlots: this.slots.size,
      activeSlots,
      preloadedSlots,
      loadingSlots,
      elementPoolSize: this.elementPool.length,
    }
  }

  /**
   * Destroy the pool and cleanup all resources
   */
  destroy(): void {
    this.isDestroyed = true

    // Cleanup visibility handler
    if (this.visibilityHandler) {
      document.removeEventListener('visibilitychange', this.visibilityHandler)
      this.visibilityHandler = null
    }

    // Dispose all slots
    for (const slot of this.slots.values()) {
      this.disposeSlot(slot)
    }
    this.slots.clear()

    // Clear element pool
    this.elementPool = []

    console.log('[VideoEnginePool] Destroyed')
  }

  // ===========================================================================
  // PRIVATE METHODS
  // ===========================================================================

  private initializeElementPool(): void {
    // Pre-create video elements for instant availability
    for (let i = 0; i < this.config.maxSlots; i++) {
      const element = this.createVideoElement()
      this.elementPool.push(element)
    }
  }

  private createVideoElement(): HTMLVideoElement {
    const element = document.createElement('video')
    element.playsInline = true
    element.muted = true
    element.preload = 'auto'
    element.setAttribute('playsinline', '') // iOS
    element.setAttribute('webkit-playsinline', '') // Older iOS
    element.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      object-fit: cover;
      background: transparent;
    `
    return element
  }

  private acquireElement(): HTMLVideoElement {
    return this.elementPool.pop() || this.createVideoElement()
  }

  private releaseElement(element: HTMLVideoElement): void {
    // Reset element state
    element.pause()
    element.removeAttribute('src')
    element.load() // Reset internal state
    element.currentTime = 0
    element.style.opacity = '1'

    // Return to pool
    this.elementPool.push(element)
  }

  private createSlot(videoId: string, url: string): EngineSlot {
    let resolveReady!: () => void
    let rejectReady!: (error: Error) => void

    const readyPromise = new Promise<void>((resolve, reject) => {
      resolveReady = resolve
      rejectReady = reject
    })

    const element = this.acquireElement()
    const useNative = !this.platform.shouldUseHLSJS && this.platform.hasNativeHLS

    return {
      id: videoId,
      videoId,
      videoUrl: url,
      element,
      hls: null,
      state: 'idle',
      readyPromise,
      resolveReady,
      rejectReady,
      createdAt: Date.now(),
      lastActiveAt: Date.now(),
      isNative: useNative,
    }
  }

  private async loadSlot(slot: EngineSlot, options: PrepareOptions): Promise<void> {
    this.setSlotState(slot, 'initializing')

    const timeout = options.timeout ?? 10000 // 10 seconds default
    const bufferTarget = this.getBufferTargetForPriority(options.priority)

    try {
      if (slot.isNative) {
        await this.loadNative(slot, timeout)
      } else {
        await this.loadHLS(slot, bufferTarget, options.startLevel, timeout)
      }
    } catch (err) {
      slot.error = err as Error
      this.setSlotState(slot, 'error')
      slot.rejectReady(err as Error)
      this.options.onError?.(slot, err as Error)
      throw err
    }
  }

  private async loadNative(slot: EngineSlot, timeout: number): Promise<void> {
    const { element, videoUrl } = slot

    return new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        cleanup()
        reject(new Error('Native HLS load timeout'))
      }, timeout)

      const cleanup = () => {
        clearTimeout(timeoutId)
        element.removeEventListener('canplay', onCanPlay)
        element.removeEventListener('error', onError)
      }

      const onCanPlay = () => {
        cleanup()
        this.setSlotState(slot, 'loading')

        // Decode first frame by seeking
        this.decodeFirstFrame(slot)
          .then(() => {
            this.setSlotState(slot, 'preloaded')
            slot.resolveReady()
            this.options.onFirstFrameReady?.(slot)
            resolve()
          })
          .catch(reject)
      }

      const onError = () => {
        cleanup()
        reject(new Error(`Native video load error: ${element.error?.message || 'unknown'}`))
      }

      element.addEventListener('canplay', onCanPlay, { once: true })
      element.addEventListener('error', onError, { once: true })

      // Set source and start loading
      element.src = videoUrl
      element.load()
    })
  }

  private async loadHLS(
    slot: EngineSlot,
    bufferTarget: number,
    startLevel?: number,
    timeout?: number
  ): Promise<void> {
    const { element, videoUrl } = slot

    // Check HLS.js support
    if (!Hls.isSupported()) {
      throw new Error('HLS.js is not supported in this browser')
    }

    return new Promise<void>((resolve, reject) => {
      const timeoutId = setTimeout(() => {
        reject(new Error('HLS load timeout'))
      }, timeout || 10000)

      // Create HLS.js instance with optimized config
      const hls = new Hls({
        ...HLS_CONFIG,
        maxBufferLength: bufferTarget,
        maxMaxBufferLength: bufferTarget + 10,
        maxBufferSize: this.config.maxBufferSize,
        startLevel: startLevel ?? this.config.startLevel,
        enableWorker: this.config.enableWorker,
        abrEwmaDefaultEstimate: this.config.abrBandwidthEstimate,
        // Optimize for fast start
        startFragPrefetch: true,
        testBandwidth: false, // Use initial estimate for faster start
      })

      slot.hls = hls

      const cleanup = () => {
        clearTimeout(timeoutId)
      }

      // Wait for first fragment to be buffered
      const onFragBuffered = () => {
        this.setSlotState(slot, 'loading')

        // Now decode first frame
        this.decodeFirstFrame(slot)
          .then(() => {
            cleanup()
            this.setSlotState(slot, 'preloaded')
            slot.resolveReady()
            this.options.onFirstFrameReady?.(slot)
            resolve()
          })
          .catch((err) => {
            cleanup()
            reject(err)
          })

        // Remove this listener after first fragment
        hls.off(Events.FRAG_BUFFERED, onFragBuffered)
      }

      const onError = (_event: unknown, data: { fatal: boolean; type: string; details: string }) => {
        if (data.fatal) {
          cleanup()

          let recovered = false

          switch (data.type) {
            case ErrorTypes.NETWORK_ERROR:
              console.warn('[VideoEnginePool] Network error, attempting recovery')
              hls.startLoad()
              recovered = true
              break
            case ErrorTypes.MEDIA_ERROR:
              console.warn('[VideoEnginePool] Media error, attempting recovery')
              hls.recoverMediaError()
              recovered = true
              break
          }

          if (!recovered) {
            reject(new Error(`HLS fatal error: ${data.details}`))
          }
        }
      }

      hls.on(Events.FRAG_BUFFERED, onFragBuffered)
      hls.on(Events.ERROR, onError)

      // Attach and load
      hls.attachMedia(element)
      hls.loadSource(videoUrl)
    })
  }

  /**
   * Decode first frame by playing briefly then pausing
   * This ensures the video decoder has processed at least one frame
   */
  private async decodeFirstFrame(slot: EngineSlot): Promise<void> {
    const { element } = slot

    return new Promise<void>((resolve, reject) => {
      const timeout = setTimeout(() => {
        cleanup()
        reject(new Error('First frame decode timeout'))
      }, 5000)

      const cleanup = () => {
        clearTimeout(timeout)
        element.removeEventListener('playing', onPlaying)
        element.removeEventListener('error', onError)
      }

      const onPlaying = () => {
        // First frame is now decoded and rendered
        element.pause()
        element.currentTime = 0.01 // Small seek to ensure frame is painted
        cleanup()
        resolve()
      }

      const onError = () => {
        cleanup()
        reject(new Error('Video decode error'))
      }

      element.addEventListener('playing', onPlaying, { once: true })
      element.addEventListener('error', onError, { once: true })

      // Ensure muted for autoplay
      element.muted = true

      // Try to play to trigger decode
      element.play().catch(() => {
        // Play promise rejected - check if we have enough data
        if (element.readyState >= 2) { // HAVE_CURRENT_DATA
          // We have data, just pause and resolve
          element.pause()
          cleanup()
          resolve()
        }
        // Otherwise wait for playing event
      })
    })
  }

  private disposeSlot(slot: EngineSlot): void {
    // Destroy HLS.js instance
    if (slot.hls) {
      slot.hls.destroy()
      slot.hls = null
    }

    // Pause and reset video
    slot.element.pause()

    // Release element back to pool
    this.releaseElement(slot.element)

    // Update state
    this.setSlotState(slot, 'disposed')
  }

  private setSlotState(slot: EngineSlot, newState: SlotState): void {
    const prevState = slot.state
    if (prevState === newState) return

    slot.state = newState
    this.options.onSlotStateChange?.(slot, prevState)
  }

  private getBufferTargetForPriority(priority?: PrepareOptions['priority']): number {
    switch (priority) {
      case 'high':
        return this.config.preloadBufferTarget
      case 'medium':
        return Math.floor(this.config.preloadBufferTarget * 0.6)
      case 'low':
        return 2 // Just enough for first segment
      default:
        return this.config.preloadBufferTarget
    }
  }

  private evictIfNeeded(): void {
    if (this.slots.size < this.config.maxSlots) return

    // Find oldest non-active slot to evict
    let oldest: EngineSlot | null = null
    let oldestTime = Infinity

    for (const slot of this.slots.values()) {
      if (slot.state === 'active') continue // Never evict active
      if (slot.lastActiveAt < oldestTime) {
        oldestTime = slot.lastActiveAt
        oldest = slot
      }
    }

    if (oldest) {
      console.log('[VideoEnginePool] Evicting oldest slot', oldest.videoId)
      this.dispose(oldest.videoId)
    }
  }

  private setupVisibilityHandler(): void {
    if (typeof document === 'undefined') return

    this.visibilityHandler = () => {
      if (document.hidden) {
        // App went to background - pause all and reduce memory
        this.pauseAll()
        this.reduceMemory()
      }
    }

    document.addEventListener('visibilitychange', this.visibilityHandler)
  }
}

/**
 * Factory function to create a VideoEnginePool
 */
export function createVideoEnginePool(options?: VideoEnginePoolOptions): VideoEnginePool {
  return new VideoEnginePool(options)
}

