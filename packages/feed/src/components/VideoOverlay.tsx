/**
 * VideoOverlay - Video information overlay (author, caption, hashtags)
 *
 * Displays video metadata over the video player
 * Uses design tokens from @vortex/core for styling
 */

'use client'

import { type CSSProperties } from 'react'
import type { Video } from '@vortex/core'
import {
  colors,
  spacing,
  fontSizes,
  fontWeights,
  shadows,
  radii,
  zIndices,
  mergeStyles,
} from '@vortex/core'

// =============================================================================
// TYPES
// =============================================================================

export interface VideoOverlayProps {
  /** Video data */
  video: Video
  /** Called when author is clicked */
  onAuthorClick?: () => void
  /** Whether timeline is expanded (affects bottom padding) */
  timelineExpanded?: boolean
  /** Custom styles override */
  style?: CSSProperties
  /** Custom className */
  className?: string
}

// =============================================================================
// STYLES
// =============================================================================

const overlayStyles = {
  container: {
    position: 'absolute' as const,
    bottom: 0,
    left: 0,
    right: 64, // Space for ActionBar (48px + 16px spacing)
    padding: spacing[4],
    paddingBottom: 'env(safe-area-inset-bottom, 16px)',
    zIndex: zIndices.base,
  } satisfies CSSProperties,

  containerWithTimeline: {
    paddingBottom: 'calc(env(safe-area-inset-bottom, 16px) + 48px)',
  } satisfies CSSProperties,

  authorButton: {
    display: 'flex',
    alignItems: 'center',
    gap: spacing[2],
    marginBottom: spacing[3],
    background: 'none',
    border: 'none',
    padding: 0,
    cursor: 'pointer',
  } satisfies CSSProperties,

  avatar: {
    width: 40,
    height: 40,
    borderRadius: radii.full,
    border: `2px solid ${colors.text}`,
    objectFit: 'cover' as const,
  } satisfies CSSProperties,

  username: {
    color: colors.text,
    fontWeight: fontWeights.semibold,
    fontSize: fontSizes.sm,
    textShadow: shadows.text,
  } satisfies CSSProperties,

  caption: {
    color: colors.text,
    fontSize: fontSizes.sm,
    lineHeight: 1.4,
    textShadow: shadows.text,
    display: '-webkit-box',
    WebkitLineClamp: 2,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    paddingBottom: spacing[1],
  } satisfies CSSProperties,

  author: {
    color: colors.text,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    textShadow: shadows.text,
    display: '-webkit-box',
    WebkitLineClamp: 1,
    WebkitBoxOrient: 'vertical' as const,
    overflow: 'hidden',
    paddingBottom: spacing[1],
  } satisfies CSSProperties,

  hashtags: {
    display: 'flex',
    flexWrap: 'wrap' as const,
    gap: spacing[1],
    marginTop: spacing[2],
    paddingBottom: spacing[1],
  } satisfies CSSProperties,

  hashtag: {
    color: colors.accent,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.medium,
    textShadow: shadows.text,
  } satisfies CSSProperties,
}

// =============================================================================
// COMPONENT
// =============================================================================

export function VideoOverlay({
  video,
  timelineExpanded = false,
  style,
  className = '',
}: VideoOverlayProps) {
  const containerStyles = mergeStyles(
    overlayStyles.container,
    timelineExpanded && overlayStyles.containerWithTimeline,
    style
  )

  return (
    <div style={containerStyles} className={className}>
      {/* Author */}
      {video.author && <p style={overlayStyles.author}>{video.author.displayName}</p>}

      {/* Caption */}
      {video.caption && <p style={overlayStyles.caption}>{video.caption}</p>}

      {/* Hashtags */}
      {video.hashtags && video.hashtags.length > 0 && (
        <div style={overlayStyles.hashtags}>
          {video.hashtags.slice(0, 3).map((tag, i) => (
            <span key={i} style={overlayStyles.hashtag}>
              #{tag}
            </span>
          ))}
        </div>
      )}
    </div>
  )
}

