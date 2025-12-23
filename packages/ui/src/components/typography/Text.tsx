/**
 * Text - Typography component
 *
 * Uses CSS Variables + Inline Styles for maximum customizability.
 * No Tailwind CSS dependency.
 */

'use client'

import { type CSSProperties, type ReactNode, type ElementType } from 'react'
import { colors, fontSizes, fontWeights, lineHeights, shadows, mergeStyles } from '@vortex/design-tokens'

export interface TextProps {
  /** Text content */
  children: ReactNode
  /** Typography variant */
  variant?: 'heading' | 'title' | 'body' | 'caption' | 'label'
  /** Text color */
  color?: 'default' | 'secondary' | 'muted' | 'accent' | 'error'
  /** Text alignment */
  align?: 'left' | 'center' | 'right'
  /** Font weight override */
  weight?: keyof typeof fontWeights
  /** Add video overlay shadow */
  withShadow?: boolean
  /** Truncate with ellipsis */
  truncate?: boolean
  /** Line clamp (requires truncate) */
  lineClamp?: number
  /** HTML element to render */
  as?: ElementType
  /** Custom styles override */
  style?: CSSProperties
  /** Custom className (for external CSS if needed) */
  className?: string
}

// =============================================================================
// STYLES
// =============================================================================

const variantStyles: Record<NonNullable<TextProps['variant']>, CSSProperties> = {
  heading: {
    fontSize: fontSizes['2xl'],
    fontWeight: fontWeights.bold,
    lineHeight: lineHeights.tight,
  },
  title: {
    fontSize: fontSizes.lg,
    fontWeight: fontWeights.semibold,
    lineHeight: lineHeights.snug,
  },
  body: {
    fontSize: fontSizes.md,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  },
  caption: {
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.normal,
    lineHeight: lineHeights.normal,
  },
  label: {
    fontSize: fontSizes.xs,
    fontWeight: fontWeights.medium,
    lineHeight: lineHeights.tight,
  },
}

const colorStyles: Record<NonNullable<TextProps['color']>, CSSProperties> = {
  default: { color: colors.text },
  secondary: { color: colors.textSecondary },
  muted: { color: colors.textMuted },
  accent: { color: colors.accent },
  error: { color: colors.error },
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Text({
  children,
  variant = 'body',
  color = 'default',
  align,
  weight,
  withShadow = false,
  truncate = false,
  lineClamp,
  as: Component = 'span',
  style,
  className = '',
}: TextProps) {
  const combinedStyles = mergeStyles(
    variantStyles[variant],
    colorStyles[color],
    align && { textAlign: align },
    weight && { fontWeight: fontWeights[weight] },
    withShadow && { textShadow: shadows.text },
    truncate && !lineClamp && {
      overflow: 'hidden',
      textOverflow: 'ellipsis',
      whiteSpace: 'nowrap',
    },
    (lineClamp !== undefined && lineClamp > 0) ? {
      display: '-webkit-box',
      WebkitLineClamp: lineClamp,
      WebkitBoxOrient: 'vertical',
      overflow: 'hidden',
    } : undefined,
    style
  )

  return (
    <Component style={combinedStyles} className={className}>
      {children}
    </Component>
  )
}
