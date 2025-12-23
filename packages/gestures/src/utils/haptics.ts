/**
 * Haptic feedback utilities for gestures
 */

/**
 * Check if haptic feedback is supported
 */
export function supportsHaptic(): boolean {
  return typeof navigator !== 'undefined' && 'vibrate' in navigator
}

/**
 * Light haptic feedback (for taps, likes)
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
 * Heavy haptic feedback (for errors, confirmations)
 */
export function heavyHaptic(): void {
  if (supportsHaptic()) {
    navigator.vibrate(30)
  }
}

