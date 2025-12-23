/**
 * ActionBar - Video action buttons (like, comment, share, save)
 *
 * Uses CSS Variables + Inline Styles for maximum customizability.
 * No Tailwind CSS dependency.
 */

'use client'

import { type CSSProperties, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { colors, spacing, fontSizes, fontWeights, shadows, components, springs, mergeStyles } from '@vortex/design-tokens'
import { formatCount } from '../utils'

export interface ActionBarProps {
  /** Like count */
  likeCount: number
  /** Comment count */
  commentCount: number
  /** Share count */
  shareCount: number
  /** Whether video is liked */
  isLiked?: boolean
  /** Whether video is saved */
  isSaved?: boolean
  /** Called when like is pressed */
  onLike?: () => void
  /** Called when comment is pressed */
  onComment?: () => void
  /** Called when share is pressed */
  onShare?: () => void
  /** Called when save is pressed */
  onSave?: () => void
  /** Custom styles override */
  style?: CSSProperties
  /** Custom className (for external CSS if needed) */
  className?: string
}

export interface ActionButtonProps {
  /** Icon to display */
  icon: ReactNode
  /** Count to display */
  count?: number
  /** Whether action is active */
  isActive?: boolean
  /** Active color */
  activeColor?: string
  /** Click handler */
  onClick?: () => void
  /** Accessibility label */
  label: string
}

// =============================================================================
// STYLES
// =============================================================================

const barStyles: CSSProperties = {
  position: 'absolute',
  right: spacing[3],
  bottom: 128, // Above safe area
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: components.actionBar.gap,
  zIndex: 10,
}

const buttonStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  gap: spacing[1],
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
}

const iconWrapperStyles: CSSProperties = {
  width: components.tapArea,
  height: components.tapArea,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  borderRadius: '50%',
  backgroundColor: 'rgba(0, 0, 0, 0.2)',
  backdropFilter: 'blur(4px)',
  WebkitBackdropFilter: 'blur(4px)',
}

const countStyles: CSSProperties = {
  fontSize: fontSizes.xs,
  fontWeight: fontWeights.medium,
  color: colors.text,
  textShadow: shadows.text,
}

// =============================================================================
// ICONS
// =============================================================================

const HeartIcon = ({ filled, color = 'white' }: { filled?: boolean; color?: string }) => (
  <svg
    width={components.actionBar.iconSize}
    height={components.actionBar.iconSize}
    viewBox="0 0 24 24"
    fill={filled ? color : 'none'}
    stroke={color}
    strokeWidth={2}
  >
    <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />
  </svg>
)

const CommentIcon = () => (
  <svg
    width={components.actionBar.iconSize}
    height={components.actionBar.iconSize}
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth={2}
  >
    <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
  </svg>
)

const ShareIcon = () => (
  <svg
    width={components.actionBar.iconSize}
    height={components.actionBar.iconSize}
    viewBox="0 0 24 24"
    fill="none"
    stroke="white"
    strokeWidth={2}
  >
    <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
    <polyline points="16 6 12 2 8 6" />
    <line x1="12" y1="2" x2="12" y2="15" />
  </svg>
)

const BookmarkIcon = ({ filled }: { filled?: boolean }) => (
  <svg
    width={components.actionBar.iconSize}
    height={components.actionBar.iconSize}
    viewBox="0 0 24 24"
    fill={filled ? colors.accent : 'none'}
    stroke={filled ? colors.accent : 'white'}
    strokeWidth={2}
  >
    <path d="M19 21l-7-5-7 5V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2z" />
  </svg>
)

// =============================================================================
// ACTION BUTTON COMPONENT
// =============================================================================

export function ActionButton({
  icon,
  count,
  isActive = false,
  onClick,
  label,
}: ActionButtonProps) {
  return (
    <motion.button
      style={buttonStyles}
      onClick={onClick}
      aria-label={label}
      whileTap={{ scale: 0.9 }}
      transition={{ type: 'spring', ...springs.bouncy }}
    >
      <motion.div
        style={iconWrapperStyles}
        animate={isActive ? { scale: [1, 1.2, 1] } : { scale: 1 }}
        transition={isActive ? { duration: 0.3, ease: [0.32, 0.72, 0, 1] } : { type: 'spring', ...springs.default }}
      >
        {icon}
      </motion.div>
      {count !== undefined && (
        <span style={countStyles}>{formatCount(count)}</span>
      )}
    </motion.button>
  )
}

// =============================================================================
// ACTION BAR COMPONENT
// =============================================================================

export function ActionBar({
  likeCount,
  commentCount,
  shareCount,
  isLiked = false,
  isSaved = false,
  onLike,
  onComment,
  onShare,
  onSave,
  style,
  className = '',
}: ActionBarProps) {
  return (
    <div style={mergeStyles(barStyles, style)} className={className}>
      {/* Like button */}
      <ActionButton
        icon={<HeartIcon filled={isLiked} color={isLiked ? colors.like : 'white'} />}
        count={likeCount}
        isActive={isLiked}
        onClick={onLike}
        label={isLiked ? 'Unlike' : 'Like'}
      />

      {/* Comment button */}
      <ActionButton
        icon={<CommentIcon />}
        count={commentCount}
        onClick={onComment}
        label="Comments"
      />

      {/* Share button */}
      <ActionButton
        icon={<ShareIcon />}
        count={shareCount}
        onClick={onShare}
        label="Share"
      />

      {/* Save button */}
      <ActionButton
        icon={<BookmarkIcon filled={isSaved} />}
        isActive={isSaved}
        onClick={onSave}
        label={isSaved ? 'Unsave' : 'Save'}
      />
    </div>
  )
}
