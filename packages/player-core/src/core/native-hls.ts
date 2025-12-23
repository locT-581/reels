/**
 * Native HLS - Enhanced for iOS Safari
 *
 * Features:
 * - Quality estimation from video dimensions
 * - Better autoplay handling with fallbacks
 * - iOS fullscreen support (webkit prefixed)
 * - Playback rate support detection
 * - Bandwidth estimation from resource timing
 */

import type { PlayerState, QualityLevel } from '@vortex/core'
import type { PlayResult } from '../types/playback'
import { safePlay } from '../utils/safePlay'

export interface NativeHLSCallbacks {
  onStateChange?: (state: PlayerState) => void
  onError?: (error: Error, recoverable: boolean) => void
  onQualityLevelsLoaded?: (levels: QualityLevel[]) => void
  onQualityChange?: (level: QualityLevel) => void
  onBandwidthUpdate?: (bandwidth: number) => void
  onNeedsUserGesture?: () => void
}

export interface NativeHLSOptions {
  callbacks?: NativeHLSCallbacks
}

// Video element with webkit prefixed fullscreen APIs
interface WebkitVideoElement extends HTMLVideoElement {
  webkitEnterFullscreen?: () => Promise<void>
  webkitExitFullscreen?: () => Promise<void>
  webkitDisplayingFullscreen?: boolean
  webkitSupportsFullscreen?: boolean
}

// Supported playback rates on iOS
const IOS_SUPPORTED_RATES = [0.5, 1, 1.5, 2]

export class NativeHLS {
  private video: HTMLVideoElement | null = null
  private options: NativeHLSOptions
  private lastQuality: QualityLevel | null = null
  private bandwidthSamples: number[] = []

  constructor(options: NativeHLSOptions = {}) {
    this.options = options
  }

  /**
   * Check if native HLS is supported (iOS Safari, macOS Safari)
   */
  static isSupported(): boolean {
    if (typeof document === 'undefined') return false

    const video = document.createElement('video')
    return video.canPlayType('application/vnd.apple.mpegurl') !== ''
  }

  /**
   * Check if this is iOS
   */
  static isIOS(): boolean {
    if (typeof navigator === 'undefined') return false

    return (
      /iPad|iPhone|iPod/.test(navigator.userAgent) ||
      (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1)
    )
  }

  /**
   * Attach to a video element and load a source
   */
  attach(video: HTMLVideoElement, url: string): void {
    this.destroy()
    this.video = video

    this.options.callbacks?.onStateChange?.('loading')
    this.setupVideoListeners()

    // For native HLS, just set the src
    video.src = url
    video.load()
  }

  /**
   * Load a new source
   */
  loadSource(url: string): void {
    if (!this.video) {
      throw new Error('Native HLS not attached to video element')
    }

    this.options.callbacks?.onStateChange?.('loading')
    this.video.src = url
    this.video.load()
  }

  /**
   * Play with improved autoplay handling
   */
  async play(): Promise<PlayResult> {
    if (!this.video) {
      return { success: false, reason: 'unknown' }
    }

    return safePlay(this.video, {
      onNeedsUserGesture: this.options.callbacks?.onNeedsUserGesture,
    })
  }

  /**
   * Destroy and cleanup
   */
  destroy(): void {
    if (this.video) {
      this.removeVideoListeners()
      this.video.removeAttribute('src')
      this.video.load() // Reset
      this.video = null
    }
    this.bandwidthSamples = []
    this.lastQuality = null
  }

  /**
   * Get available quality levels
   * Note: Native HLS handles quality automatically, but we can estimate current quality
   */
  getQualityLevels(): QualityLevel[] {
    const estimatedQuality = this.estimateCurrentQuality()

    const levels: QualityLevel[] = [
      {
        label: 'Auto',
        height: 0,
        bitrate: 0,
      },
    ]

    if (estimatedQuality) {
      levels.push(estimatedQuality)
    }

    return levels
  }

  /**
   * Set quality level (not fully supported in native HLS)
   */
  setQuality(_level: number): void {
    // Native HLS handles quality automatically
    console.warn('[NativeHLS] Quality selection not supported, using auto')
  }

  /**
   * Get current quality level
   */
  getCurrentQuality(): number {
    return -1 // Always auto
  }

  /**
   * Estimate current quality from video dimensions
   */
  estimateCurrentQuality(): QualityLevel | null {
    if (!this.video || this.video.videoHeight === 0) return null

    const height = this.video.videoHeight
    const bitrate = this.estimateBitrate()

    return {
      label: `${height}p`,
      height,
      bitrate,
    }
  }

  /**
   * Estimate bitrate from resource timing
   */
  estimateBitrate(): number {
    // Return average of samples if available
    if (this.bandwidthSamples.length > 0) {
      const sum = this.bandwidthSamples.reduce((a, b) => a + b, 0)
      return Math.round(sum / this.bandwidthSamples.length)
    }

    // Fallback: estimate based on video dimensions
    if (!this.video) return 0

    const height = this.video.videoHeight
    // Rough estimates based on typical encoding
    if (height >= 1080) return 5000000 // 5 Mbps
    if (height >= 720) return 2500000 // 2.5 Mbps
    if (height >= 480) return 1000000 // 1 Mbps
    if (height >= 360) return 500000 // 500 Kbps
    return 250000 // 250 Kbps
  }

  /**
   * Get bandwidth estimate
   */
  getBandwidth(): number {
    return this.estimateBitrate()
  }

  /**
   * Check if auto quality
   */
  isAutoQuality(): boolean {
    return true // Native always uses auto
  }

  /**
   * Start loading
   */
  startLoad(): void {
    this.video?.load()
  }

  /**
   * Stop loading
   */
  stopLoad(): void {
    if (this.video) {
      this.video.preload = 'none'
    }
  }

  /**
   * Enter fullscreen (iOS webkit API)
   */
  async enterFullscreen(): Promise<void> {
    const video = this.video as WebkitVideoElement | null
    if (!video) return

    // Try standard API first
    if (video.requestFullscreen) {
      await video.requestFullscreen()
      return
    }

    // iOS webkit prefixed API
    if (video.webkitEnterFullscreen) {
      await video.webkitEnterFullscreen()
    }
  }

  /**
   * Exit fullscreen (iOS webkit API)
   */
  async exitFullscreen(): Promise<void> {
    const video = this.video as WebkitVideoElement | null
    if (!video) return

    // Try standard API first
    if (document.exitFullscreen) {
      await document.exitFullscreen()
      return
    }

    // iOS webkit prefixed API
    if (video.webkitExitFullscreen) {
      await video.webkitExitFullscreen()
    }
  }

  /**
   * Check if in fullscreen (iOS)
   */
  isFullscreen(): boolean {
    const video = this.video as WebkitVideoElement | null
    if (!video) return false

    // Standard API
    if (document.fullscreenElement) {
      return document.fullscreenElement === video
    }

    // iOS webkit
    return video.webkitDisplayingFullscreen ?? false
  }

  /**
   * Check if fullscreen is supported
   */
  isFullscreenSupported(): boolean {
    const video = this.video as WebkitVideoElement | null
    if (!video) return false

    return !!(video.requestFullscreen || video.webkitSupportsFullscreen)
  }

  /**
   * Check if playback rate is supported
   */
  isPlaybackRateSupported(rate: number): boolean {
    // iOS Safari has limited playback rate support
    if (NativeHLS.isIOS()) {
      return IOS_SUPPORTED_RATES.includes(rate)
    }

    // macOS Safari supports more rates
    return rate >= 0.5 && rate <= 2
  }

  /**
   * Get supported playback rates
   */
  getSupportedPlaybackRates(): number[] {
    if (NativeHLS.isIOS()) {
      return [...IOS_SUPPORTED_RATES]
    }

    return [0.5, 0.75, 1, 1.25, 1.5, 2]
  }

  // Private methods

  private setupVideoListeners(): void {
    if (!this.video) return

    this.video.addEventListener('loadedmetadata', this.handleLoadedMetadata)
    this.video.addEventListener('playing', this.handlePlaying)
    this.video.addEventListener('pause', this.handlePause)
    this.video.addEventListener('waiting', this.handleWaiting)
    this.video.addEventListener('ended', this.handleEnded)
    this.video.addEventListener('canplay', this.handleCanPlay)
    this.video.addEventListener('error', this.handleError)
    this.video.addEventListener('resize', this.handleResize)
    this.video.addEventListener('progress', this.handleProgress)
  }

  private removeVideoListeners(): void {
    if (!this.video) return

    this.video.removeEventListener('loadedmetadata', this.handleLoadedMetadata)
    this.video.removeEventListener('playing', this.handlePlaying)
    this.video.removeEventListener('pause', this.handlePause)
    this.video.removeEventListener('waiting', this.handleWaiting)
    this.video.removeEventListener('ended', this.handleEnded)
    this.video.removeEventListener('canplay', this.handleCanPlay)
    this.video.removeEventListener('error', this.handleError)
    this.video.removeEventListener('resize', this.handleResize)
    this.video.removeEventListener('progress', this.handleProgress)
  }

  private handleLoadedMetadata = (): void => {
    // Notify that video is ready
    const levels = this.getQualityLevels()
    this.options.callbacks?.onQualityLevelsLoaded?.(levels)
    this.options.callbacks?.onStateChange?.('ready')

    // Track initial quality
    this.checkQualityChange()
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

  private handleError = (): void => {
    const error = this.video?.error
    const message = error?.message ?? 'Video playback error'

    // Determine if recoverable (can retry)
    const recoverable = error?.code !== MediaError.MEDIA_ERR_SRC_NOT_SUPPORTED

    this.options.callbacks?.onError?.(new Error(message), recoverable)
    this.options.callbacks?.onStateChange?.('error')
  }

  private handleResize = (): void => {
    // Video dimensions changed - quality may have changed
    this.checkQualityChange()
  }

  private handleProgress = (): void => {
    // Estimate bandwidth from download progress
    this.updateBandwidthEstimate()
  }

  private checkQualityChange(): void {
    const currentQuality = this.estimateCurrentQuality()
    if (!currentQuality) return

    if (
      !this.lastQuality ||
      this.lastQuality.height !== currentQuality.height
    ) {
      this.lastQuality = currentQuality
      this.options.callbacks?.onQualityChange?.(currentQuality)
    }
  }

  private updateBandwidthEstimate(): void {
    if (!this.video) return

    // Use resource timing if available
    if (typeof performance !== 'undefined' && performance.getEntriesByType) {
      const resources = performance.getEntriesByType('resource') as PerformanceResourceTiming[]
      const videoResources = resources.filter(
        (r) => r.initiatorType === 'video' || r.name.includes('.ts') || r.name.includes('.m3u8')
      )

      if (videoResources.length > 0) {
        const recent = videoResources.slice(-5) // Last 5 requests
        const bandwidths = recent
          .filter((r) => r.transferSize > 0 && r.duration > 0)
          .map((r) => (r.transferSize * 8) / (r.duration / 1000)) // bits per second

        if (bandwidths.length > 0) {
          const avgBandwidth = bandwidths.reduce((a, b) => a + b, 0) / bandwidths.length
          this.bandwidthSamples.push(avgBandwidth)

          // Keep last 10 samples
          if (this.bandwidthSamples.length > 10) {
            this.bandwidthSamples.shift()
          }

          this.options.callbacks?.onBandwidthUpdate?.(avgBandwidth)
        }
      }
    }
  }
}

export type { PlayResult }
