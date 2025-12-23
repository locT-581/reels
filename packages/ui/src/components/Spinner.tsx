/**
 * Spinner - Loading spinner component
 *
 * Uses CSS Variables + Inline Styles for maximum customizability.
 * No Tailwind CSS dependency.
 */

'use client'

import { type CSSProperties } from 'react'
import { colors, mergeStyles } from '@vortex/design-tokens'

export interface SpinnerProps {
  /** Spinner size in pixels */
  size?: number
  /** Spinner color */
  color?: string
  /** Border thickness */
  thickness?: number
  /** Custom styles override */
  style?: CSSProperties
  /** Custom className (for external CSS if needed) */
  className?: string
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Spinner({
  size = 24,
  color = colors.text,
  thickness = 2,
  style,
  className = '',
}: SpinnerProps) {
  return (
    <>
      {/* Inject keyframes if not already present */}
      <style>{`
        @keyframes vortex-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      <div
        role="status"
        aria-label="Loading"
        style={mergeStyles(
          {
            width: size,
            height: size,
            borderWidth: thickness,
            borderStyle: 'solid',
            borderColor: `${color}30`, // 30 = ~18% opacity
            borderTopColor: color,
            borderRadius: '50%',
            animation: 'vortex-spin 1s linear infinite',
          },
          style
        )}
        className={className}
      />
    </>
  )
}
