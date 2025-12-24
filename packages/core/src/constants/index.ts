/**
 * @xhub-reel/core - Constants
 * Runtime configuration constants for XHubReel
 *
 * Note: Design tokens (colors, spacing, animation, typography) are in @xhub-reel/design-tokens
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

// Breakpoint constants
export {
  BREAKPOINTS,
  MEDIA,
  SAFE_AREA,
} from './breakpoints'

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
