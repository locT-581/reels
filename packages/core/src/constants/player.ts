/**
 * Player configuration constants
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
 * Available quality levels
 */
export const QUALITY_LEVELS = ['auto', '1080p', '720p', '480p', '360p', '240p'] as const

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

/**
 * Video activation thresholds for feed
 */
export const VIDEO_ACTIVATION = {
  /** Viewport visibility required to activate (play) */
  ACTIVATION_THRESHOLD: 0.5, // > 50%
  /** Viewport visibility to deactivate (pause) */
  DEACTIVATION_THRESHOLD: 0.3, // < 30%
  /** Max scroll velocity to skip activation */
  SCROLL_VELOCITY_THRESHOLD: 2000, // px/s
  /** Time to wait after scroll stops */
  SCROLL_SETTLE_DELAY: 300, // ms
} as const

/**
 * Memory management limits
 */
export const MEMORY_CONFIG = {
  /** Max videos kept in DOM */
  MAX_VIDEOS_IN_DOM: 5,
  /** Max decoded video frames to keep */
  MAX_DECODED_FRAMES: 3,
  /** Total memory budget */
  MAX_TOTAL_MEMORY: 150 * 1024 * 1024, // 150MB
  /** Distance from current to dispose */
  DISPOSE_THRESHOLD: 4, // ±4 videos
} as const

/**
 * Seek bar configuration
 */
export const SEEK_BAR = {
  /** Default height in pixels */
  HEIGHT_DEFAULT: 2,
  /** Active (hover/touch) height */
  HEIGHT_ACTIVE: 4,
  /** Preview thumbnail size */
  PREVIEW_WIDTH: 160,
  PREVIEW_HEIGHT: 90,
} as const

