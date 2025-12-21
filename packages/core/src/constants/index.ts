/**
 * @vortex/core - Constants
 * Configuration constants for VortexStream
 */

// Player constants
export {
  HLS_CONFIG,
  PLAYBACK_SPEEDS,
  QUALITY_LEVELS,
  QUALITY_BITRATES,
  VIDEO_ACTIVATION,
  MEMORY_CONFIG,
  SEEK_BAR,
} from './player'

// Animation constants
export {
  EASING,
  DURATION,
  SPRING,
  VARIANTS,
  STAGGER,
} from './animation'

// Color constants
export {
  COLORS,
  OPACITY,
  GRADIENTS,
  SHADOWS,
  BLUR,
} from './colors'

// Breakpoint constants
export {
  BREAKPOINTS,
  MEDIA,
  SAFE_AREA,
} from './breakpoints'

// UI constants
export {
  TOUCH,
  ICON_SIZE,
  BOTTOM_SHEET,
  PULL_TO_REFRESH,
  SPACING,
  RADIUS,
  Z_INDEX,
} from './ui'

// Gesture constants
export {
  TAP,
  LONG_PRESS,
  SWIPE,
  DRAG,
  GESTURE_ZONES,
  GESTURE,
} from './gesture'

// Storage constants
export {
  STORAGE_KEYS,
  IDB_CONFIG,
  CACHE_CONFIG,
} from './storage'

// Error constants
export {
  ERROR_MESSAGES,
  ERROR_CODES,
} from './errors'

// Performance constants
export {
  WEB_VITALS,
  VIDEO_METRICS,
  BUNDLE_BUDGET,
  RUNTIME,
} from './performance'

// Legacy exports for backward compatibility
export const ANIMATION = {
  DURATION: 300,
  EASING: 'cubic-bezier(0.32, 0.72, 0, 1)',
  SPRING_STIFFNESS: 400,
  SPRING_DAMPING: 30,
} as const

export const UI = {
  MIN_TAP_AREA: 48,
  SEEK_BAR_HEIGHT_DEFAULT: 2,
  SEEK_BAR_HEIGHT_ACTIVE: 4,
  ICON_SIZE: 32,
  BOTTOM_SHEET_HEIGHT: 0.6,
  BOTTOM_SHEET_HEIGHT_MAX: 0.9,
  PULL_TO_REFRESH_THRESHOLD: 80,
} as const

export const PERFORMANCE = {
  LCP_TARGET: 1500,
  TTI_TARGET: 2000,
  TIME_TO_FIRST_FRAME: 500,
  BUFFERING_RATIO_TARGET: 0.01,
  SEEK_LATENCY_TARGET: 200,
} as const
