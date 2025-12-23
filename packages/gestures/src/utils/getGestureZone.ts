/**
 * getGestureZone - Determine which zone of the screen was tapped
 */

export type GestureZone = 'left' | 'center' | 'right'

/**
 * Get gesture zone from pointer event
 * @param event - Pointer event (React or native)
 * @param target - Optional target element (use when event.currentTarget is unavailable)
 */
export function getGestureZone(
  event: PointerEvent | React.PointerEvent,
  target?: HTMLElement | null
): GestureZone {
  // Try to get target from parameter, then currentTarget, then target
  const element =
    target ||
    (event.currentTarget as HTMLElement) ||
    (event.target as HTMLElement)

  if (!element || typeof element.getBoundingClientRect !== 'function') {
    return 'center'
  }

  const rect = element.getBoundingClientRect()
  const x = (event as PointerEvent).clientX - rect.left
  const width = rect.width

  if (width === 0) return 'center'

  const leftThreshold = width * 0.33
  const rightThreshold = width * 0.67

  if (x < leftThreshold) {
    return 'left'
  }

  if (x > rightThreshold) {
    return 'right'
  }

  return 'center'
}

