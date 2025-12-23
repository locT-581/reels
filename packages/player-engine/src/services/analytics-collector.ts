/**
 * Analytics Collector Service
 * Collects playback metrics for analysis and debugging
 */

export interface QualitySwitch {
  timestamp: number
  fromLevel: number
  toLevel: number
  automatic: boolean
}

export interface BufferingEvent {
  timestamp: number
  duration: number
}

export interface PlaybackError {
  timestamp: number
  message: string
  recoverable: boolean
}

export interface SeekEvent {
  timestamp: number
  from: number
  to: number
  latency: number
}

export interface PlaybackMetrics {
  videoId: string | null
  sessionStartTime: number | null
  playbackStartTime: number | null
  totalPlayTime: number
  totalBufferingTime: number
  bufferingCount: number
  qualitySwitches: QualitySwitch[]
  errors: PlaybackError[]
  seeks: SeekEvent[]
  avgBitrate: number
  startupTime: number | null
}

export interface AnalyticsCollectorCallbacks {
  onMetricsUpdate?: (metrics: PlaybackMetrics) => void
  onSessionEnd?: (metrics: PlaybackMetrics) => void
}

export class AnalyticsCollector {
  private metrics: PlaybackMetrics = this.createEmptyMetrics()
  private callbacks: AnalyticsCollectorCallbacks = {}
  private bufferingStartTime: number | null = null
  private playStartTime: number | null = null
  private isPlaying: boolean = false

  private createEmptyMetrics(): PlaybackMetrics {
    return {
      videoId: null,
      sessionStartTime: null,
      playbackStartTime: null,
      totalPlayTime: 0,
      totalBufferingTime: 0,
      bufferingCount: 0,
      qualitySwitches: [],
      errors: [],
      seeks: [],
      avgBitrate: 0,
      startupTime: null,
    }
  }

  startSession(videoId: string, _video?: HTMLVideoElement): void {
    this.metrics = {
      ...this.createEmptyMetrics(),
      videoId,
      sessionStartTime: Date.now(),
    }
    this.notifyUpdate()
  }

  endSession(): PlaybackMetrics {
    if (this.isPlaying && this.playStartTime) {
      this.metrics.totalPlayTime += Date.now() - this.playStartTime
    }
    this.isPlaying = false
    this.playStartTime = null
    const finalMetrics = { ...this.metrics }
    this.callbacks.onSessionEnd?.(finalMetrics)
    return finalMetrics
  }

  trackFirstFrame(): void {
    if (this.metrics.sessionStartTime && !this.metrics.playbackStartTime) {
      this.metrics.playbackStartTime = Date.now()
      this.metrics.startupTime = this.metrics.playbackStartTime - this.metrics.sessionStartTime
      this.isPlaying = true
      this.playStartTime = Date.now()
      this.notifyUpdate()
    }
  }

  trackBuffering(isBuffering: boolean): void {
    const now = Date.now()

    if (isBuffering && !this.bufferingStartTime) {
      this.bufferingStartTime = now
      this.metrics.bufferingCount++
    } else if (!isBuffering && this.bufferingStartTime) {
      this.metrics.totalBufferingTime += now - this.bufferingStartTime
      this.bufferingStartTime = null
    }

    this.notifyUpdate()
  }

  trackQualitySwitch(fromLevel: number, toLevel: number, automatic: boolean): void {
    this.metrics.qualitySwitches.push({
      timestamp: Date.now(),
      fromLevel,
      toLevel,
      automatic,
    })
    this.notifyUpdate()
  }

  trackError(error: Error | string, recoverable: boolean, _recoveryTime?: number): void {
    const message = typeof error === 'string' ? error : error.message
    this.metrics.errors.push({
      timestamp: Date.now(),
      message,
      recoverable,
    })
    this.notifyUpdate()
  }

  trackBitrate(bitrate: number): void {
    this.metrics.avgBitrate = bitrate
    this.notifyUpdate()
  }

  trackReplay(): void {
    // Reset play time tracking for replay
    this.playStartTime = Date.now()
    this.isPlaying = true
    this.notifyUpdate()
  }

  trackSeek(from: number, to: number, latency: number): void {
    this.metrics.seeks.push({
      timestamp: Date.now(),
      from,
      to,
      latency,
    })
    this.notifyUpdate()
  }

  subscribe(callbacks: AnalyticsCollectorCallbacks): () => void {
    this.callbacks = { ...this.callbacks, ...callbacks }
    return () => {
      this.callbacks = {}
    }
  }

  getMetrics(): PlaybackMetrics {
    return { ...this.metrics }
  }

  private notifyUpdate(): void {
    this.callbacks.onMetricsUpdate?.(this.getMetrics())
  }

  destroy(): void {
    this.endSession()
    this.callbacks = {}
  }
}

export function createAnalyticsCollector(): AnalyticsCollector {
  return new AnalyticsCollector()
}

