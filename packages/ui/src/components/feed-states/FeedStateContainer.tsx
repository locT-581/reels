/**
 * FeedStateContainer - Shared loading/error/empty states for video feeds
 *
 * Used by ConnectedVideoFeed and other feed variants
 * to display consistent state UI across the app.
 *
 * @example
 * ```tsx
 * import { FeedLoadingState, FeedErrorState, FeedEmptyState } from '@xhub-reel/ui'
 *
 * if (isLoading) return <FeedLoadingState />
 * if (error) return <FeedErrorState error={error} onRetry={refetch} />
 * if (videos.length === 0) return <FeedEmptyState />
 * ```
 */

'use client'

import { type CSSProperties, type ReactNode } from 'react'
import { colors, spacing, fontSizes, fontWeights, radii } from '@xhub-reel/design-tokens'

// =============================================================================
// STYLES (shared across all states)
// =============================================================================

export const feedStateStyles = {
  container: {
    position: 'fixed' as const,
    inset: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.background,
    color: colors.text,
    gap: spacing[4],
  } satisfies CSSProperties,

  spinner: {
    width: 40,
    height: 40,
    borderWidth: 3,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.2)',
    borderTopColor: colors.accent,
    borderRadius: radii.full,
    animation: 'xhub-reel-feed-spin 1s linear infinite',
  } satisfies CSSProperties,

  text: {
    fontSize: fontSizes.md,
    color: colors.textSecondary,
    textAlign: 'center' as const,
    maxWidth: 280,
    lineHeight: 1.5,
  } satisfies CSSProperties,

  button: {
    padding: `${spacing[3]}px ${spacing[6]}px`,
    backgroundColor: colors.accent,
    color: colors.text,
    border: 'none',
    borderRadius: radii.md,
    fontSize: fontSizes.sm,
    fontWeight: fontWeights.semibold,
    cursor: 'pointer',
    transition: 'opacity 0.2s',
  } satisfies CSSProperties,

  icon: {
    fontSize: 48,
    marginBottom: spacing[2],
  } satisfies CSSProperties,
}

// Keyframe animation (injected once)
const FeedStateKeyframes = () => (
  <style>{`
    @keyframes xhub-reel-feed-spin {
      to { transform: rotate(360deg); }
    }
  `}</style>
)

// =============================================================================
// LOADING STATE
// =============================================================================

export interface FeedLoadingStateProps {
  /** Custom loading message */
  message?: string
  /** Custom spinner element */
  spinner?: ReactNode
  /** Custom container style */
  style?: CSSProperties
  /** Custom className */
  className?: string
}

/**
 * FeedLoadingState - Displayed while feed is loading
 */
export function FeedLoadingState({
  message = 'Đang tải video...',
  spinner,
  style,
  className,
}: FeedLoadingStateProps) {
  return (
    <div style={{ ...feedStateStyles.container, ...style }} className={className}>
      <FeedStateKeyframes />
      {spinner ?? <div style={feedStateStyles.spinner} />}
      <p style={feedStateStyles.text}>{message}</p>
    </div>
  )
}

// =============================================================================
// ERROR STATE
// =============================================================================

export interface FeedErrorStateProps {
  /** Error object or message */
  error: Error | string
  /** Retry callback */
  onRetry?: () => void
  /** Custom retry button text */
  retryText?: string
  /** Custom icon */
  icon?: ReactNode
  /** Custom container style */
  style?: CSSProperties
  /** Custom className */
  className?: string
}

/**
 * FeedErrorState - Displayed when feed loading fails
 */
export function FeedErrorState({
  error,
  onRetry,
  retryText = 'Thử lại',
  icon = '😕',
  style,
  className,
}: FeedErrorStateProps) {
  const errorMessage = typeof error === 'string' ? error : error.message

  return (
    <div style={{ ...feedStateStyles.container, ...style }} className={className}>
      <div style={feedStateStyles.icon}>{icon}</div>
      <p style={feedStateStyles.text}>
        {errorMessage || 'Có lỗi xảy ra khi tải video'}
      </p>
      {onRetry && (
        <button
          style={feedStateStyles.button}
          onClick={onRetry}
          onMouseOver={(e) => { e.currentTarget.style.opacity = '0.8' }}
          onMouseOut={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          {retryText}
        </button>
      )}
    </div>
  )
}

// =============================================================================
// EMPTY STATE
// =============================================================================

export interface FeedEmptyStateProps {
  /** Custom message */
  message?: string
  /** Custom icon */
  icon?: ReactNode
  /** Custom action button */
  action?: {
    label: string
    onClick: () => void
  }
  /** Custom container style */
  style?: CSSProperties
  /** Custom className */
  className?: string
}

/**
 * FeedEmptyState - Displayed when feed has no videos
 */
export function FeedEmptyState({
  message = 'Không có video nào để hiển thị',
  icon = '📭',
  action,
  style,
  className,
}: FeedEmptyStateProps) {
  return (
    <div style={{ ...feedStateStyles.container, ...style }} className={className}>
      <div style={feedStateStyles.icon}>{icon}</div>
      <p style={feedStateStyles.text}>{message}</p>
      {action && (
        <button
          style={feedStateStyles.button}
          onClick={action.onClick}
          onMouseOver={(e) => { e.currentTarget.style.opacity = '0.8' }}
          onMouseOut={(e) => { e.currentTarget.style.opacity = '1' }}
        >
          {action.label}
        </button>
      )}
    </div>
  )
}

// =============================================================================
// NO CONFIG STATE
// =============================================================================

export interface FeedNoConfigStateProps {
  /** Custom message */
  message?: string
  /** Custom icon */
  icon?: ReactNode
  /** Custom container style */
  style?: CSSProperties
  /** Custom className */
  className?: string
}

/**
 * FeedNoConfigState - Displayed when API config is missing
 */
export function FeedNoConfigState({
  message = 'Chưa cấu hình API. Vui lòng wrap component trong XHubReelProvider với config hoặc truyền config prop.',
  icon = '⚠️',
  style,
  className,
}: FeedNoConfigStateProps) {
  return (
    <div style={{ ...feedStateStyles.container, ...style }} className={className}>
      <div style={feedStateStyles.icon}>{icon}</div>
      <p style={feedStateStyles.text}>{message}</p>
    </div>
  )
}

