/**
 * PlayPauseOverlay - Play/pause indicator overlay with optional interactivity
 *
 * Features:
 * - Display-only mode (show prop controls visibility)
 * - Interactive mode (onToggle prop for click handling)
 * - Auto-hide after state changes
 * - Multiple size presets
 * - CSS-in-JS styles (no Tailwind dependency)
 */

'use client'

import { useEffect, useState, useCallback, type CSSProperties } from 'react'
import { motion, AnimatePresence } from 'motion/react'
import { colors, zIndices, springs, mergeStyles } from '@xhub-reel/design-tokens'

export interface PlayPauseOverlayProps {
  /** Whether video is playing */
  isPlaying: boolean
  /**
   * Whether to show the overlay.
   * If not provided, visibility is controlled by autoHideDelay.
   */
  show?: boolean
  /** Called when overlay is clicked (makes it interactive) */
  onToggle?: () => void
  /** Icon size in pixels (default: 72) */
  size?: number
  /** Auto-hide after duration in ms (default: 1000, 0 = no auto-hide) */
  autoHideDelay?: number
  /** Show immediately on isPlaying state change (default: true) */
  showOnStateChange?: boolean
  /** Custom styles override */
  style?: CSSProperties
  /** Custom className (for external CSS if needed) */
  className?: string
}

// =============================================================================
// STYLES
// =============================================================================

const overlayStyles: CSSProperties = {
  position: 'absolute',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  zIndex: zIndices.overlay,
}

const iconContainerStyles: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  backgroundColor: 'rgba(0, 0, 0, 0.5)',
  borderRadius: '50%',
  backdropFilter: 'blur(8px)',
  WebkitBackdropFilter: 'blur(8px)',
  cursor: 'pointer',
}

// =============================================================================
// ICONS (Inline SVG)
// =============================================================================

const PlayIcon = ({ size }: { size: number }) => (
  <svg
    width={size * 0.4}
    height={size * 0.4}
    viewBox="0 0 24 24"
    fill={colors.text}
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
)

const PauseIcon = ({ size }: { size: number }) => (
  <svg
    width={size * 0.35}
    height={size * 0.35}
    viewBox="0 0 24 24"
    fill={colors.text}
  >
    <rect x="6" y="4" width="4" height="16" />
    <rect x="14" y="4" width="4" height="16" />
  </svg>
)

// =============================================================================
// MAIN COMPONENT
// =============================================================================

export function PlayPauseOverlay({
  isPlaying,
  show: showProp,
  onToggle,
  size = 72,
  autoHideDelay = 1000,
  showOnStateChange = true,
  style,
  className = '',
}: PlayPauseOverlayProps) {
  const [internalShow, setInternalShow] = useState(false)
  const [hasInteracted, setHasInteracted] = useState(false)

  // Determine if we're in controlled mode (show prop provided) or internal mode
  const isControlled = showProp !== undefined
  const isVisible = isControlled ? showProp : internalShow

  // Handle auto-show on state change (for interactive mode)
  useEffect(() => {
    if (isControlled || !showOnStateChange || !hasInteracted) return

    setInternalShow(true)

    if (autoHideDelay > 0) {
      const timer = setTimeout(() => {
        setInternalShow(false)
      }, autoHideDelay)

      return () => clearTimeout(timer)
    }
  }, [isPlaying, isControlled, showOnStateChange, autoHideDelay, hasInteracted])

  // Handle click
  const handleClick = useCallback(() => {
    if (!onToggle) return

    setHasInteracted(true)
    setInternalShow(true)
    onToggle()
  }, [onToggle])

  // Determine pointer-events based on interactivity
  const isInteractive = !!onToggle
  const pointerEvents = isInteractive ? 'auto' : 'none'

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.15 }}
          style={mergeStyles(overlayStyles, { pointerEvents }, style)}
          className={className}
          onClick={handleClick}
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: 'spring', ...springs.default }}
            whileTap={isInteractive ? { scale: 0.9 } : undefined}
            style={{
              ...iconContainerStyles,
              width: size,
              height: size,
              cursor: isInteractive ? 'pointer' : 'default',
            }}
          >
            {isPlaying ? (
              <PauseIcon size={size} />
            ) : (
              <PlayIcon size={size} />
            )}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
