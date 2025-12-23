/**
 * Avatar - User avatar component
 *
 * Uses CSS Variables + Inline Styles for maximum customizability.
 * No Tailwind CSS dependency.
 */

'use client'

import { useState, type CSSProperties } from 'react'
import { colors, components, mergeStyles } from '@vortex/design-tokens'

export interface AvatarProps {
  /** Image source URL */
  src?: string
  /** Alt text */
  alt: string
  /** Avatar size */
  size?: 'sm' | 'md' | 'lg' | 'xl'
  /** Show border (e.g., for following status) */
  showBorder?: boolean
  /** Border color */
  borderColor?: string
  /** Fallback when image fails to load */
  fallback?: string
  /** Click handler */
  onClick?: () => void
  /** Custom styles override */
  style?: CSSProperties
  /** Custom className (for external CSS if needed) */
  className?: string
}

// =============================================================================
// STYLES
// =============================================================================

const avatarSizes = components.avatar

const baseStyles: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  overflow: 'hidden',
  backgroundColor: colors.surface,
  flexShrink: 0,
}

const imageStyles: CSSProperties = {
  width: '100%',
  height: '100%',
  objectFit: 'cover',
}

const fallbackStyles: CSSProperties = {
  color: colors.textMuted,
  fontWeight: 600,
  textTransform: 'uppercase',
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Avatar({
  src,
  alt,
  size = 'md',
  showBorder = false,
  borderColor = colors.accent,
  fallback,
  onClick,
  style,
  className = '',
}: AvatarProps) {
  const [hasError, setHasError] = useState(false)
  const dimension = avatarSizes[size]

  // Generate initials from alt text
  const initials = fallback || alt
    .split(' ')
    .map((word) => word[0])
    .slice(0, 2)
    .join('')

  const containerStyles = mergeStyles(
    baseStyles,
    {
      width: dimension,
      height: dimension,
    },
    showBorder && {
      border: `2px solid ${borderColor}`,
    },
    onClick && {
      cursor: 'pointer',
    },
    style
  )

  return (
    <div
      style={containerStyles}
      className={className}
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
    >
      {src && !hasError ? (
        <img
          src={src}
          alt={alt}
          style={imageStyles}
          onError={() => setHasError(true)}
        />
      ) : (
        <span
          style={{
            ...fallbackStyles,
            fontSize: dimension / 2.5,
          }}
        >
          {initials}
        </span>
      )}
    </div>
  )
}
