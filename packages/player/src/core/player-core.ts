/**
 * Player Core - Unified API for video playback
 * Automatically selects HLS.js or native HLS based on browser support
 */

import { HLSEngine, type HLSEngineCallbacks } from './hls-engine'
import { NativeHLS, type NativeHLSCallbacks } from './native-hls'
import type { QualityLevel, PlaybackSpeed } from '@vortex/core'

export interface PlayerCoreCallbacks extends HLSEngineCallbacks, NativeHLSCallbacks {
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onProgress?: (buffered: number) => void
  onVolumeChange?: (volume: number, muted: boolean) => void
  onRateChange?: (rate: PlaybackSpeed) => void
}

export interface PlayerCoreOptions {
  preferNative?: boolean
  callbacks?: PlayerCoreCallbacks
}

type PlayerEngine = HLSEngine | NativeHLS

export class PlayerCore {
  private engine: PlayerEngine | null = null
  private video: HTMLVideoElement | null = null
  private options: PlayerCoreOptions
  private isNative: boolean = false
  private animationFrameId: number | null = null

  constructor(options: PlayerCoreOptions = {}) {
    this.options = options
    this.isNative = this.shouldUseNative()
  }

  /**
   * Check if player is supported
   */
  static isSupported(): boolean {
    return HLSEngine.isSupported() || NativeHLS.isSupported()
  }

  /**
   * Attach to a video element and load a source
   */
  attach(video: HTMLVideoElement, url: string): void {
    this.video = video
    this.destroy()

    // Setup video element listeners
    this.setupVideoListeners()

    // Create appropriate engine
    if (this.isNative) {
      this.engine = new NativeHLS({
        callbacks: this.options.callbacks,
      })
    } else {
      this.engine = new HLSEngine({
        callbacks: this.options.callbacks,
      })
    }

    this.engine.attach(video, url)
    this.startProgressTracking()
  }

  /**
   * Load a new source
   */
  loadSource(url: string): void {
    if (!this.engine || !this.video) {
      throw new Error('Player not attached to video element')
    }

    this.engine.loadSource(url)
  }

  /**
   * Destroy the player and cleanup
   */
  destroy(): void {
    this.stopProgressTracking()
    this.removeVideoListeners()

    if (this.engine) {
      this.engine.destroy()
      this.engine = null
    }
  }

  /**
   * Play video
   */
  async play(): Promise<void> {
    if (!this.video) return

    try {
      await this.video.play()
    } catch (error) {
      // Autoplay might be blocked
      if ((error as Error).name === 'NotAllowedError') {
        // Try muted autoplay
        this.video.muted = true
        await this.video.play()
      }
    }
  }

  /**
   * Pause video
   */
  pause(): void {
    this.video?.pause()
  }

  /**
   * Toggle play/pause
   */
  async togglePlay(): Promise<void> {
    if (this.video?.paused) {
      await this.play()
    } else {
      this.pause()
    }
  }

  /**
   * Seek to time
   */
  seek(time: number): void {
    if (this.video) {
      this.video.currentTime = Math.max(0, Math.min(time, this.video.duration || 0))
    }
  }

  /**
   * Seek forward
   */
  seekForward(seconds: number = 10): void {
    if (this.video) {
      this.seek(this.video.currentTime + seconds)
    }
  }

  /**
   * Seek backward
   */
  seekBackward(seconds: number = 10): void {
    if (this.video) {
      this.seek(this.video.currentTime - seconds)
    }
  }

  /**
   * Get current time
   */
  getCurrentTime(): number {
    return this.video?.currentTime ?? 0
  }

  /**
   * Get duration
   */
  getDuration(): number {
    return this.video?.duration ?? 0
  }

  /**
   * Set volume (0-1)
   */
  setVolume(volume: number): void {
    if (this.video) {
      this.video.volume = Math.max(0, Math.min(1, volume))
    }
  }

  /**
   * Get volume
   */
  getVolume(): number {
    return this.video?.volume ?? 1
  }

  /**
   * Set muted
   */
  setMuted(muted: boolean): void {
    if (this.video) {
      this.video.muted = muted
    }
  }

  /**
   * Get muted
   */
  isMuted(): boolean {
    return this.video?.muted ?? true
  }

  /**
   * Toggle mute
   */
  toggleMute(): void {
    this.setMuted(!this.isMuted())
  }

  /**
   * Set playback rate
   */
  setPlaybackRate(rate: PlaybackSpeed): void {
    if (this.video) {
      this.video.playbackRate = rate
    }
  }

  /**
   * Get playback rate
   */
  getPlaybackRate(): number {
    return this.video?.playbackRate ?? 1
  }

  /**
   * Get available quality levels
   */
  getQualityLevels(): QualityLevel[] {
    return this.engine?.getQualityLevels() ?? []
  }

  /**
   * Set quality level (-1 for auto)
   */
  setQuality(level: number): void {
    this.engine?.setQuality(level)
  }

  /**
   * Get current quality level
   */
  getCurrentQuality(): number {
    return this.engine?.getCurrentQuality() ?? -1
  }

  /**
   * Check if using native HLS
   */
  isUsingNative(): boolean {
    return this.isNative
  }

  /**
   * Get video element
   */
  getVideoElement(): HTMLVideoElement | null {
    return this.video
  }

  /**
   * Get buffered amount (seconds from current time)
   */
  getBuffered(): number {
    if (!this.video) return 0

    const buffered = this.video.buffered
    const currentTime = this.video.currentTime

    for (let i = 0; i < buffered.length; i++) {
      if (currentTime >= buffered.start(i) && currentTime <= buffered.end(i)) {
        return buffered.end(i) - currentTime
      }
    }

    return 0
  }

  /**
   * Check if we should use native HLS
   */
  private shouldUseNative(): boolean {
    // Prefer native on iOS for better performance and battery
    if (this.options.preferNative !== false && NativeHLS.isSupported()) {
      return true
    }

    // Fallback to HLS.js if native not available
    return !HLSEngine.isSupported()
  }

  private setupVideoListeners(): void {
    if (!this.video) return

    this.video.addEventListener('volumechange', this.handleVolumeChange)
    this.video.addEventListener('ratechange', this.handleRateChange)
  }

  private removeVideoListeners(): void {
    if (!this.video) return

    this.video.removeEventListener('volumechange', this.handleVolumeChange)
    this.video.removeEventListener('ratechange', this.handleRateChange)
  }

  private handleVolumeChange = (): void => {
    if (this.video) {
      this.options.callbacks?.onVolumeChange?.(
        this.video.volume,
        this.video.muted
      )
    }
  }

  private handleRateChange = (): void => {
    if (this.video) {
      this.options.callbacks?.onRateChange?.(
        this.video.playbackRate as PlaybackSpeed
      )
    }
  }

  private startProgressTracking(): void {
    const track = () => {
      if (this.video) {
        // Time update
        this.options.callbacks?.onTimeUpdate?.(
          this.video.currentTime,
          this.video.duration || 0
        )

        // Buffer progress
        this.options.callbacks?.onProgress?.(this.getBuffered())
      }

      this.animationFrameId = requestAnimationFrame(track)
    }

    track()
  }

  private stopProgressTracking(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
  }
}
