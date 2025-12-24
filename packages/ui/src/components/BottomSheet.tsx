/**
 * BottomSheet - Bottom sheet modal component
 *
 * Uses CSS Variables + Inline Styles for maximum customizability.
 * No Tailwind CSS dependency.
 */

'use client'

import { useEffect, useCallback, type ReactNode, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { colors, radii, spacing, zIndices, springs, components, mergeStyles } from '@xhub-reel/design-tokens'

export interface BottomSheetProps {
  /** Whether the sheet is open */
  isOpen: boolean
  /** Called when sheet should close */
  onClose: () => void
  /** Sheet title */
  title?: string
  /** Sheet content */
  children: ReactNode
  /** Initial height (default: 60vh) */
  height?: string | number
  /** Maximum height (default: 90vh) */
  maxHeight?: string | number
  /** Show close button */
  showClose?: boolean
  /** Show drag handle */
  showHandle?: boolean
  /** Custom styles override */
  style?: CSSProperties
  /** Custom className (for external CSS if needed) */
  className?: string
}

// =============================================================================
// STYLES
// =============================================================================

const overlayStyles: CSSProperties = {
  position: 'fixed',
  inset: 0,
  backgroundColor: 'rgba(0, 0, 0, 0.6)',
  zIndex: zIndices.modal,
}

const sheetStyles: CSSProperties = {
  position: 'fixed',
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: colors.overlay,
  backdropFilter: 'blur(20px)',
  WebkitBackdropFilter: 'blur(20px)',
  borderTopLeftRadius: radii.xl,
  borderTopRightRadius: radii.xl,
  zIndex: zIndices.modal + 1,
  display: 'flex',
  flexDirection: 'column',
  maxHeight: '90vh',
}

const handleStyles: CSSProperties = {
  width: components.bottomSheet.handleWidth,
  height: components.bottomSheet.handleHeight,
  backgroundColor: 'rgba(255, 255, 255, 0.3)',
  borderRadius: 2,
  margin: '12px auto 0',
  flexShrink: 0,
}

const headerStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  padding: `${spacing[4]}px ${spacing[4]}px ${spacing[3]}px`,
  flexShrink: 0,
}

const titleStyles: CSSProperties = {
  fontSize: 18,
  fontWeight: 600,
  color: colors.text,
}

const closeButtonStyles: CSSProperties = {
  width: 32,
  height: 32,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: 'none',
  border: 'none',
  cursor: 'pointer',
  color: colors.textSecondary,
  borderRadius: '50%',
}

const contentStyles: CSSProperties = {
  flex: 1,
  overflow: 'auto',
  WebkitOverflowScrolling: 'touch',
}

// =============================================================================
// ICONS
// =============================================================================

const CloseIcon = () => (
  <svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={2}>
    <line x1="18" y1="6" x2="6" y2="18" />
    <line x1="6" y1="6" x2="18" y2="18" />
  </svg>
)

// =============================================================================
// COMPONENT
// =============================================================================

export function BottomSheet({
  isOpen,
  onClose,
  title,
  children,
  height = '60vh',
  maxHeight = '90vh',
  showClose = true,
  showHandle = true,
  style,
  className = '',
}: BottomSheetProps) {
  // Close on escape key
  const handleKeyDown = useCallback(
    (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        onClose()
      }
    },
    [onClose]
  )

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown)
      document.body.style.overflow = 'hidden'
    }
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      document.body.style.overflow = ''
    }
  }, [isOpen, handleKeyDown])

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={overlayStyles}
            onClick={onClose}
          />

          {/* Sheet */}
          <motion.div
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ type: 'spring', ...springs.default }}
            drag="y"
            dragConstraints={{ top: 0, bottom: 0 }}
            dragElastic={{ top: 0, bottom: 0.5 }}
            onDragEnd={(_, info) => {
              if (info.offset.y > 100 || info.velocity.y > 500) {
                onClose()
              }
            }}
            style={mergeStyles(
              sheetStyles,
              { height, maxHeight, touchAction: 'none' },
              style
            )}
            className={className}
          >
            {/* Drag handle */}
            {showHandle && <div style={handleStyles} />}

            {/* Header */}
            {(title || showClose) && (
              <div style={headerStyles}>
                <span style={titleStyles}>{title}</span>
                {showClose && (
                  <button
                    style={closeButtonStyles}
                    onClick={onClose}
                    aria-label="Close"
                  >
                    <CloseIcon />
                  </button>
                )}
              </div>
            )}

            {/* Content */}
            <div style={contentStyles}>
              {children}
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  )
}
