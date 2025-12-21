/**
 * UI configuration constants
 */

/**
 * Touch and tap configuration
 */
export const TOUCH = {
  /** Minimum tap target size (Apple HIG) */
  MIN_TAP_AREA: 48,
  /** Comfortable tap target */
  COMFORTABLE_TAP_AREA: 56,
  /** Large tap target */
  LARGE_TAP_AREA: 64,
} as const

/**
 * Icon sizes
 */
export const ICON_SIZE = {
  /** Extra small icons */
  XS: 16,
  /** Small icons */
  SM: 20,
  /** Default icon size */
  DEFAULT: 24,
  /** Medium icons */
  MD: 28,
  /** Large icons */
  LG: 32,
  /** Extra large icons */
  XL: 40,
} as const

/**
 * Bottom sheet configuration
 */
export const BOTTOM_SHEET = {
  /** Default height (60% viewport) */
  HEIGHT_DEFAULT: 0.6,
  /** Maximum height (90% viewport) */
  HEIGHT_MAX: 0.9,
  /** Minimum height before dismiss */
  HEIGHT_MIN: 0.2,
  /** Dismiss threshold velocity */
  DISMISS_VELOCITY: 500,
  /** Drag handle dimensions */
  HANDLE_WIDTH: 40,
  HANDLE_HEIGHT: 4,
} as const

/**
 * Pull to refresh configuration
 */
export const PULL_TO_REFRESH = {
  /** Distance to trigger refresh */
  THRESHOLD: 80,
  /** Maximum pull distance */
  MAX_DISTANCE: 150,
  /** Spinner size */
  SPINNER_SIZE: 24,
} as const

/**
 * Spacing scale (8pt grid)
 */
export const SPACING = {
  /** 4px */
  XS: 4,
  /** 8px */
  SM: 8,
  /** 12px */
  MD: 12,
  /** 16px */
  DEFAULT: 16,
  /** 24px */
  LG: 24,
  /** 32px */
  XL: 32,
  /** 48px */
  XXL: 48,
  /** 64px */
  XXXL: 64,
} as const

/**
 * Border radius presets
 */
export const RADIUS = {
  /** Small radius (buttons, inputs) */
  SM: 8,
  /** Default radius */
  DEFAULT: 12,
  /** Medium radius (cards) */
  MD: 16,
  /** Large radius (sheets) */
  LG: 24,
  /** Full round */
  FULL: 9999,
} as const

/**
 * Z-index layers
 */
export const Z_INDEX = {
  /** Video content */
  VIDEO: 0,
  /** Overlay content (captions, info) */
  OVERLAY: 10,
  /** Action bar */
  ACTION_BAR: 20,
  /** Navigation */
  NAV: 30,
  /** Bottom sheets */
  SHEET: 40,
  /** Modal backdrop */
  MODAL_BACKDROP: 50,
  /** Modals */
  MODAL: 60,
  /** Toasts */
  TOAST: 70,
  /** Tooltips */
  TOOLTIP: 80,
} as const

