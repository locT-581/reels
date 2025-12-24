/**
 * IconButton - Icon-only button component
 *
 * Uses CSS Variables + Inline Styles for maximum customizability.
 * No Tailwind CSS dependency.
 */

'use client'

import { forwardRef, type ButtonHTMLAttributes, type ReactNode, type CSSProperties } from 'react'
import { colors, radii, durations, easings, components, mergeStyles } from '@xhub-reel/design-tokens'

export interface IconButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Icon to display */
  icon: ReactNode
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Button variant */
  variant?: 'default' | 'ghost' | 'glass'
  /** Accessibility label (required for icon-only buttons) */
  'aria-label': string
  /** Custom styles override */
  style?: CSSProperties
}

// =============================================================================
// STYLES
// =============================================================================

const baseStyles: CSSProperties = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: 'none',
  cursor: 'pointer',
  borderRadius: radii.full,
  transitionProperty: 'background-color, transform, opacity',
  transitionDuration: durations.fast,
  transitionTimingFunction: easings.xhubReel,
  userSelect: 'none',
}

const sizeStyles: Record<NonNullable<IconButtonProps['size']>, CSSProperties> = {
  sm: {
    width: 32,
    height: 32,
  },
  md: {
    width: components.tapArea,
    height: components.tapArea,
  },
  lg: {
    width: 56,
    height: 56,
  },
}

const variantStyles: Record<NonNullable<IconButtonProps['variant']>, CSSProperties> = {
  default: {
    backgroundColor: colors.surface,
    color: colors.text,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.text,
  },
  glass: {
    backgroundColor: 'rgba(0, 0, 0, 0.2)',
    backdropFilter: 'blur(4px)',
    WebkitBackdropFilter: 'blur(4px)',
    color: colors.text,
  },
}

const disabledStyles: CSSProperties = {
  opacity: 0.5,
  cursor: 'not-allowed',
  pointerEvents: 'none',
}

// =============================================================================
// COMPONENT
// =============================================================================

export const IconButton = forwardRef<HTMLButtonElement, IconButtonProps>(
  (
    {
      icon,
      size = 'md',
      variant = 'ghost',
      disabled,
      style,
      className = '',
      ...props
    },
    ref
  ) => {
    return (
      <button
        ref={ref}
        type="button"
        disabled={disabled}
        style={mergeStyles(
          baseStyles,
          sizeStyles[size],
          variantStyles[variant],
          disabled && disabledStyles,
          style
        )}
        className={className}
        {...props}
      >
        {icon}
      </button>
    )
  }
)

IconButton.displayName = 'IconButton'
