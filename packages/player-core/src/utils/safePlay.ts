import type { PlayResult } from '../types/playback'

export interface SafePlayOptions {
  onNeedsUserGesture?: () => void
}

/**
 * safePlay - Unified autoplay handling
 *
 * Behavior:
 * - Try `video.play()`
 * - If blocked (NotAllowedError), force `muted = true` then retry
 * - If still blocked, notify `onNeedsUserGesture` and return a structured result
 */
export async function safePlay(
  video: HTMLVideoElement,
  options: SafePlayOptions = {}
): Promise<PlayResult> {
  try {
    await video.play()
    return { success: true }
  } catch (error) {
    const err = error as Error

    if (err.name === 'NotAllowedError') {
      video.muted = true

      try {
        await video.play()
        return { success: true, mutedAutoplay: true }
      } catch {
        options.onNeedsUserGesture?.()
        return { success: false, reason: 'user_gesture_required' }
      }
    }

    return { success: false, reason: 'unknown', error: err }
  }
}


