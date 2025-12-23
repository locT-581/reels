/**
 * Haptic feedback utilities
 * Uses the Vibration API for tactile feedback
 */

/**
 * Check if haptic feedback is supported
 */
export function supportsHaptic(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator
}

/**
 * Light haptic feedback (for likes, taps)
 */
export function lightHaptic(): void {
  if (supportsHaptic()) {
    navigator.vibrate(10)
  }
}

/**
 * Medium haptic feedback (for long press, important actions)
 */
export function mediumHaptic(): void {
  if (supportsHaptic()) {
    navigator.vibrate(20)
  }
}

/**
 * Heavy haptic feedback (for pull-to-refresh, errors)
 */
export function heavyHaptic(): void {
  if (supportsHaptic()) {
    navigator.vibrate(30)
  }
}

/**
 * Selection haptic feedback (for toggles, selections)
 */
export function selectionHaptic(): void {
  if (supportsHaptic()) {
    navigator.vibrate([5, 5, 5])
  }
}

/**
 * Success haptic pattern
 */
export function successHaptic(): void {
  if (supportsHaptic()) {
    navigator.vibrate([10, 30, 10])
  }
}

/**
 * Error haptic pattern
 */
export function errorHaptic(): void {
  if (supportsHaptic()) {
    navigator.vibrate([30, 50, 30, 50, 30])
  }
}

