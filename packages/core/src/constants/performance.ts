/**
 * Performance targets and configuration
 */

/**
 * Core Web Vitals targets
 */
export const WEB_VITALS = {
  /** Largest Contentful Paint target */
  LCP_TARGET: 1500, // ms
  /** First Input Delay target */
  FID_TARGET: 50, // ms
  /** Cumulative Layout Shift target */
  CLS_TARGET: 0.05,
  /** Interaction to Next Paint target */
  INP_TARGET: 150, // ms
  /** Time to Interactive target */
  TTI_TARGET: 2000, // ms
} as const

/**
 * Video-specific performance targets
 */
export const VIDEO_METRICS = {
  /** Time to first frame */
  TIME_TO_FIRST_FRAME: 500, // ms
  /** Max acceptable buffering ratio */
  BUFFERING_RATIO_TARGET: 0.01, // 1%
  /** Max startup failure rate */
  STARTUP_FAILURE_RATE: 0.005, // 0.5%
  /** Seek latency target */
  SEEK_LATENCY: 200, // ms
} as const

/**
 * Bundle size budgets (gzip)
 */
export const BUNDLE_BUDGET = {
  CORE: 5 * 1024, // 5KB
  PLAYER: 70 * 1024, // 70KB
  UI: 15 * 1024, // 15KB
  GESTURES: 15 * 1024, // 15KB
  FEED: 8 * 1024, // 8KB
  EMBED: 100 * 1024, // 100KB
  TOTAL: 150 * 1024, // 150KB
} as const

/**
 * Runtime performance targets
 */
export const RUNTIME = {
  /** Target FPS */
  TARGET_FPS: 60,
  /** Max CPU usage for 1080p playback */
  MAX_CPU_USAGE: 0.15, // 15%
  /** Max memory usage */
  MAX_MEMORY: 150 * 1024 * 1024, // 150MB
  /** Max long task duration */
  MAX_LONG_TASK: 50, // ms
} as const

