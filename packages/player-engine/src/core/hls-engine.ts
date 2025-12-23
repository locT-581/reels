/**
 * HLS Engine - HLS.js wrapper for video playback
 * Optimized for mobile with error recovery
 */

import Hls, { type HlsConfig, Events, ErrorTypes } from 'hls.js'
import { HLS_CONFIG } from '../config'
import type { PlayerState, QualityLevel } from '@vortex/types'

export interface HLSEngineCallbacks {
  onStateChange?: (state: PlayerState) => void
  onError?: (error: Error, recoverable: boolean) => void
  onQualityChange?: (level: number, auto: boolean) => void
  onQualityLevelsLoaded?: (levels: QualityLevel[]) => void
  onBandwidthUpdate?: (bandwidth: number) => void
}

export interface HLSEngineOptions {
  config?: Partial<HlsConfig>
  callbacks?: HLSEngineCallbacks
}

export class HLSEngine {
  private hls: Hls | null = null
  private video: HTMLVideoElement | null = null
  private options: HLSEngineOptions
  private retryCount: number = 0
  private maxRetries: number = 3

  constructor(options: HLSEngineOptions = {}) {
    this.options = options
  }

  /**
   * Check if HLS.js is supported
   */
  static isSupported(): boolean {
    return Hls.isSupported()
  }

  /**
   * Attach to a video element and load a source
   */
  attach(video: HTMLVideoElement, url: string): void {
    this.destroy()
    this.video = video
    this.retryCount = 0

    if (!HLSEngine.isSupported()) {
      this.options.callbacks?.onError?.(
        new Error('HLS.js is not supported in this browser'),
        false
      )
      return
    }

    this.options.callbacks?.onStateChange?.('loading')

    this.hls = new Hls({
      ...HLS_CONFIG,
      ...this.options.config,
    })

    this.setupHLSListeners()
    this.setupVideoListeners()
    this.hls.attachMedia(video)
    this.hls.loadSource(url)
  }

  /**
   * Load a new source (without recreating HLS instance)
   */
  loadSource(url: string): void {
    if (!this.hls || !this.video) {
      throw new Error('HLS engine not attached to video element')
    }

    this.retryCount = 0
    this.options.callbacks?.onStateChange?.('loading')
    this.hls.loadSource(url)
  }

  /**
   * Destroy the HLS instance and cleanup
   */
  destroy(): void {
    if (this.video) {
      this.removeVideoListeners()
      this.video = null
    }

    if (this.hls) {
      this.hls.destroy()
      this.hls = null
    }
  }

  /**
   * Get available quality levels
   */
  getQualityLevels(): QualityLevel[] {
    if (!this.hls) return []

    return this.hls.levels.map((level) => ({
      label: `${level.height}p`,
      height: level.height,
      bitrate: level.bitrate,
    }))
  }

  /**
   * Set quality level (-1 for auto)
   */
  setQuality(level: number): void {
    if (this.hls) {
      this.hls.currentLevel = level
    }
  }

  /**
   * Get current quality level
   */
  getCurrentQuality(): number {
    return this.hls?.currentLevel ?? -1
  }

  /**
   * Get current bandwidth estimate (bps)
   */
  getBandwidth(): number {
    return this.hls?.bandwidthEstimate ?? 0
  }

  /**
   * Check if auto quality is enabled
   */
  isAutoQuality(): boolean {
    return this.hls?.autoLevelEnabled ?? true
  }

  /**
   * Force start loading
   */
  startLoad(startPosition?: number): void {
    this.hls?.startLoad(startPosition)
  }

  /**
   * Stop loading
   */
  stopLoad(): void {
    this.hls?.stopLoad()
  }

  private setupHLSListeners(): void {
    if (!this.hls) return

    // Manifest loaded - quality levels available
    this.hls.on(Events.MANIFEST_PARSED, (_event, _data) => {
      const levels = this.getQualityLevels()
      this.options.callbacks?.onQualityLevelsLoaded?.(levels)
      this.options.callbacks?.onStateChange?.('ready')

      // Auto-play if video element allows
      if (this.video?.autoplay) {
        this.video.play().catch(() => {
          // Autoplay blocked, stay in ready state
        })
      }
    })

    // Quality level switched
    this.hls.on(Events.LEVEL_SWITCHED, (_event, data) => {
      this.options.callbacks?.onQualityChange?.(
        data.level,
        this.isAutoQuality()
      )
    })

    // Bandwidth update
    this.hls.on(Events.FRAG_LOADED, () => {
      this.options.callbacks?.onBandwidthUpdate?.(this.getBandwidth())
    })

    // Error handling
    this.hls.on(Events.ERROR, (_event, data) => {
      this.handleError(data)
    })
  }

  private setupVideoListeners(): void {
    if (!this.video) return

    this.video.addEventListener('playing', this.handlePlaying)
    this.video.addEventListener('pause', this.handlePause)
    this.video.addEventListener('waiting', this.handleWaiting)
    this.video.addEventListener('ended', this.handleEnded)
    this.video.addEventListener('canplay', this.handleCanPlay)
    this.video.addEventListener('error', this.handleVideoError)
  }

  private removeVideoListeners(): void {
    if (!this.video) return

    this.video.removeEventListener('playing', this.handlePlaying)
    this.video.removeEventListener('pause', this.handlePause)
    this.video.removeEventListener('waiting', this.handleWaiting)
    this.video.removeEventListener('ended', this.handleEnded)
    this.video.removeEventListener('canplay', this.handleCanPlay)
    this.video.removeEventListener('error', this.handleVideoError)
  }

  private handlePlaying = (): void => {
    this.options.callbacks?.onStateChange?.('playing')
  }

  private handlePause = (): void => {
    this.options.callbacks?.onStateChange?.('paused')
  }

  private handleWaiting = (): void => {
    this.options.callbacks?.onStateChange?.('buffering')
  }

  private handleEnded = (): void => {
    this.options.callbacks?.onStateChange?.('ended')
  }

  private handleCanPlay = (): void => {
    if (this.video?.paused) {
      this.options.callbacks?.onStateChange?.('ready')
    }
  }

  private handleVideoError = (): void => {
    const error = this.video?.error
    this.options.callbacks?.onError?.(
      new Error(error?.message ?? 'Video playback error'),
      false
    )
    this.options.callbacks?.onStateChange?.('error')
  }

  private handleError(data: { fatal: boolean; type: string; details: string }): void {
    if (data.fatal) {
      let recovered = false

      switch (data.type) {
        case ErrorTypes.NETWORK_ERROR:
          // Try to recover from network error
          if (this.retryCount < this.maxRetries) {
            this.retryCount++
            console.warn(`[HLSEngine] Network error, retry ${this.retryCount}/${this.maxRetries}`)
            this.hls?.startLoad()
            recovered = true
          }
          break

        case ErrorTypes.MEDIA_ERROR:
          // Try to recover from media error
          console.warn('[HLSEngine] Media error, attempting recovery')
          this.hls?.recoverMediaError()
          recovered = true
          break

        default:
          // Cannot recover
          break
      }

      if (!recovered) {
        this.options.callbacks?.onError?.(
          new Error(`HLS fatal error: ${data.details}`),
          false
        )
        this.options.callbacks?.onStateChange?.('error')
        this.destroy()
      } else {
        this.options.callbacks?.onError?.(
          new Error(`HLS error (recovering): ${data.details}`),
          true
        )
      }
    } else {
      // Non-fatal error, log but don't crash
      console.warn('[HLSEngine] Non-fatal error:', data.details)
    }
  }
}

