/**
 * Shared playback result types across player-core.
 *
 * Keep this type stable: it's used by PlayerCore, NativeHLS, and helpers like safePlay().
 */
export interface PlayResult {
  success: boolean
  mutedAutoplay?: boolean
  reason?: 'user_gesture_required' | 'autoplay_blocked' | 'unknown'
  error?: Error
}


