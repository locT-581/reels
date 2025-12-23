/**
 * Gesture configuration constants
 */

/**
 * Tap gesture configuration
 */
export const TAP = {
  /** Max time between taps for double tap (ms) */
  DOUBLE_TAP_DELAY: 200,
  /** Max movement to still count as tap (px) */
  MAX_TAP_MOVEMENT: 10,
} as const

/**
 * Long press configuration
 */
export const LONG_PRESS = {
  /** Time to trigger long press (ms) */
  THRESHOLD: 500,
  /** Max movement during long press (px) */
  MAX_MOVEMENT: 10,
} as const

/**
 * Swipe gesture configuration
 */
export const SWIPE = {
  /** Vertical swipe threshold (% of viewport) */
  VERTICAL_THRESHOLD: 0.3,
  /** Horizontal swipe threshold (% of viewport) */
  HORIZONTAL_THRESHOLD: 0.4,
  /** Minimum velocity to trigger swipe (px/ms) */
  MIN_VELOCITY: 0.5,
  /** Minimum distance for swipe (px) */
  MIN_DISTANCE: 50,
} as const

/**
 * Drag gesture configuration
 */
export const DRAG = {
  /** Minimum distance to start drag (px) */
  THRESHOLD: 10,
  /** Seek drag ratio (px to seconds) */
  SEEK_RATIO: 0.5, // 1px = 0.5s
} as const

/**
 * Gesture zones on video (1/3 divisions)
 */
export const GESTURE_ZONES = {
  /** Left zone threshold (0-0.33) */
  LEFT_THRESHOLD: 0.33,
  /** Right zone threshold (0.67-1) */
  RIGHT_THRESHOLD: 0.67,
} as const

/**
 * Combined gesture configuration
 */
export const GESTURE = {
  TAP_DELAY: TAP.DOUBLE_TAP_DELAY,
  LONG_PRESS_THRESHOLD: LONG_PRESS.THRESHOLD,
  SWIPE_VERTICAL_THRESHOLD: SWIPE.VERTICAL_THRESHOLD,
  SWIPE_HORIZONTAL_THRESHOLD: SWIPE.HORIZONTAL_THRESHOLD,
  SEEK_DRAG_RATIO: DRAG.SEEK_RATIO,
  DRAG_THRESHOLD: DRAG.THRESHOLD,
} as const

