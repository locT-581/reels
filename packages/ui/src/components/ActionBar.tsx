/**
 * ActionBar - Video action buttons (like, comment, share, save)
 *
 * Uses CSS Variables + Inline Styles for maximum customizability.
 * No Tailwind CSS dependency.
 */

'use client'

import { type CSSProperties, type ReactNode } from 'react'
import { motion } from 'motion/react'
import { colors, spacing, fontSizes, fontWeights, shadows, components, springs, mergeStyles } from '@xhub-reel/design-tokens'
import { formatCount } from '../utils'

export interface ActionBarProps {
  /** Like count */
  likeCount: number
  /** Comment count */
  commentCount: number
  /** Share count */
  shareCount: number
  /** Save count */
  saveCount?: number
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
  /** Profile avatar URL */
  avatarUrl?: string
  /** Called when profile is pressed */
  onProfileClick?: () => void
  /** Called when follow is pressed */
  onFollow?: () => void
  /** Whether user is followed */
  isFollowed?: boolean
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

export interface ProfileAvatarProps {
  /** Avatar URL */
  avatarUrl?: string
  /** Whether user is followed */
  isFollowed?: boolean
  /** Called when avatar is pressed */
  onClick?: () => void
  /** Called when follow button is pressed */
  onFollow?: () => void
}

// =============================================================================
// STYLES
// =============================================================================

const barStyles: CSSProperties = {
  position: 'absolute',
  right: spacing[4],
  bottom: 160, // Above safe area
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
  gap: components.actionBar.iconCountGap,
  background: 'none',
  border: 'none',
  padding: 0,
  cursor: 'pointer',
}

const iconWrapperStyles: CSSProperties = {
  width: components.actionBar.iconSize,
  height: components.actionBar.iconSize,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const countStyles: CSSProperties = {
  fontSize: fontSizes.xs,
  fontWeight: fontWeights.normal,
  color: colors.text,
  textShadow: shadows.text,
  lineHeight: components.actionBar.counterLineHeight,
  textAlign: 'center',
}

const profileContainerStyles: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  position: 'relative',
  width: components.profileAction.avatarSize,
  height: 55, // Avatar + follow button spacing
}

const avatarStyles: CSSProperties = {
  width: components.profileAction.avatarSize,
  height: components.profileAction.avatarSize,
  borderRadius: '50%',
  objectFit: 'cover',
  cursor: 'pointer',
  background: colors.surface,
}

const followButtonStyles: CSSProperties = {
  position: 'absolute',
  bottom: 0,
  left: '50%',
  transform: 'translateX(-50%)',
  width: components.profileAction.followButtonSize,
  height: components.profileAction.followButtonSize,
  borderRadius: '50%',
  backgroundColor: colors.like,
  border: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}

const HeartIcon = ({ filled, color = 'white' }: { filled?: boolean; color?: string }) => filled ? (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={components.actionBar.iconSize}
    height={components.actionBar.iconSize}
    viewBox="0 0 28 28"
    fill="none"
  >
    <path
      fillRule="evenodd"
      clipRule="evenodd"
      d="M1.74988 11.0538C1.74988 6.75595 4.69822 2.91699 9.20877 2.91699C11.4347 2.91699 12.9986 3.9593 13.9999 4.96978C15.0011 3.95929 16.565 2.91699 18.791 2.91699C23.3015 2.91699 26.2499 6.75595 26.2499 11.0538C26.2499 15.3962 23.6265 18.9036 20.8781 21.3587C18.1288 23.8145 15.1442 25.3171 14.1843 25.6371L13.9999 25.6985L13.8154 25.6371C12.8555 25.3171 9.87093 23.8145 7.12168 21.3587C4.37329 18.9036 1.74988 15.3962 1.74988 11.0538ZM17.7449 6.41699C17.2617 6.41699 16.8699 6.80874 16.8699 7.29199C16.8699 7.77524 17.2617 8.16699 17.7449 8.16699C19.6221 8.16699 20.9952 9.75855 20.9952 11.8241C20.9952 12.3073 21.387 12.6991 21.8702 12.6991C22.3535 12.6991 22.7452 12.3073 22.7452 11.8241C22.7452 9.02543 20.8066 6.41699 17.7449 6.41699Z"
      fill={color}
    />
  </svg>
) : (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={components.actionBar.iconSize}
    height={components.actionBar.iconSize}
    viewBox="0 0 24 24"
    fill="none"
  >
    <path d="M15.21 5.5C14.7957 5.5 14.46 5.83579 14.46 6.25C14.46 6.66421 14.7957 7 15.21 7C16.819 7 17.996 8.3642 17.996 10.1346C17.996 10.5488 18.3317 10.8846 18.746 10.8846C19.1602 10.8846 19.496 10.5488 19.496 10.1346C19.496 7.7358 17.8342 5.5 15.21 5.5Z" fill={color}/>
    <path fillRule="evenodd" clipRule="evenodd" d="M7.89327 2.25C3.85788 2.25 1.24994 5.6858 1.24994 9.47438C1.24994 13.301 3.5604 16.37 5.9378 18.4936C8.31629 20.6183 10.9036 21.9251 11.7628 22.2115L11.9999 22.2906L12.2371 22.2115C13.0963 21.9251 15.6836 20.6183 18.0621 18.4936C20.4395 16.37 22.7499 13.301 22.7499 9.47438C22.7499 5.6858 20.142 2.25 16.1066 2.25C14.2397 2.25 12.8941 3.06969 11.9999 3.91063C11.1058 3.06969 9.76018 2.25 7.89327 2.25ZM2.74994 9.47438C2.74994 6.3142 4.8731 3.75 7.89327 3.75C9.60588 3.75 10.7397 4.66987 11.4269 5.48383L11.9999 6.16259L12.573 5.48383C13.2602 4.66987 14.394 3.75 16.1066 3.75C19.1268 3.75 21.2499 6.3142 21.2499 9.47438C21.2499 12.6733 19.3104 15.3672 17.0628 17.375C15.0361 19.1854 12.8741 20.3336 11.9999 20.6978C11.1257 20.3336 8.96379 19.1854 6.93708 17.375C4.68948 15.3672 2.74994 12.6733 2.74994 9.47438Z" fill={color}/>
  </svg>
)

const CommentIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={components.actionBar.iconSize}
    height={components.actionBar.iconSize}
    viewBox="0 0 28 28"
    fill="none"
  >
    <path
      d="M14 1.45801C7.07347 1.45801 1.45837 7.0731 1.45837 13.9997C1.45837 16.3815 2.1232 18.6107 3.27778 20.5088L2.36541 23.0178C1.77294 24.6471 3.35258 26.2268 4.98188 25.6343L7.49089 24.7219C9.389 25.8765 11.6182 26.5413 14 26.5413C20.9266 26.5413 26.5417 20.9262 26.5417 13.9997C26.5417 7.0731 20.9266 1.45801 14 1.45801Z"
      fill="white"
    />
  </svg>
)

const BookmarkIcon = ({ filled }: { filled?: boolean }) => (
  <svg xmlns="http://www.w3.org/2000/svg" width={components.actionBar.iconSize} height={components.actionBar.iconSize} viewBox="0 0 28 28" fill="none">
    <path
      d="M16.6904 1.45801H11.2789C10.2487 1.458 9.4224 1.45799 8.75434 1.51253C8.06795 1.56857 7.47186 1.68652 6.92253 1.96632C6.90122 1.97718 6.88036 1.98891 6.86 2.00147C5.64436 2.75199 4.94533 3.52276 4.62739 4.64643C4.48015 5.1668 4.42512 5.72644 4.40084 6.3243C4.38332 6.75558 4.3811 7.24294 4.37866 7.77623C4.37775 7.97537 4.37678 8.18091 4.375 8.39232V24.8275C4.375 25.7739 5.14242 26.5413 6.08883 26.5413C6.51994 26.5413 6.93517 26.3792 7.25226 26.0859L13.3276 20.4783C13.3386 20.4682 13.3493 20.4578 13.3597 20.4471C13.5821 20.2197 13.743 20.0895 13.8601 20.0183C13.9156 19.9846 13.9524 19.9697 13.9731 19.9631C13.9833 19.9599 13.9898 19.9585 13.9933 19.958L13.9975 19.9575L13.9992 19.9574C13.9992 19.9574 14.0065 19.9571 14.0257 19.9632C14.0466 19.9698 14.0837 19.9849 14.1394 20.0187C14.2569 20.0901 14.4182 20.2206 14.641 20.4479C14.6512 20.4583 14.6616 20.4684 14.6724 20.4783L20.7477 26.0859C21.0648 26.3792 21.4801 26.5413 21.9112 26.5413C22.8576 26.5413 23.625 25.7739 23.625 24.8275V8.3619C23.625 7.33168 23.625 6.5054 23.5705 5.83735C23.5144 5.15096 23.3965 4.55487 23.1167 4.00554C23.1058 3.98416 23.094 3.96325 23.0814 3.94284C22.3309 2.72781 21.5599 2.0287 20.4364 1.71046C19.9159 1.56305 19.3562 1.50785 18.7583 1.48352C18.3245 1.46588 17.8344 1.46376 17.2978 1.46144C17.1014 1.46059 16.8988 1.45968 16.6904 1.45801Z"
      fill={filled ? colors.warning : 'white'}
    />
  </svg>
)

const ShareIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={28}
    height={28}
    viewBox="0 0 28 28"
    fill="none"
  >
    <path
      d="M20.6583 8.99195C21.1139 8.53634 21.1139 7.79765 20.6583 7.34203L14.8249 1.5087C14.6061 1.28991 14.3094 1.16699 14 1.16699C13.6905 1.16699 13.3938 1.28991 13.175 1.5087L7.34167 7.34204C6.88606 7.79765 6.88606 8.53634 7.34167 8.99195C7.79728 9.44756 8.53597 9.44756 8.99158 8.99195L12.8333 5.15024L12.8333 17.5003C12.8333 18.1447 13.3556 18.667 14 18.667C14.6443 18.667 15.1666 18.1447 15.1666 17.5003L15.1666 5.15024L19.0083 8.99195C19.4639 9.44756 20.2026 9.44756 20.6583 8.99195Z"
      fill="white"
    />
    <path
      d="M24.4562 22.2708C24.4991 21.7457 24.5 21.0663 24.5 20.067V16.3337C24.5 15.6893 25.0223 15.167 25.6666 15.167C26.311 15.167 26.8333 15.6893 26.8333 16.3337L26.8333 20.1152C26.8333 21.0543 26.8333 21.8294 26.7817 22.4608C26.7282 23.1166 26.6132 23.7194 26.3247 24.2856C25.8772 25.1637 25.1633 25.8776 24.2852 26.325C23.719 26.6135 23.1162 26.7285 22.4604 26.7821C21.829 26.8337 21.054 26.8337 20.1149 26.8337H7.88508C6.94599 26.8337 6.17087 26.8337 5.5395 26.7821C4.88372 26.7285 4.28089 26.6135 3.71467 26.325C2.83658 25.8776 2.12267 25.1637 1.67526 24.2856C1.38676 23.7194 1.27176 23.1166 1.21819 22.4608C1.1666 21.8294 1.16661 21.0543 1.16663 20.1152V16.3337C1.16663 15.6893 1.68896 15.167 2.33329 15.167C2.97762 15.167 3.49996 15.6893 3.49996 16.3337L3.49996 20.067C3.49996 21.0663 3.50087 21.7457 3.54377 22.2708C3.58556 22.7823 3.66131 23.0438 3.75428 23.2263C3.97798 23.6653 4.33494 24.0223 4.77398 24.246C4.95645 24.339 5.21802 24.4147 5.7295 24.4565C6.25461 24.4994 6.93395 24.5003 7.93329 24.5003H20.0666C21.066 24.5003 21.7453 24.4994 22.2704 24.4565C22.7819 24.4147 23.0435 24.339 23.2259 24.246C23.665 24.0223 24.0219 23.6653 24.2456 23.2263C24.3386 23.0438 24.4144 22.7823 24.4562 22.2708Z"
      fill="white"
    />
  </svg>
)

const PlusIcon = () => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="white"
  >
    <path
      d="M6 1V11M1 6H11"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
    />
  </svg>
)

const CheckIcon = () => (
  <svg
    width={12}
    height={12}
    viewBox="0 0 12 12"
    fill="none"
  >
    <path
      d="M2 6L5 9L10 3"
      stroke="white"
      strokeWidth={2}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
)

// =============================================================================
// PROFILE AVATAR COMPONENT
// =============================================================================

export function ProfileAvatar({
  avatarUrl,
  isFollowed = false,
  onClick,
  onFollow,
}: ProfileAvatarProps) {
  return (
    <div style={profileContainerStyles}>
      <motion.button
        style={{ background: 'none', border: 'none', padding: 0, cursor: 'pointer' }}
        onClick={onClick}
        whileTap={{ scale: 0.95 }}
        aria-label="View profile"
      >
        {avatarUrl ? (
          <img
            src={avatarUrl}
            alt="Profile"
            style={avatarStyles}
          />
        ) : (
          <div style={avatarStyles} />
        )}
      </motion.button>

      {!isFollowed && onFollow && (
        <motion.button
          style={followButtonStyles}
          onClick={(e) => {
            e.stopPropagation()
            onFollow()
          }}
          whileTap={{ scale: 0.9 }}
          animate={isFollowed ? { scale: [1, 1.2, 1] } : { scale: 1 }}
          transition={{ type: 'spring', ...springs.bouncy }}
          aria-label={isFollowed ? 'Following' : 'Follow'}
        >
          {isFollowed ? <CheckIcon /> : <PlusIcon />}
        </motion.button>
      )}
    </div>
  )
}

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
  saveCount,
  isLiked = false,
  isSaved = false,
  onLike,
  onComment,
  onShare,
  onSave,
  avatarUrl,
  onProfileClick,
  onFollow,
  isFollowed = false,
  style,
  className = '',
}: ActionBarProps) {
  return (
    <div style={mergeStyles(barStyles, style)} className={className}>
      {/* Profile Avatar */}
      {avatarUrl && (
        <ProfileAvatar
          avatarUrl={avatarUrl}
          isFollowed={isFollowed}
          onClick={onProfileClick}
          onFollow={onFollow}
        />
      )}

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

      {/* Save button */}
      <ActionButton
        icon={<BookmarkIcon filled={isSaved} />}
        count={saveCount}
        isActive={isSaved}
        onClick={onSave}
        label={isSaved ? 'Unsave' : 'Save'}
      />

      {/* Share button */}
      <ActionButton
        icon={<ShareIcon />}
        count={shareCount}
        onClick={onShare}
        label="Share"
      />
    </div>
  )
}
