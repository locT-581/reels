/**
 * calculateSeekAmount - Convert drag distance to seek time
 */

import { DRAG } from '@vortex/core'

export function calculateSeekAmount(
  dragDistance: number,
  duration: number,
  ratio: number = DRAG.SEEK_RATIO
): number {
  // 1px drag = ratio seconds
  const seekAmount = dragDistance * ratio

  // Clamp to valid range
  return Math.max(-duration, Math.min(duration, seekAmount))
}

