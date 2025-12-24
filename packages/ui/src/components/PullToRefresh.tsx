/**
 * PullToRefresh - Pull down to refresh component
 *
 * Uses CSS Variables + Inline Styles for maximum customizability.
 * No Tailwind CSS dependency.
 */

'use client'

import { useRef, useState, useCallback, type ReactNode, type CSSProperties } from 'react'
import { colors, spacing, fontSizes, radii, durations, easings, mergeStyles } from '@xhub-reel/design-tokens'

export interface PullToRefreshProps {
  /** Content to render inside */
  children: ReactNode
  /** Called when refresh is triggered */
  onRefresh: () => void | Promise<void>
  /** Pull distance threshold to trigger refresh */
  threshold?: number
  /** Loading state */
  isLoading?: boolean
  /** Custom loading text */
  loadingText?: string
  /** Custom pull text */
  pullText?: string
  /** Custom release text */
  releaseText?: string
  /** Custom styles override */
  style?: CSSProperties
  /** Custom className (for external CSS if needed) */
  className?: string
}

// =============================================================================
// STYLES
// =============================================================================

const ptrStyles = {
  container: {
    position: 'relative' as const,
    width: '100%',
    height: '100%',
    overflow: 'hidden' as const,
  } satisfies CSSProperties,

  content: {
    width: '100%',
    height: '100%',
    transition: `transform ${durations.normal}ms ${easings.xhubReel}`,
  } satisfies CSSProperties,

  indicator: {
    position: 'absolute' as const,
    top: 0,
    left: 0,
    right: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    justifyContent: 'flex-end',
    paddingBottom: spacing[4],
    transform: 'translateY(-100%)',
  } satisfies CSSProperties,

  spinner: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderStyle: 'solid',
    borderColor: 'rgba(255, 255, 255, 0.3)',
    borderTopColor: colors.text,
    borderRadius: radii.full,
    animation: 'xhub-reel-spin 1s linear infinite',
  } satisfies CSSProperties,

  arrow: {
    width: 24,
    height: 24,
    transition: `transform ${durations.fast}ms ease`,
  } satisfies CSSProperties,

  text: {
    marginTop: spacing[2],
    fontSize: fontSizes.xs,
    color: colors.textSecondary,
  } satisfies CSSProperties,
}

// =============================================================================
// ICONS
// =============================================================================

const ArrowDownIcon = ({ rotate = false }: { rotate?: boolean }) => (
  <svg
    width={24}
    height={24}
    viewBox="0 0 24 24"
    fill="none"
    stroke={colors.text}
    strokeWidth={2}
    style={{
      ...ptrStyles.arrow,
      transform: rotate ? 'rotate(180deg)' : 'none',
    }}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <polyline points="19 12 12 19 5 12" />
  </svg>
)

// =============================================================================
// COMPONENT
// =============================================================================

export function PullToRefresh({
  children,
  onRefresh,
  threshold = 80,
  isLoading = false,
  loadingText = 'Đang làm mới...',
  pullText = 'Kéo để làm mới',
  releaseText = 'Thả để làm mới',
  style,
  className = '',
}: PullToRefreshProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [pullDistance, setPullDistance] = useState(0)
  const [isPulling, setIsPulling] = useState(false)
  const startY = useRef(0)

  const handleTouchStart = useCallback((e: React.TouchEvent) => {
    const scrollElement = containerRef.current
    if (!scrollElement || scrollElement.scrollTop > 0) return

    const touch = e.touches[0]
    if (!touch) return

    startY.current = touch.clientY
    setIsPulling(true)
  }, [])

  const handleTouchMove = useCallback((e: React.TouchEvent) => {
    if (!isPulling || isLoading) return

    const touch = e.touches[0]
    if (!touch) return

    const currentY = touch.clientY
    const distance = Math.max(0, currentY - startY.current)

    // Apply resistance after threshold
    const resistance = distance > threshold ? 0.3 : 0.5
    const adjustedDistance = distance * resistance

    setPullDistance(adjustedDistance)
  }, [isPulling, isLoading, threshold])

  const handleTouchEnd = useCallback(async () => {
    if (!isPulling) return

    setIsPulling(false)

    if (pullDistance >= threshold && !isLoading) {
      await onRefresh()
    }

    setPullDistance(0)
  }, [isPulling, pullDistance, threshold, isLoading, onRefresh])

  const isTriggered = pullDistance >= threshold
  const indicatorHeight = Math.min(pullDistance, threshold + 20)

  return (
    <div
      ref={containerRef}
      style={mergeStyles(ptrStyles.container, style)}
      className={className}
      onTouchStart={handleTouchStart}
      onTouchMove={handleTouchMove}
      onTouchEnd={handleTouchEnd}
    >
      {/* Inject keyframes */}
      <style>{`
        @keyframes xhub-reel-spin {
          to { transform: rotate(360deg); }
        }
      `}</style>

      {/* Pull indicator */}
      <div
        style={{
          ...ptrStyles.indicator,
          height: indicatorHeight,
          opacity: pullDistance > 0 ? 1 : 0,
        }}
      >
        {isLoading ? (
          <>
            <div style={ptrStyles.spinner} />
            <span style={ptrStyles.text}>{loadingText}</span>
          </>
        ) : (
          <>
            <ArrowDownIcon rotate={isTriggered} />
            <span style={ptrStyles.text}>
              {isTriggered ? releaseText : pullText}
            </span>
          </>
        )}
      </div>

      {/* Content */}
      <div
        style={{
          ...ptrStyles.content,
          transform: `translateY(${pullDistance}px)`,
        }}
      >
        {children}
      </div>
    </div>
  )
}

