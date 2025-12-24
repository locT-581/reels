/**
 * Button - Base button component
 *
 * Uses CSS Variables + Inline Styles for maximum customizability.
 * No Tailwind CSS dependency.
 */

'use client'

import { forwardRef, type ButtonHTMLAttributes, type CSSProperties } from 'react'
import { colors, spacing, radii, fontSizes, fontWeights, durations, easings, mergeStyles } from '@xhub-reel/design-tokens'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  /** Button variant */
  variant?: 'primary' | 'secondary' | 'ghost' | 'danger'
  /** Button size */
  size?: 'sm' | 'md' | 'lg'
  /** Full width button */
  fullWidth?: boolean
  /** Loading state */
  isLoading?: boolean
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
  fontWeight: fontWeights.medium,
  borderRadius: radii.lg,
  border: 'none',
  cursor: 'pointer',
  transitionProperty: 'background-color, color, transform, opacity',
  transitionDuration: durations.normal,
  transitionTimingFunction: easings.xhubReel,
  userSelect: 'none',
}

const variantStyles: Record<NonNullable<ButtonProps['variant']>, CSSProperties> = {
  primary: {
    backgroundColor: colors.accent,
    color: colors.white,
  },
  secondary: {
    backgroundColor: colors.surface,
    color: colors.text,
  },
  ghost: {
    backgroundColor: 'transparent',
    color: colors.text,
  },
  danger: {
    backgroundColor: colors.error,
    color: colors.white,
  },
}

const sizeStyles: Record<NonNullable<ButtonProps['size']>, CSSProperties> = {
  sm: {
    height: 32,
    paddingLeft: spacing[3],
    paddingRight: spacing[3],
    fontSize: fontSizes.sm,
    gap: spacing[1],
  },
  md: {
    height: 40,
    paddingLeft: spacing[4],
    paddingRight: spacing[4],
    fontSize: fontSizes.md,
    gap: spacing[2],
  },
  lg: {
    height: 48,
    paddingLeft: spacing[6],
    paddingRight: spacing[6],
    fontSize: fontSizes.md,
    gap: spacing[2],
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

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = 'primary',
      size = 'md',
      fullWidth = false,
      isLoading = false,
      disabled,
      children,
      style,
      className = '',
      ...props
    },
    ref
  ) => {
    const isDisabled = disabled || isLoading

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        style={mergeStyles(
          baseStyles,
          variantStyles[variant],
          sizeStyles[size],
          fullWidth && { width: '100%' },
          isDisabled && disabledStyles,
          style
        )}
        className={className}
        {...props}
      >
        {isLoading ? (
          <span
            style={{
              width: 16,
              height: 16,
              borderWidth: 2,
              borderStyle: 'solid',
              borderColor: 'currentColor',
              borderTopColor: 'transparent',
              borderRadius: '50%',
              animation: 'xhub-reel-spin 1s linear infinite',
            }}
          />
        ) : (
          children
        )}
      </button>
    )
  }
)

Button.displayName = 'Button'
