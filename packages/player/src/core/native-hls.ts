/**
 * Native HLS - For iOS Safari which supports HLS natively
 */

import type { PlayerState, QualityLevel } from '@vortex/core'

export interface NativeHLSCallbacks {
  onStateChange?: (state: PlayerState) => void
  onError?: (error: Error, recoverable: boolean) => void
  onQualityLevelsLoaded?: (levels: QualityLevel[]) => void
}

export interface NativeHLSOptions {
  callbacks?: NativeHLSCallbacks
}

export class NativeHLS {
  private video: HTMLVideoElement | null = null
  private options: NativeHLSOptions

  constructor(options: NativeHLSOptions = {}) {
    this.options = options
  }

  /**
   * Check if native HLS is supported (iOS Safari)
   */
  static isSupported(): boolean {
    if (typeof document === 'undefined') return false
    
    const video = document.createElement('video')
    return video.canPlayType('application/vnd.apple.mpegurl') !== ''
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
   * Destroy and cleanup
   */
  destroy(): void {
    if (this.video) {
      this.removeVideoListeners()
      this.video.removeAttribute('src')
      this.video.load() // Reset
      this.video = null
    }
  }

  /**
   * Get available quality levels
   * Note: Native HLS doesn't expose quality levels easily
   */
  getQualityLevels(): QualityLevel[] {
    // Native HLS handles quality automatically
    // Return a placeholder for "Auto"
    return [
      {
        label: 'Auto',
        height: 0,
        bitrate: 0,
      },
    ]
  }

  /**
   * Set quality level (not supported in native HLS)
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
   * Get bandwidth estimate (not available in native)
   */
  getBandwidth(): number {
    return 0
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

  private setupVideoListeners(): void {
    if (!this.video) return

    this.video.addEventListener('loadedmetadata', this.handleLoadedMetadata)
    this.video.addEventListener('playing', this.handlePlaying)
    this.video.addEventListener('pause', this.handlePause)
    this.video.addEventListener('waiting', this.handleWaiting)
    this.video.addEventListener('ended', this.handleEnded)
    this.video.addEventListener('canplay', this.handleCanPlay)
    this.video.addEventListener('error', this.handleError)
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
  }

  private handleLoadedMetadata = (): void => {
    // Notify that video is ready
    const levels = this.getQualityLevels()
    this.options.callbacks?.onQualityLevelsLoaded?.(levels)
    this.options.callbacks?.onStateChange?.('ready')
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
    
    this.options.callbacks?.onError?.(new Error(message), false)
    this.options.callbacks?.onStateChange?.('error')
  }
}
