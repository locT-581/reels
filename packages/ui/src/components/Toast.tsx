/**
 * Toast - Toast notification component
 *
 * Uses CSS Variables + Inline Styles for maximum customizability.
 * No Tailwind CSS dependency.
 */

'use client'

import { useEffect, type CSSProperties, type ReactNode } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { colors, radii, spacing, fontSizes, zIndices, springs, mergeStyles } from '@vortex/design-tokens'

export interface ToastProps {
  /** Toast message */
  message: ReactNode
  /** Whether the toast is visible */
  isVisible: boolean
  /** Called when toast should close */
  onClose: () => void
  /** Auto-hide duration in ms (0 = no auto-hide) */
  duration?: number
  /** Toast variant */
  variant?: 'default' | 'success' | 'error' | 'warning'
  /** Action button */
  action?: {
    label: string
    onClick: () => void
  }
  /** Position */
  position?: 'top' | 'bottom'
  /** Custom styles override */
  style?: CSSProperties
  /** Custom className (for external CSS if needed) */
  className?: string
}

// =============================================================================
// STYLES
// =============================================================================

const containerStyles: CSSProperties = {
  position: 'fixed',
  left: spacing[4],
  right: spacing[4],
  zIndex: zIndices.toast,
  display: 'flex',
  justifyContent: 'center',
  pointerEvents: 'none',
}

const toastStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: spacing[3],
  padding: `${spacing[3]}px ${spacing[4]}px`,
  backgroundColor: colors.surface,
  borderRadius: radii.lg,
  boxShadow: '0 4px 12px rgba(0, 0, 0, 0.5)',
  pointerEvents: 'auto',
  maxWidth: 400,
}

const variantStyles: Record<NonNullable<ToastProps['variant']>, CSSProperties> = {
  default: {},
  success: {
    borderLeft: `3px solid ${colors.success}`,
  },
  error: {
    borderLeft: `3px solid ${colors.error}`,
  },
  warning: {
    borderLeft: `3px solid ${colors.warning}`,
  },
}

const messageStyles: CSSProperties = {
  flex: 1,
  fontSize: fontSizes.sm,
  color: colors.text,
  lineHeight: 1.4,
}

const actionButtonStyles: CSSProperties = {
  padding: `${spacing[1]}px ${spacing[3]}px`,
  backgroundColor: 'transparent',
  border: 'none',
  color: colors.accent,
  fontSize: fontSizes.sm,
  fontWeight: 600,
  cursor: 'pointer',
  borderRadius: radii.sm,
}

// =============================================================================
// COMPONENT
// =============================================================================

export function Toast({
  message,
  isVisible,
  onClose,
  duration = 3000,
  variant = 'default',
  action,
  position = 'bottom',
  style,
  className = '',
}: ToastProps) {
  // Auto-hide
  useEffect(() => {
    if (isVisible && duration > 0) {
      const timer = setTimeout(onClose, duration)
      return () => clearTimeout(timer)
    }
  }, [isVisible, duration, onClose])

  const positionStyle: CSSProperties = position === 'top'
    ? { top: spacing[4] }
    : { bottom: spacing[4] + 80 } // Above bottom nav/safe area

  return (
    <AnimatePresence>
      {isVisible && (
        <div style={{ ...containerStyles, ...positionStyle }}>
          <motion.div
            initial={{ opacity: 0, y: position === 'top' ? -20 : 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: position === 'top' ? -20 : 20, scale: 0.95 }}
            transition={{ type: 'spring', ...springs.default }}
            style={mergeStyles(toastStyles, variantStyles[variant], style)}
            className={className}
          >
            <span style={messageStyles}>{message}</span>

            {action && (
              <button
                style={actionButtonStyles}
                onClick={() => {
                  action.onClick()
                  onClose()
                }}
              >
                {action.label}
              </button>
            )}
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
