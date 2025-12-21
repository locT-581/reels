/**
 * Web Vitals Tracking
 * 
 * Tracks Core Web Vitals and custom video metrics
 */

import { onCLS, onFCP, onINP, onLCP, onTTFB, type Metric } from 'web-vitals'

type VitalsHandler = (metric: Metric) => void

// Threshold targets from BLUEPRINT.md
export const VITALS_THRESHOLDS = {
  LCP: 1500, // < 1.5s
  FID: 50,   // < 50ms (deprecated, using INP)
  INP: 150,  // < 150ms
  CLS: 0.05, // < 0.05
  FCP: 1000, // < 1s
  TTFB: 500, // < 500ms
  
  // Custom video metrics
  VIDEO_FIRST_FRAME: 500,  // < 500ms
  BUFFERING_RATIO: 0.01,   // < 1%
  SEEK_LATENCY: 200,       // < 200ms
} as const

/**
 * Report metric to analytics
 */
function reportMetric(metric: Metric) {
  // Log in development
  if (process.env.NODE_ENV === 'development') {
    const isGood = isMetricGood(metric)
    const status = isGood ? '✅' : '⚠️'
    console.log(`${status} ${metric.name}: ${metric.value.toFixed(2)}`)
  }

  // Send to analytics in production
  if (process.env.NODE_ENV === 'production' && typeof navigator !== 'undefined') {
    // Use sendBeacon for reliability
    const body = JSON.stringify({
      name: metric.name,
      value: metric.value,
      rating: metric.rating,
      delta: metric.delta,
      id: metric.id,
      navigationType: metric.navigationType,
      timestamp: Date.now(),
    })

    // Send to analytics endpoint
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/vitals', body)
    }
  }
}

/**
 * Check if metric is within threshold
 */
function isMetricGood(metric: Metric): boolean {
  const thresholds: Record<string, number> = {
    LCP: VITALS_THRESHOLDS.LCP,
    INP: VITALS_THRESHOLDS.INP,
    CLS: VITALS_THRESHOLDS.CLS,
    FCP: VITALS_THRESHOLDS.FCP,
    TTFB: VITALS_THRESHOLDS.TTFB,
  }
  
  const threshold = thresholds[metric.name]
  return threshold ? metric.value <= threshold : true
}

/**
 * Initialize Web Vitals tracking
 */
export function initWebVitals(handler?: VitalsHandler) {
  const onReport = handler || reportMetric
  
  onCLS(onReport)
  onFCP(onReport)
  onINP(onReport)
  onLCP(onReport)
  onTTFB(onReport)
}

/**
 * Custom video metrics tracker
 */
export class VideoMetricsTracker {
  private videoId: string
  private metrics: Map<string, number> = new Map()
  private startTime: number = 0

  constructor(videoId: string) {
    this.videoId = videoId
    this.startTime = performance.now()
  }

  /**
   * Record time to first frame
   */
  recordFirstFrame() {
    const timeToFirstFrame = performance.now() - this.startTime
    this.metrics.set('timeToFirstFrame', timeToFirstFrame)
    
    if (process.env.NODE_ENV === 'development') {
      const status = timeToFirstFrame < VITALS_THRESHOLDS.VIDEO_FIRST_FRAME ? '✅' : '⚠️'
      console.log(`${status} Video First Frame: ${timeToFirstFrame.toFixed(2)}ms`)
    }
  }

  /**
   * Record buffering event
   */
  recordBuffering(duration: number) {
    const current = this.metrics.get('totalBufferingTime') || 0
    this.metrics.set('totalBufferingTime', current + duration)
    
    const bufferCount = (this.metrics.get('bufferingCount') || 0) + 1
    this.metrics.set('bufferingCount', bufferCount)
  }

  /**
   * Record seek operation
   */
  recordSeek(latency: number) {
    this.metrics.set('lastSeekLatency', latency)
    
    if (process.env.NODE_ENV === 'development') {
      const status = latency < VITALS_THRESHOLDS.SEEK_LATENCY ? '✅' : '⚠️'
      console.log(`${status} Seek Latency: ${latency.toFixed(2)}ms`)
    }
  }

  /**
   * Get buffering ratio
   */
  getBufferingRatio(totalPlayTime: number): number {
    const bufferingTime = this.metrics.get('totalBufferingTime') || 0
    return totalPlayTime > 0 ? bufferingTime / totalPlayTime : 0
  }

  /**
   * Flush all metrics
   */
  flush() {
    const data = {
      videoId: this.videoId,
      metrics: Object.fromEntries(this.metrics),
      timestamp: Date.now(),
    }

    if (process.env.NODE_ENV === 'production' && navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/video-metrics', JSON.stringify(data))
    }
  }
}

/**
 * Performance mark helpers
 */
export const perfMark = {
  start: (name: string) => performance.mark(`${name}-start`),
  end: (name: string) => {
    performance.mark(`${name}-end`)
    performance.measure(name, `${name}-start`, `${name}-end`)
    const measure = performance.getEntriesByName(name, 'measure')[0]
    return measure?.duration || 0
  },
}

