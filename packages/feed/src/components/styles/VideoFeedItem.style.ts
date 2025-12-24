import { colors, radii, zIndices, easings, durations } from '@xhub-reel/core'
import type { CSSProperties } from 'react'

export const videoFeedItemStyles = {
  container: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    backgroundColor: colors.background,
  } satisfies CSSProperties,

  video: {
    position: 'absolute' as const,
    inset: 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover' as const,
  } satisfies CSSProperties,

  placeholder: {
    position: 'absolute' as const,
    inset: 0,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
  } satisfies CSSProperties,

  // Tap area for play/pause
  tapArea: {
    position: 'absolute' as const,
    inset: 0,
    zIndex: zIndices.base,
    cursor: 'pointer',
  } satisfies CSSProperties,

  // Pause overlay icon
  pauseOverlay: {
    position: 'absolute' as const,
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    zIndex: zIndices.overlay,
    pointerEvents: 'none' as const,
  } satisfies CSSProperties,

  pauseIconWrapper: {
    width: 80,
    height: 80,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    borderRadius: radii.full,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    backdropFilter: 'blur(8px)',
    transition: `opacity ${durations.normal}ms ${easings.xhubReel}, transform ${durations.normal}ms ${easings.xhubReel}`,
  } satisfies CSSProperties,
}
