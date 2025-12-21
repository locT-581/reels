/**
 * getGestureZone - Determine which zone of the screen was tapped
 */

export type GestureZone = 'left' | 'center' | 'right'

export function getGestureZone(event: PointerEvent | React.PointerEvent): GestureZone {
  const target = event.currentTarget as HTMLElement
  if (!target) return 'center'

  const rect = target.getBoundingClientRect()
  const x = (event as PointerEvent).clientX - rect.left
  const width = rect.width

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

