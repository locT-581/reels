/**
 * Player Engine Configuration
 * Optimized HLS settings for mobile playback
 */

/**
 * HLS.js configuration optimized for mobile
 */
export const HLS_CONFIG = {
  // Buffer settings
  maxBufferLength: 30, // 30 seconds
  maxMaxBufferLength: 60, // Max 60 seconds
  maxBufferSize: 30 * 1000 * 1000, // 30MB
  maxBufferHole: 0.5, // 0.5s gap tolerance

  // ABR (Adaptive Bitrate) settings
  abrEwmaDefaultEstimate: 500000, // 500kbps initial
  abrBandWidthUpFactor: 0.7, // Conservative upswitch
  abrBandWidthFactor: 0.9, // Aggressive downswitch
  startLevel: -1, // Auto select start quality

  // Loading settings
  autoStartLoad: true,
  startPosition: -1, // Start from beginning
  fragLoadingMaxRetry: 3,
  manifestLoadingMaxRetry: 3,
  levelLoadingMaxRetry: 3,

  // Timing
  fragLoadingTimeOut: 20000,
  manifestLoadingTimeOut: 10000,
  levelLoadingTimeOut: 10000,

  // Low latency (disabled for VOD)
  lowLatencyMode: false,
  liveSyncDuration: 3,
} as const

/**
 * Available playback speeds
 */
export const PLAYBACK_SPEEDS = [0.5, 0.75, 1, 1.25, 1.5, 2] as const

/**
 * Quality level bitrate thresholds
 */
export const QUALITY_BITRATES = {
  '1080p': 5000000, // 5 Mbps
  '720p': 2500000, // 2.5 Mbps
  '480p': 1000000, // 1 Mbps
  '360p': 500000, // 500 Kbps
  '240p': 250000, // 250 Kbps
} as const

