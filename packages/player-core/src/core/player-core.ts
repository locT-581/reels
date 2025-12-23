/**
 * Player Core - Unified API for video playback with service integration
 *
 * Features:
 * - Auto-selects HLS.js or native HLS
 * - Network-aware adaptive streaming
 * - Power-aware quality adjustment
 * - Built-in analytics collection
 * - Event-based progress tracking (battery efficient)
 */

import { HLSEngine } from './hls-engine'
import { NativeHLS } from './native-hls'
import type { QualityLevel, PlaybackSpeed, PlayerState } from '@vortex/core'
import type { PlayResult } from '../types/playback'
import {
  NetworkDetector,
  PowerManager,
  PreloadManager,
  AnalyticsCollector,
  type NetworkInfo,
  type PowerInfo,
  type PlaybackMetrics,
  type PreloadManagerOptions,
} from '../services'
import { safePlay } from '../utils/safePlay'

export interface PlayerCoreCallbacks {
  // From engine callbacks
  onStateChange?: (state: PlayerState) => void
  onError?: (error: Error, recoverable: boolean) => void
  onQualityLevelsLoaded?: (levels: QualityLevel[]) => void
  onBandwidthUpdate?: (bandwidth: number) => void
  /** Quality change - level is index (-1 for auto), quality is QualityLevel object */
  onQualityChange?: (level: number, quality?: QualityLevel) => void

  // PlayerCore specific
  onTimeUpdate?: (currentTime: number, duration: number) => void
  onProgress?: (buffered: number) => void
  onVolumeChange?: (volume: number, muted: boolean) => void
  onRateChange?: (rate: PlaybackSpeed) => void
  /** Called when autoplay is blocked and user gesture is required */
  onNeedsUserGesture?: () => void
  /** Called when network conditions change */
  onNetworkChange?: (info: NetworkInfo) => void
  /** Called when power state changes */
  onPowerChange?: (info: PowerInfo) => void
  /** Called when analytics metrics are updated */
  onAnalyticsUpdate?: (metrics: PlaybackMetrics) => void
}

export interface PlayerCoreOptions {
  /** Prefer native HLS over HLS.js. Default: true for iOS */
  preferNative?: boolean
  /** Event callbacks */
  callbacks?: PlayerCoreCallbacks
  /** Enable smooth RAF-based time updates. Default: false */
  enableSmoothTimeUpdates?: boolean
  /** Enable network adaptation. Default: true */
  enableNetworkAdaptation?: boolean
  /** Enable power adaptation. Default: true */
  enablePowerAdaptation?: boolean
  /** Enable analytics collection. Default: false */
  enableAnalytics?: boolean
  /** Preload manager options */
  preloadConfig?: PreloadManagerOptions
  /** Automatically switch quality when network changes. Default: false */
  autoQualityOnNetworkChange?: boolean
  /** Automatically pause video when going offline. Default: false */
  autoPauseOnOffline?: boolean
  /** Automatically resume video when coming back online. Default: false */
  autoResumeOnOnline?: boolean
  /** Network speed threshold to trigger low quality mode. Default: '2g' */
  lowQualityThreshold?: 'slow-2g' | '2g' | '3g'
  /** Automatically pause on low battery. Default: false */
  autoPauseOnLowBattery?: boolean
  /** Battery level threshold to trigger pause (0-1). Default: 0.15 (15%) */
  lowBatteryThreshold?: number
}

type PlayerEngine = HLSEngine | NativeHLS

export class PlayerCore {
  private engine: PlayerEngine | null = null
  private video: HTMLVideoElement | null = null
  private options: PlayerCoreOptions
  private isNative: boolean = false
  private animationFrameId: number | null = null
  private isTracking: boolean = false

  // Services
  private networkDetector: NetworkDetector | null = null
  private powerManager: PowerManager | null = null
  private preloadManager: PreloadManager | null = null
  private analytics: AnalyticsCollector | null = null

  // Cleanup functions
  private cleanupFunctions: Array<() => void> = []

  // State tracking for automatic behaviors
  private wasPlayingBeforeOffline: boolean = false
  private wasPlayingBeforeLowBattery: boolean = false

  constructor(options: PlayerCoreOptions = {}) {
    this.options = {
      enableNetworkAdaptation: true,
      enablePowerAdaptation: true,
      enableAnalytics: false,
      ...options,
    }
    this.isNative = this.shouldUseNative()
    this.initializeServices()
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
  attach(video: HTMLVideoElement, url: string, videoId?: string): void {
    this.video = video
    this.destroyEngine()

    // Setup video element listeners
    this.setupVideoListeners()

    // Start analytics session if enabled
    if (this.analytics && videoId) {
      this.analytics.startSession(videoId, video)
    }

    // Create appropriate engine with adapted config
    const adaptedConfig = this.getAdaptedConfig()

    if (this.isNative) {
      this.engine = new NativeHLS({
        callbacks: {
          onStateChange: this.options.callbacks?.onStateChange,
          onError: this.options.callbacks?.onError,
          onQualityLevelsLoaded: this.options.callbacks?.onQualityLevelsLoaded,
          onBandwidthUpdate: this.options.callbacks?.onBandwidthUpdate,
          onNeedsUserGesture: this.options.callbacks?.onNeedsUserGesture,
          // Map NativeHLS quality change to unified format
          onQualityChange: (quality) => {
            this.options.callbacks?.onQualityChange?.(-1, quality)
          },
        },
      })
    } else {
      this.engine = new HLSEngine({
        config: adaptedConfig,
        callbacks: {
          onStateChange: this.options.callbacks?.onStateChange,
          onError: this.options.callbacks?.onError,
          onQualityLevelsLoaded: this.options.callbacks?.onQualityLevelsLoaded,
          onBandwidthUpdate: this.options.callbacks?.onBandwidthUpdate,
          // Map HLSEngine quality change to unified format
          onQualityChange: (level, auto) => {
            const levels = this.engine?.getQualityLevels() ?? []
            const quality = level >= 0 && level < levels.length ? levels[level] : undefined
            this.options.callbacks?.onQualityChange?.(auto ? -1 : level, quality)
          },
        },
      })
    }

    this.engine.attach(video, url)
  }

  /**
   * Load a new source
   */
  loadSource(url: string, videoId?: string): void {
    if (!this.engine || !this.video) {
      throw new Error('Player not attached to video element')
    }

    // End previous analytics session
    if (this.analytics) {
      this.analytics.endSession()
      if (videoId) {
        this.analytics.startSession(videoId, this.video)
      }
    }

    this.engine.loadSource(url)
  }

  /**
   * Destroy the player and cleanup
   */
  destroy(): void {
    this.destroyEngine()
    this.destroyServices()
  }

  /**
   * Play video with improved autoplay handling
   */
  async play(): Promise<PlayResult> {
    if (!this.video) {
      return { success: false, reason: 'unknown' }
    }

    // Use native play if NativeHLS
    if (this.isNative && this.engine instanceof NativeHLS) {
      return this.engine.play()
    }

    // Standard play for HLS.js (unified autoplay handling)
    return safePlay(this.video, {
      onNeedsUserGesture: this.options.callbacks?.onNeedsUserGesture,
    })
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
  async togglePlay(): Promise<PlayResult> {
    if (this.video?.paused) {
      return this.play()
    } else {
      this.pause()
      return { success: true }
    }
  }

  /**
   * Seek to time
   */
  seek(time: number): void {
    if (this.video) {
      const prevTime = this.video.currentTime
      this.video.currentTime = Math.max(0, Math.min(time, this.video.duration || 0))

      // Track seek in analytics
      this.analytics?.trackSeek(prevTime, time, 0) // Latency tracked by video events
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
    const prevLevel = this.getCurrentQuality()
    this.engine?.setQuality(level)

    // Track quality switch in analytics
    if (prevLevel !== level) {
      this.analytics?.trackQualitySwitch(prevLevel, level, level === -1)
    }
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

  // ==========================================================================
  // SERVICE ACCESS
  // ==========================================================================

  /**
   * Get network info
   */
  getNetworkInfo(): NetworkInfo | null {
    return this.networkDetector?.getInfo() ?? null
  }

  /**
   * Get power info
   */
  getPowerInfo(): PowerInfo | null {
    return this.powerManager?.getInfo() ?? null
  }

  /**
   * Get preload manager
   */
  getPreloadManager(): PreloadManager | null {
    return this.preloadManager
  }

  /**
   * Get analytics metrics
   */
  getAnalytics(): PlaybackMetrics | null {
    return this.analytics?.getMetrics() ?? null
  }

  /**
   * Check if network is slow
   */
  isSlowNetwork(): boolean {
    return this.networkDetector?.isSlowNetwork() ?? false
  }

  /**
   * Check if device is in power saving mode
   */
  isPowerSaving(): boolean {
    return this.powerManager?.isPowerSaving() ?? false
  }

  // ==========================================================================
  // PRIVATE METHODS
  // ==========================================================================

  private shouldUseNative(): boolean {
    // Prefer native on iOS/Safari for better performance and battery
    if (this.options.preferNative !== false && NativeHLS.isSupported()) {
      return true
    }

    // Fallback to HLS.js if native not available
    return !HLSEngine.isSupported()
  }

  private initializeServices(): void {
    // Network detection
    if (this.options.enableNetworkAdaptation) {
      this.networkDetector = new NetworkDetector()
      const unsubNetwork = this.networkDetector.subscribe({
        onNetworkChange: this.handleNetworkChange,
        onOffline: () => this.options.callbacks?.onError?.(new Error('Network offline'), true),
      })
      this.cleanupFunctions.push(unsubNetwork)
    }

    // Power management
    if (this.options.enablePowerAdaptation) {
      this.powerManager = new PowerManager()
      const unsubPower = this.powerManager.subscribe({
        onPowerChange: this.handlePowerChange,
      })
      this.cleanupFunctions.push(unsubPower)
      this.cleanupFunctions.push(() => this.powerManager?.destroy())
    }

    // Preload manager
    if (this.options.preloadConfig) {
      this.preloadManager = new PreloadManager(this.options.preloadConfig)
      this.cleanupFunctions.push(() => this.preloadManager?.destroy())
    }

    // Analytics
    if (this.options.enableAnalytics) {
      this.analytics = new AnalyticsCollector()
      const unsubAnalytics = this.analytics.subscribe({
        onMetricsUpdate: (metrics) => this.options.callbacks?.onAnalyticsUpdate?.(metrics),
      })
      this.cleanupFunctions.push(unsubAnalytics)
      this.cleanupFunctions.push(() => this.analytics?.destroy())
    }
  }

  private destroyServices(): void {
    this.cleanupFunctions.forEach((cleanup) => cleanup())
    this.cleanupFunctions = []
    this.networkDetector = null
    this.powerManager = null
    this.preloadManager = null
    this.analytics = null
  }

  private destroyEngine(): void {
    this.stopProgressTracking()
    this.removeVideoListeners()

    if (this.engine) {
      this.engine.destroy()
      this.engine = null
    }
  }

  private getAdaptedConfig(): Record<string, unknown> {
    let config: Record<string, unknown> = {}

    // Apply network-based config
    if (this.networkDetector) {
      config = { ...config, ...this.networkDetector.getRecommendedConfig() }
    }

    // Apply power-based config
    if (this.powerManager) {
      config = { ...config, ...this.powerManager.getRecommendedConfig() }
    }

    return config
  }

  /**
   * Helper: Check if network speed is below threshold
   */
  private isNetworkBelowThreshold(
    effectiveType: 'slow-2g' | '2g' | '3g' | '4g' | '5g' | 'unknown',
    threshold: 'slow-2g' | '2g' | '3g'
  ): boolean {
    const speedOrder = ['slow-2g', '2g', '3g', '4g', '5g', 'unknown']
    const currentIndex = speedOrder.indexOf(effectiveType)
    const thresholdIndex = speedOrder.indexOf(threshold)

    // unknown is treated as uncertain, not slow
    if (effectiveType === 'unknown') return false

    return currentIndex >= 0 && currentIndex <= thresholdIndex
  }

  private handleNetworkChange = (info: NetworkInfo): void => {
    // Notify callback FIRST (for custom UI/logging)
    this.options.callbacks?.onNetworkChange?.(info)

    const threshold = this.options.lowQualityThreshold ?? '2g'
    const isSlowNetwork = this.isNetworkBelowThreshold(info.effectiveType, threshold)

    // AUTO: Quality switching on network change
    if (this.options.autoQualityOnNetworkChange && this.engine) {
      if (isSlowNetwork) {
        // Switch to lowest quality on slow network
        this.setQuality(0)
      } else if (info.effectiveType === '4g' || info.effectiveType === '5g') {
        // Switch back to auto quality on fast network
        this.setQuality(-1)
      }
    }

    // AUTO: Pause on offline
    if (this.options.autoPauseOnOffline && !info.online) {
      // Track playing state before pausing
      this.wasPlayingBeforeOffline = this.video ? !this.video.paused : false
      this.pause()
    }

    // AUTO: Resume on online
    if (this.options.autoResumeOnOnline && info.online && this.wasPlayingBeforeOffline) {
      this.play()
      this.wasPlayingBeforeOffline = false
    }

    // Pause preloading on slow networks (existing behavior)
    if (this.preloadManager) {
      this.preloadManager.setPaused(info.effectiveType === '2g' || !info.online)
    }

    // Note: HLS.js doesn't support runtime config changes
    // Full network adaptation (buffer size, etc.) takes effect on next source load
  }

  private handlePowerChange = (info: PowerInfo): void => {
    // Notify callback FIRST (for custom UI/logging)
    this.options.callbacks?.onPowerChange?.(info)

    const threshold = this.options.lowBatteryThreshold ?? 0.15 // 15%
    const isLowBattery = info.batteryLevel !== null && info.batteryLevel < threshold

    // AUTO: Pause on low battery
    if (this.options.autoPauseOnLowBattery && isLowBattery && !info.isCharging) {
      // Track playing state before pausing
      this.wasPlayingBeforeLowBattery = this.video ? !this.video.paused : false
      this.pause()
    }

    // AUTO: Resume when battery is charging or recovered
    if (this.wasPlayingBeforeLowBattery) {
      const shouldResume = info.isCharging || (info.batteryLevel !== null && info.batteryLevel >= threshold + 0.05)
      if (shouldResume) {
        this.play()
        this.wasPlayingBeforeLowBattery = false
      }
    }

    // Reduce preloading when power saving (existing behavior)
    if (this.preloadManager && info.isLowPowerMode) {
      this.preloadManager.setPaused(true)
    }
  }

  private setupVideoListeners(): void {
    if (!this.video) return

    // Event-based tracking (battery efficient)
    this.video.addEventListener('timeupdate', this.handleTimeUpdate)
    this.video.addEventListener('progress', this.handleProgress)
    this.video.addEventListener('volumechange', this.handleVolumeChange)
    this.video.addEventListener('ratechange', this.handleRateChange)

    // Play/pause for smooth tracking
    this.video.addEventListener('play', this.handlePlay)
    this.video.addEventListener('pause', this.handlePause)
    this.video.addEventListener('ended', this.handleEnded)
    this.video.addEventListener('waiting', this.handleWaiting)
    this.video.addEventListener('playing', this.handlePlaying)
  }

  private removeVideoListeners(): void {
    if (!this.video) return

    this.video.removeEventListener('timeupdate', this.handleTimeUpdate)
    this.video.removeEventListener('progress', this.handleProgress)
    this.video.removeEventListener('volumechange', this.handleVolumeChange)
    this.video.removeEventListener('ratechange', this.handleRateChange)
    this.video.removeEventListener('play', this.handlePlay)
    this.video.removeEventListener('pause', this.handlePause)
    this.video.removeEventListener('ended', this.handleEnded)
    this.video.removeEventListener('waiting', this.handleWaiting)
    this.video.removeEventListener('playing', this.handlePlaying)
  }

  // Event handlers
  private handleTimeUpdate = (): void => {
    if (this.video) {
      this.options.callbacks?.onTimeUpdate?.(
        this.video.currentTime,
        this.video.duration || 0
      )
    }
  }

  private handleProgress = (): void => {
    this.options.callbacks?.onProgress?.(this.getBuffered())
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

  private handlePlay = (): void => {
    if (this.options.enableSmoothTimeUpdates) {
      this.startProgressTracking()
    }
  }

  private handlePause = (): void => {
    this.stopProgressTracking()
  }

  private handleEnded = (): void => {
    this.stopProgressTracking()

    // End analytics session
    if (this.analytics) {
      this.analytics.endSession()
    }
  }

  private handleWaiting = (): void => {
    // Track buffering in analytics
    this.analytics?.trackBuffering(true)
  }

  private handlePlaying = (): void => {
    // Track buffering end
    this.analytics?.trackBuffering(false)

    // Track first frame
    this.analytics?.trackFirstFrame()
  }

  private startProgressTracking(): void {
    if (this.isTracking || !this.video) return

    this.isTracking = true

    const track = () => {
      if (!this.video || this.video.paused || this.video.ended) {
        this.isTracking = false
        this.animationFrameId = null
        return
      }

      this.options.callbacks?.onTimeUpdate?.(
        this.video.currentTime,
        this.video.duration || 0
      )

      this.animationFrameId = requestAnimationFrame(track)
    }

    this.animationFrameId = requestAnimationFrame(track)
  }

  private stopProgressTracking(): void {
    if (this.animationFrameId !== null) {
      cancelAnimationFrame(this.animationFrameId)
      this.animationFrameId = null
    }
    this.isTracking = false
  }
}

// Re-export PlayResult type
export type { PlayResult }
